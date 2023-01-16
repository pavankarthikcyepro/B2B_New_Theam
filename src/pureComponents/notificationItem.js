import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Colors, GlobalStyle } from "../styles";

export const NotificationItem = ({ title, date, onPress, icon, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, style]}
    >
      <Image
        source={icon}
        style={{ height: 35, width: 35, resizeMode: "contain" }}
      />
      <View style={{ margin: 5, flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {/* <Text style={[styles.title, styles.text2]}>{date}</Text> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: Colors.WHITE,
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    ...GlobalStyle.shadow,
  },
  title: {
    fontSize: 14,
    fontWeight: "400",
  },
  text2: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "right",
    color: Colors.GRAY,
  },
});
