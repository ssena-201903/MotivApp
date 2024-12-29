import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  Pressable,
  Linking,
} from "react-native";
// import FillGlass from '../icons/FillGlassIcon';
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type Props = {
  type: string;
  inlineText: string;
  variant: "birthday" | "todo";
};

const { width } = Dimensions.get("window");

export default function CardTodo({ type, inlineText, variant }: Props) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [text, setText] = useState(inlineText);

  const handlePress = () => {
    if (variant === "todo") {
      Alert.alert("Confirm Action", "Do you confirm this action?", [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setIsConfirmed((prev) => !prev);
            setText((prev) => (isConfirmed ? inlineText : "İşlem Onaylandı"));
          },
        },
      ]);
    } else if (variant === "birthday") {
      Alert.alert("Reminder", "Do you want to celebrate via contacts?", [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setIsConfirmed((prev) => !prev);
            Linking.openURL("content://contacts");
            setText((prev) => (isConfirmed ? inlineText : "İşlem Onaylandı"));
          },
          style: "default",
        },
      ]);
    }
  };

  const getIconName = () => {
    return isConfirmed ? type : `${type}-outline`;
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={isConfirmed ? styles.confirmed : styles.container}>
        <Ionicons name={getIconName()} size={24} color="#264653" />
        <Text style={isConfirmed ? styles.confirmedText : styles.text}>
          {inlineText}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 8,
    backgroundColor: "#E5EEFF",
    width: width - 40,
    height: 50,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  text: {
    color: "#264653",
    marginLeft: 20,
    fontWeight: 400,
  },
  confirmed: {
    display: "flex",
    flexDirection: "row",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#FFA38F", // I can change later
    width: width - 40,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  confirmedText: {
    color: "#264653",
    marginLeft: 20,
    fontWeight: 500,
  },
});
