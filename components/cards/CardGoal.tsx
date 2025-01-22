import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Pressable, Dimensions } from "react-native";
import { CustomText } from "@/CustomText";

const { width } = Dimensions.get('window');

type Props = {
  type: string;
  inlineText: string;
  categoryId: string; 
  onCategoryPress: (categoryId: string) => void; 
};

export default function CardGoal({ type, inlineText, categoryId, onCategoryPress }: Props) {
  return (
    <Pressable style={styles.container} onPress={() => onCategoryPress(categoryId)}>
      <Ionicons name={type} size={22} color="#1E3A5F" />
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
    height: 60,
    borderRadius: 20,
  },
  inlineText: {
    color: "#1E3A5F",
    fontSize: 10,
    fontWeight: "semibold",
    marginLeft: 10,
  },
});
