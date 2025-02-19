import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import { CustomText } from "@/CustomText"; // Özel metin bileşenin
import InfoIcon from "../icons/InfoIcon"; // Bilgi ikonu bileşenin
import { Timestamp } from "firebase/firestore";

import { useLanguage } from "@/app/LanguageContext";

const { width } = Dimensions.get("window");

type GoalDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  goal: any;
};

// function to format date
const formatDate = (timestamp: Timestamp | null) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString();
};

export default function GoalDetailsModal({
  visible,
  onClose,
  goal,
}: GoalDetailsModalProps) {
  const { t, language, setLanguage } = useLanguage();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <CustomText
            style={styles.title}
            color="#1E3A5F"
            fontSize={12}
            type="semibold"
          >
            {goal.name}
          </CustomText>

          {/* Director (if category is Movie) */}
          {goal.category === "Movie" && (
            <View style={styles.detailItem}>
              <CustomText
                style={styles.detailLabel}
                color="#1E3A5F"
                fontSize={14}
                type="regular"
              >
                {t("goalDetails.director")}
              </CustomText>
              <CustomText type="medium" color="#333" fontSize={16}>
                {goal.director || "Unknown"}
              </CustomText>
            </View>
          )}

          {/* Author (if category is Book) */}
          {goal.category === "Book" && (
            <View style={styles.detailItem}>
              <CustomText
                style={styles.detailLabel}
                color="#1E3A5F"
                fontSize={14}
                type="regular"
              >
                {t("goalDetails.author")}
              </CustomText>
              <CustomText type="medium" color="#333" fontSize={16}>
                {goal.author || "Unknown"}
              </CustomText>
            </View>
          )}

          {/* Created At */}
          <View style={styles.detailItem}>
            <CustomText
              style={styles.detailLabel}
              color="#1E3A5F"
              fontSize={14}
              type="regular"
            >
              {t("goalDetails.createdAt")}
            </CustomText>
            <CustomText type="medium" color="#333" fontSize={16}>
              {formatDate(goal.createdAt)}
            </CustomText>
          </View>

          {/* Finished At */}
          <View style={styles.detailItem}>
            <CustomText
              style={styles.detailLabel}
              color="#1E3A5F"
              fontSize={14}
              type="regular"
            >
              {t("goalDetails.finishedAt")}
            </CustomText>
            <CustomText type="medium" color="#333" fontSize={16}>
              {goal.finishedAt ? formatDate(goal.finishedAt) : "-"}
            </CustomText>
          </View>

          {/* Notes List */}
          <CustomText
            style={styles.sectionTitle}
            color="#1E3A5F"
            fontSize={16}
            type="semibold"
          >
            {t("goalDetails.notes")}
          </CustomText>
          {goal.notes?.length > 0 ? (
            <FlatList
              data={goal.notes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <CustomText style={styles.quoteItem} type="medium" color="#333">
                  - {item}
                </CustomText>
              )}
            />
          ) : (
            <CustomText style={styles.quoteItem} type="medium" color="#333">
              {t("goalDetails.noNotesAdded")}
            </CustomText>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 20,
    width: width > 768 ? "30%" : width - 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailLabel: {
    marginRight: 10,
  },
  sectionTitle: {
    marginTop: 15,
    marginBottom: 10,
  },
  quoteItem: {
    fontStyle: "italic",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#1E3A5F",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
