import React from 'react';
import { StyleSheet, View, TextInput, Text } from "react-native";
import { Colors } from '../styles';

const TextInputServices = ({
  label,
  value,
  placeholder,
  keyboardType = "default",
  onChangeText,
  containerStyle,
  numberOfLines,
  editable,
  maxLength,
  multiline,
  autoCapitalize = "none",
  error = false,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.LIGHT_GRAY2}
        label={label}
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        numberOfLines={numberOfLines}
        editable={editable}
        maxLength={maxLength}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        style={[styles.input, error ? styles.errorContainer : null]}
        selectionColor={Colors.BLACK}
        spellCheck={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 5,
  },
  errorContainer: {
    borderWidth: 1,
    borderColor: "red"
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.GRAY,
    marginBottom: 5,
  },
  input: {
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 5,
    padding: 10,
    paddingVertical: 15,
    fontSize: 14
  },
});

export { TextInputServices }; 