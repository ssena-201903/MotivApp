import React, { useEffect, useState } from "react";
import { Text, TextProps, StyleSheet, View } from "react-native";
import * as Font from "expo-font";

export const CustomText: React.FC<TextProps> = (props) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
      });
      setFontLoaded(true);
    }
    loadFont();
  }, []);

  if (!fontLoaded) {
    return <View />; // Font yüklenene kadar boş bir alan göster (ya da alternatif bir loader koy)
  }

  return <Text {...props} style={[styles.text, props.style]} />;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Montserrat-Regular", // Font adını yüklediğin isimle birebir aynı yap
  },
});
