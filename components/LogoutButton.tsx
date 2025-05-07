import React from "react";
import { Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MyText from "./MyText";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "react-native-ui-lib";

const LogoutButton = () => {
  const { logoutUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  return (
    <Button
      label={"Logout"}
      style={styles.buttonContainer}
      onPress={handleLogout}
    />
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f97316",
    borderRadius: 12,
    padding: 10,
  },
  logoutBtn: {
    marginRight: 6,
    fontWeight: "bold",
  },
});
