import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { CustomText } from "@/CustomText";
import AddGoalModal from "@/components/modals/AddGoalModal";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CardGoalTodo from "@/components/cards/CardGoalTodo";

const categories = [
  { id: "Movie", label: "Movie" },
  { id: "Book", label: "Book" },
  { id: "Activity", label: "Activity" },
  { id: "Place", label: "Place" },
  { id: "Buy", label: "Buy" },
  { id: "Food", label: "Food" },
];

const { width } = Dimensions.get("window");

export default function Goals() {
  const { categoryId = "Movie" } = useLocalSearchParams();
  const [activeCategory, setActiveCategory] = useState(categoryId);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCategoryPress = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={styles.scrollView}
        contentContainerStyle={styles.menuContainer}
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.button,
              activeCategory === category.id
                ? styles.activeButton
                : styles.inactiveButton,
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <CustomText
              style={[
                activeCategory === category.id
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              {category.label}
            </CustomText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.contentContainer}>
        <CardGoalTodo category="Book"/>
        <CardGoalTodo category="Movie"/>
        <CardGoalTodo category="Movie"/>
        <Text style={styles.categoryContent}>
          {`Selected Category: ${activeCategory}`}
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
          <Ionicons name="add" size={28} color="white"/>
        </TouchableOpacity>
      </View>
      <AddGoalModal
        visible={isModalVisible}
        categoryId={activeCategory}
        onClose={toggleModal}
        onAdd={(data) => console.log("Goal added:", data)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FCFCFC",
  },
  scrollView: {
    marginBottom: 20,
  },
  menuContainer: {
    flexDirection: "row",
  },
  button: {
    borderRadius: 30,
    borderWidth: 1,
    width: width > 760 ? 100 : 60,
    height: width > 760 ? 40 : 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width > 760 ? 20 : 4,
  },
  activeButton: {
    backgroundColor: "#1E3A5F",
    borderColor: "#1E3A5F",
  },
  inactiveButton: {
    backgroundColor: "transparent",
    borderColor: "#1E3A5F",
  },
  activeButtonText: {
    fontSize: width > 760 ? 14 : 12,
    color: "#FCFCFC",
  },
  inactiveButtonText: {
    fontSize: 12,
    color: "#1E3A5F",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  categoryContent: {
    fontSize: 18,
    fontWeight: "400",
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#1E3A5F",
    borderRadius: "50%",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  addButtonText: {
    color: "#FCFCFC",
    fontSize: 24,
    fontWeight: "bold",
  },
});
