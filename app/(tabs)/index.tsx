import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { api } from "@/utils/apiRequest";
import { Colors, Text } from "react-native-ui-lib";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScanResponseType } from "@/types/releaseTypes";
import BarcodeScanner from "@/components/BarcodeScanner";
import MyText from "@/components/MyText";
import CircleButton from "@/components/CircleButton";
import ScannedReleaseListItem from "@/components/ScannedReleaseListItem";
import MyToast from "@/components/MyToast";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function Index() {
  const [scannedData, setScannedData] = useState<ScanResponseType | null>(null);
  const [afteradded, setAfteradded] = useState<string | null>(null);
  const [afteraddedError, setAfteraddedError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleScanComplete = (data: any) => {
    setScannedData(data);
  };

  const handleScanAgain = () => {
    setScannedData(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`${apiUrl}/api/health`);

        if (!response.ok) {
          Alert.alert(
            "API Error",
            `Server not reachable. Please try again later.\n${apiUrl}/api/health`,
            [{ text: "OK" }],
          );
        } else {
          console.log("🚀 Healthy API");
        }
      } catch (error: any) {
        console.error("API Error:", error);
        console.error("Error message:", error.message);
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
        }

        Alert.alert(
          "API Error",
          `Server not reachable. Please try again later.\n${apiUrl}/api/health`,
          [{ text: "OK" }],
        );
      }
    };

    fetchData();
  }, []);

  const handleAddRelease = async (barcode: string, release_id: string) => {
    setLoading(true);

    try {
      const response = await api.post(`${apiUrl}/api/release/scan/add`, {
        barcode: barcode,
        release_id: release_id,
      });

      if (!response.ok && response.status !== 409) {
        Alert.alert(
          "API Error",
          `Server not reachable. Please try again later.\n${apiUrl}/api/release/scan/add`,
          [{ text: "OK" }],
        );
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
        setAfteraddedError("🧐 " + responseData.message);
      }
    } catch (error: any) {
      console.error("API Error:", error);
      console.error("Error message:", error.message);

      setAfteraddedError("🧐 Error connecting to the server");

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {afteradded && <MyToast message={afteradded} type="success" />}
      {afteraddedError && <MyToast message={afteraddedError} type="danger" />}
      {scannedData ? (
        <>
          <View style={styles.resultsContainer}>
            <MyText style={styles.dataTextTitle}>
              Barcode:{" "}
              <Text color={Colors.primary}>{scannedData.data.barcode}</Text>
            </MyText>
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
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </>
      ) : (
        <>
          <View style={styles.topTextContainer}>
            <View style={styles.textIconContainer}>
              <MaterialIcons name="qr-code-scanner" size={24} color="white" />
              <MyText style={styles.dataTextScanAnItem}>Scan a release</MyText>
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
    fontFamily: "VarelaRound_400Regular",
    backgroundColor: "#18181b",
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
