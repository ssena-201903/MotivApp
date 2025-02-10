import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import CustomButton from "../CustomButton";
import { CustomText } from "@/CustomText";

const { width } = Dimensions.get("window");

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <CustomText style={styles.title}>{title}</CustomText>
          <CustomText style={styles.message}>{message}</CustomText>
          <View style={styles.buttonContainer}>
            <CustomButton
              label="Cancel"
              onPress={onCancel}
              variant="cancel"
              width="50%"
              height={50}
            />
            <CustomButton
              label="Yes"
              onPress={onConfirm}
              variant="fill"
              width="50%"
              height={50}
              marginLeft={10}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderRadius: 8,
    width: Platform.OS === "web" ? "60%" : width - 40,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E3A5F",
  },
  message: {
    fontSize: 16,
    color: "#1E3A5F",
    marginVertical: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: Platform.OS === "web" ? "50%" : "80%",
    marginTop: 20,
  },
});
