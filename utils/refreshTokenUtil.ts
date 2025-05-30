import * as SecureStore from "expo-secure-store";

const apiURL = process.env.EXPO_PUBLIC_API_URL;
const authStorageKey = "auth-key";

// Track refresh promise to prevent multiple simultaneous refreshes
let refreshingPromise: Promise<boolean> | null = null;

export async function refreshTokenUtil(): Promise<boolean> {
  console.log("Refreshing token...");

  // If multiple API requests fail with 401 simultaneously, only the first one will trigger an actual token refresh
  // All subsequent requests will wait for that same refresh operation to complete
  // Once the refresh is done, all queued requests will continue with the new token
  // If there's already a refresh in progress, return that promise
  if (refreshingPromise) {
    return refreshingPromise;
  }

  // Create a new refresh promise
  refreshingPromise = (async () => {
    try {
      const value = await SecureStore.getItemAsync(authStorageKey);
      if (!value) return false;

      const storedState = JSON.parse(value);
      const storedRefreshToken = storedState.refreshToken;
      if (!storedRefreshToken) return false;

      const response = await fetch(`${apiURL}/api/token/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: storedRefreshToken }),
      });

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();
      await SecureStore.setItemAsync(
        authStorageKey,
        JSON.stringify({
          ...storedState,
          token: data.token,
          refreshToken: data.refresh_token,
        }),
      );
      console.log("Token refreshed successfully", data.token);
      console.log("Refresh token refreshed successfully", data.refresh_token);

      return true;
    } catch (error) {
      console.error(
        "refreshTokenUtil.ts ~ refreshTokenUtil ~ token refresh error:",
        error,
      );
      await SecureStore.deleteItemAsync(authStorageKey);
      return false;
    } finally {
      // Clear the refreshing promise
      refreshingPromise = null;
    }
  })();

  return refreshingPromise;
}
