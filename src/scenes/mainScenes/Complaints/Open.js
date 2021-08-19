import React from "react";
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

const screenWidth = Dimensions.get("window").width;

const OpenScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.complaintsReducer);

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
                  complaintFactor={item.complaintFactor}
                  name={item.name}
                  place={item.place}
                  enquiryID={item.enquiryID}
                  enquiryDate={item.enquiryDate}
                  source={item.source}
                  dse={item.dse}
                  car={item.car}
                  text={item.text}
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
