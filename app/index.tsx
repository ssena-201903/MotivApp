import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import TopBar from "@/components/cards/TopBar";
import DailyText from "@/components/cards/DailyText";
import DateTodos from "@/components/DateTodos";
import CustomButton from "@/components/CustomButton";
import SectionHeader from "@/components/headers/SectionHeader";
import CardTodo from "@/components/cards/CardTodo";
import CardGoal from "@/components/cards/CardGoal";
import CardHabit from "@/components/cards/CardHabit";

const { width } = Dimensions.get("window");

export default function Index() {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <TopBar />
        {/* <DailyText /> */}
        {/* <DateTodos /> */}
        {/* <CustomButton
          label="press the button"
          variant="fill"
          onPress={() => alert("pressed the fill")}
        />
        <CustomButton
          label="press the button"
          variant="outlined"
          onPress={() => alert("pressed the outlined")}
        />
        <CustomButton
          label="press the button"
          variant="disabled"
          onPress={() => alert("pressed the disabled")}
        /> */}
        <SectionHeader text="Goals" percentDone={25}/>
        <View style={styles.goalView}>
          <CardGoal type="videocam" inlineText="Movie" />
          <CardGoal type="car" inlineText="Place" />
          <CardGoal type="fast-food" inlineText="Food" />
          <CardGoal type="book" inlineText="Book" />
          <CardGoal type="accessibility" inlineText="Activity" />
          <CardGoal type="cash" inlineText="Buy" />
        </View>
        <SectionHeader text="To-Do List" percentDone={25} />
        <ScrollView style={styles.todoView}>
          <CardTodo
            type="gift"
            inlineText="Anna's birthday! Haven't you celebrated?"
            variant="birthday"
          />
          <CardTodo type="checkmark-circle" inlineText="Dental Appointment" variant="todo" />
          <CardTodo type="checkmark-circle" inlineText="Meeting Friends" variant="todo"/>
          <CardTodo type="checkmark-circle" inlineText="Do Project" variant="todo" />
        </ScrollView>
      </View>
      <CardHabit variant="Water"/>
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
    width: width - 40,
    height: 170,
    overflow: "hidden",
  },
  goalView: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: width - 40,
    // marginTop: 20,
    gap: 4,
  }
});
