import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { CustomText } from "@/CustomText";

type Props = {
  type: string;
  inlineText: string;
};

export default function CardGoal({ type, inlineText }: Props) {
  return (
    <Pressable style={styles.container}>
      <Ionicons name={type} size={28} color="#264653" />
      <CustomText style={styles.inlineText}>{inlineText}</CustomText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#E5EEFF",
    width: 120,
    height: 78,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  inlineText: {
    color: "#264653",
    fontSize: 10,
    fontWeight: "semibold",
    marginTop: 6,
  },
});
