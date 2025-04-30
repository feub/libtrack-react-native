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
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ListReleaseType } from "@/types/releaseTypes";
import ReleaseListItem from "@/components/ReleaseListItem";
import RectangleButton from "@/components/RectangleButton";
import MyText from "@/components/MyText";
import SearchTerm from "@/components/SearchTerm";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const releaseListEndpoint = apiUrl + "/api/release/";

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
      const response = await axios.get(releaseListEndpoint, {
        params: { page, search: searchTerm },
      });

      const responseData = response.data as {
        type: string;
        data: {
          releases: any;
          maxPage: number;
          page: number;
          totalReleases: number;
        };
      };

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
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fff" />
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
  navBtns: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 14,
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
