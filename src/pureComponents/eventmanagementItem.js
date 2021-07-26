import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, GlobalStyle } from "../styles";

const EventComp = ({ label, value, labelStyle, valueStyle }) => {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}
    >
      <Text style={[styles.text1, labelStyle]}>{label}</Text>
      <Text style={[styles.text2, valueStyle]}>{value}</Text>
    </View>
  );
};

export const EventManagementItem = ({
  eventid,
  eventName,
  startDate,
  endDate,
  location,
  eventType,
  participiants,
}) => {
  return (
    <View>
      <EventComp
        label={"Event ID: "}
        labelStyle={{ color: Colors.RED }}
        value={eventid}
        valueStyle={{ color: Colors.RED }}
      />
      <EventComp label={"Event Name : "} value={eventName} />
      <EventComp label={"Start Date : "} value={startDate} />
      <EventComp label={"End Date : "} value={endDate} />
      <EventComp label={"Location : "} value={location} />
      <EventComp label={"Event Type : "} value={eventType} />
      <EventComp
        label={"Participiants :"}
        value={participiants}
        valueStyle={{ color: Colors.BLACK }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text1: {
    color: Colors.MAROON,
    fontSize: 14,
    fontWeight: "400",
  },
  text2: {
    fontSize: 16,
    fontWeight: "600",
  },
});
