import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Pressable, Dimensions } from "react-native";
import { CustomText } from "@/CustomText";
import MovieIcon from "../icons/MovieIcon";
import CarIcon from "../icons/CarIcon";
import FoodIcon from "../icons/FoodIcon";
import WalletIcon from "../icons/WalletIcon";
import ActivityIcon from "../icons/ActivityIcon";
import BookIcon from "../icons/BookIcon";
import SellIcon from "../icons/SellIcon";

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
      {categoryId === "Movie" && (
        <MovieIcon size={20} color="#1E3A5F" variant="fill"/>
      )}
      {categoryId === "Place" && (
        <CarIcon size={24} color="#1E3A5F" variant="fill"/>
      )}
      {categoryId === "Food" && (
        <FoodIcon size={28} color="#1E3A5F" variant="fill"/>
      )}
      {categoryId === "Buy" && (
        <SellIcon size={24} color="#1E3A5F" variant="fill"/>
      )}
      {categoryId === "Activity" && (
        <ActivityIcon size={28} color="#1E3A5F" variant="fill"/>
      )}
      {categoryId === "Book" && (
        <BookIcon size={24} color="#1E3A5F" variant="fill"/>
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
