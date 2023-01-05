import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { Colors } from "../styles";
import { IconButton, Checkbox, Button } from "react-native-paper";
import { RadioTextItem } from "../pureComponents";
import { Dropdown } from "react-native-element-dropdown";
import { TextinputComp } from "./textinputComp";
import * as AsyncStore from "../asyncStore";
import { client } from "../networking/client";
import URL, { reasonDropDown } from "../networking/endpoints";
import { createDateTime } from "../service";
import { useNavigation } from "@react-navigation/native";
import { AppNavigator } from "../navigations";
import moment from "moment";
import { monthNamesCap } from "../scenes/mainScenes/Attendance/AttendanceTop";

const screenWidth = Dimensions.get("window").width;

const LocalButtonComp = ({ title, onPress, disabled }) => {
  return (
    <Button
      style={{ width: 120, marginHorizontal: 20 }}
      mode="contained"
      color={Colors.RED}
      disabled={disabled}
      labelStyle={{ textTransform: "none" }}
      onPress={onPress}
    >
      {title}
    </Button>
  );
};

var startDate = createDateTime("8:30");
var midDate = createDateTime("12:00");
var endDate = createDateTime("16:00");
var endBetween = createDateTime("20:30");
var endDate2 = createDateTime("21:30");
var now = new Date();
var isBetween = startDate <= now && now <= midDate;
var isAfterNoon = midDate <= now && now <= endDate;
const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);

const AttendanceDetail = ({
  visible,
  onRequestClose,
  inVisible,
  showReason,
  reasonText,
  noteText,
  status,
  userName = "No Name",
}) => {
  const [present, setPresent] = useState(true);

  return (
    <Modal
      animationType={Platform.OS === "ios" ? "slide" : "fade"}
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.container}>
        <View style={styles.view1}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <Text style={styles.greetingText}>{"Hi, " + userName}</Text>
              {}
              <Text style={styles.greetingText}>
                {isBetween
                  ? "Good Morning,"
                  : isAfterNoon
                  ? "Good Afternoon,"
                  : "Good Evening,"}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <RadioTextItem
              label={status || "Present"}
              value={"Present"}
              disabled={false}
              status={present ? true : false}
              onPress={() => {
                setPresent(true);
              }}
            />
          </View>
          {showReason ||
            ((noteText || noteText) && (
              <>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <TextinputComp
                    disabled={true}
                    style={styles.textInputStyle}
                    label={"Reason"}
                    autoCapitalize="sentences"
                    value={reasonText}
                    maxLength={150}
                    onChangeText={(text) => {}}
                  />
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <TextinputComp
                    disabled={true}
                    style={styles.textInputStyle}
                    label={"Comments"}
                    autoCapitalize="sentences"
                    value={noteText}
                    maxLength={150}
                    onChangeText={(text) => {}}
                  />
                </View>
              </>
            ))}
          <View style={{ flexDirection: "row", marginTop: 10, width: "100%" }}>
            <LocalButtonComp
              title={"Close"}
              onPress={() => {
                inVisible();
              }}
              disabled={false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AttendanceDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  view1: {
    // width: screenWidth - 100,
    // height: 200,
    // width: 100,
    // height: 100,
    backgroundColor: Colors.WHITE,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    margin: 10,
  },
  text1: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
  dropdownContainer: {
    backgroundColor: "white",
    padding: 8,
    borderWidth: 1,
    width: "100%",
    height: 60,
    borderColor: Colors.GRAY,
    borderRadius: 5,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Colors.GRAY,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  textInputStyle: {
    height: 65,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 5,
  },
  errorText: {
    color: Colors.RED,
    fontSize: 15,
  },
  greetingText: {
    fontSize: 15,
    fontWeight: "400",
    color: Colors.DARK_GRAY,
  },
});
