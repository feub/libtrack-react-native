import React from "react";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
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

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: Colors.background }]}
      >
        <StatusBar style="light" />
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
              animation: "none",
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              title: "Login",
              animation: "none",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
