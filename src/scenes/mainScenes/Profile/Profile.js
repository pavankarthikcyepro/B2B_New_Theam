import React from "react";
import { Image, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "react-native";
import { Button, ToggleButton } from "react-native-paper";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { RadioTextItem, RadioTextItemFromLeft } from "../../../pureComponents";
import { Colors } from "../../../styles";
import ProfileAddress from "./Components/ProfileAddress";
import ProfileInfo from "./Components/ProfileInfo";
const data = [
  {
    name: "Profile",
    value: "Profile",
  },
  {
    name: "Vehicle",
    value: "Vehicle",
  },
];

const profileInfo = [
  { label: "Name", value: "Navee Reddy" },
  { label: "Mobile Number", value: "+91 9865674354" },
  { label: "Alternate Mobile Number", value: "N/A" },
  { label: "Email", value: "N/A" },
  { label: "Age", value: "32" },
  { label: "DOB", value: "18-Nov-1989" },
  { label: "Anniversary Date", value: "N/A" },
];

const Options = [
  "Query",
  "RSA",
  "Booking List",
  "Warranty",
  "Insurance",
  "Services",
  "Vehicle Info",
];
const ProfileScreen = () => {
  const [value, setValue] = React.useState("Profile");
  const [info, setInfo] = React.useState(true);

  const ToggleButtonComp = (values, name) => {
    return (
      <ToggleButton
        icon={() => (
          <View style={styles.ToggleButton}>
            <FontAwesome5
              size={25}
              name={name == "Profile" ? "user" : "car"}
              color={value == values ? Colors.WHITE : Colors.GRAY}
            />
            <Text
              style={{
                ...styles.ToggleText,
                color: value == values ? Colors.WHITE : Colors.GRAY,
              }}
            >
              {name}
            </Text>
          </View>
        )}
        value={values}
        style={{
          width: "50%",
          backgroundColor: value == values ? Colors.RED : Colors.LIGHT_GRAY,
        }}
      />
    );
  };

  return (
    <ScrollView>
      <ToggleButton.Row
        onValueChange={(value) => setValue(value)}
        value={value}
        style={styles.ToggleView}
      >
        {data.map((e) => ToggleButtonComp(e.value, e.name))}
      </ToggleButton.Row>
      {value === "Profile" && (
        <View style={styles.RadioButtonView}>
          <RadioTextItemFromLeft
            label={"Customer Info"}
            value={"Customer Info"}
            disabled={false}
            status={info}
            onPress={() => {
              setInfo(true);
            }}
          />
          <RadioTextItemFromLeft
            label={"Customer Address"}
            value={"Customer Address"}
            disabled={false}
            status={!info}
            onPress={() => {
              setInfo(false);
            }}
          />
        </View>
      )}
      {value === "Profile" &&
        (info ? <ProfileInfo profileInfo={profileInfo} /> : <ProfileAddress />)}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            width: "10%",
            // height: 700,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "flex-start",
              backgroundColor: "pink",
              flex: 1,
              //   alignItems: "flex-start",
            }}
          >
            {Options.map((i) => {
              return (
                <View style={{ height: 150, flexDirection: "row" }}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ transform: [{ rotate: "-90deg" }] }}>
                      {i}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <View style={{ flexDirection: "column", flex: 1, width: "80%" }}></View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  ToggleButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ToggleText: {
    marginLeft: 10,
    fontWeight: "700",
    fontSize: 15,
  },
  ToggleView: {
    width: "60%",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 50,
  },
  labelTxt: {
    color: Colors.GRAY,
    fontWeight: "600",
  },
  valueTxt: {
    color: Colors.BLACK,
    fontWeight: "700",
  },
  ProfileImage: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginTop: 10,
    borderWidth: 5,
    borderRadius: 60,
    borderColor: Colors.LIGHT_GRAY2,
  },
  ProfileColumn: {
    flexDirection: "column",
    flex: 1,
    alignContent: "flex-start",
  },
  ProfileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    marginHorizontal: 35,
    marginTop: 25,
  },
  RadioButtonView: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 15,
  },
});
