import React from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  Image,
} from "react-native";
import { Colors } from "../../styles";

const screenWidth = Dimensions.get("window").width;

const DataBase = [
  {
    id: 1,
    name: "You have been assigned a target for Aug 20",
    hrs: "2 hours ago",
  },
  {
    id: 2,
    name: "General visitor request created for Aziz Khan @ 1PM",
    hrs: "6 hours ago",
  },
  {
    id: 3,
    name: " You have a new missed activity under general tasks due for 3 days",
    hrs: "  5 hours ago",
  },
  {
    id: 4,
    name: "You have been assigned a target for Aug 20",
    hrs: "2 hours ago",
  },
  {
    id: 5,
    name: "General visitor request created for Aziz Khan @ 1PM",
    hrs: "6 hours ago",
  },
  {
    id: 6,
    name: " You have a new missed activity under general tasks due for 3 days",
    hrs: "5 hours ago",
  },
  {
    id: 7,
    role: "Yesterday",
  },
  {
    id: 8,
    name: "You have been assigned a target for Aug 20",
    hrs: "2 hours ago",
  },
  {
    id: 9,
    name: "General visitor request created for Aziz Khan @ 1PM",
    hrs: "6 hours ago",
  },
  {
    id: 10,
    name: " You have a new missed activity under general tasks due for 3 days",
    hrs: "5 hours ago",
  },
];
const ScreenInterior = () => {
  return (
    <SafeAreaView style={styles.rootStyle}>
      <View style={{ padding: 10 }}>
        <Text
          style={{
            fontWeight: "bold",
            color: Colors.BLACK,
            marginRight: 150,
            fontSize: 20,
          }}
        >
          Today
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            color: Colors.RED,
            marginLeft: 250,
            marginTop: -22,
            fontSize: 14,
          }}
        >
          Mark all Read
        </Text>
        <View style={{ padding: 10 }}></View>
        {/* <Text
          style={{
            fontWeight: "bold",
            color: Colors.BLACK,
            marginRight: 150,
            fontSize: 20,
            marginBottom: 50,
          }}
        >
          Yesterday
        </Text> */}
        <FlatList
          data={DataBase}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  width: screenWidth - 20,
                  height: 60,
                  borderRadius: 8,

                  backgroundColor: Colors.WHITE,

                  flexDirection: "row",

                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      flexDirection: "column",
                      marginLeft: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "black",
                        margin: 5,
                      }}
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={{
                        fontSize: 14,
                        marginLeft: 250,
                        fontWeight: "400",
                        color: "gray",
                      }}
                    >
                      {item.hrs}
                    </Text>

                    {/* <View
                      style={{
                        width: screenWidth - 20,
                        height: 60,
                        borderRadius: 8,

                        backgroundColor: Colors.GRAY,

                        flexDirection: "row",

                        justifyContent: "space-between",
                      }}
                    /> */}
                    <Text
                      style={{
                        fontSize: 24,

                        fontWeight: "bold",
                        color: "black",
                        marginTop: -30,
                      }}
                    >
                      {item.role}
                    </Text>

                    <View></View>
                  </View>
                </View>
              </View>
            );
          }}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  width: screenWidth - 30,
                  height: 8,
                  marginRight: 10,
                  backgroundColor: Colors.gray,
                }}
              ></View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ScreenInterior;

const styles = StyleSheet.create({
  rootStyle: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
});
