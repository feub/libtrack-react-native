import { useEffect, useState } from "react";
import { Image, View, StyleSheet, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import axios from "axios";
import { API_URL } from "@env";
import { ListReleasesType } from "@/types/releaseTypes";
import MyText from "@/components/MyText";
import { FlatList } from "react-native-gesture-handler";

export default function Releases() {
  const [releases, setReleases] = useState<ListReleasesType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/release/list`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const responseData = response.data as {
          type: string;
          releases: any;
          maxPage: number;
          page: number;
        };

        if (responseData.type === "success") {
          // console.log(responseData.releases);
          setReleases(responseData.releases);
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

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <FlatList
          data={releases}
          renderItem={({ item }) => (
            <View key={item.id.toString()} style={styles.resultItemContainer}>
              <View style={styles.itemLeft}>
                {item.artists && item.artists.length > 0 && (
                  <>
                    <MyText style={styles.dataText}>
                      Artist(s):{" "}
                      {item.artists?.map((artist) => artist.name).join(", ")}
                    </MyText>
                  </>
                )}
                <MyText style={styles.dataText}>{item.title}</MyText>
                <MyText style={styles.dataText}>
                  Date: {item.release_date}
                </MyText>
              </View>
              {item.cover ? (
                <Image
                  source={
                    typeof item.cover === "string"
                      ? { uri: item.cover }
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
          )}
          keyExtractor={(releases) => releases.id.toString()}
          style={styles.entriesContainer}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111113",
    color: "white",
    alignItems: "center",
    paddingVertical: 10,
  },
  entriesContainer: {
    width: "100%",
    padding: 14,
    maxWidth: 600,
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
  dataText: {
    color: "#f1f1f1",
  },
});
