import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,alert,Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../styles";
import PhoneInput from "react-native-phone-number-input";


export const HelpDeskItem = ({ name }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <SafeAreaView>
      <View style={styles.container1}>
        <Text>Phone Number </Text>
        <PhoneInput
          defaultValue={phoneNumber}
          defaultCode="IN"
          withShadow
          maxlenghth={10}
          minlength={20}
          keyboardType={"phone-pad"}
          onChangeFormattedText={(text) => {
            setPhoneNumber(text);
          }}
        />
        <TouchableOpacity
          styles={styles.phoneButton}
          onPress={() => {
            Alert.alert("please enter valid phoneNumber");
          }}
        >
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: Colors.WHITE,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems:"center",
  },
  text1: {
    color: Colors.BLACK,
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
