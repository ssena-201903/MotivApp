import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Dimensions, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "@/CustomText";

// import { Trees } from "lucide-react-native"; // Trees icon from lucide
import { FontAwesome } from '@expo/vector-icons';

import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase.config";
import CardFeedback from "./CardFeedback";

const { width } = Dimensions.get("window");

interface Props {
  variant: "Sport" | "Book" | "Vocabulary" | "Custom";
  userId: string;
  customText?: string;
}

export default function CardOtherHabit({ variant, userId, customText }: Props) {
  const [isDone, setIsDone] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState<boolean>(false);
  const [subText, setSubText] = useState<string>("");

  // get cards text and icon props
  const getCardProps = () => {
    switch (variant) {
      case "Sport":
        return {
          icon: isDone ? "barbell" : "barbell-outline",
          text: "Sport",
        };
      case "Book":
        return {
          icon: isDone ? "book" : "book-outline",
          text: "Book",
        };
      // case "Vocabulary":
      //   return {
      //     icon: isDone ? "book" : "book-outline", // Vocabulary için uygun ikon
      //     text: "Vocabulary",
      //   };
      case "Custom":
        return {
          icon: isDone ? "create" : "create-outline", // Custom için uygun ikon
          text: customText || "Özel",
        };
      default:
        return {
          icon: "add",
          text: "Default Habit",
        };
    }
  };

  // fetch habit data from firestore
  useEffect(() => {
    const fetchHabitData = async () => {
      try {
        const habitsRef = collection(db, `users/${userId}/habits`);
        let q;

        // get query for custom variant by customText
        if (variant === "Custom" && customText) {
          q = query(habitsRef, where("customText", "==", customText));
        } else {
          q = query(habitsRef, where("variant", "==", variant));
        }

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const habitDoc = querySnapshot.docs[0];
          const habitData = habitDoc.data();

          // update local state with fetched data
          setIsDone(habitData.isDone || false);
          setStreak(habitData.streakDays || 0);
          setSubText(habitData.duration || "");
        } else {
          console.error("No matching document found!");
        }
      } catch (error) {
        console.error("Error fetching habit data: ", error);
      }
    };

    fetchHabitData();
  }, [userId, variant, customText, isDone, streak, subText]);

  // update habit data in firestore
  const updateHabit = async (isDone: boolean, newStreak: number, subText?: string) => {
    try {
      const habitsRef = collection(db, `users/${userId}/habits`);
      let q;

      // get query for custom variant by customText
      if (variant === "Custom" && customText) {
        q = query(habitsRef, where("customText", "==", customText));
      } else {
        q = query(habitsRef, where("variant", "==", variant));
      }

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const habitDoc = querySnapshot.docs[0];
        const habitDocRef = doc(db, `users/${userId}/habits/${habitDoc.id}`);

        // update doc in firestore
        await updateDoc(habitDocRef, {
          isDone,
          streakDays: newStreak,
          duration: subText,
        });

        // Yerel state'i güncelle
        setIsDone(isDone);
        setStreak(newStreak);
        setIsFeedbackVisible(isDone); // show feedback if done
        setSubText(subText || "");
      } else {
        console.error("No matching document found!");
      }
    } catch (error) {
      console.error("Error updating habit: ", error);
    }
  };

  // get sub text for variant
  const getFeedbackProps = () => {
    if (streak === 14) {
      return {
        text: `Congratulations! You have completed the ${variant} for 14 days!`,
      };
    } else {
      return {
        text: "Congratulations! You have completed the Water Goal...",
      };
    }
  };

  // const handleShowFeedback = () => {
  //   setIsFeedbackVisible(true); // show feedback
  // };

  // show alert for done press
  const handleDonePress = () => {
    if (isDone) {
      // if already done, ask for undo
      Alert.alert(
        "Geri Alma",
        "Bunu yapılmamış olarak işaretlemek istiyor musunuz?",
        [
          {
            text: "Vazgeç",
            style: "cancel",
          },
          {
            text: "Evet",
            onPress: () => updateHabit(false, streak - 1),
          },
        ]
      );
    } else {
      // if not done, ask for done
      Alert.alert("Onay", "Bunu yapıldı olarak işaretlemek istiyor musunuz?", [
        {
          text: "Vazgeç",
          style: "cancel",
        },
        {
          text: "Evet",
          onPress: () => updateHabit(true, streak + 1),
        },
      ]);
    }
  };

  return (
    <View style={isDone ? styles.doneHabit : styles.container}>
      <View style={styles.leftView}>
        {variant === "Vocabulary" ? (
          <FontAwesome name="card-heart" size={22} color="#1E3A5F" />
        ) : null}
        <Ionicons name={getCardProps().icon} size={22} color="#1E3A5F" />
        <CustomText style={styles.text}>{getCardProps().text}</CustomText>
      </View>
      <View style={styles.rigthView}>
        <CustomText style={styles.subText}>
          {variant}
          </CustomText>
        <View style={styles.streakContainer}>
          {streak > 13 ? (
            <FontAwesome name="tree" size={18} color="#1E3A5F" />
          ) : (
            <Ionicons
              name="leaf"
              size={18}
              color="#1E3A5F"
            />
          )}
          <CustomText style={styles.streakText}>{streak}</CustomText>
        </View>
        <Pressable
          style={{
            height: 50,
            width: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handleDonePress}
        >
          <Ionicons
            name={isDone ? "checkbox" : "add"}
            size={isDone ? 22 : 28}
            color="#1E3A5F"
          />
        </Pressable>
      </View>

      {/* Feedback modal */}
      <CardFeedback
        isVisible={isFeedbackVisible}
        text={getFeedbackProps().text}
        type="celebration"
        onComplete={() => setIsFeedbackVisible(false)}
        isStreak={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width > 760 ? 440 : width - 40,
    height: width > 760 ? 55 : 50,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  doneHabit: {
    backgroundColor: "#E5EEFF",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width > 760 ? 440 : width - 40,
    height: width > 760 ? 55 : 50,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  leftView: {
    flexDirection: "row",
    alignItems: "center",
  },
  rigthView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 30,
    width: 70,
  },
  text: {
    color: "#1E3A5F",
    marginLeft: 12,
    fontWeight: "400",
    fontSize: 14,
  },
  subText: {
    color: "#1E3A5F",
    fontWeight: "200",
    overflow: "visible",
    fontSize: width > 760 ? 14 : 12,
    marginRight: 20,
  },
  streakContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 30,
    width: 30,
    marginRight: 20,
  },
  streakText: {
    color: "#1E3A5F",
    fontWeight: "semibold",
    marginLeft: 2,
    fontSize: width > 760 ? 16 : 14,
  },
});
