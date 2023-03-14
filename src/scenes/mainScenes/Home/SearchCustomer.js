import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { ButtonComp, DropDownComponant, TextinputComp } from '../../../components';
import { DropDownSelectionItem } from '../../../pureComponents';
import { Colors, GlobalStyle } from '../../../styles';

const SearchCustomer = ({ navigation, route }) => {
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);

  const showDropDownModelMethod = (key, headerText, oid) => {
    Keyboard.dismiss();
    // switch (key) {
    //   case "CAR_MODEL":
    //     setDataForDropDown([...dataForCarModels]);
    //     break;
    // }
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
        }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
      >
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.boxContainer}>
            <TextinputComp
              style={styles.textInputComp}
              label={"Vehicle Reg.No"}
            />
            <Text style={GlobalStyle.underline} />
            <TextinputComp style={styles.textInputComp} label={"Contact No"} />
            <Text style={GlobalStyle.underline} />
            <TextinputComp style={styles.textInputComp} label={"Vin Number"} />
            <Text style={GlobalStyle.underline} />
            <TextinputComp
              style={styles.textInputComp}
              label={"Customer Name"}
            />
            <Text style={GlobalStyle.underline} />
            <DropDownSelectionItem
              label={"Service Type"}
              onPress={() =>
                showDropDownModelMethod("SERVICE_TYPE", "Select Service Type")
              }
            />
            <TextinputComp
              style={styles.textInputComp}
              label={"Engine Number"}
            />
            <Text style={GlobalStyle.underline} />
            <TextinputComp
              style={styles.textInputComp}
              label={"Policy Number"}
            />
            <Text style={GlobalStyle.underline} />
          </View>

          <View style={{ marginTop: 15 }}>
            <ButtonComp
              title={"Search"}
              onPress={() => navigation.navigate("SEARCH_CUSTOMER_RESULT")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: { flex: 1, margin: 10 },
  boxContainer: { borderRadius: 6, backgroundColor: Colors.WHITE },
});

export default SearchCustomer;