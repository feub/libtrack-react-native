import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Colors, Text, Modal, Button } from "react-native-ui-lib";
import { api } from "@/utils/apiRequest";
import { ScanReleaseType, ShelfType } from "@/types/releaseTypes";
import Ionicons from "@expo/vector-icons/Ionicons";
import MyText from "@/components/MyText";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

function ScannedReleaseListItem({
  release,
  barcode,
  handleAddRelease,
}: {
  release: ScanReleaseType;
  barcode: string;
  handleAddRelease: (
    barcode: string,
    releaseId: string,
    shelf: number | null,
  ) => void;
}) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editedRelease, setEditedRelease] = useState<ScanReleaseType | null>(
    null,
  );
  const [shelves, setShelves] = useState<ShelfType[]>([]);
  const [selectedShelf, setSelectedShelf] = useState<number | null>(null);

  useEffect(() => {
    fetchShelves();
  }, []);

  const fetchShelves = async () => {
    try {
      const response = await api.get(`${apiUrl}/api/shelf`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Error getting shelves:",
          errorData.message || "Unknown error",
        );
        Alert.alert("☠️", errorData.message || "Failed to get shelves", [
          { text: "OK" },
        ]);
        return;
      }

      const responseData = await response.json();

      if (responseData.type === "success") {
        setShelves(responseData.data.shelves);
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
    }
  };

  const openModal = () => {
    setEditedRelease({ ...release });
    setShowModal(true);
    setSelectedShelf(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditedRelease(null);
    setSelectedShelf(null);
  };

  const submitRelease = () => {
    handleAddRelease(
      barcode,
      editedRelease?.id.toString() || release.id.toString(),
      selectedShelf,
    );
    closeModal();
  };

  const handleShelfSelect = (shelfId: number) => {
    setSelectedShelf(shelfId);
  };

  return (
    <View style={styles.resultItemContainer}>
      <View style={styles.textContainer}>
        {release.artists && release.artists.length > 0 && (
          <>
            <MyText style={styles.dataText}>
              <Text color={Colors.textDown}>Artist(s):</Text>{" "}
              {release.artists
                .map((artist: { id: number; name: string }) => artist.name)
                .join(", ")}
            </MyText>
          </>
        )}
        <MyText style={styles.dataText}>
          <Text color={Colors.textDown}>Title:</Text>{" "}
          {release.title ? release.title : "Title not available"}
        </MyText>
        <MyText style={styles.dataText}>
          <Text color={Colors.textDown}>Date:</Text>{" "}
          {release.year ? release.year : "Date not available"}
        </MyText>
        {release.formats && release.formats.length > 0 && (
          <>
            <MyText style={styles.dataText}>
              <Text color={Colors.textDown}>Format:</Text>
              {release.formats
                .map((format: { name: string }) => format.name)
                .join(", ")}
            </MyText>
          </>
        )}
        <Pressable onPress={openModal}>
          <Ionicons
            name="add-circle-outline"
            size={38}
            color={Colors.primary}
            style={styles.plusIcon}
          />
        </Pressable>
      </View>
      {release.images && release.images?.length > 0 ? (
        <Image
          source={
            typeof release.images[0].uri === "string"
              ? { uri: release.images[0].uri }
              : undefined
          }
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.mockImageContainer}>
          <MyText style={styles.mockImageText}>Not available</MyText>
        </View>
      )}

      <Modal
        visible={showModal}
        onRequestClose={closeModal}
        overlayBackgroundColor={Colors.rgba(20, 20, 20, 0.7)}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalTitle}>Confirm Release Details</Text>

              <View style={styles.formField}>
                <Text style={styles.label}>Select shelf</Text>
                <View style={styles.shelfContainer}>
                  {shelves &&
                    shelves.map((shelf: ShelfType) => (
                      <Pressable
                        key={shelf.id}
                        style={[
                          styles.shelfItem,
                          selectedShelf === shelf.id &&
                            styles.shelfItemSelected,
                        ]}
                        onPress={() => handleShelfSelect(shelf.id)}
                      >
                        <Text
                          style={[
                            styles.shelfText,
                            selectedShelf === shelf.id &&
                              styles.shelfTextSelected,
                          ]}
                        >
                          {shelf.location}
                        </Text>
                      </Pressable>
                    ))}
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  label="Cancel"
                  outline
                  outlineColor={Colors.grey40}
                  style={styles.button}
                  onPress={closeModal}
                />
                <Button
                  label="Add Release"
                  backgroundColor={Colors.primary}
                  style={styles.button}
                  onPress={submitRelease}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ScannedReleaseListItem;

const styles = StyleSheet.create({
  dataText: {
    color: "#f1f1f1",
    flexShrink: 1,
  },
  resultItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#f1f1f1",
    backgroundColor: "#1E2830",
    marginBottom: 10,
    padding: 8,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    maxWidth: "70%",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 6,
    marginLeft: 4,
  },
  mockImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 6,
    backgroundColor: "#20303C",
    justifyContent: "center",
    alignItems: "center",
  },
  mockImageText: {
    color: Colors.textDowner,
  },
  plusIcon: {
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#1E2830",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalScroll: {
    maxHeight: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 20,
    textAlign: "center",
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    color: Colors.grey40,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#20303C",
    padding: 10,
    borderRadius: 6,
    color: Colors.white,
  },
  shelfContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  shelfItem: {
    backgroundColor: "#20303C",
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  shelfItemSelected: {
    borderColor: Colors.primary,
  },
  shelfText: {
    color: Colors.white,
  },
  shelfTextSelected: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
