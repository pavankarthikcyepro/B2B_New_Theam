import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, GlobalStyle } from "../styles";
import { IconButton } from "react-native-paper";

const NameComp = ({ label, value, labelStyle = {}, valueStyle = {} }) => {

  return (
    <View style={styles.bckVw}>
      <Text style={[styles.text3, labelStyle]}>{label}</Text>
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
  source
}) => {
  return (
    <View>
      <NameComp
        label={"Complaint Factor: "}
        labelStyle={{ color: Colors.RED }}
        value={complaintFactor}
        valueStyle={{ color: Colors.BLUE }}
      />

      <View style={styles.view1}>
        <View>
          <NameComp label={"Name"} value={name} />
          <NameComp label={"Mobile"} value={mobile} />
          <NameComp label={"Email"} value={email} />
          <NameComp label={"Model"} value={model} />
          <NameComp label={"Closing Source"} labelStyle={{ width: 85 }} value={source} />
        </View>

        <View style={{ flexDirection: "column" }}>
          <IconButton icon="phone" color={Colors.GREEN} size={20} />
          <IconButton icon="email" color={Colors.LIGHT_SKY_BLUE} size={20} />
        </View>
      </View>
    </View>
  );
};

// export const ComplaintsItem = ({
//   complaintFactor,
//   name,
//   place,
//   enquiryID,
//   enquiryDate,
//   source,
//   dse,
//   car,
//   text,
// }) => {
//   return (
//     <View>
//       <NameComp
//         label={"Complaint Factor: "}
//         labelStyle={{ color: Colors.RED }}
//         value={complaintFactor}
//         valueStyle={{ color: Colors.BLUE }}
//       />

//       <View style={styles.view1}>
//         <View>
//           <NameComp value={name} />
//           <NameComp value={place} />
//           <NameComp label={"Enquiry ID    : "} value={enquiryID} />
//           <NameComp label={"Enquiry DATE   : "} value={enquiryDate} />
//           <NameComp label={"Source  : "} value={source} />
//           <NameComp label={"DSE   : "} value={dse} />
//           <NameComp />
//         </View>

//         <View style={{ flexDirection: "column" }}>
//           <IconButton icon="phone" color={Colors.GREEN} size={20} />
//           <IconButton icon="email" color={Colors.LIGHT_SKY_BLUE} size={20} />
//         </View>
//       </View>

//       <NameComp value={car} />
//       <NameComp value={text} valueStyle={{ color: Colors.GRAY }} />
//     </View>
//   );
// };

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
  }
});
