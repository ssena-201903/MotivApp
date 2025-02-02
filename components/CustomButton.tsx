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
  marginLeft?: number | 0;
};
export default function CustomButton({
  label,
  onPress,
  variant,
  width,
  height,
  marginLeft,
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
      style={[styles.button, { width }, { height }, { marginLeft }, getButtonStyle()]}
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: "#F9F9F9",
    fontWeight: "semibold",
  },
  fill: {
    backgroundColor: "#1E3A5F", // can change later
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: "#1E3A5F", // can change later
    opacity: 0.7,
  },
  disabledText: {
    color: "white",
    opacity: 0.8,
  },
  cancel: {
    backgroundColor: "transparent", // can change later
    borderWidth: 1,
    borderColor: "#1E3A5F",
  },
  cancelText: {
    color: "#1E3A5F",
    fontWeight: 400,
  },
});


