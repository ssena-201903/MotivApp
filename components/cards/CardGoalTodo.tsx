import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CustomText } from "@/CustomText";
import GoalDetailsModal from "@/components/modals/GoalDetailsModal";
import StarRating from "@/components/icons/StarRating";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase.config";
import BoxIcon from "../icons/BoxIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import InfoIcon from "@/components/icons/InfoIcon";
import BookIcon from "@/components/icons/BookIcon";

import { useLanguage } from "@/app/LanguageContext";

const { width } = Dimensions.get("window");

type CardGoalProps = {
  category: string;
  goal: any;
  onUpdate: () => void;
};

export default function CardGoalTodo({
  category,
  goal,
  onUpdate,
}: CardGoalProps) {
  const [isDone, setIsDone] = useState<boolean>(goal.isDone || false);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    goal.readingStatus || "not started"
  );
  const [rating, setRating] = useState(goal.rating || 0);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  // language context
  const { t, language, setLanguage } = useLanguage();

  const toggleCard = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const updateIsDone = !isDone;
      const updateReadingStatus =
        category === "Book" ? (updateIsDone ? "read" : "not started") : null;

      const goalRef = doc(db, "users", userId, "goals", goal.id);
      await updateDoc(goalRef, {
        isDone: updateIsDone,
        ...(category === "Book" && { readingStatus: updateReadingStatus }),
        finishedAt: updateIsDone ? new Date() : null,
      });

      setIsDone(updateIsDone);
      if (category === "Book")
        setSelectedStatus(updateReadingStatus || "not started");

      onUpdate(); // update list after updating
    } catch (error) {
      console.error("Error updating goal status: ", error);
    }
  };

  const handleReadingStatusChange = async (newStatus: string) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const updateIsDone = newStatus === "read";

      const goalRef = doc(db, "users", userId, "goals", goal.id);
      await updateDoc(goalRef, {
        readingStatus: newStatus,
        isDone: updateIsDone,
        finishedAt: updateIsDone ? new Date() : null,
      });
      setSelectedStatus(newStatus);
      setIsDone(updateIsDone);
      onUpdate(); // update list after updating
    } catch (error) {
      console.error("Error updating reading status: ", error);
    }
  };

  const handleRatingChange = async (newRating: number) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const goalRef = doc(db, "users", userId, "goals", goal.id);
      await updateDoc(goalRef, {
        rating: newRating,
      });
      setRating(newRating);
      onUpdate(); // update list after updating
    } catch (error) {
      console.error("Error updating rating: ", error);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp || !timestamp.seconds) return "-";
    const date = new Date(timestamp.seconds * 1000);
    return date.toISOString().split("T")[0];
  };

  const handleViewDetails = () => {
    setIsDetailsModalVisible(true);
  };

  const handleAddNote = () => {};

  return (
    <View style={isDone ? styles.completed : styles.container}>
      {/* for mobile screens (width <= 768) */}
      <View style={styles.mobileTop}>
        <View style={styles.mobileNameContainer}>
          <CustomText
            style={styles.nameOther}
            color="#1E3A5F"
            fontSize={16}
            type="semibold"
          >
            {goal.name}
          </CustomText>
        </View>
        <View style={styles.mobileTopRight}>
          <Pressable style={styles.addNote} onPress={handleAddNote}>
            <PlusIcon size={16} color="#1E3A5F" />
            <CustomText 
              style={styles.addNoteText}
              color="#1E3A5F"
              fontSize={12}
              type="medium"
            >
              {t("cardGoalTodo.addNote")}
            </CustomText>
          </Pressable>
          <Pressable style={styles.mobileCheckbox} onPress={toggleCard}>
            {isDone ? (
              <BoxIcon size={20} color="#1E3A5F" variant="fill" />
            ) : (
              <BoxIcon size={20} color="#1E3A5F" variant="outlined" />
            )}
          </Pressable>
        </View>
      </View>
      <View style={styles.mobileBottom}>
        {category === "Book" ? (
          <Picker
            selectedValue={selectedStatus}
            onValueChange={handleReadingStatusChange}
            style={styles.picker}
            dropdownIconColor="#1E3A5F"
          >
            <Picker.Item label="Not Started" value="not started" />
            <Picker.Item label="Reading" value="reading" />
            <Picker.Item label="Read" value="read" />
          </Picker>
        ) : (
          <CustomText 
            style={styles.createdAtText}
            color="#1E3A5F"
            fontSize={12}
            type="medium"
          >
            {formatDate(goal.createdAt)}
          </CustomText>
        )}
        <View style={styles.mobileRating}>
          <View style={styles.starContainer}>
            <StarRating rating={rating} onRatingChange={handleRatingChange} />
          </View>
          <Pressable style={styles.infoIcon} onPress={() => setIsDetailsModalVisible(true)}>
            <InfoIcon size={20} color="#1E3A5F" variant="outlined" />
          </Pressable>
        </View>
      </View>

      <GoalDetailsModal
        visible={isDetailsModalVisible}
        onClose={() => setIsDetailsModalVisible(false)}
        goal={goal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
    width: width > 768 ? width - 900 : width - 40,
    height: 100,
    display: "flex",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  completed: {
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
    width: width > 768 ? width - 900 : width - 40,
    height: 100,
    display: "flex",
    backgroundColor: "#E5EEFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  nameOther: {
    flex: 1,
    overflow: "hidden",
  },
  picker: {
    borderColor: "#1E3A5F",
    width: 110,
    height: 30,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "transparent",
    color: "#1E3A5F",
  },
  createdAtText: {
    opacity: 0.6,
  },
  addNote: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "auto",
    marginLeft: width > 768 ? 25 : 0,
    marginRight: width > 768 ? 0 : 10,
  },
  addNoteText: {
    marginLeft: 8,
    opacity: 0.9,
  },
  starContainer: {
    marginLeft: 10,
  },
  infoIcon: {
    marginLeft: 10,
    opacity: 0.8,
  },

  mobileTop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  mobileBottom: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  mobileNameContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "70%",
  },
  mobileTopRight: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  mobileCheckbox: {
    marginLeft: 20,
  },
  mobileRating: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
