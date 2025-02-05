import { CustomText } from "@/CustomText";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import AddTodoModal from "@/components/modals/AddTodoModal";
import CardTodo from "@/components/cards/CardTodo";
import { db, auth } from "@/firebase.config";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  where,
  Timestamp,
} from "firebase/firestore";

const { width } = Dimensions.get("screen");

interface Todo {
  id: string;
  text: string;
  isDone: boolean;
  createdAt: Timestamp;
  dueDate: string;
}

export default function FriendsPage() {
  return (
    <ScrollView style={styles.container}>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
});
