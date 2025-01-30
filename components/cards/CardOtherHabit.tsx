import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "@/CustomText";

interface Props {
  variant: string;
  userId: string;
}

export default function CardOtherHabit({ variant, userId }: Props) {
  const [isDone, setIsDone] = useState<boolean>(false);

  const getFeedbackProps = () => {
    if (variant === "Book") {
      return {
        text: "Congratulations! You have completed the Book Goal...",
      };
    } else if (variant === "Sport") {
      return {
        text: "Congratulations! You have completed the Sport Goal",
      };
    }
  
    // default case
    return { text: "", type: "celebration" };
  };

  const createHabitCard = () => {
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
            <View style={styles.streakContainer}>
              <Ionicons name="leaf" size={18} color={"#1E3A5F"} />
              <CustomText style={styles.streakText}>0</CustomText>
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
              {/* <CustomText style={styles.subText}>20 min</CustomText> */}
            </View>
            <View style={styles.streakContainer}>
              <Ionicons name={isDone ? "leaf" : "leaf-outline"} size={18} color={"#1E3A5F"} />
              <CustomText>0</CustomText>
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
    <View style={styles.container}>
      <View style={styles.leftView}>
        <Ionicons name={isDone ? "checkmark-circle" : "add"} size={28} color="#1E3A5F" />
        <CustomText style={styles.text}>{variant}</CustomText>
      </View>
      <TouchableOpacity style={styles.doneButton} onPress={() => setIsDone((prev) => !prev)}>
        <Ionicons name="checkmark-circle" size={28} color="#1E3A5F" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leftView: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  doneButton: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
