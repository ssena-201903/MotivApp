import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Dimensions, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "@/CustomText";
import { FontAwesome } from "@expo/vector-icons";
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
  const [goalNumber, setGoalNumber] = useState<number>(0);
  const [doneNumber, setDoneNumber] = useState<number>(0);

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
      case "Vocabulary":
        return {
          icon: isDone ? "copy" : "copy-outline", // Vocabulary için FontAwesome ikonu
          text: "Vocabulary",
        };
      case "Custom":
        return {
          icon: isDone ? "extension-puzzle" : "extension-puzzle-outline", // Custom için uygun ikon
          text: customText || "Özel",
        };
      default:
        return {
          icon: "add",
          text: "Default Habit",
        };
    }
  };

  // fetch habit data
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
          setDoneNumber(habitData.doneNumber || 0);
          setGoalNumber(habitData.goalNumber || 0);

          // Set subText based on variant
          switch (variant) {
            case "Sport":
            case "Book":
              setSubText(`${habitData.duration} min`);
              break;
            case "Vocabulary":
            case "Custom":
              setSubText(
                `${habitData.doneNumber}/${habitData.goalNumber} days`
              );
              break;
            default:
              setSubText("");
          }
        } else {
          console.error("No matching document found!");
        }
      } catch (error) {
        console.error("Error fetching habit data: ", error);
      }
    };

    fetchHabitData();
  }, [
    userId
  ]);

  // update habit data in firestore
  const updateHabit = async (
    isDone: boolean,
    newStreak: number,
    newDoneNumber?: number
  ) => {
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
          doneNumber: newDoneNumber,
        });

        // Yerel state'i güncelle
        setIsDone(isDone);
        setStreak(newStreak);
        setIsFeedbackVisible(isDone); // show feedback if done
        // setSubText(subText || "");
        setDoneNumber(newDoneNumber || 0);
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
            onPress: () => updateHabit(false, streak - 1, doneNumber - 1),
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
          onPress: () => updateHabit(true, streak + 1, doneNumber + 1),
        },
      ]);
    }
  };

  return (
    <View style={isDone ? styles.doneHabit : styles.container}>
      <View style={styles.leftView}>
        <Ionicons name={getCardProps().icon} size={22} color="#1E3A5F" />

        <CustomText style={styles.text}>{getCardProps().text}</CustomText>
      </View>
      <View style={styles.rigthView}>
        <CustomText style={styles.subText}>{subText}</CustomText>
        <View style={styles.streakContainer}>
          {streak > 13 ? (
            <FontAwesome name="tree" size={18} color="#1E3A5F" />
          ) : (
            <Ionicons name="leaf" size={18} color="#1E3A5F" />
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
    width: width > 760 ? 200 : 180,
    height: "auto",
    flexDirection: "row",
    alignItems: "center",
  },
  rigthView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 30,
    width: 145,
  },
  text: {
    color: "#1E3A5F",
    marginLeft: 12,
    fontWeight: "400",
    fontSize: 14,
  },
  subText: {
    color: "#1E3A5F",
    opacity: 0.6,
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
