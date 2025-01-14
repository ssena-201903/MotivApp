import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase.config";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const db = getFirestore();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
  
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { name, email });
  
      // creating empty collections
      const collections = ["goals", "habits", "memories", "todos", "friends"];
      for (const collection of collections) {
        await setDoc(doc(userRef, collection, "placeholder"), {}); 
      }
  
      router.replace("/home");
    } catch (error) {
      setError("Registration failed: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Please fill in the form to continue</Text>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#827F7F"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#827F7F"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#827F7F"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#827F7F"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      <CustomButton
        label="Create Account"
        onPress={handleRegister}
        variant="fill"
        width={370}
      />
      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text style={styles.loginLinkText}>Login</Text>
        </Text>
      </TouchableOpacity>
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
  headerContainer: {
    marginTop: 100,
    marginBottom: 40,
    alignItems: "center",
    width: 370,
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
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    width: 370,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#E5EEFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  // registerButton: {
  //   backgroundColor: "#007AFF",
  //   padding: 15,
  //   borderRadius: 10,
  //   alignItems: "center",
  // },
  // registerButtonText: {
  //   color: "white",
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLinkText: {
    color: "#1E3A5F",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
