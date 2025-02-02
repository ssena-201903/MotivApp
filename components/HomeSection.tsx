import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import SectionHeader from "@/components/headers/SectionHeader";
import CardGoal from "@/components/cards/CardGoal";
import CardWaterHabit from "@/components/cards/CardWaterHabit";
import CardTodo from "@/components/cards/CardTodo";
import React, { useEffect, useState } from "react";
import { db, auth } from "@/firebase.config";
import { Timestamp } from "firebase/firestore";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { CustomText } from "@/CustomText";
import { router } from "expo-router";
import CardOtherHabit from "./cards/CardOtherHabit";

const { width } = Dimensions.get("window");

type Props = {
  variant: "goals" | "habits" | "todos";
};

export default function HomeSection({ variant }: Props) {
  const userId = auth.currentUser?.uid;
  const [currentTodos, setCurrentTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [todosPercentage, setTodosPercentage] = useState<number>(0);
  const [goals, setGoals] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); 
  const [isWaterCard, setIsWaterCard] = useState<boolean>(false);
  const [isBookCard, setIsBookCard] = useState<boolean>(false);
  const [isSportCard, setIsSportCard] = useState<boolean>(false);
  const [isCustomCard, setIsCustomCard] = useState<boolean>(false);
  const [isVocabularyCard, setIsVocabularyCard] = useState<boolean>(false);

  const fetchHabitDatas = async () => {
    try {
      const habitsRef = collection(db, `users/${userId}/habits`);
      const querySnapshot = await getDocs(habitsRef);

      querySnapshot.docs.forEach((doc) => {
        const habitDoc = doc.data();
        if (habitDoc.variant === "Water") {
          setIsWaterCard(true);
        } else if (habitDoc.variant === "Book") {
          setIsBookCard(true);
        } else if (habitDoc.variant === "Sport") {
          setIsSportCard(true);
        } else if (habitDoc.variant === "Custom") {
          setIsCustomCard(true);
        } else if (habitDoc.variant === "Vocabulary") {
          setIsVocabularyCard(true);
        }
      })
    } catch (error) {
      console.log("error fetching habits", error);
    }
  };

  useEffect(() => {
    fetchHabitDatas();
  }, [userId]);
    

  const calculateTodosPercentage = (todos: any[]) => {
    const totalTodos = todos.length;
    if (totalTodos === 0) return 0;
    const completedTodos = todos.filter((todo) => todo.isDone).length;
    return Math.round((completedTodos / totalTodos) * 100);
  };

  const calculateGoalsPercentage = (goals: any[]) => {
    const totalGoals = goals.length - 1;
    if (totalGoals === 0) return 0;
    const completedGoals = goals.filter((goal) => goal.isDone).length;
    return Math.round((completedGoals / totalGoals) * 100);
  };

  const fetchTodos = async () => {
    if (!userId) return;

    try {
      const todosRef = collection(db, "users", userId, "todos");
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      const startOfDayTimestamp = Timestamp.fromDate(startOfDay);
      const endOfDayTimestamp = Timestamp.fromDate(endOfDay);

      const q = query(
        todosRef,
        where("dueDate", ">=", startOfDay),
        where("dueDate", "<=", endOfDay)
      );
      const querySnapshot = await getDocs(q);
      const todosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCurrentTodos(todosData);
      setTodosPercentage(calculateTodosPercentage(todosData));
    } catch (error) {
      console.log("error fetching todos", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async () => {
    if (!userId) return;
    try {
      const goalsRef = collection(db, "users", userId, "goals");
      const querySnapshot = await getDocs(goalsRef);
      const goalsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(goalsData);
    } catch (error) {
      console.log("error fetching goals", error);
    }
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    if (!userId) return;
    try {
      const todoRef = doc(db, "users", userId, "todos", id);
      await updateDoc(todoRef, {
        isDone: !currentStatus,
      });
      const updatedTodos = currentTodos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !currentStatus } : todo
      );
      setCurrentTodos(updatedTodos);
      setTodosPercentage(calculateTodosPercentage(updatedTodos));
    } catch (error) {
      console.log("error toggling todo status", error);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!userId) return;
    try {
      const todoRef = doc(db, "users", userId, "todos", id);
      await deleteDoc(todoRef);
      const updatedTodos = currentTodos.filter((todo) => todo.id !== id);
      setCurrentTodos(updatedTodos);
      setTodosPercentage(calculateTodosPercentage(updatedTodos));
    } catch (error) {
      console.log("error deleting todo", error);
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId); 
    router.push({
      pathname: '/goals',
      params: { categoryId },
    });
  };
  

  useEffect(() => {
    if (variant === "todos") {
      fetchTodos();
    }
    if (variant === "goals") {
      fetchGoals();
    }
  }, [variant, userId]);

  const createHomeSection = () => {
    if (variant === "goals") {
      return (
        <>
          <SectionHeader text="Goals" percentDone={calculateGoalsPercentage(goals)} />
          <View style={styles.gridView}>
            <CardGoal
              type="videocam"
              inlineText="Movie"
              categoryId="Movie"
              onCategoryPress={handleCategoryPress}
            />
            <CardGoal
              type="car"
              inlineText="Place"
              categoryId="Place"
              onCategoryPress={handleCategoryPress}
            />
            <CardGoal
              type="fast-food"
              inlineText="Food"
              categoryId="Food"
              onCategoryPress={handleCategoryPress}
            />
            <CardGoal
              type="cash"
              inlineText="Buy"
              categoryId="Buy"
              onCategoryPress={handleCategoryPress}
            />
            <CardGoal
              type="accessibility"
              inlineText="Activity"
              categoryId="Activity"
              onCategoryPress={handleCategoryPress}
            />
            <CardGoal
              type="book"
              inlineText="Book"
              categoryId="Book"
              onCategoryPress={handleCategoryPress}
            />
          </View>
        </>
      );
    } else if (variant === "habits") {
      return (
        <>
          <SectionHeader text="Habits" percentDone={60} />
          <View style={styles.gridView}>
            {isWaterCard && (
              <CardWaterHabit
                userId={userId}
              />
            )}
            {isBookCard && (
              <CardOtherHabit
                userId={userId}
                variant="Book"
              />
            )}
            {isVocabularyCard && (
              <CardOtherHabit
                userId={userId}
                variant="Vocabulary"
              />
            )}
            {isSportCard && (
              <CardOtherHabit
                userId={userId}
                variant="Sport"
              />
            )}
            {isCustomCard && (
              <CardOtherHabit
                userId={userId}
                variant="Custom"
              />
            )}
          </View>
        </>
      );
    } else if (variant === "todos") {
      if (loading) {
        return <CustomText>Loading...</CustomText>;
      }
      return (
        <>
          <SectionHeader text="To-Do" percentDone={todosPercentage} />
          <ScrollView style={styles.todoView}>
            {currentTodos.map((todo) => (
              <CardTodo
                key={todo.id}
                id={todo.id}
                text={todo.text}
                isCompleted={todo.isDone}
                variant="todo"
                onToggle={() => toggleTodo(todo.id, todo.isDone)}
                onDelete={() => deleteTodo(todo.id)}
              />
            ))}
          </ScrollView>
        </>
      );
    }
  };

  return <View style={styles.container}>{createHomeSection()}</View>;
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    width: width > 760 ? width - 600 : width - 40,
    marginBottom: width > 760 ? 30 : 20,
  },
  todoView: {
    flexGrow: 1,
    width: width > 760 ? width - 600 : width - 40,
    height: 190,
    overflow: "hidden",
  },
  gridView: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: width > 760 ? width - 600 : width - 40,
    gap: width > 760 ? 10 : 8,
  },
});
