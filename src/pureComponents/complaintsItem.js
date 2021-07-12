import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../styles";
import { IconButton } from "react-native-paper";
import { color } from "react-native-reanimated";

const NameComp = ({ label, value }) => {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}
    >
      <Text style={styles.text1}>{label}</Text>
      <Text style={styles.text2}>{value}</Text>
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
    <View>
      <View style={{ alignSelf: "stretch" }}>
        <View style={{ flexDirection: "row" }}>
          <NameComp label={"Complaint Factor: "} value={complaintFactor} />
          <IconButton icon="phone" color={Colors.GREEN} size={20} />
        </View>

        <NameComp value={name} />

        <View style={{ flexDirection: "row" }}>
          <NameComp value={place} />
          <View style={styles.rightView}>
            <IconButton icon="email" color={Colors.SKY_BLUE} size={30} />
          </View>
        </View>

        <NameComp label={"Enquiry ID    : "} value={enquiryID} />
        <NameComp label={"Enquiry DATE   : "} value={enquiryDate} />
        <NameComp label={"Source  : "} value={source} />
        <NameComp label={"DSE   : "} value={dse} />
        <NameComp />
        <NameComp value={car} />
        <NameComp value={text} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text1: {
    color: Colors.BLACK,
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
