import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { CustomText } from "@/CustomText";
import AddGoalModal from "@/components/modals/AddGoalModal";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CardGoalTodo from "@/components/cards/CardGoalTodo";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase.config";

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
  const [goals, setGoals] = useState<any[]>([]);

  const fetchGoals = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.log("user did not login");
        return;
      }

      const goalsRef = collection(db, "users", userId, "goals");
      const q = query(goalsRef, where("category", "==", activeCategory));
      const querySnapshot = await getDocs(q);

      const fetchedGoals = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(fetchedGoals);
    } catch (error) {
      console.error("Error fetching goals: ", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [activeCategory]);

  const handleCategoryPress = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleGoalAdd = async (data: any) => {
    await fetchGoals(); // update list after adding a new goal
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
  
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {goals.map((goal) => (
          <CardGoalTodo
            key={goal.id}
            goal={goal}
            category={activeCategory}
            onUpdate={fetchGoals}
          />
        ))}
      </ScrollView>
  
      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
  
      <AddGoalModal
        visible={isModalVisible}
        categoryId={activeCategory}
        onClose={toggleModal}
        onAdd={handleGoalAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FCFCFC",
    paddingTop: 20,
    paddingHorizontal: 20,
    height: "100%",
  },
  scrollView: {
    width: "100%",
  },
  menuContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 40,
    paddingHorizontal: 10,
    // backgroundColor: "blue",
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
    width: width > 760 ? width - 600 : width - 40,
    height: "80%",
    marginTop: 0,
    overflow: "hidden",
  },
  addButton: {
    backgroundColor: "#1E3A5F",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
