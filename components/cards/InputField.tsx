import { CustomText } from "@/CustomText";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type Props = {
  label?: string;
  description?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSave?: (field: string, currentValue: string) => void;
  isEditable?: boolean;
  secureTextEntry?: boolean;
  isPasswordField?: boolean;
  errorMessage?: string;
  inputStyle?: any;
  containerStyle?: any;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  variant?: "default" | "password" | "email" | "edit";
};

export default function InputField({
  label,
  description,
  placeholder,
  value,
  onChangeText,
  onSave,
  isEditable = true,
  secureTextEntry =  false,
  isPasswordField = false,
  errorMessage,
  inputStyle,
  containerStyle,
  keyboardType = "default",
  variant = "default",
}: Props) {
  const [isSecure, setIsSecure] = useState(secureTextEntry || false);
  const hasIcon = variant === "password" || variant === "email";

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  const handleSavePress = () => {
    if (onSave && label) {
      onSave(label, value || "");
    }
  };

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        !isEditable && { opacity: 0.5 }, // Düzenlenemez durum için opaklık
      ]}
      pointerEvents={isEditable ? "auto" : "none"} // Tıklanabilirliği kontrol et
    >
      {label && <CustomText style={styles.label}>{label}</CustomText>}
      {description && (
        <CustomText style={styles.description}>{description}</CustomText>
      )}
      <View
        style={[
          styles.inputContainer,
          errorMessage ? styles.errorInput : {},
          
        ]}
      >
        {variant === "password" && (
          <Ionicons
            name="lock-closed"
            size={18}
            color="#666"
            style={styles.iconLeft}
          />
        )}
        {variant === "email" && (
          <Ionicons
            name="mail"
            size={18}
            color="#666"
            style={styles.iconLeft}
          />
        )}
        <TextInput
          style={[
            styles.input,
            inputStyle,
            errorMessage ? styles.errorInput : {},
            !hasIcon && { marginLeft: 6 },
            !isEditable && styles.disabledInput, // Düzenlenemez giriş
          ]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPasswordField && isSecure}
          keyboardType={keyboardType}
          editable={isEditable && variant !== "edit"}
        />
        {variant === "password" && (
          <Ionicons
            name={isSecure ? "eye-off" : "eye"}
            size={18}
            color="#666"
            style={styles.iconRight}
            onPress={toggleSecureEntry} // Sadece düzenlenebilirken
          />
        )}
        {variant === "edit" && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={isEditable ? handleSavePress : undefined}
          >
            <Ionicons name="pencil" size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#1E3A5F",
    fontWeight: "600",
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  inputContainer: {
    position: "relative",
    borderRadius: 12,
    backgroundColor: "#F5F8FF",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5EEFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: "#1E3A5F",
    fontWeight: "medium",
    borderRadius: 12,
    marginLeft: 30,
  },
  iconLeft: {
    position: "absolute",
    left: 14,
    color: "#1E3A5F",
    opacity: 0.5,
  },
  iconRight: {
    position: "absolute",
    right: 14,
    color: "#1E3A5F",
    opacity: 0.5,
  },
  errorInput: {
    borderColor: "#FF6B6B",
  },
  errorText: {
    fontSize: 12,
    color: "#FF6B6B",
    marginTop: 4,
  },
  disabledInput: {
    color: "#999", // Düzenlenemez için farklı renk
  },
  disabledInputContainer: {
    cursor: "not-allowed", // Fare imleci değişimi
  },
});
