import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { ActivityIndicator, View } from "react-native";
import { Typography, Colors, Text, Button } from "react-native-ui-lib";
import { AuthProvider } from "@/context/AuthProvider";

Colors.loadColors({
  primary: "#FB6413",
  primaryInactive: "#8A4C2F",
  secondary: "#2ecc71",
  error: "#e74c3c",
  text: "#f1f1f1",
  textDown: "#A6ACB1",
  textDowner: "#6E7881",
  background: "#111113",
  orange: "#FB6413",
  gold: "#FFD700",
});

Typography.loadTypographies({
  h1: { fontSize: 58, fontWeight: "300", lineHeight: 80 },
  h2: { fontSize: 46, fontWeight: "300", lineHeight: 64 },
  h3: { fontSize: 34, fontWeight: "300", lineHeight: 48 },
  body: { fontSize: 16 },
});

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function RootLayout() {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [apiHealthy, setApiHealthy] = useState<boolean>(true);

  // Set a small delay to ensure auth state is fully initialized
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/health`);
        setApiHealthy(response.ok);
      } catch (error) {
        console.error("API health check failed:", error);
        setApiHealthy(false);
      }
      setIsReady(true);
    };

    checkApiHealth();

    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading indicator while waiting for auth state
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Show API unavailable message when API is not healthy
  if (!apiHealthy) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.errorContainer}>
          <Text color={Colors.error}>Unable to connect to server</Text>
          <Text text80 color={Colors.textDown} style={styles.errorText}>
            Please check your internet connection and try again later.
          </Text>
          <Button
            label="Retry"
            backgroundColor={Colors.primary}
            style={styles.retryButton}
            onPress={() => {
              setIsReady(false);
              // This will trigger the useEffect to run again
              setTimeout(() => {}, 100);
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
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
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
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
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    marginTop: 10,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    width: 120,
  },
});
