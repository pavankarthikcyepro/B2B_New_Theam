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
  editable = true,
  maxLength,
  multiline,
  autoCapitalize = "none",
  error = false,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text numberOfLines={1} style={styles.label}>
        {label}
      </Text>
      <TextInput
        placeholder={placeholder ? placeholder : `Enter ${label}`}
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
        style={[
          styles.input,
          !editable ? styles.disabledInput : null,
          error ? styles.errorContainer : null,
        ]}
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
    borderColor: Colors.PINK,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.GRAY,
    marginBottom: 5,
  },
  input: {
    backgroundColor: Colors.BRIGHT_GRAY,
    borderRadius: 5,
    padding: 10,
    paddingVertical: 15,
    fontSize: 14,
    height: 45,
    color: Colors.BLACK,
  },
  disabledInput: {
    color: Colors.LIGHT_GRAY2,
    fontSize: 14,
  },
});

export { TextInputServices }; 