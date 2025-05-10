import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "react-native-ui-lib";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MyText from "./MyText";

export default function ServerUnavailable({ message }: { message: string }) {
  message !== ""
    ? message
    : "Server connection unavailable. Some features may be limited.";

  return (
    <View style={styles.apiWarning}>
      <MaterialIcons name="cloud-off" size={16} color={Colors.yellow30} />
      <MyText style={styles.apiWarningText}>{message}</MyText>
    </View>
  );
}

const styles = StyleSheet.create({
  apiWarning: {
    backgroundColor: Colors.yellow10,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  apiWarningText: {
    color: Colors.yellow30,
    fontSize: 12,
    marginLeft: 5,
  },
});
