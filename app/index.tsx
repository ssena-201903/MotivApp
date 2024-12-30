import { View, StyleSheet, ScrollView, Dimensions, Modal, TouchableWithoutFeedback, TextInput, Button } from "react-native";
import TopBar from "@/components/cards/TopBar";
import DailyText from "@/components/cards/DailyText";
import DateTodos from "@/components/DateTodos";
import CustomButton from "@/components/CustomButton";
import SectionHeader from "@/components/headers/SectionHeader";
import CardTodo from "@/components/cards/CardTodo";
import CardGoal from "@/components/cards/CardGoal";
import CardHabit from "@/components/cards/CardHabit";
import HomeSection from "@/components/HomeSection";
import { useState } from "react";

const { width } = Dimensions.get("window");

export default function Index() {
  const [isMemoryModalVisible, setIsMemoryModalVisible] = useState(false);
  const [entryMemory, setEntryMemory] = useState("");

  const handleSaveMemory = () => {
    console.log("memory: ", entryMemory);
    setIsMemoryModalVisible(false);
    setEntryMemory("");
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <TopBar onDiamondPress={() => setIsMemoryModalVisible(true)} />
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
        <TouchableWithoutFeedback onPress={() => setIsMemoryModalVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Record a diamond memory..."
                  value={entryMemory}
                  onChangeText={setEntryMemory}
                />
                {/* <Button title="Save" onPress={handleSaveMemory}/> */}
                <CustomButton label="Save" onPress={handleSaveMemory} variant="fill"/>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    backgroundColor: "#FCFCFC", // can change later
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
  },
  textInput: {
    display: "flex",
    borderWidth: 1,
    borderColor: "#264653",
    opacity: 0.6,
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
    height: 180, // can change later
  },
});
