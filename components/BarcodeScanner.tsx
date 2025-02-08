import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Camera, CameraView } from "expo-camera";

type BarCodeEvent = {
  type: string;
  data: string;
};

function BarcodeScanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarCodeEvent) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
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
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
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
});
