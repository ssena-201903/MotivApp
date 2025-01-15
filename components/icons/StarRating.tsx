import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type StarRatingProps = {
  rating: number;
  onRatingChange: (rating: number) => void;
};

export default function StarRating ({ rating, onRatingChange }: StarRatingProps) {
  return (
    <View style={styles.starContainer}>
      {Array.from({ length: 5 }, (_, index) => (
        <TouchableOpacity key={index} onPress={() => onRatingChange(index + 1)}>
          <Ionicons
            name={index < rating ? "star" : "star-outline"}
            size={20}
            color={index < rating ? "#8FE247" : "#1E3A5F"}
            style={styles.icon}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  icon: {
    marginLeft: 2,
  }
});
