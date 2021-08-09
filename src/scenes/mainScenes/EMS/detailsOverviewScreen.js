import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
} from "react-native";
import { Checkbox, List, IconButton } from "react-native-paper";
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
import { TextinputComp } from "../../../components";
import { DropDownComponant } from "../../../components";
import { DropDownSelectionItem } from "../../../pureComponents/dropDownSelectionItem";

const DetailsOverviewScreen = () => {
  const [expanded, setExpanded] = React.useState(true);
  const [text, setText] = React.useState("");

  const handlePress = () => {
    setExpanded(!expanded);
  };

  return (
    <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>
      <ScrollView>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "600", fontSize: 28, margin: 10 }}>
            Details Overview
          </Text>
          <View style={{ paddingLeft: 60, marginTop: 8 }}>
            <IconButton
              icon="checkbox-blank-outline"
              color={Colors.DARK_GRAY}
              size={30}
              onPress={() => console.log("Pressed")}
            />
          </View>
        </View>

        {/* // 1. Personal Intro */}
        <DropDownComponant
          visible={false}
          headerTitle={"Personal Intro"}
          data={[]}
          selectedItems={(item) => {
            console.log("selected: ", item);
          }}
        />

        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          style={{ flex: 1 }}
        >
          <View style={styles.baseVw}>
            <View style={[{ marginVertical: 10, borderRadius: 10 }]}>
              <List.Accordion
                title="Personal Intro"
                titleStyle={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: Colors.BLACK,
                }}
                style={{
                  backgroundColor: expanded == true ? Colors.RED : Colors.WHITE,
                }}
                // left={(props) => (
                //   <VectorImage height={25} width={25} source={PERSONAL_DETAILS} />
                // )}
                expanded={expanded}
                onPress={handlePress}
              >
                <View style={{ width: "100%" }}>
                  <DropDownSelectionItem
                    label={"Salutation*"}
                    value={"Mr"}
                    onPress={() => {}}
                  />
                  <DropDownSelectionItem
                    label={"Gender*"}
                    value={"Male"}
                    onPress={() => {}}
                  />
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"Test"}
                    label={"First Name*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"Four"}
                    label={"Last Name*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <DropDownSelectionItem
                    label={"Relation*"}
                    value={"S/O"}
                    onPress={() => {}}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"dfada"}
                    label={"Relation Name*"}
                    onChangeText={(text) => setText(text)}
                  />

                  {/* <View style={{ flex: 1, flexDirection: "row" }}> */}
                  <View style={{ width: "100%" }}>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      value={"1974-05-04"}
                      label={"Date Of Birth"}
                      onChangeText={(text) => setText(text)}
                      showRightIcon={true}
                      rightIconObj={{
                        name: "calendar-range",
                        color: Colors.GRAY,
                      }}
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>

                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"47"}
                    label={"Age*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <View style={{ width: "100%" }}>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      value={"1998-10-12"}
                      label={"Anniversary Date"}
                      onChangeText={(text) => setText(text)}
                      showRightIcon={true}
                      rightIconObj={{
                        name: "calendar-range",
                        color: Colors.GRAY,
                      }}
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>

                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"9658745866"}
                    label={"Mobile Number*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={text}
                    label={"Alternate Mobile Number*"}
                    onChangeText={(text) => setText(text)}
                  />

                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"sarat@gmail.com"}
                    label={"Email ID*"}
                    onChangeText={(text) => setText(text)}
                  />
                </View>
                {/* </View> */}
              </List.Accordion>
            </View>
          </View>
        </ScrollView>

        {/* // 2.Communication Details */}
        <DropDownComponant
          visible={false}
          headerTitle={"Communication Details"}
          data={[]}
          selectedItems={(item) => {
            console.log("selected: ", item);
          }}
        />

        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          style={{ flex: 1 }}
        >
          <View style={styles.baseVw}>
            <View style={[{ marginVertical: 10, borderRadius: 10 }]}>
              <List.Accordion
                title="Communication Details"
                titleStyle={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: Colors.BLACK,
                }}
                style={{
                  backgroundColor: expanded == true ? Colors.RED : Colors.WHITE,
                }}
                left={(props) => (
                  <VectorImage
                    height={25}
                    width={25}
                    source={COMMUNICATION_DETAILS}
                  />
                )}
                expanded={expanded}
                onPress={handlePress}
              >
                <View style={{ width: "100%" }}>
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    label={"Communication Details"}
                    // onChangeText={(text) => setText(text)}
                  />
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"507002"}
                    label={"Pincode*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"Urban"}
                    onChangeText={(text) => setText(text)}
                  />
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"Rural"}
                    onChangeText={(text) => setText(text)}
                  />
                  {/* <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    label={"H.No*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>{" "}
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    label={"Street Name*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text> */}
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"ead"}
                    label={"Village*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"aedfas"}
                    onChangeText={(text) => setText(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"Khammam*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"Telangana*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    label={"Permanent Address*"}
                    // onChangeText={(text) => setText(text)}
                  />

                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"507002"}
                    label={"Pincode*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"Urban"}
                    onChangeText={(text) => setText(text)}
                  />
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"Rural"}
                    onChangeText={(text) => setText(text)}
                  />
                  {/* <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    label={"H.No*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>{" "}
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    label={"Street Name*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text> */}
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"ead"}
                    label={"Village*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"aedfas"}
                    onChangeText={(text) => setText(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"Khammam*"}
                    onChangeText={(text) => setText(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={"Telangana*"}
                    onChangeText={(text) => setText(text)}
                  />
                </View>
              </List.Accordion>
            </View>
          </View>
        </ScrollView>

        {/* // 3.select modal */}
        <DropDownComponant
          visible={false}
          headerTitle={"Select Model"}
          data={[]}
          selectedItems={(item) => {
            console.log("selected: ", item);
          }}
        />

        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          style={{ flex: 1 }}
        >
          <View style={styles.baseVw}>
            <View style={[{ marginVertical: 10, borderRadius: 10 }]}>
              <List.Accordion
                title="Modal Selection"
                titleStyle={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: Colors.BLACK,
                }}
                style={{
                  backgroundColor: expanded == true ? Colors.RED : Colors.WHITE,
                }}
                left={(props) => (
                  <VectorImage
                    height={25}
                    width={25}
                    source={MODEL_SELECTION}
                  />
                )}
                expanded={expanded}
                onPress={handlePress}
              >
                <View style={{ width: "100%" }}>
                  <DropDownSelectionItem
                    label={"Model*"}
                    value={"Aura"}
                    onPress={() => {}}
                  />

                  <DropDownSelectionItem
                    label={"Varient*"}
                    value={"1.2 AMT KAPPA S"}
                    onPress={() => {}}
                  />
                  <DropDownSelectionItem
                    label={"Color*"}
                    value={"Fiery red"}
                    onPress={() => {}}
                  />
                  <DropDownSelectionItem
                    label={"Fuel Type*"}
                    value={"Petrol"}
                    onPress={() => {}}
                  />
                  <DropDownSelectionItem
                    label={"Transmission Type*"}
                    value={"Automatic"}
                    onPress={() => {}}
                  />
                </View>
              </List.Accordion>
            </View>
          </View>
        </ScrollView>

        {/* // 4.Customer Profile. */}
        <DropDownComponant
          visible={false}
          headerTitle={"Customer Profile"}
          data={[]}
          selectedItems={(item) => {
            console.log("selected: ", item);
          }}
        />

        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          style={{ flex: 1 }}
        >
          <View style={styles.baseVw}>
            <View style={[{ marginVertical: 10, borderRadius: 10 }]}>
              <List.Accordion
                title="Customer Profile"
                titleStyle={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: Colors.BLACK,
                }}
                style={{
                  backgroundColor: expanded == true ? Colors.RED : Colors.WHITE,
                }}
                left={(props) => (
                  <VectorImage
                    height={25}
                    width={25}
                    source={CUSTOMER_PROFILE}
                  />
                )}
                expanded={expanded}
                onPress={handlePress}
              >
                <View style={{ width: "100%" }}>
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
              </List.Accordion>
            </View>
          </View>
        </ScrollView>

        {/* // 5. Finance Details */}
        <DropDownComponant
          visible={false}
          headerTitle={"Finance Details"}
          data={[]}
          selectedItems={(item) => {
            console.log("selected: ", item);
          }}
        />

        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          style={{ flex: 1 }}
        >
          <View style={styles.baseVw}>
            <View style={[{ marginVertical: 10, borderRadius: 10 }]}>
              <List.Accordion
                title="Finance Details"
                titleStyle={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: Colors.BLACK,
                }}
                style={{
                  backgroundColor: expanded == true ? Colors.RED : Colors.WHITE,
                }}
                left={(props) => (
                  <VectorImage
                    height={25}
                    width={25}
                    source={FINANCE_DETAILS}
                  />
                )}
                expanded={expanded}
                onPress={handlePress}
              >
                <View style={{ width: "100%" }}>
                  <DropDownSelectionItem
                    label={"Retail Finance*"}
                    value={"Cash"}
                    onPress={() => {}}
                  />
                </View>
              </List.Accordion>
            </View>
          </View>
        </ScrollView>

        {/* // 6. Upload Documents */}
        <DropDownComponant
          visible={false}
          headerTitle={"Upload Documents"}
          data={[]}
          selectedItems={(item) => {
            console.log("selected: ", item);
          }}
        />

        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          style={{ flex: 1 }}
        >
          <View style={styles.baseVw}>
            <View style={[{ marginVertical: 10, borderRadius: 10 }]}>
              <List.Accordion
                title="Upload Documents"
                titleStyle={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: Colors.BLACK,
                }}
                style={{
                  backgroundColor: expanded == true ? Colors.RED : Colors.WHITE,
                }}
                left={(props) => (
                  <VectorImage
                    height={25}
                    width={25}
                    source={DOCUMENT_UPLOAD}
                  />
                )}
                expanded={expanded}
                onPress={handlePress}
              >
                <View style={{ width: "100%" }}>
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
              </List.Accordion>
            </View>
          </View>
        </ScrollView>

        {/* // 7. Customer Need Analysis */}
        <DropDownComponant
          visible={false}
          headerTitle={"Customer Need Analysis"}
          data={[]}
          selectedItems={(item) => {
            console.log("selected: ", item);
          }}
        />

        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          style={{ flex: 1 }}
        >
          <View style={styles.baseVw}>
            <View style={[{ marginVertical: 10, borderRadius: 10 }]}>
              <List.Accordion
                title="Customer Need Analysis"
                titleStyle={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: Colors.BLACK,
                }}
                style={{
                  backgroundColor: expanded == true ? Colors.RED : Colors.WHITE,
                }}
                left={(props) => (
                  <VectorImage
                    height={25}
                    width={25}
                    source={CUSTOMER_NEED_ANALYSIS}
                  />
                )}
                expanded={expanded}
                onPress={handlePress}
              >
                <View style={{ width: "100%" }}>
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
              </List.Accordion>
            </View>
          </View>
        </ScrollView>
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
});
