import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  Platform,
} from "react-native";
import TopBar from "@/components/cards/TopBar";
import CustomButton from "@/components/CustomButton";
import HomeSection from "@/components/HomeSection";
import { useState } from "react";
import AddTodoModal from "@/components/modals/AddTodoModal";
import { auth } from "@/firebase.config";
import AddMemoryModal from "@/components/modals/AddMemoryModal";

const { width } = Dimensions.get("window");

export default function Home() {
  const [isMemoryModalVisible, setIsMemoryModalVisible] = useState(false);
  const [isAddTodoModalVisible, setIsAddTodoModalVisible] = useState(false);

  // getting current user id from auth
  const userId = auth.currentUser?.uid;

  // handle close modals
  const handleCloseTodoModal = () => {
    setIsAddTodoModalVisible(false);
  };

  const handleCloseMemoryModal = () => {
    setIsMemoryModalVisible(false);
  };

  const backgroundImage =
      Platform.OS === "web"
        ? require("@/assets/images/habitCardBg.png")
        : require("@/assets/images/mobileBg.png");

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} >
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View
            style={[
              styles.topbarContainer,
              width >= 768 && styles.gridItemLarge,
            ]}
          >
            <TopBar
              onDiamondPress={() => setIsMemoryModalVisible(true)}
              onDatePress={() => setIsAddTodoModalVisible(true)}
            />
          </View>
          <View style={styles.gridContainer}>
            <View
              style={[styles.gridItem, width >= 768 && styles.gridItemLarge]}
            >
              <HomeSection variant="goals" />
            </View>
            <View
              style={[styles.gridItem, width >= 768 && styles.gridItemLarge]}
            >
              <HomeSection variant="habits" />
            </View>
            <View
              style={[styles.gridItem, width >= 768 && styles.gridItemLarge]}
            >
              <HomeSection variant="todos" />
            </View>
          </View>
        </View>

        {/* when user press diamond icon to add new memory */}
        {userId && (
          <AddMemoryModal
            visible={isMemoryModalVisible}
            onClose={handleCloseMemoryModal}
            userId={userId}
          />
        )}
        {/* when user press date card to add new todo */}
        {userId && (
          <AddTodoModal
            visible={isAddTodoModalVisible}
            onClose={handleCloseTodoModal}
            userId={userId}
          />
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flexGrow: 1,
    // backgroundColor: "#FCFCFC",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  topbarContainer: {
    flexGrow: 1,
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flexGrow: 1,
  },
  gridItem: {
    width: "100%",
    marginBottom: 20,
  },

  //responive grid for larger screens
  gridItemLarge: {
    width: "70%", // Two columns with some space between on larger screens
  },
});
