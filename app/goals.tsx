import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import CustomButton from "@/components/CustomButton"; 
const categories = [
  { id: 'Movie', label: 'Movie' },
  { id: 'Book', label: 'Book' },
  { id: 'Activity', label: 'Activity' },
  { id: 'Place', label: 'Place' },
  { id: 'Buy', label: 'Buy' },
  { id: 'Food', label: 'Food' },
];

const { width } = Dimensions.get('window');

export default function GoalsScreen() {
    const router = useRouter();
    const categoryId = router.params?.categoryId || 'Movie';
    const [activeCategory, setActiveCategory] = useState(categoryId); // default active category

  // update active category
  const handleCategoryPress = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        {categories.map((category) => (
          <CustomButton
            key={category.id}
            label={activeCategory === category.id ? category.label : category.id} // active text
            onPress={() => handleCategoryPress(category.id)} 
            variant={activeCategory === category.id ? "fill" : "cancel"} // active variant
            width={100}  
            height={40}  
          />
        ))}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.categoryContent}>
          {`Selected Category: ${activeCategory}`}
        </Text>
        {/* special content for category */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FCFCFC",
    height: "100%",
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: width > 760 ? "auto" : 20,
    width: width > 760 ? width - 800 : width - 40,
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
