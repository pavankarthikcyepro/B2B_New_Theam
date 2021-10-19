import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { ComplaintsItem } from "../../../pureComponents/complaintsItem";
import { useDispatch, useSelector } from "react-redux";
import URL from "../../../networking/endpoints";
import * as AsyncStorage from "../../../asyncStore";

const screenWidth = Dimensions.get("window").width;

const ActiveScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.complaintsReducer);

  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    console.log("activescreen displayed");
    getAsyncStorageData();
  }, []);

  const getAsyncStorageData = async () => {
    const token = await AsyncStorage.getData(AsyncStorage.Keys.USER_TOKEN);
    if (token) {
      setAuthToken(token);
      getComplaintsListFromServer(token);
    }
  };

  const getComplaintsListFromServer = async (token) => {
    const temptoken =
      "eyJraWQiOiI1Szd2U0VkMjRoQXJISlVkTWhLTUFJZkhUQVczN1RDZzhsMDU4K3A0VGMwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJiNzU2OWI0Zi1kZGQ3LTRhNjYtOWUwOS03YjYxNTRiNzZmNDEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV92NWZnTk1pQm0iLCJjb2duaXRvOnVzZXJuYW1lIjoic3lzdGVtYWRtaW4iLCJhdWQiOiI3ZG1ybXBvYXYybmw4dW5tb3VlcHR0ZTM3ZSIsImV2ZW50X2lkIjoiYzgxZTI1ZTUtM2E1MS00NjUyLWIwMjYtNjQyZmZlODQyZDBkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MzMwNjk1NzIsImN1c3RvbTpicmFuY2hJZCI6IjEiLCJuYW1lIjoic3lzdGVtYWRtaW4iLCJwaG9uZV9udW1iZXIiOiIrOTE3MzMwNzEyMjU1IiwiY3VzdG9tOm9yZ0lkIjoiMSIsImV4cCI6MTYzMzA3MzE3NCwiaWF0IjoxNjMzMDY5NTc0LCJmYW1pbHlfbmFtZSI6IlNhcmF0aEt1bWFyVXBwdWx1cmkiLCJlbWFpbCI6InNhcmF0aC51cHB1bHVyaUBnbWFpbC5jb20ifQ.lAflkXci9lJ1tXzCsYZ57mvSQaUjUGQjNaLylp_lWSi8emzWgdIbrHa0nMv5MeEt45Jx_FePrase3kDPo4E6zb663Gomn_TXnAoH89IDlkm9nYdCwF3Gl-VN85Tv4LGjkZlw8glRxIhF_wDLns2csM97CMylFF_PKBfb5_QzoL0mNO1u5nlSRx7MqoZtDunDamvUskxivlrYVDyUOBHmWrjskE3FZUS5SpGv9_fr_Mjc4HeGMGhgBQY0OSYb5vehe0XJDJonRmrX6_Ar8ts0AaKuA11WjX6VeSBW1hFb13SbCYA9rN-X1-FXyop9ufntYJVIgvTWK7OvSlbn3QTA3w";

    const payload = {
      groupBy: [],
      orderBy: [],
      pageNo: 0,
      size: 5,
      orderByType: "asc",
      reportIdentifier: 1215,
      paginationRequired: true,
      empId: 1,
    };

    await fetch(URL.GET_COMPLAINTS(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": temptoken,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("complaints response: ", json);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <FlatList
          data={selector.tableAry}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator}></View>;
          }}
          renderItem={({ item, index }) => {
            return (
              <View style={[styles.listBgVw]}>
                <ComplaintsItem
                  ComplaintFactor={item.ComplaintFactor}
                  CustomerName={item.CustomerName}
                  ID={item.ID}
                  MobileNo={item.MobileNo}
                  Email={item.Email}
                />
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ActiveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  view1: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  listBgVw: {
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 10,
  },
  separator: {
    height: 10,
  },
});
