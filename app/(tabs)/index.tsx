import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { api } from "@/utils/apiRequest";
import { handleApiError } from "@/utils/handleApiError";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScanResponseType } from "@/types/releaseTypes";
import ServerUnavailable from "@/components/ServerUnavailable";
import BarcodeScanner from "@/components/BarcodeScanner";
import CircleButton from "@/components/CircleButton";
import ScannedReleaseListItem from "@/components/ScannedReleaseListItem";
import MyToast from "@/components/MyToast";
import { Text } from "@/components/ui/text";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function Index() {
  const [scannedData, setScannedData] = useState<ScanResponseType | null>(null);
  const [afteradded, setAfteradded] = useState<string | null>(null);
  const [afteraddedError, setAfteraddedError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiAvailable, setApiAvailable] = useState<boolean>(true);

  const handleScanComplete = (data: any) => {
    setScannedData(data);
  };

  const handleScanAgain = () => {
    setScannedData(null);
    setAfteraddedError(null);
    setAfteradded(null);
  };

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await api.get(`${apiUrl}/api/health`);

        if (!response || !response.ok) {
          setApiAvailable(false);
          Alert.alert(
            "API Error",
            `Server not reachable. Please try again later.\n${apiUrl}/api/health`,
            [{ text: "OK" }],
          );
        } else {
          setApiAvailable(true);
          console.log("🚀 Healthy API");
        }
      } catch (error: any) {
        setApiAvailable(false);
        handleApiError(error, "Health check", `${apiUrl}/api/health`);
      }
    };

    checkApiHealth();
  }, []);

  const handleAddRelease = async (
    barcode: string,
    release_id: string,
    shelf: number | null = null,
  ) => {
    setLoading(true);
    setAfteraddedError(null);
    setAfteradded(null);

    try {
      const response = await api.post(`${apiUrl}/api/release/scan/add`, {
        barcode: barcode,
        release_id: release_id,
        shelf: shelf,
      });

      // Handle non-200 responses that aren't 409 (conflict)
      if (!response || (!response.ok && response.status !== 409)) {
        throw new Error(`Server returned ${response?.status}`);
      }

      const responseData = await response.json();

      if (responseData.type === "success") {
        setScannedData(null);
        setAfteradded("🤟 Release successfully added!");
      } else if (responseData.type === "error") {
        if (responseData.message.includes("already exists")) {
          setAfteraddedError("📀 " + responseData.message);
        } else {
          setAfteraddedError("🧐 " + responseData.message);
        }
      } else {
        setAfteraddedError(
          "🧐 " + responseData.message || "Unknown error occurred",
        );
      }
    } catch (error: any) {
      handleApiError(error, "Add release", `${apiUrl}/api/release/scan/add`);
      setAfteraddedError("🧐 Error connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!apiAvailable && (
        <ServerUnavailable message="Server connection unavailable. Some features may be limited." />
      )}

      {afteradded && <MyToast message={afteradded} type="success" />}
      {afteraddedError && <MyToast message={afteraddedError} type="error" />}

      {scannedData ? (
        <>
          <View style={styles.resultsContainer}>
            <Text style={styles.dataTextTitle}>
              Barcode:{" "}
              <Text className="text-tertiary-500">
                {scannedData.data.barcode}
              </Text>
            </Text>
            <ScrollView style={{ maxHeight: 550 }}>
              {scannedData.data.releases &&
                scannedData.data.releases.map((release, index) => (
                  <ScannedReleaseListItem
                    key={index.toString()}
                    release={release}
                    barcode={scannedData.data.barcode}
                    handleAddRelease={handleAddRelease}
                  />
                ))}
            </ScrollView>
          </View>
          <CircleButton setScanned={handleScanAgain} />

          {loading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" className="text-tertiary-500" />
            </View>
          )}
        </>
      ) : (
        <>
          <View style={styles.topTextContainer}>
            <View style={styles.textIconContainer}>
              <MaterialIcons name="qr-code-scanner" size={24} color="white" />
              <Text style={styles.dataTextScanAnItem}>Scan a release</Text>
            </View>
          </View>
          <BarcodeScanner onScanComplete={handleScanComplete} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111113",
    color: "#f1f1f1",
  },
  topTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: "#f1f1f1",
    padding: 14,
  },
  textIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dataTextScanAnItem: {
    fontSize: 20,
    color: "#f1f1f1",
    marginLeft: 5,
  },
  dataTextTitle: {
    fontSize: 20,
    color: "#f1f1f1",
    paddingBottom: 14,
  },
  resultsContainer: {
    padding: 14,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});
