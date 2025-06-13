import React from "react";
import { StyleSheet, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text } from "@/components/ui/text";

export default function ServerUnavailable({ message }: { message: string }) {
  message !== ""
    ? message
    : "Server connection unavailable. Some features may be limited.";

  return (
    <View style={styles.apiWarning}>
      <MaterialIcons name="cloud-off" size={16} color="yellow" />
      <Text style={styles.apiWarningText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  apiWarning: {
    backgroundColor: "red",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  apiWarningText: {
    color: "white",
    fontSize: 12,
    marginLeft: 5,
  },
});
