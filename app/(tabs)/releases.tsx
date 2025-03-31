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
import { ReleasesType } from "@/types/releaseTypes";
import ReleaseListItem from "@/components/ReleaseListItem";
import RectangleButton from "@/components/RectangleButton";
import MyText from "@/components/MyText";
import SearchTerm from "@/components/SearchTerm";

export default function Releases() {
  const [releases, setReleases] = useState<ReleasesType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [totalReleases, setTotalReleases] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (page: number, searchTerm: string = "") => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/release/list`,
        {
          params: { page, search: searchTerm },
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
