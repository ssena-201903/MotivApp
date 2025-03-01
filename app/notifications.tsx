import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { CustomText } from "@/CustomText";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase.config";
import FriendRequestCard from "@/components/cards/FriendRequestCard";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { showMessage } from "react-native-flash-message";

const { width } = Dimensions.get("window");

type Props = {
  onDiamondPress: () => void;
  onDatePress: () => void;
};

export default function NotificationPage({
  onDiamondPress,
  onDatePress,
}: Props) {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    if (!currentUserId) return;
    
    loadFriendRequests();
    
    // Optional: Real-time updates for friend requests
    const requestsRef = collection(db, "friendRequests");
    const q = query(
      requestsRef,
      where("receiverId", "==", currentUserId),
      where("status", "==", "pending")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests: any = [];
      snapshot.forEach((doc) => {
        requests.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setFriendRequests(requests);
      setLoading(false);
    }, (error) => {
      console.error("Error in friend requests listener:", error);
      setLoading(false);
      showMessage({
        message: "Bildirimler yüklenirken bir hata oluştu!",
        type: "danger",
      });
    });
    
    return () => unsubscribe();
  }, [currentUserId]);

  const loadFriendRequests = async () => {
    try {
      const requestsRef = collection(db, "friendRequests");
      const q = query(
        requestsRef,
        where("receiverId", "==", currentUserId),
        where("status", "==", "pending")
      );
      
      const snapshot = await getDocs(q);
      const requests: any = [];
      
      snapshot.forEach((doc) => {
        requests.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setFriendRequests(requests);
    } catch (error) {
      console.error("Error loading friend requests:", error);
      showMessage({
        message: "Arkadaşlık istekleri yüklenirken bir hata oluştu!",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = (requestId: string) => {
    // Remove the request from the list
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A5F" />
        </View>
      ) : friendRequests.length > 0 ? (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.sectionContainer}>
            <CustomText
              type="semibold" 
              fontSize={16} 
              color="#1E3A5F"
              style={styles.sectionTitle}
            >
              Arkadaşlık İstekleri
            </CustomText>
            
            {friendRequests.map((request: any) => (
              <FriendRequestCard
                key={request.id}
                request={request}
                onAccept={() => handleRequestAction(request.id)}
                onReject={() => handleRequestAction(request.id)}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <CustomText type="medium" fontSize={14} color="#666">
            Şu anda bekleyen bildiriminiz bulunmamaktadır.
          </CustomText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});