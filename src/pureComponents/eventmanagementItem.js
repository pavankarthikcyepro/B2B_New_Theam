import moment from "moment";
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TouchableOpacity, FlatList } from "react-native";
import { Colors, GlobalStyle } from "../styles";
import { IconButton } from 'react-native-paper';

const statusBgColors = {
  CANCELLED: {
    color: Colors.RED,
    title: "Cancelled"
  },
  ASSIGNED: {
    color: Colors.GREEN,
    title: "Assigned"
  },
  Approval_Pending: {
    color: Colors.YELLOW,
    title: "Approval Pending"
  }
}

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
  organizer,
  startDate,
  endDate,
  location,
  eventType,
  status,
  eventEmpDetails
}) => {

  const [showEmpList, setShowEmpList] = useState(false);
  const startDateStr = moment(startDate).format("DD MMM, YYYY");
  const endDateStr = moment(endDate).format("DD MMM, YYYY");
  let statusStr = "";
  let statusBgColor = Colors.YELLOW
  if (status === "Approval_Pending") {
    statusStr = "Approval Pending";
    statusBgColor = Colors.YELLOW;
  }

  return (
    <View>
      <NameComp
        label={"Event ID"}
        labelStyle={{ color: Colors.RED }}
        value={eventid}
        valueStyle={{ color: Colors.RED }}
      />
      <NameComp label={"Event Name"} value={eventName} />
      <NameComp label={"Event Type"} value={eventType} />
      <NameComp label={"Organizer"} value={organizer} />
      <NameComp label={"Location"} value={location} />
      <NameComp label={"Event Date"} value={startDateStr + " to " + endDateStr} />
      <NameComp
        label={"Staus :"}
        value={statusStr}
        valueStyle={{ color: statusBgColor }}
      />

      {showEmpList ? (
        <View>
          <FlatList
            data={eventEmpDetails}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {

              return (
                <View style={styles.rowView}>
                  <Text style={styles.empNameTitle}>{item.empName}</Text>
                  <Text style={GlobalStyle.underline}></Text>
                </View>
              )
            }}
          />
        </View>
      ) : null}

      {eventEmpDetails && eventEmpDetails.length > 0 ? (<TouchableOpacity onPress={() => setShowEmpList(!showEmpList)}>
        <View style={styles.moreView}>
          <Text style={styles.employeeListText}>{"See Participent's list"}</Text>
          <IconButton
            icon={showEmpList ? "chevron-up" : "chevron-down"}
            color={Colors.BLUE}
            style={{ margin: 0, padding: 0 }}
            size={20}
          />
        </View>
      </TouchableOpacity>) : null}

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
  moreView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center",
    height: 30,
    paddingHorizontal: 10
  },
  employeeListText: {
    color: Colors.BLUE,
    fontSize: 14,
    fontWeight: "400"
  },
  rowView: {
    paddingTop: 10,
    paddingBottom: 5
  },
  empNameTitle: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 5
  }
});
