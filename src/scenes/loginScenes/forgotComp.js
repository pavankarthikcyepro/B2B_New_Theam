import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { TextinputComp } from "../../components/textinputComp";
import { ButtonComp } from "../../components/buttonComp";
import { useSelector, useDispatch } from "react-redux";
import { Colors } from "../../styles";
import { AuthNavigator } from "../../navigations";
import {
  clearState,
  updateEmployeeId,
  updatePassword,
  updateNewPassword,
  updateConfirmPassword,
  updateSecurePassword,
updateSecureNewPassword,
updateSecureConfirmPassword,
  showErrorMessage,
  showNewPasswordErr,
  postUserData,
  getPreEnquiryData,
  getMenuList,
  getCustomerTypeList,
  getCarModalList,
} from "../../redux/forgotReducer";


const ScreenWidth = Dimensions.get("window").width;


const ForgotScreen = ({navigation}) => {

  const loginButtonClicked = () => {
    navigation.navigate(AuthNavigator.AuthStackIdentifiers.LOGIN);

    const employeeId = selector.employeeId;
    const password = selector.password;
    const newPassword = selector.newPassword;
    const confirmPassword = selector.confirmPassword;
    

    if (employeeId.length === 0) {
      let object = {
        key: "EMPLOYEEID",
        message: "Please enter employee id",
      };
      dispatch(showErrorMessage(object));
      return;
    }

    if (password.length === 0) {
      let object = {
        key: "PASSWORD",
        message: "Please enter password",
      };
      dispatch(showErrorMessage(object));
      return;
    }

    if(newPassword.length === 0) {
      let object = {
        key:"NEWPASSWORD",
        message:"please enter new password",
      };
         dispatch(showErrorMessage(object));
         return;
    }
    if (confirmPassword.length === 0) {
      let object = {
        key: "CONFIRMPASSWORD",
        message: "please enter new password",
      };
      dispatch(showErrorMessage(object));
      return;
    }

    let object = {
      "empname": employeeId,
      "password": password,
      "newpassword":newPassword,
      "confirmpassword":confirmPassword,
    }

    dispatch(postUserData(object));

  };

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
      <View style={{ height: 20 }}></View>
      <TextinputComp
        value={selector.newPassword}
        error={selector.showNewPasswordErr}
        errorMsg={selector.newPasswordErrMessage}
        label={"New Password"}
        mode={"outlined"}
        isSecure={selector.secureNewPassword}
        showRightIcon={true}
        rightIconObj={{
          name: selector.secureNewPassword ? "eye-off-outline" : "eye-outline",
          color: Colors.GRAY,
        }}
        onChangeText={(text) => dispatch(updateNewPassword(text))}
        onRightIconPressed={() => dispatch(updateSecureNewPassword())}
      />
      <View style={{ height: 20 }}></View>
      <TextinputComp
        value={selector.confirmPassword}
        error={selector.showConfirmPasswordErr}
        errorMsg={selector.confirmPasswordErrMessage}
        label={"Confirm Password"}
        mode={"outlined"}
        isSecure={selector.secureConfirmPassword}
        showRightIcon={true}
        rightIconObj={{
          name: selector.secureConfirmPassword ? "eye-off-outline" : "eye-outline",
          color: Colors.GRAY,
        }}
        onChangeText={(text) => dispatch(updateConfirmPassword(text))}
        onRightIconPressed={() => dispatch(updateSecureConfirmPassword())}
      />
      <View style={{ height: 20 }}></View>
      <View>
        <ButtonComp title={"LOG IN"} onPress={loginButtonClicked} />
      </View>
    </SafeAreaView>
  );
};

export default ForgotScreen;

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.WHITE,
    padding:20
  },
  
 

});

