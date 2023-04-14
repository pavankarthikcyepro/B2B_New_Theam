import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { Colors, GlobalStyle } from "../styles";

export const DropDownServices = ({
  label,
  value,
  onPress,
  disabled = false,
  containerStyle,
  clearOption = false,
  onClear,
  clearKey = "",
  isDropDownIconShow = true,
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
        <View style={styles.iconRow}>
          {isDropDownIconShow && (
            <IconButton
              icon="menu-down"
              color={disabled ? Colors.GRAY : Colors.BLACK}
              size={25}
              style={{
                marginHorizontal: 0,
                borderRadius: 0,
              }}
            />
          )}
          {!disabled && value && clearOption ? (
            <IconButton
              onPress={() => onClear(clearKey)}
              icon="close-circle-outline"
              color={disabled ? Colors.GRAY : Colors.BLACK}
              size={20}
              style={{
                marginHorizontal: 0,
                paddingHorizontal: 5,
                borderLeftWidth: 1,
                borderRadius: 0,
                borderLeftColor: Colors.GRAY,
              }}
            />
          ) : null}
        </View>
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
    height: 45
  },
  valueText: {
    flex: 1,
  },
  disableValueText: {
    color: Colors.LIGHT_GRAY2,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  view3: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
  },
  text3: {
    paddingLeft: 12,
    fontSize: 16,
    fontWeight: "400",
    color: Colors.GRAY,
  },
});
