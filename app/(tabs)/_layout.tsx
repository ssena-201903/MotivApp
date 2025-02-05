import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1E3A5F",
        tabBarInactiveTintColor: "#ACB3BD",
        tabBarStyle: {
          backgroundColor: "#FCFCFC",
          borderTopWidth: 0.1,
          borderTopColor: "#ACB3BD",
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShadowVisible: false,
      }}
    >
      {/* Home Page   */}
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      {/* Calendar Page   */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-clear" size={24} color={color} />
          ),
        }}
      />
      {/* Friends Page   */}
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
