import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { CustomText } from "@/CustomText";
import CustomButton from "../CustomButton";
import { db } from "@/firebase.config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 

interface AddTodoModalProps {
  visible: boolean;
  selectedDate?: string;
  onClose: () => void;
  userId: string; 
}

export default function AddTodoModal({
  visible,
  selectedDate,
  onClose,
  userId,
}: AddTodoModalProps) {
  const [todoText, setTodoText] = useState("");

  const handleAdd = async () => {
    if (todoText.trim()) {
      try {
        // current data
        const dueDate = selectedDate || new Date().toISOString().split("T")[0]; 

        // pushing data to firestore
        const todosRef = collection(db, "users", userId, "todos");
        await addDoc(todosRef, {
          text: todoText,
          dueDate: dueDate,
          isDone: false, 
          createdAt: serverTimestamp(), // created time
        });

        setTodoText(""); // clear input
        onClose(); // to close modal
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose} 
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <CustomText style={styles.modalHeader}>
            {selectedDate ? `${selectedDate}` : "Add New Todo"}
          </CustomText>
          <TextInput
            style={styles.modalInput}
            value={todoText}
            onChangeText={setTodoText} 
            placeholder="Write New Todo"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton}>
              <CustomButton
                label="Cancel"
                onPress={onClose}
                variant="cancel"
                width={80}
                height={55}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <CustomButton
                label="Add"
                onPress={handleAdd}
                variant="fill"
                width={80}
                height={55}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    height: 200,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#264653",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E5EEFF",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    marginLeft: 10,
  },
});
