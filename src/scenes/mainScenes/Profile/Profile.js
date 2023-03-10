import React from "react";
import { Image, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "react-native";
import { Button, ToggleButton } from "react-native-paper";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { RadioTextItem, RadioTextItemFromLeft } from "../../../pureComponents";
import { Colors } from "../../../styles";
import ProfileInfo from "./Components/ProfileInfo";

const ProfileScreen = () => {
  const [value, setValue] = React.useState("left");
  const [info, setInfo] = React.useState(true);

  const data = [
    {
      name: "Profile",
      value: "left",
    },
    {
      name: "Vehicle",
      value: "right",
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
      <ProfileInfo profileInfo={profileInfo} />
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
