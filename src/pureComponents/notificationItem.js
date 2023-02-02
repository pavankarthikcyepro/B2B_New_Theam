import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { IconButton } from "react-native-paper";
import { Colors, GlobalStyle } from "../styles";

export const NotificationItem = ({ title, date, onPress, icon, style, isFlag }) => {
  const conversionIndex = title.includes("Conversion :")
    ? title.indexOf("Conversion :") + 13
    : title.indexOf("Conversion:") + 12;
  const perIndex = title.indexOf("%");

  let firstStr = "";
  let secStr = "";
  let thirdStr = "";

  if (conversionIndex >= 0 && perIndex >= 0) {
    firstStr = title.slice(0, conversionIndex);
    secStr = title.slice(conversionIndex, perIndex + 1);
    thirdStr = title.slice(perIndex + 1, title.length);
  }

  return (
    <TouchableOpacity style={[styles.itemContainer, style]} onPress={onPress}>
      <View style={styles.subRow}>
        <Image source={icon} style={styles.iconContainer} />
        <View style={{ margin: 5, flex: 1 }}>
          {secStr ? (
            <Text style={styles.title}>
              {firstStr}
              <Text
                style={[
                  styles.perText,
                  isFlag == "Y" ? { color: Colors.RED, fontWeight: "bold" } : null,
                ]}
              >
                {secStr}
              </Text>
              <Text style={styles.title}>{thirdStr}</Text>
            </Text>
          ) : (
            <Text style={styles.title}>{title}</Text>
          )}
        </View>
      </View>
      <IconButton
        icon="flag"
        color={isFlag == "Y" ? Colors.RED : Colors.GRAY}
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
  perText: {
    fontSize: 14,
  }
});
