import { Alert } from "react-native";

type ErrorType =
  | Error
  | {
      message: string;
      response?: {
        data?: any;
        status?: number;
      };
    };

export const handleApiError = (
  error: ErrorType,
  context: string = "API",
  endpoint: string = "",
): void => {
  // Log the error with context for debugging
  console.error(`${context} Error:`, error);

  if (error.message) {
    console.error(`${context} Error message:`, error.message);
  }

  // Log response details if available
  if ("response" in error && error.response) {
    if (error.response.data) {
      console.error(`${context} Error response data:`, error.response.data);
    }
    if (error.response.status) {
      console.error(`${context} Error response status:`, error.response.status);
    }
  }

  // Show user-friendly alert with appropriate context
  const errorMessage = endpoint
    ? `Server not reachable at ${endpoint}. Please try again later.`
    : "An error occurred while connecting to the server.";

  Alert.alert(`${context} Error`, errorMessage, [{ text: "OK" }]);
};
