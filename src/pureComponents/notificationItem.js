import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { IconButton } from "react-native-paper";
import { Colors, GlobalStyle } from "../styles";
// import ReadMore from "react-native-read-more-text";
import ReadMore from "@fawazahmed/react-native-read-more";

export const NotificationItem = ({
  title,
  date,
  onPress,
  icon,
  style,
  isFlag,
}) => {
  const conversionIndex = title.includes("Conversion :")
    ? title.indexOf("Conversion :") + 13
    : title.indexOf("Conversion:") + 12;
  const perIndex = title.indexOf("%");

  let firstStr = "";
  let secStr = "";
  let thirdStr = "";
  let anotherStr = "";
  let secStrCount = 0;

  if (conversionIndex >= 0 && perIndex >= 0) {
    firstStr = title.slice(0, conversionIndex);
    secStr = title.slice(conversionIndex, perIndex + 1);
    thirdStr = title.slice(perIndex + 1, title.length);
  }

  let isConsAvailable = title.includes("Consultants :");
  if (!isConsAvailable) {
    isConsAvailable = title.includes("Consultants:");
  }

  const consStartIndex = title.indexOf("[");
  const consEndIndex = title.indexOf("]");

  if (consStartIndex >= 0 && consEndIndex >= 0) {
    firstStr = title.slice(0, consStartIndex);
    secStr = title.slice(consStartIndex + 1, consEndIndex);
    anotherStr = secStr.split(", ");
    thirdStr = title.slice(consEndIndex + 1, title.length);
    secStrCount = title
      .slice(consStartIndex + 1, consEndIndex)
      .split(",").length;
    firstStr = firstStr + (secStrCount <= 5 ? "\n" : "");
  }

  return (
    <TouchableOpacity style={[styles.itemContainer, style]} onPress={onPress}>
      <View style={styles.subRow}>
        <Image source={icon} style={styles.iconContainer} />
        <View style={{ margin: 5, flex: 1 }}>
          {secStr ? (
            <ReadMore
              numberOfLines={5}
              style={[styles.title]}
              seeMoreText={"Read more"}
              seeMoreStyle={{ color: Colors.BLUE, marginTop: 5 }}
              seeLessText={"Hide"}
              seeLessStyle={{ color: Colors.BLUE, marginTop: 5 }}
            >
              <Text style={styles.title}>{`${firstStr}`}</Text>
              {secStrCount > 5 ? (
                <Text
                  style={[
                    styles.perText,
                    isFlag == "Y"
                      ? { color: Colors.RED, fontWeight: "bold" }
                      : null,
                  ]}
                >
                  {`${secStrCount > 5 ? secStrCount : secStr}`}
                </Text>
              ) : anotherStr.length > 0 ? anotherStr.map((item, index) => {return (
                <Text
                  style={[
                    styles.perText,
                    isFlag == "Y"
                      ? { color: Colors.RED, fontWeight: "bold" }
                      : null,
                  ]}
                >
                  {`${item}${
                    index == anotherStr.length - 1 ? "" : `,\n`
                  }`}
                </Text>
              );}) :null}
              <Text style={styles.title}>{`${thirdStr}`}</Text>
            </ReadMore>
          ) : (
            <ReadMore
              numberOfLines={4}
              style={styles.title}
              seeMoreText={"Read more"}
              seeMoreStyle={{ color: Colors.BLUE, marginTop: 5 }}
              seeLessText={"Hide"}
              seeLessStyle={{ color: Colors.BLUE, marginTop: 5 }}
            >
              <Text>{`${title}`}</Text>
            </ReadMore>
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
  },
});
