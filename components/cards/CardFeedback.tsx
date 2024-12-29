import { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";

type Props = {
  isVisible: boolean;
  text: string;
  type: "celebration" | "success" | "warning";
  onComplete: () => void;
};

export default function CardFeedback({
  isVisible,
  text,
  type,
  onComplete,
}: Props) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  // animation source
  //   const animationSource = () => {
  //     switch (type) {
  //       case "celebration":
  //         return require("@/assets/animations/firework.lottie");
  //       case "success":
  //         return require("@/assets/animations/firework.lottie");
  //       default:
  //         return require("@/assets/animations/fireworks.json");
  //     }
  //   };

  const getTextColor = () => {
    switch (type) {
      case "celebration":
        return "blue";
      case "success":
        return "green";
      case "warning":
        return "red";
      default:
        return "white";
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.messageCard}>
        <Text style={[styles.messageText, { color: getTextColor() }]}>
          {text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  animation: {
    width: 200,
    height: 200,
  },
  messageCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 200,
    backgroundColor: "#EFF4FF",
    borderRadius: 12,
  },
  messageText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
