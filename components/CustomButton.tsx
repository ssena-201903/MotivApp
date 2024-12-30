import { TouchableOpacity, Text, View, StyleSheet, Pressable } from 'react-native';

type Props = {
    label: string,
    onPress: () => void;
    variant: 'outlined' | 'fill' | 'disabled';
};
export default function CustomButton ({ label, onPress, variant } : Props) {
    const getButtonStyle = () => {
        switch (variant) {
            case 'outlined':
                return styles.outlined;
            case 'fill':
                return styles.fill;
            case 'disabled':
                return styles.disabled;
            default:
                return styles.fill;
        }
    };

  return (
    <TouchableOpacity
        onPress={variant !== 'disabled' ? onPress : undefined}
        style={[styles.button, getButtonStyle()]}
        disabled={variant === 'disabled'}
    >
        <Text style={[styles.text, variant === 'disabled' && styles.disabledText, 
                    variant === 'outlined' && styles.outlinedText]}>
            {label}
        </Text>
    </TouchableOpacity>
  );
};  

const styles = StyleSheet.create({
    button: {
        padding: 12,
        margin: 4,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        width: 280,
    },
    text: {
        fontSize: 16,
        fontWeight: 400,
        color: "white",
    },
    fill: {
        backgroundColor: "#FF8462", // can change later
    },
    outlined: {
        borderWidth: 2,
        borderColor: "#FFA38F", // can change later
        backgroundColor: "transparent",
    },
    outlinedText: {
        color: "#FFA38F", // can change later
    },
    disabled: {
        backgroundColor: "#FF8462", // can change later
        opacity: 0.7,
    },
    disabledText: {
        color: "white",
        opacity: 0.8,
    },
})
