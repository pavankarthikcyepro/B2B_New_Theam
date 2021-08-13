import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
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
  CUSTOMER_DETAILS,
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
  setCustomerDetails,
  updateSelectedDropDownData,
  updateSelectedDate,
} from "../../../redux/preBookingFormReducer";
import { RadioTextItem } from "../../../pureComponents";
import { ImagePickerComponent } from "../../../components";

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

const ImageSelectItem = ({ name, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 14, fontWeight: "400", color: Colors.BLUE }}>
          {name}
        </Text>
        <IconButton
          icon={"file-upload"}
          color={Colors.GRAY}
          size={20}
          style={{ paddingRight: 0 }}
        />
      </View>
    </TouchableOpacity>
  );
};

const PrebookingFormScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.enquiryFormReducer);
  const [text, setText] = React.useState("");
  const [openAccordian, setOpenAccordian] = useState(0);
  const [imageUri, setImageUri] = useState("");
  const [visible, setVisible] = React.useState(false);

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
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />

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

      {/* // 1. Customer Details */}
      <ScrollView
        automaticallyAdjustContentInsets={true}
        bounces={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 10 }}
        style={{ flex: 1 }}
      >
        <View style={styles.baseVw}>
          <View
            style={[
              styles.accordianBckVw,
              { marginTop: 0 },
              GlobalStyle.shadow,
            ]}
          >
            <CustomerAccordianHeaderView
              title={"Customer Details"}
              leftIcon={"account-edit"}
              isSelected={openAccordian == 1 ? true : false}
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
                value={selector.firstName}
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
                value={selector.LAST_NAME}
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
            </View>
          </View>
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
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: Colors.LIGHT_GRAY,
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
});
