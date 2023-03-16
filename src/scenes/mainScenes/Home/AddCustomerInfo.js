import React, { useEffect, useState } from 'react';
import { Keyboard, Text } from 'react-native';
import { View, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { DatePickerComponent, DropDownComponant, TextinputComp } from '../../../components';
import { Gender_Types, Salutation_Types } from '../../../jsonData/enquiryFormScreenJsonData';
import { DateSelectItem, DropDownSelectionItem } from '../../../pureComponents';
import { getCustomerTypesApi, getSourceTypesApi, setDatePicker, setDropDownData, setPersonalIntro, updateSelectedDate } from '../../../redux/customerInfoReducer';
import { Colors, GlobalStyle } from '../../../styles';
import * as AsyncStore from "../../../asyncStore";
import { showToast } from '../../../utils/toast';

const AddCustomerInfo = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.customerInfoReducer);

  const [openAccordion, setOpenAccordion] = useState(0);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [isSubmitPress, setIsSubmitPress] = useState(false);

  useEffect(() => {
    getCustomerType();
  }, [])
  
  const getCustomerType = async () => {
    let employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      dispatch(getCustomerTypesApi(jsonObj.orgId));
      dispatch(getSourceTypesApi(jsonObj.branchId));
    }
  };
  
  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();
    switch (key) {
      case "SALUTATION":
        setDataForDropDown([...Salutation_Types]);
        break;
      case "GENDER":
        setDataForDropDown([...Gender_Types]);
        break;
      case "RELATION":
        setDataForDropDown([...selector.relation_types_data]);
        break;
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
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  const updateAccordion = (selectedIndex) => {
    if (selectedIndex != openAccordion) {
      setOpenAccordion(selectedIndex);
    } else {
      setOpenAccordion(0);
    }
  };

  const onDropDownClear = (key) => {
    if (key) {
      dispatch(setDropDownData({ key: key, value: "", id: "" }));
    }
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
        mode={"date"}
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
        >
          <List.AccordionGroup
            expandedId={openAccordion}
            onAccordionPress={(expandedId) => updateAccordion(expandedId)}
          >
            <List.Accordion
              id={"1"}
              title={"Customer Info"}
              titleStyle={{
                color: openAccordion === "1" ? Colors.BLACK : Colors.BLACK,
                fontSize: 16,
                fontWeight: "600",
              }}
              style={[
                {
                  backgroundColor:
                    openAccordion === "1" ? Colors.RED : Colors.WHITE,
                },
                styles.accordionBorder,
              ]}
            >
              <DropDownSelectionItem
                label={"Salutation"}
                value={selector.salutation}
                onPress={() =>
                  showDropDownModelMethod("SALUTATION", "Select Salutation")
                }
                clearOption={true}
                clearKey={"SALUTATION"}
                onClear={onDropDownClear}
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.firstName}
                label={"First Name*"}
                autoCapitalize="words"
                keyboardType={"default"}
                // editable={false}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "FIRST_NAME", text: text }))
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.firstName === ""
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
                // editable={false}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "LAST_NAME", text: text }))
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.lastName === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <DropDownSelectionItem
                label={"Gender*"}
                value={selector.gender}
                onPress={() => showDropDownModelMethod("GENDER", "Gender")}
              />

              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.gender === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <DropDownSelectionItem
                label={"Relation"}
                value={selector.relation}
                onPress={() => showDropDownModelMethod("RELATION", "Relation")}
                clearOption={true}
                clearKey={"RELATION"}
                onClear={onDropDownClear}
              />
              <DateSelectItem
                label={"Date Of Birth"}
                value={selector.dateOfBirth}
                onPress={() => dispatch(setDatePicker("DATE_OF_BIRTH"))}
              />
              <TextinputComp
                value={selector?.age?.toString()}
                label={"Age"}
                keyboardType={"phone-pad"}
                maxLength={5}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "AGE", text: text }))
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <DateSelectItem
                label={"Anniversary Date"}
                value={selector.anniversaryDate}
                onPress={() => dispatch(setDatePicker("ANNIVERSARY_DATE"))}
              />
              <Text style={GlobalStyle.underline}></Text>
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
                      isSubmitPress && selector.mobile === ""
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
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                value={selector.email}
                label={"Email ID"}
                keyboardType={"email-address"}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "EMAIL", text: text }))
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.occupation}
                autoCapitalize="words"
                label={"Occupation"}
                keyboardType={"default"}
                maxLength={40}
                onChangeText={(text) =>
                  dispatch(
                    setCustomerProfile({ key: "OCCUPATION", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
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
              <DropDownSelectionItem
                label={"Customer Type*"}
                value={selector.customerTypes}
                onPress={() =>
                  showDropDownModelMethod(
                    "CUSTOMER_TYPE",
                    "Select Customer Type"
                  )
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.customerTypes === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
            </List.Accordion>
            <View style={styles.space} />
            <List.Accordion
              id={"2"}
              title={"Customer Address"}
              titleStyle={{
                color: openAccordion === "2" ? Colors.BLACK : Colors.BLACK,
                fontSize: 16,
                fontWeight: "600",
              }}
              style={[
                {
                  backgroundColor:
                    openAccordion === "2" ? Colors.RED : Colors.WHITE,
                },
                styles.accordionBorder,
              ]}
            ></List.Accordion>
          </List.AccordionGroup>
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
  accordionBorder: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "#7a7b7d",
  },
  space: {
    height: 5,
  },
});

export default AddCustomerInfo;