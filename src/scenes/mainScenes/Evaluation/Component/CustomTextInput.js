import React from "react";
import { Text } from "react-native";
import { View, TextInput, StyleSheet } from "react-native";
import { Colors } from "../../../../styles";

const CustomTextInput = (props) => {
  const {
    label,
    value,
    mandatory = false,
    placeholder,
    errorMessage = "",
    ...textInputProps
  } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        <Text style={styles.mandatory}>{mandatory ? " *" : ""}</Text>
      </Text>
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#8b8680"
        style={styles.input}
        {...textInputProps}
      />
      {errorMessage !== "" && errorMessage !== undefined ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 7,
  },
  label: {
    color: "#5A5A5A",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 5,
    marginBottom: 3,
  },
  mandatory: {
    color: Colors.RED,
  },
  error: {
    color: "red",
    marginLeft: 5,
    marginBottom: 3,
  },
  input: {
    backgroundColor: "#D3D3D3",
    width: "100%",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: "#000",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default CustomTextInput;
