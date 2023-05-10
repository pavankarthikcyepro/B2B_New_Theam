import React from "react";
import { StyleSheet, View, Text, Pressable, Dimensions } from "react-native";
import { RadioButton } from "react-native-paper";
import { Colors } from "../styles";

const RadioTextItem = ({
  label,
  value,
  status = false,
  disabled = false,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View style={styles.view}>
        <Text
          style={[
            styles.text,
            { color: disabled ? Colors.GRAY : Colors.BLACK },
          ]}
        >
          {label}
        </Text>
        <RadioButton.Android
          value={value}
          status={status ? "checked" : "unchecked"}
          disabled={disabled}
          uncheckedColor={Colors.GRAY}
          color={Colors.RED}
          onPress={onPress}
        />
      </View>
    </Pressable>
  );
};
const { width, height } = Dimensions.get("window");
const circleSize = Math.min(width, height) * 0.8;

const RadioTextItem2 = ({
  label,
  value,
  status = false,
  disabled = false,
  onPress,
  data,
}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View style={styles.view}>
        <RadioButton.Android
          value={value}
          status={status ? "checked" : "unchecked"}
          disabled={disabled}
          uncheckedColor={Colors.GRAY}
          color={Colors.RED}
          onPress={onPress}
        />
        {/* <Text
          style={[
            styles.text,
            { color: disabled ? Colors.GRAY : Colors.BLACK },
          ]}
        >
          {label}
        </Text> */}
        <View style={styles.tabContainer}>
          <Text
            style={[
              styles.text,
              { color: disabled ? Colors.GRAY : Colors.BLACK },
            ]}
          >
            {label}
          </Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{data}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const RadioTextItem1 = ({
  label,
  value,
  status = false,
  disabled = false,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View style={styles.view}>
        <RadioButton.Android
          value={value}
          status={status ? "checked" : "unchecked"}
          disabled={disabled}
          uncheckedColor={Colors.GRAY}
          color={Colors.RED}
          onPress={onPress}
        />
        <Text
          style={[
            styles.text,
            { color: disabled ? Colors.GRAY : Colors.BLACK },
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};
export { RadioTextItem, RadioTextItem1, RadioTextItem2 };

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "400",
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  titleText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgeContainer: {
    marginLeft: 3,
    bottom: 4,
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: Colors.RED,
    // borderRadius: 15,
    // width:25,
    // aspectRatio:4/4,
    // padding: 5,
  },
  badgeText: { fontSize: 11, color: Colors.RED, fontWeight: "bold" },
});
