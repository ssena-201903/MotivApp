import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import InputField from "@/components/cards/InputField";
import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "@/CustomText";
import { db, auth } from "@/firebase.config";
import { doc, collection, addDoc } from "firebase/firestore";

const { width } = Dimensions.get("window");

type HabitVariant = "Sport" | "Book" | "Vocabulary" | "Custom";

interface Props {
  variant: HabitVariant;
  visible: boolean;
  onClose: () => void;
}

interface FormData {
  goalDays: string;
  dailyDuration: string;
  customText: string;
  dailyAmount: string;
}

export default function AddOtherHabitModal({ variant, visible, onClose }: Props) {
  const userId = auth.currentUser?.uid;
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    goalDays: "",
    dailyDuration: "",
    customText: "",
    dailyAmount: "",
  });

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const validateInputs = (): boolean => {
    const { goalDays, dailyDuration, customText, dailyAmount } = formData;

    if (variant === "Custom" && !customText.trim()) {
      Alert.alert("Error", "Please fill in the custom habit name.");
      return false;
    }

    if (variant === "Vocabulary" && !dailyAmount.trim()) {
      Alert.alert("Error", "Please fill in the daily amount.");
      return false;
    }

    if (!goalDays.trim() || (variant !== "Vocabulary" && !dailyDuration.trim())) {
      Alert.alert("Error", "Please fill in all required fields.");
      return false;
    }

    return true;
  };

  const capitalizeText = (text: string): string => {
    return text
      .trim()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleSendDataToDb = async () => {
    if (isSaving) return;
    
    try {
      if (!validateInputs()) {
        return;
      }

      setIsSaving(true);

      if (!userId) {
        console.error("User not found");
        return;
      }

      const habitData = {
        duration: variant !== "Vocabulary" ? parseFloat(formData.dailyDuration) : null,
        goalNumber: parseFloat(formData.goalDays),
        customText: variant === "Custom" ? capitalizeText(formData.customText) : null,
        dailyAmount: variant === "Vocabulary" ? parseFloat(formData.dailyAmount) : null,
        isDone: false,
        isArchieved: false,
        variant,
        streakDays: 0,
        doneNumber: 0,
        createdAt: new Date(),
        finishedAt: null,
      };

      const userDocRef = doc(db, "users", userId);
      const habitsDocRef = collection(userDocRef, "habits");
      
      await addDoc(habitsDocRef, habitData);
      Keyboard.dismiss();
      onClose();
    } catch (error) {
      console.error("Error saving data to db:", error);
      Alert.alert("Error", "Failed to save habit. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderInputFields = () => {
    switch (variant) {
      case "Custom":
        return (
          <InputField
            label="Custom Habit"
            placeholder="Enter custom habit name"
            value={formData.customText}
            onChangeText={(text) => handleInputChange("customText", text)}
          />
        );
      case "Vocabulary":
        return (
          <InputField
            label="Daily Word Amount"
            placeholder="Enter daily word amount"
            keyboardType="numeric"
            value={formData.dailyAmount}
            onChangeText={(text) => handleInputChange("dailyAmount", text)}
          />
        );
      default:
        return (
          <InputField
            label="Daily Duration"
            placeholder="Enter daily duration in minutes"
            keyboardType="numeric"
            value={formData.dailyDuration}
            onChangeText={(text) => handleInputChange("dailyDuration", text)}
          />
        );
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        if (!isSaving) onClose();
      }}
    >
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaView style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => {
                  if (!isSaving) onClose();
                }}
              >
                <Ionicons name="close" size={24} color="#1E3A5F" />
              </TouchableOpacity>
              <ScrollView 
                style={styles.modalContent}
                keyboardShouldPersistTaps="handled"
              >
                <CustomText style={styles.modalTitle}>
                  Create {variant} Habit
                </CustomText>
                <View style={styles.inputContainer}>
                  {renderInputFields()}
                  <InputField
                    label="Number of Days"
                    placeholder="How many days is your goal?"
                    keyboardType="numeric"
                    value={formData.goalDays}
                    onChangeText={(text) => handleInputChange("goalDays", text)}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <CustomButton
                    label={isSaving ? "Saving..." : "Save"}
                    onPress={handleSendDataToDb}
                    width={120}
                    height={45}
                    variant="fill"
                    marginLeft={10}
                  />
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: width > 760 ? width - 900 : width - 40,
    backgroundColor: "#FCFCFC",
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 60,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    maxHeight: "90%",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  modalContent: {
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
});