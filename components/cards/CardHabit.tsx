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
import CardFeedback from "@/components/cards/CardFeedback";
import { CustomText } from "@/CustomText";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

type Props = {
  variant: "Book" | "Sport" | "Water";
};

export default function CardHabit({ variant }: Props) {
  const [filledGlass, setFilledGlass] = useState<number>(0);
  const totalWater = 8;
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState<boolean>(false);
  const [animationKey, setAnimationKey] = useState<number>(0);

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

      setAnimationKey((prev) => prev + 1);
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
            <Ionicons
              name={isDone ? "barbell" : "barbell-outline"}
              size={22}
              color="#1E3A5F"
            />
            <CustomText style={styles.text}>Spor</CustomText>
            {/* <CustomText style={styles.subText}>20 min</CustomText> */}
          </View>
          <Pressable
            style={{
              height: 50,
              width: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleDonePress}
          >
            <Ionicons
              name={isDone ? "checkmark-circle" : "add"}
              size={28}
              color="#1E3A5F"
            />
          </Pressable>
        </>
      );
    } else if (variant === "Book") {
      return (
        <>
          <View style={leftViewStyle}>
            <Ionicons
              name={isDone ? "book" : "book-outline"}
              size={22}
              color="#1E3A5F"
            />
            <CustomText style={styles.text}>Book</CustomText>
          </View>
          <Pressable
            style={{
              height: 50,
              width: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleDonePress}
          >
            <Ionicons
              name={isDone ? "checkmark-circle" : "add"}
              size={28}
              color="#1E3A5F"
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
                      {/* <LottieView
                        source={require("@/assets/animations/pouring_water.json")} // replace with your Lottie file
                        autoPlay
                        loop={false}
                        style={{ height: 21, width: 20 }} // adjust the size as needed
                      /> */}
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
          <Pressable
            onPress={handlePlusPress}
            style={{ height: 30, justifyContent: "center" }}
          >
            <Ionicons
              name={isDone ? "checkmark-circle" : "add"}
              size={28}
              color="#1E3A5F"
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
          style={[
            isDone ? styles.doneHabit : styles.container,
            { width: width > 760 ? 266 : 182 },
          ]}
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
    paddingVertical: 10,
    marginTop: 2,
    height: 50,
    backgroundColor: "#E5EEFF",
    borderRadius: 12,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.07,
    // shadowRadius: 4,
    // overflow: "visible",
  },
  text: {
    color: "#1E3A5F",
    marginLeft: 12,
    fontWeight: "400",
    fontSize: 14,
  },
  subText: {
    color: "#1E3A5F",
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
    height: 60,
  },
  waterRow: {
    width: 240,
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
  },
  doneHabit: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 2,
    height: 50,
    backgroundColor: "#B5C4E4",
    borderRadius: 12,
  },
});
