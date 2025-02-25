import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Pressable, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CustomText } from "@/CustomText";
import GoalDetailsModal from "@/components/modals/GoalDetailsModal";
import StarRating from "@/components/icons/StarRating";
import { doc, Timestamp, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/firebase.config";
import BoxIcon from "../icons/BoxIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import InfoIcon from "@/components/icons/InfoIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import BookIcon from "@/components/icons/BookIcon";

import { useLanguage } from "@/app/LanguageContext";
import AddNoteModal from "../modals/AddGoalNoteModal";
import AddGoalNoteModal from "../modals/AddGoalNoteModal";
import ConfirmationModal from "../modals/ConfirmationModal";

const { width } = Dimensions.get("window");

type CardGoalProps = {
  category: string;
  goal: any;
  onUpdate: () => void;
};

export default function CardGoalTodo({
  category,
  goal,
  onUpdate,
}: CardGoalProps) {
  const [isDone, setIsDone] = useState<boolean>(goal.isDone || false);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    goal.readingStatus || "not started"
  );
  const [rating, setRating] = useState(goal.rating || 0);
  const [isDetailsModalVisible, setIsDetailsModalVisible] =
    useState<boolean>(false);
  const [isAddNoteModalVisible, setIsAddNoteModalVisible] =
    useState<boolean>(false);

  const [isConfirmationVisible, setIsConfirmationVisible] =
    useState<boolean>(false);

  // language context
  const { t, language, setLanguage } = useLanguage();

  const handleDelete = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await deleteDoc(doc(db, "users", userId, "goals", goal.id));
      console.log("Öğe başarıyla silindi!");
      onUpdate(); // UI'yi güncelle
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const handleEdit = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const updatedName = prompt("Yeni ismi girin:", goal.name);
      if (!updatedName) return;

      await updateDoc(doc(db, "users", userId, "goals", goal.id), {
        name: updatedName,
      });

      console.log("Öğe başarıyla güncellendi!");
      onUpdate(); // UI'yi güncelle
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  const toggleCard = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const updateIsDone = !isDone;
      const updateReadingStatus =
        category === "Book" ? (updateIsDone ? "read" : "not started") : null;

      const goalRef = doc(db, "users", userId, "goals", goal.id);
      await updateDoc(goalRef, {
        isDone: updateIsDone,
        ...(category === "Book" && { readingStatus: updateReadingStatus }),
        finishedAt: updateIsDone ? new Date() : null,
      });

      setIsDone(updateIsDone);
      if (category === "Book")
        setSelectedStatus(updateReadingStatus || "not started");

      onUpdate(); // update list after updating
    } catch (error) {
      console.error("Error updating goal status: ", error);
    }
  };

  const handleReadingStatusChange = async (newStatus: string) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const updateIsDone = newStatus === "read";

      const goalRef = doc(db, "users", userId, "goals", goal.id);
      await updateDoc(goalRef, {
        readingStatus: newStatus,
        isDone: updateIsDone,
        finishedAt: updateIsDone ? new Date() : null,
      });
      setSelectedStatus(newStatus);
      setIsDone(updateIsDone);
      onUpdate(); // update list after updating
    } catch (error) {
      console.error("Error updating reading status: ", error);
    }
  };

  const handleRatingChange = async (newRating: number) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const goalRef = doc(db, "users", userId, "goals", goal.id);
      await updateDoc(goalRef, {
        rating: newRating,
      });
      setRating(newRating);
      onUpdate(); // update list after updating
    } catch (error) {
      console.error("Error updating rating: ", error);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp || !timestamp.seconds) return "-";
    const date = new Date(timestamp.seconds * 1000);
    return date.toISOString().split("T")[0];
  };

  const handleAddNote = () => {
    setIsAddNoteModalVisible(true);
  };

  const handleNoteAdded = (newNote: string) => {
    goal.notes = [...goal.notes, newNote];
    onUpdate();
  };

  return (
    <View style={isDone ? styles.completed : styles.container}>
      {/* for mobile screens (width <= 768) */}
      {category === "Movie" && goal.posterUrl && (
        <Image
          source={{ uri: goal.posterUrl }}
          style={styles.poster}
          defaultSource={require("@/assets/images/logo.png")} // Varsayılan poster
        />
      )}
      <View style={styles.containerWrap}>
        <View style={styles.mobileTop}>
          <View style={styles.mobileNameContainer}>
            <CustomText
              style={styles.nameOther}
              color="#1E3A5F"
              fontSize={16}
              type="bold"
            >
              {goal.name}
            </CustomText>
          </View>
          <View style={styles.mobileTopRight}>
            <Pressable style={styles.addNote} onPress={handleAddNote}>
              <PlusIcon size={16} color="#1E3A5F" />
              <CustomText
                style={styles.addNoteText}
                color="#1E3A5F"
                fontSize={12}
                type="medium"
              >
                {t("cardGoalTodo.addNote")}
              </CustomText>
            </Pressable>
            <Pressable style={styles.mobileCheckbox} onPress={toggleCard}>
              {isDone ? (
                <BoxIcon size={20} color="#1E3A5F" variant="fill" />
              ) : (
                <BoxIcon size={20} color="#1E3A5F" variant="outlined" />
              )}
            </Pressable>
          </View>
        </View>
        <View
          style={[
            styles.mobileBottom,
            category === "Movie" || category === "Book"
              ? { justifyContent: "space-between" }
              : { justifyContent: "flex-end" },
          ]}
        >
          {category === "Book" && (
            <Picker
              selectedValue={selectedStatus}
              onValueChange={handleReadingStatusChange}
              style={styles.picker}
              dropdownIconColor="#1E3A5F"
            >
              <Picker.Item
                label={t("cardGoalTodo.notStartedStatus")}
                value="not started"
              />
              <Picker.Item
                label={t("cardGoalTodo.readingStatus")}
                value="reading"
              />
              <Picker.Item
                label={t("cardGoalTodo.completedStatus")}
                value="read"
              />
            </Picker>
            // ) : (
            //   <CustomText
            //     style={styles.createdAtText}
            //     color="#1E3A5F"
            //     fontSize={12}
            //     type="medium"
            //   >
            //     {formatDate(goal.createdAt)}
            //   </CustomText>
          )}
          {category === "Movie" && (
            <CustomText
              style={styles.createdAtText}
              color="#1E3A5F"
              fontSize={14}
              type="regular"
            >
              IMDB: {goal.imdbRate} / {goal.runtime}
            </CustomText>
          )}
          <View style={styles.mobileRating}>
            {/* Star Rating */}
            <View style={styles.starContainer}>
              <StarRating rating={goal.rating} onRatingChange={() => {}} />
            </View>

            {/* Info Icon */}
            <Pressable
              style={styles.infoIcon}
              onPress={() => setIsDetailsModalVisible(true)}
            >
              <InfoIcon size={20} color="#1E3A5F" variant="outlined" />
            </Pressable>

            {/* Eğer kategori Movie veya Book değilse PencilIcon göster */}
            {category !== "Movie" && category !== "Book" && (
              <Pressable style={styles.infoIcon} onPress={handleEdit}>
                <PencilIcon size={20} color="#1E3A5F"/>
              </Pressable>
            )}

            {/* Trash Icon (Her kategoride olacak) */}
            <Pressable style={styles.infoIcon} onPress={() => setIsConfirmationVisible(true)}>
              <TrashIcon size={20} color="#FF6347" />
            </Pressable>

            {/* Silme işlemi için Confirmation Modal */}
            <ConfirmationModal
              visible={isConfirmationVisible}
              title="Silme Onayı"
              message="Bu öğeyi silmek istediğinizden emin misiniz?"
              onConfirm={() => {
                handleDelete();
                setIsConfirmationVisible(false);
              }}
              onCancel={() => setIsConfirmationVisible(false)}
            />
          </View>
        </View>
      </View>

      <GoalDetailsModal
        visible={isDetailsModalVisible}
        onClose={() => setIsDetailsModalVisible(false)}
        goal={goal}
      />

      <AddGoalNoteModal
        visible={isAddNoteModalVisible}
        onClose={() => setIsAddNoteModalVisible(false)}
        goal={goal}
        onNoteAdded={handleNoteAdded}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    width: width > 768 ? width - 900 : width - 40,
    height: 120,
    display: "flex",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  containerWrap: {
    flex: 1,
  },
  completed: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    width: width > 768 ? width - 900 : width - 40,
    height: 100,
    display: "flex",
    backgroundColor: "#E5EEFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  poster: {
    width: 50,
    height: 80,
    marginRight: 20,
    borderRadius: 4,
  },
  nameOther: {
    flex: 1,
    overflow: "hidden",
  },
  picker: {
    borderColor: "#1E3A5F",
    width: 110,
    height: 30,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "transparent",
    color: "#1E3A5F",
  },
  createdAtText: {
    opacity: 0.6,
  },
  addNote: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "auto",
    marginLeft: width > 768 ? 25 : 0,
    marginRight: width > 768 ? 0 : 10,
  },
  addNoteText: {
    marginLeft: 8,
    opacity: 0.9,
  },
  starContainer: {
    marginLeft: 10,
  },
  infoIcon: {
    marginLeft: 10,
    opacity: 0.8,
  },

  mobileTop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  mobileBottom: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    marginTop: 20,
  },
  mobileNameContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "70%",
  },
  mobileTopRight: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  mobileCheckbox: {
    marginLeft: 20,
  },
  mobileRating: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
