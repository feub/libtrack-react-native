import { useCallback, useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { api } from "@/utils/apiRequest";
import { Colors, Text } from "react-native-ui-lib";
import { ListReleaseType } from "@/types/releaseTypes";
import ReleaseListItem from "@/components/ReleaseListItem";
import SearchTerm from "@/components/SearchTerm";
import { useNavigation } from "expo-router";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function Releases() {
  const [releases, setReleases] = useState<ListReleaseType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [totalReleases, setTotalReleases] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);

  const navigation = useNavigation();

  const fetchData = async (
    page: number,
    searchTerm: string = "",
    isLoadMore: boolean = false,
  ) => {
    if (!hasMoreData && isLoadMore) return;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        search: searchTerm.toString(),
        limit: "10",
      });

      const response = await api.get(
        `${apiUrl}/api/release?${params.toString()}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Error listing releases:",
          errorData.message || "Unknown error",
        );
        Alert.alert("☠️", errorData.message || "Failed to list releases", [
          { text: "OK" },
        ]);
        setLoading(false);
        return;
      }

      const responseData = await response.json();

      if (responseData.type === "success") {
        if (isLoadMore) {
          setReleases((currentReleases) => [
            ...currentReleases,
            ...responseData.data.releases,
          ]);
        } else {
          setReleases(responseData.data.releases);
        }
        setMaxPage(responseData.data.maxPage);
        setTotalReleases(responseData.data.totalReleases);
        setHasMoreData(page < responseData.data.maxPage);
      }
    } catch (error: any) {
      console.error("API Error:", error);
      console.error("Error message:", error.message);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }

      Alert.alert(
        "API Error",
        "Server not reachable. Please try again later.\n" + error,
        [{ text: "OK" }],
      );
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const loadMoreData = () => {
    if (!loading && hasMoreData) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchData(nextPage, searchTerm, true);
    }
  };

  useEffect(() => {
    // Only fetch when currentPage is 1 (initial load or search)
    // Other pages are loaded via loadMoreData
    if (currentPage === 1) {
      fetchData(1, searchTerm, false);
    }
  }, [searchTerm]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `My collection (${totalReleases})`,
    });
  }, [releases, navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    setHasMoreData(true);

    setTimeout(() => {
      // setRefreshing(false);
      fetchData(1, searchTerm, false);
    }, 1000);
  }, [searchTerm]);

  const handleSearchSubmit = async (data: { searchTerm: string }) => {
    setSearchTerm(data.searchTerm);
    setCurrentPage(1); // Reset to the first page when searching
    setHasMoreData(true);
    return Promise.resolve();
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <SearchTerm onSubmit={handleSearchSubmit} />
        <ScrollView
          style={styles.entriesContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary, "#010101"]}
            />
          }
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } =
              nativeEvent;
            const isCloseToBottom =
              layoutMeasurement.height + contentOffset.y >=
              contentSize.height - 20;
            if (isCloseToBottom && !loading && hasMoreData) {
              loadMoreData();
            }
          }}
          scrollEventThrottle={400}
        >
          {releases &&
            releases.map((release, index) => (
              <ReleaseListItem key={index} release={release} />
            ))}

          {loading && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text color={Colors.text} style={styles.loadingMoreText}>
                Loading more...
              </Text>
            </View>
          )}

          {!loading && !hasMoreData && releases.length > 0 && (
            <Text color={Colors.text} style={styles.endOfResultsText}>
              The end 🦕
            </Text>
          )}
        </ScrollView>
      </View>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: 600,
  },
  placeholderButtons: {
    width: 64,
    height: 32,
  },
  loadingMoreContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  loadingMoreText: {
    marginLeft: 10,
  },
  endOfResultsText: {
    textAlign: "center",
    padding: 20,
  },
  dataText: {
    color: "#f1f1f1",
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});
