import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

interface AuthProps {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
    expiresAt: string | null;
  };
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  isTokenExpired?: () => boolean;
}

const TOKEN_KEY = "libtrack-jwt";
const TOKEN_EXPIRY_KEY = "libtrack-jwt-expires";

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    expiresAt: string | null;
  }>({
    token: null,
    authenticated: null,
    expiresAt: null,
  });

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);

    axios.defaults.headers.common["Authorization"] = "";

    setAuthState({
      token: null,
      authenticated: false,
      expiresAt: null,
    });
  }, []);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const expiresAt = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);
      console.log("stored token: ", token);
      console.log("token expires at: ", expiresAt);

      if (token && expiresAt) {
        if (new Date(expiresAt) <= new Date()) {
          console.log("Stored token has expired, logging out");
          await logout();
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setAuthState({
          token: token,
          authenticated: true,
          expiresAt: expiresAt,
        });
      } else {
        setAuthState({
          token: null,
          authenticated: false,
          expiresAt: null,
        });
      }
    };
    loadToken();
  }, [logout]);

  // Use the interceptor with the stable logout function reference
  useEffect(() => {
    // Remove any existing interceptors
    let interceptorId: number;

    const setupInterceptor = () => {
      interceptorId = axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          if (error.response && error.response.status === 401) {
            console.log("401 error detected, logging out");
            await logout();
            // Don't navigate here - let components handle navigation
          }
          return Promise.reject(error);
        },
      );
    };

    setupInterceptor();

    // Clean up the interceptor when component unmounts
    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, [logout]);

  const isTokenExpired = (): boolean => {
    if (!authState.expiresAt) return true;
    return new Date(authState.expiresAt) <= new Date();
  };

  const login = async (email: string, password: string) => {
    type LoginResponse = {
      token: string;
      token_expires_at: string;
      // refresh_token: string;
      // refresh_expires_at: string;
    };

    try {
      const result = await axios.post<LoginResponse>(`${apiUrl}/api/login`, {
        username: email,
        password,
      });

      console.log("AuthContext ~ login ~ result:", result);

      await SecureStore.setItemAsync(
        TOKEN_EXPIRY_KEY,
        result.data.token_expires_at,
      );
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.data.token}`;

      setAuthState({
        token: result.data.token,
        authenticated: true,
        expiresAt: result.data.token_expires_at,
      });

      return result;
    } catch (error) {
      console.log(error);

      return { error: true, msg: (error as any).response.data.error };
    }
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    isTokenExpired,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
