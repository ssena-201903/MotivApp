import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Props = {
  label?: string;
  description?: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
  errorMessage?: string;
  pickerStyle?: any;
  containerStyle?: any;
};

export default function InputPicker({
  label,
  description,
  selectedValue,
  onValueChange,
  items,
  errorMessage,
  pickerStyle,
  containerStyle,
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={[styles.picker, pickerStyle, errorMessage ? styles.errorPicker : {}]}
      >
        {items.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
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
    fontWeight: 600,
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  picker: {
    // borderRadius: 8,
    // padding: 12,
    // fontSize: 16,
    // backgroundColor: "#E5EEFF",
    // marginBottom: 10,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1E3A5F",
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
  },
  errorPicker: {
    borderColor: "#FF6B6B",
  },
  errorText: {
    fontSize: 12,
    color: "#FF6B6B",
    marginTop: 4,
  },
});
