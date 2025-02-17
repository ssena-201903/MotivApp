import React, { useEffect, useState } from "react";
import { Text, TextProps, View } from "react-native";
import * as Font from "expo-font";

interface CustomTextProps extends TextProps {
  type?: 'regular' | 'medium' | 'semibold' | 'bold';
  fontSize?: number;
  color?: string;
}

export const CustomText: React.FC<CustomTextProps> = ({ 
  type = 'regular', 
  fontSize = 14, 
  color = '#000000',
  style,
  ...props 
}) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      try {
        await Font.loadAsync({
          'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
          'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
          'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
          'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
        });
        setFontLoaded(true);
      } catch (error) {
        console.error('Font yükleme hatası:', error);
      }
    }
    loadFont();
  }, []);

  if (!fontLoaded) {
    return <View />;
  }

  const getFontFamily = () => {
    switch (type) {
      case 'medium':
        return 'Montserrat-Medium';
      case 'semibold':
        return 'Montserrat-SemiBold';
      case 'bold':
        return 'Montserrat-Bold';
      default:
        return 'Montserrat-Regular';
    }
  };

  return (
    <Text 
      {...props} 
      style={[
        {
          fontFamily: getFontFamily(),
          fontSize: fontSize,
          color: color,
        },
        style
      ]} 
    />
  );
};