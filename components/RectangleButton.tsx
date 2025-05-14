import { View, StyleSheet, Pressable } from "react-native";
import { Colors, Spacings } from "react-native-ui-lib";

interface RectangleButtonProps {
  handleOnPress: () => void;
  children: React.ReactNode;
}

export default function RectangleButton({
  handleOnPress,
  children,
}: RectangleButtonProps) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={[styles.btn, { borderColor: Colors.primary }]}
        onPress={handleOnPress}
      >
        {children}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignItems: "center",
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    padding: Spacings.s1,
    borderWidth: 1,
  },
});
