import { useState, ReactNode, useEffect } from "react";
import { AuthContext, User } from "./AuthContext";
import * as SecureStore from "expo-secure-store";

const apiURL = process.env.EXPO_PUBLIC_API_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Load stored authentication data when component mounts
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const currentToken =
          (await SecureStore.getItemAsync("access_token")) || null;
        const currentRefreshToken =
          (await SecureStore.getItemAsync("refresh_token")) || null;
        const currentUser = (await SecureStore.getItemAsync("user"))
          ? JSON.parse((await SecureStore.getItemAsync("user")) || "")
          : null;

        console.log(
          "AuthProvider.tsx ~ AuthProvider ~ access_token: ",
          currentToken,
        );
        console.log(
          "AuthProvider.tsx ~ AuthProvider ~ refresh_token: ",
          currentRefreshToken,
        );
        console.log("AuthProvider.tsx ~ AuthProvider ~ user: ", currentUser);
      } catch (error) {
        console.error("Error loading authentication data:", error);
      }
    };

    loadStoredAuth();
  }, []);

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch(`${apiURL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        let errorMsg = "Login failed";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || `Login failed (${response.status})`;
        } catch {
          errorMsg = `Login failed (${response.status})`;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      setToken(data.token);
      setRefreshToken(data.refresh_token);
      setUser({ email: data.user });
      await SecureStore.setItemAsync("access_token", data.token);
      await SecureStore.setItemAsync("refresh_token", data.refresh_token);
      await SecureStore.setItemAsync(
        "user",
        JSON.stringify({ email: data.user }),
      );

      return data;
    } catch (error) {
      console.error("AuthProvider ~ login ~ Login error:", error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("refresh_token");
      await SecureStore.deleteItemAsync("user");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  const contextData = {
    user,
    token,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
