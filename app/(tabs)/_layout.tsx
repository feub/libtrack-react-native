import { Redirect, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "@/hooks/useAuth";

export default function TabLayout() {
  const { loading, isLoggedIn } = useAuth();

  if (loading) {
    return null; // or a loading spinner
  }

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#e78128",
        tabBarInactiveTintColor: "#9d9d9d",
        headerStyle: {
          backgroundColor: "#111113",
        },
        headerShadowVisible: true,
        headerTintColor: "#fb9d4b",
        tabBarStyle: {
          backgroundColor: "#111113",
          borderTopColor: "#111113",
        },
        headerTitleStyle: {},
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
            <MaterialIcons
              name={focused ? "qr-code-scanner" : "qr-code-scanner"}
              size={24}
              color={color}
            />
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
