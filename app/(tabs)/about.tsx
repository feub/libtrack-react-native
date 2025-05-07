import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Image } from "react-native";
import icon from "@/assets/images/splash-icon.png";
import MyText from "@/components/MyText";
import LogoutButton from "@/components/LogoutButton";
import { Pressable } from "react-native";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function About() {
  const [toggleInfo, setToggleInfo] = useState<boolean>(false);
  const [info, setInfo] = useState<string>("");

  const getInfo = async () => {
    let nfo = `API endpoint: ${apiUrl}`;

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
        Catalog your physical music collections (CDs, vinyl, etc.) and
        rediscover your treasures.
      </MyText>
      <LogoutButton />
      {toggleInfo && (
        <MyText style={{ color: "#555555", marginTop: 14 }}>{info}</MyText>
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
    fontSize: 16,
    paddingHorizontal: 15,
    marginBottom: 10,
    textAlign: "left",
  },
});
