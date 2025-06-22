import { useState, ReactNode, useEffect, PropsWithChildren } from "react";
import { AuthContext, User } from "./AuthContext";
import * as SecureStore from "expo-secure-store";
import { SplashScreen, useRouter } from "expo-router";
import { refreshTokenUtil } from "@/utils/refreshTokenUtil";

SplashScreen.preventAutoHideAsync();

const apiURL = process.env.EXPO_PUBLIC_API_URL;
const authStorageKey = "auth-key";

type AuthStateType = {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const storeAuthState = async (newState: AuthStateType) => {
    try {
      await SecureStore.setItemAsync(authStorageKey, JSON.stringify(newState));
    } catch (error) {
      console.error("Error storing authentication state:", error);
    }
  };

  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
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
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      const data = await response.json();

      setToken(data.token);
      setRefreshToken(data.refresh_token);
      setUser({ email: data.user });
      setIsLoggedIn(true);
      await storeAuthState({
        token: data.token,
        refreshToken: data.refresh_token,
        user: { email: data.user },
        isLoggedIn: true,
        loading: false,
        error: null,
      });
      router.replace("/");

      // return data;
    } catch (error: any) {
      setError(error.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      setIsLoggedIn(false);
      await storeAuthState({
        token: null,
        refreshToken: null,
        user: null,
        isLoggedIn: false,
        loading: false,
        error: null,
      });
      router.replace("/login");

      // return true;
    } catch (error) {
      setError("Logout error");
      console.error("Logout error:", error);
      //return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshTokenFn = async () => {
    try {
      const refreshResult = await refreshTokenUtil();
      if (refreshResult) {
        const value = await SecureStore.getItemAsync(authStorageKey);
        if (value !== null) {
          const storedState = JSON.parse(value);
          setToken(storedState.token);
          setRefreshToken(storedState.refreshToken);
        }
        return true;
      } else {
        setError("Token refresh failed");
        console.error("Token refresh failed");
        await logoutUser();
        return false;
      }
    } catch (error) {
      setError("Error retrieving refresh token");
      console.error("Error retrieving refresh token:", error);
      return false;
    }
  };

  // Load stored authentication data when component mounts
  useEffect(() => {
    const loadStoredAuth = async () => {
      setLoading(true);
      try {
        const value = await SecureStore.getItemAsync(authStorageKey);

        if (value !== null) {
          const storedState = JSON.parse(value);
          setToken(storedState.token);
          setRefreshToken(storedState.refreshToken);
          setUser(storedState.user);
          setIsLoggedIn(storedState.isLoggedIn);
        }
      } catch (error) {
        console.error("Error loading authentication data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  const contextData = {
    user,
    token,
    loginUser,
    logoutUser,
    refreshToken: refreshTokenFn,
    isLoggedIn,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
