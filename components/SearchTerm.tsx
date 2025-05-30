import React from "react";
import { useForm, Controller } from "react-hook-form";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView, View, StyleSheet, Text, Pressable } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonIcon } from "@/components/ui/button";

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

  const SearchIcon = () => (
    <MaterialIcons name="search" size={20} color="#25292e" />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {errors.searchTerm && (
          <Text className="text-error-500" style={[styles.errorText]}>
            {errors.searchTerm.message as String}
          </Text>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.searchWrapper}>
            <Controller
              control={control}
              name="searchTerm"
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="outline"
                  size="md"
                  isDisabled={false}
                  isInvalid={false}
                  isReadOnly={false}
                  className="mb-4"
                >
                  <InputField
                    placeholder="Search..."
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                  />
                </Input>
              )}
            />

            {searchTerm && (
              <Pressable
                style={styles.buttonCancel}
                onPress={handleResetSearch}
              >
                <MaterialIcons name="cancel" size={16} color="white" />
              </Pressable>
            )}
          </View>

          <Button
            onPress={handleSubmit(onSubmitForm)}
            className="bg-tertiary-400 mb-4"
          >
            <ButtonIcon as={SearchIcon} />
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
  },
  container: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    width: "100%",
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
  buttonCancel: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 100,
  },
  errorText: {
    marginBottom: 10,
  },
});
