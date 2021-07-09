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
import { Colors, GlobalStyle } from "../../styles";
import { UpcomingDeliveriesItem } from '../../pureComponents/upcomingDeliveriesItem';

const datalist = [
  {
    name: "Mr.Sunil Prakash",
    deliveryPlanning: "30/06/2021",
    deliveryLocation: "Customer Place",
    dSEName: "Someswar rao",
    vehicleName: "Aura",
  },
  {
    name: "Mr.VamshiKiran",
    deliveryPlanning: "14-07-2021",
    deliveryLocation: "showroom",
    dSEName: "Naveen Naik",
    vehicleName: "creta",
  },
  {
    name: "Mr.Sunil Prakash",
    deliveryPlanning: "30/06/2021",
    deliveryLocation: "Customer Place",
    dSEName: "Someswar rao",
    vehicleName: "Elentra",
  },
  {
    name: "Mr.VamshiKiran",
    deliveryPlanning: "14-07-2021",
    deliveryLocation: "showroom",
    dSEName: "Naveen Naik",
    vehicleName: "Elite i20",
  },
  {
    name: "Mr.Sunil Prakash",
    deliveryPlanning: "30/06/2021",
    deliveryLocation: "Customer Place",
    dSEName: "Someswar rao",
    vehicleName: "Greandi0 nios",
  },
  {
    name: "Mr.VamshiKiran",
    deliveryPlanning: "14-07-2021",
    deliveryLocation: "showroom",
    dSEName: "Naveen Naik",
    vehicleName: "Greandi10",
  },
  {
    name: "Mr.Sunil Prakash",
    deliveryPlanning: "30/06/2021",
    deliveryLocation: "Customer Place",
    dSEName: "Someswar rao",
    vehicleName: "Santro",
  },
  {
    name: "Mr.VamshiKiran",
    deliveryPlanning: "14-07-2021",
    deliveryLocation: "showroom",
    dSEName: "Naveen Naik",
    vehicleName: "creta",
  },
];

const UpcomingDeliveriesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 10 }}>
        <View style={GlobalStyle.shadow}>
          <FlatList
            data={datalist}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {

              let color = Colors.WHITE;
              if (index % 2 != 0) {
                color = Colors.LIGHT_GRAY;
              }

              return (
                <UpcomingDeliveriesItem
                  name={item.name}
                  planning={item.deliveryPlanning}
                  location={item.deliveryLocation}
                  dseName={item.dSEName}
                  modelName={item.vehicleName}
                  bgColor={color}
                />
              );
            }}
          />
        </View>
      </View>

    </SafeAreaView>
  );
};

export default UpcomingDeliveriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  }
});
