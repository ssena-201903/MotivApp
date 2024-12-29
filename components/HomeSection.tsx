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
  const createHomeSection = () => {
    if (variant === "goals") {
      return (
        <>
          <SectionHeader text="Goals" percentDone={25} />
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
      return (
        <>
          <SectionHeader text="Habits" percentDone={25} />
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
          <SectionHeader text="To-Do List" percentDone={25} />
          <ScrollView style={styles.todoView}>
            <CardTodo
              type="gift"
              inlineText="Anna's birthday! Haven't you celebrated?"
              variant="birthday"
            />
            <CardTodo
              type="checkmark-circle"
              inlineText="Dental Appointment"
              variant="todo"
            />
            <CardTodo
              type="checkmark-circle"
              inlineText="Meeting Friends"
              variant="todo"
            />
            <CardTodo
              type="checkmark-circle"
              inlineText="Do Project"
              variant="todo"
            />
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
