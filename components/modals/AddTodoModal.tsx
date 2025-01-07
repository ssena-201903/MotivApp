import React from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { CustomText } from "@/CustomText";
import CustomButton from "../CustomButton";

interface AddTodoModalProps {
  visible: boolean;
  selectedDate?: string;
  todoText: string;
  onTodoTextChange: (text: string) => void;
}

export default function AddTodoModal({
  visible,
  selectedDate,
  todoText,
  onTodoTextChange,
}: AddTodoModalProps) {
  const handleAdd = () => {
    if (todoText.trim()) {
      onAdd(todoText);
      onTodoTextChange("");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
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
            onChangeText={onTodoTextChange}
            placeholder="Write New Todo"
          />
          <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.modalButton}>
              <CustomButton
                label="Cancel"
                onPress={onClose}
                variant="cancel"
                width={80}
                height={40}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <CustomButton
                label="Add"
                onPress={handleAdd}
                variant="fill"
                width={80}
                height={40}
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
  cancelButton: {
    backgroundColor: "#E5EEFF",
  },
  confirmButton: {
    backgroundColor: "#FFA38F",
  },
  modalButtonText: {
    color: "#264653",
    fontWeight: "bold",
  },
});
