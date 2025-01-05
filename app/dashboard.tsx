import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import CustomButton from "@/components/CustomButton";
import { CustomText } from "@/CustomText";

export default function Dashboard() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleRegister = () => {
    router.push("/auth/register");
  };

  return (
    <View style={styles.container}>
      {/* Üst kısım - Logo ve İkonlar */}
      <View style={styles.topSection}>
        <CustomText style={styles.appTitle}>MotivApp</CustomText>
      </View>

      {/* Orta kısım - Pattern Arka Plan */}
      <View style={styles.patternBackground}>
        <LottieView
          source={require("@/assets/animations/pouring_water.json")} // JSON animasyon dosyasının yolu
          autoPlay
          loop
          style={styles.animation}
        />
      </View>

      {/* Alt kısım - Butonlar */}
      <View style={styles.bottomSection}>
          <CustomButton label="Login" onPress={handleLogin} variant="fill"/>
          <CustomButton label="Create Account" onPress={handleLogin} variant="outlined"/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  topSection: {
    padding: 20,
    alignItems: "center",
    marginTop: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#264653",
    fontFamily: ""
  },
  patternBackground: {
    flex: 1,
  },
  animation: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bottomSection: {
    padding: 20,
    gap: 10,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: "#FFA69E",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFA69E",
  },
  secondaryButtonText: {
    color: "#FFA69E",
    fontSize: 16,
    fontWeight: "600",
  },
});
