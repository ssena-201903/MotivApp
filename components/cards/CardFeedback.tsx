import { useEffect } from "react";
import { View, StyleSheet, Text, Dimensions, Modal } from "react-native";
import Lottie from "lottie-react-native";

type Props = {
  isVisible: boolean;
  text: string;
  type: "celebration" | "success" | "warning";
  onComplete: () => void;
};

const { width } = Dimensions.get("window");

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
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const getAnimationSource = () => {
    switch (type) {
      case "celebration":
        return require("@/assets/animations/firework_animate.json");
      case "success":
        return require("@/assets/animations/firework_animate.json");
      case "warning":
        return require("@/assets/animations/firework_animate.json");
      default:
        return require("@/assets/animations/firework_animate.json");
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.messageCard}>
          <Lottie
            source={getAnimationSource()}
            autoPlay
            loop={false}
            style={styles.animation}
          />
          <Text style={styles.messageText}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
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
    width: width - 80,
    padding: 40,
    height: 400,
    backgroundColor: "#EFF4FF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  messageText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    textAlign: "center",
    color: "#264653", // can change later
  },
});
