import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { Text, Colors } from "react-native-ui-lib";
import { ListReleaseType } from "@/types/releaseTypes";
import MyText from "@/components/MyText";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const coverPath = process.env.EXPO_PUBLIC_COVER_PATH;

function ReleaseListItem({ release }: { release: ListReleaseType }) {
  return (
    <View key={release.id.toString()} style={styles.resultItemContainer}>
      <View style={styles.itemLeft}>
        {release.artists && release.artists.length > 0 && (
          <>
            <MyText style={styles.dataTextArtist}>
              {release.artists?.map((artist) => artist.name).join(", ")}
            </MyText>
          </>
        )}
        <MyText style={styles.dataTextTitle}>{release.title}</MyText>
        {release.release_date && (
          <MyText style={styles.dataText}>
            <Text color={Colors.textDown}>Date:</Text> {release.release_date}
          </MyText>
        )}
        {release.format && (
          <MyText style={styles.dataText}>
            <Text color={Colors.textDown}>Format:</Text> {release.format.name}
          </MyText>
        )}
        {release.shelf && (
          <MyText style={styles.dataText}>
            <Text color={Colors.textDown}>Shelf:</Text> {release.shelf.location}
          </MyText>
        )}
      </View>
      {release.cover ? (
        <Image
          source={
            typeof release.cover === "string"
              ? {
                  uri: (apiUrl || "") + coverPath + release.cover,
                }
              : undefined
          }
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.mockImageContainer}>
          <MyText style={styles.mockImageText}>No cover</MyText>
        </View>
      )}
    </View>
  );
}

export default ReleaseListItem;

const styles = StyleSheet.create({
  resultItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#f1f1f1",
    backgroundColor: "#1E2830",
    marginBottom: 10,
    padding: 8,
    borderRadius: 10,
  },
  itemLeft: {
    flex: 1,
    flexShrink: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 6,
  },
  mockImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 6,
    backgroundColor: "#52525b",
    justifyContent: "center",
    alignItems: "center",
  },
  mockImageText: {
    color: "#71717a",
  },
  dataTextArtist: {
    color: "#f1f1f1",
    fontSize: 18,
    fontWeight: "bold",
  },
  dataTextTitle: {
    color: "#f1f1f1",
    fontSize: 14,
    fontWeight: "bold",
  },
  dataText: {
    color: "#f1f1f1",
    fontSize: 12,
  },
});
