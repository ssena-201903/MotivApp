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

import { useLanguage } from "@/app/LanguageContext";

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

  // language context
  const { t, language, setLanguage } = useLanguage();

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

  const getModalTitle = () => {
    switch (categoryId) {
      case "Movie":
        return t("addGoalsModal.titleWatch");
      case "Book":
        return t("addGoalsModal.titleRead");
      case "Activity":
        return t("addGoalsModal.titleTry");
      case "Place":
        return t("addGoalsModal.titleGo");
      case "Buy":
        return t("addGoalsModal.titleBuy");
      case "Food":
        return t("addGoalsModal.titleEat");
      default:
        return "";
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <CustomText style={styles.title} type="semibold" color="#1E3A5F" fontSize={18}>{getModalTitle()}</CustomText>
          <TextInput
            style={styles.input}
            placeholder={
              categoryId === "Book"
                ? t("addGoalsModal.nameBookPlaceholder")
                : categoryId === "Movie"
                ? t("addGoalsModal.nameMoviePlaceholder")
                : t("addGoalsModal.namePlaceholder")
            }
            value={goalData.name}
            onChangeText={(text) => setGoalData({ ...goalData, name: text })}
          />
          {categoryId === "Book" && (
            <TextInput
              style={styles.input}
              placeholder={t("addGoalsModal.authorPlaceholder")}
              value={goalData.director}
              onChangeText={(text) =>
                setGoalData({ ...goalData, director: text })
              }
            />
          )}
          {categoryId === "Book" && (
            <TextInput
              style={styles.input}
              placeholder={t("addGoalsModal.quotePlaceholder")}
              value={goalData.quote}
              onChangeText={(text) => setGoalData({ ...goalData, quote: text })}
            />
          )}
          {categoryId === "Movie" && (
            <TextInput
              style={styles.input}
              placeholder={t("addGoalsModal.directorPlaceholder")}
              value={goalData.director}
              onChangeText={(text) =>
                setGoalData({ ...goalData, director: text })
              }
            />
          )}
          {categoryId === "Movie" && (
            <TextInput
              style={styles.input}
              placeholder={t("addGoalsModal.quotePlaceholder")}
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
              placeholder={t("addGoalsModal.notePlaceholder")}
              value={goalData.note}
              onChangeText={(text) => setGoalData({ ...goalData, note: text })}
            />
          )}
          <View style={styles.ratingContainer}>
            <CustomText style={styles.ratingText}>
              {t("addGoalsModal.rateText")}
            </CustomText>
            <StarRating
              rating={goalData.rating}
              onRatingChange={handleRatingChange}
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              label={t("addGoalsModal.cancelButtonText")}
              onPress={onClose}
              variant="cancel"
              width="50%"
              height={45}
            />
            <CustomButton
              label={t("addGoalsModal.addButtonText")}
              onPress={handleSave}
              variant="fill"
              width="50%"
              height={45}
              marginLeft={10}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    backgroundColor: "#FCFCFC",
    alignItems: "center",
    borderRadius: 8,
    padding: 20,
    width: width > 768 ? "30%" : width - 40,
  },
  title: {
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#F5F8FF",
    color: "#1E3A5F",
    opacity: 0.8,
  },
  ratingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  ratingText: {
    color: "#1E3A5F",
    opacity: 0.8,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    marginTop: 30,
  },
});
