import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, GlobalStyle } from "../styles";
import { IconButton } from "react-native-paper";

const NameComp = ({ label, value, labelStyle, valueStyle }) => {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}
    >
      <Text style={[styles.text1, labelStyle]}>{label}</Text>
      <Text style={[styles.text2, valueStyle]}>{value}</Text>
    </View>
  );
};

export const ComplaintsItem = ({
  complaintFactor,
  name,
  place,
  enquiryID,
  enquiryDate,
  source,
  dse,
  car,
  text,
}) => {

  return (
    <View style={{}}>
      <NameComp label={"Complaint Factor: "} labelStyle={{ color: Colors.RED }} value={complaintFactor} valueStyle={{ color: Colors.BLUE }} />

      <View style={styles.view1}>

        <View>
          <NameComp value={name} />
          <NameComp value={place} />
          <NameComp label={"Enquiry ID    : "} value={enquiryID} />
          <NameComp label={"Enquiry DATE   : "} value={enquiryDate} />
          <NameComp label={"Source  : "} value={source} />
          <NameComp label={"DSE   : "} value={dse} />
          <NameComp />
        </View>

        <View style={{ flexDirection: 'column' }}>
          <IconButton icon="phone" color={Colors.GREEN} size={20} />
          <IconButton icon="email" color={Colors.SKY_BLUE} size={20} />
        </View>

      </View>

      <NameComp value={car} />
      <NameComp value={text} valueStyle={{ color: Colors.GRAY }} />
    </View>
  );
};

const styles = StyleSheet.create({
  view1: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  text1: {
    color: Colors.GRAY,
    fontSize: 14,
    fontWeight: "700",
  },
  text2: {
    fontSize: 14,
    fontWeight: "700",
  },
  rightView: {
    alignItems: "flex-end",
  },
});
