import React from 'react';
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Colors } from '../styles';
import { IconButton } from 'react-native-paper';

export const DateSelectServices = ({
  label,
  value,
  disabled = false,
  onPress,
  containerStyle,
  error = false,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text numberOfLines={1} style={styles.label}>
        {label}
      </Text>
      <Pressable
        style={[styles.valueContainer, error ? styles.errorContainer : null]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.valueText,
            !value || disabled ? styles.disableValueText : null,
          ]}
        >
          {value ? value : `Select ${label}`}
        </Text>
        <IconButton
          icon="calendar-range"
          color={disabled ? Colors.GRAY : Colors.BLACK}
          size={25}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  errorContainer: {
    borderWidth: 1,
    borderColor: "red",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.GRAY,
    marginBottom: 5,
  },
  valueContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.BRIGHT_GRAY,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 45,
  },
  valueText: {
    flex: 1,
  },
  disableValueText: {
    color: Colors.LIGHT_GRAY2,
  },
});