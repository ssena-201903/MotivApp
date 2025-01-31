import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Alert, Pressable } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import GlassIcon from "@/components/icons/GlassIcon";
import CardFeedback from "@/components/cards/CardFeedback";
import { CustomText } from "@/CustomText";
import LottieView from "lottie-react-native";
import BottleIcon from "@/components/icons/BottleIcon";
import CupIcon from "@/components/icons/CupIcon";
import MugIcon from "@/components/icons/MugIcon";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase.config";

const { width } = Dimensions.get("window");

const cupSizes = [
  {
    size: 200,
    component: (
      <GlassIcon
        width={width > 760 ? 25 : 31}
        height={width > 760 ? 25 : 30}
        variant="empty"
      />
    ),
    name: "Glass",
  },
  {
    size: 250,
    component: (
      <CupIcon
        width={width > 760 ? 25 : 31}
        height={width > 760 ? 25 : 30}
        variant="empty"
      />
    ),
    name: "Cup",
  },
  {
    size: 300,
    component: (
      <MugIcon
        width={width > 760 ? 25 : 31}
        height={width > 760 ? 25 : 30}
        variant="empty"
      />
    ),
    name: "Mug",
  },
  {
    size: 500,
    component: (
      <BottleIcon
        width={width > 760 ? 51 : 51}
        height={width > 760 ? 50 : 50}
        variant="empty"
        litres={500}
        position="horizontal"
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
        position="horizontal"
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
        position="horizontal"
      />
    ),
    name: "Extra Large Bottle",
  },
];

type Props = {
  userId: string;
};

export default function CardWaterHabit({ userId }: Props) {
  const [filledGlass, setFilledGlass] = useState<number>(0);
  const [totalWater, setTotalWater] = useState<number>(0);
  const [cupSize, setCupSize] = useState<number>(0);
  const [cupType, setCupType] = useState<string>("");
  const [isWaterDone, setIsWaterDone] = useState<boolean>(false);
  const [waterStreak, setWaterStreak] = useState<number>(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState<boolean>(false);

  // fetch water habit datas
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
      setIsWaterDone(habitDoc.isDone);
      setWaterStreak(habitDoc.streakDays);
    }
  };

  useEffect(() => {
    fetcWaterHabitDatas();
  }, [userId, waterStreak, cupSize, cupType, filledGlass, totalWater, isWaterDone]);

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

  // handle water press
  const handleWaterPress = async () => {
    if (filledGlass < totalWater) {
      const newFilledGlass = filledGlass + 1;
      setFilledGlass(newFilledGlass);

      playSound();

      let isCompleted = false;
      let newStreakDays = waterStreak;

      if (newFilledGlass === totalWater) {
        isCompleted = true;
        newStreakDays += 1;
        setWaterStreak(newStreakDays);
        setIsFeedbackVisible(true);
        setIsWaterDone(true);
      }

      try {
        // find the water habit document
        const habitsRef = collection(db, `users/${userId}/habits`);
        const q = query(habitsRef, where("variant", "==", "Water"));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const habitDoc = querySnapshot.docs[0]; // get the first document
          const habitDocRef = doc(db, `users/${userId}/habits/${habitDoc.id}`);

          // update datas in firestore
          await updateDoc(habitDocRef, {
            filledCup: newFilledGlass,
            ...(isCompleted && { isDone: true, streakDays: newStreakDays }),
          });

          console.log("updated water habit data!");
        }
      } catch (error) {
        console.error("error updating water habit data:", error);
      }
    }
  };

  // get cup component
  const getCupComponent = (size: number, isFilled: boolean) => {
    const cupItem = cupSizes.find((cup) => cup.size === size);

    if (!cupItem) return <GlassIcon width={31} height={30} variant="empty" />; // default component

    if (isFilled) {
      return React.cloneElement(cupItem.component, { variant: "full" });
    }
    return cupItem.component;
  };

  // get feedback props
  const getFeedbackProps = () => {
    if (waterStreak === 14) {
      return {
        text: "Tebrikler 14 gün su içtiniz!",
      };
    } else {
      return {
        text: "Congratulations! You have completed the Water Goal...",
      };
    }
  };

  const createWaterCard = () => {
    return (
      <>
        <View style={styles.leftView}>
          <View style={styles.waterRow}>
            {Array.from({ length: totalWater }).map((_, index) => (
              <View key={index} style={{ marginRight: 8 }}>
                {getCupComponent(cupSize, index < filledGlass)}
              </View>
            ))}
          </View>
          <CustomText
            style={styles.subText}
          >{`${filledGlass}/${totalWater}`}</CustomText>
        </View>
        <View style={styles.streakContainer}>
          <Ionicons name="leaf" size={18} color={"#1E3A5F"} />
          <CustomText style={styles.streakText}>{waterStreak}</CustomText>
        </View>
      </>
    );
  };

  return (
    <View>
      <View
        style={[
          isWaterDone ? styles.doneHabit : styles.container
        ]}
      >
        {createWaterCard()}
        <Pressable
          onPress={handleWaterPress}
          style={{ height: 30, justifyContent: "center" }}
        >
          <Ionicons
            name={isWaterDone ? "checkbox" : "add"}
            size={28}
            color="#1E3A5F"
          />
        </Pressable>
      </View>
      <CardFeedback
        isVisible={isFeedbackVisible}
        text={getFeedbackProps().text}
        type="celebration"
        onComplete={() => setIsFeedbackVisible(false)}
        isStreak={true}
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
    width: width > 760 ? 380 : width - 40,
    height: width > 760 ? "auto" : "auto",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
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
    fontSize: 12,
    fontWeight: "200",
    overflow: "visible",
  },
  leftView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "auto",
    height: "auto",
  },
  waterRow: {
    width: width > 760 ? 200 : 180,
    maxHeight: "auto",
    alignItems: "flex-start",
    justifyContent: "center",
    flexWrap: "wrap",
    display: "flex",
  },
  doneHabit: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width > 760 ? 400 : width - 40,
    height: width > 760 ? 60 : 50,
    backgroundColor: "#E5EEFF",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    fontWeight: "semibold",
    marginLeft: 4,
  },
});
