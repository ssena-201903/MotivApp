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
import { useState } from "react";
import ProfileModal from "../modals/ProfileModal";
import { auth } from "@/firebase.config";

const { width } = Dimensions.get("window");

type Props = {
  onDiamondPress: () => void;
  onDatePress: () => void;
};

export default function TopBar({ onDiamondPress, onDatePress }: Props) {
  const userId = auth.currentUser?.uid;

  const [isProfileModalVisible, setIsProfileModalVisible] =
    useState<boolean>(false);

  const handleToast = () => {};

  const handleCalendarPress = () => {
    router.push("/calendar");
  };

  const handleProfileModals = () => {
    setIsProfileModalVisible(true);
  };

  const handleProfileModalClose = () => {
    setIsProfileModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.date} onPress={onDatePress}>
        <CustomText style={styles.dateMonth}>Dec 26</CustomText>
        <CustomText style={styles.dateDay}>Wed</CustomText>
      </Pressable>
      <View style={styles.topMenu}>
        <TouchableOpacity style={styles.topMenuItem}>
          <Ionicons
            name="calendar"
            size={24}
            color="#FCFCFC"
            onPress={handleCalendarPress}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topMenuItem}>
          <Ionicons
            name="sparkles"
            size={24}
            color="#FCFCFC"
            onPress={onDiamondPress}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topMenuItem}>
          <Ionicons
            name="menu"
            size={24}
            color="#FCFCFC"
            onPress={handleProfileModals}
          />
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
    borderRadius: 10,
    width: width > 760 ? width - 600 : width - 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginTop: width > 760 ? 10 : 30,
    marginBottom: 20,
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
    // marginLeft: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    // backgroundColor: "#FCFCFC",
  },
  topMenuItemText: {
    color: "#1E3A5F",
    fontSize: 8,
    fontWeight: "regular",
    marginTop: 6,
  },
});
