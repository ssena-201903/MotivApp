import { View, StyleSheet, ScrollView } from "react-native";
import SectionHeader from "@/components/headers/SectionHeader";
import CardGoal from "@/components/cards/CardGoal";
import CardHabit from "@/components/cards/CardHabit";
import CardTodo from "@/components/cards/CardTodo";
import React from "react";

type Props = {
  variant: "goals" | "habits" | "todos";
};
export default function HomeSection({ variant }: Props) {
  const todos = [
    { id: "1", text: "Water Plant", completed: false },
    { id: "2", text: "Study React Native", completed: true },
    { id: "3", text: "Do Project", completed: false },
    { id: "4", text: "Dental Appointment", completed: true },
    { id: "5", text: "Meet Friends", completed: false },
  ];

  const toggleTodo = (id: string) => {
    console.log(`Todo ${id} tamamlandı!`);
  };

  const deleteTodo = (id: string) => {
    console.log(`Todo ${id} silindi!`);
  };

  console.log(variant);
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
      return (
        <>
          <SectionHeader text="To-Do" percentDone={85} />
          <ScrollView style={styles.todoView}>
            {todos.map((todo) => (
              <CardTodo
                key={todo.id}
                id={todo.id}
                text={todo.text}
                isCompleted={todo.completed}
                variant="todo"
                onToggle={(id) => toggleTodo(id)}
                onDelete={(id) => deleteTodo(id)}
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
