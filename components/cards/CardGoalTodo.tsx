import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "@/CustomText";
import StarRating from "../icons/StarRating";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase.config";

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

  return (
    <View style={isDone ? styles.completed : styles.container}>
      <View style={styles.start}>
        <Pressable style={styles.checkbox} onPress={toggleCard}>
          <Ionicons
            name={isDone ? "checkbox" : "square-outline"}
            size={width > 760 ? 20 : 20}
            color="#1E3A5F"
          />
        </Pressable>
        <CustomText style={styles.name}>{goal.name}</CustomText>
        {category === "Book" && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={handleReadingStatusChange}
              style={styles.picker} 
              itemStyle={styles.pickerItem} 
              dropdownIconColor="#1E3A5F" 
            >
              <Picker.Item label="Not Started" value="not started" />
              <Picker.Item label="Reading" value="reading" />
              <Picker.Item label="Read" value="read" />
            </Picker>
          </View>
        )}
      </View>
      <View style={styles.end}>
        <Pressable style={styles.addNote}>
          <Ionicons name="add" size={24} color="#1E3A5F" />
          <CustomText style={styles.addNoteText}>Add Note</CustomText>
        </Pressable>
        <View style={styles.starRate}>
          <StarRating rating={rating} onRatingChange={handleRatingChange} />
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#1E3A5F"
            style={styles.infoIcon}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: width > 760 ? "row" : "column",
    flexWrap: width > 760 ? "nowrap" : "wrap",
    alignItems: width > 760 ? "center" : "flex-start",
    justifyContent: "space-between",
    borderColor: "rgba(30, 58, 95, 0.2)",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 8,
    width: width > 760 ? width - 900 : width - 40,
    height: width > 760 ? 50 : 110,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  completed: {
    backgroundColor: "#E5EEFF",
    flexDirection: width > 760 ? "row" : "column",
    flexWrap: width > 760 ? "nowrap" : "wrap",
    alignItems: width > 760 ? "center" : "flex-start",
    justifyContent: "space-between",
    borderColor: "rgba(30, 58, 95, 0.2)",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 8,
    width: width > 760 ? width - 900 : width - 40,
    height: width > 760 ? 50 : 110,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  start: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "auto",
  },
  end: {
    display: "flex",
    flexDirection: "row",
    justifyContent: width > 760 ? "space-between" : "space-between",
    alignItems: "center",
    width: width > 760 ? 320 : "100%",
    marginTop: width > 760 ? 0 : 0,
    paddingLeft: width > 760 ? 0 : 0,
  },
  checkbox: {
    marginRight: 10,
  },
  name: {
    color: "#1E3A5F",
    width: width > 760 ? 110 : "auto",
    fontSize: width > 760 ? 16 : 14,
    fontWeight: "600",
  },
  pickerContainer: {
    backgroundColor: "transparent",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  picker: {
    borderColor: "#1E3A5F",
    width: 110,
    height: 30,
    marginLeft: 20,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "transparent",
    color: "#1E3A5F",
  },
  pickerItem: {
    color: "#1E3A5F",
    fontSize: 14,
  },
  starRate: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  addNote: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "auto",
    marginLeft: width > 760 ? 20 : 0,
  },
  addNoteText: {
    marginLeft: 4,
    color: "#1E3A5F",
    fontSize: 14,
    fontWeight: "500",
  },
  infoIcon: {
    marginLeft: 10,
  },
});
