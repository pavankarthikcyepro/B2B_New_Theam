import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { Colors } from "../styles";
import moment from 'moment';

const convertTimeStampToDateString = (timeStamp) => {
  const date = moment().format("DD/MM/YYYY h:mm a");
  return date;
}

export const PreEnquiryItem = ({
  name,
  subName,
  type = "COLD",
  date,
  modelName,
  bgColor = Colors.WHITE,
  onPress,
  onCallPress,
}) => {
  let textColor = Colors.GREEN;
  if (type === "HOT") {
    textColor = Colors.RED;
  } else if (type === "WARM") {
    textColor = Colors.YELLOW;
  }

  const myDate = convertTimeStampToDateString(date);

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.leftView}>
          <Text style={styles.text1}>
            {name + " "}{" "}
            <Text
              style={[
                styles.text1,
                { color: textColor, marginLeft: 10, fontSize: 12 },
              ]}
            >
              {type.toUpperCase()}
            </Text>
          </Text>
          <Text style={[styles.text3, { marginTop: 5 }]}>{subName}</Text>
          <Text style={styles.text2}>{myDate}</Text>
        </View>
        <View style={styles.rightView}>
          <Button
            mode="contained"
            contentStyle={{ height: 30, backgroundColor: Colors.RED }}
            labelStyle={{ fontSize: 12, fontWeight: "600" }}
            onPress={() => console.log("Pressed")}
          >
            {modelName}
          </Button>
          <IconButton
            icon="phone"
            color={Colors.GREEN}
            size={20}
            onPress={onCallPress}
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.LIGHT_GRAY,
    alignItems: "center",
  },
  leftView: {},
  rightView: {
    alignItems: "flex-end",
  },
  text1: {
    fontSize: 16,
    fontWeight: "600",
  },
  text2: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "400",
    color: Colors.GRAY,
  },
  text3: {
    fontSize: 14,
    fontWeight: "400",
  },
});
