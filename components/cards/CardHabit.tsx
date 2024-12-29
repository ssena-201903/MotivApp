import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  Pressable,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import FillGlassIcon from "@/components/icons/FillGlassIcon";
import EmptyGlassIcon from "@/components/icons/EmptyGlassIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import HeartIcon from "@/components/icons/HeartIcon";
import CardFeedback from "@/components/cards/CardFeedback";

const { width } = Dimensions.get("window");

type Props = {
  variant: "Book" | "Sport" | "Water";
};

export default function CardHabit({ variant }: Props) {
  const [filledGlass, setFilledGlass] = useState(0);
  const totalWater = 8;
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  // load water sound
  const loadWaterSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sounds/water-pouring-quickly-into-glass-103861.mp3")
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
        // Alert.alert("Tebrikler, hedefi tamamladın!");
        setIsFeedbackVisible(true);
      }
    }
  };

  const handleDonePress = () => {
    // Alert.alert("Confirm Action", "Do you confirm this action?", [
    //   {
    //     text: "No",
    //     style: "cancel",
    //   },
    //   {
    //     text: "Yes",
    //     onPress: () => {
    //       setIsDone((prev) => !prev);
    //     },
    //   },
    // ]);
    setIsDone((prev) => !prev);
  };

  const createHabitCard = () => {
    if (variant === "Sport") {
      return (
        <>
          <View style={styles.leftView}>
            <Ionicons name="barbell" size={20} color="#264653" />
            <Text style={styles.text}>Spor</Text>
            <Text style={styles.subText}>20 min</Text>
          </View>
          {/* <Ionicons name="heart-outline" size={20} color="#264653" /> */}
          {/* <HeartIcon width={20} height={20}/> */}
          <Pressable onPress={handleDonePress}>
            <Ionicons name="checkmark" size={24} color="#264653" />
          </Pressable>
        </>
      );
    } else if (variant === "Book") {
      return (
        <>
          <View style={styles.leftView}>
            <Ionicons name="book" size={20} color="#264653" />
            <Text style={styles.text}>Book</Text>
          </View>
          {/* <HeartIcon width={20} height={20}/> */}
          <Pressable onPress={handleDonePress}>
            <Ionicons name="checkmark" size={24} color="#264653" />
          </Pressable>
        </>
      );
    } else if (variant === "Water") {
      return (
        <>
          <View style={styles.leftView}>
            <View style={styles.waterRow}>
              {Array.from({ length: totalWater }).map((_, index) => (
                <View key={index} style={{ marginRight: 8 }}>
                  {index < filledGlass ? (
                    <View style={{ marginRight: 2 }}>
                      <FillGlassIcon height={21} width={20} />
                    </View>
                  ) : (
                    <View style={{ marginRight: 2 }}>
                      <EmptyGlassIcon height={21} width={20} />
                    </View>
                  )}
                </View>
              ))}
            </View>
            <Text style={styles.subText}>{`${filledGlass}/${totalWater}`}</Text>
          </View>
          <Pressable onPress={handlePlusPress}>
            <PlusIcon width={20} height={20} />
          </Pressable>
        </>
      );
    }
  };

  return (
    <>
      <View
        style={[
          isDone ? styles.doneHabit : styles.container,
          { width: variant === "Water" ? 370 : 182 },
        ]}
      >
        {createHabitCard()}
      </View>
      <CardFeedback
        isVisible={isFeedbackVisible}
        text="Tebrikler, su hedefini tamamladınız!"
        type="celebration"
        onComplete={() => setIsFeedbackVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginTop: 4,
    height: 50,
    backgroundColor: "#E5EEFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    overflow: "visible",
  },
  text: {
    color: "#264653",
    marginLeft: 10,
    fontWeight: "400",
    fontSize: 16,
  },
  subText: {
    color: "#264653",
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "200",
    overflow: "visible",
  },
  leftView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "auto",
  },
  waterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  doneHabit: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginTop: 4,
    height: 50,
    backgroundColor: "#FFA38F",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    overflow: "visible",
  },
});
