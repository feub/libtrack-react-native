import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, Image } from "react-native";
import BarcodeScanner from "@/components/BarcodeScanner";
import MyText from "@/components/MyText";

type ScanResponse = {
  barcode: string;
  releases?: Array<ReleasesType>;
};

type ReleasesType = {
  id: string;
  title?: string;
  cover?: string;
};

export default function Index() {
  const [scannedData, setScannedData] = useState<ScanResponse | null>(null);

  const handleScanComplete = (data: any) => {
    setScannedData(data);
  };

  const handleScanAgain = () => {
    setScannedData(null);
  };

  return (
    <View style={styles.container}>
      {scannedData ? (
        <>
          <View>
            <>
              <MyText style={styles.dataText}>Results:</MyText>
              <MyText style={styles.dataText}>
                Barcode: {scannedData.barcode}
              </MyText>
              {scannedData.releases &&
                scannedData.releases.map((release) => (
                  <View id={release.id}>
                    <MyText style={styles.dataText}>
                      Title: {release.title || "Title not available"}
                    </MyText>
                    {release.cover ? (
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={
                            release.cover ? { uri: release.cover } : undefined
                          }
                          style={styles.image}
                          resizeMode="cover"
                        />
                      </View>
                    ) : (
                      <MyText style={styles.dataText}>
                        Cover not available
                      </MyText>
                    )}
                  </View>
                ))}
            </>
          </View>
          <Button title="Scan Again" onPress={handleScanAgain} />
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
    backgroundColor: "#111113",
    color: "#ffffff",
  },
  introText: {
    color: "#ffffff",
    padding: 10,
  },
  dataText: {
    color: "#ffffff",
    padding: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
});
