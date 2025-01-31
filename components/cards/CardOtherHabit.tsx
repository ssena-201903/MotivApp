import React, { useState } from "react";
import { View, StyleSheet, Pressable, Dimensions, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "@/CustomText";

import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase.config";

const { width } = Dimensions.get("window");

interface Props {
  variant: "Sport" | "Book" | "Vocabulary" | "Custom";
  userId: string;
  customText?: string;
}

export default function CardOtherHabit({ variant, userId, customText }: Props) {
  const [isDone, setIsDone] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  // Kartın metin ve ikon bilgilerini belirle
  const getCardProps = () => {
    switch (variant) {
      case "Sport":
        return {
          icon: isDone ? "barbell" : "barbell-outline",
          text: "Sport",
        };
      case "Book":
        return {
          icon: isDone ? "book" : "book-outline",
          text: "Book",
        };
      case "Vocabulary":
        return {
          icon: isDone ? "book" : "book-outline", // Vocabulary için uygun ikon
          text: "Vocabulary",
        };
      case "Custom":
        return {
          icon: isDone ? "add-circle" : "add-circle-outline", // Custom için uygun ikon
          text: customText || "Özel",
        };
      default:
        return {
          icon: "add",
          text: "Default Habit",
        };
    }
  };

  // Firestore'daki ilgili dokümanı bul ve güncelle
  const updateHabit = async (isDone: boolean, newStreak: number) => {
    try {
      const habitsRef = collection(db, `users/${userId}/habits`);
      let q;

      // Custom variantı için customText'e göre sorgu yap
      if (variant === "Custom" && customText) {
        q = query(habitsRef, where("customText", "==", customText));
      } else {
        q = query(habitsRef, where("variant", "==", variant));
      }

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const habitDoc = querySnapshot.docs[0];
        const habitDocRef = doc(db, `users/${userId}/habits/${habitDoc.id}`);

        // Dokümanı güncelle
        await updateDoc(habitDocRef, {
          isDone,
          streakDays: newStreak,
        });

        // Yerel state'i güncelle
        setIsDone(isDone);
        setStreak(newStreak);
      } else {
        console.error("No matching document found!");
      }
    } catch (error) {
      console.error("Error updating habit: ", error);
    }
  };

  // Artıya basıldığında onay mesajı göster
  const handleDonePress = () => {
    if (isDone) {
      // Eğer zaten yapıldı olarak işaretlendiyse, geri alma işlemi
      Alert.alert(
        "Geri Alma",
        "Bunu yapılmamış olarak işaretlemek istiyor musunuz?",
        [
          {
            text: "Vazgeç",
            style: "cancel",
          },
          {
            text: "Evet",
            onPress: () => updateHabit(false, streak - 1),
          },
        ]
      );
    } else {
      // Yapıldı olarak işaretleme işlemi
      Alert.alert("Onay", "Bunu yapıldı olarak işaretlemek istiyor musunuz?", [
        {
          text: "Vazgeç",
          style: "cancel",
        },
        {
          text: "Evet",
          onPress: () => updateHabit(true, streak + 1),
        },
      ]);
    }
  };

  return (
    <View style={isDone ? styles.doneHabit : styles.container}>
      <View style={styles.leftView}>
        <Ionicons name={getCardProps().icon} size={22} color="#1E3A5F" />
        <CustomText style={styles.text}>{getCardProps().text}</CustomText>
      </View>
      <View style={styles.rigthView}>
        <View style={styles.streakContainer}>
          <Ionicons
            name={isDone ? "leaf" : "leaf-outline"}
            size={18}
            color="#1E3A5F"
          />
          <CustomText style={styles.streakText}>{streak}</CustomText>
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
            name={isDone ? "checkbox" : "add"}
            size={isDone ? 22 : 28}
            color="#1E3A5F"
          />
        </Pressable>
      </View>
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
    height: width > 760 ? 50 : 50,
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
  leftView: {
    flexDirection: "row",
    alignItems: "center",
  },
  rigthView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 30,
    width: 70,
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
  streakContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 30,
    width: 30,
    marginRight: 20,
  },
  streakText: {
    fontSize: 14,
    color: "#1E3A5F",
    fontWeight: "semibold",
    marginLeft: 4,
  },
  doneHabit: {
    backgroundColor: "#FFA38F",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width > 760 ? 380 : width - 40,
    height: width > 760 ? "auto" : 50,
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
});
