import { useCallback, useEffect, useState } from "react";
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
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ListReleaseType } from "@/types/releaseTypes";
import ReleaseListItem from "@/components/ReleaseListItem";
import RectangleButton from "@/components/RectangleButton";
import MyText from "@/components/MyText";
import SearchTerm from "@/components/SearchTerm";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function Releases() {
  const [releases, setReleases] = useState<ListReleaseType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [totalReleases, setTotalReleases] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (page: number, searchTerm: string = "") => {
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
        setReleases(responseData.data.releases);
        setMaxPage(responseData.data.maxPage);
        setTotalReleases(responseData.data.totalReleases);
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

  useEffect(() => {
    fetchData(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
      fetchData(currentPage, searchTerm);
    }, 2000);
  }, [currentPage, searchTerm]);

  const handleSearchSubmit = async (data: { searchTerm: string }) => {
    setSearchTerm(data.searchTerm);
    setCurrentPage(1); // Reset to the first page when searching
    return Promise.resolve();
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <SearchTerm onSubmit={handleSearchSubmit} />
        <MyText style={styles.dataText}>
          {totalReleases} releases - page {currentPage}/{maxPage}
        </MyText>
        <ScrollView
          style={styles.entriesContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#f97316", "#010101"]}
            />
          }
        >
          {releases &&
            releases.map((release, index) => (
              <ReleaseListItem key={index} release={release} />
            ))}
        </ScrollView>

        <View style={styles.navBtns}>
          <View style={styles.leftNavBtns}>
            {currentPage > 1 ? (
              <>
                <RectangleButton handleOnPress={() => setCurrentPage(1)}>
                  <MaterialIcons
                    name="first-page"
                    size={24}
                    color={Colors.primary}
                  />
                </RectangleButton>
                <RectangleButton
                  handleOnPress={() => setCurrentPage(currentPage - 1)}
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={Colors.primary}
                  />
                </RectangleButton>
              </>
            ) : (
              <View style={styles.placeholderButtons} />
            )}
          </View>
          <View style={styles.rightNavBtns}>
            {currentPage < maxPage ? (
              <>
                <RectangleButton
                  handleOnPress={() => setCurrentPage(currentPage + 1)}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={Colors.primary}
                  />
                </RectangleButton>
                {currentPage !== maxPage && (
                  <RectangleButton
                    handleOnPress={() => setCurrentPage(maxPage)}
                  >
                    <MaterialIcons
                      name="last-page"
                      size={24}
                      color={Colors.primary}
                    />
                  </RectangleButton>
                )}
              </>
            ) : (
              <View style={styles.placeholderButtons} />
            )}
          </View>
        </View>
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
  navBtns: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 14,
    paddingHorizontal: 14,
    maxWidth: 600,
  },
  leftNavBtns: {
    flexDirection: "row",
    gap: 8,
    minWidth: 80,
  },
  rightNavBtns: {
    flexDirection: "row",
    gap: 8,
    minWidth: 80,
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
