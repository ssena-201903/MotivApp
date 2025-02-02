import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { CustomText } from "@/CustomText";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type Props = {
  variant: "home" | "other";
  text: string;
  percentDone: number;
};

const { width } = Dimensions.get("screen");

export default function SectionHeader({ variant, text, percentDone }: Props) {
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: (240 * percentDone) / 100, // // width of progress bar which is stable
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percentDone]);

  const handlePress = () => {
    if (variant === "home") {
      if (text === "Goals") {
        router.push("/goals");
      } else if (text === "Habits") {
        router.push("/habits");
      } else if (text === "To-Do") {
        router.push("/calendar");
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={handlePress}>
        <CustomText style={styles.headerText}>{text}</CustomText>
        {variant === "home" && (
          <Ionicons name="chevron-forward-outline" size={16} color="#f8f8f8"/>
        )}
      </TouchableOpacity>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[styles.progressBar, { width: progressWidth }]}
          />
          <View
            style={[
              styles.remainingBar,
              { width: 190 - (190 * percentDone) / 100 },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: width > 760 ? width - 600 : width - 40,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E3A5F",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 6,
    width: 110,
  },
  headerText: {
    color: "#f8f8f8",
    fontSize: 14,
    fontWeight: "700",
    width: 70,
  },
  percentText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    color: "#FCFCFC",
    fontSize: 12,
    fontWeight: "medium",
    backgroundColor: "#264653",
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
    borderRadius: 20,
  },
  progressBarContainer: {
    width: 240, // width of progress bar which is stable
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginLeft: 20,
  },
  progressBarBackground: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFA38F", // I can change later
  },
  remainingBar: {
    height: "100%",
    // backgroundColor: "#264653",
  },
});
