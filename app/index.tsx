import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import BarcodeScanner from "@/components/BarcodeScanner";

export default function Index() {
  return (
    <View style={styles.container}>
      <BarcodeScanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
