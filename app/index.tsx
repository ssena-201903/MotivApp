import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import CustomButton from "@/components/CustomButton";
import { CustomText } from "@/CustomText";
import { useAuth } from "./_layout";

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      // if user already login
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/(auth)/login");
      }
    }, 3000);
  })

  // const handleLogin = () => {
  //   router.push("/(auth)/login");
  // };

  // const handleRegister = () => {
  //   router.push("/(auth)/register");
  // };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <CustomText style={styles.appTitle}>MotivApp</CustomText>
      </View>

      <View style={styles.patternBackground}>
        <LottieView
          source={require("@/assets/animations/clock_animate.json")} // JSON animasyon dosyasının yolu
          autoPlay
          loop
          style={styles.animation}
        />
      </View>

      {/* <View style={styles.bottomSection}>
          <CustomButton label="Login" onPress={handleLogin} variant="fill"/>
          <CustomButton label="Create Account" onPress={handleRegister} variant="outlined"/>
      </View> */}
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
    marginTop: 120,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#264653",
    // fontFamily: "VarelaRound",
  },
  patternBackground: {
    alignItems: "center",
    flex: 1,
    // width: 300,
    // height: 300,
  },
  animation: {
    width: 300,
    height: 300,
    position: 'absolute',
  },
  bottomSection: {
    padding: 20,
    gap: 10,
    marginBottom: 30,
    width: 340,
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
