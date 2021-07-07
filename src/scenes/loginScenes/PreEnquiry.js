import React, { useState } from "react";
import { TextInput } from "react-native-paper";

import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import { Colors } from "../../styles";
import CheckBox from "@react-native-community/checkbox";
import { TextinputComp } from "../../components/textinputComp";
import { ButtonComp } from "../../components/buttonComp";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";

const ScreenWidth = Dimensions.get("window").width;

const DATA = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
];

const _renderItem = (item) => {
  return (
    <View style={styles.item}>
      <Text style={styles.textItem}>{item.label}</Text>
    </View>
  );
};
const ContactScreen = () => {
  const loginButtonClicked = () => {
    navigation.navigate(AuthNavigator.AuthStackIdentifiers.CONTACT);
  };

  const [shadowOffsetWidth, setShadowOffsetWidth] = useState(0);
  const [shadowOffsetHeight, setShadowOffsetHeight] = useState(0);
  const [shadowRadius, setShadowRadius] = useState(0);
  const [shadowOpacity, setShadowOpacity] = useState(0.1);
  const [dropdown, setDropdown] = useState(null);
  const [selected, setSelected] = useState([]);
  const [timesPressed, setTimesPressed] = useState(0);
  const [value, setValue] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Select");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <Text
            style={{
              color: Colors.Black,
              fontSize: 24,
              fontWeight: "bold",
              marginTop: 20,
              marginLeft: 35,
            }}
          >
            {" "}
            Create new contact
          </Text>
        </View>

        <View style={{ padding: 10 }}></View>

        <View>
          <View style={{ marginRight: 280, marginLeft: 35 }}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={(newValue) => setToggleCheckBox(newValue)}
            />
          </View>

          <View>
            <Text
              style={{
                marginTop: -25,
                marginLeft: 65,
                fontWeight: "500",
                fontSize: 12,
              }}
            >
              Create Enquiry
            </Text>
          </View>

          <View style={{ marginTop: -25, marginLeft: 290 }}>
            <View>
              <Pressable
                onPress={() => {
                  setTimesPressed((current) => current + 1);
                }}
              >
                {({ pressed }) => (
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      color: "blue",
                      fontSize: 12,
                    }}
                  >
                    {pressed ? "form" : "Reset"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
        <View style={{ padding: 12 }}></View>
        <View
          style={[
            styles.square,
            {
              shadowOffset: {
                width: shadowOffsetWidth,
                height: -shadowOffsetHeight,
              },
              shadowOpacity,
              shadowRadius,
            },
          ]}
        >
          <View style={{ width: 300, margin: 10, height: 30 }}>
            <TextinputComp
              value={value}
              label={"First Name"}
              mode={"outfill"}
              onChangeText={(text) => setValue(text)}
            />

            <View style={{ height: 25 }}></View>

            <TextinputComp
              value={value}
              label={"Last Name"}
              mode={"outfill"}
              onChangeText={(text) => setValue(text)}
            />

            <View style={{ height: 25 }}></View>

            <TextinputComp
              value={value}
              label={"Mobile Number"}
              mode={"outfill"}
              onChangeText={(text) => setValue(text)}
            />

            <View style={{ height: 25 }}></View>

            <TextinputComp
              value={value}
              label={"Alternate Mobile Number"}
              mode={"outfill"}
              onChangeText={(text) => setValue(text)}
            />

            <View style={{ height: 25 }}></View>

            <TextinputComp
              value={value}
              label={"Email Id"}
              mode={"outfill"}
              onChangeText={(text) => setValue(text)}
            />

            <View style={{ height: 25 }}></View>

            <View>
              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.shadow}
                data={DATA}
                search
                searchPlaceholder="Search"
                labelField="label"
                valueField="value"
                label="Dropdown"
                placeholder="Select Modal"
                value={dropdown}
                onChange={(item) => {
                  setDropdown(item.value);
                  console.log("selected", item);
                }}
                renderLeftIcon={() => <Text></Text>}
                renderItem={(item) => _renderItem(item)}
                textError="Error"
              />

              <View style={{ height: 25 }}></View>

              <MultiSelect
                style={styles.dropdown}
                data={DATA}
                labelField="label"
                valueField="value"
                label="Multi Select"
                placeholder="Select Enquiry Segment"
                search
                searchPlaceholder="Search"
                value={selected}
                onChange={(item) => {
                  setSelected(item);
                  console.log("selected", item);
                }}
                renderItem={(item) => _renderItem(item)}
              />

              <View style={{ height: 25 }}></View>

              <MultiSelect
                style={styles.dropdown}
                data={DATA}
                labelField="label"
                valueField="value"
                label="Multi Select"
                placeholder="Select Customer Type"
                search
                searchPlaceholder="Search"
                value={selected}
                onChange={(item) => {
                  setSelected(item);
                  console.log("selected", item);
                }}
                renderItem={(item) => _renderItem(item)}
              />

              <View style={{ height: 25 }}></View>

              <MultiSelect
                style={styles.dropdown}
                data={DATA}
                labelField="label"
                valueField="value"
                label="Multi Select"
                placeholder="Select Source of pre enquiry"
                search
                searchPlaceholder="Search"
                value={selected}
                onChange={(item) => {
                  setSelected(item);
                  console.log("selected", item);
                }}
                renderItem={(item) => _renderItem(item)}
              />
            </View>
            <View style={{ height: 25 }}></View>
            <TextinputComp
              value={value}
              label={"Pincode"}
              mode={"outfill"}
              onChangeText={(text) => setValue(text)}
            />
          </View>
        </View>
        <View style={{ height: 25 }}></View>
        <View style={{ padding: 15 }}></View>
        <View
          style={{
            width: 315,
            paddingLeft: 40,
            marginBottom: 30,
          }}
        >
          <ButtonComp
            title={"Submit"}
            width={ScreenWidth - 80}
            onPress={loginButtonClicked}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#f8f8f8",
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
  btn: {
    textDecorationLine: "underline",
  },
  dropdown: {
    backgroundColor: "white",
    borderBottomColor: "#b3bab5",
    borderBottomWidth: 1,
    color: "#b3bab5",
    marginTop: 0,
    paddingLeft: 10,
  },
  icon: {
    marginRight: 5,
    width: 18,
    height: 18,
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  wrapperCustom: {
    borderRadius: 1,
  },
  square: {
    alignSelf: "center",
    backgroundColor: Colors.WHITE,
    borderRadius: 8,

    height: 640,

    width: 320,
  },
});
