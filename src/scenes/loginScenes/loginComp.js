import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  Image,
  Modal,
  KeyboardAvoidingView
} from "react-native";
import { Colors } from "../../styles";
import { TextinputComp } from "../../components/textinputComp";
import { ButtonComp } from "../../components/buttonComp";
import { useSelector, useDispatch } from "react-redux";
import {
  clearState,
  updateEmployeeId,
  updatePassword,
  updateSecurePassword,
  showErrorMessage,
  postUserData,
  showLoader,
  getPreEnquiryData,
  getMenuList,
  getCustomerTypeList,
  getCarModalList
} from "../../redux/loginReducer";
import { AuthNavigator } from "../../navigations";
import { IconButton } from "react-native-paper";
import { AuthContext } from "../../utils/authContext";
import { LoaderComponent } from '../../components';
import * as AsyncStore from '../../asyncStore';

const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;

const LoginScreen = ({ navigation }) => {

  const selector = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const fadeAnima = useRef(new Animated.Value(0)).current;
  const { signIn } = React.useContext(AuthContext);

  useEffect(() => {
    Animated.timing(fadeAnima, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {

    if (selector.status == "sucess") {
      //signIn(selector.authToken);
      dispatch(showLoader());
      AsyncStore.storeData(AsyncStore.Keys.USER_NAME, selector.userData.userName);
      AsyncStore.storeData(AsyncStore.Keys.ORG_ID, selector.userData.orgId);
      AsyncStore.storeData(AsyncStore.Keys.REFRESH_TOKEN, selector.userData.refreshToken);
      AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, selector.userData.idToken).then(() => {
        //dispatch(getMenuList(selector.userData.userName));
        // dispatch(getCustomerTypeList());
        // dispatch(getCarModalList(selector.userData.orgId))
        signIn(selector.authToken);
        dispatch(clearState());
      });
    }
  }, [selector.status])

  useEffect(() => {

    if (selector.offlineStatus == "completed") {
      setTimeout(() => {
        dispatch(showLoader());
        signIn(selector.authToken);
        dispatch(clearState());
      }, 3000);
    }
  }, [selector.offlineStatus])

  useEffect(() => {

    if (selector.menuListStatus == "completed") {
      getPreEnquiryListFromServer();
    }
  }, [selector.menuListStatus])

  const getPreEnquiryListFromServer = async () => {
    let endUrl = "?limit=10&offset=" + "0" + "&status=PREENQUIRY&empId=" + selector.empId;
    dispatch(getPreEnquiryData(endUrl))
  }

  const loginClicked = () => {

    const employeeId = selector.employeeId;
    const password = selector.password;

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

    // console.log("employeeId: ", employeeId);
    // console.log("password: ", password);

    let object = {
      "empname": employeeId,
      "password": password
    }

    dispatch(postUserData(object));
  };

  const forgotClicked = () => {
    navigation.navigate(AuthNavigator.AuthStackIdentifiers.FORGOT);
  };

  const closeBottomView = () => {
    console.log("clicked");
    Animated.timing(fadeAnima, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>

      <LoaderComponent
        visible={selector.showLoader}
        onRequestClose={() => { }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={100}
      >

        <View style={{ flexDirection: 'column', backgroundColor: Colors.LIGHT_GRAY }}>

          <View style={{ width: "100%", height: ScreenHeight * 0.3, alignItems: "center", justifyContent: 'center', }}>
            <Image
              style={{ width: 300, height: ScreenHeight * 0.4 }}
              resizeMode={"center"}
              source={require("../../assets/images/welcome.png")}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            position: "absolute",
            paddingHorizontal: 20,
            paddingTop: 30,
            marginTop: ScreenHeight * 0.22,
            backgroundColor: Colors.WHITE,
            borderTopEndRadius: 4,
          }}
        >
          <Text style={styles.welcomeStyle}>{"Welcome To Automate"}</Text>
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
            label={"Password"}
            mode={"outlined"}
            isSecure={selector.securePassword}
            showRightIcon={true}
            rightIconObj={{ name: selector.securePassword ? "eye-off-outline" : "eye-outline", color: Colors.GRAY }}
            onChangeText={(text) => dispatch(updatePassword(text))}
            onRightIconPressed={() => dispatch(updateSecurePassword())}
          />
          <View style={styles.forgotView}>
            <Pressable onPress={forgotClicked}>
              <Text style={styles.forgotText}>{"Forgot Password?"}</Text>
            </Pressable>
          </View>
          <View style={{ height: 40 }}></View>
          <ButtonComp
            title={"LOG IN"}
            width={ScreenWidth - 40}
            onPress={loginClicked}
            disabled={selector.isLoading ? true : false}
          />
          <View style={{ width: "100%", height: 50, justifyContent: "center", alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: "400", color: Colors.GRAY }}>{"Version: 0.3"}</Text>
          </View>

          {/* Bottom Popup */}
          <Animated.View style={[styles.bottomView, { opacity: fadeAnima }]}>
            <View style={styles.bottomVwSubVw}>
              <Text style={styles.text1}>{"User’s Profile"}</Text>
              <Text style={styles.text2}>
                {
                  "Thanks to user’s profile your vehicles, service books and massages will be stored safely in a cloud, so you do not have to worry about that anymore."
                }
              </Text>
            </View>
            <IconButton
              style={styles.closeStyle}
              icon="close"
              color={Colors.DARK_GRAY}
              size={20}
              onPress={closeBottomView}
            />
          </Animated.View>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

export default LoginScreen;

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
