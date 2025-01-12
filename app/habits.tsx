import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function Habits() {
  return (
    <ScrollView style={styles.scrollView}>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#FCFCFC",
  },
});