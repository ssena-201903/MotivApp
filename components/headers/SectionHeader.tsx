import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

type Props = {
  text: string;
  percentDone: number;
};

const { width } = Dimensions.get("screen");

export default function SectionHeader({ text, percentDone }: Props) {
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: (230 * percentDone) / 100, // // width of progress bar which is stable
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percentDone]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      {/* <Text style={styles.percentText}>{percentDone}</Text> */}
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
    width: 370,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  text: {
    color: "#FCFCFC",
    fontSize: 14,
    fontWeight: "semibold",
    backgroundColor: "#264653",
    paddingHorizontal: 14,
    paddingVertical: 2,
    borderRadius: 12,
    width: 110,
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
    width: 230, // width of progress bar which is stable
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginLeft: "auto",
  },
  progressBarBackground: {
    width: "100%",
    height: "100%",
    backgroundColor: "#264653",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFA38F", // I can change later
  },
  remainingBar: {
    height: "100%",
    backgroundColor: "#264653",
  },
});