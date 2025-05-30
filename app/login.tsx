import React, { useEffect, useRef, useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Image } from "react-native";
import { useRouter } from "expo-router";
import icon from "@/assets/images/splash-icon.png";
import { useAuth } from "@/hooks/useAuth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

const Login = () => {
  const [email, setEmail] = useState<string>("fabien@feub.net");
  const [password, setPassword] = useState<string>(
    (process.env.EXPO_PUBLIC_PWD || "").toString(),
  );
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const emailInputRef = useRef<any>(null);
  const router = useRouter();
  const { loginUser, error } = useAuth();

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      router.replace("/");
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
    router.replace("/");
  };

  const LoginIcon = () => <MaterialIcons name="login" size={20} />;

  return (
    <View style={styles.container}>
      <Image source={icon} style={{ width: 100, height: 100, marginTop: 14 }} />
      <Text size="3xl">Sign in</Text>
      {error ? <Text className="text-error-400 mt-4">{error}</Text> : null}

      <View style={styles.inputContainer}>
        <FormControl
          // isInvalid={isInvalid}
          size="md"
          isDisabled={false}
          isReadOnly={false}
          isRequired={false}
        >
          <FormControlLabel>
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            className="mb-4"
          >
            <InputField
              placeholder="Email"
              ref={emailInputRef}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </Input>

          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            className="mb-4"
          >
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry={showPassword}
            />
            <InputSlot>
              <InputIcon>
                <MaterialCommunityIcons name="eye" size={24} color="white" />
              </InputIcon>
            </InputSlot>
          </Input>
        </FormControl>
      </View>

      <Button onPress={handleLogin} className="bg-tertiary-400 mb-4">
        <ButtonIcon as={LoginIcon} />
        <ButtonText variant="solid" action="primary">
          Login
        </ButtonText>
      </Button>

      <Button size="sm" action="secondary" onPress={goToIndex}>
        <ButtonText variant="outline" action="secondary">
          Go to index
        </ButtonText>
      </Button>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#111113",
    color: "#f1f1f1",
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
    marginVertical: 16,
  },
});
