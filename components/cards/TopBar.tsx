import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { CustomText } from "@/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import ProfileModal from "../modals/ProfileModal";
import { auth } from "@/firebase.config";
import MovieIcon from "@/components/icons/MovieIcon";
import NotificationIcon from "@/components/icons/NotificationIcon";
import MenuIcon from "@/components/icons/MenuIcon";
import SparklesIcon from "@/components/icons/SparklesIcon";
import WalletIcon from "@/components/icons/WalletIcon";
import SellIcon from "@/components/icons/SellIcon";
import CarIcon from "@/components/icons/CarIcon";
import FoodIcon from "@/components/icons/FoodIcon";
import ActivityIcon from "@/components/icons/ActivityIcon";
import BookIcon from "../icons/BookIcon";

const { width } = Dimensions.get("window");

type Props = {
  onDiamondPress: () => void;
  onDatePress: () => void;
};

export default function TopBar({ onDiamondPress, onDatePress }: Props) {
  const userId = auth.currentUser?.uid;
  const [dateMonth, setDateMonth] = useState<string>("");
  const [dateDay, setDateDay] = useState<string>("");
  const [dateDayName, setDateDayName] = useState<string>("");

  const [isProfileModalVisible, setIsProfileModalVisible] =
    useState<boolean>(false);

  const handleToast = () => {};

  const handleNotificationsPress = () => {
    router.push("/notifications");
  };

  const handleProfileModals = () => {
    setIsProfileModalVisible(true);
  };

  const handleProfileModalClose = () => {
    setIsProfileModalVisible(false);
  };

  // Get current date on component mount
  const getCurrentDate = () => {
    const date = new Date();
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const month = months[date.getMonth()]; 
    const day = date.getDate().toString(); 
    const dayName = days[date.getDay()]; 

    setDateMonth(month);
    setDateDay(day);
    setDateDayName(dayName);
  };

  useEffect(() => {
    getCurrentDate();
  }, []);
    

  return (
    <View style={styles.container}>
      <Pressable style={styles.date} onPress={onDatePress}>
        <CustomText style={styles.dateMonth}>{dateMonth} {dateDay}</CustomText>
        <CustomText style={styles.dateDay}>{dateDayName}</CustomText>
      </Pressable>
      <View style={styles.topMenu}>
        <TouchableOpacity style={styles.topMenuItem} onPress={handleNotificationsPress}>
          <NotificationIcon size={24} color="#f8f8f8" variant="fill"/>
        </TouchableOpacity>
        <View style={styles.notificationsDot}>
          <CustomText style={styles.notificationsDotText}>3</CustomText>
        </View>
        <TouchableOpacity style={styles.topMenuItem} onPress={onDiamondPress}>
          <SparklesIcon size={24} color="#f8f8f8" variant="fill" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topMenuItem} onPress={handleProfileModals}>
          <MenuIcon size={24} color="#f8f8f8" />
        </TouchableOpacity>
      </View>
      <ProfileModal
        isModalVisible={isProfileModalVisible}
        userId={userId}
        onClose={handleProfileModalClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E3A5F",
    borderRadius: 8,
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginTop: 20,
  },
  date: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "#f8f8f8",
  },
  dateMonth: {
    color: "#1E3A5F",
    fontSize: 24,
    fontWeight: 800,
    marginRight: 16,
  },
  dateDay: {
    color: "#1E3A5F",
    opacity: 0.6,
    fontSize: 16,
    fontWeight: 400,
    marginRight: 16,
  },
  dateYear: {
    color: "#1E3A5F",
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  topMenuItemText: {
    color: "#1E3A5F",
    fontSize: 8,
    fontWeight: "regular",
    marginTop: 6,
  },
  notificationsDot: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -4,
    right: 84,
    width: 16,
    height: 16,
    borderRadius: 20,
    backgroundColor: "#FFA38F",
  },
  notificationsDotText: {
    color: "#1E3A5F",
    fontSize: 10,
    fontWeight: "bold",
  },
});
