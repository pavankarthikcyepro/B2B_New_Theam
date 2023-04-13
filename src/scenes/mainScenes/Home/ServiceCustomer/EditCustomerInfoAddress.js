import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from "react-native";
import { DatePickerComponent, DropDownComponant, TextinputComp } from '../../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { PincodeDetailsNew } from '../../../../utils/helperFunctions';
import { clearStateData, getCustomerTypesApi, getSourceTypesApi, setCommunicationAddress, setDatePicker, setDropDownData, setPersonalIntro, updateAddressByPincode, updateSelectedDate } from '../../../../redux/editCustomerInfoReducer';
import { Colors, GlobalStyle } from '../../../../styles';
import { Dropdown } from 'react-native-element-dropdown';
import { Button, IconButton } from 'react-native-paper';
import { DateSelectItem, DropDownSelectionItem, RadioTextItem } from '../../../../pureComponents';
import * as AsyncStore from "../../../../asyncStore";

const EditCustomerInfoAddress = ({ navigation, route }) => {
  const { editType } = route.params;
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const selector = useSelector((state) => state.editCustomerInfoReducer);

  const [userData, setUserData] = useState("");
  const [addressData, setAddressData] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [title, setTitle] = useState("Edit Customer Info");
  const [isSubmitPress, setIsSubmitPress] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState("date");
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [showDropDownModel, setShowDropDownModel] = useState(false);

  useEffect(() => {
    getCustomerType();
    if (editType && editType == "profile") {
      setTitle("Edit Customer Info");
    } else {
      setTitle("Edit Customer Address");
    }
    return () => {
      clearLocalData();
      dispatch(clearStateData());
    };
  }, []);

  const getCustomerType = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData(jsonObj);
      dispatch(getCustomerTypesApi(jsonObj.orgId));
      dispatch(getSourceTypesApi(jsonObj.branchId));
    }
  };

  const clearLocalData = () => {
    setAddressData([]);
    setDefaultAddress(null);
    setDropDownKey("");
    setDropDownTitle("Select Data");
    setShowDropDownModel(false);
    setDataForDropDown([]);
    setIsSubmitPress(false);
    setDatePickerMode("date");
  };

  const updateAddressDetails = (pincode) => {
    if (pincode.length != 6) {
      return;
    }
    PincodeDetailsNew(pincode).then(
      (res) => {
        let tempAddr = [];
        if (res) {
          if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              tempAddr.push({ label: res[i].Name, value: res[i] });
              if (i === res.length - 1) {
                setAddressData([...tempAddr]);
              }
            }
          }
        }
      },
      (rejected) => {}
    );
  };

  const showDatePickerModelMethod = (key, mode = "date") => {
    Keyboard.dismiss();
    setDatePickerMode(mode);
    dispatch(setDatePicker(key));
  };

  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();
    switch (key) {
      case "CUSTOMER_TYPE":
        if (selector.customerTypesResponse?.length === 0) {
          showToast("No Customer Types found");
          return;
        }
        let cData = selector.customerTypesResponse;
        let cNewData = cData?.map((val) => {
          return {
            ...val,
            name: val?.customer_type,
          };
        });
        setDataForDropDown([...cNewData]);
        break;
      case "SOURCE_TYPE":
        if (selector.sourceTypesResponse?.length === 0) {
          showToast("No Source Types found");
          return;
        }
        setDataForDropDown([...selector.sourceTypesResponse]);
        break;
      case "SUB_SOURCE_TYPE":
        let flag = 0;
        if (selector.sourceType != "") {
          for (let i = 0; i < selector.sourceTypesResponse.length; i++) {
            const element = selector.sourceTypesResponse[i];
            if (
              element.name == selector.sourceType &&
              element?.subtypeMap?.length > 0
            ) {
              flag = 1;
              dispatch(
                setPersonalIntro({
                  key: "SUB_SOURCE_RES",
                  text: element.subtypeMap,
                })
              );
              setDataForDropDown([...element.subtypeMap]);
              break;
            }
          }
        }
        if (flag == 0) {
          setDataForDropDown([]);
          break;
        }
        break;
      default:
        setDataForDropDown([]);
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

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

      <DatePickerComponent
        visible={selector.showDatepicker}
        mode={datePickerMode}
        value={new Date(Date.now())}
        minimumDate={selector.minDate}
        maximumDate={selector.maxDate}
        onChange={(event, selectedDate) => {
          if (Platform.OS === "android") {
            if (!selectedDate) {
              dispatch(updateSelectedDate({ key: "NONE", text: selectedDate }));
            } else {
              dispatch(updateSelectedDate({ key: "", text: selectedDate }));
            }
          } else {
            dispatch(updateSelectedDate({ key: "", text: selectedDate }));
          }
        }}
        onRequestClose={() => dispatch(setDatePicker())}
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
          <Text style={styles.titleText}>{title}</Text>

          {editType == "profile" ? (
            <>
              <TextinputComp
                value={selector.firstName}
                label={"First Name*"}
                autoCapitalize="words"
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "FIRST_NAME", text: text }))
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.firstName.trim() === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <TextinputComp
                value={selector.lastName}
                label={"Last Name*"}
                autoCapitalize="words"
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "LAST_NAME", text: text }))
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.lastName.trim() === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <TextinputComp
                value={selector.mobile}
                label={"Mobile Number*"}
                maxLength={10}
                keyboardType={"phone-pad"}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "MOBILE", text: text }))
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.mobile.trim() === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <TextinputComp
                value={selector.alterMobile}
                label={"Alternate Mobile Number"}
                keyboardType={"phone-pad"}
                maxLength={10}
                onChangeText={(text) =>
                  dispatch(
                    setPersonalIntro({ key: "ALTER_MOBILE", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.email}
                label={"Email ID"}
                keyboardType={"email-address"}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "EMAIL", text: text }))
                }
              />
              <Text style={GlobalStyle.underline} />
              <DateSelectItem
                label={"Date Of Birth"}
                value={selector.dateOfBirth}
                onPress={() => showDatePickerModelMethod("DATE_OF_BIRTH")}
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector?.age?.toString()}
                label={"Age"}
                keyboardType={"number-pad"}
                maxLength={2}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "AGE", text: text }))
                }
              />
              <Text style={GlobalStyle.underline} />
              <DateSelectItem
                label={"Anniversary Date"}
                value={selector.anniversaryDate}
                onPress={() => showDatePickerModelMethod("ANNIVERSARY_DATE")}
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.occupation}
                autoCapitalize="words"
                label={"Occupation"}
                keyboardType={"default"}
                maxLength={40}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "OCCUPATION", text: text }))
                }
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Customer Type"}
                value={selector.customerTypes}
                onPress={() =>
                  showDropDownModelMethod(
                    "CUSTOMER_TYPE",
                    "Select Customer Type"
                  )
                }
              />
              <DropDownSelectionItem
                label={"Source Type*"}
                value={selector.sourceType}
                onPress={() =>
                  showDropDownModelMethod("SOURCE_TYPE", "Select Source Type")
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.sourceType === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <DropDownSelectionItem
                label={"Sub Source Type*"}
                value={selector.subSourceType}
                onPress={() =>
                  showDropDownModelMethod(
                    "SUB_SOURCE_TYPE",
                    "Select Sub Source Type"
                  )
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.subSourceType === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <View style={[styles.buttonRow]}>
                <Button
                  mode="contained"
                  style={{ width: "30%" }}
                  color={Colors.GRAY}
                  labelStyle={{ textTransform: "none", color: Colors.WHITE }}
                  onPress={() => navigation.goBack()}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  style={{ width: "30%" }}
                  color={Colors.PINK}
                  labelStyle={{ textTransform: "none", color: Colors.WHITE }}
                  onPress={() => navigation.goBack()}
                >
                  Save
                </Button>
              </View>
            </>
          ) : (
            <>
              <TextinputComp
                value={selector.pincode}
                label={"Pincode"}
                maxLength={6}
                keyboardType={"number-pad"}
                onChangeText={(text) => {
                  if (text.length === 6) {
                    updateAddressDetails(text);
                  }
                  dispatch(
                    setCommunicationAddress({ key: "PINCODE", text: text })
                  );
                  setDefaultAddress(null);
                }}
              />
              {addressData.length > 0 && (
                <>
                  <Text style={GlobalStyle.underline}></Text>
                  <View style={styles.addressDropDownRow}>
                    <Dropdown
                      style={[styles.dropdownContainer]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={addressData}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={"Select address"}
                      searchPlaceholder="Search..."
                      value={defaultAddress}
                      onChange={(val) => {
                        dispatch(updateAddressByPincode(val.value));
                      }}
                    />

                    {selector.isAddressSet ? (
                      <IconButton
                        onPress={() => {
                          let tmp = addressData;
                          setAddressData([]);
                          setAddressData([...tmp]);
                          dispatch(updateAddressByPincode(""));
                        }}
                        icon="close-circle-outline"
                        color={Colors.BLACK}
                        size={20}
                        style={styles.addressClear}
                      />
                    ) : null}
                  </View>
                </>
              )}
              <Text style={GlobalStyle.underline} />
              <View style={styles.radioGroupBcVw}>
                <RadioTextItem
                  label={"Urban"}
                  value={"urban"}
                  status={selector.urban_or_rural === 1 ? true : false}
                  onPress={() =>
                    dispatch(
                      setCommunicationAddress({
                        key: "RURAL_URBAN",
                        text: "1",
                      })
                    )
                  }
                />
                <RadioTextItem
                  label={"Rural"}
                  value={"rural"}
                  status={selector.urban_or_rural === 2 ? true : false}
                  onPress={() =>
                    dispatch(
                      setCommunicationAddress({
                        key: "RURAL_URBAN",
                        text: "2",
                      })
                    )
                  }
                />
              </View>
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.houseNum}
                label={"H.No"}
                maxLength={50}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({ key: "HOUSE_NO", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.streetName}
                label={"Street Name"}
                autoCapitalize="words"
                maxLength={120}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({
                      key: "STREET_NAME",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.village}
                label={"Village/Town"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({
                      key: "VILLAGE",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.mandal}
                label={"Mandal/Tahsil"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({
                      key: "MANDAL",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.city}
                label={"City"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(setCommunicationAddress({ key: "CITY", text: text }))
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.district}
                label={"District"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({
                      key: "DISTRICT",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.state}
                label={"State"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({
                      key: "STATE",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />

              <View style={styles.buttonRow}>
                <Button
                  mode="contained"
                  style={{ width: "30%" }}
                  color={Colors.GRAY}
                  labelStyle={{ textTransform: "none", color: Colors.WHITE }}
                  onPress={() => navigation.goBack()}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  style={{ width: "30%" }}
                  color={Colors.PINK}
                  labelStyle={{ textTransform: "none", color: Colors.WHITE }}
                  onPress={() => navigation.goBack()}
                >
                  Save
                </Button>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titleText: {
    fontSize: 14,
    color: Colors.DARK_GRAY,
    fontWeight: "bold",
    marginVertical: 10
  },
  dropdownContainer: {
    flex: 1,
    padding: 16,
    height: 50,
    borderRadius: 5,
  },
  addressDropDownRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  addressClear: {
    marginHorizontal: 0,
    paddingHorizontal: 5,
    borderLeftWidth: 1,
    borderRadius: 0,
    borderLeftColor: Colors.GRAY,
    alignSelf: "center",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  radioGroupBcVw: {
    flexDirection: "row",
    alignItems: "center",
    height: 65,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 20,
  },
});

export default EditCustomerInfoAddress;