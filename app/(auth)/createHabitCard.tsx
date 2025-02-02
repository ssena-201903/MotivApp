import React, { useEffect, useState } from "react";
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
import AddWaterHabitModal from "@/components/modals/AddWaterHabitModal";
import AddOtherHabitModal from "@/components/modals/AddOtherHabitModal";
import { CustomText } from "@/CustomText";
import { auth, db } from "@/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function CreateHabitCard() {
  const [isWaterModalOpen, setIsWaterModalOpen] = useState<boolean>(false);
  const [isOtherModalOpen, setIsOtherModalOpen] = useState<boolean>(false);
  const [variant, setVariant] = useState<string>("");
  
  const [userName, setUserName] = useState<string>("");
  const handleWaterHabitModalPress = () => {
    console.log("Habit Modal Pressed");
    setIsWaterModalOpen(true);
  };

  const handleBookModalPress = () => {
    setVariant("Book");
    setIsOtherModalOpen(true);
  };

  const handleSportModalPress = () => {
    setVariant("Sport");
    setIsOtherModalOpen(true);
  };

  const handleVocabularyModalPress = () => {
    setVariant("Vocabulary");
    setIsOtherModalOpen(true);
  };

  const handleCustomModalPress = () => {
    setVariant("Custom");
    setIsOtherModalOpen(true);
  };

  const getUserInfos = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.log("user did not login");
        return;
      }

      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.formattedName);
        return userData.name;
      } else {
        console.log("User document does not exist");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => { getUserInfos(); }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.top}>
        <View style={styles.welcomeContainer}>
          <CustomText style={styles.welcomeText}>Welcome !</CustomText>
          <CustomText style={styles.userName}>{userName}</CustomText>
        </View>
        <CustomText style={styles.title}>Create Habit Streak</CustomText>
        <CustomText style={styles.subtitle}>Start a new habit and track your progress</CustomText>

        <View style={styles.habits}>
          <View style={styles.habitRow}>
            <TouchableOpacity style={styles.plusButton} onPress={handleWaterHabitModalPress}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <CustomText style={styles.habitText}>Water</CustomText>
          </View>

          <View style={styles.habitRow}>
            <TouchableOpacity style={styles.plusButton} onPress={handleBookModalPress}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <CustomText style={styles.habitText}>Book</CustomText>
          </View>

          <View style={styles.habitRow}>
            <TouchableOpacity style={styles.plusButton} onPress={handleSportModalPress}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <CustomText style={styles.habitText}>Sport</CustomText>
          </View>

          <View style={styles.habitRow}>
            <TouchableOpacity style={styles.plusButton} onPress={handleVocabularyModalPress}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <CustomText style={styles.habitText}>Vocabulary</CustomText>
          </View>

          <View style={styles.habitRow}>
            <TouchableOpacity style={styles.plusButton} onPress={handleCustomModalPress}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <CustomText style={styles.habitText}>Custom Habit</CustomText>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          label="Maybe later"
          onPress={() => {router.push("/home");}}
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

      {isWaterModalOpen && (
        <AddWaterHabitModal
          visible={isWaterModalOpen}
          onClose={() => setIsWaterModalOpen(false)}
        />
      )}
      {isOtherModalOpen && (
        <AddOtherHabitModal
          visible={isOtherModalOpen}
          onClose={() => setIsOtherModalOpen(false)}
          variant={variant}
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
    width: width > 760 ? width - 1200 : width - 40,
  },
  title: {
    color: "#1E3A5F",
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#1E3A5F",
    opacity: 0.7,
    fontSize: 16,
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
  welcomeContainer: {
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    color: "#1E3A5F",
    marginRight: 20,
    fontSize: 28,
    fontWeight: 400,
    marginBottom: 10,
    textAlign: "center",
  },
  userName: {
    color: "#1E3A5F",
    opacity: 0.7,
    fontSize: 20,
    fontWeight: "semibold",
    textAlign: "center",
  },
});
