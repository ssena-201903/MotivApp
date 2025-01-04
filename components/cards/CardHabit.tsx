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
import CardFeedback from "@/components/cards/CardFeedback";
import { CustomText } from "@/CustomText";

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
    if (isDone) {
      Alert.alert("Habit", "Undo the action", [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setIsDone((prev) => !prev);
          },
        },
      ]);
    } else {
      Alert.alert("Habit", "Mark as done?", [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setIsDone((prev) => !prev);
            setIsFeedbackVisible(true);
          },
        },
      ]);
    }
  };

  const getFeedbackProps = () => {
    switch (variant) {
      case "Book":
        return {
          text: "Congragulations! You have complete the Book Goal...",
        };
      case "Water":
        return {
          text: "Congragulations! You have complete the Water Goal...",
        };
      case "Sport":
        return {
          text: "Congragulations! You have complete the Sport Goal",
        };
      default:
        return { text: "", type: "celebration" };
    }
  };

  const createHabitCard = () => {
    const leftViewStyle = [
      styles.leftView,
      variant !== "Water" && { height: 30 },
    ];

    if (variant === "Sport") {
      return (
        <>
          <View style={leftViewStyle}>
            <Ionicons name={isDone ? "barbell" : "barbell-outline"} size={22} color="#264653" />
            <CustomText style={styles.text}>Spor</CustomText>
            {/* <CustomText style={styles.subText}>20 min</CustomText> */}
          </View>
          <Pressable style={{ height: 30, justifyContent: "center" }}>
            <Ionicons
              name={isDone ? "checkmark-circle" : "add"}
              size={24}
              color="#264653"
            />
          </Pressable>
        </>
      );
    } else if (variant === "Book") {
      return (
        <>
          <View style={leftViewStyle}>
            <Ionicons name={isDone ? "book" : "book-outline"} size={22} color="#264653" />
            <CustomText style={styles.text}>Book</CustomText>
          </View>
          <Pressable style={{ height: 30, justifyContent: "center" }}>
            <Ionicons
              name={isDone ? "checkmark-circle" : "add"}
              size={24}
              color="#264653"
            />
          </Pressable>
        </>
      );
    } else if (variant === "Water") {
      return (
        <>
          <View style={leftViewStyle}>
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
            <CustomText
              style={styles.subText}
            >{`${filledGlass}/${totalWater}`}</CustomText>
          </View>
          <Pressable onPress={handlePlusPress} style={{ height: 30, justifyContent: "center" }}>
            <Ionicons
              name={isDone ? "checkmark-circle" : "add"}
              size={24}
              color="#264653"
            />
          </Pressable>
        </>
      );
    }
  };

  return (
    <View>
      {variant !== "Water" ? (
        <Pressable
          onPress={handleDonePress}
          style={[isDone ? styles.doneHabit : styles.container, { width: 182 }]}
        >
          {createHabitCard()}
        </Pressable>
      ) : (
        <View
          style={[isDone ? styles.doneHabit : styles.container, { width: 370 }]}
        >
          {createHabitCard()}
        </View>
      )}

      <CardFeedback
        isVisible={isFeedbackVisible}
        text={getFeedbackProps().text}
        type="celebration"
        onComplete={() => setIsFeedbackVisible(false)}
      />
    </View>
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
    marginLeft: 12,
    fontWeight: "400",
    fontSize: 14,
  },
  subText: {
    color: "#264653",
    marginLeft: 10,
    fontSize: 10,
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
