import { View, StyleSheet } from "react-native";
import TopBar from "@/components/cards/TopBar";
import DailyText from "@/components/cards/DailyText";
import DateTodos from "@/components/DateTodos";

export default function Index() {
  return (
    <View style={styles.container}>
      <TopBar />
      <DailyText />
      <DateTodos />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#FCFCFC",
    },
});
