import { Text, View, StyleSheet } from "react-native";
import { Image } from "react-native";
import icon from "@/assets/images/splash-icon.png";
import MyText from "@/components/MyText";

export default function Releases() {
  return (
    <View style={styles.container}>
      <Image source={icon} style={{ width: 100, height: 100 }} />
      <Text style={styles.title}>Releases</Text>
      <MyText style={styles.paragraph}>hoho</MyText>
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
  entriesContainer: {
    width: "100%",
    padding: 10,
    maxWidth: 600,
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
