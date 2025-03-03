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
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { showMessage } from "react-native-flash-message";
import NotificationRequestAcceptCard from "@/components/cards/NotificationRequestAcceptCard";
import RecommendationCard from "@/components/cards/RecommendationCard";

const { width } = Dimensions.get("window");

export default function NotificationPage() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [recommendations, setRecommendations] = useState<any>([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    if (!currentUserId) return;

    // 1️⃣ Arkadaşlık istekleri için snapshot listener
    const friendRequestsRef = collection(db, "friendRequests");
    const friendRequestsQuery = query(
      friendRequestsRef,
      where("receiverId", "==", currentUserId),
      where("status", "==", "pending")
    );

    const unsubscribeFriendRequests = onSnapshot(
      friendRequestsQuery,
      (snapshot) => {
        const requests: any = [];
        snapshot.forEach((doc) => {
          requests.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setFriendRequests(requests);
        setLoading(false);
      },
      (error) => {
        console.error("Error in friend requests listener:", error);
        showMessage({
          message: "Arkadaşlık istekleri yüklenirken bir hata oluştu!",
          type: "danger",
        });
        setLoading(false);
      }
    );

    // 2️⃣ Bildirimler için snapshot listener
    const notificationsRef = collection(db, "notifications");
    const notificationsQuery = query(
      notificationsRef,
      where("relatedUserId", "==", currentUserId)
    );

    const unsubscribeNotifications = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notificationsData: any = [];
        snapshot.forEach((doc) => {
          notificationsData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setNotifications(notificationsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error in notifications listener:", error);
        showMessage({
          message: "Bildirimler yüklenirken bir hata oluştu!",
          type: "danger",
        });
        setLoading(false);
      }
    );

    // 3️⃣ Tavsiyeler için snapshot listener
    const loadRecommendations = async () => {
      try {
        const friendshipsRef = collection(db, "friendships");
        const friendshipsQuery = query(
          friendshipsRef,
          where("participants", "array-contains", currentUserId)
        );

        const friendshipsSnapshot = await getDocs(friendshipsQuery);
        const recommendationsData: any = [];

        for (const friendshipDoc of friendshipsSnapshot.docs) {
          const friendshipData = friendshipDoc.data();
          const recommendationsRef = collection(
            friendshipDoc.ref,
            "recommendations"
          );
          const recommendationsQuery = query(
            recommendationsRef,
            where("receiverId", "==", currentUserId)
          );

          const recommendationsSnapshot = await getDocs(recommendationsQuery);
          recommendationsSnapshot.forEach((doc) => {
            recommendationsData.push({
              id: doc.id,
              ...doc.data(),
              senderNickname:
                friendshipData.senderId === currentUserId
                  ? friendshipData.receiverNickname
                  : friendshipData.senderNickname,
            });
          });
        }

        // console.log("recommendationsData:", recommendationsData);
        setRecommendations(recommendationsData);
        // console.log("recommendationsData:", recommendations);
      } catch (error) {
        console.error("Error loading recommendations:", error);
        showMessage({
          message: "Tavsiyeler yüklenirken bir hata oluştu!",
          type: "danger",
        });
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();

    // Cleanup fonksiyonu (Component unmount olunca dinleyicileri kaldır)
    return () => {
      unsubscribeFriendRequests();
      unsubscribeNotifications();
    };
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
          ...doc.data(),
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

  const loadNotifications = async () => {
    try {
      console.log("currentUserId:", currentUserId);
      const notificationsRef = collection(db, "notifications");
      const q = query(
        notificationsRef,
        where("type", "==", "friendRequestAccepted"),
        where("relatedUserId", "==", currentUserId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      console.log("Notifications Snapshot:", snapshot);

      const notifications: any = [];

      snapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setNotifications(notifications);
    } catch (error) {}
  };

  const handleRequestAction = (requestId: string) => {
    // Remove the request from the list
    setFriendRequests(friendRequests.filter((req) => req.id !== requestId));
  };

  const handleRemoveNotification = async (notificationId: string) => {
    // console.log("Silme işlemi başlatıldı. Notification ID:", notificationId);

    try {
      const notificationRef = doc(db, "notifications", notificationId);

      const snapshot = await getDoc(notificationRef);
      if (!snapshot.exists()) {
        console.log("Bildirim zaten yok. Firestore'dan silinmiş olabilir.");
        return;
      }

      await deleteDoc(notificationRef);
      // console.log("Bildirim Firestore'dan başarıyla silindi.");

      // State'ten de kaldır
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== notificationId)
      );
    } catch (error) {
      // console.error("Bildirim silinirken hata oluştu:", error);
      showMessage({
        message: "Bildirim silinirken bir hata oluştu!",
        type: "danger",
      });
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A5F" />
        </View>
      ) : friendRequests.length > 0 ||
        notifications.length > 0 ||
        recommendations.length > 0 ? (
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

          <View style={styles.sectionContainer}>
            <CustomText
              type="semibold"
              fontSize={16}
              color="#1E3A5F"
              style={styles.sectionTitle}
            >
              Bildirimler
            </CustomText>

            {notifications.map((notification: any) => (
              <NotificationRequestAcceptCard
                key={notification.id}
                item={notification}
                onRead={() => handleRemoveNotification(notification.id)}
              />
            ))}

            {/* Tavsiyeler */}
            <View style={styles.sectionContainer}>
              <CustomText
                type="semibold"
                fontSize={16}
                color="#1E3A5F"
                style={styles.sectionTitle}
              >
                Tavsiyeler
              </CustomText>

              {recommendations.map((recommendation: any) => (
                <RecommendationCard
                  key={recommendation.id}
                  goal={recommendation}
                />
              ))}
            </View>
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
