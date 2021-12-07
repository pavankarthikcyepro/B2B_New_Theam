
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Image, Pressable, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../../styles';
import { IconButton, Card } from 'react-native-paper';
import VectorImage from 'react-native-vector-image';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER } from '../../../assets/svg';
import { DateItem } from '../../../pureComponents/dateItem';
import { AppNavigator } from '../../../navigations';
import {
  dateSelected,
  showDateModal,
  getCarModalList,
  getCustomerTypeList,
  getSourceOfEnquiryList,
  getOrganaizationHirarchyList,
  getLeadSourceTableList,
  getVehicleModelTableList,
  getEventTableList,
  getTaskTableList,
  getLostDropChartData,
  getTargetParametersData,
  getSalesData,
  getSalesComparisonData
} from '../../../redux/homeReducer';
import { DateRangeComp, DatePickerComponent, SortAndFilterComp } from '../../../components';
import { DateModalComp } from "../../../components/dateModalComp";
import { getMenuList } from '../../../redux/homeReducer';
import { DashboardTopTabNavigator } from '../../../navigations/dashboardTopTabNavigator';
import { HomeStackIdentifiers } from '../../../navigations/appNavigator';
import * as AsyncStore from '../../../asyncStore';
import moment from 'moment';

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 30) / 2;

const widthForBoxItem = (screenWidth - 30) / 3;

const BoxComp = ({ width, name, value }) => {
  return (
    <View style={{ width: width, padding: 2 }}>
      <View style={styles.boxView}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon={'filter-outline'} size={12} color={Colors.DARK_GRAY} style={{ margin: 0, padding: 0 }} />
          <Text style={{ fontSize: 12, fontWeight: "600" }}>{value}</Text>
        </View>
        <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.DARK_GRAY }}>{name}</Text>
      </View>
    </View>
  )
}

const titleNames = ["Sales Today", "Visitors Today", "Total Earnings", "Pending Orders", "Total Revenue", "Drop Revenue"];

const HomeScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [salesDataAry, setSalesDataAry] = useState([]);

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

  useEffect(() => {
    if (selector.login_employee_details) {
      const dataObj = selector.login_employee_details;
      const payload = {
        orgId: dataObj.orgId,
        branchId: dataObj.branchId
      }
      dispatch(getOrganaizationHirarchyList(payload));
      getDashboadTableDataFromServer(dataObj.empId);
    }
  }, [selector.login_employee_details]);

  const getDashboadTableDataFromServer = (empId) => {
    const dateFormat = "YYYY-MM-DD";
    const currentDate = moment().format(dateFormat)
    const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
    const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
    const payload = {
      "endDate": monthLastDate,
      "loggedInEmpId": empId,
      "startDate": monthFirstDate,
      "levelSelected": null
    }
    dispatch(getLeadSourceTableList(payload));
    dispatch(getVehicleModelTableList(payload));
    dispatch(getEventTableList(payload));
    dispatch(getLostDropChartData(payload));
    getTaskTableDataFromServer(empId, payload);
    getTargetParametersDataFromServer(payload);
  }

  const getTaskTableDataFromServer = (empId, oldPayload) => {

    const payload = {
      ...oldPayload,
      "pageNo": 0,
      "size": 10
    }
    dispatch(getTaskTableList(payload));
    dispatch(getSalesData(payload));
    dispatch(getSalesComparisonData(payload));
  }

  const getTargetParametersDataFromServer = (payload) => {
    const payload1 = {
      ...payload,
      "pageNo": 0,
      "size": 10
    }
    dispatch(getTargetParametersData(payload1));
  }

  useEffect(() => {
    if (selector.sales_data) {
      const dataObj = selector.sales_data;
      const data = [dataObj.todaySales, dataObj.todayVisitors, dataObj.totalEarnings, dataObj.pendingOrders, dataObj.totalRevenue, dataObj.dropRevenue]
      setSalesDataAry(data);
    }
  }, [selector.sales_data])

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={{}}>
        <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 15, }}>
          {/* <View style={{ flexDirection: 'row', height: 60, alignItems: 'center', justifyContent: 'space-between' }}>

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
        </View> */}

          <View style={styles.dateVw}>
            <Text style={styles.text3}>{"My Dashboard"}</Text>
            <TouchableOpacity onPress={() => navigation.navigate(HomeStackIdentifiers.filter)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.text1, { color: Colors.RED }]}>{'Filters'}</Text>
                <IconButton icon={'filter-outline'} size={20} color={Colors.RED} style={{ margin: 0, padding: 0 }} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 5 }}>
            <FlatList
              data={titleNames}
              numColumns={3}
              horizontal={false}
              renderItem={({ item, index }) => {
                return (
                  <View>
                    <BoxComp width={widthForBoxItem} name={item} value={salesDataAry[index]} />
                  </View>
                )
              }}
            />
          </View>
          <DashboardTopTabNavigator />

        </View>
      </ScrollView>
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
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    backgroundColor: Colors.WHITE,
    marginBottom: 5,
    paddingLeft: 5,
    height: 50,
  },
  boxView: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    backgroundColor: Colors.WHITE,
    paddingVertical: 5
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