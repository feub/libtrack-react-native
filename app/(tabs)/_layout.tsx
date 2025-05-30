import { Redirect, Tabs } from "expo-router";
import { Colors } from "react-native-ui-lib";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "@/hooks/useAuth";

export default function TabLayout() {
  const { loading, isLoggedIn, token, user } = useAuth();

  console.log("loading", loading);
  console.log("isLoggedIn", isLoggedIn);
  console.log("token", token);
  console.log("user", user);

  if (loading) {
    return null; // or a loading spinner
  }

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  // const { user } = useAuth();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.primaryInactive,
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerShadowVisible: true,
        headerTintColor: Colors.primary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.background,
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
