import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Pressable, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { CustomText } from "@/CustomText";
import GoalDetailsModal from "@/components/modals/GoalDetailsModal";
import StarRating from "@/components/icons/StarRating";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/firebase.config";
import BoxIcon from "../icons/BoxIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import InfoIcon from "@/components/icons/InfoIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import PencilIcon from "@/components/icons/PencilIcon";

import { useLanguage } from "@/app/LanguageContext";
import AddGoalNoteModal from "../modals/AddGoalNoteModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import EditGoalModal from "@/components/modals/EditGoalModal"; // Yeni eklenen düzenleme modalı

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
  const [isDetailsModalVisible, setIsDetailsModalVisible] =
    useState<boolean>(false);
  const [isAddNoteModalVisible, setIsAddNoteModalVisible] =
    useState<boolean>(false);
  const [isConfirmationVisible, setIsConfirmationVisible] =
    useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false); // Yeni düzenleme modalı durumu

  // language context
  const { t } = useLanguage();

  const handleDelete = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await deleteDoc(doc(db, "users", userId, "goals", goal.id));
      console.log("Öğe başarıyla silindi!");
      onUpdate();
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  const handleEditSubmit = async (updatedName: string) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await updateDoc(doc(db, "users", userId, "goals", goal.id), {
        name: updatedName,
      });

      console.log("Öğe başarıyla güncellendi!");
      onUpdate();
      setIsEditModalVisible(false);
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

      onUpdate();
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
      onUpdate();
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
      onUpdate();
    } catch (error) {
      console.error("Error updating rating: ", error);
    }
  };

  const handleAddNote = () => {
    setIsAddNoteModalVisible(true);
  };

  const handleNoteAdded = (newNote: string) => {
    goal.notes = [...goal.notes, newNote];
    onUpdate();
  };

  return (
    <View
      style={[styles.container, isDone && styles.completedContainer]}
    >
      {/* Movie poster */}
      {category === "Movie" && (
        <Image
          source={
            goal.posterUrl
              ? { uri: goal.posterUrl }
              : require("@/assets/images/logo.png")
          }
          style={styles.poster}
        />
      )}

      <View style={styles.contentContainer}>
        {/* Top section: Title + Actions */}
        <View style={styles.topSection}>
          <View style={styles.titleWrapper}>
            <CustomText
              style={styles.titleText}
              color="#333"
              fontSize={16}
              type="bold"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {goal.name}
            </CustomText>
            {category === "Movie" && (
              <CustomText
                style={styles.infoText}
                color="#666"
                fontSize={14}
                type="regular"
              >
                IMDB: {goal.imdbRate} / {goal.runtime}
              </CustomText>
            )}
          </View>

          <View style={styles.actionsContainer}>
            {/* Book status picker or Movie info */}
            <View style={styles.infoSection}>
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
              )}
            </View>
            <Pressable style={styles.actionButton} onPress={handleAddNote}>
              <PlusIcon size={16} color="#1E3A5F" />
              {/* {width >= 370 && (
                <CustomText
                  style={styles.actionText}
                  color="#666"
                  fontSize={12}
                  type="medium"
                >
                  {t("cardGoalTodo.addNote")}
                </CustomText>
              )} */}
            </Pressable>

            <Pressable style={styles.checkboxButton} onPress={toggleCard}>
              {isDone ? (
                <BoxIcon size={20} color="#1E3A5F" variant="fill" />
              ) : (
                <BoxIcon size={20} color="#1E3A5F" variant="outlined" />
              )}
            </Pressable>
          </View>
        </View>

        {/* Bottom section: Status/Info + Rating/Icons */}
        <View style={styles.bottomSection}>
          {/* Rating and action icons */}
          <View style={styles.ratingSection}>
            <StarRating
              rating={goal.rating}
              onRatingChange={handleRatingChange}
            />

            {/* information icon */}
            <Pressable
              style={styles.iconButton}
              onPress={() => setIsDetailsModalVisible(true)}
            >
              <InfoIcon size={20} color="#1E3A5F" variant="outlined" />
            </Pressable>
          </View>

          <View style={styles.iconsContainer}>
            {/* Edit button for non-Movie categories */}
            {category !== "Movie" && (
              <Pressable
                style={styles.iconButton}
                onPress={() => setIsEditModalVisible(true)}
              >
                <PencilIcon size={20} color="#1E3A5F" />
              </Pressable>
            )}

            {/* Delete button */}
            <Pressable
              style={styles.iconButton}
              onPress={() => setIsConfirmationVisible(true)}
            >
              <TrashIcon size={20} color="#FF6347" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Modals */}
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

      <ConfirmationModal
        visible={isConfirmationVisible}
        title={t("confirmationModal.titleDeleteGoal")}
        message={t("confirmationModal.messageDeleteGoal")}
        onConfirm={() => {
          handleDelete();
          setIsConfirmationVisible(false);
        }}
        onCancel={() => setIsConfirmationVisible(false)}
      />

      {/* Yeni eklenen düzenleme modalı */}
      <EditGoalModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        initialName={goal.name}
        onSave={handleEditSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 8,
    width: width > 768 ? width - 900 : width - 40,
    minHeight: 100,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 15,
  },
  completedContainer: {
    backgroundColor: "#E5EEFF",
  },
  poster: {
    width: 60,
    height: 100,
    marginRight: 15,
    borderRadius: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginLeft: 10,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  titleWrapper: {
    flex: 1,
    paddingRight: 10,
    gap: 2,
    width: "50%",
  },
  titleText: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "50%",
  },
  actionButton: {
    // backgroundColor: "#f1f1f1",
    // paddingHorizontal: 8,
    // paddingVertical: 6,
    // borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  actionText: {
    marginLeft: 4,
  },
  checkboxButton: {
    padding: 5,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 5,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    opacity: 0.7,
  },
  picker: {
    width: 100,
    height: 30,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 12,
    borderRadius: 4,
    borderColor: "#999",
    color: "#666",
    backgroundColor: "transparent",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
  },
  iconButton: {
    margin: 5,
  },
});
