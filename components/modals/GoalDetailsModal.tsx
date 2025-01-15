import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type GoalDetailsProps = {
  goal: {
    createdAt?: string;
    author?: string;
    notes?: string[];
  };
  onClose: () => void;
};

export default function GoalDetailsModal({ goal, onClose }: GoalDetailsProps) {
  return (
    <View style={styles.modal}>
      <Text style={styles.text}>Created At: {goal.createdAt || 'Unknown'}</Text>
      {goal.author && <Text style={styles.text}>Author/Director: {goal.author}</Text>}
      <Text style={styles.text}>Notes/Quotes:</Text>
      {goal.notes?.length ? (
        goal.notes.map((note, index) => (
          <Text key={index} style={styles.note}>{note}</Text>
        ))
      ) : (
        <Text style={styles.note}>No notes available</Text>
      )}
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    color: '#CCC',
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1E3A5F',
    borderRadius: 5,
  },
  closeText: {
    color: '#FFF',
    fontSize: 16,
  },
});
