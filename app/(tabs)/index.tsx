import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "@/services/axios";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScanResponseType } from "@/types/releaseTypes";
import BarcodeScanner from "@/components/BarcodeScanner";
import MyText from "@/components/MyText";
import CircleButton from "@/components/CircleButton";
import ScannedReleaseListItem from "@/components/ScannedReleaseListItem";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const healthEndpoint = apiUrl + "/api/release/health";
const scanAddEndpoint = apiUrl + "/api/release/scan/add";
export default function Index() {
  const [scannedData, setScannedData] = useState<ScanResponseType | null>(null);
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
        const token = await AsyncStorage.getItem("userToken");

        const response = await axiosInstance.get(healthEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = response.data as { type: string };

        if (responseData.type !== "success") {
          Alert.alert(
            "API Error",
            `Server not reachable. Please try again later.\n${healthEndpoint}`,
            [{ text: "OK" }],
          );
        }
      } catch (error: any) {
        Alert.alert(
          "API Error",
          `Server not reachable. Please try again later.\n${healthEndpoint}`,
          [{ text: "OK" }],
        );
      }
    };

    fetchData();
  }, []);

  const handleAddRelease = async (barcode: string, release_id: string) => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("userToken");

      const response = await axiosInstance.post(
        scanAddEndpoint,
        {
          barcode: barcode,
          release_id: release_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      type AddReleaseType = {
        message: string;
        type: string;
      };

      const responseData = response.data as AddReleaseType;

      if (responseData.type === "success") {
        setScannedData(null);
        Alert.alert("🤟", "Release successfully added!", [{ text: "OK" }]);
      } else {
        Alert.alert("🧐", responseData.message, [{ text: "OK" }]);
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data.message ||
          "Failed to send request. Please try again.";
        Alert.alert("🧐", errorMessage, [{ text: "OK" }]);
      } else {
        Alert.alert(
          "Network Error",
          "Failed to send request. Please try again.",
          [{ text: "OK" }],
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {scannedData ? (
        <>
          <View style={styles.resultsContainer}>
            <MyText style={styles.dataTextTitle}>
              Barcode: {scannedData.barcode}
            </MyText>
            <ScrollView style={{ maxHeight: 550 }}>
              {scannedData.releases &&
                scannedData.releases.map((release, index) => (
                  <ScannedReleaseListItem
                    key={index.toString()}
                    release={release}
                    barcode={scannedData.barcode}
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
              <MyText style={styles.dataTextScanAnItem}>Scan an item 👇</MyText>
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
