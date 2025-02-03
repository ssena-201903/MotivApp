import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Pressable, Dimensions } from "react-native";
import { CustomText } from "@/CustomText";

const { width } = Dimensions.get('window');

type Props = {
  type: string;
  inlineText: string;
  categoryId: string; 
  onCategoryPress: (categoryId: string) => void; 
  iconFamily?: "fontawesome" | "ionicons" | "material-community";
};

export default function CardGoal({ type, inlineText, categoryId, onCategoryPress, iconFamily }: Props) {
  return (
    <Pressable style={styles.container} onPress={() => onCategoryPress(categoryId)}>
      {iconFamily === "fontawesome" && (
        <FontAwesome name={type} size={18} color="#1E3A5F" />
      )}
      {iconFamily === "ionicons" && (
        <Ionicons name={type} size={22} color="#1E3A5F" />
      )}
      {iconFamily === "material-community" && (
        <MaterialCommunityIcons name={type} size={22} color="#1E3A5F" />
      )}
      <CustomText style={styles.inlineText}>{inlineText}</CustomText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: width > 760 ? "column" : "row",
    width: width > 760 ? 290 : 117,
    height: width > 760 ? 70 : 65,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1E3A5F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inlineText: {
    color: "#1E3A5F",
    fontSize: 10,
    fontWeight: "semibold",
    marginLeft: width > 760 ? 0 : 8,
    marginTop: width > 760 ? 8 : 0,
  },
});
