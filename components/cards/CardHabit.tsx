import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  Pressable,
  Linking,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import FillGlassIcon from "@/components/icons/FillGlassIcon";
import EmptyGlassIcon from "@/components/icons/EmptyGlassIcon";
import PlusIcon from "../icons/PlusIcon";

type Props = {
  variant: "Book" | "Sport" | "Water";
};

const { width } = Dimensions.get("window");

export default function CardHabit({ variant }: Props) {
  const [filledGlass, setFilledGlass] = useState(0);
  const totalWater = 8;
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // loading water sound
  const loadWaterSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sounds/glass-filled-with-water-201638.mp3")
    );
    setSound(sound);
  };

  const playSound = async () => {
    if (sound) {
        await sound.replayAsync();
    }
  };

  useEffect(() => {
    loadWaterSound();
    return () => {
        if (sound) {
            sound.unloadAsync();
        }
    };
  }, []);

  const handlePlusPress = () => {
    if (variant === "Water" && filledGlass < totalWater) {
      const newFilledGlass = filledGlass + 1;
      setFilledGlass(newFilledGlass);

      playSound();

      if (newFilledGlass === totalWater) {
        Alert.alert("Tebrikler, hedefi tamamladın!");
      }
    }
  };

  const handleHeartPress = () => {};

  const createHabitCard = () => {
    if (variant === "Sport") {
      return (
        <View style={styles.container}>
          <View style={styles.leftView}>
            <Ionicons name="barbell" size={24} color="#264653" />
            <Text style={styles.text}>Spor</Text>
            <Text style={styles.subText}>20 min</Text>
          </View>
          <Ionicons name="heart-outline" size={24} color="#264653" />
        </View>
      );
    } else if (variant === "Book") {
      return (
        <View style={styles.container}>
          <View style={styles.leftView}>
            <Ionicons name="book" size={24} color="#264653" />
            <Text style={styles.text}>Book</Text>
          </View>
          <Ionicons name="heart-outline" size={24} color="#264653" />
        </View>
      );
    } else if (variant === "Water") {
      return (
        <View style={styles.container}>
          <View style={styles.leftView}>
            <View style={styles.waterRow}>
              {Array.from({ length: totalWater }).map((_, index) =>
                index < filledGlass ? (
                  <View style={{ marginRight: 8 }}>
                    <FillGlassIcon height={21} width={20} />
                  </View>
                ) : (
                  <View style={{ marginRight: 8 }}>
                    <EmptyGlassIcon height={21} width={20} />
                  </View>
                )
              )}
            </View>
            <Text style={styles.subText}>{`${filledGlass}/${totalWater}`}</Text>
          </View>
          <Pressable onPress={handlePlusPress}>
            <PlusIcon width={24} height={24} />
          </Pressable>
        </View>
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        { width: variant === "Water" ? width - 40 : 200 },
      ]}
    >
      {createHabitCard()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 8,
    marginTop: 10,
    height: 50,
    backgroundColor: "#E5EEFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  text: {
    color: "#264653",
    marginLeft: 14,
    fontWeight: 400,
  },
  subText: {
    color: "#264653",
    marginLeft: 10,
    fontWeight: 200,
  },
  leftView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  waterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
});
