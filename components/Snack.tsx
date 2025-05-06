import React, { Component, useState, ReactNode } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Snackbar } from "react-native-paper";

export default function Snack({
  visible,
  onDismiss,
  children,
}: {
  visible: boolean;
  onDismiss: () => void;
  children: ReactNode;
}) {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      //   action={{
      //     label: "Undo",
      //     onPress: () => {
      //       // Do something
      //     },
      //   }}
    >
      {children}
    </Snackbar>
  );
}

const styles = StyleSheet.create({});
