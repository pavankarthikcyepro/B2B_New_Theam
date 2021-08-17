import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { GlobalStyle } from "../../styles";
// import {
//   setEditable,
//   setDatePicker,
//   setDropDown,
//   setPersonalIntro,
//   setCommunicationAddress,
//   setCustomerProfile,
//   updateSelectedDropDownData,
//   updateSelectedDate,
//   setModelDropDown,
//   setFinancialDropDown,
//   setFinancialDetails,
//   setCustomerNeedAnalysis,
//   setCustomerNeedDropDown,
//   setImagePicker,
//   setUploadDocuments,
// } from "../../../redux/enquiryFormReducer";
import { DropDownSelectionItem } from "../../pureComponents/dropDownSelectionItem";
import { useDispatch, useSelector } from "react-redux";

const TestDriveScreen = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.preBookingFormReducer);
  const [text, setText] = React.useState("");
  return (
    <SafeAreaView style={styles.container}>
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
      <View style={{ flexDirection: "row" }}>
        <TextinputComp
          // style={{ height: 65, width: "150%" }}
          value={"999887455"}
          label={"Mobile Number"}
          onChangeText={(text) => setText(text)}
        />
        <TextinputComp
          value={"Niru"}
          label={"Name"}
          onChangeText={(text) => setText(text)}
          // style={{ marginLeft: 20 }}
        />
        <View style={{ padding: 20 }}></View>
        <TextinputComp
          label={"niru@gmail.com"}
          value={"enter email"}
          onChangeText={(text) => setText(text)}
          style={{ marginRight: 10 }}
          // style={{ height: 65, width: "150%" }}
        />
      </View>
      <View>
        <DropDownSelectionItem label={"Model"} value={"Aura"} />
        <Text style={GlobalStyle.underline}></Text>
        <DropDownSelectionItem
          value={"Fuel Type"}
          // onPress={() => dispatch(setDropDown("Fuel Type"))}
        />
        <Text style={GlobalStyle.underline}></Text>
        <DropDownSelectionItem
          value={"Tranmission Type"}
          // onPress={() => dispatch(setDropDown("Tranmission Type"))}
        />
        <Text style={GlobalStyle.underline}></Text>
      </View>
    </SafeAreaView>
  );
};

export default TestDriveScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
});
