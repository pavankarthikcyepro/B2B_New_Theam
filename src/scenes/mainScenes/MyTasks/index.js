import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { MyTaskItem } from "../../../pureComponents/myTaskItem";
import { useDispatch, useSelector } from "react-redux";
import { AppNavigator } from "../../../navigations";

const screenWidth = Dimensions.get("window").width;

const MyTasksScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.mytaskReducer);

  const itemClicked = (taskName) => {
    const trimName = taskName.toLowerCase().trim();
    const finalTaskName = trimName.replace(/ /g, "");
    switch (finalTaskName) {
      case "testdrive":
        navigation.navigate(AppNavigator.MyTasksStackIdentifiers.testDrive);
        break;
      case "proceedtobooking":
        navigation.navigate(AppNavigator.MyTasksStackIdentifiers.preBookingFollowUp);
        break;
      case "prebookingfollowup":
        navigation.navigate(AppNavigator.MyTasksStackIdentifiers.preBookingFollowUp);
        break;
      case "homevisit":
        navigation.navigate(AppNavigator.MyTasksStackIdentifiers.homeVisit);
        break;
      case "enquiryfollowup":
        navigation.navigate(AppNavigator.MyTasksStackIdentifiers.enquiryFollowUp);
        break;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <FlatList
          data={selector.tableData}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator}></View>;
          }}
          renderItem={({ item, index }) => {
            return (
              <View style={{ flex: 1, width: '100%' }}>
                <View style={[styles.listBgVw]}>
                  <Pressable onPress={() => itemClicked(item.taskName)}>
                    <MyTaskItem
                      taskName={item.taskName}
                      status={item.taskStatus}
                      created={item.createdOn}
                      dmsLead={item.dmsLead}
                      phone={item.phoneNo}
                    />
                  </Pressable>
                </View>
                <Text style={GlobalStyle.underline}></Text>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MyTasksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  view1: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  listBgVw: {
    width: '100%',
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  separator: {
    height: 10,
  },
});
