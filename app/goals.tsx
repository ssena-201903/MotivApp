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
            {category.iconFamily === "fontawesome" && (
              <FontAwesome
                name={
                  activeCategory === category.id
                    ? category.name
                    : `${category.name}-outline`
                }
                size={22}
                color="#1E3A5F"
              />
            )}
            {category.iconFamily === "ionicons" && (
              <Ionicons
                name={
                  activeCategory === category.id
                    ? category.name
                    : `${category.name}-outline`
                }
                size={22}
                color="#1E3A5F"
              />
            )}
            {category.iconFamily === "material-community" && (
              <MaterialCommunityIcons
                name={
                  activeCategory === category.id
                    ? category.name
                    : `${category.name}-outline`
                }
                size={22}
                color="#1E3A5F"
              />
            )}
            <CustomText style={styles.buttonText}>{category.label}</CustomText>
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
    flex: 1,
    backgroundColor: "#FCFCFC",
    paddingTop: 20,
    alignItems: "center",
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: width > 760 ? "auto" : 10,
  },
  button: {
    width: width > 760 ? 100 : 60,
    height: width > 760 ? 60 : 60,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width > 760 ? 20 : 4,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    shadowColor: "#1E3A5F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#1E3A5F",
    opacity: 0.6,
    fontSize: 10,
    marginTop: 4,
  },
  activeButton: {
    backgroundColor: "#E5EEFF",
  },
  contentHeader: {
    width: width > 760 ? width - 860 : "auto",
    marginHorizontal: "auto",
    alignSelf: "center",
  },
  contentContainer: {
    flexGrow: 1,
    width: width > 760 ? width - 900 : width - 40,
    marginHorizontal: "auto",
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
