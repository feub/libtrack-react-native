import { Tabs } from "expo-router";
import { Colors } from "react-native-ui-lib";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
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
