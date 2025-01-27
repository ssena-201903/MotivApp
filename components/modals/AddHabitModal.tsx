import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Dimensions,
  SafeAreaView,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import InputField from "@/components/cards/InputField";
import InputPicker from "@/components/cards/InputPicker";
import CustomButton from "@/components/CustomButton";
import MugIcon from "@/components/icons/MugIcon";

type Props = {
  variant: "Book" | "Sport" | "Water" | "Vocabulary" | "Other";
  visible: boolean;
  onClose: () => void;
  onSave?: (waterData: {
    dailyWaterIntake: number;
    cupsNeeded: number;
    cupSize: number;
  }) => void;
};

type CalculationStep = "input" | "cup-selection" | "result";

export default function AddHabitModal({ variant, visible, onClose, onSave }: Props) {
  const [step, setStep] = useState<number>(1);
  const [calculatedIntake, setCalculatedIntake] = useState<number>(0);
  const [selectedCupSize, setSelectedCupSize] = useState<number>(250);
  
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "Male",
    activityLevel: "Moderate",
    climate: "Moderate",
    activityTime: "20",
    healthCondition: "Normal",
    dietType: "Regular",
    sleepHours: "8",
  });

  const handleNextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const validateInputs = (): boolean => {
    const { weight, height, age } = formData;
    
    if (!weight || !height || !age) {
      Alert.alert("Error", "Please fill in all required fields.");
      return false;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseFloat(age);

    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 300) {
      Alert.alert("Error", "Please enter a valid weight (0-300 kg).");
      return false;
    }

    if (isNaN(heightNum) || heightNum <= 0 || heightNum > 250) {
      Alert.alert("Error", "Please enter a valid height (0-250 cm).");
      return false;
    }

    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      Alert.alert("Error", "Please enter a valid age (0-120 years).");
      return false;
    }

    return true;
  };

  const calculateWaterIntake = useCallback(() => {
    if (!validateInputs()) return;

    const {
      weight,
      height,
      age,
      gender,
      activityLevel,
      climate,
      activityTime,
      healthCondition,
      dietType,
      sleepHours,
    } = formData;

    // Convert string values to numbers
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseFloat(age);
    const activityTimeNum = parseInt(activityTime, 10);
    const sleepHoursNum = parseInt(sleepHours, 10);

    // Base calculation using weight (30ml per kg)
    let waterIntake = weightNum * 30;

    // Adjust for height (taller people need more water)
    const heightFactor = heightNum / 170; // 170cm as baseline
    waterIntake *= heightFactor;

    // Activity level adjustments
    const activityMultipliers = {
      Sedentary: 0.7,
      Light: 0.9,
      Moderate: 1.0,
      High: 1.2,
      Intense: 1.4,
    };
    waterIntake *= activityMultipliers[activityLevel as keyof typeof activityMultipliers];

    // Climate adjustments
    const climateMultipliers = {
      Cold: 0.9,
      Moderate: 1.0,
      Hot: 1.2,
      VeryHot: 1.4,
    };
    waterIntake *= climateMultipliers[climate as keyof typeof climateMultipliers];

    // Additional activity time (10ml per minute of exercise)
    waterIntake += activityTimeNum * 10;

    // Age adjustment (older people need more reminders to drink)
    if (ageNum > 60) waterIntake *= 1.1;

    // Gender adjustment
    if (gender === "Male") waterIntake *= 1.1;

    // Health condition adjustments
    const healthMultipliers = {
      Normal: 1.0,
      Pregnant: 1.3,
      Breastfeeding: 1.4,
      Athletic: 1.2,
      HighBloodPressure: 1.1,
      KidneyIssues: 0.8,
    };
    waterIntake *= healthMultipliers[healthCondition as keyof typeof healthMultipliers];

    // Diet type adjustments
    const dietMultipliers = {
      Regular: 1.0,
      HighProtein: 1.2,
      HighSalt: 1.1,
      Vegetarian: 0.9,
      Keto: 1.2,
    };
    waterIntake *= dietMultipliers[dietType as keyof typeof dietMultipliers];

    // Sleep adjustment (less sleep = more water needed)
    const sleepFactor = 8 / sleepHoursNum;
    waterIntake *= sleepFactor;

    // Convert to liters
    const waterIntakeLiters = waterIntake / 1000;

    setCalculatedIntake(waterIntakeLiters);
    renderResult();
  }, [formData]);

  const handleCupSelection = useCallback((cupSize: number) => {
    setSelectedCupSize(cupSize); // Add this line
    const cupsNeeded = Math.ceil((calculatedIntake * 1000) / cupSize);
    
    const waterData = {
      dailyWaterIntake: calculatedIntake,
      cupsNeeded,
      cupSize,
    };

    if (onSave) {
      onSave(waterData);
    }

  }, [calculatedIntake, onSave]);

  const renderInputForm = () => {
    const renderStepContent = () => {
      switch (step) {
        case 1:
          return (
            <View style={styles.inputContainer}>
              <Text style={styles.modalTitle}>Step 1: Personal Information</Text>
              <InputField
                label="Weight (kg)"
                placeholder="Enter your weight"
                keyboardType="numeric"
                value={formData.weight}
                onChangeText={(value) => handleInputChange("weight", value)}
              />
              <InputField
                label="Height (cm)"
                placeholder="Enter your height"
                keyboardType="numeric"
                value={formData.height}
                onChangeText={(value) => handleInputChange("height", value)}
              />
            </View>
          );
        case 2:
          return (
            <View style={styles.inputContainer}>
              <Text style={styles.modalTitle}>Step 2: Age and Gender</Text>
              <InputField
                label="Age"
                placeholder="Enter your age"
                keyboardType="numeric"
                value={formData.age}
                onChangeText={(value) => handleInputChange("age", value)}
              />
              <InputPicker
                label="Gender"
                selectedValue={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
                items={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
              />
            </View>
          );
        case 3:
          return (
            <View style={styles.inputContainer}>
              <Text style={styles.modalTitle}>Step 3: Activity and Climate</Text>
              <InputPicker
                label="Activity Level"
                selectedValue={formData.activityLevel}
                onValueChange={(value) => handleInputChange("activityLevel", value)}
                items={[
                  { label: "Sedentary", value: "Sedentary" },
                  { label: "Light", value: "Light" },
                  { label: "Moderate", value: "Moderate" },
                  { label: "High", value: "High" },
                  { label: "Intense", value: "Intense" },
                ]}
              />
              <InputPicker
                label="Climate"
                selectedValue={formData.climate}
                onValueChange={(value) => handleInputChange("climate", value)}
                items={[
                  { label: "Cold", value: "Cold" },
                  { label: "Moderate", value: "Moderate" },
                  { label: "Hot", value: "Hot" },
                  { label: "Very Hot", value: "VeryHot" },
                ]}
              />
            </View>
          );
        case 4:
          return (
            <View style={styles.inputContainer}>
              <Text style={styles.modalTitle}>Step 4: Health and Sleep</Text>
              <InputField
                label="Activity Time (min)"
                placeholder="Daily exercise minutes"
                keyboardType="numeric"
                value={formData.activityTime}
                onChangeText={(value) => handleInputChange("activityTime", value)}
              />
              <InputPicker
                label="Health Condition"
                selectedValue={formData.healthCondition}
                onValueChange={(value) => handleInputChange("healthCondition", value)}
                items={[
                  { label: "Normal", value: "Normal" },
                  { label: "Pregnant", value: "Pregnant" },
                  { label: "Breastfeeding", value: "Breastfeeding" },
                  { label: "Athletic", value: "Athletic" },
                  { label: "High Blood Pressure", value: "HighBloodPressure" },
                  { label: "Kidney Issues", value: "KidneyIssues" },
                ]}
              />
            </View>
          );
        case 5:
          return (
            <View style={styles.inputContainer}>
              <Text style={styles.modalTitle}>Step 5: Diet and Final Information</Text>
              <InputPicker
                label="Diet Type"
                selectedValue={formData.dietType}
                onValueChange={(value) => handleInputChange("dietType", value)}
                items={[
                  { label: "Regular", value: "Regular" },
                  { label: "High Protein", value: "HighProtein" },
                  { label: "High Salt", value: "HighSalt" },
                  { label: "Vegetarian", value: "Vegetarian" },
                  { label: "Keto", value: "Keto" },
                ]}
              />
              <InputField
                label="Sleep Hours"
                placeholder="Hours of sleep"
                keyboardType="numeric"
                value={formData.sleepHours}
                onChangeText={(value) => handleInputChange("sleepHours", value)}
              />
            </View>
          );
        default:
          return null;
      }
    };
  
    return (
      <ScrollView style={styles.modalContent}>
        {renderStepContent()}
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <CustomButton
              label="Back"
              onPress={() => setStep(step - 1)}
              width={120}
              height={45}
              variant="cancel"
            />
          )}
          {step < 5 ? (
            <CustomButton
              label="Next"
              onPress={() => setStep(step + 1)}
              width={120}
              height={45}
              variant="fill"
            />
          ) : (
            <CustomButton
              label="Calculate"
              onPress={calculateWaterIntake}
              width={120}
              height={45}
              variant="fill"
            />
          )}
        </View>
      </ScrollView>
    );
  };
  

  const renderCupSelection = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Select Cup Size</Text>
      <Text style={styles.resultText}>
        Recommended daily water intake: {calculatedIntake.toFixed(1)} liters
      </Text>
      
      <View style={styles.cupGrid}>
        {[200, 250, 300, 500].map((size) => (
          <CustomButton
            key={size}
            label={`${size}ml`}
            onPress={() => handleCupSelection(size)}
            width={140}
            height={140}
            variant="outlined"
          />
        ))}
      </View>
    </View>
  );

  const renderResult = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Your Daily Water Goal</Text>
      <Text style={styles.resultText}>
        Daily water intake: {calculatedIntake.toFixed(1)} liters
      </Text>
      <Text style={styles.resultText}>
        Number of cups: {Math.ceil((calculatedIntake * 1000) / selectedCupSize)}
      </Text>
      <View style={styles.buttonContainer}>
        <CustomButton
          label="Done"
          onPress={onClose}
          width={200}
          height={45}
          variant="fill"
        />
      </View>
    </View>
  );


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.overlay}>
        <View style={styles.modalView}>
          {renderInputForm()}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: width - 40,
    backgroundColor: "#FCFCFC",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    maxHeight: "90%",
  },
  modalContent: {
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cupGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 20,
    marginTop: 20,
  },
  resultText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
});