import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { IconButton } from "react-native-paper";
import { Colors, GlobalStyle } from "../styles";

export const NotificationItem = ({ title, date, onPress, icon, style, flagColor }) => {
  return (
    <TouchableOpacity style={[styles.itemContainer, style]} onPress={onPress}>
      <View style={styles.subRow}>
        <Image source={icon} style={styles.iconContainer} />
        <View style={{ margin: 5, flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      <IconButton
        icon="flag"
        color={flagColor ? flagColor : Colors.GRAY}
        size={20}
        rippleColor={style?.backgroundColor}
        onPress={() => {}}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 6,
    marginVertical: 10,
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-between",
    ...GlobalStyle.shadow,
  },
  subRow: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: { height: 35, width: 35, resizeMode: "contain" },
  title: {
    fontSize: 14,
    fontWeight: "400",
  },
});
