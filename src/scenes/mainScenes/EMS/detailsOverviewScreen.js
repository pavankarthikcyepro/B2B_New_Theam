import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
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
  setAccordian,
  setDatePicker,
  setDropDown,
  setPersonalIntro,
  updateSelectedDropDownData,
} from "../../../redux/enquiryDetailsOverViewSlice";

const CustomerAccordianHeaderView = ({
  leftIcon,
  title,
  isSelected,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 50,
          backgroundColor: isSelected ? Colors.RED : Colors.WHITE,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconButton
            icon={leftIcon}
            color={isSelected ? Colors.WHITE : Colors.RED}
            size={20}
            style={{ paddingRight: 0 }}
          />
          <Text
            style={[
              styles.accordianTitleStyle,
              { color: isSelected ? Colors.WHITE : Colors.DARK_GRAY },
            ]}
          >
            {title}
          </Text>
        </View>
        <IconButton
          icon={"menu-down"}
          color={isSelected ? Colors.WHITE : Colors.BLACK}
          size={25}
          style={{ marginLeft: 10 }}
        />
      </View>
    </Pressable>
  );
};

const DetailsOverviewScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.enquiryDetailsOverViewReducer);
  const [text, setText] = React.useState("");

  return (
    <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>
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

      <DatePickerComponent
        visible={selector.showDatepicker}
        mode={"date"}
        value={new Date(Date.now())}
        onChange={(event, selectedDate) => {
          console.log("date: ", selectedDate);
          if (Platform.OS === "android") {
            setDatePickerVisible(false);
          }
          dispatch(setDatePicker());
        }}
        onRequestClose={() => dispatch(setDatePicker())}
      />

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

      {/* // 1. Personal Intro */}
      <ScrollView
        automaticallyAdjustContentInsets={true}
        bounces={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 10 }}
        style={{ flex: 1 }}
      >
        <View style={styles.baseVw}>
          <View style={[styles.accordianBckVw, { marginTop: 0 }]}>
            <CustomerAccordianHeaderView
              title={"Personal Intro"}
              leftIcon={"account-edit"}
              isSelected={selector.openAccordian == 1 ? true : false}
              onPress={() => dispatch(setAccordian(1))}
            />
            <View
              style={{
                width: "100%",
                height: selector.openAccordian == 1 ? null : 0,
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
                style={{ height: 65, width: "100%" }}
                value={selector.firstName}
                label={"First Name*"}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "FIRST_NAME", text: text }))
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
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
                onPress={() => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.relationName}
                label={"Relation Name*"}
                onChangeText={(text) =>
                  dispatch(
                    setPersonalIntro({ key: "RELATION_NAME", text: text })
                  )
                }
              />
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.mobile}
                label={"Mobile Number*"}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "MOBILE", text: text }))
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
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
                style={{ height: 65, width: "100%" }}
                value={selector.email}
                label={"Email ID*"}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "EMAIL", text: text }))
                }
              />
              <Text style={GlobalStyle.underline}></Text>

              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.dateOfBirth}
                label={"Date Of Birth"}
                disabled={true}
                onPressIn={() => dispatch(setDatePicker())}
                showRightIcon={true}
                rightIconObj={{
                  name: "calendar-range",
                  color: Colors.GRAY,
                }}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.anniversaryDate}
                label={"Anniversary Date"}
                disabled={true}
                onPressIn={() => dispatch(setDatePicker())}
                showRightIcon={true}
                rightIconObj={{
                  name: "calendar-range",
                  color: Colors.GRAY,
                }}
              />
              <Text style={GlobalStyle.underline}></Text>
            </View>
          </View>

          {/* // 2.Communication Address */}
          <View style={[styles.accordianBckVw]}>
            <CustomerAccordianHeaderView
              title={"Communicaton Address"}
              leftIcon={"account-edit"}
              isSelected={selector.openAccordian == 2 ? true : false}
              onPress={() => dispatch(setAccordian(2))}
            />
            <View
              style={{
                width: "100%",
                height: selector.openAccordian == 2 ? null : 0,
                overflow: "hidden",
              }}
            >
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Communication Details"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"507002"}
                label={"Pincode*"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Urban"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Rural"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"H.No*"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Street Name*"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"ead"}
                label={"Village*"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"aedfas"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Khammam*"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Telangana*"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Permanent Address*"}
                onChangeText={(text) => {}}
              />

              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"507002"}
                label={"Pincode*"}
                onChangeText={(text) => {}}
              />
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Urban"}
                onChangeText={(text) => {}}
              />
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Rural"}
                onChangeText={(text) => {}}
              />
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"H.No*"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Street Name*"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"ead"}
                label={"Village*"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"aedfas"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Khammam*"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Telangana*"}
                onChangeText={(text) => {}}
              />
              <Text style={GlobalStyle.underline}></Text>
            </View>
          </View>

          {/* // 3.Modal Selction */}
          <View style={[styles.accordianBckVw]}>
            <CustomerAccordianHeaderView
              title={"Modal Selection"}
              leftIcon={"account-edit"}
              isSelected={selector.openAccordian == 3 ? true : false}
              onPress={() => dispatch(setAccordian(3))}
            />
            <View
              style={{
                width: "100%",
                height: selector.openAccordian == 3 ? null : 0,
                overflow: "hidden",
              }}
            >
              <DropDownSelectionItem
                label={"Model*"}
                value={selector.model}
                onPress={() => dispatch(setDropDown("MODEL"))}
              />
              <DropDownSelectionItem
                label={"Varient*"}
                value={selector.varient}
                onPress={() => dispatch(setDropDown("VARIENT"))}
              />
              <DropDownSelectionItem
                label={"Color*"}
                value={selector.color}
                onPress={() => dispatch(setDropDown("COLOR"))}
              />
              <DropDownSelectionItem
                label={"Fuel Type*"}
                value={selector.fuel}
                onPress={() => dispatch(setDropDown("FUEL"))}
              />
              <DropDownSelectionItem
                label={"Transmission Type*"}
                value={selector.transmission}
                onPress={() => dispatch(setDropDown("TRANSMISSION"))}
              />
            </View>
          </View>

          {/* // 4.Customer Profile */}
          <View style={[styles.accordianBckVw]}>
            <CustomerAccordianHeaderView
              title={"Customer Profile"}
              leftIcon={"account-edit"}
              isSelected={selector.openAccordian == 4 ? true : false}
              onPress={() => dispatch(setAccordian(4))}
            />
            <View
              style={{
                width: "100%",
                height: selector.openAccordian == 4 ? null : 0,
                overflow: "hidden",
              }}
            >
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Soft"}
                label={"Occupation*"}
                onChangeText={(text) => setText(text)}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"adsf"}
                label={"Designation*"}
                onChangeText={(text) => setText(text)}
              />
              <Text style={GlobalStyle.underline}></Text>

              <DropDownSelectionItem
                label={"Enquiry Segment*"}
                value={"Personal"}
                onPress={() => {}}
              />
              <DropDownSelectionItem
                label={"Customer Type*"}
                value={"Individual"}
                onPress={() => {}}
              />
              <DropDownSelectionItem
                label={"Source Of Enquiry*"}
                value={"Field"}
                onPress={() => {}}
              />
              {/* <View style={{ flex: 1, flexDirection: "row" }}> */}
              <View style={{ width: "100%" }}>
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"Expected Date"}
                  value={"2021-08-04"}
                  onChangeText={(text) => setText(text)}
                  showRightIcon={true}
                  rightIconObj={{
                    name: "calendar-range",
                    color: Colors.GRAY,
                  }}
                />
                <Text style={GlobalStyle.underline}></Text>
                {/* </View> */}
                <DropDownSelectionItem
                  label={"Enquiry Category*"}
                  value={"Hot"}
                  onPress={() => {}}
                />
                <DropDownSelectionItem
                  label={"Buyer Type*"}
                  value={"First Time Buyer"}
                  onPress={() => {}}
                />
                <DropDownSelectionItem
                  label={"KMs Travelled in Month*"}
                  value={"<500"}
                  onPress={() => {}}
                />
                <DropDownSelectionItem
                  label={"Who Drives*"}
                  value={"Driver"}
                  onPress={() => {}}
                />
                <DropDownSelectionItem
                  label={"Members Text*"}
                  value={"2"}
                  onPress={() => {}}
                />
                <DropDownSelectionItem
                  label={"What is prime expectation from the car*"}
                  value={"Features"}
                  onPress={() => {}}
                />
              </View>
            </View>
          </View>

          {/* // 5.Financial Details */}
          <View style={[styles.accordianBckVw]}>
            <CustomerAccordianHeaderView
              title={"Financial Details"}
              leftIcon={"account-edit"}
              isSelected={selector.openAccordian == 5 ? true : false}
              onPress={() => dispatch(setAccordian(5))}
            />
            <View
              style={{
                width: "100%",
                height: selector.openAccordian == 5 ? null : 0,
                overflow: "hidden",
              }}
            >
              <DropDownSelectionItem
                label={"Retail Finance*"}
                value={"Cash"}
                onPress={() => {}}
              />
            </View>
          </View>

          {/* // 6.Upload Documents */}
          <View style={[styles.accordianBckVw]}>
            <CustomerAccordianHeaderView
              title={"Upload Documents"}
              leftIcon={"account-edit"}
              isSelected={selector.openAccordian == 6 ? true : false}
              onPress={() => dispatch(setAccordian(6))}
            />
            <View
              style={{
                width: "100%",
                height: selector.openAccordian == 6 ? null : 0,
                overflow: "hidden",
              }}
            >
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={text}
                label={"Pan*"}
                onChangeText={(text) => setText(text)}
              />
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={text}
                label={"Pan Number*"}
                onChangeText={(text) => setText(text)}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={text}
                label={"Aadhaar*"}
                onChangeText={(text) => setText(text)}
              />
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={text}
                label={"Aadhaar Number*"}
                onChangeText={(text) => setText(text)}
              />
              <Text style={GlobalStyle.underline}></Text>
            </View>
          </View>

          {/* // 7.Customer Need Analysis */}
          <View style={[styles.accordianBckVw, {}]}>
            <CustomerAccordianHeaderView
              title={"Customer Need Analysis"}
              leftIcon={"account-edit"}
              isSelected={selector.openAccordian == 7 ? true : false}
              onPress={() => dispatch(setAccordian(7))}
            />
            <View
              style={{
                width: "100%",
                height: selector.openAccordian == 7 ? null : 0,
                overflow: "hidden",
              }}
            >
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={text}
                label={"Looking for any other Brand*"}
                onChangeText={(text) => setText(text)}
              />
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={text}
                label={"Voice of customer remarks*"}
                onChangeText={(text) => setText(text)}
              />
              <Text style={GlobalStyle.underline}></Text>

              <DropDownSelectionItem
                label={""}
                value={"Make"}
                onPress={() => {}}
              />
              <DropDownSelectionItem
                label={""}
                value={"Model"}
                onPress={() => {}}
              />
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Variant"}
                label={""}
                onChangeText={(text) => setText(text)}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Color"}
                label={""}
                onChangeText={(text) => setText(text)}
              />
              <Text style={GlobalStyle.underline}></Text>
              <DropDownSelectionItem
                label={"Fuel Type"}
                value={""}
                onPress={() => {}}
              />
              <DropDownSelectionItem
                label={"Transmission Type"}
                value={""}
                onPress={() => {}}
              />
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Price Range "}
                label={""}
                onChangeText={(text) => setText(text)}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"On Road Price  "}
                label={""}
                onChangeText={(text) => setText(text)}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Dealer ship Name "}
                label={""}
                onChangeText={(text) => setText(text)}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Dealer ship location "}
                label={""}
                onChangeText={(text) => setText(text)}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Dealership Pending Reason "}
                label={""}
                onChangeText={(text) => setText(text)}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={"Voice of Customer Remarks "}
                label={""}
                onChangeText={(text) => setText(text)}
              />
              <Text style={GlobalStyle.underline}></Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  accordianTitleStyle: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.BLACK,
  },
});

// left={(props) => (
//   <VectorImage height={25} width={25} source={PERSONAL_DETAILS} />
// )}
