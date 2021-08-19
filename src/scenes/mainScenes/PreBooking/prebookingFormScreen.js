import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { useDispatch, useSelector } from "react-redux";
import {
  TextinputComp,
  DropDownComponant,
  DatePickerComponent,
} from "../../../components";
import { DropDownSelectionItem } from "../../../pureComponents/dropDownSelectionItem";
import {
  setDatePicker,
  setCustomerDetails,
  updateSelectedDate,
  setCommunicationAddress,
  setFinancialDetails,
  setCommitmentDetails,
  setBookingPaymentDetails,
  setPriceConformationDetails,
  setOfferPriceDetails,
  setDropDownData,
  setDocumentUploadDetails,
  setImagePicker,
} from "../../../redux/preBookingFormReducer";
import {
  RadioTextItem,
  CustomerAccordianHeaderItem,
  ImageSelectItem,
  DateSelectItem,
} from "../../../pureComponents";
import { ImagePickerComponent } from "../../../components";
import { Checkbox, IconButton } from "react-native-paper";
import { Dropdown } from "sharingan-rn-modal-dropdown";

const data = [
  {
    value: "1",
    label: "Tiger Nixon",
    employee_salary: "320800",
    employee_age: "61",
  },
  {
    value: "2",
    label: "Garrett Winters",
    employee_salary: "170750",
    employee_age: "63",
  },
  {
    value: "3",
    label: "Ashton Cox",
    employee_salary: "86000",
    employee_age: "66",
  },
];

const rupeeSymbol = "\u20B9";

const TextAndAmountComp = ({ title, amount, titleStyle = {}, amoutStyle = {} }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, minHeight: 40, paddingVertical: 5, alignItems: 'center' }}>
      <Text style={[{ fontSize: 14, fontWeight: '400', maxWidth: "70%" }, titleStyle]}>{title}</Text>
      <Text style={[{ fontSize: 14, fontWeight: '400' }, amoutStyle]}>{rupeeSymbol + " " + amount}</Text>
    </View>
  )
}

const PrebookingFormScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.preBookingFormReducer);
  const [openAccordian, setOpenAccordian] = useState(0);
  const [componentAppear, setComponentAppear] = useState(false);

  useEffect(() => {
    setComponentAppear(true);
  }, [])

  const updateAccordian = (index) => {
    if (index != openAccordian) {
      setOpenAccordian(index);
    } else {
      setOpenAccordian(0);
    }
  };

  if (!componentAppear) {
    return (
      <View style={styles.initialContainer}>
        <ActivityIndicator size="small" color={Colors.RED} />
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>
      <ImagePickerComponent
        visible={selector.showImagePicker}
        keyId={selector.imagePickerKeyId}
        selectedImage={(data, keyId) => {
          console.log("imageObj: ", data, keyId);
        }}
        onDismiss={() => dispatch(setImagePicker(""))}
      />

      {selector.showDatepicker && (
        <DatePickerComponent
          visible={selector.showDatepicker}
          mode={"date"}
          value={new Date(Date.now())}
          onChange={(event, selectedDate) => {
            console.log("date: ", selectedDate);
            if (Platform.OS === "android") {
              // setDatePickerVisible(false)
            }
            dispatch(updateSelectedDate({ key: "", text: selectedDate }));
          }}
          onRequestClose={() => dispatch(setDatePicker())}
        />
      )}

      {/* // 1. Customer Details */}
      <ScrollView
        automaticallyAdjustContentInsets={true}
        bounces={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 10 }}
        keyboardShouldPersistTaps={"handled"}
        style={{ flex: 1 }}
      >
        <View style={styles.baseVw}>
          {/* // 1.Customer Details */}
          <View
            style={[
              styles.accordianBckVw,
              GlobalStyle.shadow,
              { backgroundColor: "white" },
            ]}
          >
            <CustomerAccordianHeaderItem
              title={"Customer Details"}
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
              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Salutation"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.salutation}
                  onChange={(value) =>
                    dispatch(
                      setDropDownData({ key: "SALUTATION", value: value })
                    )
                  }
                />
              </View>

              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.first_name}
                label={"First Name*"}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCustomerDetails({ key: "FIRST_NAME", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.last_name}
                label={"Last Name*"}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(setCustomerDetails({ key: "LAST_NAME", text: text }))
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.mobile}
                label={"Mobile Number*"}
                keyboardType={"numeric"}
                onChangeText={(text) =>
                  dispatch(setCustomerDetails({ key: "MOBILE", text: text }))
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.email}
                label={"Email ID*"}
                keyboardType={"email-address"}
                onChangeText={(text) =>
                  dispatch(setCustomerDetails({ key: "EMAIL", text: text }))
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Enquiry Segment"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.enquiry_segment}
                  onChange={(value) =>
                    dispatch(
                      setDropDownData({ key: "ENQUIRY_SEGMENT", value: value })
                    )
                  }
                />
              </View>
              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Customer Type"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.customer_type}
                  onChange={(value) =>
                    dispatch(
                      setDropDownData({ key: "CUSTOMER_TYPE", value: value })
                    )
                  }
                />
              </View>
              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Gender"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.gender}
                  onChange={(value) =>
                    dispatch(setDropDownData({ key: "GENDER", value: value }))
                  }
                />
              </View>
              <DateSelectItem
                label={"Date Of Birth"}
                value={selector.date_of_birth}
                onPress={() => dispatch(setDatePicker("DATE_OF_BIRTH"))}
              />
            </View>
          </View>
          <View style={styles.space}></View>

          {/* // 2.Communication Address */}
          <View
            style={[
              styles.accordianBckVw,
              GlobalStyle.shadow,
              { backgroundColor: "white" },
            ]}
          >
            <CustomerAccordianHeaderItem
              title={"Communicaton Address"}
              leftIcon={"account-edit"}
              selected={openAccordian == 2 ? true : false}
              onPress={() => updateAccordian(2)}
            />
            <View
              style={{
                width: "100%",
                height: openAccordian == 2 ? null : 0,
                overflow: "hidden",
              }}
            >
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
                value={selector.house_number}
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
                value={selector.street_name}
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
          <View
            style={[
              styles.accordianBckVw,
              GlobalStyle.shadow,
              { backgroundColor: "white" },
            ]}
          >
            <CustomerAccordianHeaderItem
              title={"Modal Selection"}
              leftIcon={"account-edit"}
              selected={openAccordian == 3 ? true : false}
              onPress={() => updateAccordian(3)}
            />
            <View
              style={{
                width: "100%",
                height: openAccordian == 3 ? null : 0,
                overflow: "hidden",
              }}
            >
              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Model"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.model}
                  onChange={(value) =>
                    dispatch(setDropDownData({ key: "MODEL", value: value }))
                  }
                />
              </View>

              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Varient"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.varient}
                  onChange={(value) =>
                    dispatch(setDropDownData({ key: "VARIENT", value: value }))
                  }
                />
              </View>

              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Color"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.color}
                  onChange={(value) =>
                    dispatch(setDropDownData({ key: "COLOR", value: value }))
                  }
                />
              </View>

              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Fuel Type"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.fuel_type}
                  onChange={(value) =>
                    dispatch(
                      setDropDownData({ key: "FUEL_TYPE", value: value })
                    )
                  }
                />
              </View>

              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Transmission Type"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.transmission_type}
                  onChange={(value) =>
                    dispatch(
                      setDropDownData({
                        key: "TRANSMISSION_TYPE",
                        value: value,
                      })
                    )
                  }
                />
              </View>
            </View>
          </View>
          <View style={styles.space}></View>

          {/* // 4.Financial Details */}
          <View
            style={[
              styles.accordianBckVw,
              GlobalStyle.shadow,
              { backgroundColor: "white" },
            ]}
          >
            <CustomerAccordianHeaderItem
              title={"Financial Details"}
              leftIcon={"account-edit"}
              selected={openAccordian == 4 ? true : false}
              onPress={() => updateAccordian(4)}
            />
            <View
              style={{
                width: "100%",
                height: openAccordian == 4 ? null : 0,
                overflow: "hidden",
              }}
            >
              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Retail Finance"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.retail_finance}
                  onChange={(value) =>
                    dispatch(
                      setDropDownData({ key: "RETAIL_FINANCE", value: value })
                    )
                  }
                />
              </View>

              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Finance Category"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.finance_category}
                  onChange={(value) =>
                    dispatch(
                      setDropDownData({ key: "FINANCE_CATEGORY", value: value })
                    )
                  }
                />
              </View>

              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Down Payment*"}
                value={selector.down_payment}
                onChangeText={(text) =>
                  dispatch(
                    setFinancialDetails({ key: "DOWN_PAYMENT", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Loan Amount*"}
                value={selector.loan_amount}
                onChangeText={(text) =>
                  dispatch(
                    setFinancialDetails({ key: "LOAN_AMOUNT", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>

              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Bank/Financer"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.bank_or_finance}
                  onChange={(value) =>
                    dispatch(
                      setDropDownData({ key: "BANK_FINANCE", value: value })
                    )
                  }
                />
              </View>

              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Rate of Interest*"}
                value={selector.rate_of_interest}
                onChangeText={(text) =>
                  dispatch(
                    setFinancialDetails({ key: "RATE_OF_INTEREST", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>

              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Loan of Tenure(Months)"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.loan_of_tenure}
                  onChange={(value) =>
                    dispatch(
                      setDropDownData({ key: "LOAN_OF_TENURE", value: value })
                    )
                  }
                />
              </View>

              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"EMI*"}
                value={selector.emi}
                onChangeText={(text) =>
                  dispatch(setFinancialDetails({ key: "EMI", text: text }))
                }
              />
              <Text style={GlobalStyle.underline}></Text>

              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Approx Annual Income"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.approx_annual_income}
                  onChange={(value) =>
                    dispatch(
                      setDropDownData({
                        key: "APPROX_ANNUAL_INCOME",
                        value: value,
                      })
                    )
                  }
                />
              </View>
            </View>
          </View>
          <View style={styles.space}></View>

          {/* // 5.Document Upload */}
          <View
            style={[
              styles.accordianBckVw,
              GlobalStyle.shadow,
              { backgroundColor: "white" },
            ]}
          >
            <CustomerAccordianHeaderItem
              title={"Document Upload"}
              leftIcon={"account-edit"}
              selected={openAccordian == 5 ? true : false}
              onPress={() => updateAccordian(5)}
            />
            <View
              style={{
                width: "100%",
                height: openAccordian == 5 ? null : 0,
                overflow: "hidden",
              }}
            >
              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Form60/PAN"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.form_or_pan}
                  onChange={(value) =>
                    dispatch(
                      setDropDownData({ key: "FORM_60_PAN", value: value })
                    )
                  }
                />
              </View>
              <TextinputComp
                style={styles.textInputStyle}
                value={selector.adhaar_number}
                label={"Aadhaar Number*"}
                onChangeText={(text) =>
                  dispatch(
                    setDocumentUploadDetails({ key: "ADHAR", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <View style={styles.select_image_bck_vw}>
                <ImageSelectItem
                  name={"Upload Adhar"}
                  onPress={() => dispatch(setImagePicker("UPLOAD_ADHAR"))}
                />
              </View>
              <TextinputComp
                style={styles.textInputStyle}
                value={selector.relationship_proof}
                label={"Relationship Number*"}
                onChangeText={(text) =>
                  dispatch(
                    setDocumentUploadDetails({
                      key: "RELATIONSHIP_PROOF",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <View style={styles.select_image_bck_vw}>
                <ImageSelectItem
                  name={"Relationship Proof"}
                  onPress={() => dispatch(setImagePicker("UPLOAD_ADHAR"))}
                />
              </View>
              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Customer Type Category"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.customer_type_category}
                  onChange={(value) =>
                    dispatch(
                      setDropDownData({
                        key: "CUSTOMER_TYPE_CATEGORY",
                        value: value,
                      })
                    )
                  }
                />
              </View>
            </View>
          </View>
          <View style={styles.space}></View>

          {/* // 6.Price Confirmation */}
          <View
            style={[
              styles.accordianBckVw,
              GlobalStyle.shadow,
              { backgroundColor: "white" },
            ]}
          >
            <CustomerAccordianHeaderItem
              title={"Price Confirmation"}
              leftIcon={"account-edit"}
              selected={openAccordian == 6 ? true : false}
              onPress={() => updateAccordian(6)}
            />
            <View
              style={{
                width: "100%",
                height: openAccordian == 6 ? null : 0,
                overflow: "hidden",
              }}
            >

              <TextAndAmountComp title={"Ex-Showroom Price:"} amount={"0.00"} />
              <View style={styles.radioGroupBcVw}>
                <Checkbox.Android
                  style={{ margin: 0, padding: 0 }}
                  uncheckedColor={Colors.GRAY}
                  color={Colors.RED}
                  status={
                    selector.vechicle_registration ? "checked" : "unchecked"
                  }
                  onPress={() =>
                    dispatch(
                      setPriceConformationDetails({
                        key: "VECHILE_REGISTRATION",
                        text: "",
                      })
                    )
                  }
                />
                <Text style={styles.checkboxAddText}>
                  {"Any Other Vehicle Registration on Your Name"}
                </Text>
              </View>
              <TextAndAmountComp title={"Life Tax:"} amount={"0.00"} />
              <Text style={GlobalStyle.underline}></Text>

              <TextAndAmountComp title={"Registration Charges:"} amount={"0.00"} />
              <Text style={GlobalStyle.underline}></Text>


              <View style={styles.symbolview}>
                <View style={{ width: "70%" }}>
                  <View style={styles.drop_down_view_style}>
                    <Dropdown
                      label="Insurance Type"
                      data={selector.dropDownData}
                      required={true}
                      floating={true}
                      value={selector.insurance_type}
                      onChange={(value) =>
                        dispatch(
                          setDropDownData({
                            key: "INSURANCE_TYPE",
                            value: value,
                          })
                        )
                      }
                    />
                  </View>
                </View>
                <Text style={styles.shadowText}>{rupeeSymbol + " 0.00"}</Text>
              </View>

              <TextAndAmountComp title={"Add-on Insurance:"} amount={"0.00"} />
              <Text style={GlobalStyle.underline}></Text>

              <View style={styles.symbolview}>
                <View style={{ width: "70%" }}>
                  <View style={styles.drop_down_view_style}>
                    <Dropdown
                      label="Warranty"
                      data={selector.dropDownData}
                      required={true}
                      floating={true}
                      value={selector.warranty}
                      onChange={(value) =>
                        dispatch(
                          setDropDownData({
                            key: "WARRANTY",
                            value: value,
                          })
                        )
                      }
                    />
                  </View>
                </View>
                <Text style={styles.shadowText}>{"\u20B9"} 0.00</Text>
              </View>
              <Text style={GlobalStyle.underline}></Text>

              <TextAndAmountComp title={"Handling Charges:"} amount={"0.00"} />
              <Text style={GlobalStyle.underline}></Text>

              <TextAndAmountComp title={"Essential Kit:"} amount={"0.00"} />
              <Text style={GlobalStyle.underline}></Text>

              <TextAndAmountComp title={"TCS(>10Lakhs -> %):"} amount={"0.00"} />
              <Text style={GlobalStyle.underline}></Text>

              <TextAndAmountComp title={"Paid Accessories:"} amount={"0.00"} />
              <Text style={GlobalStyle.underline}></Text>

              <TextAndAmountComp title={"Fast Tag:"} amount={"0.00"} />
              <Text style={GlobalStyle.underline}></Text>

              <TextAndAmountComp title={"On Road Price:"} amount={"0.00"} titleStyle={{ fontSize: 18, fontWeight: '800' }} amoutStyle={{ fontSize: 18, fontWeight: '800' }} />
              <Text style={GlobalStyle.underline}></Text>

            </View>
          </View>
          <View style={styles.space}></View>

          {/* // 7.Offer Price */}
          <View
            style={[
              styles.accordianBckVw,
              GlobalStyle.shadow,
              { backgroundColor: "white" },
            ]}
          >
            <CustomerAccordianHeaderItem
              title={"Offer Price"}
              leftIcon={"account-edit"}
              selected={openAccordian == 7 ? true : false}
              onPress={() => updateAccordian(7)}
            />
            <View
              style={{
                width: "100%",
                height: openAccordian == 7 ? null : 0,
                overflow: "hidden",
              }}
            >
              <Text style={GlobalStyle.underline}></Text>

              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Consumer Offer:"}
                value={selector.consumer_offer}
                onChangeText={(text) =>
                  dispatch(
                    setOfferPriceDetails({
                      key: "CONSUMER_OFFER",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Exchange Offer:"}
                value={selector.exchange_offer}
                onChangeText={(text) =>
                  dispatch(
                    setOfferPriceDetails({
                      key: "EXCHANGE_OFFER",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Coporate Offer:"}
                value={selector.corporate_offer}
                onChangeText={(text) =>
                  dispatch(
                    setOfferPriceDetails({
                      key: "CORPORATE_OFFER",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Promotional Offer:"}
                value={selector.promotional_offer}
                onChangeText={(text) =>
                  dispatch(
                    setOfferPriceDetails({
                      key: "PROMOTIONAL_OFFER",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Cash Discount:"}
                value={selector.cash_discount}
                onChangeText={(text) =>
                  dispatch(
                    setOfferPriceDetails({
                      key: "CASH_DISCOUNT",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Foc Accessories:"}
                value={selector.for_accessories}
                onChangeText={(text) =>
                  dispatch(
                    setOfferPriceDetails({
                      key: "FOR_ACCESSORIES",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Additional Offer 1:"}
                value={selector.additional_offer_1}
                onChangeText={(text) =>
                  dispatch(
                    setOfferPriceDetails({
                      key: "ADDITIONAL_OFFER_1",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Additional Offer 2:"}
                value={selector.additional_offer_2}
                onChangeText={(text) =>
                  dispatch(
                    setOfferPriceDetails({
                      key: "ADDITIONAL_OFFER_2",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>

              <TextAndAmountComp title={"On Road Price After Discount:"} amount={"0.00"} titleStyle={{ fontSize: 18, fontWeight: '800' }} amoutStyle={{ fontSize: 18, fontWeight: '800' }} />
              <Text style={GlobalStyle.underline}></Text>
            </View>
          </View>
          <View style={styles.space}></View>

          {/* // 8.Booking Payment Mode */}
          <View
            style={[
              styles.accordianBckVw,
              GlobalStyle.shadow,
              { backgroundColor: "white" },
            ]}
          >
            <CustomerAccordianHeaderItem
              title={"Booking Payment Mode"}
              leftIcon={"account-edit"}
              selected={openAccordian == 8 ? true : false}
              onPress={() => updateAccordian(8)}
            />
            <View
              style={{
                width: "100%",
                height: openAccordian == 8 ? null : 0,
                overflow: "hidden",
              }}
            >
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.booking_amount}
                label={"Booking Amount*"}
                onChangeText={(text) =>
                  dispatch(
                    setBookingPaymentDetails({
                      key: "BOOKING_AMOUNT",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>

              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Payment At"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.payment_at}
                  onChange={(value) =>
                    dispatch(
                      setDropDownData({ key: "PAYMENT_AT", value: value })
                    )
                  }
                />
              </View>

              <View style={styles.drop_down_view_style}>
                <Dropdown
                  label="Booking Payment Mode"
                  data={selector.dropDownData}
                  required={true}
                  floating={true}
                  value={selector.booking_payment_mode}
                  onChange={(value) =>
                    dispatch(
                      setDropDownData({
                        key: "BOOKING_PAYMENT_MODE",
                        value: value,
                      })
                    )
                  }
                />
              </View>
            </View>
          </View>
          <View style={styles.space}></View>

          {/* // 9.Commitment */}
          <View
            style={[
              styles.accordianBckVw,
              GlobalStyle.shadow,
              { backgroundColor: "white" },
            ]}
          >
            <CustomerAccordianHeaderItem
              title={"Commitment"}
              leftIcon={"account-edit"}
              selected={openAccordian == 9 ? true : false}
              onPress={() => updateAccordian(9)}
            />
            <View
              style={{
                width: "100%",
                height: openAccordian == 9 ? null : 0,
                overflow: "hidden",
              }}
            >
              <DateSelectItem
                label={"Customer Preferred Date*"}
                value={selector.customer_preferred_date}
                onPress={() =>
                  dispatch(setDatePicker("CUSTOMER_PREFERRED_DATE"))
                }
              />
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Occasion*"}
                value={selector.occasion}
                onChangeText={(text) =>
                  dispatch(
                    setCommitmentDetails({ key: "OCCASION", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <DateSelectItem
                label={"Tentative Delivery Date*"}
                value={selector.tentative_delivery_date}
                onPress={() =>
                  dispatch(setDatePicker("TENTATIVE_DELIVERY_DATE"))
                }
              />
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Delivery Location*"}
                value={selector.delivery_location}
                onChangeText={(text) =>
                  dispatch(
                    setCommitmentDetails({
                      key: "DELIVERY_LOCATON",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline}></Text>
            </View>
          </View>
          <View style={styles.space}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrebookingFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  baseVw: {
    paddingHorizontal: 10,
  },
  drop_down_view_style: {
    paddingTop: 5,
    flex: 1,
    backgroundColor: Colors.WHITE,
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
    backgroundColor: Colors.WHITE,
  },
  textInputStyle: {
    height: 65,
    width: "100%",
  },
  accordianTitleStyle: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.BLACK,
  },
  radioGroupBcVw: {
    flexDirection: "row",
    alignItems: "center",
    height: 35,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
  permanentAddText: {
    fontSize: 16,
    fontWeight: "600",
  },
  view2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    paddingTop: 20,
    paddingLeft: 12,
  },
  looking_any_text: {
    fontSize: 16,
    fontWeight: "500",
  },
  space: {
    height: 10,
  },
  checkboxAddText: {
    fontSize: 12,
    fontWeight: "400",
  },
  symbolview: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingRight: 12,
    backgroundColor: Colors.WHITE,
  },
  shadowText: {
    width: "30%",
    backgroundColor: Colors.WHITE,
    textAlign: "right",
    fontSize: 14,
    fontWeight: '400'
  },
  select_image_bck_vw: {
    minHeight: 50,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
});
