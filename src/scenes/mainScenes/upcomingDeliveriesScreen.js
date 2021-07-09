import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
  IconButton,
} from "react-native";
import { Colors } from "../../styles";

const datalist = [
  {
    name: "Mr.Sunil Prakash",
    DeliveryPlanning: "30/06/2021",
    DeliveryLocation: "Customer Place",
    DSEName: "Someswar rao",
    VehicleName: "Aura",
  },
  {
    name: "Mr.VamshiKiran",
    DeliveryPlanning: "14-07-2021",
    DeliveryLocation: "showroom",
    DSEName: "Naveen Naik",
    VehicleName: "creta",
  },
  {
    name: "Mr.Sunil Prakash",
    DeliveryPlanning: "30/06/2021",
    DeliveryLocation: "Customer Place",
    DSEName: "Someswar rao",
    VehicleName: "Elentra",
  },
  {
    name: "Mr.VamshiKiran",
    DeliveryPlanning: "14-07-2021",
    DeliveryLocation: "showroom",
    DSEName: "Naveen Naik",
    VehicleName: "Elite i20",
  },
  {
    name: "Mr.Sunil Prakash",
    DeliveryPlanning: "30/06/2021",
    DeliveryLocation: "Customer Place",
    DSEName: "Someswar rao",
    VehicleName: "Greandi0 nios",
  },
  {
    name: "Mr.VamshiKiran",
    DeliveryPlanning: "14-07-2021",
    DeliveryLocation: "showroom",
    DSEName: "Naveen Naik",
    VehicleName: "Greandi10",
  },
  {
    name: "Mr.Sunil Prakash",
    DeliveryPlanning: "30/06/2021",
    DeliveryLocation: "Customer Place",
    DSEName: "Someswar rao",
    VehicleName: "Santro",
  },
  {
    name: "Mr.VamshiKiran",
    DeliveryPlanning: "14-07-2021",
    DeliveryLocation: "showroom",
    DSEName: "Naveen Naik",
    VehicleName: "creta",
  },
];

const UpcomingDeliveriesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={datalist}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          let color = "#eeeeee";
          if (index % 2 == 0) {
            color = "white";
          }

          return (
            <View style={[styles.main, { backgroundColor: color }]}>
              <View>
                <View
                  style={{ flexDirection: "row", color: "black", fontSize: 12 }}
                >
                  <Text style={{ fontSize: 12 }}>{item.name}</Text>
                </View>
                <View style={{ padding: 3 }}></View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: Colors.GRAY, fontSize: 12 }}>
                    DeliveryPlanning:
                  </Text>
                  <Text style={{ fontSize: 12, color: "gray" }}>
                    {item.DeliveryPlanning}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: Colors.GRAY, fontSize: 12 }}>
                    DeliveryLocation:
                  </Text>
                  <Text style={{ fontSize: 12, color: "gray" }}>
                    {item.DeliveryLocation}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: Colors.GRAY, fontSize: 12 }}>
                    DSEName:
                  </Text>
                  <Text style={{ fontSize: 12, color: "gray" }}>
                    {item.DSEName}
                  </Text>
                </View>
                {/* <Text
                  style={{
                    color: "grey",
                    fontWeight: "400",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {item.DSEName}
                </Text> */}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignContent: "flex-end",
                  flex: 1,
                  marginEnd: 5,
                }}
              >
                <View style={styles.vechicleView}>
                  <Text style={styles.vechileView1}>{item.VehicleName}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default UpcomingDeliveriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    // marginTop: 30,
    padding: 15,
  },

  main: {
    width: "100%",
    height: 100,
    marginLeft: 10,
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-between",
  },
  item: {
    backgroundColor: "white",
    fontSize: 15,
    marginTop: 10,
  },

  ImageStyle: {
    height: 12,
    width: 12,
    marginTop: 45,
    marginEnd: 10,
  },
  vechicleView: {
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 10,
    fontFamily: "SegoeUI",
    backgroundColor: "pink",
    color: "red",
    height: 40,
    paddingLeft: 15,
    paddingRight: 10,
    marginRight: -10,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
});
