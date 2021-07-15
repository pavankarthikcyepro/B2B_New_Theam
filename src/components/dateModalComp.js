import React from "react";
import { View, Modal, StyleSheet, Text, Dimensions } from "react-native";
import { Colors } from "../styles";
import { Button } from "react-native-paper";

import { DateRangeComp } from "../components/dateRangeComp";
import { TextinputComp } from "./textinputComp";

const screenWidth = Dimensions.get("window").width;

const DateModalComp = ({ visible = false, onRequestClose }) => {
  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.container}>
        <View style={styles.view1}>
          <View style={styles.View2}>
            <Text style={styles.Text1}> Please select a date range</Text>
          </View>

          <View style={{ height: 30 }}></View>
          <DateRangeComp />
          <View style={{ height: 30 }}></View>
          <View style={styles.view3}>
            <View style={{ width: "48%", padding: 10 }}>
              <Button
                labelStyle={{ color: Colors.BLACK, textTransform: "none" }}
                mode="outlined"
                onPress={() => {}}
              >
                Cancel
              </Button>
            </View>
            <View style={{ width: "48%", padding: 10 }}>
              <Button
                labelStyle={{
                  color: Colors.WHITE,
                  textTransform: "none",
                }}
                contentStyle={{ backgroundColor: Colors.BLACK }}
                mode="contained"
                onPress={() => {}}
              >
                Submit
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export { DateModalComp };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
  },
  view1: {
    width: screenWidth - 60,
    backgroundColor: Colors.WHITE,
  },
  View2: {
    height: 50,
    backgroundColor: Colors.CORAL,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  Text1: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.WHITE,
  },
  view3: {
    flexDirection: "row",
    padding: 5,
    justifyContent: "space-between",
  },
  textinputComp: {
    height: 40,
    fontSize: 20,
    textAlign: "center",
    color: Colors.BLACK,
  },
});
