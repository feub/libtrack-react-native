import { useEffect, useState } from "react";
import { Tabs, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, View } from "react-native";

export default function TabLayout() {
  const { authState, isTokenExpired } = useAuth();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Check authentication
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (!authState || !isTokenExpired) {
        setIsAuthChecked(false);
        return;
      }

      if (authState && isTokenExpired) {
        if (!authState.authenticated || isTokenExpired()) {
          console.log("Token expired, logging out.");
          router.replace("/login");
          return;
        }
        setIsAuthChecked(true);
      }
    }, 1000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [authState, router, isTokenExpired]);

  if (!isAuthChecked) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#111113",
        }}
      >
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "#71717a",
        headerStyle: {
          backgroundColor: "#111113",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#111113",
          borderTopColor: "#27272a",
        },
        headerTitleStyle: {
          fontFamily: "Quicksand_700Bold",
        },
        headerTitleContainerStyle: {
          width: 200,
        },
      }}
    >
      <Tabs.Screen
        name="releases"
        options={{
          title: "My collection",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "musical-notes-sharp" : "musical-notes-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Scanner",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="qr-code-scanner" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
