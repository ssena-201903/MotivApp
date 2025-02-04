import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { CustomText } from "@/CustomText";
import GoalDetailsModal from "@/components/modals/GoalDetailsModal";
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
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

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

  const handleViewDetails = () => {
    setIsDetailsModalVisible(true);
  };

  return (
    <View style={isDone ? styles.completed : styles.container}>
      <View style={styles.start}>
        <View style={styles.startNameContainer}>
          <Pressable style={styles.checkbox} onPress={toggleCard}>
            <Ionicons
              name={isDone ? "checkbox" : "square-outline"}
              size={width > 760 ? 22 : 22}
              color="#1E3A5F"
            />
            {/* <FontAwesome
            name={isDone ? "check-square" : "square-o"}
            size={width > 760 ? 22 : 22}
            color="#1E3A5F"
          /> */}
          </Pressable>
          <CustomText
            style={category === "Book" ? styles.nameBook : styles.nameOther}
          >
            {goal.name}
          </CustomText>
        </View>
        {/* {category === "Book" && (
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
        )} */}
        <Pressable style={styles.addNote}>
          {/* <Ionicons name="add" size={22} color="#1E3A5F" /> */}
          <FontAwesome name="plus" size={20} color="#1E3A5F" />
          <CustomText style={styles.addNoteText}>Add Note</CustomText>
        </Pressable>
        {/* {category !== "Book" && (
          <CustomText style={styles.textCreated}>{goal.created}</CustomText>
        )} */}
      </View>
      <View style={styles.end}>
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
        <View style={styles.starRate}>
          <StarRating rating={rating} onRatingChange={handleRatingChange} />
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#1E3A5F"
            style={styles.infoIcon}
            onPress={handleViewDetails}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: width > 760 ? "row" : "column",
    flexWrap: width > 760 ? "nowrap" : "wrap",
    alignItems: width > 760 ? "center" : "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
    width: width > 760 ? width - 900 : width - 40,
    height: width > 760 ? 60 : 100,
    display: "flex",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    // flex: 1,
  },
  completed: {
    flexDirection: width > 760 ? "row" : "column",
    flexWrap: width > 760 ? "nowrap" : "wrap",
    alignItems: width > 760 ? "center" : "flex-start",
    justifyContent: "space-between",
    // paddingHorizontal: 16,
    // paddingVertical: 12,
    marginBottom: 10,
    width: width > 760 ? width - 900 : width - 40,
    height: width > 760 ? 60 : 100,
    display: "flex",
    backgroundColor: "#E5EEFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    // flex: 1,
  },
  start: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width > 760 ? "auto" : "100%",
  },
  end: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: width > 760 ? "auto" : "100%",
    marginTop: width > 760 ? 0 : 0,
    paddingLeft: width > 760 ? 0 : 0,
  },
  startNameContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    color: "#1E3A5F",
    width: 190,
  },
  checkbox: {
    marginRight: 10,
  },
  nameBook: {
    color: "#1E3A5F",
    width: 120,
    // backgroundColor: "yellow",
    fontSize: width > 760 ? 16 : 16,
    fontWeight: "600",
    overflow: "hidden",
  },
  nameOther: {
    color: "#1E3A5F",
    width: 200,
    fontSize: width > 760 ? 16 : 16,
    fontWeight: "600",
    overflow: "hidden",

    // backgroundColor: "yellow",
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
    // marginRight: 20,
  },
  addNote: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "auto",
    marginLeft: width > 760 ? 25 : 0,
  },
  addNoteText: {
    marginLeft: 8,
    color: "#1E3A5F",
    opacity: 0.9,
    fontSize: 12,
    fontWeight: "500",
  },
  infoIcon: {
    marginLeft: 20,
    opacity: 0.6,
  },
});
