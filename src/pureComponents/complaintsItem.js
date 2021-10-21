import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, GlobalStyle } from "../styles";
import { IconButton } from "react-native-paper";

const NameComp = ({ label, value, labelStyle = {}, valueStyle = {} }) => {

  return (
    <View style={styles.bckVw}>
      <Text style={[styles.text3, labelStyle]} numberOfLines={1}>{label}</Text>
      <Text style={[styles.text4, valueStyle]}>{":  " + value}</Text>
    </View>
  )
}

export const ComplaintsItem = ({
  complaintFactor,
  name,
  mobile,
  email,
  model,
  source,
  status,
  onCallPress,
  onEmailPress
}) => {

  let textColor = Colors.BLUE;
  let statusText = ""
  if (status === "Active") {
    textColor = Colors.GREEN;
    statusText = "Active";
  }
  else if (status === "InActive") {
    textColor = Colors.YELLOW;
    statusText = "In Active";
  }

  return (
    <View>
      <View style={styles.view1}>
        <NameComp
          label={"Complaint Factor"}
          labelStyle={{ color: Colors.RED, width: 100 }}
          value={complaintFactor}
          valueStyle={{ color: Colors.BLUE }}
        />
        <View style={{ backgroundColor: textColor, paddingHorizontal: 5, height: 20, justifyContent: 'center', alignItems: "center", borderRadius: 4 }}>
          <Text style={[styles.statusTextStyle, { color: Colors.WHITE, }]}>{statusText}</Text>
        </View>
      </View>

      <View style={styles.view1}>
        <View>
          <NameComp label={"Name"} value={name} />
          <NameComp label={"Mobile"} value={mobile} />
          <NameComp label={"Email"} value={email} />
          <NameComp label={"Model"} value={model} />
          <NameComp label={"Closing Source"} labelStyle={{ width: 85 }} value={source} />
        </View>

        <View style={{ flexDirection: "column" }}>
          <IconButton icon="phone" color={Colors.GREEN} size={20} onPress={onCallPress} />
          <IconButton icon="email" color={Colors.LIGHT_SKY_BLUE} size={20} onPress={onEmailPress} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view1: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  text3: {
    color: Colors.GRAY,
    fontSize: 12,
    fontWeight: '400',
    width: 60
  },
  text4: {
    fontSize: 14,
    fontWeight: '400'
  },
  bckVw: {
    flexDirection: "row",
    alignItems: 'center',
    height: 25
  },
  statusTextStyle: {
    fontSize: 14,
    fontWeight: "400"
  }
});
