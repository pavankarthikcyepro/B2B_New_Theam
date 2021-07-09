import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { Colors } from "../../../styles";

const screenWidth = Dimensions.get("window").width;

const datalist = [
  {
    TaskName: "Proceed to Booking",
    TaskStatus: "ASSIGNED",
    CreatedOn: "Tue Jun 29 2021",
    DMSLead: "GSGHS Vshsj",
    PhoneNo: "Gsghs 8488464949",
  },
  {
    TaskName: "Test Drive",
    TaskStatus: "SENT_FOR_APPROVAL",
    CreatedOn: "Tue Jun 29 2021",
    DMSLead: "GSGHS Vshsj",
    PhoneNo: "Gsghs 8488464949",
  },
  {
    TaskName: "Pre Booking Follow Up",
    TaskStatus: "ASSIGNED",
    CreatedOn: "Tue Jun 29 2021",
    DMSLead: "GSGHS Vshsj",
    PhoneNo: "Gsghs 8488464949",
  },
  {
    TaskName: "Home Visit",
    TaskStatus: "ASSIGNED",
    CreatedOn: "Tue Jun 29 2021",
    DMSLead: "GSGHS Vshsj",
    PhoneNo: "Gsghs 8488464949",
  },
  {
    TaskName: "Enguiry Follow Up",
    TaskStatus: "ASSIGNED",
    CreatedOn: "Tue Jun 29 2021",
    DMSLead: "GSGHS Vshsj",
    PhoneNo: "Gsghs 8488464949",
  },
];

const MyTasksScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={datalist}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                width: screenWidth - 40,
                height: 20,
                backgroundColor: Colors.LIGHT_GRAY,
              }}
            ></View>
          );
        }}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.list}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: Colors.GRAY, fontSize: 16 }}>
                  TaskName:
                </Text>
                <Text style={{ fontSize: 16 }}>{item.TaskName}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: Colors.GRAY, fontSize: 16 }}>
                  Task Status:
                </Text>
                <Text style={{ fontSize: 16 }}>{item.TaskStatus}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: Colors.GRAY, fontSize: 16 }}>
                  Created On:
                </Text>
                <Text style={{ fontSize: 16 }}>{item.CreatedOn}</Text>
              </View>
              <View style={{ flexDirection: "row", fontSize: 16 }}>
                <Text style={{ color: Colors.GRAY }}>DMS Lead: </Text>
                <Text style={{ fontSize: 16 }}>{item.DMSLead}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: Colors.GRAY, fontSize: 16 }}>
                  Phone No:
                </Text>
                <Text style={{ fontSize: 16 }}>{item.PhoneNo}</Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default MyTasksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: Colors.LIGHT_GRAY,
    padding: 20,
  },
  list: {
    padding: 20,
    width: screenWidth - 20,
    height: screenWidth - 250,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    justifyContent: "space-between",
  },
});
