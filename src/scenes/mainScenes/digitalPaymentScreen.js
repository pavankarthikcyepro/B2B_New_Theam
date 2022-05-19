import React, { useState, useRef, useEffect } from "react";
import { Colors } from "../../styles";
import {
  View,
  StyleSheet,
  Image,
  Text
} from "react-native";
import { IconButton } from "react-native-paper";
import * as AsyncStore from '../../asyncStore';
import { client } from "../../networking/client";
import URL from "../../networking/endpoints";

const DigitalPaymentScreen = ({navigation}) => {

  const [dataList, setDataList] = useState("https://www.bigpharmacy.com.my/scripts/timthumb.php");

  useEffect(() => {
    getQrCode();
  }, []);

  const getQrCode = async () => {
    const userData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    const branchId = await AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_ID);
    const { orgId } = JSON.parse(userData);
    const response = await client.get(URL.QR(orgId, branchId));
    const qr = await response.json();
    if (qr.length > 0) {
      setDataList(qr[0].documentPath);
    } else {
      setDataList("https://www.bigpharmacy.com.my/scripts/timthumb.php")
    }
  }

  return (
    <View style={styles.container}>
      {/* <Text>Scan QR Code</Text> */}
      {/* <IconButton
        icon="close"
        color={Colors.BLACK}
        size={30}
        onPress={() => navigation.navigate("Home")}
      /> */}

      {/* <View style={{elevation: 7, backgroundColor: "white", padding: 15, borderRadius: 6}}> */}
        <Image
          style={styles.tinyLogo}
          source={{
            uri: dataList
          }}
        />
      {/* </View> */}
    </View>
  );
};
export default DigitalPaymentScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  rootStyle: {
    flex: 1,
    flexDirection: "column",
  },
  tinyLogo: {
    width: 300,
    height: 400,
    
    alignItems: "center",
    justifyContent: "center",
  },
});
