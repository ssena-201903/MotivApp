import { StyleSheet, Pressable, Dimensions } from "react-native";
import { CustomText } from "@/CustomText";
import MovieIcon from "../icons/MovieIcon";
import CarIcon from "../icons/CarIcon";
import FoodIcon from "../icons/FoodIcon";
import WalletIcon from "../icons/WalletIcon";
import ActivityIcon from "../icons/ActivityIcon";
import BookIcon from "../icons/BookIcon";
import SellIcon from "../icons/SellIcon";

const { width } = Dimensions.get("window");

type Props = {
  inlineText: string;
  categoryId: string;
  onCategoryPress: (categoryId: string) => void;
  iconFamily?: "fontawesome" | "ionicons" | "material-community";
};

export default function CardGoal({
  inlineText,
  categoryId,
  onCategoryPress,
}: Props) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => onCategoryPress(categoryId)}
    >
      {categoryId === "Movie" && (
        <MovieIcon size={18} color="#1E3A5F" variant="fill" />
      )}
      {categoryId === "Place" && (
        <CarIcon size={22} color="#1E3A5F" variant="fill" />
      )}
      {categoryId === "Food" && (
        <FoodIcon size={22} color="#1E3A5F" variant="fill" />
      )}
      {categoryId === "Buy" && (
        <WalletIcon size={22} color="#1E3A5F" variant="fill" />
      )}
      {categoryId === "Activity" && (
        <ActivityIcon size={26} color="#1E3A5F" variant="fill" />
      )}
      {categoryId === "Book" && (
        <BookIcon size={22} color="#1E3A5F" variant="fill" />
      )}
      <CustomText style={styles.inlineText}>{inlineText}</CustomText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: width > 768 ? "column" : "row",
    width: "31%",
    height: width > 768 ? 80 : 65,
    // backgroundColor: "#F4F4F4",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    // shadowColor: "#1E3A5F",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 3,
    // borderWidth: 1,
    // borderColor: "#D1D4D9",
  },
  inlineText: {
    color: "#1E3A5F",
    fontSize: 12,
    fontWeight: "400",
    marginLeft: width > 768 ? 0 : 8,
    marginTop: width > 768 ? 8 : 0,
  },
});
