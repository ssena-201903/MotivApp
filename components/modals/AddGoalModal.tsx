import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { db, auth } from "@/firebase.config";
import CustomButton from "@/components/CustomButton";
import StarRating from "@/components/icons/StarRating";
import { addDoc, collection } from "firebase/firestore";
import { CustomText } from "@/CustomText";

const { width } = Dimensions.get("window");

type AddGoalModalProps = {
  visible: boolean;
  categoryId: string;
  onClose: () => void;
  onAdd: (data: any) => void;
};

export default function AddGoalModal({
  visible,
  categoryId,
  onClose,
  onAdd,
}: AddGoalModalProps) {
  const [goalData, setGoalData] = useState({
    name: "",
    author: "",
    director: "",
    rating: 0,
    quote: "",
    note: "",
  });

  const handleRatingChange = (rating: number) => {
    setGoalData({ ...goalData, rating });
  };

  // pushing goal data to firestore
  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User is not logged in");
        return;
      }

      // base data structure
      const baseData = {
        name: goalData.name,
        rating: goalData.rating,
        isDone: false,
        createdAt: new Date(),
        category: categoryId,
      };

      // category specific data
      const categorySpecificData = (() => {
        switch (categoryId) {
          case "Movie":
            return {
              director: goalData.director,
              quotes: goalData.quote ? [goalData.quote] : [],
            };
          case "Book":
            return {
              author: goalData.author,
              quotes: goalData.quote ? [goalData.quote] : [],
            };
          case "Activity":
          case "Buy":
          case "Food":
          case "Place":
            return {
              notes: goalData.note ? [goalData.note] : [],
            };
          default:
            return {};
        }
      })();

      // combine base data with category specific data
      const dataToSave = {
        ...baseData,
        ...categorySpecificData,
      };

      // adding document to the goals collection
      const goalsCollectionRef = collection(db, "users", user.uid, "goals");
      const docRef = await addDoc(goalsCollectionRef, dataToSave);

      if (docRef.id) {
        onAdd({ id: docRef.id, ...dataToSave });
        onClose();
        // reset form
        setGoalData({
          name: "",
          author: "",
          director: "",
          rating: 0,
          quote: "",
          note: "",
        });
      }
    } catch (error) {
      console.error("Error adding goal: ", error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{categoryId} Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={goalData.name}
            onChangeText={(text) => setGoalData({ ...goalData, name: text })}
          />
          {categoryId === "Book" && (
            <TextInput
              style={styles.input}
              placeholder="Author"
              value={goalData.director}
              onChangeText={(text) =>
                setGoalData({ ...goalData, director: text })
              }
            />
          )}
          {categoryId === "Book" && (
            <TextInput
              style={styles.input}
              placeholder="Quote"
              value={goalData.quote}
              onChangeText={(text) => setGoalData({ ...goalData, quote: text })}
            />
          )}
          {categoryId === "Movie" && (
            <TextInput
              style={styles.input}
              placeholder="Director"
              value={goalData.director}
              onChangeText={(text) =>
                setGoalData({ ...goalData, director: text })
              }
            />
          )}
          {categoryId === "Movie" && (
            <TextInput
              style={styles.input}
              placeholder="Quote"
              value={goalData.quote}
              onChangeText={(text) => setGoalData({ ...goalData, quote: text })}
            />
          )}
          {(categoryId === "Activity" ||
            categoryId === "Buy" ||
            categoryId === "Food" ||
            categoryId === "Place") && (
            <TextInput
              style={styles.input}
              placeholder="Note"
              value={goalData.note}
              onChangeText={(text) => setGoalData({ ...goalData, note: text })}
            />
          )}
          <View style={styles.ratingContainer}>
            <CustomText style={styles.ratingText}>Rate:</CustomText>
            <StarRating
              rating={goalData.rating}
              onRatingChange={handleRatingChange}
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              label="Cancel"
              onPress={onClose}
              variant="cancel"
              width={80}
              height={45}
            />
            <CustomButton
              label="Add"
              onPress={handleSave}
              variant="fill"
              width={80}
              height={45}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    backgroundColor: "#FCFCFC",
    borderRadius: 12,
    padding: 20,
    width: Platform.select({
      web: Math.min(400, width - 40),
      default: width - 80,
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A5F",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  ratingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "60%",
  },
  ratingText: {
    color: "#1E3A5F",
    opacity: 0.8,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
});
