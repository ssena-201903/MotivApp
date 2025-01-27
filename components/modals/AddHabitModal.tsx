import React, { useState } from "react";
import {
  Alert,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CustomText } from "@/CustomText";
import { ScrollView } from "react-native-gesture-handler";
import InputField from "@/components/cards/InputField";
import InputPicker from "../cards/InputPicker";
import CustomButton from "@/components/CustomButton";

type Props = {
  variant: "Book" | "Sport" | "Water" | "Vocabulary" | "Other";
  visible: boolean;
  onClose: () => void;
};

export default function AddHabitModal({ variant, visible, onClose }: Props) {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("Female");
  const [activityLevel, setActivityLevel] = useState<string>("Moderate");
  const [activityTime, setActivityTime] = useState<string>("20");
  const [workEnvironment, setWorkEnvironment] = useState<string>("Indoor");
  const [livingEnvironment, setLivingEnvironment] = useState<string>("Cold");
  const [healthIssues, setHealthIssues] = useState<string>("No Issue");
  const [caffeineAlcohol, setCaffeineAlcohol] = useState<string>("Never");

  const calculateWaterIntake = () => {
    if (!weight || !age) {
      Alert.alert("Error", "Please fill in required fields.");
      return;
    }

    const weightNum = parseFloat(weight);
    const activityTimeNum = parseInt(activityTime, 10);

    if (isNaN(weightNum)) {
      Alert.alert("Error", "Invalid weight value.");
      return;
    }

    let dailyWaterIntake = weightNum * 0.03;
    if (activityLevel === "High") {
      dailyWaterIntake += 0.5;
    } else if (activityLevel === "Low") {
      dailyWaterIntake -= 0.2;
    }

    dailyWaterIntake += activityTimeNum * 0.01;
    if (livingEnvironment === "Hot") {
      dailyWaterIntake += 0.5;
    } else if (livingEnvironment === "Cold") {
      dailyWaterIntake -= 0.2;
    }

    dailyWaterIntake = Math.max(dailyWaterIntake, 1.5);

    Alert.alert(
      "Result",
      `Your daily water intake is approximately ${dailyWaterIntake.toFixed(
        2
      )} liters.`
    );
    onClose();
  };

  const createHabitCard = () => {
    if (variant === "Water") {
      return (
        <ScrollView style={styles.modalContent}>
          <CustomText style={styles.modalTitle}>Create {variant} Habit</CustomText>

          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.inputContainer}>
              <InputField
                label="Weight"
                placeholder="Enter your weight (kg)"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                inputStyle={{ width: width > 760 ? 200 : 230 }}
              />
              <InputField
                label="Height"
                placeholder="Enter your height (cm)"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                inputStyle={{ width: width > 760 ? 200 : 230 }}
                variant="default"
              />
            </View>
            <View style={styles.inputContainer}>
              <InputField
                label="Age"
                placeholder="Enter your age"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
                inputStyle={{ width: width > 760 ? 200 : 230 }}
              />
              <InputPicker
                label="Gender"
                selectedValue={gender}
                onValueChange={setGender}
                items={[
                  { label: "Female", value: "Female" },
                  { label: "Male", value: "Male" },
                ]}
                pickerStyle={{ width: width > 760 ? 200 : 230 }}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputPicker
                label="Activity Level"
                selectedValue={activityLevel}
                onValueChange={setActivityLevel}
                items={[
                  { label: "Low", value: "Low" },
                  { label: "Moderate", value: "Moderate" },
                  { label: "High", value: "High" },
                ]}
                pickerStyle={{ width: width > 760 ? 200 : 230 }}
              />
              <InputField
                label="Activity Time"
                placeholder="Enter activity time (minutes)"
                keyboardType="numeric"
                value={activityTime}
                onChangeText={setActivityTime}
                inputStyle={{ width: width > 760 ? 200 : 230 }}
              />
            </View>

            <View style={styles.inputContainer}>
              <InputPicker
                label="Work Environment"
                selectedValue={workEnvironment}
                onValueChange={setWorkEnvironment}
                items={[
                  { label: "Indoor", value: "Indoor" },
                  { label: "Outdoor", value: "Outdoor" },
                ]}
                pickerStyle={{ width: width > 760 ? 200 : 230 }}
              />
              <InputPicker
                label="Living Environment"
                selectedValue={livingEnvironment}
                onValueChange={setLivingEnvironment}
                items={[
                  { label: "Cold", value: "Cold" },
                  { label: "Moderate", value: "Moderate" },
                  { label: "Hot", value: "Hot" },
                ]}
                pickerStyle={{ width: width > 760 ? 200 : 230 }}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputPicker
                label="Health Issues"
                selectedValue={healthIssues}
                onValueChange={setHealthIssues}
                items={[
                  { label: "No Issue", value: "No Issue" },
                  { label: "Minor Issues", value: "Minor Issues" },
                  { label: "Serious Issues", value: "Serious Issues" },
                ]}
                pickerStyle={{ width: width > 760 ? 200 : 230 }}
              />
              <InputPicker
                label="Caffine/Alcohol"
                selectedValue={caffeineAlcohol}
                onValueChange={setCaffeineAlcohol}
                items={[
                  { label: "Never", value: "Never" },
                  { label: "Occasionally", value: "Occasionally" },
                  { label: "Frequently", value: "Frequently" },
                ]}
                pickerStyle={{ width: width > 760 ? 200 : 230 }}
              />
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                label="Cancel"
                onPress={onClose}
                width={120}
                height={45}
                variant="cancel"
              />
              <CustomButton
                label="Create"
                onPress={calculateWaterIntake}
                width={120}
                height={45}
                marginLeft={10}
                variant="fill"
              />
            </View>
          </ScrollView>
        </ScrollView>
      );
    }
    return null;
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>{createHabitCard()}</View>
      </View>
    </Modal>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: width > 760 ? width - 1000 : width - 40,
    height: 600,
    backgroundColor: "#FCFCFC",
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 12,
    elevation: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContent: {
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#1E3A5F",  
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  label: {
    margin: 12,
  },
  picker: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 12,
  },
  buttonCancel: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  buttonSubmit: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
