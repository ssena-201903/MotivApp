import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import AddHabitModal from "@/components/modals/AddHabitModal";
import { CustomText } from "@/CustomText";

const { width } = Dimensions.get("window");

export default function CreateHabitCard() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleHabitModalPress = () => {
    console.log("Habit Modal Pressed");
    setIsModalOpen(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.top}>
        <CustomText style={styles.title}>Create Habit Streak</CustomText>

        <View style={styles.habits}>
          <View style={styles.habitRow}>
            <TouchableOpacity style={styles.plusButton} onPress={handleHabitModalPress}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <CustomText style={styles.habitText}>Water</CustomText>
          </View>

          <View style={styles.habitRow}>
            <TouchableOpacity style={styles.plusButton}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <CustomText style={styles.habitText}>Book</CustomText>
          </View>

          <View style={styles.habitRow}>
            <TouchableOpacity style={styles.plusButton}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <CustomText style={styles.habitText}>Sport</CustomText>
          </View>

          <View style={styles.habitRow}>
            <TouchableOpacity style={styles.plusButton}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <CustomText style={styles.habitText}>Vocabulary</CustomText>
          </View>

          <View style={styles.habitRow}>
            <TouchableOpacity style={styles.plusButton}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <CustomText style={styles.habitText}>Custom Habit</CustomText>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          label="Maybe later"
          onPress={() => {}}
          variant="cancel"
          width={170}
          height={45}
        />
        <CustomButton
          label="Continue"
          onPress={() => {}}
          variant="fill"
          width={170}
          height={45}
        />
      </View>

      {isModalOpen && (
        <AddHabitModal
          variant="Water"
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  top: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: width > 760 ? "flex-start" : "flex-start",
    width: width > 760 ? width - 100 : width - 40,
  },
  title: {
    color: "#1E3A5F",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  habits: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  plusButton: {
    width: 40,
    height: 40,
    backgroundColor: "#1E3A5F",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  habitText: {
    fontSize: 18,
    fontWeight: "medium",
    color: "#1E3A5F",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    width: width > 760 ? width - 1170 : width - 40,
    justifyContent: "space-between",
    marginTop: 30,
    // marginBottom: 10,
  },
  laterButton: {
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
