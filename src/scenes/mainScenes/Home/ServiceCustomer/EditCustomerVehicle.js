import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { Colors, GlobalStyle } from '../../../../styles';
import { TextinputComp } from '../../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native';
import { DropDownSelectionItem } from '../../../../pureComponents';

const EditCustomerVehicle = ({ navigation, route }) => {
const dispatch = useDispatch();
const scrollRef = useRef(null);
  const selector = useSelector((state) => state.editCustomerInfoReducer);

  const [isSubmitPress, setIsSubmitPress] = useState(false);

  useEffect(() => {
    getCustomerType();
    return () => {
      clearLocalData();
      dispatch(clearStateData());
    };
  }, []);

  const clearLocalData = () => {
    setAddressData([]);
    setDefaultAddress(null);
    setDropDownKey("");
    setDropDownTitle("Select Data");
    setShowDropDownModel(false);
    setDataForDropDown([]);
    setIsSubmitPress(false);
    setDatePickerMode("date");
  };
  
  return (
    <SafeAreaView style={styles.container}>
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
          ref={scrollRef}
        >
          <TextinputComp
            value={selector.vehicleRegNo}
            label={"Vehicle Reg. No*"}
            onChangeText={(text) =>
              dispatch(
                setVehicleInformation({ key: "VEHICLE_REG_NO", text: text })
              )
            }
          />
          <Text
            style={[
              GlobalStyle.underline,
              {
                backgroundColor:
                  isSubmitPress && selector.vehicleRegNo.trim() === ""
                    ? "red"
                    : "rgba(208, 212, 214, 0.7)",
              },
            ]}
          />
          <Text style={GlobalStyle.underline} />
          <DropDownSelectionItem
            label={"Vehicle Make"}
            value={selector.vehicleMaker}
            onPress={() =>
              showDropDownModelMethod("VEHICLE_MAKER", "Select Vehicle Make")
            }
          />
          <Text style={GlobalStyle.underline} />
          <DropDownSelectionItem
            label={"Model"}
            value={selector.vehicleModel}
            onPress={() =>
              showDropDownModelMethod("VEHICLE_MODEL", "Select Vehicle Model")
            }
          />
          <Text style={GlobalStyle.underline} />
          <DropDownSelectionItem
            label={"Variant"}
            value={selector.vehicleVariant}
            onPress={() =>
              showDropDownModelMethod(
                "VEHICLE_VARIANT",
                "Select Vehicle Variant"
              )
            }
          />
          <Text style={GlobalStyle.underline} />
          <DropDownSelectionItem
            label={"Color"}
            value={selector.vehicleColor}
            onPress={() =>
              showDropDownModelMethod("VEHICLE_COLOR", "Select Vehicle Color")
            }
          />
          <Text style={GlobalStyle.underline} />

          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              style={{ width: "30%" }}
              color={Colors.GRAY}
              labelStyle={{ textTransform: "none", color: Colors.WHITE }}
              onPress={() => navigation.goBack()}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              style={{ width: "30%" }}
              color={Colors.PINK}
              labelStyle={{ textTransform: "none", color: Colors.WHITE }}
              onPress={() => navigation.goBack()}
            >
              Save
            </Button>
          </View>
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



  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 20,
  },
});

export default EditCustomerVehicle;