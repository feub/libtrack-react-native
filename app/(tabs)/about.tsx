import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "react-native";
import { Pressable } from "react-native";
import icon from "@/assets/images/splash-icon.png";
import LogoutButton from "@/components/LogoutButton";
import { Text } from "@/components/ui/text";

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
      <Text className="text-2xl font-bold mb-4">About LibTrack</Text>
      <Text className="mb-4">
        Catalog your physical music collections (CDs, vinyl, etc.) and
        rediscover your treasures.
      </Text>
      <LogoutButton />
      {toggleInfo && <Text className="mt-4 text-gray-600">{info}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111113",
    color: "white",
    alignItems: "center",
    padding: 20,
  },
});
