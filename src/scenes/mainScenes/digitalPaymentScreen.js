import React, { useState, useRef, useEffect } from "react";
import { Colors } from "../../styles";
import {
  View,
  StyleSheet,
  Image,
} from "react-native";
import { IconButton } from "react-native-paper";





const DigitalPaymentScreen = ({navigation}) => {

  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    fetch(
      "http://automatestaging-724985329.ap-south-1.elb.amazonaws.com:8093/dynamic-reports/get-qrCode/1"
    )
      .then((response) => response.json())
      .then((json) => setDataList(json))
      .catch((error) => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
     
      <IconButton
        icon="close"
        color={Colors.BLACK}
        size={30}
        onPress={() => navigation.navigate("Home")}
      />

      <Image
        style={styles.tinyLogo}
        source={{
          uri: "https://automate-utils.s3.ap-south-1.amazonaws.com/Organization/BharatHyundai/Hyundai.jpg",
        }}
      />
    </View>
  );
};
export default DigitalPaymentScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rootStyle: {
    flex: 1,
    flexDirection: "column",
  },
  tinyLogo: {
    width: 300,
    height: 300,
    
    alignItems: "center",
    justifyContent: "center",
  },
});
