import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { api } from "@/utils/apiRequest";
import { ScanReleaseType, ShelfType } from "@/types/releaseTypes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button, ButtonText } from "./ui/button";

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

      if (!response?.ok) {
        const errorData = await response?.json();
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
            <Text style={styles.dataText}>
              <Text className="text-secondary-700">Artist(s):</Text>{" "}
              {release.artists
                .map((artist: { id: number; name: string }) => artist.name)
                .join(", ")}
            </Text>
          </>
        )}
        <Text style={styles.dataText}>
          <Text className="text-secondary-700">Title:</Text>{" "}
          {release.title ? release.title : "Title not available"}
        </Text>
        <Text style={styles.dataText}>
          <Text className="text-secondary-700">Date:</Text>{" "}
          {release.year ? release.year : "Date not available"}
        </Text>
        {release.formats && release.formats.length > 0 && (
          <>
            <Text style={styles.dataText}>
              <Text className="text-secondary-700">Format:</Text>
              {release.formats
                .map((format: { name: string }) => format.name)
                .join(", ")}
            </Text>
          </>
        )}
        <Pressable onPress={openModal}>
          <Ionicons
            name="add-circle-outline"
            size={38}
            color="#fb9d4b"
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
          <Text style={styles.mockImageText}>Not available</Text>
        </View>
      )}

      <Modal isOpen={showModal} onClose={closeModal} size="md">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              Confirm Release Details
            </Heading>
          </ModalHeader>
          <ModalBody>
            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formField}>
                <Text style={[styles.label, { color: "grey" }]}>
                  Select shelf
                </Text>
                <View style={styles.shelfContainer}>
                  {shelves &&
                    shelves.map((shelf: ShelfType) => (
                      <Pressable
                        key={shelf.id}
                        style={[
                          styles.shelfItem,
                          selectedShelf === shelf.id && {
                            borderColor: "#e78128",
                          },
                        ]}
                        onPress={() => handleShelfSelect(shelf.id)}
                      >
                        <Text
                          style={[
                            { color: "white" },
                            selectedShelf === shelf.id && {
                              borderColor: "#e78128",
                            },
                          ]}
                        >
                          {shelf.location}
                        </Text>
                      </Pressable>
                    ))}
                </View>
              </View>
            </ScrollView>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              variant="solid"
              action="primary"
              onPress={submitRelease}
              className="bg-tertiary-400"
            >
              <ButtonText>Add</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
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
    color: "#e6e6e7",
  },
  plusIcon: {
    marginTop: 20,
  },
  modalScroll: {
    maxHeight: "100%",
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
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
});
