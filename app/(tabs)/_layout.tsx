import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import useAuth from "@/hooks/useAuth";
// import { useRouter } from "expo-router";

export default function TabLayout() {
  // const isAuthenticated = useAuth();
  // const router = useRouter();

  // if (isAuthenticated === null) {
  //   return null;
  // }

  // if (!isAuthenticated) {
  //   router.replace("../login");
  //   return null;
  // }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#f97316",
        headerStyle: {
          backgroundColor: "#111113",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#111113",
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
          headerTitleStyle: {
            fontFamily: "Quicksand_700Bold",
          },
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
          headerTitleStyle: {
            fontFamily: "Quicksand_700Bold",
          },
        }}
      />
    </Tabs>
  );
}
