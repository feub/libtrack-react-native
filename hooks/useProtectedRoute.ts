import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "./useAuth";

export function useProtectedRoute() {
  const { token } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(tabs)";

    const checkToken = async () => {
      if (!token && inAuthGroup) {
        console.log(
          "No token found but in protected route, redirecting to login",
        );
        // Clear any potentially corrupted auth state
        await SecureStore.deleteItemAsync("access_token");
        await SecureStore.deleteItemAsync("refresh_token");
        await SecureStore.deleteItemAsync("user");

        router.replace("/login");
      } else if (token && segments[0] === "login") {
        console.log("Token found but on login page, redirecting to tabs");
        router.replace("/(tabs)");
      }
    };

    checkToken();
  }, [token, segments, router]);
}
