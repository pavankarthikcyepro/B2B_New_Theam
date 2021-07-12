import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { Colors } from "../../styles";
import {} from "../../pureComponents/settingScreenItem";
const screenWidth = Dimensions.get("window").width;

const datalist = [
  {
    name: "My Profile",
  },
  {
    name: "Change Password",
  },
];

const SettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={datalist}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                width: screenWidth,
                height: 10,
                backgroundColor: Colors.LIGHT_GRAY,
              }}
            ></View>
          );
        }}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.list}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  {item.name}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
    paddingTop: 10,
  },
  list: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
  },
});
