import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../CustomButton";
import { db } from "@/firebase.config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const { width } = Dimensions.get('window');

interface AddMemoryModalProps {
  visible: boolean;
  selectedDate?: string;
  onClose: () => void;
  userId: string;
}

export default function AddMemoryModal({
  visible,
  selectedDate,
  onClose,
  userId,
}: AddMemoryModalProps) {
  const [memoryText, setMemoryText] = useState("");

  const handleSaveMemory = async () => {
    if (memoryText.trim()) {
      try {
        // pushing data to collection of memories
        const memoryDate = selectedDate || serverTimestamp();

        const memoriesRef = collection(db, "users", userId, "memories");
        await addDoc(memoriesRef, {
          memory: memoryText,
          createdAt: memoryDate,
        });

        setMemoryText("");
        onClose();
      } catch (error) {
        console.error("Error adding memory: ", error);
      }
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.topMemoryCard}>
                <Ionicons name="sparkles" color="#264653" size={20} />
                <Text style={styles.headerMemoryCard}>
                  Save Your Sparkle Moment
                </Text>
              </View>
              <Text style={styles.textMemoryCard}>
                We'll show your saved memories at the end of each month and year
                in a timeline
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Write your memory..."
                value={memoryText}
                onChangeText={setMemoryText}
                multiline={true}
              />
              <TouchableOpacity style={styles.modelButton}>
                <CustomButton
                  label="Save"
                  onPress={handleSaveMemory}
                  variant="fill"
                  width={120}
                  height={50}
                />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width > 760 ? width - 700 : width - 40,
    backgroundColor: "#FCFCFC",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
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
  modelButton: {
    margin: 0,
  },
});
