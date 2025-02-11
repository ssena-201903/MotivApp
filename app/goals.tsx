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
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import CardGoalTodo from "@/components/cards/CardGoalTodo";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase.config";
import SectionHeader from "@/components/headers/SectionHeader";
import MovieIcon from "@/components/icons/MovieIcon";
import BookIcon from "@/components/icons/BookIcon";
import ActivityIcon from "@/components/icons/ActivityIcon";
import CarIcon from "@/components/icons/CarIcon";
import SellIcon from "@/components/icons/SellIcon";
import WalletIcon from "@/components/icons/WalletIcon";
import FoodIcon from "@/components/icons/FoodIcon";
import PlusIcon from "@/components/icons/PlusIcon";

type iconFamily = "fontawesome" | "ionicons" | "material-community";

interface Category {
  id: string;
  label: string;
  name: string;
  iconFamily: iconFamily;
}

const categories: Category[] = [
  {
    id: "Movie",
    label: "Movie",
    name: "movie",
    iconFamily: "material-community",
  },
  { id: "Book", label: "Book", name: "book", iconFamily: "material-community" },
  {
    id: "Activity",
    label: "Activity",
    name: "accessibility",
    iconFamily: "ionicons",
  },
  { id: "Place", label: "Place", name: "car", iconFamily: "ionicons" },
  { id: "Buy", label: "Buy", name: "wallet", iconFamily: "material-community" },
  { id: "Food", label: "Food", name: "food", iconFamily: "material-community" },
];

const { width } = Dimensions.get("window");

export default function Goals() {
  const { categoryId = "Movie" } = useLocalSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>(
    categoryId as string
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [percentDone, setPercentDone] = useState(0);

  // fetch goals
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

  // toggle modal
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // handle goal add
  const handleGoalAdd = async (data: any) => {
    await fetchGoals(); // update list after adding a new goal
  };

  // handleCalculatePercentDone
  const calculatePercentDone = (category: string) => {
    const filteredGoals = goals.filter((goal) => goal.category === category);
    const totalGoals = filteredGoals.length;
    if (totalGoals === 0) return 0;
    const completedGoals = filteredGoals.filter((goal) => goal.isDone).length;
    return Math.round((completedGoals / totalGoals) * 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            style={[
              styles.button,
              activeCategory === category.id ? styles.activeButton : {},
            ]}
            onPress={() => handleCategoryPress(category.id)}
            key={category.id}
          >
            {category.id === "Movie" && (
              <MovieIcon
                size={18}
                color={activeCategory === category.id ? "#1E3A5F" : "#888"}
                variant={activeCategory === category.id ? "fill" : "outlined"}
              />
            )}
            {category.id === "Book" && (
              <BookIcon
                size={22}
                color={activeCategory === category.id ? "#1E3A5F" : "#888"}
                variant={activeCategory === category.id ? "fill" : "outlined"}
              />
            )}
            {category.id === "Activity" && (
              <ActivityIcon
                size={24}
                color={activeCategory === category.id ? "#1E3A5F" : "#888"}
                variant={activeCategory === category.id ? "fill" : "outlined"}
              />
            )}
            {category.id === "Place" && (
              <CarIcon
                size={24}
                color={activeCategory === category.id ? "#1E3A5F" : "#888"}
                variant={activeCategory === category.id ? "fill" : "outlined"}
              />
            )}
            {category.id === "Buy" && (
              <WalletIcon
                size={22}
                color={activeCategory === category.id ? "#1E3A5F" : "#888"}
                variant={activeCategory === category.id ? "fill" : "outlined"}
              />
            )}
            {category.id === "Food" && (
              <FoodIcon
                size={22}
                color={activeCategory === category.id ? "#1E3A5F" : "#888"}
                variant={activeCategory === category.id ? "fill" : "outlined"}
              />
            )}
            <CustomText style={activeCategory === category.id ? styles.activeButtonText : styles.buttonText}>{category.label}</CustomText>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.contentHeader}>
        <SectionHeader
          text={activeCategory}
          percentDone={calculatePercentDone(activeCategory)}
          variant="other"
        />
      </View>

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
        {goals.length === 0 && (
          <View>
            <CustomText style={styles.noGoalsText}>No goals yet</CustomText>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
        <PlusIcon size={22} color="white" />
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
    flex: 1,
    backgroundColor: "#FCFCFC",
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  categoriesContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    width: width > 768 ? width - 900 : "100%",
    paddingVertical: 5,
    gap: 3,
    flexGrow: 1
  },
  button: {
    width: "13%",
    height: width > 768 ? 60 : 60,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width > 768 ? 20 : 4,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  buttonText: {
    color: "#1E3A5F",
    opacity: 0.6,
    fontSize: 10,
    marginTop: 6,
  },
  activeButton: {
    backgroundColor: "#E5EEFF",
  },
  activeButtonText: {
    color: "#1E3A5F",
    fontSize: 10,
    fontWeight: 600,
    marginTop: 6,
  },
  contentHeader: {
    width: width > 768 ? width - 860 : "100%",
    marginHorizontal: 20,
    alignSelf: "center",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 10,
    width: width > 768 ? width - 860 : "100%",
    paddingHorizontal: width > 768 ? "auto" : 40,
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
  noGoalsText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E3A5F",
    opacity: 0.7,
    marginTop: 40,
  },
});
