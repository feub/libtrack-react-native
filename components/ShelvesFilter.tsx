import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Pressable } from "react-native";
import { api } from "@/utils/apiRequest";
import { handleApiError } from "@/utils/handleApiError";
import { ShelfType } from "@/types/releaseTypes";
import { Text } from "@/components/ui/text";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ShelvesFilter({
  selectedShelf,
  onSelectShelf,
}: {
  selectedShelf: string | "";
  onSelectShelf: (shelfId: string | "") => void;
}) {
  const [shelves, setShelves] = useState<ShelfType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [, setApiAvailable] = useState<boolean>(true);

  useEffect(() => {
    fetchShelves();
  }, []);

  const fetchShelves = async () => {
    setLoading(true);

    try {
      const endpoint = `${apiUrl}/api/shelf/`;
      const response = await api.get(endpoint);

      if (!response?.ok) {
        const errorData = await response?.json();
        handleApiError(
          {
            message: errorData.message || "Failed fethcing shelves",
            response: {
              data: errorData,
              status: response?.status,
            },
          },
          "Shelves list",
          endpoint,
        );
        setApiAvailable(false);
        return;
      }

      setApiAvailable(true);

      const responseData = await response.json();

      if (responseData.type === "success") {
        setShelves(responseData.data.shelves);
      }
    } catch (error: any) {
      setApiAvailable(false);
      handleApiError(error, "Shelves list", `${apiUrl}/api/shelf/`);
    } finally {
      setLoading(false);
    }
  };

  // Handle shelf selection/unselection
  const handleShelfPress = (shelfId: string) => {
    if (selectedShelf === shelfId) {
      onSelectShelf("");
    } else {
      onSelectShelf(shelfId.toString());
    }
  };

  // Helper function to check if a shelf is selected
  const isShelfSelected = (shelfId: string): boolean => {
    return selectedShelf === shelfId;
  };

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <View style={styles.container}>
        {!loading &&
          shelves &&
          shelves.map((shelf) => (
            <Pressable
              key={shelf.id}
              onPress={() => handleShelfPress(shelf.id.toString())}
            >
              <Text
                style={[
                  styles.btn,
                  { borderColor: "orange" },
                  isShelfSelected(shelf.id.toString()) && {
                    backgroundColor: "orange",
                    borderColor: "orange",
                    color: "black",
                    borderWidth: 1,
                  },
                ]}
                className={
                  isShelfSelected(shelf.id.toString())
                    ? "text-white"
                    : "text-tertiary-500"
                }
              >
                {shelf.location}
              </Text>
            </Pressable>
          ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
  },
  container: {
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
  },
  btn: {
    fontSize: 10,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 0,
    margin: 5,
  },
});
