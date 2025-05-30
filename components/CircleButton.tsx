import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface CircleButtonProps {
  setScanned: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CircleButton({ setScanned }: CircleButtonProps) {
  return (
    <View style={styles.circleButtonContainer}>
      <Pressable
        style={[styles.circleButton]}
        onPress={() => setScanned(false)}
      >
        <MaterialIcons name="qr-code-scanner" size={38} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  circleButton: {
    width: 84,
    height: 84,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 42,
    backgroundColor: "#e78128",
  },
});
