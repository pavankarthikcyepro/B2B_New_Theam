import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { Colors } from "../../../../styles";

const CustomEvaluationDropDown = (props) => {
  const { label, buttonText, onPress, value = "", disabled = false } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.button}
        disabled={disabled}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>
          {value !== "" ? value : buttonText}
        </Text>
        <Entypo size={12} name="chevron-down" color={Colors.BLACK} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 7,
  },
  label: {
    color: "#5A5A5A",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 5,
    marginBottom: 3,
  },
  button: {
    backgroundColor: Colors.BRIGHT_GRAY,
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
});

export default CustomEvaluationDropDown;
