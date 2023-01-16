import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import { Colors } from "../../styles";
import { SettingsScreenItem } from "../../pureComponents/settingScreenItem";
import * as AsyncStore from "../../asyncStore";
import BackgroundService from "react-native-background-actions";
import { setBranchId, setBranchName } from "../../utils/helperFunctions";
import { useDispatch, useSelector } from "react-redux";
import { clearState } from "../../redux/homeReducer";
import { clearEnqState } from "../../redux/enquiryReducer";
import { clearLeadDropState } from "../../redux/leaddropReducer";
import { AuthContext } from "../../utils/authContext";
import { callDeallocate } from "../../redux/settingReducer";
import { LoaderComponent } from "../../components";

const screenWidth = Dimensions.get("window").width;

const datalist = [
  {
    name: "Change Password",
  },
  {
    name: "Deallocate",
    isNoChildScreen: true
  },
];

const SettingsScreen = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.settingReducer);

  useEffect(() => {
    if (selector.deallocateResponseStatus == "success") {
      setTimeout(() => {
        successDeallocate();
      }, 500);
    }
  }, [selector.deallocateResponseStatus]);
  
  const onItemPress = async (name) => {
    if (name == "Change Password") {
      navigation.navigate("CHANGE_PASSWORD_SCREEN");
    } else if (name == "Deallocate") {
      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        dispatch(callDeallocate(jsonObj.empId));
      }
    }
  };

  const successDeallocate = () => {
    Alert.alert(
      `Successfully deallocated`,
      "",
      [
        {
          text: "OK",
          onPress: () => signOutPress(),
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  const signOutPress = async () => {
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

    setBranchId("");
    setBranchName("");
    dispatch(clearState());
    dispatch(clearEnqState());
    dispatch(clearLeadDropState());
    signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view2}>
        <FlatList
          data={datalist}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => {
            return <View style={styles.view1}></View>;
          }}
          renderItem={({ item, index }) => {
            return (
              <SettingsScreenItem
                name={item.name}
                isNoChildScreen={item.isNoChildScreen}
                onItemPress={onItemPress}
              />
            );
          }}
        />
      </View>
      <LoaderComponent visible={selector.loading} />
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
    paddingTop: 10,
  },
  view2: {
    flex: 1,
    padding: 10
  },
  list: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
  },
  view1: {
    height: 10,
    backgroundColor: Colors.LIGHT_GRAY,
  }
});
