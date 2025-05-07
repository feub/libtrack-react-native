import React from "react";
import { useForm, Controller } from "react-hook-form";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView, View, StyleSheet, Text, Pressable } from "react-native";
import { TextField, Button, Colors, Spacings } from "react-native-ui-lib";

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {errors.searchTerm && (
          <Text style={styles.errorText}>
            {errors.searchTerm.message as String}
          </Text>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.searchWrapper}>
            <Controller
              control={control}
              name="searchTerm"
              defaultValue=""
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  placeholder="Search..."
                  placeholderTextColor={Colors.grey30}
                  style={styles.input}
                  color={Colors.text}
                  fieldStyle={styles.fieldStyle}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            {searchTerm && (
              <Pressable
                style={styles.buttonCancel}
                onPress={handleResetSearch}
              >
                <MaterialIcons name="cancel" size={16} color={Colors.text} />
              </Pressable>
            )}
          </View>

          <Button
            style={styles.button}
            backgroundColor={Colors.primary}
            onPress={handleSubmit(onSubmitForm)}
          >
            <MaterialIcons name="search" size={20} color="#25292e" />
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background,
    width: "100%",
  },
  container: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    width: "100%",
    backgroundColor: Colors.background,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  searchWrapper: {
    flex: 1,
    position: "relative",
    marginRight: 10,
  },
  input: {
    width: "100%",
    height: 40,
    color: Colors.text,
  },
  fieldStyle: {
    backgroundColor: Colors.background,
    borderColor: Colors.text,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacings.s2,
    paddingRight: 30,
    height: 40,
  },
  button: {
    height: 40,
    width: 40,
    borderRadius: 8,
  },
  buttonCancel: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 100,
  },
  errorText: {
    color: Colors.red30 || "red",
    marginBottom: 10,
  },
});
