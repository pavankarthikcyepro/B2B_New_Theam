import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Animated } from "react-native";
import { TextinputComp } from "../../components/textinputComp";
import { useSelector, useDispatch } from "react-redux";
import { Colors } from "../../styles";
import {
  clearState,
  updateEmployeeId,
  updatePassword,
  updateSecurePassword,
  showErrorMessage,
  postUserData,
  getPreEnquiryData,
  getMenuList,
  getCustomerTypeList,
  getCarModalList,
} from "../../redux/loginReducer";

const ForgotScreen = () => {
  const selector = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const fadeAnima = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={styles.container}>
      <TextinputComp
        value={selector.employeeId}
        error={selector.showLoginErr}
        errorMsg={selector.loginErrMessage}
        label={"Employee ID"}
        mode={"outlined"}
        onChangeText={(text) => dispatch(updateEmployeeId(text))}
      />
      <View style={{ height: 20 }}></View>
      <TextinputComp
        value={selector.password}
        error={selector.showPasswordErr}
        errorMsg={selector.passwordErrMessage}
        label={"Current Password"}
        mode={"outlined"}
        isSecure={selector.securePassword}
        showRightIcon={true}
        rightIconObj={{
          name: selector.securePassword ? "eye-off-outline" : "eye-outline",
          color: Colors.GRAY,
        }}
        onChangeText={(text) => dispatch(updatePassword(text))}
        onRightIconPressed={() => dispatch(updateSecurePassword())}
      />
      <TextinputComp
        value={selector.password}
        error={selector.showPasswordErr}
        errorMsg={selector.passwordErrMessage}
        label={"New Password"}
        mode={"outlined"}
        isSecure={selector.securePassword}
        showRightIcon={true}
        rightIconObj={{
          name: selector.securePassword ? "eye-off-outline" : "eye-outline",
          color: Colors.GRAY,
        }}
        onChangeText={(text) => dispatch(updatePassword(text))}
        onRightIconPressed={() => dispatch(updateSecurePassword())}
      />
      <TextinputComp
        value={selector.password}
        error={selector.showPasswordErr}
        errorMsg={selector.passwordErrMessage}
        label={"Confirm Password"}
        mode={"outlined"}
        isSecure={selector.securePassword}
        showRightIcon={true}
        rightIconObj={{
          name: selector.securePassword ? "eye-off-outline" : "eye-outline",
          color: Colors.GRAY,
        }}
        onChangeText={(text) => dispatch(updatePassword(text))}
        onRightIconPressed={() => dispatch(updateSecurePassword())}
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

