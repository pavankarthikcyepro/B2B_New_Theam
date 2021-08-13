import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from "react-native";
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
  setDropDown,
  setCustomerDetails,
  updateSelectedDropDownData,
  updateSelectedDate,
  setCommunicationAddress,
  setModelDropDown,
  setFinancialDetails,
  setFinancialDropDown,
  setCommitmentDetails,
  setBookingPaymentDetails
} from "../../../redux/preBookingFormReducer";
import { RadioTextItem, CustomerAccordianHeaderItem, ImageSelectItem } from "../../../pureComponents";
import { ImagePickerComponent } from "../../../components";
import { Checkbox, IconButton } from "react-native-paper";


const PrebookingFormScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const selector = useSelector((state) => state.preBookingFormReducer);
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

      {selector.showDropDownpicker && (
        <DropDownComponant
          visible={selector.showDropDownpicker}
          headerTitle={selector.dropDownTitle}
          data={selector.dropDownData}
          keyId={selector.dropDownKeyId}
          selectedItems={(item, keyId) => {
            console.log("selected: ", item, keyId);
            dispatch(
              updateSelectedDropDownData({
                id: item.id,
                name: item.name,
                keyId: keyId,
              })
            );
          }}
        />
      )}

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
        keyboardShouldPersistTaps={'handled'}
        style={{ flex: 1 }}
      >
        <View style={styles.baseVw}>

          {/* // 1.Customer Details */}
          <View style={[styles.accordianBckVw, { marginTop: 0 }, GlobalStyle.shadow,]} >
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
              <DropDownSelectionItem
                label={"Salutation*"}
                value={selector.salutation}
                onPress={() => dispatch(setDropDown("SALUTATION"))}
              />
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.first_name}
                label={"First Name*"}
                keyboardType={"default"}
                onChangeText={(text) => dispatch(setCustomerDetails({ key: "FIRST_NAME", text: text }))}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.last_name}
                label={"Last Name*"}
                keyboardType={"default"}
                onChangeText={(text) => dispatch(setCustomerDetails({ key: "LAST_NAME", text: text }))}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.mobile}
                label={"Mobile Number*"}
                keyboardType={"numeric"}
                onChangeText={(text) => dispatch(setCustomerDetails({ key: "MOBILE", text: text }))}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.email}
                label={"Email ID*"}
                keyboardType={"email-address"}
                onChangeText={(text) => dispatch(setCustomerDetails({ key: "EMAIL", text: text }))}
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
                label={"Gender*"}
                value={selector.gender}
                onPress={() => dispatch(setDropDown("GENDER"))}
              />
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.date_of_birth}
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
            <View style={{ width: '100%', height: openAccordian == 2 ? null : 0, overflow: 'hidden' }}>
              <TextinputComp
                style={styles.textInputStyle}
                value={selector.pincode}
                label={"Pincode*"}
                onChangeText={(text) =>
                  dispatch(setCommunicationAddress({ key: "PINCODE", text: text }))
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

          {/* // 4.Financial Details */}
          <View style={[styles.accordianBckVw], GlobalStyle.shadow}>
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

          {/* // 5.Document Upload */}
          <View style={[styles.accordianBckVw], GlobalStyle.shadow}>
            <CustomerAccordianHeaderItem
              title={"Document Upload"}
              leftIcon={"account-edit"}
              selected={openAccordian == 5 ? true : false}
              onPress={() => updateAccordian(5)}
            />
            <View style={{ width: '100%', height: openAccordian == 5 ? null : 0, overflow: 'hidden' }}>
            </View>
          </View>
          <View style={styles.space}></View>

          {/* // 6.Price Confirmation */}
          <View style={[styles.accordianBckVw], GlobalStyle.shadow}>
            <CustomerAccordianHeaderItem
              title={"Price Confirmation"}
              leftIcon={"account-edit"}
              selected={openAccordian == 6 ? true : false}
              onPress={() => updateAccordian(6)}
            />
            <View style={{ width: '100%', height: openAccordian == 6 ? null : 0, overflow: 'hidden' }}>
            </View>
          </View>
          <View style={styles.space}></View>

          {/* // 7.Offer Price */}
          <View style={[styles.accordianBckVw], GlobalStyle.shadow}>
            <CustomerAccordianHeaderItem
              title={"Offer Price"}
              leftIcon={"account-edit"}
              selected={openAccordian == 7 ? true : false}
              onPress={() => updateAccordian(7)}
            />
            <View style={{ width: '100%', height: openAccordian == 7 ? null : 0, overflow: 'hidden' }}>
            </View>
          </View>
          <View style={styles.space}></View>

          {/* // 8.Booking Payment Mode */}
          <View style={[styles.accordianBckVw], GlobalStyle.shadow}>
            <CustomerAccordianHeaderItem
              title={"Booking Payment Mode"}
              leftIcon={"account-edit"}
              selected={openAccordian == 8 ? true : false}
              onPress={() => updateAccordian(8)}
            />
            <View style={{ width: '100%', height: openAccordian == 8 ? null : 0, overflow: 'hidden' }}>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.booking_amount}
                label={"Booking Amount*"}
                onChangeText={(text) => dispatch(setBookingPaymentDetails({ key: "BOOKING_AMOUNT", text: text }))}
              />
              <Text style={GlobalStyle.underline}></Text>
              <DropDownSelectionItem
                label={"Payment At*"}
                value={selector.payment_at}
                onPress={() => dispatch(setDropDown("PAYMENT_AT"))}
              />
              <DropDownSelectionItem
                label={"Booking Payment Mode*"}
                value={selector.booking_payment_mode}
                onPress={() => dispatch(setDropDown("BOOKING_PAYMENT_MODE"))}
              />
            </View>
          </View>
          <View style={styles.space}></View>

          {/* // 9.Commitment */}
          <View style={[styles.accordianBckVw], GlobalStyle.shadow}>
            <CustomerAccordianHeaderItem
              title={"Commitment"}
              leftIcon={"account-edit"}
              selected={openAccordian == 9 ? true : false}
              onPress={() => updateAccordian(9)}
            />
            <View style={{ width: '100%', height: openAccordian == 9 ? null : 0, overflow: 'hidden' }}>
              <TextinputComp
                style={styles.textInputStyle}
                value={selector.customer_preferred_date}
                label={"Customer Preferred Date*"}
                disabled={true}
                onPressIn={() => dispatch(setDatePicker("CUSTOMER_PREFERRED_DATE"))}
                showRightIcon={true}
                rightIconObj={{
                  name: "calendar-range",
                  color: Colors.GRAY,
                }}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Occasion*"}
                value={selector.occasion}
                onChangeText={(text) => dispatch(setCommitmentDetails({ key: "OCCASION", text: text }))}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={styles.textInputStyle}
                value={selector.tentative_delivery_date}
                label={"Tentative Delivery Date*"}
                disabled={true}
                onPressIn={() => dispatch(setDatePicker("TENTATIVE_DELIVERY_DATE"))}
                showRightIcon={true}
                rightIconObj={{
                  name: "calendar-range",
                  color: Colors.GRAY,
                }}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Delivery Location*"}
                value={selector.delivery_location}
                onChangeText={(text) => dispatch(setCommitmentDetails({ key: "DELIVERY_LOCATON", text: text }))}
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
    backgroundColor: Colors.LIGHT_GRAY,
  },
  textInputStyle: {
    height: 65,
    width: "100%"
  },
  accordianTitleStyle: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.BLACK,
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
    height: 10
  },
});