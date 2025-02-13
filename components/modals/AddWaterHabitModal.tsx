import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Dimensions,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import InputField from "@/components/cards/InputField";
import InputPicker from "@/components/cards/InputPicker";
import CustomButton from "@/components/CustomButton";
import MugIcon from "@/components/icons/MugIcon";
import EmptyGlassIcon from "../icons/EmptyGlassIcon";
import BottleIcon from "../icons/BottleIcon";
import { Ionicons } from "@expo/vector-icons";
import CupIcon from "../icons/CupIcon";
import { CustomText } from "@/CustomText";

// firebase
import { db, auth } from "@/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import CloseIcon from "../icons/CloseIcon";

const { width } = Dimensions.get("window");

const cupSizes = [
  {
    size: 200,
    component: (
      <EmptyGlassIcon
        width={width > 760 ? 41 : 31}
        height={width > 760 ? 40 : 30}
      />
    ),
    name: "Glass",
  },
  {
    size: 250,
    component: (
      <CupIcon
        width={width > 760 ? 41 : 31}
        height={width > 760 ? 40 : 30}
        variant="empty"
      />
    ),
    name: "Cup",
  },
  {
    size: 300,
    component: (
      <MugIcon
        width={width > 760 ? 41 : 31}
        height={width > 760 ? 40 : 30}
        variant="empty"
      />
    ),
    name: "Mug",
  },
  {
    size: 500,
    component: (
      <BottleIcon
        width={width > 760 ? 51 : 41}
        height={width > 760 ? 50 : 40}
        variant="empty"
        litres={500}
        position="vertical"
      />
    ),
    name: "Small Bottle",
  },
  {
    size: 1000,
    component: (
      <BottleIcon
        width={width > 760 ? 51 : 41}
        height={width > 760 ? 50 : 40}
        variant="empty"
        litres={1000}
        position="vertical"
      />
    ),
    name: "Large Bottle",
  },
  {
    size: 1500,
    component: (
      <BottleIcon
        width={width > 760 ? 61 : 51}
        height={width > 760 ? 60 : 50}
        variant="empty"
        litres={1500}
        position="vertical"
      />
    ),
    name: "Extra Large Bottle",
  },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave?: (waterData: {
    dailyWaterIntake: number;
    dailyCupsNeeded: number;
    dailyCupSize: number;
    weigth: number;
    height: number;
    age: number;
    gender: string;
    activityLevel: string;
    climate: string;
    activityTime: string;
    healthCondition: string;
    dietType: string;
    sleepHours: string;
  }) => void;
};

export default function AddWaterHabitModal({
  visible,
  onClose,
  onSave,
}: Props) {
  // current user
  const userId = auth.currentUser?.uid;

  const [step, setStep] = useState<number>(1);
  const [calculatedIntake, setCalculatedIntake] = useState<number>(0);
  const [selectedCupSize, setSelectedCupSize] = useState<number>(0);
  const [cupsNeeded, setCupsNeeded] = useState<number>(0);
  const [cupType, setCupType] = useState<string>("");

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
    dailyWaterIntake: 0,
    dailyCupSize: 0,
    dailyCupsNeeded: 0,
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    // convert string values to numbers
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseFloat(age);
    const activityTimeNum = parseInt(activityTime, 10);
    const sleepHoursNum = parseInt(sleepHours, 10);

    // base calculation using weight (30ml per kg)
    let waterIntake = weightNum * 30;

    // adjust for height (taller people need more water)
    const heightFactor = heightNum / 170; // 170cm as baseline
    waterIntake *= heightFactor;

    // activity level adjustments
    const activityMultipliers = {
      Sedentary: 0.7,
      Light: 0.9,
      Moderate: 1.0,
      High: 1.2,
      Intense: 1.4,
    };
    waterIntake *=
      activityMultipliers[activityLevel as keyof typeof activityMultipliers];

    // climate adjustments
    const climateMultipliers = {
      Cold: 0.9,
      Moderate: 1.0,
      Hot: 1.2,
      VeryHot: 1.4,
    };
    waterIntake *=
      climateMultipliers[climate as keyof typeof climateMultipliers];

    // additional activity time (10ml per minute of exercise)
    waterIntake += activityTimeNum * 10;

    // age adjustment (older people need more reminders to drink)
    if (ageNum > 60) waterIntake *= 1.1;

    // gender adjustment
    if (gender === "Male") waterIntake *= 1.1;

    // health condition adjustments
    const healthMultipliers = {
      Normal: 1.0,
      Pregnant: 1.3,
      Breastfeeding: 1.4,
      Athletic: 1.2,
      HighBloodPressure: 1.1,
      KidneyIssues: 0.8,
    };
    waterIntake *=
      healthMultipliers[healthCondition as keyof typeof healthMultipliers];

    // diet type adjustments
    const dietMultipliers = {
      Regular: 1.0,
      HighProtein: 1.2,
      HighSalt: 1.1,
      Vegetarian: 0.9,
      Keto: 1.2,
    };
    waterIntake *= dietMultipliers[dietType as keyof typeof dietMultipliers];

    // sleep adjustment (less sleep = more water needed)
    const sleepFactor = 8 / sleepHoursNum;
    waterIntake *= sleepFactor;

    // convert to liters
    const waterIntakeLiters = waterIntake / 1000;

    setCalculatedIntake(waterIntakeLiters);
    setStep(6);
  }, [formData]);

  const handleCupSelection = useCallback(
    (cupSize: number, name: string) => {
      setTimeout(() => {
        setSelectedCupSize(cupSize); // set the choosen cup size
        setCupType(name);
        setCupsNeeded(Math.ceil((calculatedIntake * 1000) / cupSize));
        // const cupsNeeded = Math.ceil((calculatedIntake * 1000) / cupSize); // calculate the number of cups

        const waterData = {
          weight: formData.weight,
          height: formData.height,
          age: formData.age,
          gender: formData.gender,
          activityLevel: formData.activityLevel,
          climate: formData.climate,
          activityTime: formData.activityTime,
          healthCondition: formData.healthCondition,
          dietType: formData.dietType,
          sleepHours: formData.sleepHours,
          dailyWaterIntake: calculatedIntake,
          dailyCupsNeeded: cupsNeeded,
          dailyCupSize: cupSize,
          cupType: name,
        };

        if (onSave) {
          onSave(waterData); // save the data
        }

        setStep(7); // next step
      }, 3000); // wait 3 seconds
    },
    [calculatedIntake, onSave]
  );

  const handleSendDataToDb = useCallback(async () => {
    try {
      if (!userId) {
        console.log("user did not find");
        return;
      }

      // user doc referance
      const userDocRef = doc(db, "users", userId);
      const habitsDocRef = collection(userDocRef, "habits");

      // data to save to db
      const waterData = {
        dailyWaterIntake: calculatedIntake,
        cupsNeeded: cupsNeeded || 0,
        cupSize: selectedCupSize,
        weigth: formData.weight,
        height: formData.height,
        age: formData.age,
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        climate: formData.climate,
        activityTime: formData.activityTime,
        healthCondition: formData.healthCondition,
        dietType: formData.dietType,
        sleepHours: formData.sleepHours,
        cupType: cupType,
      };

      const habitsData = {
        variant: "Water",
        streakDays: 0,
        dailyWaterIntake: calculatedIntake,
        cupsNeeded: cupsNeeded || 0,
        cupSize: selectedCupSize,
        cupType: cupType,
        isDone: false,
        createdAt: new Date(),
        finishedAt: null,
        isArhived: false,
        lastChangeAt: new Date().toISOString().split("T")[0],
      };

      await setDoc(userDocRef, waterData, { merge: true });
      await addDoc(habitsDocRef, habitsData);

      console.log("data saved to db successfully");
      if (onSave) {
        onSave(waterData);
      }
      onClose();
    } catch (error) {
      console.log("error saving data to db", error);
    }
  }, [userId, calculatedIntake, onSave, cupsNeeded, selectedCupSize]);

  const renderInputForm = () => {
    const renderStepContent = () => {
      switch (step) {
        case 1:
          return (
            <View style={styles.inputContainer}>
              <CustomText style={styles.modalSubTitle}>
                {step} step of 5
              </CustomText>
              <View style={styles.formItem}>
                <InputField
                  label="Weight (kg)"
                  placeholder="Enter your weight"
                  keyboardType="numeric"
                  value={formData.weight}
                  onChangeText={(value) => handleInputChange("weight", value)}
                />
              </View>
              <View style={styles.formItem}>
                <InputField
                  label="Height (cm)"
                  placeholder="Enter your height"
                  keyboardType="numeric"
                  value={formData.height}
                  onChangeText={(value) => handleInputChange("height", value)}
                />
              </View>
            </View>
          );
        case 2:
          return (
            <View style={styles.inputContainer}>
              <CustomText style={styles.modalSubTitle}>
                {step} step of 5
              </CustomText>
              <View style={styles.formItem}>
                <InputField
                  label="Age"
                  placeholder="Enter your age"
                  keyboardType="numeric"
                  value={formData.age}
                  onChangeText={(value) => handleInputChange("age", value)}
                />
              </View>
              <View style={styles.formItem}>
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
            </View>
          );
        case 3:
          return (
            <View style={styles.inputContainer}>
              <CustomText style={styles.modalSubTitle}>
                {step} step of 5
              </CustomText>
              <View style={styles.formItem}>
                <InputPicker
                  label="Activity Level"
                  selectedValue={formData.activityLevel}
                  onValueChange={(value) =>
                    handleInputChange("activityLevel", value)
                  }
                  items={[
                    { label: "Sedentary", value: "Sedentary" },
                    { label: "Light", value: "Light" },
                    { label: "Moderate", value: "Moderate" },
                    { label: "High", value: "High" },
                    { label: "Intense", value: "Intense" },
                  ]}
                />
              </View>
              <View style={styles.formItem}>
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
            </View>
          );
        case 4:
          return (
            <View style={styles.inputContainer}>
              <CustomText style={styles.modalSubTitle}>
                {step} step of 5
              </CustomText>
              <View style={styles.formItem}>
                <InputField
                  label="Activity Time (min)"
                  placeholder="Daily exercise minutes"
                  keyboardType="numeric"
                  value={formData.activityTime}
                  onChangeText={(value) =>
                    handleInputChange("activityTime", value)
                  }
                />
              </View>
              <View style={styles.formItem}>
                <InputPicker
                  label="Health Condition"
                  selectedValue={formData.healthCondition}
                  onValueChange={(value) =>
                    handleInputChange("healthCondition", value)
                  }
                  items={[
                    { label: "Normal", value: "Normal" },
                    { label: "Pregnant", value: "Pregnant" },
                    { label: "Breastfeeding", value: "Breastfeeding" },
                    { label: "Athletic", value: "Athletic" },
                    {
                      label: "High Blood Pressure",
                      value: "HighBloodPressure",
                    },
                    { label: "Kidney Issues", value: "KidneyIssues" },
                  ]}
                />
              </View>
            </View>
          );
        case 5:
          return (
            <View style={styles.inputContainer}>
              <CustomText style={styles.modalSubTitle}>
                {step} step of 5
              </CustomText>
              <View style={styles.formItem}>
                <InputPicker
                  label="Diet Type"
                  selectedValue={formData.dietType}
                  onValueChange={(value) =>
                    handleInputChange("dietType", value)
                  }
                  items={[
                    { label: "Regular", value: "Regular" },
                    { label: "High Protein", value: "HighProtein" },
                    { label: "High Salt", value: "HighSalt" },
                    { label: "Vegetarian", value: "Vegetarian" },
                    { label: "Keto", value: "Keto" },
                  ]}
                />
              </View>
              <View style={styles.formItem}>
                <InputField
                  label="Sleep Hours"
                  placeholder="Hours of sleep"
                  keyboardType="numeric"
                  value={formData.sleepHours}
                  onChangeText={(value) =>
                    handleInputChange("sleepHours", value)
                  }
                />
              </View>
            </View>
          );
        default:
          return null;
      }
    };

    return (
      <>
        {renderStepContent()}
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <CustomButton
              label="Back"
              onPress={() => setStep(step - 1)}
              width="40%"
              height={50}
              variant="cancel"
            />
          )}
          {step < 5 ? (
            <CustomButton
              label="Next"
              onPress={() => setStep(step + 1)}
              width="40%"
              height={50}
              variant="fill"
              marginLeft={10}
            />
          ) : (
            <CustomButton
              label="Calculate"
              onPress={calculateWaterIntake}
              width="40%"
              height={50}
              variant="fill"
              marginLeft={10}
            />
          )}
        </View>
      </>
    );
  };

  const renderCupSelection = () => (
    <>
      <CustomText style={styles.modalSubTitle}>Select Cup Size</CustomText>
      <View style={styles.resultContainer}>
        <CustomText style={styles.resultText}>
          Daily water intake:{" "}
          <CustomText style={styles.resultBold}>
            {calculatedIntake.toFixed(1)} liters
          </CustomText>
        </CustomText>
      </View>
      <View style={styles.cupGrid}>
        {cupSizes.map(({ size, component, name }) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.cupButton,
              selectedCupSize === size && styles.selectedCup,
            ]}
            onPress={() => handleCupSelection(size, name)}
          >
            {component}
            <View style={styles.cupNameContainer}>
              <CustomText style={styles.cupName}>{name}</CustomText>
              <CustomText style={styles.cupSize}>{size} ml</CustomText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderResult = () => (
    <>
      <CustomText style={styles.modalSubTitle}>
        Your Daily Water Goal
      </CustomText>
      <View style={styles.resultContainer}>
        <CustomText style={styles.resultText}>
          Daily water intake:{" "}
          <CustomText style={styles.resultBold}>
            {calculatedIntake.toFixed(1)} liters
          </CustomText>
        </CustomText>
      </View>
      <View style={styles.resultContainer}>
        <CustomText style={styles.resultText}>
          Number of cups:{" "}
          <CustomText style={styles.resultBold}>
            {Math.ceil((calculatedIntake * 1000) / selectedCupSize)}
          </CustomText>
        </CustomText>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          label="Done"
          onPress={handleSendDataToDb}
          width="40%"
          height={50}
          variant="fill"
        />
      </View>
    </>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <CloseIcon size={24} color="#1E3A5F" />
          </TouchableOpacity>
          <CustomText style={styles.modalTitle}>Add Water Habit</CustomText>
          <View style={styles.modalContent}>
            {step <= 5 && renderInputForm()}
            {step === 6 && renderCupSelection()}
            {step === 7 && renderResult()}
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
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
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
  modalSubTitle: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#1E3A5F",
    opacity: 0.8,
    marginBottom: 30,
    textAlign: "center",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 30,
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
  resultContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  cupGrid: {
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
    gap: 10,
    padding: 4,
    marginTop: 10,
    backgroundColor: "yellow",
  },
  cupButton: {
    width: "31%",
    height: 120,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center", // İçeriği dikey olarak da ortalar
    padding: 10,
  },  
  selectedCup: {
    backgroundColor: "#1E3A5F",
  },
  cupNameContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  cupName: {
    fontSize: Platform.OS === "web" ? 12 : 12 * 0.8,
    color: "#1E3A5F",
    fontWeight: "bold",
    marginTop: 10,
  },
  cupSize: {
    fontSize: 12,
    color: "#1E3A5F",
    opacity: 0.7,
    fontWeight: "400",
    marginTop: 6,
  },
  resultText: {
    fontSize: width > 768 ? 16 : 14,
    color: "#1E3A5F",
    opacity: 0.8,
    textAlign: "center",
  },
  resultBold: {
    fontWeight: "bold",
    fontSize: width > 760 ? 18 : 16,
    marginLeft: 10,
    color: "#1E3A5F",
    backgroundColor: "#E5EEFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});
