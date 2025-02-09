import React from "react";
import { View, StyleSheet, Dimensions, Pressable, Text } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import BoxIcon from "../icons/BoxIcon";

const { width } = Dimensions.get("window");

type Props = {
  id: string;
  text: string;
  variant: "todo" | "birthday";
  isCompleted: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function CardTodo({
  id,
  text,
  isCompleted,
  variant,
  onToggle,
  onDelete,
}: Props) {
  return (
    <View style={[styles.container, isCompleted && styles.doneTodo]}>
      <Text style={[styles.text, isCompleted && styles.strikethrough]}>
        {text}
      </Text>
      <View style={styles.rigthContainer}>
        {!isCompleted && (
          <Pressable onPress={() => onDelete(id)} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color="#1E3A5F" />
          </Pressable>
        )}
        <Pressable onPress={() => onToggle(id)}>
          {/* <Ionicons
          name={isCompleted ? "checkbox" : "add"}
          size={isCompleted ? 22 : 28}
          color="#1E3A5F"
        /> */}
          {/* <FontAwesome
            name={isCompleted ? "check" : "square-o"}
            size={isCompleted ? 22 : 24}
            color="#1E3A5F"
          /> */}
          <BoxIcon
            size={22}
            color="#1E3A5F"
            variant={isCompleted ? "fill" : "outlined"}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    minHeight: 60,
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 3,
    borderWidth: 0.5,
    borderColor: "#D1D4D9",
    flex: 1,
  },
  doneTodo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 60,
    backgroundColor: "#E5EEFF",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 3,
    borderWidth: 0.5,
    borderColor: "#D1D4D9",
    flex: 1,
  },
  completedContainer: {
    backgroundColor: "#B5C4E4",
  },
  rigthContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    height: 30,
    width: 85,
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
    marginRight: 20,
    opacity: 0.85,
  },
});
