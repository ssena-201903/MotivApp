import React, { useState } from "react";
import {
 Modal,
 View,
 TextInput,
 TouchableOpacity,
 StyleSheet,
} from "react-native";
import { CustomText } from "@/CustomText";
import CustomButton from "../CustomButton";
import { db } from "@/firebase.config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface AddTodoModalProps {
 visible: boolean; 
 selectedDate?: string;
 onClose: () => void;
 userId: string;
}

export default function AddTodoModal({
 visible,
 selectedDate,
 onClose,
 userId,
}: AddTodoModalProps) {
 const [todoText, setTodoText] = useState<string>("");
 const [showRefreshModal, setShowRefreshModal] = useState<boolean>(false);
 
 const navigation = useNavigation();
 const route = useRoute();

 const handleAdd = async () => {
   if (todoText.trim()) {
     try {

      const dueDate = selectedDate
      ? Timestamp.fromDate(new Date(selectedDate))
      : serverTimestamp();

       const todosRef = collection(db, "users", userId, "todos");
       await addDoc(todosRef, {
         text: todoText,
         dueDate: dueDate,
         isDone: false,
         createdAt: serverTimestamp(),
       });

       setTodoText("");
       onClose();
       setShowRefreshModal(true); 
     } catch (error) {
       console.error("Error adding document: ", error);
     }
   }
 };

 return (
   <>
     {/* add todo modal */}
     <Modal
       visible={visible}
       transparent={true}
       animationType="fade"
       onRequestClose={onClose}
     >
       <View style={styles.modalContainer}>
         <View style={styles.modalContent}>
           <CustomText style={styles.modalHeader}>
             {selectedDate ? `${selectedDate}` : "Add New Todo"}
           </CustomText>
           <TextInput
             style={styles.modalInput}
             value={todoText}
             onChangeText={setTodoText}
             placeholder="Write New Todo"
           />
           <View style={styles.modalButtons}>
             <TouchableOpacity style={styles.modalButton}>
               <CustomButton
                 label="Cancel"
                 onPress={onClose}
                 variant="cancel"
                 width={85}
                 height={50}
               />
             </TouchableOpacity>
             <TouchableOpacity style={styles.modalButton}>
               <CustomButton
                 label="Add"
                 onPress={handleAdd}
                 variant="fill"
                 width={85}
                 height={50}
               />
             </TouchableOpacity>
           </View>
         </View>
       </View>
     </Modal>

     {/* refresh screen modal */}
     <Modal 
       visible={showRefreshModal} 
       transparent={true} 
       animationType="fade"
     >
       <View style={styles.modalContainer}>
         <View style={[styles.modalContent, styles.refreshModalContent]}>
           <CustomText style={styles.refreshModalHeader}>
             Added successfully! Refresh to continue
           </CustomText>
           <TouchableOpacity 
             style={styles.refreshButton}
             onPress={() => {
               setShowRefreshModal(false);
               navigation.reset({
                 index: 0,
                 routes: [{ name: route.name }],
               });
             }}
           >
             <Ionicons name="refresh" size={24} color="white" />
           </TouchableOpacity>
         </View>
       </View>
     </Modal>
   </>
 );
}

const styles = StyleSheet.create({
 modalContainer: {
   flex: 1,
   justifyContent: "center",
   alignItems: "center",
   backgroundColor: "rgba(0, 0, 0, 0.5)",
 },
 modalContent: {
   backgroundColor: "#F9F9F9",
   borderRadius: 12,
   padding: 20,
   width: "80%",
   height: 200,
   elevation: 5,
 },
 modalHeader: {
   fontSize: 18,
   fontWeight: "bold",
   marginBottom: 15,
   color: "#264653",
 },
 modalInput: {
   borderWidth: 1,
   borderColor: "#E5EEFF",
   borderRadius: 5,
   padding: 10,
   marginBottom: 15,
   backgroundColor: "#fff",
 },
 modalButtons: {
   flexDirection: "row",
   justifyContent: "flex-end",
 },
 modalButton: {
   marginLeft: 10,
 },
 // refresh screen 
 refreshModalContent: {
   justifyContent: 'center',
   alignItems: 'center',
   height: 180,
   width: "80%",
 },
 refreshModalHeader: {
   fontSize: 16,
   fontWeight: '600',
   color: '#264653',
   textAlign: 'center',
   marginBottom: 20,
 },
 refreshButton: {
   width: 50,
   height: 50,
   borderRadius: 25,
   backgroundColor: '#264653',
   justifyContent: 'center',
   alignItems: 'center',
 },
});