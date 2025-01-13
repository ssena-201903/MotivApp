import React, { useState, useRef } from "react";
import { useLocalSearchParams } from 'expo-router';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const categories = [
  { id: "Movie", label: "Movie" },
  { id: "Book", label: "Book" },
  { id: "Activity", label: "Activity" },
  { id: "Place", label: "Place" },
  { id: "Buy", label: "Buy" },
  { id: "Food", label: "Food" },
];

const { width } = Dimensions.get("window");

export default function Goals () {
  const { categoryId = "Movie" } = useLocalSearchParams(); 
  const [activeCategory, setActiveCategory] = useState(categoryId);

  const handleCategoryPress = (categoryId: string) => {
    setActiveCategory(categoryId);
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
            <Text
              style={[
                activeCategory === category.id
                  ? styles.activeButtonText
                  : styles.inactiveButtonText,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.contentContainer}>
        <Text style={styles.categoryContent}>
          {`Selected Category: ${activeCategory}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FCFCFC",
  },
  scrollView: {
    marginBottom: 20,
  },
  menuContainer: {
    flexDirection: "row",
    // paddingHorizontal: 10,
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
    fontSize: 12,
    color: "#FCFCFC",
  },
  inactiveButtonText: {
    fontSize: 12,
    color: "#1E3A5F",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContent: {
    fontSize: 18,
    fontWeight: "400",
  },
});
