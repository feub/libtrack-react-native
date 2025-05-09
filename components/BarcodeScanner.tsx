import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { Colors, Text } from "react-native-ui-lib";
import { api } from "@/utils/apiRequest";
import CircleButton from "./CircleButton";
import { useIsFocused } from "@react-navigation/native";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const scanEndpoint = apiUrl + "/api/release/scan";

type BarCodeEvent = {
  type: string;
  data: string;
};

type BarcodeScannerProps = {
  onScanComplete: (data: any) => void;
};

// Wrap the component with ErrorBoundary
export default function BarcodeScanner({
  onScanComplete,
}: BarcodeScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    let mounted = true;

    const checkCameraPermissions = async () => {
      if (!mounted) return;

      try {
        const { status } = await Camera.getCameraPermissionsAsync();
        if (mounted) {
          if (status === "granted") {
            setHasPermission(true);
          } else if (status === "undetermined") {
            const { status: newStatus } =
              await Camera.requestCameraPermissionsAsync();
            if (mounted) {
              setHasPermission(newStatus === "granted");
            }
          } else {
            setHasPermission(false);
          }
        }
      } catch (error) {
        console.error("Error checking camera permissions:", error);
        if (mounted) {
          setHasPermission(false);
        }
      }
    };

    if (isFocused) {
      checkCameraPermissions();
      // Reset scanned state when screen is focused
      setScanned(false);
    }

    return () => {
      mounted = false;
    };
  }, [isFocused]);

  const handleBarCodeScanned = async ({ type, data }: BarCodeEvent) => {
    if (scanned) return; // Prevent multiple scans
    setScanned(true);
    setLoading(true);

    try {
      console.log("handleBarCodeScanned ~ about to scan");

      const response = await api.post(scanEndpoint, {
        barcode: data,
      });

      if (!response.ok) {
        let errorMsg = "Unknown error";

        try {
          const errorData = await response.json();
          errorMsg = errorData.message || "Error scanning release";
        } catch (parseError) {
          errorMsg = "Error processing server response";
          console.error("JSON parse error:", parseError);
        }

        console.error("Error scanning release:", errorMsg);
        setLoading(false);

        onScanComplete({
          data: {
            barcode: data,
            releases: [],
          },
          type: "error",
          message: errorMsg,
        });
        return;
      }

      try {
        const responseData = await response.json();
        console.log("handleBarCodeScanned ~ response: ", responseData);

        if (
          responseData.type === "success" &&
          responseData.data.releases?.length > 0
        ) {
          onScanComplete(responseData);
        } else {
          onScanComplete({
            data: {
              barcode: data,
              releases: [],
            },
            type: "info",
            message: "No releases found for this barcode",
          });
        }
      } catch (parseError) {
        console.error("JSON parse error during success path:", parseError);
        onScanComplete({
          data: {
            barcode: data,
            releases: [],
          },
          type: "error",
          message: "Error processing search results",
        });
      }
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred.";

      if (
        error.name === "SyntaxError" &&
        error.message.includes("Unexpected character")
      ) {
        errorMessage = "Authentication expired. Please try again.";
      } else if (error.response) {
        console.error(
          "Server responded with:",
          error.response.status,
          error.response.data,
        );
        errorMessage =
          "Server error: " +
          (typeof error.response.data === "string"
            ? error.response.data
            : JSON.stringify(error.response.data));
      } else if (error.request) {
        errorMessage = "No response received from the server.";
      } else {
        errorMessage = error.message || "Network error";
      }

      Alert.alert("☠️", errorMessage, [{ text: "OK" }]);

      onScanComplete({
        data: {
          barcode: data,
          releases: [],
        },
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <Text color={Colors.text} style={styles.dataText}>
        Requesting camera permission.
      </Text>
    );
  }
  if (hasPermission === false) {
    return (
      <Text color={"red"} style={styles.errorText}>
        No access to camera.{"\n"}Check Android Camera permissions.
      </Text>
    );
  }

  return (
    <>
      <View style={styles.container}>
        {isFocused && (
          <CameraView
            ref={cameraRef}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13"],
            }}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <View style={styles.overlay}>
          <Text style={styles.scanText}>
            Position barcode within frame to scan
          </Text>
        </View>

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}

        {scanned && <CircleButton setScanned={setScanned} />}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  scanText: {
    fontSize: 16,
    color: Colors.text,
    opacity: 0.4,
    textAlign: "center",
  },
  dataText: {
    color: Colors.text,
    padding: 10,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});
