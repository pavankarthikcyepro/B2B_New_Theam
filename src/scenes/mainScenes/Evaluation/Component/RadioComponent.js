import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../../../../styles";
import { RadioTextItem2 } from "../../../../pureComponents";

const CustomRadioButton = (props) => {
  const { label, value, mandatory, onPress } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        <Text style={styles.mandatory}>{mandatory ? " *" : ""}</Text>
      </Text>
      <View style={{ flexDirection: "row" }}>
        <RadioTextItem2
          label={"75%"}
          value={"75"}
          status={value == "75" ? true : false}
          onPress={() => onPress("75")}
        />
        <RadioTextItem2
          label={"50%"}
          value={"50"}
          status={value == "50" ? true : false}
          onPress={() => onPress("50")}
        />
        <RadioTextItem2
          label={"25%"}
          value={"25"}
          status={value == "25" ? true : false}
          onPress={() => onPress("25")}
        />
        <RadioTextItem2
          label={"Below 25%"}
          value={">25"}
          status={value == ">25" ? true : false}
          onPress={() => onPress(">25")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 7,
    borderBottomColor: "#5A5A5A",
    borderBottomWidth: 0.5,
  },
  label: {
    color: "#5A5A5A",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 5,
    marginBottom: 3,
  },
  button: {
    backgroundColor: "#D3D3D3",
    width: "100%",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  buttonText: {
    color: "#000",
    fontWeight: "500",
    fontSize: 14,
  },
  placeHolderButtonText: {
    color: "#D3D3D3",
    fontWeight: "500",
    fontSize: 14,
  },
  mandatory: {
    color: Colors.RED,
  },
});

export default CustomRadioButton;
