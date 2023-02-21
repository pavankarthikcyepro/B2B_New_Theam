import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Colors } from "../../styles";
import { ButtonComp } from "../../components/buttonComp";
import { AuthNavigator } from "../../navigations";
import { useIsFocused } from "@react-navigation/native";
import Orientation from "react-native-orientation-locker";
import { getWidth } from "../../utils/helperFunctions";
import { useDispatch, useSelector } from "react-redux";
import { clearState, SetNewUpdateAvailable } from "../../redux/homeReducer";
import * as AsyncStore from "../../asyncStore";
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
} from "sp-react-native-in-app-updates";
import BackgroundService from "react-native-background-actions";
import { VersionString } from "../../forceUpdate";
import { AuthContext } from "../../utils/authContext";
import { myTaskClearState } from "../../redux/mytaskReducer";
import { notificationClearState } from "../../redux/notificationReducer";
import { clearEnqState } from "../../redux/enquiryReducer";
import { clearLeadDropState } from "../../redux/leaddropReducer";
import {
  saveFilterPayload,
  updateDealerFilterData,
  updateFilterSelectedData,
} from "../../redux/targetSettingsReducer";

const WelcomeScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const { signOut } = React.useContext(AuthContext);

  useEffect(() => {
    checkAppUpdate();
  }, []);

  const signOutClicked = async () => {
    AsyncStore.storeData(AsyncStore.Keys.USER_NAME, "");
    AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, "");
    AsyncStore.storeData(AsyncStore.Keys.EMP_ID, "");
    AsyncStore.storeData(AsyncStore.Keys.LOGIN_EMPLOYEE, "");
    AsyncStore.storeData(AsyncStore.Keys.EXTENSION_ID, "");
    AsyncStore.storeData(AsyncStore.Keys.EXTENSSION_PWD, "");
    AsyncStore.storeData(AsyncStore.Keys.IS_LOGIN, "false");
    AsyncStore.storeJsonData(AsyncStore.Keys.TODAYSDATE, new Date().getDate());
    AsyncStore.storeJsonData(AsyncStore.Keys.COORDINATES, []);
    await BackgroundService.stop();
    //realm.close();
    dispatch(clearState());
    dispatch(clearState());
    dispatch(myTaskClearState());
    dispatch(notificationClearState());
    dispatch(clearEnqState());
    dispatch(clearLeadDropState());
    dispatch(saveFilterPayload({}));
    dispatch(updateFilterSelectedData({}));
    dispatch(updateDealerFilterData({}));
    signOut();
  };

  const loginButtonClicked = () => {
    navigation.navigate(AuthNavigator.AuthStackIdentifiers.LOGIN);
  };

  const RegisterButtonClicked = () => {
    navigation.navigate(AuthNavigator.AuthStackIdentifiers.REGISTER);
  };

  const UpdateApp = () => {
    alert("Please Update to Latest Version");
  };

  const checkAppUpdate = async () => {
    try {
      const inAppUpdates = new SpInAppUpdates(
        false // isDebug
      );
      console.log("LLLL", VersionString);
      await inAppUpdates
        .checkNeedsUpdate({ curVersion: VersionString })
        .then(async (result) => {
          console.log("result", result);
          try {
            if (result.shouldUpdate) {
              const employeeData = await AsyncStore.getData(
                AsyncStore.Keys.LOGIN_EMPLOYEE
              );
              if (employeeData) {
                dispatch(SetNewUpdateAvailable(true));
                signOutClicked();
              } else {
                dispatch(SetNewUpdateAvailable(true));
              }
              let updateOptions: StartUpdateOptions = {};
              if (Platform.OS === "android") {
                updateOptions = {
                  updateType: IAUUpdateKind.IMMEDIATE,
                };
              } else if (Platform.OS === "ios") {
                var title = "New Version is Available";
                updateOptions = {
                  forceUpgrade: true,
                  title: title,
                  message: "Please Update to Latest Version",
                  buttonUpgradeText: "Update",
                };
              }

              inAppUpdates.startUpdate(updateOptions);
            } else {
              dispatch(SetNewUpdateAvailable(false));
            }
          } catch (e) {}
        })
        .catch((error) => {
          console.log("KOOOOOO", error);
        });
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: "100%",
          height: 300,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: getWidth(80), height: 80 }}
          resizeMode={"center"}
          source={require("../../assets/images/logo.png")}
        />
      </View>
      {/* <Image
                style={{ width: '100%', height: 300 }}
                resizeMode={'center'}
                source={require('../../assets/images/welcome.png')}
            /> */}
      {/* source={require('../../assets/images/logo.png')}
            /> */}
      <ButtonComp
        title={"LOG IN"}
        width={getWidth(100) - 40}
        onPress={selector.newUpdateAvailable ? UpdateApp : loginButtonClicked}
        color={Colors.PINK}
      />
      <View style={{ height: 10 }} />
      <ButtonComp
        title={"REGISTER"}
        width={getWidth(100) - 40}
        onPress={
          selector.newUpdateAvailable ? UpdateApp : RegisterButtonClicked
        }
        color={Colors.PINK}
      />
      <View style={styles.bottomViewStyle}>
        <Text style={styles.textOneStyle}>{"Important Notice"}</Text>
        <Text style={styles.textTwoStyle}>
          {
            "By using this app, you agree to the use of cookies and data processing technologies by us."
          }
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  bottomViewStyle: {
    position: "absolute",
    bottom: 0,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  textOneStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  textTwoStyle: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "400",
    color: Colors.DARK_GRAY,
  },
});
