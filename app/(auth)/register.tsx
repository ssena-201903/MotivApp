import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
  ImageBackground,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase.config";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/cards/InputField";
import { CustomText } from "@/CustomText";

const { width, height } = Dimensions.get("window");

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const capitalizeName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!name || !nickname || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    const formattedName = capitalizeName(name);
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { formattedName, email, nickname });

      const collections = ["goals", "habits", "memories", "todos", "friends"];
      for (const collection of collections) {
        await setDoc(doc(userRef, collection, "placeholder"), {});
      }

      router.replace("/createHabitCard");
    } catch (error: any) {
      setError("Registration failed: " + error.message);
    }
  };

  const backgroundImage =
    Platform.OS === "web"
      ? require("@/assets/images/bg_2.png")
      : require("@/assets/images/mobile_bg.png");

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.pageContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <CustomText style={styles.title}>Create Account</CustomText>
            <CustomText style={styles.subtitle}>Step {step} of 3</CustomText>
          </View>
          {/* <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Step {step} of 3</Text> */}

          {error && <Text style={styles.error}>{error}</Text>}

          {step === 1 && (
            <View style={styles.formContainer}>
              <View style={styles.formItem}>
                <InputField
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  variant="name"
                />
              </View>
              <View style={styles.formItem}>
                <InputField
                  label="Nickname"
                  placeholder="Enter your nickname"
                  value={nickname}
                  onChangeText={setNickname}
                  variant="nickname"
                />
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.formContainer}>
              <View style={styles.formItem}>
                <InputField
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  variant="email"
                />
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.formContainer}>
              <View style={styles.formItem}>
                <InputField
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  variant="password"
                />
              </View>
              <View style={styles.formItem}>
                <InputField
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  variant="password"
                />
              </View>
            </View>
          )}

          <View style={styles.buttonRow}>
            {step === 1 && (
              <CustomButton
                label="Back to Login"
                onPress={() => router.push("/login")}
                variant="cancel"
                width="50%"
                height={50}
              />
            )}
            {step > 1 && (
              <CustomButton
                label="Back"
                onPress={handleBack}
                variant="cancel"
                width="50%"
                height={50}
              />
            )}
            {step < 3 && (
              <CustomButton
                label="Next"
                onPress={handleNext}
                variant="fill"
                width="50%"
                height={50}
                marginLeft={10}
              />
            )}
            {step === 3 && (
              <CustomButton
                label={loading ? "Creating..." : "Create Account"}
                onPress={handleRegister}
                variant="fill"
                width="50%"
                height={50}
                marginLeft={10}
              />
            )}
          </View>
        </View>

        {!isKeyboardVisible && Platform.OS !== "web" && (
          <View style={styles.dashboardContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/brandName2.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <CustomText style={styles.logoText}>from Lotustech</CustomText>
            </View>
            {/* <View style={styles.logoSloganContainer}>
                      <CustomText style={styles.logoSlogan}>
                        fun way to motivation
                      </CustomText>
                    </View> */}
          </View>
        )}
        {Platform.OS === "web" && (
          <View style={styles.dashboardContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/brandName2.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <CustomText style={styles.logoText}>from Lotustech</CustomText>
            </View>
            {/* <View style={styles.logoSloganContainer}>
                      <CustomText style={styles.logoSlogan}>
                        fun way to motivation
                      </CustomText>
                    </View> */}
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  pageContainer: {
    flex: 1,
    alignItems: "center",
    // backgroundColor: "#FCFCFC",
    position: "relative",
    paddingBottom: Platform.OS === "web" ? 0 : 40,
    justifyContent: Platform.OS === "web" ? "center" : "flex-end",
  },
  container: {
    width: "100%",
    maxWidth: 480,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  dashboardContainer: {
    position: "absolute",
    alignItems: "flex-start",
    top: 10,
    left: Platform.OS === "web" ? 30 : "auto",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 60,
  },
  logoText: {
    fontSize: 12,
    color: "#1E3A5F",
    opacity: 0.8,
    fontWeight: "400",
    marginTop: -15,
  },
  logoSloganContainer: {
    marginTop: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    width: 200,
  },
  logoSlogan: {
    fontSize: Platform.OS === "web" ? 16 : width * 0.04,
    color: "#1E3A5F",
    // opacity: 0.8,
    fontWeight: "600",
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: Platform.OS === "web" ? 32 : width * 0.08,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Platform.OS === "web" ? 16 : width * 0.04,
    color: "#1E3A5F",
    opacity: 0.8,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    marginBottom: 40,
  },
  formItem: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignItems: "center",
    marginTop: 20,
  },
  linkButton: {
    paddingVertical: 10,
  },
  linkButtonText: {
    color: "#1E3A5F",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
