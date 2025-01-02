import { View, StyleSheet, Text, Dimensions, Pressable, TouchableOpacity } from "react-native";
import FillGlassIcon from "@/components/icons/FillGlassIcon";
import CalendarIcon from "@/components/icons/CalendarIcon";
import UserIcon from "@/components/icons/UserIcon";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function TopBar({ onDiamondPress }: { onDiamondPress: () => void}) {
  const handleToast = () => {

  };
  
  return (
    <View style={styles.container}>
      <View style={styles.date}>
        <Text style={styles.dateMonth}>Dec 26</Text>
        <Text style={styles.dateDay}>Wed</Text>
      </View>
      <View style={styles.topMenu}>
        <TouchableOpacity style={styles.topMenuItem}>
          <Ionicons name="diamond" size={24} color="#FCFCFC" onPress={onDiamondPress} />
        </TouchableOpacity>
        <View style={styles.topMenuItem}>
          <Ionicons name="calendar" size={24} color="#FCFCFC" />
        </View>
        <View style={styles.topMenuItem}>
          <Ionicons name="person" size={24} color="#FCFCFC" />
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
    backgroundColor: "#264653",
    borderRadius: 10,
    width: 370,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 4,
  },
  date: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // marginLeft: 4,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "#FCFCFC",
  },
  dateMonth: {
    color: "#264653",
    fontSize: 24,
    fontWeight: 800,
    marginRight: 16,
  },
  dateDay: {
    color: "#264653",
    opacity: 0.6,
    fontSize: 16,
    fontWeight: 400,
    marginRight: 16,
  },
  dateYear: {
    color: "#264653",
    fontSize: 16,
    fontWeight: "400",
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
    // marginLeft: 4,
    paddingHorizontal: 8,
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
