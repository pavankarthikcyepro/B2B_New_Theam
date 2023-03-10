import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "react-native";
import { Button, ToggleButton } from "react-native-paper";
import { TextinputComp } from "../../../../components";
import { RadioTextItem } from "../../../../pureComponents";
import { Colors, GlobalStyle } from "../../../../styles";
const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;

const ProfileAddress = ({ }) => {
  const [addressData, setAddressData] = useState([]);
  const [communicationAddress, setCommunication] = useState({
    pincode: "400004",
    isUrban: true,
    isRural: null,
    houseNo: "522",
    street: "Kankavati road",
    village: "Vapi",
    city: "VAPI",
    district: "Valsad",
    state: "Gujarat",
    mandal: "LOLO",
    country: null,
  });
  return (
    <View style={{ width: "90%", alignSelf: "center" }}>
      <TextinputComp
        // style={styles.textInputStyle}
        mode={"outlined"}
        value={communicationAddress.pincode}
        label={"Pincode*"}
        maxLength={6}
        disabled
        keyboardType={"phone-pad"}
        onChangeText={(text) => {
          // get addreess by pincode
          setCommunication({
            ...communicationAddress,
            ...(communicationAddress.pincode = text),
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
          {/* <View style={{ height: 10 }} /> */}
          <Text style={GlobalStyle.underline}></Text>
          <Dropdown
            disabled
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
      <View style={{ height: 5 }} />
      <View style={styles.radioGroupBcVw}>
        <RadioTextItem
          label={"Urban"}
          value={"urban"}
          status={communicationAddress.isUrban ? true : false}
          onPress={() => {
            // setCommunication({
            //   ...communicationAddress,
            //   ...((communicationAddress.isUrban = true),
            //   (communicationAddress.isRural = false)),
            // });
          }}
        />
        <RadioTextItem
          label={"Rural"}
          value={"rural"}
          status={communicationAddress.isRural ? true : false}
          onPress={() => {
            // setCommunication({
            //   ...communicationAddress,
            //   ...((communicationAddress.isRural = true),
            //   (communicationAddress.isUrban = false)),
            // });
          }}
        />
      </View>
      <View style={{ height: 5 }} />
      <TextinputComp
        disabled
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
        }}
      />
      <View style={{ height: 5 }} />
      <TextinputComp
        disabled
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
        }}
      />
      <>
        <View style={{ height: 5 }} />
        <TextinputComp
          disabled
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
          }}
        />
        <View style={{ height: 5 }} />
        <TextinputComp
          disabled
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
          }}
        />
        <View style={{ height: 5 }} />
        <TextinputComp
          disabled
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
        <View style={{ height: 5 }} />
        <TextinputComp
          disabled
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
        <View style={{ height: 5 }} />
        <TextinputComp
          disabled
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
      <Button
        mode="contained"
        style={{ width: "85%", alignSelf: "center", marginTop: 15 }}
        color={Colors.RED}
      >
        {"Edit Customer Address"}
      </Button>
    </View>
  );
};

export default ProfileAddress;

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
