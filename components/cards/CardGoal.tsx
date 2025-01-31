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
      <Ionicons name={type} size={20} color="#1E3A5F" />
      <CustomText style={styles.inlineText}>{inlineText}</CustomText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    // display: "flex",
    // flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "center",
    // paddingHorizontal: 16,
    // paddingVertical: 12,
    // backgroundColor: "#E5EEFF",
    // width: width > 760 ? 300 : 120,
    // height: 60,
    // borderRadius: 20,
    display: "flex",
    flexDirection: width > 760 ? "column" : "row",
    width: width > 760 ? 290 : 117,
    height: width > 760 ? 70 : 60,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    // borderWidth: 0.5,
    // borderColor: "rgba(30, 58, 95, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
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
