import React from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CustomText } from "@/CustomText";

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (todo: string) => void;
  selectedDate?: string;
  todoText: string;
  onTodoTextChange: (text: string) => void;
}

export default function AddTodoModal ({
  visible,
  onClose,
  onAdd,
  selectedDate,
  todoText,
  onTodoTextChange
}: AddTodoModalProps) {
  const handleAdd = () => {
    if (todoText.trim()) {
      onAdd(todoText);
      onTodoTextChange('');
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
            {selectedDate ? `${selectedDate} için yeni görev` : 'Yeni görev ekle'}
          </CustomText>
          <TextInput
            style={styles.modalInput}
            value={todoText}
            onChangeText={onTodoTextChange}
            placeholder="Görev ekle"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <CustomText style={styles.modalButtonText}>İptal</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleAdd}
            >
              <CustomText style={styles.modalButtonText}>Ekle</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
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