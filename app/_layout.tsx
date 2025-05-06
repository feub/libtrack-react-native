import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import { AuthProvider } from "@/context/AuthProvider";
import { useAuth } from "@/hooks/useAuth";

const theme = {
  ...DefaultTheme,
  myOwnProperty: true,
  colors: {
    primary: "rgb(95, 98, 0)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(229, 234, 93)",
    onPrimaryContainer: "rgb(28, 29, 0)",
    secondary: "rgb(96, 96, 67)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(229, 229, 192)",
    onSecondaryContainer: "rgb(28, 29, 6)",
    tertiary: "rgb(61, 102, 88)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(191, 236, 218)",
    onTertiaryContainer: "rgb(0, 33, 24)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(28, 28, 23)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(28, 28, 23)",
    surfaceVariant: "rgb(229, 227, 209)",
    onSurfaceVariant: "rgb(72, 71, 59)",
    outline: "rgb(121, 120, 105)",
    outlineVariant: "rgb(201, 199, 182)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(49, 49, 43)",
    inverseOnSurface: "rgb(244, 240, 232)",
    inversePrimary: "rgb(200, 206, 68)",
    elevation: {
      level0: "transparent",
      level1: "rgb(247, 243, 242)",
      level2: "rgb(242, 239, 235)",
      level3: "rgb(237, 234, 227)",
      level4: "rgb(236, 233, 224)",
      level5: "rgb(233, 230, 219)",
    },
    surfaceDisabled: "rgba(28, 28, 23, 0.12)",
    onSurfaceDisabled: "rgba(28, 28, 23, 0.38)",
    backdrop: "rgba(49, 49, 37, 0.4)",
  },
};

// A custom hook for authentication and routing logic
function useProtectedRoute() {
  const { token } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(tabs)";

    if (!token && inAuthGroup) {
      router.replace("/login");
    } else if (token && segments[0] === "login") {
      router.replace("/(tabs)");
    }
  }, [token, segments, router]);
}

function AppLayout() {
  const [isReady, setIsReady] = useState<boolean>(false);

  // Set a small delay to ensure auth state is fully initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000); // Ensure everything is loaded

    return () => clearTimeout(timer);
  }, []);

  // Show loading indicator while waiting for auth state
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            headerTransparent: true,
            headerBlurEffect: "dark",
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: "Login",
            headerShown: false,
            headerTransparent: true,
            headerBlurEffect: "dark",
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  // Set a small delay to ensure auth state is fully initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading indicator while waiting for auth state
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <RootLayoutNav />
      </PaperProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  // Use the custom hook for protection logic
  useProtectedRoute();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            headerTransparent: true,
            headerBlurEffect: "dark",
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: "Login",
            headerShown: false,
            headerTransparent: true,
            headerBlurEffect: "dark",
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111113",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111113",
  },
});
