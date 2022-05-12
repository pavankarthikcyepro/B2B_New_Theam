import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet ,Button} from "react-native";
import { Colors } from "../../styles";

const ForgotScreen = ({navigation}) => {
  const passwordClicked = () => {
    navigation.navigate("CHANGE_PASSWORD_SCREEN");
    console.log('password reset')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button
        title={"CLICK HERE FOR FORGOT PASSWORD"}
        onPress={passwordClicked}
      />
    </SafeAreaView>
  );
};

export default ForgotScreen;

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.WHITE,
  },
  welcomeStyle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.RED,
    textAlign: "center",
    marginBottom: 40,
  },
  forgotView: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  forgotText: {
    paddingTop: 5,
    fontSize: 12,
    fontWeight: "400",
    color: Colors.DARK_GRAY,
    textAlign: "right",
  },
  bottomView: {
    // position: "absolute",
    bottom: 0,
    backgroundColor: Colors.LIGHT_GRAY,
    // paddingVertical: 20,
  },
  bottomVwSubVw: {
    paddingHorizontal: 30,
  },
  text1: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 15,
  },
  text2: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.DARK_GRAY,
  },
  closeStyle: {
    position: "absolute",
    marginTop: 10,
    right: 20,
  },
});

