import React, { useEffect, useRef, useState } from "react";
import { View, Alert, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { TextInput, Button } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MyText from "@/components/MyText";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Login = () => {
  const [email, setEmail] = useState<string>("fabien@feub.net");
  const [password, setPassword] = useState<string>("Harfan975");
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const emailInputRef = useRef<any>(null);
  const router = useRouter();
  const { onLogin, authState } = useAuth();

  // Redirect to tabs if already authenticated
  useEffect(() => {
    if (authState && authState.authenticated) {
      router.replace("/(tabs)");
    }
  }, [authState, router]);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleLogin = async () => {
    if (onLogin) {
      const result = await onLogin(email, password);

      if (result && result.error) {
        Alert.alert("Login Failed: ", result.msg);
        console.log("Error: ", result.msg);
      }
    }
  };

  const goToIndex = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <MyText style={styles.title}>Sign in</MyText>
      <MyText style={{ color: "#f1f1f1" }}>API: {apiUrl}</MyText>
      <TextInput
        label="Email"
        ref={emailInputRef}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Pasword"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={showPassword}
        style={styles.input}
        right={
          <TextInput.Icon
            icon="eye"
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <Button
        icon="login"
        mode="contained"
        onPress={handleLogin}
        style={{ marginBottom: 6 }}
      >
        Login
      </Button>

      <Button mode="outlined" onPress={goToIndex}>
        Go to index
      </Button>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111113",
    color: "white",
    alignItems: "center",
    padding: 14,
  },
  title: {
    color: "#ffffff",
    marginVertical: 10,
    fontFamily: "Quicksand_700Bold",
    fontSize: 24,
  },
  input: {
    marginVertical: 14,
    width: "100%",
  },
});
