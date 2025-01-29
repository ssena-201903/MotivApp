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
import BottleIcon from "@/components/icons/BottleIcon";
import CupIcon from "@/components/icons/CupIcon";
import MugIcon from "@/components/icons/MugIcon";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase.config";

const { width } = Dimensions.get("window");

const cupSizes = [
  {
    size: 200,
    component: (
      <EmptyGlassIcon
        width={width > 760 ? 21 : 31}
        height={width > 760 ? 20 : 30}
      />
    ),
    name: "Glass",
  },
  {
    size: 250,
    component: (
      <CupIcon
        width={width > 760 ? 41 : 31}
        height={width > 760 ? 40 : 30}
        variant="empty"
      />
    ),
    name: "Cup",
  },
  {
    size: 300,
    component: (
      <MugIcon
        width={width > 760 ? 41 : 31}
        height={width > 760 ? 40 : 30}
        variant="empty"
      />
    ),
    name: "Mug",
  },
  {
    size: 500,
    component: (
      <BottleIcon
        width={width > 760 ? 51 : 41}
        height={width > 760 ? 50 : 40}
        variant="empty"
        litres={500}
        position="vertical"
      />
    ),
    name: "Small Bottle",
  },
  {
    size: 1000,
    component: (
      <BottleIcon
        width={width > 760 ? 51 : 41}
        height={width > 760 ? 50 : 40}
        variant="empty"
        litres={1000}
        position="vertical"
      />
    ),
    name: "Large Bottle",
  },
  {
    size: 1500,
    component: (
      <BottleIcon
        width={width > 760 ? 61 : 51}
        height={width > 760 ? 60 : 50}
        variant="empty"
        litres={1500}
        position="vertical"
      />
    ),
    name: "Extra Large Bottle",
  },
];

type Props = {
  variant: "Book" | "Sport" | "Water";
  userId: string;
};

export default function CardHabit({ variant, userId }: Props) {
  const [filledGlass, setFilledGlass] = useState<number>(0);
  const [totalWater, setTotalWater] = useState<number>(0);
  const [cupSize, setCupSize] = useState<number>(0);
  const [cupType, setCupType] = useState<string>("");
  const [isWaterDone, setIsWaterDone] = useState<boolean>(false);
  const [waterStreak, setWaterStreak] = useState<number>(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState<boolean>(false);
  const [animationKey, setAnimationKey] = useState<number>(0);

  useEffect(() => {
    fetcWaterHabitDatas();
  }, [userId, variant, waterStreak, cupSize, cupType]);

  const fetcWaterHabitDatas = async () => {
    const habitsRef = collection(db, "users", userId, "habits");
    const q = query(habitsRef, where("variant", "==", "Water"));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const waterHabitDoc = querySnapshot.docs[0];
      const habitDoc = waterHabitDoc.data();

      setFilledGlass(habitDoc.filledCup || 0);
      setTotalWater(habitDoc.cupsNeeded);
      setCupSize(habitDoc.cupSize);
      setCupType(habitDoc.cupType);
      setIsWaterDone(habitDoc.isWaterDone);
      setWaterStreak(habitDoc.streakDays);
    }
  };

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

  const handleWaterPress = () => {
    if (variant === "Water" && filledGlass < totalWater) {
      const newFilledGlass = filledGlass + 1;
      setFilledGlass(newFilledGlass);

      playSound();

      if (newFilledGlass === totalWater) {
        // Alert.alert("Tebrikler, hedefi tamamladın!");
        setIsFeedbackVisible(true);
        setIsWaterDone((prev) => !prev);
      }

      setAnimationKey((prev) => prev + 1);
    }
  };

  const getCupComponent = (size: number, isFilled: boolean) => {
    const cupItem = cupSizes.find((cup) => cup.size === size);
    
    if (!cupItem) return <EmptyGlassIcon width={31} height={30} />; // Default component
  
    if (isFilled) {
      return React.cloneElement(cupItem.component, { variant: "full" });
    }
    return cupItem.component;
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
                  {getCupComponent(cupSize, index < filledGlass)}
                </View>
              ))}
            </View>
            <CustomText style={styles.subText}>{`${filledGlass}/${totalWater}`}</CustomText>
          </View>
          <View style={styles.streakContainer}>
            <Ionicons name="leaf" size={18} color={"#1E3A5F"} />
            <CustomText style={styles.streakText}>{waterStreak}</CustomText>
          </View>
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
            { width: width > 760 ? 270 : 220 },
          ]}
        >
          {createHabitCard()}
          <View style={styles.streakContainer}>
            <Ionicons name={isDone ? "leaf" : "leaf-outline"} size={18} color={"#1E3A5F"} />
            <CustomText>0</CustomText>
          </View>
        </Pressable>
      ) : (
        <View
          style={[isDone ? styles.doneHabit : styles.container, { width: 460 }]}
        >
          {createHabitCard()}
          <Pressable
            onPress={handleWaterPress}
            style={{ height: 30, justifyContent: "center" }}
          >
            <Ionicons
              name={isDone ? "checkmark-circle" : "add"}
              size={28}
              color="#1E3A5F"
            />
          </Pressable>
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
    // display: "flex",
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",
    // paddingHorizontal: 20,
    // paddingVertical: 10,
    // marginTop: 2,
    // height: 50,
    // backgroundColor: "#E5EEFF",
    // borderRadius: 12,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.07,
    // shadowRadius: 4,
    // overflow: "visible",

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width > 760 ? 300 : 190,
    height: width > 760 ? 60 : 50,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // justifyContent: "center",
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
    // display: "flex",
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",
    // paddingHorizontal: 20,
    // paddingVertical: 10,
    // marginTop: 2,
    // height: 50,
    // backgroundColor: "#E5EEFF",
    // borderRadius: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width > 760 ? 300 : 190,
    height: width > 760 ? 60 : 50,
    backgroundColor: "#E5EEFF",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // justifyContent: "center",
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  streakContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 30,
    width: 30,
  },
  streakText: {
    fontSize: 14,
    color: "#1E3A5F",
  },
});
