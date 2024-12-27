import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

type ButtonProps = {
    title: string,
    onPress: () => void;
    variant: 'outlined' | 'fill' | 'disabled';
};

const Button: React.FC<ButtonProps> = ({title, onPress, variant}) => {
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
            {title}
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
        backgroundColor: "#FF8462",
    },
    outlined: {
        borderWidth: 2,
        borderColor: "#FF8462",
        backgroundColor: "transparent",
    },
    outlinedText: {
        color: "#FF8462",
    },
    disabled: {
        backgroundColor: "#FF8462",
    },
    disabledText: {
        color: "white",
    },
})

export default Button
