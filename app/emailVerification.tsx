import { View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { push } from "expo-router/build/global-state/routing";

export default function EmailVerification() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleEmailSubmit = async () => {
    try {
      const formattedEmail = email.trim();
      const auth = getAuth();

      if (!formattedEmail) {
        throw new Error("Please enter your email address.");
      }

      // Şifre sıfırlama e-postası gönder
      await sendPasswordResetEmail(auth, formattedEmail);

      setSuccess(
        "Password reset email sent! Please check your inbox (or spam folder)."
      );
      setError(""); // Hata mesajını temizle
      router.push("/(auth)/login");
    } catch (error: any) {
      setSuccess(""); // Başarı mesajını temizle
      setError(error.message || "Failed to send reset email.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Please enter your email address to receive a reset link
        </Text>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>{success}</Text>}

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address (e.g. user@example.com)"
          placeholderTextColor="#827F7F"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <CustomButton
        label="Send Reset Link"
        onPress={handleEmailSubmit}
        variant="fill"
        width={370}
        height={45}
      />
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
    textAlign: "center",
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
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  success: {
    color: "green",
    marginBottom: 10,
    textAlign: "center",
  },
});
