import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import AddWaterHabitModal from "@/components/modals/AddWaterHabitModal";
import AddOtherHabitModal from "@/components/modals/AddOtherHabitModal";
import { CustomText } from "@/CustomText";
import { auth, db } from "@/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { router } from "expo-router";
import PlusIcon from "@/components/icons/PlusIcon";

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

  useEffect(() => {
    getUserInfos();
  }, []);

  const backgroundImage =
    Platform.OS === "web"
      ? require("@/assets/images/habitCardBg.png")
      : require("@/assets/images/mobileBg.png");

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.top}>
            <View style={styles.welcomeContainer}>
              <CustomText style={styles.welcomeText}>Welcome !</CustomText>
              <CustomText style={styles.userName}>{userName}</CustomText>
            </View>
            <CustomText style={styles.title}>Create Habit Streak</CustomText>
            <CustomText style={styles.subtitle}>
              Start a new habit and track your progress
            </CustomText>

            <View style={styles.habits}>
              <View style={styles.habitRow}>
                <TouchableOpacity
                  style={styles.plusButton}
                  onPress={handleWaterHabitModalPress}
                >
                  <PlusIcon size={16} color="#fff"/>
                </TouchableOpacity>
                <CustomText style={styles.habitText}>Water</CustomText>
              </View>

              <View style={styles.habitRow}>
                <TouchableOpacity
                  style={styles.plusButton}
                  onPress={handleBookModalPress}
                >
                  <PlusIcon size={16} color="#fff"/>
                </TouchableOpacity>
                <CustomText style={styles.habitText}>Book</CustomText>
              </View>

              <View style={styles.habitRow}>
                <TouchableOpacity
                  style={styles.plusButton}
                  onPress={handleSportModalPress}
                >
                  <PlusIcon size={16} color="#fff"/>
                </TouchableOpacity>
                <CustomText style={styles.habitText}>Sport</CustomText>
              </View>

              <View style={styles.habitRow}>
                <TouchableOpacity
                  style={styles.plusButton}
                  onPress={handleVocabularyModalPress}
                >
                  <PlusIcon size={16} color="#fff"/>
                </TouchableOpacity>
                <CustomText style={styles.habitText}>Vocabulary</CustomText>
              </View>

              <View style={styles.habitRow}>
                <TouchableOpacity
                  style={styles.plusButton}
                  onPress={handleCustomModalPress}
                >
                  <PlusIcon size={16} color="#fff"/>
                </TouchableOpacity>
                <CustomText style={styles.habitText}>Custom Habit</CustomText>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              label="Maybe later"
              onPress={() => {
                router.push("/home");
              }}
              variant="cancel"
              width="50%"
              height={50}
            />  
            <CustomButton
              label="Continue"
              onPress={() => {router.push("/home")}}
              variant="fill"
              width="50%"
              height={50}
              marginLeft={10}
            />
          </View>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: Platform.OS === "web" ? "center" : "space-between",
    alignItems: "center",
    position: "relative",
  },
  container: {
    width: "100%",
    height: "100%",
    maxWidth: 480,
    paddingHorizontal: 30,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "space-between",
  },
  top: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 40,
  },
  title: {
    fontSize: Platform.OS === "web" ? 32 : width * 0.08,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 40,
    fontSize: Platform.OS === "web" ? 16 : width * 0.04,
    color: "#1E3A5F",
    opacity: 0.8,
    textAlign: "center",
  },
  habits: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    // width: "100%",
    marginBottom: 20,
  },
  plusButton: {
    width: 40,
    height: 40,
    backgroundColor: "#1E3A5F",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  habitText: {
    fontSize: Platform.OS === "web" ? 18 : width * 0.04,
    fontWeight: "medium",
    color: "#1E3A5F",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  welcomeContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    color: "#1E3A5F",
    marginRight: 20,
    fontSize: 24,
    fontWeight: 500,
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
