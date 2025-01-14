import React from "react";
import { View, StyleSheet, Dimensions, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "@/CustomText";
import StarRating from "../icons/StarRating";

const { width } = Dimensions.get("window");

type Props = {
  id: string;
  text: string;
  category: "Movie" | "Book" | "Food" | "Place" | "Buy" | "Activity";
  isDone: boolean;
  rateNumber: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function CardTodo({
  id,
  text,
  isDone,
  category,
  rateNumber,
  onToggle,
  onDelete,
}: Props) {
  const handleRatingChange = (rating: number) => {
    setGoalData({ ...goalData, rating });
  };

  return (
    <View style={[styles.container, isDone && styles.completedContainer]}>
      <Pressable style={styles.checkbox} onPress={() => onToggle(id)}>
        <Ionicons
          name={isDone ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color="#1E3A5F"
        />
      </Pressable>

      <CustomText style={[styles.text, isDone && styles.strikethrough]}>
        {text}
      </CustomText>
      <View>
        <Ionicons name="add" size={16} color="#1E3A5F" />
        <CustomText>Add Quote</CustomText>
      </View>
      <StarRating rating={goalData.rating} onRatingChange={handleRatingChange} />
      {!isDone && (
        <Pressable onPress={() => onDelete(id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#1E3A5F" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5EEFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 8,
    width: width > 760 ? width - 600 : width - 40,
    height: 50,
  },
  completedContainer: {
    backgroundColor: "#B5C4E4",
  },
  checkbox: {
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#1E3A5F",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: "#1E3A5F",
  },
  deleteButton: {
    marginLeft: 12,
  },
});
