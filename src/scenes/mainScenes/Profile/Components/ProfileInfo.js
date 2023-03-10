import React from "react";
import { Image, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "react-native";
import { Button, ToggleButton } from "react-native-paper";
import { Colors } from "../../../../styles";

const ProfileInfo = ({ profileInfo }) => {
  return (
    <>
      <View style={styles.ProfileContainer}>
        <View style={{ flexDirection: "column" }}>
          {profileInfo.map((i, index) => (
            <View style={{ marginVertical: 10 }}>
              <Text
                numberOfLines={2}
                style={{ ...styles.labelTxt, fontSize: index === 0 ? 20 : 15 }}
              >
                {i.label}
              </Text>
              <Text
                numberOfLines={2}
                style={{ ...styles.valueTxt, fontSize: index === 0 ? 22 : 17 }}
              >
                {i.value}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.ProfileColumn}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.ProfileImage}
            resizeMode={"contain"}
          />
        </View>
      </View>
      <Button
        mode="contained"
        style={{ width: "85%", alignSelf: "center", marginTop: 15 }}
        color={Colors.RED}
      >
        {"Edit Profile"}
      </Button>
    </>
  );
};

export default ProfileInfo;

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
