import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type StarRatingProps = {
  rating: number;
  onRatingChange: (rating: number) => void;
};

export default function StarRating ({ rating, onRatingChange }: StarRatingProps) {
  return (
    <View style={styles.starContainer}>
      {Array.from({ length: 5 }, (_, index) => (
        <TouchableOpacity key={index} onPress={() => onRatingChange(index + 1)}>
          <FontAwesome
            name={index < rating ? "star" : "star-o"}
            size={20}
            color={index < rating ? "#FFA38F" : "#1E3A5F"}
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
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  icon: {
    marginLeft: 2,
  }
});
