
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Image, Pressable, Alert } from 'react-native';
import { Colors } from '../../../styles';
import { Searchbar } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import VectorImage from 'react-native-vector-image';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER } from '../../../assets/svg';
import { DateItem } from '../../../pureComponents/dateItem';
import { AppNavigator } from '../../../navigations';
import { dateSelected, showDateModal, getCarModalList, getCustomerTypeList, getSourceOfEnquiryList } from '../../../redux/homeReducer';
import { DateRangeComp, DatePickerComponent, SortAndFilterComp } from '../../../components';
import { DateModalComp } from "../../../components/dateModalComp";
import { getMenuList } from '../../../redux/homeReducer';
import { DashboardTopTabNavigator } from '../../../navigations/dashboardTopTabNavigator';
import * as AsyncStore from '../../../asyncStore';

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 30) / 2;

const HomeScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    getMenuListFromServer();
    getCarModalListFromServer();
    dispatch(getCustomerTypeList());
    dispatch(getSourceOfEnquiryList());
  }, [])

  const getMenuListFromServer = async () => {
    let name = await AsyncStore.getData(AsyncStore.Keys.USER_NAME);
    if (name) {
      dispatch(getMenuList(name));
    }
  }

  const getCarModalListFromServer = async () => {
    let orgId = await AsyncStore.getData(AsyncStore.Keys.ORG_ID);
    if (orgId) {
      dispatch(getCarModalList(orgId));
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 15, }}>
        <View style={{ flexDirection: 'row', height: 60, alignItems: 'center', justifyContent: 'space-between' }}>

          <Searchbar
            style={{ width: "90%" }}
            placeholder="Search"
            onChangeText={(text) => { }}
            value={selector.serchtext}
          />
          <VectorImage
            width={25}
            height={25}
            source={FILTER}
            style={{ tintColor: Colors.DARK_GRAY }}
          />
        </View>

        <Pressable onPress={() => { }}>
          <View style={styles.dateVw}>
            <Text style={styles.text3}>{"My Activities"}</Text>
            <IconButton
              icon="calendar-month"
              color={Colors.RED}
              size={25}
            // ondateSelected={() => dispatch(showDateModal())}
            />
          </View>
        </Pressable>
        <DashboardTopTabNavigator />

      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  shadow: {
    //   overflow: 'hidden',
    borderRadius: 4,
    width: "100%",
    height: 250,
    shadowColor: Colors.DARK_GRAY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    elevation: 3,
    position: "relative",
  },
  text1: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.WHITE,
  },
  barVw: {
    backgroundColor: Colors.WHITE,
    width: 40,
    height: "70%",
    justifyContent: "center",
  },
  text2: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  text3: {
    fontSize: 18,
    fontWeight: "800",
  },
  dateVw: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
  },
});


// const cardClicked = (index) => {

//   if (index === 0) {
//     navigation.navigate(AppNavigator.TabStackIdentifiers.ems);
//   } else if (index === 1) {
//     navigation.navigate(AppNavigator.TabStackIdentifiers.myTask);
//   }
// };

{/* <FlatList
          data={selector.tableData}
          numColumns={2}
          horizontal={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <Pressable onPress={() => cardClicked(index)}>
                <View style={{ flex: 1, width: itemWidth, padding: 5 }}>
                  <View
                    style={[
                      styles.shadow,
                      {
                        backgroundColor:
                          index == 0 ? Colors.YELLOW : Colors.GREEN,
                      },
                    ]}
                  >
                    <View style={{ overflow: "hidden" }}>
                      <Image
                        style={{
                          width: "100%",
                          height: 150,
                          overflow: "hidden",
                        }}
                        resizeMode={"cover"}
                        source={require("../../../assets/images/bently.png")}
                      />

                      <View
                        style={{
                          width: "100%",
                          height: 100,
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.text1}>{item.title}</Text>
                        <View
                          style={{
                            height: 100,
                            width: 50,
                            alignItems: "center",
                          }}
                        >
                          <View style={styles.barVw}>
                            <Text style={styles.text2}>{item.count}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          }}
        /> */}

{/* <View style={{ maxHeight: 100, marginBottom: 15 }}>
          <FlatList
            data={selector.datesData}
            style={{}}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <Pressable onPress={() => dispatch(dateSelected(index))}>
                  <View style={{ paddingRight: 10 }}>
                    <DateItem
                      month={item.month}
                      date={item.date}
                      day={item.day}
                      selected={
                        selector.dateSelectedIndex === index ? true : false
                      }
                    />
                  </View>
                </Pressable>
              );
            }}
          />
        </View> */}