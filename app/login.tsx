import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, Alert, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MyText from "@/components/MyText";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Login = () => {
  const [email, setEmail] = useState<string>("fabien@feub.net");
  const [password, setPassword] = useState<string>("Harfan975$");
  const emailInputRef = useRef<TextInput>(null);
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
        alert("Error: " + result.msg);
        console.log("Error: ", result.msg);
      } else {
        alert("logged in");
        console.log(result.token);
      }
    }

    // try {
    //   const response = await axiosInstance.post(loginEndpoint, {
    //     username: email,
    //     password,
    //   });
    //   const { user, token } = response.data as { user: string; token: string };
    //   await AsyncStorage.setItem("userToken", token);
    //   Alert.alert("👍 Login Successful", `Welcome ${user}! 👋`);
    //   router.replace("/(tabs)");
    // } catch (error: any) {
    //   if (error.response) {
    //     console.log("if error.response", error.response);
    //     Alert.alert(
    //       "Login Failed",
    //       error.response.data.message || "An error occurred",
    //     );
    //   } else {
    //     console.log("else", error);
    //     Alert.alert("Login Failed", "Network error occurred");
    //   }
    // }
  };

  const goToIndex = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <MyText style={styles.title}>Sign in</MyText>
      <MyText style={{ color: "#f1f1f1" }}>API: {apiUrl}</MyText>
      <TextInput
        ref={emailInputRef}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.buttonContainer} onPress={handleLogin}>
        <MyText style={styles.loginBtn}>Login</MyText>
        <MaterialIcons name="login" size={16} color="#25292e" />
      </Pressable>

      <Pressable style={styles.buttonContainer} onPress={goToIndex}>
        <MyText>Go to index</MyText>
      </Pressable>
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
    color: "#000000",
    backgroundColor: "#f97316",
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f97316",
    borderRadius: 12,
    padding: 10,
  },
  loginBtn: {
    marginRight: 6,
    fontWeight: "bold",
  },
});
