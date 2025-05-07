import React, { useEffect, useRef, useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Image } from "react-native";
import icon from "@/assets/images/splash-icon.png";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { Button, Text, TextField, Colors, Spacings } from "react-native-ui-lib";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Login = () => {
  const [email, setEmail] = useState<string>("fabien@feub.net");
  const [password, setPassword] = useState<string>(
    (process.env.EXPO_PUBLIC_PWD || "").toString(),
  );
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const emailInputRef = useRef<any>(null);
  const router = useRouter();
  const { loginUser, user } = useAuth();

  // Redirect to tabs if already authenticated
  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user, router]);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Login Failed", "Please try again.", [{ text: "OK" }]);
      console.log(
        "Error: ",
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    }
  };

  const goToIndex = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Image source={icon} style={{ width: 100, height: 100, marginTop: 14 }} />
      <Text h3 color={Colors.orange}>
        Sign in
      </Text>

      <View style={styles.inputContainer}>
        <TextField
          ref={emailInputRef}
          placeholder="Email"
          floatingPlaceholder
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
          color={Colors.text}
          fieldStyle={styles.fieldStyle}
        />

        <TextField
          placeholder="Password"
          floatingPlaceholder
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry={showPassword}
          style={styles.input}
          color={Colors.text}
          fieldStyle={styles.fieldStyle}
        />
      </View>

      <Button
        label={"Login"}
        backgroundColor={Colors.primary}
        onPress={handleLogin}
        marginB-s2
      />

      <Button
        label={"Go to index"}
        outline
        outlineColor={Colors.primary}
        onPress={goToIndex}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    padding: Spacings.s4,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
    marginVertical: Spacings.s4,
  },
  input: {
    marginVertical: Spacings.s4,
    width: "100%",
  },
  fieldStyle: {
    backgroundColor: Colors.background,
    borderColor: Colors.text,
    borderWidth: 1,
    paddingHorizontal: Spacings.s2,
    borderRadius: 10,
  },
});
