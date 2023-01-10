import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  StatusBar,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Colors, GlobalStyle } from "../../styles";
import { TextinputComp } from "../../components/textinputComp";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../utils/authContext";
import { LoaderComponent } from "../../components";
import * as AsyncStore from "../../asyncStore";
import {
  showAlertMessage,
  showToast,
  showToastRedAlert,
} from "../../utils/toast";
import BackgroundService from "react-native-background-actions";
import URL from "../../networking/endpoints";
import { client } from "../../networking/client";
import {
  isEmail,
  isValidate,
  PincodeDetailsNew,
  setBranchId,
  setBranchName,
} from "../../utils/helperFunctions";
import { DropDownSelectionItem, RadioTextItem } from "../../pureComponents";
import { NewDropDownComponent } from "../../components/dropDownComponent";
import { Dropdown } from "react-native-element-dropdown";
import { AuthStackIdentifiers } from "../../navigations/authNavigator";

// import { TextInput } from 'react-native-paper';
const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;

const RegisterScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const fadeAnima = useRef(new Animated.Value(0)).current;
  const { signIn } = React.useContext(AuthContext);
  const [text, setText] = React.useState("");
  const [number, onChangeNumber] = React.useState(null);
  const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [Designation, setDesignation] = useState("");
  const [rolelist, setRolelist] = useState("");
  const [Designationlist, setDesignationlist] = useState("");
  const [addressData, setAddressData] = useState([]);
  const [addressData2, setAddressData2] = useState([]);
  const [permanentAddress, setPermanentAddress] = useState({
    pincode: "",
    isUrban: "",
    isRural: null,
    houseNo: "",
    street: "",
    village: "",
    city: "",
    district: "",
    state: "",
    mandal: "",
    country: null,
  });
  const [communicationAddress, setCommunication] = useState({
    pincode: "",
    isUrban: "",
    isRural: null,
    houseNo: "",
    street: "",
    village: "",
    city: "",
    district: "",
    state: "",
    mandal: "",
    country: null,
  });

  useEffect(async () => {
    try {
      const response = await client.get(URL.GET_ROLES_LIST());
      const response2 = await client.get(URL.GET_DESGINATION_LIST());
      const json = await response.json();
      const json2 = await response2.json();
      if (json && json2) {
        setRolelist(json);
        setDesignationlist(json2);
      }
    } catch (error) {}
  }, []);


  const updateAddressDetails = (pincode) => {
    if (pincode.length != 6) {
      return;
    }

    PincodeDetailsNew(pincode).then(
      (res) => {
        // dispatch an action to update address
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
        // dispatch(updateAddressByPincode(resolve));
      },
      (rejected) => {}
    );
  };

  const updateAddressDetails2 = (pincode) => {
    if (pincode.length != 6) {
      return;
    }

    PincodeDetailsNew(pincode).then(
      (res) => {
        // dispatch an action to update address
        let tempAddr = [];
        if (res) {
          if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              tempAddr.push({ label: res[i].Name, value: res[i] });
              if (i === res.length - 1) {
                setAddressData2([...tempAddr]);
              }
            }
          }
        }
        // dispatch(updateAddressByPincode(resolve));
      },
      (rejected) => {}
    );
  };

  const onSubmit = async () => {
    if (email.length == 0) {
      showToastRedAlert("Please enter Email");
      return;
    }

    if (!isEmail(email)) {
      showToast("Please enter valid email");
      return;
    }
    if (userName.length == 0) {
      showToastRedAlert("Please enter Name");
      return;
    }
    if (!isValidate(userName)) {
      showToast("Please enter alphabetics only in Name");
      return;
    }

    if (mobileNo.length == 0) {
      showToastRedAlert("Please enter mobile number");
      return;
    }
    if (role.length === 0) {
      showToast("Please Select Any Role");
      return;
    }
    if (Designation.length === 0) {
      showToast("Please Select Any Designaion");
      return;
    }
    //  if (password.length > 8) {
    //    showToastRedAlert("Password length must be greater than 8");
    //    return;
    //  }
    //  if (password !== confirmPassword) {
    //    showToastRedAlert("Please Enter Confirm Password Same as Password");
    //    return;
    //  }
    if (communicationAddress.pincode.length === 0) {
      showToast("Please enter Communication pincode");
      return;
    }
    if (permanentAddress.pincode.length === 0) {
      showToast("Please enter Permanent pincode");
      return;
    }

    let payload = {
      email: email,
      empName: userName,
      dmsRole: role,
      mobile: mobileNo,
      dmsDesignation: Designation,
      // password: password,
      address: {
        presentAddress: {
          pincode: communicationAddress.pincode,
          isUrban: communicationAddress.isUrban,
          isRural: communicationAddress.isRural,
          houseNo: communicationAddress.houseNo,
          street: communicationAddress.street,
          village: communicationAddress.village,
          city: communicationAddress.city,
          district: communicationAddress.district,
          state: communicationAddress.state,
          country: null,
        },
        permanentAddress: {
          pincode: permanentAddress.pincode,
          isUrban: permanentAddress.isUrban,
          isRural: permanentAddress.isRural,
          houseNo: permanentAddress.houseNo,
          street: permanentAddress.street,
          village: permanentAddress.village,
          city: permanentAddress.city,
          district: permanentAddress.district,
          state: permanentAddress.state,
          country: null,
        },
      },
    };

    const response = await client.post(URL.SAVE_EMPLOYEE(), payload);
    const json = await response.json();
    console.log("SAVESDDDD", json);
    if (json) {
      showToastRedAlert("Your Account is Successfully created");
      navigation.reset({
        index: 0,
        routes: [{ name: AuthStackIdentifiers.LOGIN }],
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <LoaderComponent visible={selector.isLoading} onRequestClose={() => {}} />
      <ScrollView
        // contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="always"
        scrollEnabled
        style={{
          //   flexGrow: 1,
          //   position: "absolute",
          paddingHorizontal: 20,
          //   paddingTop: 30,
          //   marginTop: ScreenHeight * 0.18,
          backgroundColor: Colors.WHITE,
          //   borderTopEndRadius: 4,
        }}
      >
        <View
          style={{ flexDirection: "column", backgroundColor: Colors.WHITE }}
        >
          <View
            style={{
              width: "100%",
              height: ScreenHeight * 0.23,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ width: 200, height: ScreenHeight * 0.4 }}
              resizeMode={"center"}
              source={require("../../assets/images/logo.png")}
            />
          </View>
        </View>
        <Text style={styles.welcomeStyle}>{"Register"}</Text>
        <TextinputComp
          value={email}
          error={selector.showLoginErr}
          errorMsg={selector.loginErrMessage}
          label={"Email"}
          mode={"outlined"}
          onChangeText={(text) => setEmail(text)}
        />
        <View style={{ height: 10 }} />
        <TextinputComp
          value={userName}
          error={selector.showLoginErr}
          errorMsg={selector.loginErrMessage}
          label={"Name"}
          mode={"outlined"}
          onChangeText={(text) => setUserName(text)}
        />
        <View style={{ height: 10 }} />
        <TextinputComp
          value={mobileNo}
          error={selector.showLoginErr}
          errorMsg={selector.loginErrMessage}
          label={"Mobile Number"}
          mode={"outlined"}
          maxLength={10}
          onChangeText={(text) => setMobileNo(text)}
        />
        <View style={{ height: 10 }} />
        <NewDropDownComponent
          // value={selector.employeeId}
          error={selector.showLoginErr}
          errorMsg={selector.loginErrMessage}
          label={"Role"}
          mode={"outlined"}
          labelField={"roleName"}
          valueField={"roleName"}
          data={rolelist ? rolelist : []}
          showDropDown={() => setShowMultiSelectDropDown(true)}
          onDismiss={() => setShowMultiSelectDropDown(false)}
          visible={showMultiSelectDropDown}
          onChangeText={(text) => {
            setRole(text.roleId);
          }}
        />
        <View style={{ height: 10 }} />
        <NewDropDownComponent
          // value={selector.employeeId}
          error={selector.showLoginErr}
          errorMsg={selector.loginErrMessage}
          label={"Designation"}
          mode={"outlined"}
          labelField={"designationName"}
          valueField={"designationName"}
          data={Designationlist ? Designationlist : []}
          showDropDown={() => setShowMultiSelectDropDown(false)}
          onDismiss={() => setShowMultiSelectDropDown(false)}
          visible={showMultiSelectDropDown}
          onChangeText={(text) => {
            setDesignation(text.dmsDesignationId);
          }}
        />

        {/* <View style={{ height: 20 }}></View> */}
        {/* <TextinputComp
          value={password}
          error={selector.showPasswordErr}
          errorMsg={selector.passwordErrMessage}
          label={"Password"}
          mode={"outlined"}
          isSecure={selector.securePassword}
          showRightIcon={true}
          rightIconObj={{
            name: selector.securePassword ? "eye-off-outline" : "eye-outline",
            color: Colors.GRAY,
          }}
          onChangeText={(text) => setPassword(text)}
          onRightIconPressed={() => dispatch(updateSecurePassword())}
        /> */}
        {/* <View style={{ height: 20 }}></View> */}
        {/* <TextinputComp
          value={confirmPassword}
          error={selector.showPasswordErr}
          errorMsg={selector.passwordErrMessage}
          label={"Confirm Password"}
          mode={"outlined"}
          isSecure={selector.securePassword}
          showRightIcon={true}
          rightIconObj={{
            name: selector.securePassword ? "eye-off-outline" : "eye-outline",
            color: Colors.GRAY,
          }}
          onChangeText={(text) => setConfirmPassword(text)}
          onRightIconPressed={() => dispatch(updateSecurePassword())}
        /> */}
        <View style={{ height: 10 }} />
        <TextinputComp
          // style={styles.textInputStyle}
          mode={"outlined"}
          value={communicationAddress.pincode}
          label={"Pincode*"}
          maxLength={6}
          keyboardType={"phone-pad"}
          onChangeText={(text) => {
            // get addreess by pincode
            setCommunication({
              ...communicationAddress,
              ...(communicationAddress.pincode = text),
            });
            sameAsPermanent &&
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.pincode = text),
              });
            if (text.length === 6) {
              updateAddressDetails(text);
            }
          }}
        />
        <Text
          style={[
            GlobalStyle.underline,
            {
              backgroundColor: false ? "red" : "rgba(208, 212, 214, 0.7)",
            },
          ]}
        ></Text>

        {addressData?.length > 0 && (
          <>
            <View style={{ height: 10 }} />
            <Text style={GlobalStyle.underline}></Text>
            <Dropdown
              style={[
                styles.dropdownContainer,
                {
                  height: 50,
                  width: "100%",
                  fontSize: 16,
                  fontWeight: "400",
                  backgroundColor: Colors.WHITE,
                  borderColor: Colors.BLACK,
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 6,
                  padding: 15,
                },
              ]}
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
              value={"defaultAddress"}
              // onFocus={() => setIsFocus(true)}
              // onBlur={() => setIsFocus(false)}
              onChange={(val) => {
                setCommunication({
                  ...communicationAddress,
                  ...((communicationAddress.village = val.value.Block),
                  (communicationAddress.mandal = val.value.Mandal),
                  (communicationAddress.district = val.value.District),
                  (communicationAddress.city = val.value.District),
                  (communicationAddress.state = val.value.State)),
                });
              }}
            />
          </>
        )}
        <Text style={GlobalStyle.underline}></Text>
        <View style={styles.radioGroupBcVw}>
          <RadioTextItem
            label={"Urban"}
            value={"urban"}
            status={communicationAddress.isUrban ? true : false}
            onPress={() => {
              setCommunication({
                ...communicationAddress,
                ...((communicationAddress.isUrban = true),
                (communicationAddress.isRural = false)),
              });
              sameAsPermanent &&
                setPermanentAddress({
                  ...permanentAddress,
                  ...((permanentAddress.isRural = false),
                  (permanentAddress.isUrban = true)),
                });
            }}
          />
          <RadioTextItem
            label={"Rural"}
            value={"rural"}
            status={communicationAddress.isRural ? true : false}
            onPress={() => {
              setCommunication({
                ...communicationAddress,
                ...((communicationAddress.isRural = true),
                (communicationAddress.isUrban = false)),
              });
              sameAsPermanent &&
                setPermanentAddress({
                  ...permanentAddress,
                  ...((permanentAddress.isRural = true),
                  (permanentAddress.isUrban = false)),
                });
            }}
          />
        </View>
        <TextinputComp
          mode={"outlined"}
          value={communicationAddress.houseNo}
          label={"H.No"}
          maxLength={50}
          keyboardType={"number-pad"}
          onChangeText={(text) => {
            setCommunication({
              ...communicationAddress,
              ...(communicationAddress.houseNo = text),
            });
            sameAsPermanent &&
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.houseNo = text),
              });
          }}
        />
        <View style={{ height: 10 }} />
        <TextinputComp
          mode={"outlined"}
          value={communicationAddress.street}
          label={"Street Name"}
          autoCapitalize="words"
          maxLength={120}
          keyboardType={"default"}
          onChangeText={(text) => {
            setCommunication({
              ...communicationAddress,
              ...(communicationAddress.street = text),
            });
            sameAsPermanent &&
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.street = text),
              });
          }}
        />
        <View style={{ height: 10 }} />
        <>
          <TextinputComp
            mode={"outlined"}
            value={communicationAddress.village}
            label={"Village/Town"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) => {
              setCommunication({
                ...communicationAddress,
                ...(communicationAddress.village = text),
              });
              sameAsPermanent &&
                setPermanentAddress({
                  ...permanentAddress,
                  ...(permanentAddress.village = text),
                });
            }}
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={communicationAddress.mandal}
            label={"Mandal/Tahsil"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) => {
              setCommunication({
                ...communicationAddress,
                ...(communicationAddress.mandal = text),
              });
              sameAsPermanent &&
                setPermanentAddress({
                  ...permanentAddress,
                  ...(permanentAddress.mandal = text),
                });
            }}
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={communicationAddress.city}
            label={"City"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setCommunication({
                ...communicationAddress,
                ...(communicationAddress.city = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={communicationAddress.district}
            label={"District"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setCommunication({
                ...communicationAddress,
                ...(communicationAddress.district = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={communicationAddress.state}
            label={"State"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setCommunication({
                ...communicationAddress,
                ...(communicationAddress.state = text),
              })
            }
          />
          <View style={{ height: 10 }} />
        </>
        {/* )} */}
        <View style={{ height: 20, backgroundColor: Colors.WHITE }}></View>

        {/* // Permanent Addresss */}
        <View style={{ backgroundColor: Colors.WHITE, paddingLeft: 12 }}>
          <Text style={styles.permanentAddText}>
            {"Permanent Address Same as Communication Address"}
          </Text>
        </View>
        <View style={styles.radioGroupBcVw}>
          <RadioTextItem
            label={"Yes"}
            value={"yes"}
            status={sameAsPermanent ? true : false}
            onPress={() => {
              setSameAsPermanent(true);
              setPermanentAddress(communicationAddress);
            }}
          />
          <RadioTextItem
            label={"No"}
            value={"no"}
            status={!sameAsPermanent ? true : false}
            onPress={() => {
              setSameAsPermanent(false);
              setPermanentAddress({
                pincode: "",
                isUrban: "",
                isRural: null,
                houseNo: "",
                street: "",
                village: "",
                city: "",
                district: "",
                state: "",
                mandal: "",
                country: null,
              });
            }}
          />
        </View>
        <View style={{ height: 10 }} />
        <View>
          <TextinputComp
            mode={"outlined"}
            value={permanentAddress.pincode}
            label={"Pincode*"}
            maxLength={6}
            keyboardType={"phone-pad"}
            onChangeText={(text) => {
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.pincode = text),
              });
              if (text.length === 6) {
                updateAddressDetails2(text);
              }
            }}
          />
          <Text
            style={[
              GlobalStyle.underline,
              {
                backgroundColor: false ? "red" : "rgba(208, 212, 214, 0.7)",
              },
            ]}
          ></Text>

          {addressData2?.length > 0 && (
            <>
              <View style={{ height: 10 }} />
              <Text style={GlobalStyle.underline}></Text>
              <Dropdown
                mode={"outlined"}
                style={[
                  styles.dropdownContainer,
                  {
                    height: 50,
                    width: "100%",
                    fontSize: 16,
                    fontWeight: "400",
                    backgroundColor: Colors.WHITE,
                    borderColor: Colors.BLACK,
                    borderWidth: 1,
                    marginTop: 10,
                    borderRadius: 6,
                    padding: 15,
                  },
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={addressData2}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={"Select address"}
                searchPlaceholder="Search..."
                // value={defaultAddress}
                // onFocus={() => setIsFocus(true)}
                // onBlur={() => setIsFocus(false)}
                onChange={(val) => {
                  setPermanentAddress({
                    ...permanentAddress,
                    ...((permanentAddress.village = val.value.Block),
                    (permanentAddress.mandal = val.value.Mandal),
                    (permanentAddress.district = val.value.District),
                    (permanentAddress.city = val.value.District),
                    (permanentAddress.state = val.value.State)),
                  });
                }}
              />
            </>
          )}

          <View style={styles.radioGroupBcVw}>
            <RadioTextItem
              label={"Urban"}
              value={"urban"}
              status={permanentAddress.isUrban ? true : false}
              onPress={() =>
                setPermanentAddress({
                  ...permanentAddress,
                  ...((permanentAddress.isUrban = true),
                  (permanentAddress.isRural = false)),
                })
              }
            />
            <RadioTextItem
              label={"Rural"}
              value={"rural"}
              status={permanentAddress.isRural ? true : false}
              onPress={() =>
                setPermanentAddress({
                  ...permanentAddress,
                  ...((permanentAddress.isUrban = false),
                  (permanentAddress.isRural = true)),
                })
              }
            />
          </View>
          <TextinputComp
            mode={"outlined"}
            label={"H.No"}
            // keyboardType={"number-pad"}
            maxLength={50}
            value={permanentAddress.houseNo}
            onChangeText={(text) =>
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.houseNo = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            label={"Street Name"}
            autoCapitalize="words"
            keyboardType={"default"}
            maxLength={50}
            value={permanentAddress.street}
            onChangeText={(text) =>
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.street = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={permanentAddress.village}
            label={"Village/Town"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.village = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={permanentAddress.mandal}
            label={"Mandal"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.mandal = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={permanentAddress.city}
            label={"City"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.city = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={permanentAddress.district}
            label={"District"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.district = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={permanentAddress.state}
            label={"State"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.state = text),
              })
            }
          />
          <View style={{ height: 10 }} />
        </View>
        {/* <View style={styles.forgotView}>
            <Pressable onPress={forgotClicked}>
              <Text style={styles.forgotText}>{"Forgot Password?"}</Text>
            </Pressable>
          </View> */}
        <View style={{ height: 40 }}></View>
        <Pressable style={styles.loginButton} onPress={() => onSubmit()}>
          <Text style={styles.buttonText}>Register your Account</Text>
        </Pressable>
        <Image
          source={require("../../assets/images/loginCar.jpg")}
          style={styles.loginImage}
        />
        {/* <Pressable
            style={styles.signUpButton}
            // onPress={loginClicked()}
          >
            <Text style={styles.signUpText}>Don't have an account? <Text style={styles.signUpSubtext}>Sign Up</Text></Text>
          </Pressable> */}
        {/* <ButtonComp
            title={"Login to Account"}
            width={ScreenWidth - 40}
            onPress={loginClicked}
            disabled={selector.isLoading ? true : false}
          /> */}
        {/* <View style={{ width: "100%", height: 50, justifyContent: "center", alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: "400", color: Colors.GRAY }}>{"Version: 0.4"}</Text>
          </View> */}

        {/* Bottom Popup */}
        {/* <Animated.View style={[styles.bottomView, { opacity: fadeAnima }]}>
            <View style={styles.bottomVwSubVw}>
              <Text style={styles.text1}>{"User’s Profile"}</Text>
              <Text style={styles.text2}>
                {
                  "Thanks to user’s profile your vehicles, service books and messages will be stored safely in a cloud, so you do not have to worry about that anymore."
                }
              </Text>
            </View>
            <IconButton
              style={styles.closeStyle}
              icon="close"
              color={Colors.DARK_GRAY}
              size={20}
              onPress={closeBottomView}
            />
          </Animated.View> */}

        {/* </KeyboardAvoidingView> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.WHITE,
    justifyContent: "center",
  },
  welcomeStyle: {
    fontSize: 24,
    color: Colors.BLACK,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },
  forgotView: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  forgotText: {
    paddingTop: 15,
    fontSize: 12,
    fontWeight: "400",
    color: Colors.BLACK,
    fontWeight: "bold",
    textAlign: "right",
  },
  bottomView: {
    // position: "absolute",
    bottom: 0,
    backgroundColor: Colors.LIGHT_GRAY,
    // paddingVertical: 20,
  },
  bottomVwSubVw: {
    paddingHorizontal: 30,
  },
  text1: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 15,
  },
  text2: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.DARK_GRAY,
  },
  closeStyle: {
    position: "absolute",
    marginTop: 10,
    right: 20,
  },
  loginButton: {
    backgroundColor: "#f81567",
    height: 50,
    width: ScreenWidth - 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontWeight: "bold",
    color: Colors.WHITE,
  },
  loginImage: {
    width: ScreenWidth - 40,
    height: 100,
    marginTop: 30,
  },
  signUpText: {
    alignSelf: "center",
    marginTop: 25,
  },
  signUpSubtext: {
    fontWeight: "bold",
  },
  textInputStyle: {
    height: 50,
    width: "100%",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    padding: 16,
    // borderWidth: 1,
    width: "100%",
    height: 50,
    borderRadius: 5,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
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
    fontWeight: "700",
  },
});
