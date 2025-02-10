import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import BookIcon from "@/components/icons/BookIcon";
import SportIcon from "@/components/icons/SportIcon";
import VocabularyIcon from "@/components/icons/VocabularyIcon";
import TreeIcon from "@/components/icons/TreeIcon";
import LeafIcon from "@/components/icons/LeafIcon";
import BoxIcon from "@/components/icons/BoxIcon";
import SparklesIcon from "../icons/SparklesIcon";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
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
  const [isConfirmationVisible, setIsConfirmationVisible] =
    useState<boolean>(false);
  const [ConfirmationModalData, setIsConfirmationModalData] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });

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

        // get the first habit if variant is not "Custom"
        if (variant !== "Custom") {
          setHabits([habitsList[0]]);
        } else {
          // set all habits if variant is "Custom"
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

  const updateHabit = async (
    habitId: string,
    isDone: boolean,
    newStreak: number,
    newDoneNumber: number
  ) => {
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
      setIsConfirmationModalData({
        title: "Undo Action",
        message: "Are you sure you want to mark this as not done?",
        onConfirm: () =>
          updateHabit(
            habit.id,
            false,
            habit.streakDays - 1,
            habit.doneNumber - 1
          ),
      });
    } else {
      setIsConfirmationModalData({
        title: "Complete Action",
        message: "Are you sure you want to mark this as done?",
        onConfirm: () =>
          updateHabit(
            habit.id,
            true,
            habit.streakDays + 1,
            habit.doneNumber + 1
          ),
      });
    }
    setIsConfirmationVisible(true);
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
        return (
          <BookIcon
            size={22}
            color={isDone ? "#1E3A5F" : "#1E3A5FCC"}
            variant="fill"
          />
        );
      case "Sport":
        return (
          <SportIcon
            size={22}
            color={isDone ? "#1E3A5F" : "#1E3A5FCC"}
            variant="fill"
          />
        );
      case "Vocabulary":
        return (
          <VocabularyIcon
            size={26}
            color={isDone ? "#1E3A5F" : "#1E3A5FCC"}
            variant="fill"
          />
        );
      case "Custom":
        return (
          <SparklesIcon
            size={22}
            color={isDone ? "#1E3A5F" : "#1E3A5FCC"}
            variant="fill"
          />
        );
      default:
        return null;
    }
  };

  const renderHabitCard = (habit: HabitData) => (
    <View
      key={habit.id}
      style={habit.isDone ? styles.doneHabit : styles.container}
    >
      <View style={styles.leftView}>
        <View style={styles.leftIconContainer}>{getIcon(habit.isDone)}</View>
        <View style={styles.leftTextContainer}>
          <CustomText style={styles.leftText}>
            {variant === "Custom" ? habit.text : variant}
          </CustomText>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.top}>
          <View style={styles.textContainer}>
            <CustomText
              style={styles.subTextDone}
            >{`${habit.goalNumber} days`}</CustomText>
            <View style={styles.streakContainer}>
              {habit.streakDays > 20 ? (
                <TreeIcon
                  size={22}
                  color={habit.isDone ? "#1E3A5F" : "#1E3A5FCC"}
                  variant={habit.isDone ? "fill" : "outlined"}
                  type="plural"
                />
              ) : habit.streakDays > 13 ? (
                <TreeIcon
                  size={22}
                  color={habit.isDone ? "#1E3A5F" : "#1E3A5FCC"}
                  variant={habit.isDone ? "fill" : "outlined"}
                  type="single"
                />
              ) : (
                <LeafIcon
                  size={18}
                  color={habit.isDone ? "#1E3A5F" : "#1E3A5FCC"}
                  variant={habit.isDone ? "fill" : "outlined"}
                />
              )}
              <CustomText style={styles.streakText}>
                {habit.streakDays}
              </CustomText>
            </View>
          </View>
          <Pressable onPress={() => handleDonePress(habit)}>
            <BoxIcon
              size={20}
              color="#1E3A5F"
              variant={habit.isDone ? "fill" : "outlined"}
            />
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
      <ConfirmationModal
        visible={isConfirmationVisible}
        title={ConfirmationModalData.title}
        message={ConfirmationModalData.message}
        onConfirm={() => {
          ConfirmationModalData.onConfirm();
          setIsConfirmationVisible(false);
        }}
        onCancel={() => setIsConfirmationVisible(false)}
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
    width: "50%",
    height: "auto",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  leftIconContainer: {
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  leftTextContainer: {
    flex: 1,
    overflow: "hidden",
  },
  leftText: {
    color: "#1E3A5F",
    fontWeight: "400",
    fontSize: 14,
  },
  rightContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "50%",
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
});
