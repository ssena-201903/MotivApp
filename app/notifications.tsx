import {
    View,
    StyleSheet,
    Dimensions,
    Pressable,
    TouchableOpacity,
  } from "react-native";
  import { CustomText } from "@/CustomText";
  import { Ionicons } from "@expo/vector-icons";
  import { router, useRouter } from "expo-router";
  import { useEffect, useState } from "react";
  import { auth } from "@/firebase.config";
  
  const { width } = Dimensions.get("window");
  
  type Props = {
    onDiamondPress: () => void;
    onDatePress: () => void;
  };
  
  export default function NotificationPage({ onDiamondPress, onDatePress }: Props) {

    return (
      <View style={styles.container}>
        
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: "#1E3A5F",
      borderRadius: 8,
      width: width > 760 ? width - 600 : width - 40,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginHorizontal: 20,
      marginTop: width > 760 ? 10 : 30,
      marginBottom: 20,
    },
  });
  