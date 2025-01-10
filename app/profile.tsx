import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Pressable,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { 
  auth, 
  db 
} from '@/firebase.config';
import { 
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { 
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';

const { width } = Dimensions.get('window');

export default function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '••••••'
  });
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({
    visible: false,
    field: '',
    value: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        router.replace('/(auth)/register');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      setUserData({
        name: userDoc.data()?.name || '',
        email: user.email || '',
        password: '••••••'
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  const handleEditField = (field: string, currentValue: string) => {
    setEditModal({
      visible: true,
      field,
      value: field === 'password' ? '' : currentValue
    });
  };

  const handleSaveEdit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      switch (editModal.field) {
        case 'Name':
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, {
            name: editModal.value
          });
          setUserData(prev => ({ ...prev, name: editModal.value }));
          break;

        case 'Password':
          await updatePassword(user, editModal.value);
          setUserData(prev => ({ ...prev, password: '••••••' }));
          break;
      }

      setEditModal({ visible: false, field: '', value: '' });
      Alert.alert('Success', `${editModal.field} updated successfully`);
    } catch (error) {
      console.error('Error updating field:', error);
      Alert.alert('Error', 'Failed to update. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) return;

              // Delete user document from Firestore
              await deleteDoc(doc(db, 'users', user.uid));
              
              // Delete user authentication
              await deleteUser(user);
              
              router.replace('/(auth)/register');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          }
        }
      ]
    );
  };

  const ProfileField = ({ 
    label, 
    value, 
    isPassword = false 
  }: { 
    label: string; 
    value: string; 
    isPassword?: boolean;
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValueContainer}>
        <Text style={styles.fieldValue}>
          {isPassword ? '••••••' : value}
        </Text>
        {label !== 'User Name' && (
          <TouchableOpacity 
            onPress={() => handleEditField(label, value)}
            style={styles.editButton}
          >
            <Ionicons name='pencil' size={18} color="#666"/>
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
        <ProfileField 
          label="Name" 
          value={userData.name} 
        />
        <ProfileField 
          label="User Name" 
          value={userData.email} 
        />
        <ProfileField 
          label="Password" 
          value={userData.password} 
          isPassword 
        />
      </View>

      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={handleDeleteAccount}
      >
        <CustomButton label='Delete Account' variant='fill' width="100%" height={50}/>
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal
        visible={editModal.visible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit {editModal.field}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={editModal.value}
              onChangeText={(text) => setEditModal(prev => ({ ...prev, value: text }))}
              secureTextEntry={editModal.field === 'Password'}
              placeholder={`Enter new ${editModal.field.toLowerCase()}`}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModal({ visible: false, field: '', value: '' })}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    backgroundColor: '#fff',
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
    color: '#333',
    marginBottom: 8,
  },
  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E5EEFF',
    padding: 12,
    borderRadius: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    marginHorizontal: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#1e3a5f',
  },
  cancelButtonText: {
    color: '#333',
  },
  saveButtonText: {
    color: '#fff',
  },
});