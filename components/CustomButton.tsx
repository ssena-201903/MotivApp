import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'outlined' | 'fill' | 'disabled' | 'cancel';
  width: number | "100%";
  height: number | "100%";
};
export default function CustomButton({
  label,
  onPress,
  variant,
  width,
  height,
}: Props) {
  const getButtonStyle = () => {
    switch (variant) {
      case "outlined":
        return styles.outlined;
      case "fill":
        return styles.fill;
      case "disabled":
        return styles.disabled;
      case "cancel":
        return styles.cancel;
      default:
        return styles.fill;
    }
  };

  return (
    <TouchableOpacity
      onPress={variant !== "disabled" ? onPress : undefined}
      style={[styles.button, { width }, { height }, getButtonStyle()]}
      disabled={variant === "disabled"}
    >
      <Text
        style={[
          styles.text,
          variant === "disabled" && styles.disabledText,
          variant === "outlined" && styles.outlinedText,
          variant === "fill" && styles.text,
          variant === "cancel" && styles.cancelText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color: "#F9F9F9",
    fontWeight: "semibold",
  },
  fill: {
    backgroundColor: "#1E3A5F", // can change later
  },
  outlined: {
    borderWidth: 2,
    borderColor: "#FFA38F", // can change later
    backgroundColor: "transparent",
  },
  outlinedText: {
    color: "#FFA38F", // can change later
    fontWeight: 400,
  },
  disabled: {
    backgroundColor: "#FF8462", // can change later
    opacity: 0.7,
  },
  disabledText: {
    color: "white",
    opacity: 0.8,
  },
  cancel: {
    backgroundColor: "#E5EEFF", // can change later
  },
  cancelText: {
    color: "#264653",
  },
});


