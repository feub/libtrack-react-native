import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Camera, CameraView } from "expo-camera";
import { Colors, Text } from "react-native-ui-lib";
import { api } from "@/utils/apiRequest";
import { handleApiError } from "@/utils/handleApiError";
import CircleButton from "./CircleButton";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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
  const [, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: BarCodeEvent) => {
    if (scanned) return; // Prevent multiple scans
    setScanned(true);
    setLoading(true);

    try {
      console.log("handleBarCodeScanned ~ about to scan");

      const endpoint = `${apiUrl}/api/release/scan`;
      const response = await api.post(endpoint, {
        barcode: data,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const responseData = await response.json();

      console.log("handleBarCodeScanned ~ response:", responseData);

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
    } catch (error: any) {
      handleApiError(error, "Scna barcode", `${apiUrl}/api/release/scan`);
      onScanComplete({
        data: {
          barcode: data,
          releases: [],
        },
        type: "error",
        message: "Error processing search results",
      });
    } finally {
      setLoading(false);
    }
  };

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
