import { useEffect, useState } from "react";
import { Image, View, StyleSheet, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import axios from "axios";
import { API_URL } from "@env";
import { ListReleasesType } from "@/types/releaseTypes";
import MyText from "@/components/MyText";
import { FlatList } from "react-native-gesture-handler";
import ReleaseListItem from "@/components/ReleaseListItem";

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
          renderItem={({ item }) => <ReleaseListItem release={item} />}
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
    paddingBottom: 25,
  },
  entriesContainer: {
    width: "100%",
    padding: 14,
    maxWidth: 600,
  },
});
