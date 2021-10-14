import moment from "moment";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, GlobalStyle } from "../styles";


const NameComp = ({ label, value, labelStyle = {}, valueStyle = {} }) => {

  return (
    <View style={styles.bckVw}>
      <Text style={[styles.text1, labelStyle]} >{label}</Text>
      <Text style={[styles.text2, valueStyle]}>{":  " + value}</Text>
    </View>
  )
}

export const EventManagementItem = ({
  eventid,
  eventName,
  startDate,
  endDate,
  location,
  eventType,
  participiants,
}) => {

  const startDateStr = moment(startDate).format("DD MMM, YYYY");
  const endDateStr = moment(endDate).format("DD MMM, YYYY");

  return (
    <View>
      <NameComp
        label={"Event ID"}
        labelStyle={{ color: Colors.RED }}
        value={eventid}
        valueStyle={{ color: Colors.RED }}
      />
      <NameComp label={"Event Name"} value={eventName} />
      <NameComp label={"Start Date"} value={startDateStr} />
      <NameComp label={"End Date"} value={endDateStr} />
      <NameComp label={"Location"} value={location} />
      <NameComp label={"Event Type"} value={eventType} />
      <NameComp
        label={"Participiants :"}
        value={participiants}
        valueStyle={{ color: Colors.BLACK }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bckVw: {
    flexDirection: "row",
    alignItems: 'center',
    height: 25
  },
  text1: {
    color: Colors.GRAY,
    fontSize: 12,
    fontWeight: '400',
    width: 80
  },
  text2: {
    fontSize: 14,
    fontWeight: '400'
  },
});
