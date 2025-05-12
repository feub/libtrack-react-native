import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { Text, Colors, TouchableOpacity } from "react-native-ui-lib";
import { api } from "@/utils/apiRequest";
import { handleApiError } from "@/utils/handleApiError";
import { ShelfType } from "@/types/releaseTypes";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ShelvesFilter({
  selectedShelf,
  onSelectShelf,
}: {
  selectedShelf: string | number | "";
  onSelectShelf: (shelfId: string | "") => void;
}) {
  const [shelves, setShelves] = useState<ShelfType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiAvailable, setApiAvailable] = useState<boolean>(true);

  useEffect(() => {
    fetchShelves();
  }, []);

  const fetchShelves = async () => {
    setLoading(true);

    try {
      const endpoint = `${apiUrl}/api/shelf`;
      const response = await api.get(endpoint);

      if (!response.ok) {
        const errorData = await response.json();
        handleApiError(
          {
            message: errorData.message || "Failed fethcing shelves",
            response: {
              data: errorData,
              status: response.status,
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
      handleApiError(error, "Shelves list", `${apiUrl}/api/shelf`);
    } finally {
      setLoading(false);
    }
  };

  // Handle shelf selection/unselection
  const handleShelfPress = (shelfId: number | string) => {
    if (selectedShelf === shelfId) {
      onSelectShelf("");
    } else {
      onSelectShelf(shelfId.toString());
    }
  };

  // Helper function to check if a shelf is selected
  const isShelfSelected = (shelfId: number | string): boolean => {
    return selectedShelf.toString() === shelfId.toString();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {!loading &&
          shelves &&
          shelves.map((shelf) => (
            <TouchableOpacity
              key={shelf.id}
              onPress={() => handleShelfPress(shelf.id)}
            >
              <Text
                style={[
                  styles.btn,
                  isShelfSelected(shelf.id) && styles.selectedBtn,
                ]}
                color={isShelfSelected(shelf.id) ? Colors.white : Colors.text}
              >
                {shelf.location}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background,
    width: "100%",
  },
  container: {
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    flexWrap: "wrap",
  },
  btn: {
    fontSize: 10,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    margin: 5,
  },
  selectedBtn: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
});
