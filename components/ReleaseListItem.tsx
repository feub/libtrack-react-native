import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { ListReleaseType } from "@/types/releaseTypes";
import { Text } from "@/components/ui/text";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const coverPath = process.env.EXPO_PUBLIC_COVER_PATH + "/covers/";

function ReleaseListItem({ release }: { release: ListReleaseType }) {
  return (
    <View style={styles.resultItemContainer}>
      <Text className="text-tertiary-500 font-bold text-2xl">
        {release.title}
      </Text>
      <View key={release.id.toString()} style={styles.resultItemInfo}>
        <View style={styles.itemLeft}>
          {release.artists && release.artists.length > 0 && (
            <Text className="font-bold">
              <Text className="text-secondary-700 font-regular">
                Artist(s):
              </Text>{" "}
              {release.artists?.map((artist) => artist.name).join(", ")}
            </Text>
          )}
          {release.release_date && (
            <Text>
              <Text className="text-secondary-700">Date:</Text>{" "}
              {release.release_date}
            </Text>
          )}
          {release.format && (
            <Text>
              <Text className="text-secondary-700">Format:</Text>{" "}
              {release.format.name}
            </Text>
          )}
          {release.shelf && (
            <Text>
              <Text className="text-secondary-700">Shelf:</Text>{" "}
              {release.shelf.location}
            </Text>
          )}
          {release.genres && release.genres.length > 0 && (
            <Text className="font-bold">
              <Text className="text-secondary-700 font-regular">Genre(s):</Text>{" "}
              {release.genres?.map((genre) => genre.name).join(", ")}
            </Text>
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
            <Text style={styles.mockImageText}>No cover</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default ReleaseListItem;

const styles = StyleSheet.create({
  resultItemContainer: {
    color: "#f1f1f1",
    backgroundColor: "#1E2830",
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resultItemInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
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
});
