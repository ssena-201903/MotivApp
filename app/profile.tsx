import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { auth, db } from "@/firebase.config";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import CustomAlert from "@/components/CustomAlert";

const { width } = Dimensions.get("window");

export default function Profile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "••••••",
  });
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({
    visible: false,
    field: "",
    value: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    password: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        router.replace("/(auth)/register");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      setUserData({
        name: userDoc.data()?.name || "",
        email: user.email || "",
        password: "••••••",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      CustomAlert("Error", "Failed to load user data");
    }
  };

  const reauthenticateUser = async (password: string) => {
    const user = auth.currentUser;
    if (!user?.email) return false;

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      console.error("Reauthentication error:", error);
      return false;
    }
  };

  const handleEditField = (field: string, currentValue: string) => {
    setEditModal({
      visible: true,
      field,
      value: field === "password" ? "" : currentValue,
    });
  };

  const handleSaveEdit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      switch (editModal.field) {
        case "Name":
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            name: editModal.value,
          });
          setUserData((prev) => ({ ...prev, name: editModal.value }));
          break;

        case "Password":
          const isReauthenticated = await reauthenticateUser(currentPassword);
          if (!isReauthenticated) {
            CustomAlert("Error", "Current password is incorrect");
            return;
          }

          await updatePassword(user, editModal.value);
          setUserData((prev) => ({ ...prev, password: "New Password" }));
          break;
      }

      setEditModal({ visible: false, field: "", value: "" });
      setCurrentPassword("");
      CustomAlert("Success", `${editModal.field} updated successfully`);
    } catch (error) {
      console.error("Error updating field:", error);
      CustomAlert("Error", "Failed to update. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    CustomAlert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          style: "destructive",
          onPress: () => setDeleteModal({ visible: true, password: "" }),
        },
      ]
    );
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.password) {
      CustomAlert("Error", "Password is required");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return;

      const isReauthenticated = await reauthenticateUser(deleteModal.password);
      if (!isReauthenticated) {
        CustomAlert("Error", "Invalid password");
        return;
      }

      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);

      setDeleteModal({ visible: false, password: "" });
      router.replace("/(auth)/register");
    } catch (error) {
      console.error("Error deleting account:", error);
      CustomAlert("Error", "Failed to delete account. Please try again.");
    }
  };

  const ProfileField = ({
    label,
    value,
    isPassword = false,
  }: {
    label: string;
    value: string;
    isPassword?: boolean;
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValueContainer}>
        <Text style={styles.fieldValue}>{isPassword ? "••••••" : value}</Text>
        {label !== "Username" && (
          <TouchableOpacity
            onPress={() => handleEditField(label, value)}
            style={styles.editButton}
          >
            <Ionicons name="pencil" size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ProfileField label="Name" value={userData.name} />
        <ProfileField label="Username" value={userData.email} />
        <ProfileField label="Password" value={userData.password} isPassword />
      </View>

      <TouchableOpacity style={styles.deleteButton}>
        <CustomButton
          label="Delete Account"
          variant="fill"
          width="100%"
          height={50}
          onPress={handleDeleteAccount}
        />
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal visible={editModal.visible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editModal.field}</Text>

            {editModal.field === "Password" && (
              <TextInput
                style={styles.modalInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Enter current password"
              />
            )}

            <TextInput
              style={styles.modalInput}
              value={editModal.value}
              onChangeText={(text) =>
                setEditModal((prev) => ({ ...prev, value: text }))
              }
              secureTextEntry={editModal.field === "Password"}
              placeholder={`Enter new ${editModal.field.toLowerCase()}`}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setEditModal({ visible: false, field: "", value: "" });
                  setCurrentPassword("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={deleteModal.visible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Account Deletion</Text>
            <Text style={styles.modalDescription}>
              Please enter your password to confirm account deletion
            </Text>

            <TextInput
              style={styles.modalInput}
              value={deleteModal.password}
              onChangeText={(text) =>
                setDeleteModal((prev) => ({ ...prev, password: text }))
              }
              secureTextEntry
              placeholder="Enter your password"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity>
                <CustomButton
                  label="Cancel"
                  onPress={() =>
                    setDeleteModal({ visible: false, password: "" })
                  }
                  variant="cancel"
                  width={80}
                  height={50}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <CustomButton
                  label="Delete"
                  onPress={handleConfirmDelete}
                  variant="fill"
                  width={80}
                  height={50}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    backgroundColor: "#FCFCFC",
    width: width > 760 ? width - 700 : width - 40,
    height: "100%",
  },
  content: {
    padding: 20,
    marginTop: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  fieldValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E5EEFF",
    padding: 12,
    borderRadius: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    marginHorizontal: 20,
    alignItems: "center",
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FCFCFC",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    color: "#264653",
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#E5EEFF",
  },
  saveButton: {
    backgroundColor: "#1e3a5f",
  },
  cancelButtonText: {
    color: "#333",
  },
  saveButtonText: {
    color: "#fff",
  },
  modalDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  deleteButtonText: {
    color: "#fff",
  },
});
