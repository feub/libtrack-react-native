import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import { isTokenExpired } from "@/utils/decodeJwt";
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

async function tryRefreshToken() {
  const refreshToken = await SecureStore.getItemAsync("refresh_token");
  if (!refreshToken) return false;
  try {
    const response = await fetch(`${apiUrl}/api/token/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!response.ok) return false;
    const data = await response.json();
    if (data.token && data.refresh_token) {
      await SecureStore.setItemAsync("access_token", data.token);
      await SecureStore.setItemAsync("refresh_token", data.refresh_token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [apiHealthy, setApiHealthy] = useState<boolean>(true);

  // Check token expiry and refresh if needed before marking ready
  useEffect(() => {
    let cancelled = false;

    const checkAuthAndApi = async () => {
      // 1. Check API health
      try {
        const response = await fetch(`${apiUrl}/api/health`);
        if (!cancelled) setApiHealthy(response.ok);
      } catch (error) {
        console.error("_layout.tsx ~ API health check failed:", error);
        if (!cancelled) setApiHealthy(false);
      }

      // 2. Check access token expiry and refresh if needed
      const accessToken = await SecureStore.getItemAsync("access_token");
      let tokenExpiration = true;

      if (accessToken) {
        tokenExpiration = isTokenExpired(accessToken);
        console.log("_layout.tsx ~ Token expiration status:", tokenExpiration);
      }

      if (accessToken && tokenExpiration) {
        console.log("_layout.tsx ~ Access token expired, trying to refresh...");
        await tryRefreshToken();
      }

      if (!cancelled) setIsReady(true);
    };

    checkAuthAndApi();

    return () => {
      cancelled = true;
    };
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
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: Colors.background },
        ]}
      >
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: Colors.background }]}
    >
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
