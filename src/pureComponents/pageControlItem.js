import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { Colors } from "../styles";

export const PageControlItem = ({
  pageNumber,
  totalPages,
  onLeftPress,
  onRightPress,
  onLeftForwardPress,
  onRihtForwardPress,
}) => {
  return (
    <View style={styles.container}>
      <IconButton
        icon={"chevron-double-left"}
        size={25}
        style={{ padding: 0, margin: 0 }}
        color={Colors.GRAY}
        onPress={onLeftForwardPress}
      />
      <IconButton
        icon={"chevron-left"}
        size={25}
        style={{ padding: 0, margin: 0 }}
        color={Colors.GRAY}
        onPress={onLeftPress}
      />
      <Text style={styles.text1}>
        {pageNumber + " / "}
        <Text style={[styles.text1, styles.text2]}>{totalPages}</Text>
      </Text>
      <IconButton
        icon={"chevron-right"}
        size={25}
        style={{ padding: 0, margin: 0 }}
        color={Colors.DARK_GRAY}
        onPress={onRightPress}
      />
      <IconButton
        icon={"chevron-double-right"}
        size={25}
        style={{ padding: 0, margin: 0 }}
        color={Colors.DARK_GRAY}
        onPress={onRihtForwardPress}
      />
   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text1: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  text2: {
    color: Colors.BLACK,
  },
});
