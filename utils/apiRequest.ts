import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Alert } from "react-native";
import { refreshTokenUtil } from "@/utils/refreshTokenUtil";

const apiURL = process.env.EXPO_PUBLIC_API_URL;
const authStorageKey = "auth-key";

export async function apiRequest(url: string, options: RequestInit = {}) {
  let value = await SecureStore.getItemAsync(authStorageKey);
  if (value !== null) {
    const authState = JSON.parse(value);
    if (authState) {
      let token = authState.token;
      if (!token) {
        console.error("No token found in auth state");
        throw new Error("No token found");
      }

      // Create a deep copy of the options to avoid mutating the original
      const requestOptions = { ...options };
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      // Add authorization header if token exists
      if (token) {
        (headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${token}`;
      }

      try {
        let response = await fetch(url, {
          ...options,
          headers,
        });

        // Check if we need to handle a potential HTML response
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("text/html")) {
          console.error("HTML response detected when JSON expected");
          // Clear tokens and redirect to login
          await SecureStore.deleteItemAsync(authStorageKey);

          setTimeout(() => {
            Alert.alert(
              "Authentication Expired",
              "Your session has expired. Please log in again.",
              [{ text: "OK" }],
            );
            router.replace("/login");
          }, 100);

          throw new Error("Authentication failed - please login again");
        }

        // Handle 401 unauthorized by attempting to refresh token first
        if (response.status === 401) {
          const refreshSuccessful = await refreshTokenUtil();

          if (refreshSuccessful) {
            // If refresh was successful, update the token and retry the request
            const newValue = await SecureStore.getItemAsync(authStorageKey);
            if (newValue !== null) {
              const newAuthState = JSON.parse(newValue);
              token = newAuthState.token;
            }

            if (!token) {
              throw new Error("Token refresh succeeded but no token found");
            }

            // Update authorization header with new token
            const retryHeaders: HeadersInit = {
              "Content-Type": "application/json",
              ...options.headers,
              Authorization: `Bearer ${token}`,
            };

            // Retry the original request with the new token
            try {
              // Create a fresh request options object
              const retryOptions = { ...requestOptions };

              response = await fetch(url, {
                ...retryOptions,
                headers: retryHeaders,
              });

              // The key change: Return any response that's not 401
              // This allows 409 and other status codes to be handled by the caller
              if (response.status !== 401) {
                return response;
              }
            } catch (retryError) {
              console.error(
                "Error during request retry after token refresh:",
                retryError,
              );
              throw retryError;
            }

            // If the retry is successful, return the response
            if (response.ok) {
              return response;
            }
          } else {
            console.error("apiRequest.ts ~ token refresh failed");
          }

          // If we got here, either the refresh failed or the retry failed
          await SecureStore.deleteItemAsync(authStorageKey);

          router.replace("/login");
          throw new Error("Authentication failed - please login again");
        }

        return response;
      } catch (error) {
        // Check if error is related to JSON parsing and the response contains HTML
        if (
          error instanceof SyntaxError &&
          error.message.includes("Unexpected character") &&
          error.message.includes("<")
        ) {
          console.error(
            "HTML response detected when JSON expected - likely auth issue",
          );

          // Clear tokens and redirect to login
          await SecureStore.deleteItemAsync(authStorageKey);

          setTimeout(() => {
            Alert.alert(
              "Authentication Expired",
              "Your session has expired. Please log in again.",
              [{ text: "OK" }],
            );
            router.replace("/login");
          }, 100);

          throw new Error("Authentication failed - please login again");
        }

        // For other errors, just rethrow
        throw error;
      }
    }
  }
}

// Helper methods for common HTTP operations
export const api = {
  get: (url: string) => apiRequest(url, { method: "GET" }),
  post: (url: string, data: Record<string, unknown>) =>
    apiRequest(url, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: (url: string, data: Record<string, unknown>) =>
    apiRequest(url, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (url: string) => apiRequest(url, { method: "DELETE" }),
};
