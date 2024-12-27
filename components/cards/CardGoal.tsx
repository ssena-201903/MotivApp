import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Text } from "react-native";

type Props = {
    type: string;
    inlineText: string;
}

export default function CardGoal({ type, inlineText } : Props) {
  return (
    <View style={styles.container}>
        <Ionicons name={type} size={28} color="#264653" />
        <Text style={styles.inlineText}>{inlineText}</Text>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#E5EEFF",
    width: 120,
    height: 78,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  inlineText: {
    color: "#264653",
    fontSize: 10,
    fontWeight: "semibold",
    marginTop: 6,
  }
});
