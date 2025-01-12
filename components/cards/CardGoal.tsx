import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Text, Pressable, Dimensions } from "react-native";
import { CustomText } from "@/CustomText";

const { width } = Dimensions.get('window');

type Props = {
  type: string;
  inlineText: string;
};

export default function CardGoal({ type, inlineText }: Props) {
  return (
    <Pressable style={styles.container}>
      <Ionicons name={type} size={24} color="#1E3A5F" />
      <CustomText style={styles.inlineText}>{inlineText}</CustomText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#E5EEFF",
    width: width > 760 ? 300 : 120,
    height: width > 760 ? 60 : 60,
    borderRadius: 20,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.07,
    // shadowRadius: 4,
  },
  inlineText: {
    color: "#1E3A5F",
    fontSize: 10,
    fontWeight: "semibold",
    marginLeft: 10,
  },
});
