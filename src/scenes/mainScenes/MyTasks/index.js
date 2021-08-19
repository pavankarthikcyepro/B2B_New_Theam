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
              <View style={[styles.listBgVw]}>
                {/* <Pressable
                  onPress={() =>
                    navigation.navigate(
                      AppNavigator.MyTasksStackIdentifiers.homeVisit
                    )
                  }
                > */}
                <Pressable
                  onPress={() =>
                    navigation.navigate(
                      AppNavigator.MyTasksStackIdentifiers.testDrive
                    )
                  }
                >
                  <MyTaskItem
                    taskName={item.taskName}
                    status={item.taskStatus}
                    created={item.createdOn}
                    dmsLead={item.dmsLead}
                    phone={item.phoneNo}
                  />
                </Pressable>
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
    paddingHorizontal: 20,
    marginTop: 10,
  },
  listBgVw: {
    width: screenWidth - 40,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  separator: {
    height: 10,
  },
});
