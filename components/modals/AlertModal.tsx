import {
  Modal,
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import CustomButton from "@/components/CustomButton";

const { width } = Dimensions.get("window");

type AlertModalProps = {
  visible: boolean;
  title: string;
  message: string;
  buttons?: Array<{
    text: string;
    variant?: "fill" | "cancel" | "outlined";
    onPress: () => void;
  }>;
};

export default function AlertModal({
  visible,
  title,
  message,
  buttons = [],
}: AlertModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <View key={index}>
                <CustomButton
                  label={button.text}
                  onPress={button.onPress}
                  variant={button.variant || "fill"}
                  width={100}
                  height={40}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    backgroundColor: "#FCFCFC",
    borderRadius: 12,
    padding: 20,
    width: Platform.select({
      web: Math.min(400, width - 40),
      default: width - 80,
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A5F",
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
});
