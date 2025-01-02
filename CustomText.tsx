import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

export const CustomText: React.FC<TextProps> = (props) => {
  return <Text {...props} style={[styles.text, props.style]} />;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Montserrat",
  },
});
