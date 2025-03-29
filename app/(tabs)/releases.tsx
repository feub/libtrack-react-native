import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Alert, RefreshControl } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ListReleasesType } from "@/types/releaseTypes";
import { FlatList } from "react-native-gesture-handler";
import ReleaseListItem from "@/components/ReleaseListItem";
import RectangleButton from "@/components/RectangleButton";
import MyText from "@/components/MyText";

export default function Releases() {
  const [releases, setReleases] = useState<ListReleasesType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [totalReleases, setTotalReleases] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchData = async (page: number) => {
    console.log("Fetching data for page:", page);
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/release/list`,
        {
          params: { page },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      const responseData = response.data as {
        type: string;
        releases: any;
        maxPage: number;
        page: number;
        totalReleases: number;
      };

      if (responseData.type === "success") {
        setReleases(responseData.releases);
        setMaxPage(responseData.maxPage);
        setTotalReleases(responseData.totalReleases);
      }
    } catch (error: any) {
      Alert.alert(
        "API Error",
        "Server not reachable. Please try again later.",
        [{ text: "OK" }],
      );
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const onRefresh = useCallback(() => {
    console.log("refreshed!");

    setRefreshing(true);
    fetchData(currentPage);
  }, [currentPage]);

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <MyText style={styles.dataText}>
          {totalReleases} releases - page {currentPage}/{maxPage}
        </MyText>
        <FlatList
          data={releases}
          renderItem={({ item }) => <ReleaseListItem release={item} />}
          keyExtractor={(release) => release.id.toString()}
          style={styles.entriesContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#9Bd35A", "#689a38"]}
            />
          }
          ListEmptyComponent={
            <MyText style={styles.dataText}>No releases available</MyText>
          }
          contentContainerStyle={{ flexGrow: 1 }}
        />
        <View style={styles.navBtns}>
          {currentPage > 1 && (
            <RectangleButton
              handleOnPress={() => setCurrentPage(currentPage - 1)}
            >
              <Ionicons name="arrow-back-circle" size={24} color="black" />
            </RectangleButton>
          )}
          {currentPage < maxPage && (
            <RectangleButton
              handleOnPress={() => setCurrentPage(currentPage + 1)}
            >
              <Ionicons name="arrow-forward-circle" size={24} color="black" />
            </RectangleButton>
          )}
        </View>
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
  navBtns: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 14,
  },
  dataText: {
    color: "#f1f1f1",
  },
});
