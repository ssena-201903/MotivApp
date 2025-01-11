import { CustomText } from "@/CustomText";
import { View, StyleSheet, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase.config";
import { router } from "expo-router";

type ProfileModalProps = {
  isModalVisible: boolean;
  onClose: () => void;
  userId: string | undefined;
};

export default function ProfileModal({
  isModalVisible,
  onClose,
  userId,
}: ProfileModalProps) {
  if (!isModalVisible) return null;

  const handleLogout = async () => {
    try {
        await signOut(auth);
        router.push('/(auth)/login');
        onClose();
    } catch (error) {
        console.log("logout error", error);
    }
  };

  const handleProfileRoute = () => {
    router.push('/profile');
    onClose();
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container}>
          <View style={styles.topSection}>
            <CustomText style={styles.topSectionHeader}>MotivApp</CustomText>
            <Ionicons name="log-out-outline" size={32} color="#FFA38F" onPress={handleLogout} />
          </View>
          <View style={styles.menus}>
            <Pressable style={styles.menuItem} onPress={handleProfileRoute}>
              <Ionicons name="person" size={20} color="#1E3A5F" />
              <CustomText style={styles.menuItemText}>Profile</CustomText>
            </Pressable>
            <View style={styles.menuItem}>
              <Ionicons name="flag" size={20} color="#1E3A5F" />
              <CustomText style={styles.menuItemText}>Goals</CustomText>
            </View>
            <View style={styles.menuItem}>
              <Ionicons name="footsteps" size={20} color="#1E3A5F" />
              <CustomText style={styles.menuItemText}>Habits</CustomText>
            </View>
            <View style={styles.menuItem}>
              <Ionicons name="settings" size={20} color="#1E3A5F" />
              <CustomText style={styles.menuItemText}>Settings</CustomText>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#FCFCFC",
    position: "absolute",
    top: 0,
    right: 0,
    width: 260,
    height: "100%",
    padding: 20,
  },
  topSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 40,
    marginBottom: 40,
  },
  topSectionHeader: {
    fontSize: 20,
    fontWeight: 700,
    color: "#1E3A5F",
  },
  menus: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    height: 180,
    // marginVertical: 10,
  },
  menuItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#E5EEFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 500,
    color: "#1E3A5F",
  },
});
