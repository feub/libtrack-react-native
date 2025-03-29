import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScanResponseType } from "@/types/releaseTypes";
import BarcodeScanner from "@/components/BarcodeScanner";
import MyText from "@/components/MyText";
import CircleButton from "@/components/CircleButton";

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
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/api/release/health`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        );

        const responseData = response.data as { type: string };

        if (responseData.type !== "success") {
          Alert.alert(
            "API Error",
            "Server not reachable. Please try again later.",
            [{ text: "OK" }],
          );
        }
      } catch (error: any) {
        Alert.alert(
          "API Error",
          "Server not reachable. Please try again later.",
          [{ text: "OK" }],
        );
      }
    };

    fetchData();
  }, []);

  const handleAddRelease = async (barcode: string, release_id: string) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/release/scan/add`,
        {
          barcode: barcode,
          release_id: release_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
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
      Alert.alert(
        "Network Error",
        "Failed to send request. Please try again.",
        [{ text: "OK" }],
      );
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
                  <View
                    key={index.toString()}
                    style={styles.resultItemContainer}
                  >
                    <View>
                      {release["artist-credit"] &&
                        release["artist-credit"].length > 0 && (
                          <>
                            <MyText style={styles.dataText}>
                              Artist(s):{" "}
                              {release["artist-credit"]
                                .map((artist) => artist.name)
                                .join(", ")}
                            </MyText>
                          </>
                        )}
                      <MyText style={styles.dataText}>
                        Title:{" "}
                        {typeof release.title === "string"
                          ? release.title
                          : "Title not available"}
                      </MyText>
                      <MyText style={styles.dataText}>
                        Date:{" "}
                        {typeof release.date === "string"
                          ? release.date
                          : "Date not available"}
                      </MyText>
                      {release.media && release.media.length > 0 && (
                        <>
                          <MyText style={styles.dataText}>
                            Media:
                            {release.media
                              .map((media) => media.format)
                              .join(", ")}
                          </MyText>
                        </>
                      )}
                      <Pressable
                        onPress={() =>
                          handleAddRelease(scannedData.barcode, release.id)
                        }
                      >
                        <Ionicons
                          name="add-circle-outline"
                          size={38}
                          color="black"
                          style={styles.plusIcon}
                        />
                      </Pressable>
                    </View>
                    {release.cover ? (
                      <Image
                        source={
                          typeof release.cover === "string"
                            ? { uri: release.cover }
                            : undefined
                        }
                        style={styles.image}
                        resizeMode="cover"
                      />
                    ) : (
                      <MyText style={styles.dataText}>
                        Cover not available
                      </MyText>
                    )}
                  </View>
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
  dataText: {
    color: "#f1f1f1",
  },
  resultsContainer: {
    padding: 14,
  },
  resultItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#f1f1f1",
    backgroundColor: "#3f3f46",
    marginBottom: 10,
    padding: 8,
    borderRadius: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 6,
  },
  plusIcon: {
    marginTop: 20,
    color: "orange",
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});
