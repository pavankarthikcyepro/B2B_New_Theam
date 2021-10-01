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

const screenWidth = Dimensions.get("window").width;

const OpenScreen = ({ navigation }) => {

  const selector = useSelector((state) => state.complaintsReducer);
  const [complaintsList, setComplaintsList] = useState([]);

  useEffect(() => {

    getComplaintsListFromServer();
  }, [])

  const getComplaintsListFromServer = async () => {

    const payload = {
      "groupBy": [],
      "orderBy": [],
      "pageNo": 0,
      "size": 5,
      "orderByType": "asc",
      "reportIdentifier": 1215,
      "paginationRequired": true,
      "empId": 1
    }
    const url = URL.GET_COMPLAINTS();

    await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'auth-token': ""
      },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((jsonRes) => {
        console.log("jsonRes: ", jsonRes);
        setComplaintsList(jsonRes.data);

      })
      .catch((err) => console.error(err))
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <FlatList
          data={complaintsList}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator}></View>;
          }}
          renderItem={({ item, index }) => {
            return (
              <View style={[styles.listBgVw]}>
                <ComplaintsItem
                  complaintFactor={item.complaintFactor}
                  name={item.name}
                  mobile={item.name}
                  email={item.name}
                  model={item.name}
                  name={item.name}
                  source={item.name}
                />
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default OpenScreen;

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
