import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { Colors, GlobalStyle } from "../styles";

export const DropDownSelectionItem = ({
  label,
  value,
  onPress,
  disabled = false,
  takeMinHeight = false,
  style,
  otherPrices = false,
  clearOption = false,
  onClear,
  clearKey = "",
  isDropDownIconShow = true,
}) => {
  let labelStyle = {
    marginBottom: !takeMinHeight ? (value ? 0 : 20) : value ? 0 : 20,
  };

  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View style={{ paddingTop: 5, backgroundColor: Colors.WHITE }}>
        <View style={[styles.container, style]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { fontSize: 10 }]}>
              {value ? label : ""}
            </Text>
            <View style={[styles.view3, labelStyle]}>
              <Text
                style={[
                  styles.text3,
                  !otherPrices && {
                    color: value
                      ? disabled
                        ? Colors.GRAY
                        : Colors.BLACK
                      : Colors.GRAY,
                    fontSize: !takeMinHeight ? 16 : 14,
                  },
                ]}
                numberOfLines={1}
              >
                {value ? value : label}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        </View>
        <View
          style={[
            GlobalStyle.underline,
            style && style.borderColor
              ? { backgroundColor: style.borderColor }
              : null,
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    marginLeft: 12,
    fontWeight: "400",
    color: Colors.GRAY,
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
