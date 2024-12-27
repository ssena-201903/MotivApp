import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
// import FillGlass from '../icons/FillGlassIcon';
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type Props = {
  type: string;
  inlineText: string;
};

const { width } = Dimensions.get("window");

export default function CardTodo({ type, inlineText }: Props) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [text, setText] = useState(inlineText);

  const handlePress = () => {
    Alert.alert("İşlemi Onayla", "Bu işlemi onaylıyor musunuz?", [
      {
        text: "Hayır",
        style: "cancel",
      },
      {
        text: "Evet",
        onPress: () => {
          setIsConfirmed(true);
          setText("İşlem Onaylandı");
        },
      },
    ]);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <Ionicons name={type} size={24} color={isConfirmed ? "#FF7066" : "#264653" } />
        <Text style={styles.text}>{inlineText}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#E5EEFF",
    width: width - 40,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  text: {
    color: "#264653",
    marginLeft: 20,
  },
  confirmed: {
    color: "#FF7066",
  }
});
