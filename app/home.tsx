import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import TopBar from "@/components/cards/TopBar";
import CustomButton from "@/components/CustomButton";
import HomeSection from "@/components/HomeSection";
import { useState } from "react";
import AddTodoModal from "@/components/modals/AddTodoModal";
import { auth } from "@/firebase.config";
import AddMemoryModal from "@/components/modals/AddMemoryModal";

export default function Home() {
  const [isMemoryModalVisible, setIsMemoryModalVisible] = useState(false);
  const [isAddTodoModalVisible, setIsAddTodoModalVisible] = useState(false);
  
  // getting current user id from auth
  const userId = auth.currentUser?.uid;

  // handle close modals
  const handleCloseTodoModal = () => {
    setIsAddTodoModalVisible(false);
  };

  const handleCloseMemoryModal = () => {
    setIsMemoryModalVisible(false);
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <TopBar 
          onDiamondPress={() => setIsMemoryModalVisible(true)} 
          onDatePress={() => setIsAddTodoModalVisible(true)}
        />
        <HomeSection variant="goals" />
        <HomeSection variant="habits" />
        <HomeSection variant="todos" />
      </View>

      {/* when user press diamond icon to add new memory */}
      {userId && (
        <AddMemoryModal
          visible={isMemoryModalVisible}
          onClose={handleCloseMemoryModal}
          userId={userId}
        />
      )}
      {/* when user press date card to add new todo */}
      {userId && (
        <AddTodoModal
          visible={isAddTodoModalVisible}
          onClose={handleCloseTodoModal}
          userId={userId}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#FCFCFC",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#FCFCFC",
  },
});