import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import { Provider, Checkbox, IconButton } from "react-native-paper";
import { Colors, GlobalStyle } from "../../../styles";
import VectorImage from "react-native-vector-image";
import {
  MODEL_SELECTION,
  COMMUNICATION_DETAILS,
  CUSTOMER_PROFILE,
  FINANCE_DETAILS,
  DOCUMENT_UPLOAD,
  CUSTOMER_NEED_ANALYSIS,
  PERSONAL_DETAILS,
} from "../../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import {
  TextinputComp,
  DropDownComponant,
  DatePickerComponent,
} from "../../../components";
import { DropDownSelectionItem } from "../../../pureComponents/dropDownSelectionItem";
import {
  setEditable,
  setDatePicker,
  setDropDown,
  setPersonalIntro,
  setCommunicationAddress,
  setCustomerProfile,
  updateSelectedDropDownData,
  updateSelectedDate,
  setModelDropDown,
  setFinancialDropDown,
  setFinancialDetails,
  setCustomerNeedAnalysis,
  setCustomerNeedDropDown,
  setImagePicker,
  setUploadDocuments
} from '../../../redux/enquiryFormReducer';
import { RadioTextItem, CustomerAccordianHeaderItem, ImageSelectItem } from '../../../pureComponents';
import { ImagePickerComponent } from "../../../components";

const DetailsOverviewScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const selector = useSelector((state) => state.enquiryFormReducer);
  const [openAccordian, setOpenAccordian] = useState(0);

  const updateAccordian = (index) => {
    if (index != openAccordian) {
      setOpenAccordian(index);
    } else {
      setOpenAccordian(0);
    }
  };

  return (

    <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>

      <ImagePickerComponent
        visible={selector.showImagePicker}
        keyId={selector.imagePickerKeyId}
        selectedImage={(data, keyId) => {
          console.log('imageObj: ', data, keyId);
        }}
        onDismiss={() => dispatch(setImagePicker(""))}
      />

      {
        selector.showDropDownpicker && <DropDownComponant
          visible={selector.showDropDownpicker}
          headerTitle={selector.dropDownTitle}
          data={selector.dropDownData}
          keyId={selector.dropDownKeyId}
          selectedItems={(item, keyId) => {
            console.log("selected: ", item, keyId);
            dispatch(updateSelectedDropDownData({ id: item.id, name: item.name, keyId: keyId }))
          }}
        />
      }

      {
        selector.showDatepicker && <DatePickerComponent
          visible={selector.showDatepicker}
          mode={'date'}
          value={new Date(Date.now())}
          onChange={(event, selectedDate) => {
            console.log('date: ', selectedDate)
            if (Platform.OS === "android") {
              // setDatePickerVisible(false)
            }
            dispatch(updateSelectedDate({ key: "", text: selectedDate }));
          }}
          onRequestClose={() => dispatch(setDatePicker())}
        />
      }

      <View style={styles.view1}>
        <Text style={styles.titleText}>{"Details Overview"}</Text>
        <IconButton
          icon={selector.enableEdit ? "account-edit" : "account-edit-outline"}
          color={Colors.DARK_GRAY}
          size={30}
          style={{ paddingRight: 0 }}
          onPress={() => dispatch(setEditable())}
        />
      </View>

      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          keyboardShouldPersistTaps={'handled'}
          style={{ flex: 1 }}
        >
          <View style={styles.baseVw}>
            {/* // Personal Intro */}
            <View style={[styles.accordianBckVw, GlobalStyle.shadow]}>
              <CustomerAccordianHeaderItem
                title={"Personal Intro"}
                leftIcon={"account-edit"}
                selected={openAccordian == 1 ? true : false}
                onPress={() => updateAccordian(1)}
              />
              <View
                style={{
                  width: "100%",
                  height: openAccordian == 1 ? null : 0,
                  overflow: "hidden",
                }}
              >
                <DropDownSelectionItem
                  label={"Salutation*"}
                  value={selector.salutaion}
                  onPress={() => dispatch(setDropDown("SALUTATION"))}
                />
                <DropDownSelectionItem
                  label={"Gender*"}
                  value={selector.gender}
                  onPress={() => dispatch(setDropDown("GENDER"))}
                />
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.firstName}
                  label={"First Name*"}
                  onChangeText={(text) =>
                    dispatch(setPersonalIntro({ key: "FIRST_NAME", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.lastName}
                  label={"Last Name*"}
                  onChangeText={(text) =>
                    dispatch(setPersonalIntro({ key: "LAST_NAME", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>

                <DropDownSelectionItem
                  label={"Relation*"}
                  value={selector.relation}
                  onPress={() => dispatch(setDropDown("RELATION"))}
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.relationName}
                  label={"Relation Name*"}
                  onChangeText={(text) =>
                    dispatch(
                      setPersonalIntro({ key: "RELATION_NAME", text: text })
                    )
                  }
                />
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.mobile}
                  label={"Mobile Number*"}
                  onChangeText={(text) =>
                    dispatch(setPersonalIntro({ key: "MOBILE", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.alterMobile}
                  label={"Alternate Mobile Number*"}
                  onChangeText={(text) =>
                    dispatch(
                      setPersonalIntro({ key: "ALTER_MOBILE", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.email}
                  label={"Email ID*"}
                  onChangeText={(text) =>
                    dispatch(setPersonalIntro({ key: "EMAIL", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>

                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.dateOfBirth}
                  label={"Date Of Birth"}
                  disabled={true}
                  onPressIn={() => dispatch(setDatePicker("DATE_OF_BIRTH"))}
                  showRightIcon={true}
                  rightIconObj={{
                    name: "calendar-range",
                    color: Colors.GRAY,
                  }}
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.anniversaryDate}
                  label={"Anniversary Date"}
                  disabled={true}
                  onPressIn={() => dispatch(setDatePicker("ANNIVERSARY_DATE"))}
                  showRightIcon={true}
                  rightIconObj={{
                    name: "calendar-range",
                    color: Colors.GRAY,
                  }}
                />
                <Text style={GlobalStyle.underline}></Text>
              </View>
            </View>
            <View style={styles.space}></View>

            {/* // 2.Communication Address */}
            <View style={[styles.accordianBckVw, GlobalStyle.shadow]}>
              <CustomerAccordianHeaderItem
                title={"Communicaton Address"}
                leftIcon={"account-edit"}
                selected={openAccordian == 2 ? true : false}
                onPress={() => updateAccordian(2)}
              />
              <View style={{ width: "100%", height: openAccordian == 2 ? null : 0, overflow: "hidden" }}>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.pincode}
                  label={"Pincode*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "PINCODE", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
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
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.houseNum}
                  label={"H.No*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "HOUSE_NO", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.streetName}
                  label={"Street Name*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({
                        key: "STREET_NAME",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.village}
                  label={"Village*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "VILLAGE", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.city}
                  label={"City*"}
                  onChangeText={(text) =>
                    dispatch(setCommunicationAddress({ key: "CITY", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.district}
                  label={"District*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "DISTRICT", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.state}
                  label={"State*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "STATE", text: text })
                    )
                  }
                />

                {/* // Permanent Addresss */}
                <View style={styles.radioGroupBcVw}>
                  <Text style={styles.permanentAddText}>
                    {"Permanent Address"}
                  </Text>
                  <Checkbox.Android
                    uncheckedColor={Colors.GRAY}
                    color={Colors.RED}
                    status={selector.permanent_address ? "checked" : "unchecked"}
                    onPress={() =>
                      dispatch(
                        setCommunicationAddress({
                          key: "PERMANENT_ADDRESS",
                          text: "",
                        })
                      )
                    }
                  />
                </View>

                {selector.permanent_address && (
                  <View>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.p_pincode}
                      label={"Pincode*"}
                      onChangeText={(text) =>
                        dispatch(
                          setCommunicationAddress({
                            key: "P_PINCODE",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <View style={styles.radioGroupBcVw}>
                      <RadioTextItem
                        label={"Urban"}
                        value={"urban"}
                        status={selector.p_urban_or_rural === 1 ? true : false}
                        onPress={() =>
                          dispatch(
                            setCommunicationAddress({
                              key: "P_RURAL_URBAN",
                              text: "1",
                            })
                          )
                        }
                      />
                      <RadioTextItem
                        label={"Rural"}
                        value={"rural"}
                        status={selector.p_urban_or_rural === 2 ? true : false}
                        onPress={() =>
                          dispatch(
                            setCommunicationAddress({
                              key: "P_RURAL_URBAN",
                              text: "2",
                            })
                          )
                        }
                      />
                    </View>
                    <Text style={GlobalStyle.underline}></Text>

                    <TextinputComp
                      style={styles.textInputStyle}
                      label={"H.No*"}
                      value={selector.p_houseNum}
                      onChangeText={(text) =>
                        dispatch(
                          setCommunicationAddress({
                            key: "P_HOUSE_NO",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={styles.textInputStyle}
                      label={"Street Name*"}
                      value={selector.p_streetName}
                      onChangeText={(text) =>
                        dispatch(
                          setCommunicationAddress({
                            key: "P_STREET_NAME",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.p_village}
                      label={"Village*"}
                      onChangeText={(text) =>
                        dispatch(
                          setCommunicationAddress({
                            key: "P_VILLAGE",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.p_city}
                      label={"City*"}
                      onChangeText={(text) =>
                        dispatch(
                          setCommunicationAddress({ key: "P_CITY", text: text })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.p_district}
                      label={"District*"}
                      onChangeText={(text) =>
                        dispatch(
                          setCommunicationAddress({
                            key: "P_DISTRICT",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.p_state}
                      label={"State*"}
                      onChangeText={(text) =>
                        dispatch(
                          setCommunicationAddress({
                            key: "P_STATE",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.space}></View>

            {/* // 3.Modal Selction */}
            <View style={[styles.accordianBckVw], GlobalStyle.shadow}>
              <CustomerAccordianHeaderItem
                title={"Modal Selection"}
                leftIcon={"account-edit"}
                selected={openAccordian == 3 ? true : false}
                onPress={() => updateAccordian(3)}
              />
              <View style={{ width: "100%", height: openAccordian == 3 ? null : 0, overflow: 'hidden' }}>
                <DropDownSelectionItem
                  label={"Model*"}
                  value={selector.model}
                  onPress={() => dispatch(setModelDropDown("MODEL"))}
                />
                <DropDownSelectionItem
                  label={"Varient*"}
                  value={selector.varient}
                  onPress={() => dispatch(setModelDropDown("VARIENT"))}
                />
                <DropDownSelectionItem
                  label={"Color*"}
                  value={selector.color}
                  onPress={() => dispatch(setModelDropDown("COLOR"))}
                />
                <DropDownSelectionItem
                  label={"Fuel Type*"}
                  value={selector.fuel_type}
                  onPress={() => dispatch(setModelDropDown("FUEL_TYPE"))}
                />
                <DropDownSelectionItem
                  label={"Transmission Type*"}
                  value={selector.transmission_type}
                  onPress={() => dispatch(setModelDropDown("TRANSMISSION_TYPE"))}
                />
              </View>
            </View>
            <View style={styles.space}></View>

            {/* // 4.Customer Profile */}
            <View style={[styles.accordianBckVw], GlobalStyle.shadow}>
              <CustomerAccordianHeaderItem
                title={"Customer Profile"}
                leftIcon={"account-edit"}
                selected={openAccordian == 4 ? true : false}
                onPress={() => updateAccordian(4)}
              />
              <View style={{ width: "100%", height: openAccordian == 4 ? null : 0, overflow: 'hidden' }}>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.occupation}
                  label={"Occupation*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerProfile({ key: "OCCUPATION", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.designation}
                  label={"Designation*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerProfile({ key: "DESIGNATION", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>

                <DropDownSelectionItem
                  label={"Enquiry Segment*"}
                  value={selector.enquiry_segment}
                  onPress={() => dispatch(setDropDown("ENQUIRY_SEGMENT"))}
                />
                <DropDownSelectionItem
                  label={"Customer Type*"}
                  value={selector.customer_type}
                  onPress={() => dispatch(setDropDown("CUSTOMER_TYPE"))}
                />
                <DropDownSelectionItem
                  label={"Source Of Enquiry*"}
                  value={selector.source_of_enquiry}
                  onPress={() => dispatch(setDropDown("SOURCE_OF_ENQUIRY"))}
                />
                <TextinputComp
                  style={styles.textInputStyle}
                  label={"Expected Date"}
                  value={selector.expected_date}
                  disabled={true}
                  onPressIn={() => dispatch(setDatePicker("EXPECTED_DATE"))}
                  showRightIcon={true}
                  rightIconObj={{
                    name: "calendar-range",
                    color: Colors.GRAY,
                  }}
                />
                <Text style={GlobalStyle.underline}></Text>
                <DropDownSelectionItem
                  label={"Enquiry Category*"}
                  value={selector.enquiry_category}
                  onPress={() => dispatch(setDropDown("ENQUIRY_CATEGORY"))}
                />
                <DropDownSelectionItem
                  label={"Buyer Type*"}
                  value={selector.buyer_type}
                  onPress={() => dispatch(setDropDown("BUYER_TYPE"))}
                />
                <DropDownSelectionItem
                  label={"KMs Travelled in Month*"}
                  value={selector.kms_travelled_month}
                  onPress={() => dispatch(setDropDown("KMS_TRAVELLED"))}
                />
                <DropDownSelectionItem
                  label={"Who Drives*"}
                  value={selector.who_drives}
                  onPress={() => dispatch(setDropDown("WHO_DRIVES"))}
                />
                <DropDownSelectionItem
                  label={"Members*"}
                  value={selector.members}
                  onPress={() => dispatch(setDropDown("MEMBERS"))}
                />
                <DropDownSelectionItem
                  label={"What is prime expectation from the car*"}
                  value={selector.prime_expectation_from_car}
                  onPress={() => dispatch(setDropDown("PRIME_EXPECTATION_CAR"))}
                />
              </View>
            </View>
            <View style={styles.space}></View>

            {/* // 5.Financial Details */}
            <View style={[styles.accordianBckVw], GlobalStyle.shadow}>
              <CustomerAccordianHeaderItem
                title={"Financial Details"}
                leftIcon={"account-edit"}
                selected={openAccordian == 5 ? true : false}
                onPress={() => updateAccordian(5)}
              />
              <View
                style={{
                  width: "100%",
                  height: openAccordian == 5 ? null : 0,
                  overflow: 'hidden'
                }}
              >
                <DropDownSelectionItem
                  label={"Retail Finance*"}
                  value={selector.retail_finance}
                  onPress={() => dispatch(setFinancialDropDown("RETAIL_FINANCE"))}
                />
                <DropDownSelectionItem
                  label={"Finance Category*"}
                  value={selector.finance_category}
                  onPress={() => dispatch(setFinancialDropDown("FINANCE_CATEGORY"))}
                />
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"Down Payment*"}
                  value={selector.down_payment}
                  onChangeText={(text) => dispatch(setFinancialDetails({ key: "DOWN_PAYMENT", text: text }))}
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"Loan Amount*"}
                  value={selector.loan_amount}
                  onChangeText={(text) => dispatch(setFinancialDetails({ key: "LOAN_AMOUNT", text: text }))}
                />
                <Text style={GlobalStyle.underline}></Text>
                <DropDownSelectionItem
                  label={"Bank/Financer*"}
                  value={selector.bank_or_finance}
                  onPress={() => dispatch(setFinancialDropDown("BANK_FINANCE"))}
                />
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"Rate of Interest*"}
                  value={selector.rate_of_interest}
                  onChangeText={(text) => dispatch(setFinancialDetails({ key: "RATE_OF_INTEREST", text: text }))}
                />
                <Text style={GlobalStyle.underline}></Text>
                <DropDownSelectionItem
                  label={"Loan of Tenure(Months)*"}
                  value={selector.loan_of_tenure}
                  onPress={() => dispatch(setFinancialDropDown("LOAN_OF_TENURE"))}
                />
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"EMI*"}
                  value={selector.emi}
                  onChangeText={(text) => dispatch(setFinancialDetails({ key: "EMI", text: text }))}
                />
                <Text style={GlobalStyle.underline}></Text>
                <DropDownSelectionItem
                  label={"Approx Annual Income*"}
                  value={selector.approx_annual_income}
                  onPress={() => dispatch(setFinancialDropDown("APPROX_ANNUAL_INCOME"))}
                  value={"Cash"}
                  onPress={() => { }}
                />
              </View>
            </View>
            <View style={styles.space}></View>

            {/* // 6.Upload Documents */}
            <View style={[styles.accordianBckVw], GlobalStyle.shadow}>
              <CustomerAccordianHeaderItem
                title={"Upload Documents"}
                leftIcon={"account-edit"}
                selected={openAccordian == 6 ? true : false}
                onPress={() => updateAccordian(6)}
              />
              <View
                style={{
                  width: "100%",
                  height: openAccordian == 6 ? null : 0,
                  overflow: 'hidden'
                }}
              >
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.pan_number}
                  label={"Pan Number*"}
                  onChangeText={(text) => dispatch(setUploadDocuments({ key: "PAN", text: text }))}
                />
                <Text style={GlobalStyle.underline}></Text>
                <View style={{ minHeight: 50, paddingLeft: 12, backgroundColor: Colors.WHITE }}>
                  <ImageSelectItem name={'Upload Pan'} onPress={() => dispatch(setImagePicker("UPLOAD_PAN"))} />
                </View>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.adhaar_number}
                  label={"Aadhaar Number*"}
                  onChangeText={(text) => dispatch(setUploadDocuments({ key: "ADHAR", text: text }))}
                />
                <Text style={GlobalStyle.underline}></Text>
                <View style={{ minHeight: 50, paddingLeft: 12, backgroundColor: Colors.WHITE }}>
                  <ImageSelectItem name={'Upload Adhar'} onPress={() => dispatch(setImagePicker("UPLOAD_ADHAR"))} />
                </View>
              </View>
            </View>
            <View style={styles.space}></View>

            {/* // 7.Customer Need Analysis */}
            <View style={[styles.accordianBckVw, GlobalStyle.shadow]}>
              <CustomerAccordianHeaderItem
                title={"Customer Need Analysis"}
                leftIcon={"account-edit"}
                selected={openAccordian == 7 ? true : false}
                onPress={() => updateAccordian(7)}
              />
              <View
                style={{
                  width: "100%",
                  height: openAccordian == 7 ? null : 0,
                  overflow: 'hidden'
                }}
              >
                <View style={styles.view2}>
                  <Text style={styles.looking_any_text}>{'Looking for any other brand'}</Text>
                  <Checkbox.Android
                    status={selector.c_looking_for_any_other_brand ? 'checked' : 'unchecked'}
                    uncheckedColor={Colors.DARK_GRAY}
                    color={Colors.RED}
                    onPress={() => dispatch(setCustomerNeedAnalysis({ key: "CHECK_BOX", text: "" }))}
                  />
                </View>
                <DropDownSelectionItem
                  label={"Make"}
                  value={selector.make}
                  onPress={() => dispatch(setCustomerNeedDropDown("C_MAKE"))}
                />
                <DropDownSelectionItem
                  label={"Model*"}
                  value={selector.model}
                  onPress={() => dispatch(setModelDropDown("C_MODEL"))}
                />
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.variant}
                  label={"Variant"}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerNeedAnalysis({ key: "VARIANT", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.color}
                  label={"Color"}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerNeedAnalysis({ key: "COLOR", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <DropDownSelectionItem
                  label={"Fuel Type*"}
                  value={selector.fuel_type}
                  onPress={() => dispatch(setModelDropDown("C_FUEL_TYPE"))}
                />
                <DropDownSelectionItem
                  label={"Transmission Type*"}
                  value={selector.transmission_type}
                  onPress={() => dispatch(setModelDropDown("C_TRANSMISSION_TYPE"))}
                />
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.price_range}
                  label={"Price Range"}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerNeedAnalysis({ key: "PRICE_RANGE", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.on_road_price}
                  label={"On Road Price"}
                  onChangeText={(text) => dispatch(setCustomerNeedAnalysis({ key: "ON_ROAD_PRICE", text: text }))}
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.dealership_name}
                  label={"DealerShip Name"}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerNeedAnalysis({
                        key: "DEALERSHIP_NAME",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.dealership_location}
                  label={"DealerShip Location"}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerNeedAnalysis({
                        key: "DEALERSHIP_LOCATION",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.dealership_pending_reason}
                  label={"Dealership Pending Reason"}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerNeedAnalysis({
                        key: "DEALERSHIP_PENDING_REASON",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.voice_of_customer_remarks}
                  label={"Voice of Customer Remarks "}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerNeedAnalysis({
                        key: "VOICE_OF_CUSTOMER_REMARKS",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView >
  );
};

export default DetailsOverviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  baseVw: {
    paddingHorizontal: 10,
  },
  shadow: {
    shadowColor: Colors.DARK_GRAY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    elevation: 3,
  },
  textInputStyle: {
    height: 65,
    width: "100%"
  },
  space: {
    height: 10
  },
  view1: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 5,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "600",
  },
  accordianBckVw: {
    // marginVertical: 5,
    // borderRadius: 10,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  radioGroupBcVw: {
    flexDirection: "row",
    alignItems: "center",
    height: 65,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
  permanentAddText: {
    fontSize: 16,
    fontWeight: "600",
  },
  view2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    paddingTop: 20,
    paddingLeft: 12
  },
  looking_any_text: {
    fontSize: 16,
    fontWeight: '500'
  }
});

// left={(props) => (
//   <VectorImage height={25} width={25} source={PERSONAL_DETAILS} />
// )}
