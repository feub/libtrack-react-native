import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScanResponseType } from "@/types/releaseTypes";
import BarcodeScanner from "@/components/BarcodeScanner";
import MyText from "@/components/MyText";

export default function Index() {
  const [scannedData, setScannedData] = useState<ScanResponseType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleScanComplete = (data: any) => {
    setScannedData(data);
  };

  const handleScanAgain = () => {
    setScannedData(null);
  };

  const handleAddRelease = async (barcode: string, release_id: string) => {
    setLoading(true);

    try {
      const response = await axios.post(
        "http://192.168.1.63:8000/api/release/scan/add",
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
          <View>
            <MyText style={styles.dataText}>
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
                              {release["artist-credit"]?.map(
                                (artist, index) => {
                                  return (
                                    <MyText
                                      style={styles.dataText}
                                      key={index.toString()}
                                    >
                                      {artist.name}
                                    </MyText>
                                  );
                                },
                              )}
                            </MyText>
                          </>
                        )}
                      <MyText style={styles.dataText}>
                        Title: {release.title || "Title not available"}
                      </MyText>
                      <MyText style={styles.dataText}>
                        Date: {release.date || "Date not available"}
                      </MyText>
                      {release.media && release.media.length > 0 && (
                        <>
                          <MyText style={styles.dataText}>
                            Media:{" "}
                            {release.media?.map((media, index) => {
                              return (
                                <MyText
                                  style={styles.dataText}
                                  key={index.toString()}
                                >
                                  {media.format}
                                </MyText>
                              );
                            })}
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
                          release.cover ? { uri: release.cover } : undefined
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
          <Button title="Scan Again" onPress={handleScanAgain} />

          {loading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </>
      ) : (
        <>
          <MyText style={styles.introText}>Scan an item 👇</MyText>
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
  introText: {
    color: "#f1f1f1",
    padding: 10,
  },
  dataText: {
    color: "#f1f1f1",
  },
  resultItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#f1f1f1",
    backgroundColor: "#3f3f46",
    marginBottom: 6,
    padding: 6,
    borderRadius: 6,
  },
  image: {
    width: 150,
    height: 150,
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
