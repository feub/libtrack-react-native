import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
} from "react-native";

type SearchTermType = {
  searchTerm: string;
};

type SearchFormProps = {
  onSubmit: (data: SearchTermType) => Promise<void>;
};

export default function SearchTerm({ onSubmit }: SearchFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchTermType>();

  const onSubmitForm = async (data: SearchTermType) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {errors.searchTerm && (
          <Text style={styles.errorText}>
            {errors.searchTerm.message as String}
          </Text>
        )}

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="searchTerm"
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Search..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Pressable style={styles.button} onPress={handleSubmit(onSubmitForm)}>
            <MaterialIcons name="search" size={16} color="#25292e" />
            <Text style={styles.buttonText}>Search</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    color: "#000000",
    backgroundColor: "#f97316",
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    minWidth: 150,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f97316",
    borderRadius: 12,
    padding: 10,
  },
  buttonText: {
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
