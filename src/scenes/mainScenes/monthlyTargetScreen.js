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
import { MonthlyTargetItem } from "../../pureComponents/monthlyTargetItem";

const screenWidth = Dimensions.get("window").width;

const datalist = [
  {
    name: "Monthly Target Planning",
  },
];

const MonthlyTargetScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view2}>
        <FlatList
          data={datalist}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => {
            return <View style={styles.view1}></View>;
          }}
          renderItem={({ item, index }) => {
            return <MonthlyTargetItem name={item.name} />;
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MonthlyTargetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
    paddingTop: 10,
  },
  view2: {
    flex: 1,
    padding: 10,
  },
  list: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
  },
  view1: {
    height: 10,
    backgroundColor: Colors.LIGHT_GRAY,
  },
});
