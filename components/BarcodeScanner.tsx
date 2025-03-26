import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import axios from "axios";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScanResponseType } from "@/types/releaseTypes";

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

      const responseData = response.data as ScanResponseType;

      if (responseData.releases && responseData.releases?.length > 0) {
        onScanComplete(responseData);
      } else {
        onScanComplete(null);
      }
    } catch (error: any) {
      Alert.alert("☠️", "Error sending request: " + error, [{ text: "OK" }]);

      let errorMessage = "An unexpected error occurred.";

      if (error.response) {
        console.error(
          "Server responded with:",
          error.response.status,
          error.response.data,
        );
        errorMessage = JSON.stringify(error.response.data);
        Alert.alert("☠️", "Error: " + error.response.data, [{ text: "OK" }]);
      } else if (error.request) {
        errorMessage = "No response received from the server.";
        Alert.alert("☠️", "No response received: " + error.request, [
          { text: "OK" },
        ]);
      } else {
        Alert.alert("☠️", "Error: " + error.message, [{ text: "OK" }]);
      }

      onScanComplete({
        barcode: data,
        title: errorMessage,
        cover: errorMessage,
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
        >
          <View style={styles.overlay}>
            <Text style={styles.scanText}>
              Position barcode within frame to scan
            </Text>
          </View>
        </CameraView>

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

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
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});
