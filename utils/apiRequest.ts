import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Alert } from "react-native";

const apiURL = process.env.EXPO_PUBLIC_API_URL;

// Track refresh promise to prevent multiple simultaneous refreshes
let refreshingPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  // The idea here is that:
  // // If multiple API requests fail with 401 simultaneously, only the first one will trigger an actual token refresh
  // All subsequent requests will wait for that same refresh operation to complete
  // Once the refresh is done, all queued requests will continue with the new token
  // If there's already a refresh in progress, return that promise
  if (refreshingPromise) {
    return refreshingPromise;
  }

  const refreshToken = await SecureStore.getItemAsync("refresh_token");
  if (!refreshToken) return false;

  // Create a new refresh promise
  refreshingPromise = (async () => {
    try {
      const response = await fetch(`${apiURL}/api/token/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        let errorMsg = "Refresh failed";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || `Refresh failed (${response.status})`;
        } catch {
          errorMsg = `Refresh failed (${response.status})`;
        }
        console.error("Token refresh error:", errorMsg);
        throw new Error(errorMsg);
      }

      let data;

      try {
        data = await response.json();
      } catch (error) {
        console.error("Failed to parse refresh token response:", error);
        throw new Error("Invalid server response during token refresh");
      }

      await SecureStore.setItemAsync("access_token", data.token);
      await SecureStore.setItemAsync("refresh_token", data.refresh_token);

      return true;
    } catch (error) {
      console.error(
        "apiRequest.ts ~ refreshAccessToken ~ token refresh error:",
        error,
      );
      return false;
    } finally {
      // Clear the refresh promise
      refreshingPromise = null;
    }
  })();

  return refreshingPromise;
}

export async function apiRequest(url: string, options: RequestInit = {}) {
  let token = await SecureStore.getItemAsync("access_token");

  // Create a deep copy of the options to avoid mutating the original
  const requestOptions = { ...options };
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add authorization header if token exists
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  try {
    // Log request details for debugging
    // if (requestOptions.body) {
    //   try {
    //     const bodyContent = JSON.parse(requestOptions.body.toString());
    //     console.log(
    //       "apiRequest.ts ~ request body structure:",
    //       Object.keys(bodyContent).join(", "),
    //     );
    //   } catch (e) {
    //     console.log(
    //       "apiRequest.ts ~ request body:",
    //       requestOptions.body.toString().substring(0, 100) + "...",
    //     );
    //   }
    // }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 unauthorized by attempting to refresh token first
    if (response.status === 401) {
      const refreshSuccessful = await refreshAccessToken();

      if (refreshSuccessful) {
        // If refresh was successful, update the token and retry the request
        token = await SecureStore.getItemAsync("access_token");

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
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("refresh_token");
      await SecureStore.deleteItemAsync("user");

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
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("refresh_token");
      await SecureStore.deleteItemAsync("user");

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
