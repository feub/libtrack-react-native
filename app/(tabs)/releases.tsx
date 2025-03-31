import { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ReleasesType } from "@/types/releaseTypes";
import ReleaseListItem from "@/components/ReleaseListItem";
import RectangleButton from "@/components/RectangleButton";
import MyText from "@/components/MyText";

export default function Releases() {
  const [releases, setReleases] = useState<ReleasesType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [totalReleases, setTotalReleases] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchData = async (page: number) => {
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
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
      fetchData(currentPage);
    }, 2000);
  }, [currentPage]);

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
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
