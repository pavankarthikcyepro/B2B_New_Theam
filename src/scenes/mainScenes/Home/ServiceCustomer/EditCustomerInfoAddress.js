import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { TextinputComp } from '../../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { PincodeDetailsNew } from '../../../../utils/helperFunctions';
import { clearStateData, setCommunicationAddress, updateAddressByPincode } from '../../../../redux/editCustomerInfoReducer';
import { Colors, GlobalStyle } from '../../../../styles';
import { Dropdown } from 'react-native-element-dropdown';
import { Button, IconButton } from 'react-native-paper';
import { RadioTextItem } from '../../../../pureComponents';

const EditCustomerInfoAddress = ({ navigation, route }) => {
  const { editType } = route.params;
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const selector = useSelector((state) => state.editCustomerInfoReducer);
  const [addressData, setAddressData] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [title, setTitle] = useState("Edit Customer Info");
  
  useEffect(() => {
    if (editType && editType == "profile") {
      setTitle("Edit Customer Info");
    } else {
      setTitle("Edit Customer Address");
    }
    return () => {
      clearLocalData();
      dispatch(clearStateData());
    };
  }, []);

  const clearLocalData = () => {
    setAddressData([]);
    setDefaultAddress(null);
  };

  const updateAddressDetails = (pincode) => {
    if (pincode.length != 6) {
      return;
    }
    PincodeDetailsNew(pincode).then(
      (res) => {
        let tempAddr = [];
        if (res) {
          if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              tempAddr.push({ label: res[i].Name, value: res[i] });
              if (i === res.length - 1) {
                setAddressData([...tempAddr]);
              }
            }
          }
        }
      },
      (rejected) => {}
    );
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
          <Text style={styles.titleText}>{title}</Text>

          {editType == "profile" ? (
            <></>
          ) : (
            <>
              <TextinputComp
                value={selector.pincode}
                label={"Pincode"}
                maxLength={6}
                keyboardType={"number-pad"}
                onChangeText={(text) => {
                  if (text.length === 6) {
                    updateAddressDetails(text);
                  }
                  dispatch(
                    setCommunicationAddress({ key: "PINCODE", text: text })
                  );
                  setDefaultAddress(null);
                }}
              />
              {addressData.length > 0 && (
                <>
                  <Text style={GlobalStyle.underline}></Text>
                  <View style={styles.addressDropDownRow}>
                    <Dropdown
                      style={[styles.dropdownContainer]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={addressData}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={"Select address"}
                      searchPlaceholder="Search..."
                      value={defaultAddress}
                      onChange={(val) => {
                        dispatch(updateAddressByPincode(val.value));
                      }}
                    />

                    {selector.isAddressSet ? (
                      <IconButton
                        onPress={() => {
                          let tmp = addressData;
                          setAddressData([]);
                          setAddressData([...tmp]);
                          dispatch(updateAddressByPincode(""));
                        }}
                        icon="close-circle-outline"
                        color={Colors.BLACK}
                        size={20}
                        style={styles.addressClear}
                      />
                    ) : null}
                  </View>
                </>
              )}
              <Text style={GlobalStyle.underline} />
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
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.houseNum}
                label={"H.No"}
                maxLength={50}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({ key: "HOUSE_NO", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.streetName}
                label={"Street Name"}
                autoCapitalize="words"
                maxLength={120}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({
                      key: "STREET_NAME",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.village}
                label={"Village/Town"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({
                      key: "VILLAGE",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.mandal}
                label={"Mandal/Tahsil"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({
                      key: "MANDAL",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.city}
                label={"City"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(setCommunicationAddress({ key: "CITY", text: text }))
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.district}
                label={"District"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({
                      key: "DISTRICT",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.state}
                label={"State"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({
                      key: "STATE",
                      text: text,
                    })
                  )
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
            </>
          )}
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
  titleText: {
    fontSize: 14,
    color: Colors.DARK_GRAY,
    fontWeight: "bold",
    marginVertical: 10
  },
  dropdownContainer: {
    flex: 1,
    padding: 16,
    height: 50,
    borderRadius: 5,
  },
  addressDropDownRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  addressClear: {
    marginHorizontal: 0,
    paddingHorizontal: 5,
    borderLeftWidth: 1,
    borderRadius: 0,
    borderLeftColor: Colors.GRAY,
    alignSelf: "center",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  radioGroupBcVw: {
    flexDirection: "row",
    alignItems: "center",
    height: 65,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 50,
  },
});

export default EditCustomerInfoAddress;