import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Text,
} from "react-native";
import TopBar from "@/components/cards/TopBar";
import CustomButton from "@/components/CustomButton";
import HomeSection from "@/components/HomeSection";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AddTodoModal from "@/components/modals/AddTodoModal";
import { auth } from "@/firebase.config"; // Firebase auth import

const { width } = Dimensions.get("window");

export default function Home() {
  const [isMemoryModalVisible, setIsMemoryModalVisible] = useState(false);
  const [isAddTodoModalVisible, setIsAddTodoModalVisible] = useState(false);
  const [entryMemory, setEntryMemory] = useState("");
  
  // Kullanıcı ID'sini auth'dan alıyoruz
  const userId = auth.currentUser?.uid;

  const handleSaveMemory = () => {
    console.log("memory: ", entryMemory);
    setIsMemoryModalVisible(false);
    setEntryMemory("");
  };

  // AddTodoModal'ı kapatmak için handler
  const handleCloseTodoModal = () => {
    setIsAddTodoModalVisible(false);
  };

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

      <Modal
        transparent={true}
        visible={isMemoryModalVisible}
        animationType="fade"
        onRequestClose={() => setIsMemoryModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setIsMemoryModalVisible(false)}
        >
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.topMemoryCard}>
                  <Ionicons name="diamond" color="#264653" size={20} />
                  <Text style={styles.headerMemoryCard}>
                    Save Your Diamond Moment
                  </Text>
                </View>
                <Text style={styles.textMemoryCard}>
                  We'll show your saved memories at the end of each month and
                  year in a timeline
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Write your memory..."
                  value={entryMemory}
                  onChangeText={setEntryMemory}
                  multiline={true}
                />
                <CustomButton
                  label="Save"
                  onPress={handleSaveMemory}
                  variant="fill"
                  width={480}
                  height={40}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FCFCFC",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  topMemoryCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerMemoryCard: {
    color: "#264653",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  textMemoryCard: {
    color: "#264653",
    opacity: 0.5,
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 20,
    textAlign: "center",
  },
  textInput: {
    display: "flex",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(38, 70, 83, 0.3)",
    opacity: 0.6,
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
    height: 180,
    width: "100%",
    textAlign: "left",
    textAlignVertical: "top",
  },
});