import React from "react";
import { View, StyleSheet, Dimensions, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      <Pressable style={styles.checkbox} onPress={() => onToggle(id)}>
        <Ionicons
          name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color="#264653"
        />
      </Pressable>

      <Text style={[styles.text, isCompleted && styles.strikethrough]}>
        {text}
      </Text>
      {!isCompleted && (
        <Pressable onPress={() => onDelete(id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#264653" />
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
    width: width - 40,
  },
  completedContainer: {
    backgroundColor: "#FFA38F",
  },
  checkbox: {
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#264653",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: "#264653",
  },
  deleteButton: {
    marginLeft: 12,
  },
});
