import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "@/firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { CustomText } from "@/CustomText";
import StarRating from "../icons/StarRating";

const { width } = Dimensions.get("window");

type CardGoalProps = {
  category: string;
};

export default function CardGoalTodo({ category }: CardGoalProps) {
  const [isDone, setIsDone] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<
    string | undefined
  >();
  const [goals, setGoals] = useState<any[]>([]);

  // fetching  goals data from firestore
  useEffect(() => {
    const fecthData = async () => {
      try {
        const userId = auth.currentUser?.uid; // current user id

        if (!userId) {
          console.log("user did not login");
          return;
        }

        const gaoalsRef = collection(db, "users", userId, "goals");
        const q = query(gaoalsRef, where("category", "==", category));
        const querySnapshot = await getDocs(q);

        const fetchedGoals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGoals(fetchedGoals);
      } catch (error) {
        console.error("Error fetching goals: ", error);
      }
    };
    fecthData();
  }, [category]);

  const toggleCard = () => {
    setIsDone(!isDone);
  };

  const renderGoals = () =>
    goals.map((goal) => (
      <View key={goal.id} style={isDone ? styles.completed : styles.container}>
        <View style={styles.start}>
          <Pressable style={styles.checkbox} onPress={toggleCard}>
            <Ionicons
              name={isDone ? "checkbox" : "square-outline"}
              size={width > 760 ? 20 : 20}
              color="#1E3A5F"
            />
          </Pressable>
          <CustomText style={styles.name}>Goal Name</CustomText>
          {category === "Book" && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedLanguage}
                onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="not started" value="not started" />
                <Picker.Item label="reading" value="reading" />
                <Picker.Item label="read" value="read" />
              </Picker>
            </View>
          )}
        </View>
        <View style={styles.end}>
          <Pressable style={styles.addNote}>
            <Ionicons name="add" size={24} color="#1E3A5F" />
            <CustomText style={styles.addNoteText}>Add Note</CustomText>
          </Pressable>
          <View style={styles.starRate}>
            <StarRating />
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#1E3A5F"
              style={styles.infoIcon}
            />
          </View>
        </View>
      </View>
    ));

  return <View>{renderGoals()}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: width > 760 ? "row" : "column",
    flexWrap: width > 760 ? "nowrap" : "wrap",
    alignItems: width > 760 ? "center" : "flex-start",
    justifyContent: "space-between",
    borderColor: "rgba(30, 58, 95, 0.2)",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 8,
    width: width > 760 ? width - 900 : width - 40,
    height: width > 760 ? 50 : 110,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  completed: {
    backgroundColor: "#E5EEFF",
    flexDirection: width > 760 ? "row" : "column",
    flexWrap: width > 760 ? "nowrap" : "wrap",
    alignItems: width > 760 ? "center" : "flex-start",
    justifyContent: "space-between",
    borderColor: "rgba(30, 58, 95, 0.2)",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 8,
    width: width > 760 ? width - 900 : width - 40,
    height: width > 760 ? 50 : 110,
    shadowColor: "#000", // Gölge rengi
    shadowOffset: { width: 0, height: 2 }, // Gölge kaydırma miktarı
    shadowOpacity: 0.1, // Gölgenin yoğunluğu
    shadowRadius: 4, // Gölge yayılma yarıçapı
  },
  start: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "auto",
  },
  end: {
    display: "flex",
    flexDirection: "row",
    justifyContent: width > 760 ? "space-between" : "space-between",
    alignItems: "center",
    width: width > 760 ? 350 : "100%",
    marginTop: width > 760 ? 0 : 0,
    paddingLeft: width > 760 ? 0 : 0,
  },
  checkbox: {
    marginRight: 10,
  },
  name: {
    color: "#1E3A5F",
    fontSize: width > 760 ? 16 : 14,
    fontWeight: "600",
  },
  pickerContainer: {
    backgroundColor: "transparent",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  picker: {
    borderColor: "#1E3A5F",
    width: 110,
    height: 30,
    marginLeft: 20,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "transparent",
    color: "#1E3A5F",
  },
  starRate: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  addNote: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "auto",
    marginLeft: width > 760 ? 40 : 0,
  },
  addNoteText: {
    marginLeft: 4,
    color: "#1E3A5F",
    fontSize: 14,
    fontWeight: "500",
  },
  infoIcon: {
    marginLeft: 10,
  },
});
