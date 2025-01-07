import { View, StyleSheet, ScrollView } from "react-native";
import SectionHeader from "@/components/headers/SectionHeader";
import CardGoal from "@/components/cards/CardGoal";
import CardHabit from "@/components/cards/CardHabit";
import CardTodo from "@/components/cards/CardTodo";
import React, { useEffect, useState } from "react";
import { db, auth } from "@/firebase.config";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
} from "firebase/firestore";
import { CustomText } from "@/CustomText";

type Props = {
  variant: "goals" | "habits" | "todos";
};
export default function HomeSection({ variant }: Props) {
  const userId = auth.currentUser?.uid;
  const [currentTodos, setCurrentTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // fetching current todos from firestore
  const fetchTodos = async () => {
    if (!userId) return; // userId yoksa işlemi durdur

    try {
      const todosRef = collection(db, "users", userId, "todos");

      const todayDate = new Date();
      const startOfDay = new Date(todayDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(todayDate.setHours(23, 59, 59, 999));

      const q = query(
        todosRef,
        where("createdAt", ">=", startOfDay),
        where("createdAt", "<=", endOfDay)
      );

      const querySnapshot = await getDocs(q);

      const todosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCurrentTodos(todosData);
    } catch (error) {
      console.log("error fetching todos", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    if (!userId) return; 

    try {
      const todoRef = doc(db, "users", userId, "todos", id);

      await updateDoc(todoRef, {
        isDone: !currentStatus,
      });

      // update state
      setCurrentTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, isDone: !currentStatus } : todo
        )
      );
    } catch (error) {
      console.log("error toggling todo status", error);
    }
  };

  useEffect(() => {
    if (variant === "todos") {
      fetchTodos();
    }
  }, [variant, userId]);

  const deleteTodo = (id: string) => {
    console.log(`Todo ${id} silindi!`);
  };

  const createHomeSection = () => {
    if (variant === "goals") {
      return (
        <>
          <SectionHeader text="Goals" percentDone={30} />
          <View style={styles.gridView}>
            <CardGoal type="videocam" inlineText="Movie" />
            <CardGoal type="car" inlineText="Place" />
            <CardGoal type="fast-food" inlineText="Food" />
            <CardGoal type="book" inlineText="Book" />
            <CardGoal type="accessibility" inlineText="Activity" />
            <CardGoal type="cash" inlineText="Buy" />
          </View>
        </>
      );
    } else if (variant === "habits") {
      console.log(variant);
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
          <SectionHeader text="To-Do" percentDone={85} />
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
    width: 370,
    marginTop: 10,
  },
  todoView: {
    flexGrow: 1,
    width: 370,
    height: 170,
    overflow: "hidden",
  },
  gridView: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: 370,
    gap: 4,
  },
});
