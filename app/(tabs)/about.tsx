import { Text, View, StyleSheet } from "react-native";
import { Image } from "react-native";
import icon from "@/assets/images/splash-icon.png";
import MyText from "@/components/MyText";
import LogoutButton from "@/components/LogoutButton";

export default function About() {
  return (
    <View style={styles.container}>
      <Image source={icon} style={{ width: 100, height: 100 }} />
      <Text style={styles.title}>About LibTrack</Text>
      <MyText style={styles.paragraph}>
        Catalog your collections (CDs, vinyl, books, & more!) and rediscover
        your treasures.
      </MyText>
      <LogoutButton />
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
