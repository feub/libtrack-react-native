import React, { Children } from "react";
import { View, StyleSheet, Pressable } from "react-native";

interface RectangleButtonProps {
  handleOnPress: () => void;
  children: React.ReactNode;
}

export default function RectangleButton({
  handleOnPress,
  children,
}: RectangleButtonProps) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.circleButton} onPress={handleOnPress}>
        {children}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignItems: "center",
  },
  circleButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#f97316",
  },
});
