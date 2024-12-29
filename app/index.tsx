import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import TopBar from "@/components/cards/TopBar";
import DailyText from "@/components/cards/DailyText";
import DateTodos from "@/components/DateTodos";
import CustomButton from "@/components/CustomButton";
import SectionHeader from "@/components/headers/SectionHeader";
import CardTodo from "@/components/cards/CardTodo";
import CardGoal from "@/components/cards/CardGoal";
import CardHabit from "@/components/cards/CardHabit";
import HomeSection from "@/components/HomeSection";

const { width } = Dimensions.get("window");

export default function Index() {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <TopBar />
        <HomeSection variant="goals" />
        <HomeSection variant="habits" />
        <HomeSection variant="todos" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#FCFCFC",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#FCFCFC",
  },
  todoView: {
    flexGrow: 1,
    width: 370,
    height: 170,
    overflow: "hidden",
  },
  goalView: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: 370,
    // marginTop: 20,
    gap: 4,
  },
});
