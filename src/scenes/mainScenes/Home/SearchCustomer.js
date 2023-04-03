import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { ButtonComp, DropDownComponant, LoaderComponent, TextinputComp } from '../../../components';
import { DropDownSelectionItem } from '../../../pureComponents';
import { Colors, GlobalStyle } from '../../../styles';
import * as AsyncStore from "../../../asyncStore";
import { useDispatch, useSelector } from 'react-redux';
import { clearStateData, getServiceTypesApi, searchCustomer, setDropDownData, setSearchInformation } from '../../../redux/searchCustomerReducer';
import { showToast } from '../../../utils/toast';

const SearchCustomer = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.searchCustomerReducer);

  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    getUserDetails();
    return () => {
      dispatch(clearStateData());
    }
  }, []);

  const getUserDetails = async () => {
    let employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData(jsonObj);
      dispatch(getServiceTypesApi(jsonObj.branchId));
    }
  };
  
  const showDropDownModelMethod = (key, headerText, oid) => {
    Keyboard.dismiss();
    switch (key) {
      case "SERVICE_TYPE":
        setDataForDropDown([...selector.serviceTypeResponse]);
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  const searchClick = () => {
    if (!selector.vehicleRegNo) {
      showToast("Please enter Vehicle Reg. No");
    };

    let payload = {
      tenantId: userData?.branchId,
      vehicleRegNo: selector.vehicleRegNo,
    };
    dispatch(searchCustomer(payload));
  };

  useEffect(() => {
    if (selector.searchResultResponseStatus == "success") {
      navigation.navigate("SEARCH_CUSTOMER_RESULT");
    }
  }, [selector.searchResultResponseStatus]);

  return (
    <SafeAreaView style={styles.container}>
      <DropDownComponant
        visible={showDropDownModel}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          setShowDropDownModel(false);
          dispatch(
            setDropDownData({
              key: dropDownKey,
              value: item.name,
              id: item.id,
            })
          );
        }}
      />

      <KeyboardAvoidingView style={styles.keyboardContainer}>
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.boxContainer}>
            <TextinputComp
              style={styles.textInputComp}
              label={"Vehicle Reg.No*"}
              value={selector.vehicleRegNo}
              onChangeText={(text) =>
                dispatch(
                  setSearchInformation({ key: "VEHICLE_REG_NO", text: text })
                )
              }
            />
            <Text style={GlobalStyle.underline} />
            <TextinputComp
              style={styles.textInputComp}
              label={"Contact No"}
              value={selector.contactNo}
              onChangeText={(text) =>
                dispatch(
                  setSearchInformation({ key: "CONTACT_NO", text: text })
                )
              }
            />
            <Text style={GlobalStyle.underline} />
            <TextinputComp
              style={styles.textInputComp}
              label={"Vin Number"}
              value={selector.vinNo}
              onChangeText={(text) =>
                dispatch(setSearchInformation({ key: "VIN_NO", text: text }))
              }
            />
            <Text style={GlobalStyle.underline} />
            <TextinputComp
              style={styles.textInputComp}
              label={"Customer Name"}
              value={selector.customerName}
              onChangeText={(text) =>
                dispatch(
                  setSearchInformation({ key: "CUSTOMER_NAME", text: text })
                )
              }
            />
            <Text style={GlobalStyle.underline} />
            <DropDownSelectionItem
              label={"Service Type"}
              value={selector.serviceType}
              onPress={() =>
                showDropDownModelMethod("SERVICE_TYPE", "Select Service Type")
              }
            />
            <TextinputComp
              style={styles.textInputComp}
              label={"Engine Number"}
              value={selector.engineNo}
              onChangeText={(text) =>
                dispatch(setSearchInformation({ key: "ENGINE_NO", text: text }))
              }
            />
            <Text style={GlobalStyle.underline} />
            <TextinputComp
              style={styles.textInputComp}
              label={"Policy Number"}
              value={selector.policyNo}
              onChangeText={(text) =>
                dispatch(setSearchInformation({ key: "POLICY_NO", text: text }))
              }
            />
            <Text style={GlobalStyle.underline} />
          </View>

          <View style={{ marginTop: 15 }}>
            <ButtonComp title={"Search"} onPress={() => searchClick()} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoaderComponent visible={selector.isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: { flex: 1, margin: 10 },
  boxContainer: { borderRadius: 6, backgroundColor: Colors.WHITE },
});

export default SearchCustomer;