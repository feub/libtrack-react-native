import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { Colors } from "react-native-ui-lib";
import { api } from "@/utils/apiRequest";
import CircleButton from "./CircleButton";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const scanEndpoint = apiUrl + "/api/release/scan";

type BarCodeEvent = {
  type: string;
  data: string;
};

type BarcodeScannerProps = {
  onScanComplete: (data: any) => void;
};

function BarcodeScanner({ onScanComplete }: BarcodeScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: BarCodeEvent) => {
    setScanned(true);
    setLoading(true);

    try {
      const response = await api.post(scanEndpoint, {
        barcode: data,
      });

      if (!response.ok) {
        let errorMsg = "Unknown error";

        try {
          const errorData = await response.json();
          errorMsg = errorData.message || "Error scanning release";
        } catch (parseError) {
          // Handle JSON parse error
          errorMsg = "Error processing server response";
          console.error("JSON parse error:", parseError);
        }

        console.error("Error scanning release:", errorMsg);
        setLoading(false);

        // Return minimal data for error display
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
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <View style={styles.container}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
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

export default BarcodeScanner;

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
});
