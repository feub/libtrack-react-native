import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import icon from "@/assets/images/splash-icon.png";
import MyText from "@/components/MyText";
import LogoutButton from "@/components/LogoutButton";
import { Pressable } from "react-native";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_EXPIRY_KEY = "libtrack-jwt-expires";
const REFRESH_TOKEN_EXPIRY_KEY = "libtrack-refresh-token-expires";

export default function About() {
  const [toggleInfo, setToggleInfo] = useState<boolean>(false);
  const [info, setInfo] = useState<string>("");

  const getInfo = async () => {
    const expiresAt = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);
    const refreshExpiresAt = await SecureStore.getItemAsync(
      REFRESH_TOKEN_EXPIRY_KEY,
    );
    let nfo = `API: ${apiUrl}\ntoken expires at: ${expiresAt}\nrefresh token expires at: ${refreshExpiresAt}`;

    setInfo(nfo);
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setToggleInfo(!toggleInfo)}>
        <Image source={icon} style={{ width: 100, height: 100 }} />
      </Pressable>
      <Text style={styles.title}>About LibTrack</Text>
      <MyText style={styles.paragraph}>
        Catalog your collections (CDs, vinyl, books, & more!) and rediscover
        your treasures.
      </MyText>
      <LogoutButton />
      {toggleInfo && (
        <MyText style={{ color: "#555555", marginTop: 14 }}>
          Info: {info}
        </MyText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111113",
    color: "white",
    alignItems: "center",
    paddingVertical: 10,
  },
  title: {
    color: "#ffffff",
    marginVertical: 10,
    fontFamily: "Quicksand_700Bold",
    fontSize: 24,
  },
  paragraph: {
    color: "#ffffff",
    fontSize: 18,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
});
