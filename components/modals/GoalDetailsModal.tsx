import React from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type GoalDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  goal: any;
};

export default function GoalDetailsModal({
  visible,
  onClose,
  goal,
}: GoalDetailsModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{goal.name}</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#1E3A5F" />
            </Pressable>
          </View>
          <Text style={styles.description}>
            {goal.description || "No details available."}
          </Text>
        </View>
      </View>
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A5F",
  },
  description: {
    fontSize: 14,
    color: "#4A5568",
  },
});
