import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase.config';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { CustomText } from '@/CustomText';

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [emailFocus, setEmailFocus] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/home');
    } catch (error) {
      setError('could not login: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CustomText style={styles.title}>Welcome Back!</CustomText>
        <CustomText style={styles.subtitle}>Please sign in to continue</CustomText>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.formContainer}>
      <TextInput
          style={[
            styles.input, 
            { borderColor: emailFocus ? '#E5EEFF' : '#E5EEFF' } // Email input focus color
          ]}
          placeholder="Email"
          placeholderTextColor="#827F7F"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          onFocus={() => setEmailFocus(true)} 
          onBlur={() => setEmailFocus(false)} 
        />

        <TextInput
          style={[
            styles.input, 
            { borderColor: passwordFocus ? '#E5EEFF' : '#E5EEFF' } // Password input focus color
          ]}
          placeholder="Password"
          placeholderTextColor="#827F7F"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onFocus={() => setPasswordFocus(true)} 
          onBlur={() => setPasswordFocus(false)} 
        />

        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={() => console.log('Forgot password')}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <CustomButton label='Login' onPress={handleLogin} variant='fill'/>

        <TouchableOpacity 
          style={styles.registerLink}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.registerText}>
            Don't have an account? <CustomText style={styles.registerLinkText}>Create Account</CustomText>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#F9F9F9',
    padding: 20,
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
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#1E3A5F",
    opacity: 0.8,
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    width: 370,
  },
  input: {
    backgroundColor: "#E5EEFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 40,
    fontSize: 12,
    color: "#1E3A5F",
    opacity: 0.6,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLinkText: {
    color: "#1E3A5F", // can change later
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});