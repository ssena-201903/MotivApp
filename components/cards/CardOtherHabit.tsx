import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Dimensions, Alert } from "react-native";
import BookIcon from "@/components/icons/BookIcon";
import PuzzleIcon from "@/components/icons/PuzzleIcon";
import SportIcon from "@/components/icons/SportIcon";
import VocabularyIcon from "@/components/icons/VocabularyIcon";
import TreeIcon from "@/components/icons/TreeIcon";
import LeafIcon from "@/components/icons/LeafIcon";
import BoxIcon from "../icons/BoxIcon";
import { CustomText } from "@/CustomText";
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
}

interface HabitData {
  id: string;
  text: string;
  isDone: boolean;
  streakDays: number;
  duration: number;
  goalNumber: number;
  dailyAmount: number;
  doneNumber: number;
}

export default function CardOtherHabit({ variant, userId }: Props) {
  const [habits, setHabits] = useState<HabitData[]>([]);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState<boolean>(false);

  const fetchHabitData = async () => {
    try {
      const habitsRef = collection(db, `users/${userId}/habits`);
      const q = query(habitsRef, where("variant", "==", variant));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const habitsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as HabitData[];

        // Custom dışındaki variantlar için sadece ilk kartı al
        if (variant !== "Custom") {
          setHabits([habitsList[0]]);
        } else {
          // Custom için tüm kartları al
          setHabits(habitsList);
        }
      } else {
        setHabits([]);
      }
    } catch (error) {
      console.error("Error fetching habit data: ", error);
    }
  };

  useEffect(() => {
    fetchHabitData();
  }, [userId, variant]);

  const updateHabit = async (habitId: string, isDone: boolean, newStreak: number, newDoneNumber: number) => {
    try {
      const habitDocRef = doc(db, `users/${userId}/habits/${habitId}`);
      
      await updateDoc(habitDocRef, {
        isDone,
        streakDays: newStreak,
        doneNumber: newDoneNumber,
      });

      setIsFeedbackVisible(isDone);
      fetchHabitData();
    } catch (error) {
      console.error("Error updating habit: ", error);
    }
  };

  const handleDonePress = (habit: HabitData) => {
    if (habit.isDone) {
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
            onPress: () => updateHabit(
              habit.id,
              false,
              habit.streakDays - 1,
              habit.doneNumber - 1
            ),
          },
        ]
      );
    } else {
      Alert.alert(
        "Onay",
        "Bunu yapıldı olarak işaretlemek istiyor musunuz?",
        [
          {
            text: "Vazgeç",
            style: "cancel",
          },
          {
            text: "Evet",
            onPress: () => updateHabit(
              habit.id,
              true,
              habit.streakDays + 1,
              habit.doneNumber + 1
            ),
          },
        ]
      );
    }
  };

  const getSubTextType = (habit: HabitData) => {
    switch (variant) {
      case "Sport":
      case "Book":
      case "Custom":
        return `${habit.duration} minutes`;
      case "Vocabulary":
        return `${habit.dailyAmount} words`;
      default:
        return "";
    }
  };

  const getIcon = (isDone: boolean) => {
    switch (variant) {
      case "Book":
        return <BookIcon size={22} color="#1E3A5F" variant={isDone ? "fill" : "outlined"} />;
      case "Sport":
        return <SportIcon size={22} color="#1E3A5F" variant={isDone ? "fill" : "outlined"} />;
      case "Vocabulary":
        return <VocabularyIcon size={22} color="#1E3A5F" variant={isDone ? "fill" : "outlined"} />;
      case "Custom":
        return <PuzzleIcon size={22} color="#1E3A5F" variant={isDone ? "fill" : "outlined"} />;
      default:
        return null;
    }
  };

  const renderHabitCard = (habit: HabitData) => (
    <View key={habit.id} style={habit.isDone ? styles.doneHabit : styles.container}>
      <View style={styles.leftView}>
        {getIcon(habit.isDone)}
        <CustomText style={styles.text}>
          {variant === "Custom" ? habit.text : variant}
        </CustomText>
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.top}>
          <View style={styles.textContainer}>
            <CustomText style={styles.subTextDone}>{`${habit.goalNumber} days`}</CustomText>
            <View style={styles.streakContainer}>
              {habit.streakDays > 13 ? (
                <TreeIcon size={18} color="#1E3A5F" variant="fill" />
              ) : (
                <LeafIcon size={18} color="#1E3A5F" variant={habit.isDone ? "fill" : "outlined"} />
              )}
              <CustomText style={styles.streakText}>{habit.streakDays}</CustomText>
            </View>
          </View>
          <Pressable onPress={() => handleDonePress(habit)}>
            <BoxIcon size={20} color="#1E3A5F" variant={habit.isDone ? "fill" : "outlined"} />
          </Pressable>
        </View>
        <View style={styles.bottom}>
          <CustomText style={styles.subTextType}>
            {getSubTextType(habit)}
          </CustomText>
        </View>
      </View>
    </View>
  );

  return (
    <>
      {habits.map(renderHabitCard)}
      <CardFeedback
        isVisible={isFeedbackVisible}
        text={`Congratulations! You have completed the daily goal...`}
        type="celebration"
        onComplete={() => setIsFeedbackVisible(false)}
        isStreak={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    minWidth: "100%",
    minHeight: 70,
    // backgroundColor: "#F4F4F4",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 3,
    borderWidth: 1,
    borderColor: "#D1D4D9",
    flex: 1,
  },
  doneHabit: {
    backgroundColor: "#E5EEFF",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    minWidth: "100%",
    minHeight: 70,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 3,
    borderWidth: 1,
    borderColor: "#D1D4D9",
    flex: 1,
  },
  leftView: {
    width: "35%",
    height: "auto",
    flexDirection: "row",
    alignItems: "center",
  },
  rightContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "65%",
    height: "100%",
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  subTextDone: {
    color: "#1E3A5F",
    opacity: 0.8,
    fontSize: width > 760 ? 14 : 12,
    fontWeight: "200",
    marginRight: 20,
  },
  subTextType: {
    color: "#1E3A5F",
    opacity: 0.6,
    fontSize: width > 760 ? 10 : 10,
    fontWeight: "400",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    fontSize: width > 760 ? 16 : 14,
    color: "#1E3A5F",
    fontWeight: "semibold",
    marginLeft: 2,
  },
  text: {
    color: "#1E3A5F",
    marginLeft: 12,
    fontWeight: "400",
    fontSize: 14,
  },
});
