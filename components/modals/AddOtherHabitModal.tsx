import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  Alert,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import InputField from "@/components/cards/InputField";
import CustomButton from "@/components/CustomButton";
import { CustomText } from "@/CustomText";
import { db, auth } from "@/firebase.config";
import { doc, collection, addDoc } from "firebase/firestore";
import CloseIcon from "@/components/icons/CloseIcon";

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

export default function AddOtherHabitModal({
  variant,
  visible,
  onClose,
}: Props) {
  const userId = auth.currentUser?.uid;
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    goalDays: "",
    dailyDuration: "",
    customText: "",
    dailyAmount: "",
  });

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // const validateInputs = (): boolean => {
  //   const { goalDays, dailyDuration, customText, dailyAmount } = formData;

  //   if (variant === "Custom") {
  //     if (!customText.trim()) {
  //       Alert.alert("Error", "Please fill in the custom habit name.");
  //       return false;
  //     }
  //     if (!dailyAmount.trim()) {
  //       Alert.alert("Error", "Please fill in the daily amount.");
  //       return false;
  //     }
  //     if (!goalDays.trim()) {
  //       Alert.alert("Error", "Please fill in all required fields.");
  //       return false;
  //     }

  //     return true;
  //   }

  //   // if (variant === "Vocabulary") {
  //   //   if (!dailyAmount.trim()) {
  //   //     Alert.alert("Error", "Please fill in the daily amount.");
  //   //     return false;
  //   //   }
  //   //   if (!goalDays.trim()) {
  //   //     Alert.alert("Error", "Please fill in the goal days.");
  //   //     return false;
  //   //   }
  //   // }

  //   if (variant === "Vocabulary" || !goalDays.trim() || !dailyDuration.trim()) {
  //     Alert.alert("Error", "Please fill in all required fields.");
  //     return false;
  //   }

  //   return true;
  // };

  const validateInputs = (): boolean => {
    const { goalDays, dailyDuration, customText, dailyAmount } = formData;

    if (variant === "Custom") {
      if (!customText.trim()) {
        Alert.alert("Error", "Please fill in the custom habit name.");
        return false;
      }
      if (!dailyAmount.trim()) {
        Alert.alert("Error", "Please fill in the daily amount.");
        return false;
      }
      if (!goalDays.trim()) {
        Alert.alert("Error", "Please fill in the goal days.");
        return false;
      }
      return true;
    }

    if (variant === "Vocabulary") {
      if (!dailyAmount.trim()) {
        Alert.alert("Error", "Please fill in the daily word amount.");
        return false;
      }
      if (!goalDays.trim()) {
        Alert.alert("Error", "Please fill in the goal days.");
        return false;
      }
      return true;
    }

    // For other variants (Sport, Book)
    if (!goalDays.trim() || !dailyDuration.trim()) {
      Alert.alert("Error", "Please fill in all required fields.");
      return false;
    }

    return true;
  };

  const capitalizeText = (text: string): string => {
    return text
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
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
        duration:
          variant !== "Vocabulary" ? parseFloat(formData.dailyDuration) : null,
        goalNumber: parseFloat(formData.goalDays),
        customText:
          variant === "Custom" ? capitalizeText(formData.customText) : null,
        dailyAmount:
          variant === "Vocabulary" || variant === "Custom"
            ? parseFloat(formData.dailyAmount)
            : null,
        isDone: false,
        isArchieved: false,
        variant,
        streakDays: 0,
        doneNumber: 0,
        createdAt: new Date(),
        finishedAt: null,
        lastChangeAt: new Date().toISOString().split("T")[0],
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
          <>
            <View style={styles.formItem}>
              <InputField
                label="Habit Name"
                placeholder="Enter custom habit name"
                value={formData.customText}
                onChangeText={(text) => handleInputChange("customText", text)}
              />
            </View>
            <View style={styles.formItem}>
              <InputField
                label="Daily Duration (minutes) or Amount"
                placeholder="Enter daily amount (if none, please enter 0)"
                keyboardType="numeric"
                value={formData.dailyAmount}
                onChangeText={(text) => handleInputChange("dailyAmount", text)}
              />
            </View>
          </>
        );
      case "Vocabulary":
        return (
          <View style={styles.formItem}>
            <InputField
              label="Daily Word Amount"
              placeholder="Enter daily word amount"
              keyboardType="numeric"
              value={formData.dailyAmount}
              onChangeText={(text) => handleInputChange("dailyAmount", text)}
            />
          </View>
        );
      default:
        return (
          <View style={styles.formItem}>
            <InputField
              label="Daily Duration"
              placeholder="Enter daily duration in minutes"
              keyboardType="numeric"
              value={formData.dailyDuration}
              onChangeText={(text) => handleInputChange("dailyDuration", text)}
            />
          </View>
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
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              if (!isSaving) onClose();
            }}
          >
            <CloseIcon size={24} color="#1E3A5F" />
          </TouchableOpacity>
          <View style={styles.modalContent}>
            <CustomText style={styles.modalTitle}>
              Create {variant} Habit
            </CustomText>
            <View style={styles.inputContainer}>
              {renderInputFields()}
              <View style={styles.formItem}>
                <InputField
                  label="Number of Days"
                  placeholder="How many days is your goal?"
                  keyboardType="numeric"
                  value={formData.goalDays}
                  onChangeText={(text) => handleInputChange("goalDays", text)}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton
                label={isSaving ? "Saving..." : "Save"}
                onPress={handleSendDataToDb}
                width="50%"
                height={50}
                variant="fill"
              />
            </View>
          </View>
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
  modalView: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "90%",
    backgroundColor: "#FCFCFC",
    paddingHorizontal: 30,
    paddingVertical: 30,
    paddingTop: 60,
    borderRadius: 8,
    alignItems: "center",
    // elevation: 5,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4, 
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  modalContent: {
    width: "100%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 40,
    width: "100%",
    alignItems: "center",
  },
  formItem: {
    width: "100%",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
});
