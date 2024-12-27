import { View, StyleSheet, Text, Dimensions } from "react-native";
import FillGlassIcon from "@/components/icons/FillGlassIcon";
import CalendarIcon from "@/components/icons/CalendarIcon";
import UserIcon from "@/components/icons/UserIcon";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function TopBar() {
  return (
    <View style={styles.container}>
      <View style={styles.date}>
        <Text style={styles.dateDay}>Dec 26</Text>
        <Text style={styles.dateYear}>2024</Text>
      </View>
      <View style={styles.topMenu}>
        <View style={styles.topMenuItem}>
          <Ionicons name="sparkles" size={28} color="#264653" />
        </View>
        <View style={styles.topMenuItem}>
          <Ionicons name="calendar-clear" size={28} color="#264653" />
        </View>
        <View style={styles.topMenuItem}>
          <Ionicons name="person" size={28} color="#264653" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFB9B4",
    borderRadius: 10,
    width: width - 40,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  date: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // marginLeft: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#FCFCFC",
  },
  dateDay: {
    color: "#264653",
    fontSize: 24,
    fontWeight: 900,
    marginRight: 16,
  },
  dateYear: {
    color: "#264653",
    fontSize: 14,
    fontWeight: "medium",
    marginRight: 10,
  },
  topMenu: {
    display: "flex",
    flexDirection: "row",
  },
  topMenuItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    // backgroundColor: "#FCFCFC",
  },
  topMenuItemText: {
    color: "#264653",
    fontSize: 8,
    fontWeight: "regular",
    marginTop: 6,
  },
});
