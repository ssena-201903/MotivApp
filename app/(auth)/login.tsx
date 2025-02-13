import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
  Image,
  ImageBackground,
  Keyboard,
} from "react-native";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase.config";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { CustomText } from "@/CustomText";
import InputField from "@/components/cards/InputField";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [emailFocus, setEmailFocus] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
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

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/home");
    } catch (error) {
      setError("could not login, invalid email or password");
    }
  };

  const handleForgotPassword = () => {
    router.push("/emailVerification");
  };

  const backgroundImage =
    Platform.OS === "web"
      ? require("@/assets/images/habitCardBg.png")
      : require("@/assets/images/mobileBg.png");

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <CustomText style={styles.title}>Welcome Back!</CustomText>
            <CustomText style={styles.subtitle}>
              Please sign in to continue
            </CustomText>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.formContainer}>
            <View style={styles.formItem}>
              <InputField
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                secureTextEntry={false}
                errorMessage={error}
                inputStyle={{
                  borderColor: emailFocus ? "#1E3A5F" : "#E5EEFF",
                  width: "100%",
                }}
                variant="email"
              />
            </View>

            <View style={styles.formItem}>
              <InputField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                isPasswordField={true}
                errorMessage={error}
                inputStyle={{
                  borderColor: passwordFocus ? "#1E3A5F" : "#E5EEFF",
                  width: "100%",
                }}
                variant="password"
              />
            </View>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <CustomButton
                label="Login"
                onPress={handleLogin}
                variant="fill"
                width="80%"
                height={50}
              />
              <TouchableOpacity
                style={styles.registerLink}
                onPress={() => router.push("/register")}
              >
                <Text style={styles.registerText}>
                  Don't have an account?{" "}
                  <CustomText style={styles.registerLinkText}>
                    Create Account
                  </CustomText>
                </Text>
              </TouchableOpacity>
            </View>
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
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "web" ? 0 : 40,
    justifyContent: Platform.OS === "web" ? "center" : "flex-end",
    alignItems: "center",
    // backgroundColor: "#FCFCFC",
    position: "relative",
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
  container: {
    width: "100%",
    maxWidth: 480,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
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
    alignItems: "center",
  },
  formItem: {
    width: "100%",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#666",
    fontSize: 12,
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#666",
  },
  registerLinkText: {
    color: "#1E3A5F",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  patternBackground: {
    alignItems: "center",
    flex: 1,
  },
  animation: {
    width: 50,
    height: 50,
    position: "absolute",
  },
});
