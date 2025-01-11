import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import SectionHeader from "@/components/headers/SectionHeader";
import CardGoal from "@/components/cards/CardGoal";
import CardHabit from "@/components/cards/CardHabit";
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

const { width } = Dimensions.get("window");

type Props = {
  variant: "goals" | "habits" | "todos";
};

export default function HomeSection({ variant }: Props) {
  const userId = auth.currentUser?.uid;
  const [currentTodos, setCurrentTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [todosPercentage, setTodosPercentage] = useState<number>(0);

  // calculate percentage of completed todos
  const calculateTodosPercentage = (todos: any[]) => {
    const totalTodos = todos.length;
    if (totalTodos === 0) return 0;

    const completedTodos = todos.filter((todo) => todo.isDone).length;
    return Math.round((completedTodos / totalTodos) * 100);
  };

  // fetching current todos from firestore
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

  // toggle todo
  const toggleTodo = async (id: string, currentStatus: boolean) => {
    if (!userId) return;

    try {
      const todoRef = doc(db, "users", userId, "todos", id);

      await updateDoc(todoRef, {
        isDone: !currentStatus,
      });

      // update state and recalculate percentage
      const updatedTodos = currentTodos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !currentStatus } : todo
      );
      setCurrentTodos(updatedTodos);
      setTodosPercentage(calculateTodosPercentage(updatedTodos));
    } catch (error) {
      console.log("error toggling todo status", error);
    }
  };

  // deleted todos
  const deleteTodo = async (id: string) => {
    if (!userId) return;

    try {
      const todoRef = doc(db, "users", userId, "todos", id);
      await deleteDoc(todoRef);

      const updatedTodos = currentTodos.filter((todo) => todo.id !== id);
      setCurrentTodos(updatedTodos);
      setTodosPercentage(calculateTodosPercentage(updatedTodos));

      console.log(`deleted ${id} todo`);
    } catch (error) {
      console.log("error deleting todo", error);
    }
  };

  useEffect(() => {
    if (variant === "todos") {
      fetchTodos();
    }
  }, [variant, userId]);

  const createHomeSection = () => {
    if (variant === "goals") {
      return (
        <>
          <SectionHeader text="Goals" percentDone={30} />
          <View style={styles.gridView}>
            <CardGoal type="videocam" inlineText="Movie" />
            <CardGoal type="car" inlineText="Place" />
            <CardGoal type="fast-food" inlineText="Food" />
            <CardGoal type="cash" inlineText="Buy" />
            <CardGoal type="accessibility" inlineText="Activity" />
            <CardGoal type="book" inlineText="Book" />
          </View>
        </>
      );
    } else if (variant === "habits") {
      return (
        <>
          <SectionHeader text="Habits" percentDone={60} />
          <View style={styles.gridView}>
            <CardHabit variant="Water" />
            <CardHabit variant="Sport" />
            <CardHabit variant="Book" />
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
    // marginTop: 10,
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
    gap: width > 760 ? 10 : 4,
  },
});
