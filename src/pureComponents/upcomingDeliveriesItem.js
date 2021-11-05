import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { Colors } from "../styles";
import { convertTimeStampToDateString } from "../utils/helperFunctions";

const NameComp = ({ label, value, labelStyle = {}, valueStyle = {} }) => {

  return (
    <View style={styles.bckVw}>
      <Text style={[styles.text3, labelStyle]}>{label}</Text>
      <Text style={[styles.text4, valueStyle]}>{":  " + value}</Text>
    </View>
  )
}

export const UpcomingDeliveriesItem = ({
  name,
  planning,
  location,
  dseName,
  modelName,
  chasissNo,
  bgColor = Colors.WHITE,
  onPress,
  onCallPress,
}) => {

  const date = convertTimeStampToDateString(planning, "MMM DD, YYYY")

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.leftView}>
          <Text style={styles.text1}>{name}</Text>
          {/* <Text style={[styles.text2, { marginTop: 5 }]}>
            {"D Planning: " + planning}
          </Text>
          <Text style={[styles.text2, { marginTop: 5 }]}>
            {"D Location: " + location}
          </Text>
          <Text style={styles.text2}>{"DSE Name: " + dseName}</Text> */}
          <NameComp label={'D Planning'} value={date} />
          <NameComp label={'D Location'} value={location} />
          <NameComp label={'DSE Name'} value={dseName} />
          <NameComp label={'Chassis No'} value={chasissNo} />
        </View>
        <View style={styles.rightView}>
          <Button
            mode="contained"
            contentStyle={{ height: modelName ? 30 : 0, backgroundColor: Colors.RED }}
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
    fontSize: 14,
    fontWeight: "400",
    color: Colors.GRAY,
  },
  text3: {
    color: Colors.GRAY,
    fontSize: 12,
    fontWeight: '400',
    width: 65
  },
  text4: {
    fontSize: 14,
    fontWeight: '400'
  },
  bckVw: {
    flexDirection: "row",
    alignItems: 'center',
    height: 25
  }
});
