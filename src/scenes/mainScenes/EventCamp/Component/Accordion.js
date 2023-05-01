import React from "react";
import { StyleSheet } from "react-native";
import { List } from "react-native-paper";

const Accordion = (props) => {
  const { label, id, openAccordian } = props;

  return (
    <List.Accordion
      id={id}
      title={label}
      titleStyle={{
        color: openAccordian === id ? "black" : "black",
        fontSize: 16,
        fontWeight: "600",
      }}
      style={[
        {
          backgroundColor: openAccordian === id ? "red" : "white",
          height: 60,
        },
        styles.accordianBorder,
      ]}
    >
      {props.children}
    </List.Accordion>
  );
};

export default Accordion;

const styles = StyleSheet.create({
  accordianBorder: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "#7a7b7d",
    justifyContent: "center",
    marginVertical: 3,
  },
});