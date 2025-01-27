import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase.config"; 
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/cards/InputField";

const { width } = Dimensions.get("window");

export default function Register() {
  const [step, setStep] = useState(1); // Step state
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // loading state
  const router = useRouter();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
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

    setError("");
    setLoading(true); // start loading

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { name, email, nickname });

      // creating empty collections
      const collections = ["goals", "habits", "memories", "todos", "friends"];
      for (const collection of collections) {
        await setDoc(doc(userRef, collection, "placeholder"), {});
      }

      // router.replace("/home");
      router.replace("/createHabitCard");
    } catch (error: any) {
      setError("Registration failed: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Step {step} of 3</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {step === 1 && (
        <View style={styles.formContainer}>
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />
          <InputField
            label="Nickname"
            placeholder="Enter your nickname"
            value={nickname}
            onChangeText={setNickname}
          />
        </View>
      )}

      {step === 2 && (
        <View style={styles.formContainer}>
          <InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
      )}

      {step === 3 && (
        <View style={styles.formContainer}>
          <InputField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            isPasswordField={true}
          />
          <InputField
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            isPasswordField={true}
          />
        </View>
      )}

      <View style={styles.buttonRow}>
        {step === 1 && (
          <TouchableOpacity
            style={[styles.linkButton, { marginRight: "auto" }]}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.linkButtonText}>Back to Login</Text>
          </TouchableOpacity>
        )}
        {step > 1 && (
          <CustomButton label="Back" onPress={handleBack} variant="cancel" width={180} height={45} />
        )}
        {step < 3 && (
          <CustomButton label="Next" onPress={handleNext} variant="fill" width={180} height={45} />
        )}
        {step === 3 && (
          <CustomButton
            label={loading ? "Creating..." : "Create Account"}
            onPress={handleRegister}
            variant="fill"
            width={180}
            height={45}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "#F9F9F9",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#1E3A5F",
    opacity: 0.8,
    marginBottom: 20,
  },
  formContainer: {
    width: width > 760 ? 400 : width - 40,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width > 760 ? 400 : width - 40,
  },
  linkButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  linkButtonText: {
    color: "#1E3A5F",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
