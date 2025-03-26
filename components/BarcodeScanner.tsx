import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Camera, CameraView } from "expo-camera";
import axios from "axios";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type BarCodeEvent = {
  type: string;
  data: string;
};

type BarcodeScannerProps = {
  onScanComplete: (data: any) => void;
};

type ScanResponse = {
  barcode: string;
  releases?: Array<ReleasesType>;
};

type ReleasesType = {
  id: string;
  title?: string;
  cover?: string;
};

function BarcodeScanner({ onScanComplete }: BarcodeScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: BarCodeEvent) => {
    setScanned(true);

    try {
      const response = await axios.post(
        "http://192.168.1.63:8000/api/release/scan",
        {
          barcode: data,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      // Type Assertion
      const responseData = response.data as ScanResponse;

      if (responseData.releases && responseData.releases?.length > 0) {
        onScanComplete(responseData);
      } else {
        onScanComplete(null);
      }
    } catch (error: any) {
      console.error("Error sending request:", error);
      let errorMessage = "An unexpected error occurred.";

      if (error.response) {
        console.error(
          "Server responded with:",
          error.response.status,
          error.response.data,
        );
        errorMessage = JSON.stringify(error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        errorMessage = "No response received from the server.";
      } else {
        console.error("Error:", error.message);
      }
      onScanComplete({
        barcode: data,
        title: errorMessage,
        cover: errorMessage,
      });
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
        >
          <View style={styles.overlay}>
            <Text style={styles.scanText}>
              Position barcode within frame to scan
            </Text>
          </View>
        </CameraView>

        {scanned && (
          <View style={styles.circleButtonContainer}>
            <Pressable
              style={styles.circleButton}
              onPress={() => setScanned(false)}
            >
              <MaterialIcons name="qr-code-scanner" size={38} color="#25292e" />
            </Pressable>
          </View>
        )}
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
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  dataText: {
    color: "#ffffff",
    padding: 10,
  },
  circleButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  circleButton: {
    width: 84,
    height: 84,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 42,
    backgroundColor: "#fff",
  },
});
