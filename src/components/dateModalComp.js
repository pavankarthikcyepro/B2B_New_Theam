import React from "react";
import {
  View,
  Modal,
  StyleSheet,
  Text,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Platform
} from "react-native";
import { Colors } from "../styles";
import { Button } from "react-native-paper";
import { DateRangeComp } from "../components/dateRangeComp";

const screenWidth = Dimensions.get("window").width;

const DateModalComp = ({ visible = false, onRequestClose, submitCallback }) => {
  return (
    <Modal
      animationType={Platform.OS === "ios" ? 'slide' : 'fade'}
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.container}>
        <View style={styles.view1}>
          <View style={styles.view2}>
            <Text style={styles.text1}>Please select a date range</Text>
          </View>

          <View
            style={{
              paddingHorizontal: 15,
              height: 200,
              justifyContent: "center",
            }}
          >
            <DateRangeComp />
          </View>
          <View style={styles.view3}>
            <View style={{ width: "48%" }}>
              <Button
                labelStyle={{ color: Colors.BLACK, textTransform: "none" }}
                mode="outlined"
                onPress={onRequestClose}
              >
                Cancel
              </Button>
            </View>
            <View style={{ width: "48%" }}>
              <Button
                labelStyle={{
                  color: Colors.WHITE,
                  textTransform: "none",
                }}
                contentStyle={{ backgroundColor: Colors.BLACK }}
                mode="contained"
                onPress={submitCallback}
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
    width: screenWidth - 40,
    backgroundColor: Colors.WHITE,
  },
  view2: {
    height: 50,
    paddingLeft: 10,
    backgroundColor: Colors.CORAL,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  text1: {
    fontSize: 20,
    fontWeight: "500",
    color: Colors.WHITE,
  },
  view3: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginVertical: 30,
    justifyContent: "space-between",
  },
  textinputComp: {
    height: 40,
    fontSize: 20,
    textAlign: "center",
    color: Colors.BLACK,
  },
});
