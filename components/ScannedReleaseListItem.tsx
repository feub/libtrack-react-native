import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { Colors, Text } from "react-native-ui-lib";
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
              <Text color={Colors.textDown}>Artist(s):</Text>{" "}
              {release.artists
                .map((artist: { id: number; name: string }) => artist.name)
                .join(", ")}
            </MyText>
          </>
        )}
        <MyText style={styles.dataText}>
          <Text color={Colors.textDown}>Title:</Text>{" "}
          {release.title ? release.title : "Title not available"}
        </MyText>
        <MyText style={styles.dataText}>
          <Text color={Colors.textDown}>Date:</Text>{" "}
          {release.year ? release.year : "Date not available"}
        </MyText>
        {release.formats && release.formats.length > 0 && (
          <>
            <MyText style={styles.dataText}>
              <Text color={Colors.textDown}>Format:</Text>
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
            color={Colors.primary}
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
        <View style={styles.mockImageContainer}>
          <MyText style={styles.mockImageText}>Not available</MyText>
        </View>
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
    backgroundColor: "#1E2830",
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
  mockImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 6,
    backgroundColor: "#20303C",
    justifyContent: "center",
    alignItems: "center",
  },
  mockImageText: {
    color: Colors.textDowner,
  },
  plusIcon: {
    marginTop: 20,
    color: Colors.primary,
  },
});
