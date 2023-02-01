import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors, GlobalStyle } from '../styles';

export const DropDownSelectionItem = ({
  label,
  value,
  onPress,
  disabled = false,
  takeMinHeight = false,
  style,
  otherPrices = false,
  isDropDownIconShow = true,
}) => {
  
  let labelStyle = {
    height: 20,
    marginBottom: !takeMinHeight ? (value ? 0 : 20) : value ? 0 : 20,
  };

  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View style={[styles.container, { height: 50 }, style]}>
        <Text style={[styles.label, { fontSize: 10 }]}>
          {value ? label : ""}
        </Text>
        <View
          style={[
            styles.view3,
            otherPrices ? (value ? labelStyle : null) : labelStyle,
          ]}
        >
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
          {isDropDownIconShow && (
            <IconButton
              icon="menu-down"
              color={disabled ? Colors.GRAY : Colors.BLACK}
              size={25}
            />
          )}
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
    height: 50,
    backgroundColor: Colors.WHITE,
    justifyContent: "flex-end",
  },
  label: {
    fontSize: 12,
    marginLeft: 12,
    fontWeight: "400",
    color: Colors.GRAY,
  },
  view3: {
    width: "100%",
    height: 40,
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
    maxWidth: "85%",
  },
});
