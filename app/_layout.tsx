import React from "react";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/context/AuthProvider";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <AuthProvider>
        <SafeAreaView style={[styles.safeArea, { backgroundColor: "#111113" }]}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#111113",
              },
              headerTintColor: "#f1f1f1",
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
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
