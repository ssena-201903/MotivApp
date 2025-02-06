import { Stack } from "expo-router";
import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase.config";
import React from "react";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        {/* (tabs) */}
        <Stack.Screen 
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* opening screen */}
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        {/* Auth group */}
        <Stack.Screen
          name="(auth)/login"
          options={{
            headerShown: false,
            presentation: "modal",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="(auth)/register"
          options={{
            headerShown: false,
            presentation: "modal",
            gestureEnabled: false,
          }}
        />
        {/* onboarding */}
        <Stack.Screen
          name="(auth)/createHabitCard"
          options={{
            headerShown: false,
          }}
        />

        {/* main screens */}
        <Stack.Screen
          name="home"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: true,
            title: "Notifications",
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: true,
            title: "Profile",
          }}
        />
        <Stack.Screen
          name="habits"
          options={{
            headerShown: true,
            title: "Habits",
          }}
        />
        <Stack.Screen
          name="goals"
          options={{
            headerShown: true,
            title: "Goals",
          }}
        />
        <Stack.Screen
          name="emailVerification"
          options={{
            headerShown: true,
            title: "Go Back To Login",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}

// Export AuthContext for use in other components
export const useAuth = () => React.useContext(AuthContext);
