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
  variant: "outlined" | "fill" | "disabled";
};
export default function CustomButton({ label, onPress, variant }: Props) {
  const getButtonStyle = () => {
    switch (variant) {
      case "outlined":
        return styles.outlined;
      case "fill":
        return styles.fill;
      case "disabled":
        return styles.disabled;
      default:
        return styles.fill;
    }
  };

  return (
    <TouchableOpacity
      onPress={variant !== "disabled" ? onPress : undefined}
      style={[styles.button, getButtonStyle()]}
      disabled={variant === "disabled"}
    >
      <Text
        style={[
          styles.text,
          variant === "disabled" && styles.disabledText,
          variant === "outlined" && styles.outlinedText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color: "#F9F9F9",
    fontWeight: 'bold',
  },
  fill: {
    backgroundColor: "#FFA38F", // can change later
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
});
