import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { ScanReleaseType } from "@/types/releaseTypes";
import Ionicons from "@expo/vector-icons/Ionicons";
import MyText from "@/components/MyText";

function ScannedReleaseListItem({
  release,
  barcode,
  handleAddRelease,
}: {
  release: ScanReleaseType;
  barcode: string;
  handleAddRelease: (barcode: string, releaseId: string) => void;
}) {
  return (
    <View style={styles.resultItemContainer}>
      <View style={styles.textContainer}>
        {release.artists && release.artists.length > 0 && (
          <>
            <MyText style={styles.dataText}>
              Artist(s):{" "}
              {release.artists
                .map((artist: { id: number; name: string }) => artist.name)
                .join(", ")}
            </MyText>
          </>
        )}
        <MyText style={styles.dataText}>
          Title: {release.title ? release.title : "Title not available"}
        </MyText>
        <MyText style={styles.dataText}>
          Date: {release.year ? release.year : "Date not available"}
        </MyText>
        {release.formats && release.formats.length > 0 && (
          <>
            <MyText style={styles.dataText}>
              Format:
              {release.formats
                .map((format: { name: string }) => format.name)
                .join(", ")}
            </MyText>
          </>
        )}
        <Pressable
          onPress={() => handleAddRelease(barcode, release.id.toString())}
        >
          <Ionicons
            name="add-circle-outline"
            size={38}
            color="black"
            style={styles.plusIcon}
          />
        </Pressable>
      </View>
      {release.images && release.images?.length > 0 ? (
        <Image
          source={
            typeof release.images[0].uri === "string"
              ? { uri: release.images[0].uri }
              : undefined
          }
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <MyText style={styles.dataText}>Cover not available</MyText>
      )}
    </View>
  );
}

export default ScannedReleaseListItem;

const styles = StyleSheet.create({
  dataText: {
    color: "#f1f1f1",
    flexShrink: 1,
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
  textContainer: {
    flex: 1,
    maxWidth: "70%",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 6,
    marginLeft: 4,
  },
  plusIcon: {
    marginTop: 20,
    color: "#afb42b",
  },
});
