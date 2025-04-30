import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextInput } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView, View, StyleSheet, Text, Pressable } from "react-native";

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
    watch,
    reset,
  } = useForm<SearchTermType>();

  const searchTerm = watch("searchTerm");

  const onSubmitForm = async (data: SearchTermType) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  const handleResetSearch = async () => {
    reset({ searchTerm: "" });

    try {
      await onSubmit({ searchTerm: "" });
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
                label="Search"
                mode="outlined"
                style={styles.input}
                // placeholder="Search..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          {searchTerm && (
            <Pressable style={styles.buttonCancel} onPress={handleResetSearch}>
              <MaterialIcons name="cancel" size={16} color="#25292e" />
            </Pressable>
          )}

          <Pressable style={styles.button} onPress={handleSubmit(onSubmitForm)}>
            <MaterialIcons name="search" size={16} color="#25292e" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingBottom: 10,
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
    marginRight: 10,
    minWidth: 150,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#afb42b",
    borderRadius: 12,
    padding: 10,
  },
  buttonCancel: {
    position: "absolute",
    right: 70,
    fontWeight: "bold",
    zIndex: 100,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
