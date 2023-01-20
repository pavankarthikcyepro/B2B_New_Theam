import React from "react";
import { View, Modal, Pressable, Text } from "react-native";
import { TextinputComp } from "./textinputComp";
import { Colors } from "../styles";
import { IconButton } from "react-native-paper";

const DateComp = ({ label, date }) => {
  return (
    <View style={{ borderColor: Colors.BORDER_COLOR, borderWidth: 1, borderRadius: 4, backgroundColor: Colors.WHITE, paddingHorizontal: 5, height: 50, justifyContent: 'center' }}>
      {date ? <Text style={{ fontSize: 12, fontWeight: '400', color: Colors.GRAY }}>{label}</Text> : null}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 14, fontWeight: '400', color: date ? Colors.BLACK : Colors.GRAY, width:'70%' }}>{date ? date : label}</Text>
        <IconButton
          icon={"calendar-month"}
          size={20}
          style={{ margin: 0 }}
          color={Colors.GRAY}
        />
      </View>
    </View>
  )
}

const DateRangeComp = ({ fromDate, fromDateClicked, toDate, toDateClicked }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
      }}
    >
      <View style={{ width: "48%" }}>
        <Pressable onPress={fromDateClicked}>
          <DateComp
            label={"From Date"}
            date={fromDate}
          />
        </Pressable>
      </View>

      <View style={{ width: "48%" }}>
        <Pressable onPress={toDateClicked}>
          <DateComp
            label={"To Date"}
            date={toDate}
          />
        </Pressable>
      </View>
    </View>
  );
};

export { DateRangeComp };
