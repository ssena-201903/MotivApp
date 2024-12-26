import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import FillGlassIcon from "../icons/FillGlassIcon";
import CalendarIcon from "../icons/CalendarIcon";
import UserIcon from "../icons/UserIcon";

const { width } = Dimensions.get('window');

const TopBar: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.date}>
        <Text style={styles.dateDay}>Dec 26</Text>
        <Text style={styles.dateYear}>2024</Text>
      </View>
      <View style={styles.topMenu}>
        <View style={styles.topMenuItem}>
          <CalendarIcon width={28} height={28} />
          <Text style={styles.topMenuItemText}>Calendar</Text>
        </View>
        <View style={styles.topMenuItem}>
          <UserIcon width={28} height={28} />
          <Text style={styles.topMenuItemText}>Profile</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 40,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  date: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  dateDay: {
    color: "#264653",
    fontSize: 24,
    fontWeight: "bold",
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
    marginLeft: 20,
  },
  topMenuItemText: {
    color: "#264653",
    fontSize: 8,
    fontWeight: "regular",
    marginTop: 6,
  },
});

export default TopBar;
