import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Colors } from '../../../../styles';
import { DatePickerComponent, DropDownComponant, LoaderComponent } from '../../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { TextInputServices } from '../../../../components/textInputServices';
import { clearStateData, setDatePicker, setDropDownData, setInputInfo, updateSelectedDate } from '../../../../redux/rsaCrudReducer';
import { convertTimeStampToDateString } from '../../../../utils/helperFunctions';
import { DateSelectServices } from '../../../../pureComponents/dateSelectServices';
import { DropDownServices } from '../../../../pureComponents/dropDownServices';
import { TECHNICIAN_LIST } from '../../../../jsonData/addCustomerScreenJsonData';

const CreateRsa = ({ navigation, route }) => {
  const {
    vehicleRegNumber,
    isRefreshList,
    customerDetail,
    currentUserData,
    fromType,
    existingRsaData,
  } = route.params;
  let scrollRef = useRef(null);
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.rsaCrudReducer);

  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [isSubmitPress, setIsSubmitPress] = useState(false);

  useEffect(() => {
    if (fromType == "editRsa") {
      setExistingData();
    }
    return () => {
      dispatch(clearStateData());
      clearLocalData();
    };
  }, []);

  const setExistingData = () => {};

  const clearLocalData = () => {
    setDataForDropDown([]);
    setDropDownKey("");
    setDropDownTitle("Select Data");
    setShowDropDownModel(false);
    setIsSubmitPress(false);
  };

  useEffect(() => {
    if (selector.createRsaResponseStatus == "success") {
      showToastRedAlert("RSA Created Successfully");
      isRefreshList();
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    }
  }, [selector.createRsaResponseStatus]);

  const showDatePickerModelMethod = (key) => {
    Keyboard.dismiss();
    dispatch(setDatePicker(key));
  };

  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();
    switch (key) {
      case "TECHNICIAN":
        setDataForDropDown([...TECHNICIAN_LIST]);
        break;
      default:
        setDataForDropDown([]);
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  const onDropDownClear = (key) => {
    if (key) {
      dispatch(setDropDownData({ key: key, value: "", id: "" }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DatePickerComponent
        visible={selector.showDatepicker}
        mode={"date"}
        value={new Date(Date.now())}
        minimumDate={selector.minDate}
        maximumDate={selector.maxDate}
        onChange={(event, selectedDate) => {
          let formatDate = "";
          if (selectedDate) {
            formatDate = convertTimeStampToDateString(
              selectedDate,
              "YYYY/MM/DD"
            );
          }

          if (Platform.OS === "android") {
            if (selectedDate) {
              dispatch(
                updateSelectedDate({
                  key: selector.datePickerKey,
                  text: formatDate,
                })
              );
            }
          } else {
            dispatch(
              updateSelectedDate({
                key: selector.datePickerKey,
                text: formatDate,
              })
            );
          }
        }}
        onRequestClose={() => dispatch(setDatePicker())}
      />

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
            })
          );
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          keyboardShouldPersistTaps={"handled"}
          style={{ flex: 1 }}
          ref={scrollRef}
        >
          <TextInputServices
            value={selector.remarks}
            label={"Reason*"}
            autoCapitalize="words"
            onChangeText={(text) =>
              dispatch(
                setInputInfo({
                  key: "REASON",
                  text: text,
                })
              )
            }
            error={isSubmitPress && selector.remarks.trim() === ""}
          />
          <TextInputServices
            value={selector.remarks}
            label={"Remarks*"}
            autoCapitalize="words"
            onChangeText={(text) =>
              dispatch(
                setInputInfo({
                  key: "REMARKS",
                  text: text,
                })
              )
            }
            error={isSubmitPress && selector.remarks.trim() === ""}
          />
          <TextInputServices
            value={selector.amount}
            label={"Amount*"}
            autoCapitalize="words"
            keyboardType="number-pad"
            onChangeText={(text) =>
              dispatch(
                setInputInfo({
                  key: "AMOUNT",
                  text: text,
                })
              )
            }
            error={isSubmitPress && selector.amount.trim() === ""}
          />
          <DateSelectServices
            label={"Date*"}
            value={selector.rsaDate}
            onPress={() => showDatePickerModelMethod("RSA_DATE")}
            error={isSubmitPress && selector.rsaDate === ""}
          />
          <DropDownServices
            label={"Technician*"}
            value={selector.technician}
            onPress={() =>
              showDropDownModelMethod("TECHNICIAN", "Select Technician")
            }
            clearOption={true}
            clearKey={"TECHNICIAN"}
            onClear={onDropDownClear}
            error={isSubmitPress && selector.technician === ""}
          />
          <TextInputServices
            value={selector.address}
            label={"Address"}
            autoCapitalize="words"
            onChangeText={(text) =>
              dispatch(
                setInputInfo({
                  key: "ADDRESS",
                  text: text,
                })
              )
            }
          />
          <TextInputServices
            value={selector.area}
            label={"Area"}
            autoCapitalize="words"
            onChangeText={(text) =>
              dispatch(
                setInputInfo({
                  key: "AREA",
                  text: text,
                })
              )
            }
          />
          <TextInputServices
            value={selector.landmark}
            label={"Landmark"}
            autoCapitalize="words"
            onChangeText={(text) =>
              dispatch(
                setInputInfo({
                  key: "LANDMARK",
                  text: text,
                })
              )
            }
          />
          <TextInputServices
            value={selector.pincode}
            label={"Pincode*"}
            autoCapitalize="words"
            keyboardType="number-pad"
            onChangeText={(text) =>
              dispatch(
                setInputInfo({
                  key: "PINCODE",
                  text: text,
                })
              )
            }
          />

          {fromType == "createRsa" && (
            <View style={styles.buttonListRow}>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.btnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={() => submit("create")}
              >
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <LoaderComponent visible={selector.isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.WHITE,
  },
  buttonListRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 10,
  },
  btnContainer: {
    width: "40%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: Colors.PINK,
    height: 45,
  },
  btnText: {
    color: Colors.WHITE,
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default CreateRsa;