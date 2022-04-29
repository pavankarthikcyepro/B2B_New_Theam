
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Pressable, Alert, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { Colors, GlobalStyle } from '../../../styles';
import { IconButton, Card, Button } from 'react-native-paper';
import VectorImage from 'react-native-vector-image';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER, SPEED } from '../../../assets/svg';
import { DateItem } from '../../../pureComponents/dateItem';
import { AppNavigator } from '../../../navigations';
import {
    dateSelected,
    showDateModal,
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
import { DashboardTopTabNavigatorNew } from '../../../navigations/dashboardTopTabNavigatorNew';
import { HomeStackIdentifiers } from '../../../navigations/appNavigator';
import * as AsyncStore from '../../../asyncStore';
import moment from 'moment';
import { TargetAchivementComp } from './targetAchivementComp';
import { HeaderComp, DropDownComponant } from '../../../components';
import { TargetDropdown } from "../../../pureComponents";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 30) / 2;

const widthForBoxItem = (screenWidth - 30) / 3;

const BoxComp = ({ width, name, value, iconName, bgColor }) => {
    return (
        <View style={{ width: width, padding: 2 }}>
            <View style={[styles.boxView, { backgroundColor: bgColor }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton icon={iconName} size={12} color={Colors.WHITE} style={{ margin: 0, padding: 0 }} />
                    <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.WHITE }}>{value}</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.WHITE }}>{name}</Text>
            </View>
        </View>
    )
}

const titleNames = ["Live Bookings", "Complaints", "Deliveries", "Loss In Revenue", "Pending Tasks"];
const iconNames = ["shopping", "account-supervisor", "currency-usd", "cart", "currency-usd"];
const colorNames = ["#85b1f4", "#f1ab48", "#79e069", "#e36e7a", "#5acce8"]


const HomeScreen = ({ route, navigation }) => {
    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [salesDataAry, setSalesDataAry] = useState([]);
    const [selectedBranchName, setSelectedBranchName] = useState("");

    const [dropDownKey, setDropDownKey] = useState("");
    const [dropDownTitle, setDropDownTitle] = useState("Select Data");
    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [dataForDropDown, setDataForDropDown] = useState([]);
    const [dropDownData, setDropDownData] = useState(null);

    useLayoutEffect(() => {

        // if (route.params?.branchName) {
        //   navigation.setOptions({
        //     headerRight: () => (
        //       <TouchableOpacity onPress={moveToSelectBranch}>
        //         <View style={{ paddingLeft: 5, paddingRight: 2, paddingVertical: 2, borderColor: Colors.WHITE, borderWidth: 1, borderRadius: 4, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        //           <Text style={{ fontSize: 10, fontWeight: "600", color: Colors.WHITE, width: 65 }} numberOfLines={1} >{route.params?.branchName || ""}</Text>
        //           <IconButton
        //             icon="menu-down"
        //             style={{ padding: 0, margin: 0 }}
        //             color={Colors.WHITE}
        //             size={15}
        //           />
        //         </View>
        //       </TouchableOpacity>
        //     ),
        //   });
        // }
    }, [navigation]);

    // useEffect(() => {
    //     if (selector.target_parameters_data.length > 0) {
    //         console.log("$$$$$$$$$$$$$$$", selector.target_parameters_data);
    //     } else {
    //     }
    // }, [selector.target_parameters_data])

    useEffect(() => {

        updateBranchNameInHeader()
        getMenuListFromServer();
        getLoginEmployeeDetailsFromAsyn();
        dispatch(getCustomerTypeList());

        const unsubscribe = navigation.addListener('focus', () => {
            updateBranchNameInHeader()
        });

        return unsubscribe;
    }, [navigation]);

    const updateBranchNameInHeader = async () => {
        await AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_NAME).then((branchName) => {
            // console.log("branchNameTest: ", branchName)
            if (branchName) {
                setSelectedBranchName(branchName);
            }
        });
    }

    const moveToSelectBranch = () => {
        navigation.navigate(AppNavigator.HomeStackIdentifiers.select_branch, { isFromLogin: false, })
    }

    const getMenuListFromServer = async () => {
        let name = await AsyncStore.getData(AsyncStore.Keys.USER_NAME);
        if (name) {
            dispatch(getMenuList(name));
        }
    }

    const getLoginEmployeeDetailsFromAsyn = async () => {
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            const payload = {
                orgId: jsonObj.orgId,
                branchId: jsonObj.branchId
            }
            // console.log("jsonObj: ", jsonObj);
            Promise.all([
                dispatch(getOrganaizationHirarchyList(payload)),
                dispatch(getSourceOfEnquiryList(jsonObj.orgId))
            ]).then(() => {
                console.log('I did everything!');
            });
            getDashboadTableDataFromServer(jsonObj.empId);
        }
    }

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

        Promise.all([
            dispatch(getLeadSourceTableList(payload)),
            dispatch(getVehicleModelTableList(payload)),
            dispatch(getEventTableList(payload)),
            dispatch(getLostDropChartData(payload))
        ]).then(() => {
            console.log('I did everything!');
        });

        getTaskTableDataFromServer(empId, payload);
        getTargetParametersDataFromServer(payload);
    }

    const getTaskTableDataFromServer = (empId, oldPayload) => {

        const payload = {
            ...oldPayload,
            "pageNo": 0,
            "size": 5
        }
        Promise.all([
            dispatch(getTaskTableList(payload)),
            dispatch(getSalesData(payload)),
            dispatch(getSalesComparisonData(payload))
        ]).then(() => {
            console.log('I did everything!');
        });
    }

    const getTargetParametersDataFromServer = (payload) => {
        const payload1 = {
            ...payload,
            "pageNo": 0,
            "size": 5
        }
        Promise.all([
            dispatch(getTargetParametersData(payload1))
        ]).then(() => {
            console.log('I did everything!');
        });
    }

    useEffect(() => {
        if (Object.keys(selector.sales_data).length > 0) {
            const dataObj = selector.sales_data;
            const data = [dataObj.liveBookings, dataObj.complaints, dataObj.deliveries, dataObj.dropRevenue, dataObj.pendingOrders]
            setSalesDataAry(data);
        }
    }, [selector.sales_data])

    const showDropDownModelMethod = (key, headerText) => {
        Keyboard.dismiss();
        switch (key) {
            case "TARGET_MODEL":
                setDataForDropDown([
                    {
                        id: 1,
                        name: "Target 1",
                        isChecked: false,
                    },
                    {
                        id: 2,
                        name: "Target 2",
                        isChecked: false,
                    },
                    {
                        id: 3,
                        name: "Target 3",
                        isChecked: false,
                    },
                ]);
                break;
        }
        setDropDownKey(key);
        setDropDownTitle(headerText);
        setShowDropDownModel(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <DropDownComponant
                visible={showDropDownModel}
                headerTitle={dropDownTitle}
                data={dataForDropDown}
                onRequestClose={() => setShowDropDownModel(false)}
                selectedItems={(item) => {
                   
                    setShowDropDownModel(false);
                    setDropDownData({ key: dropDownKey, value: item.name, id: item.id })
                }}
            />
            <HeaderComp
                title={"Dashboard"}
                branchName={selectedBranchName}
                menuClicked={() => navigation.openDrawer()}
                branchClicked={() => moveToSelectBranch()}
            />
            <View style={{ flex: 1, padding: 10 }}>
                <FlatList
                    data={[1, 2, 3]}
                    listKey={"TOP_FLAT_LIST"}
                    keyExtractor={(item, index) => "TOP" + index.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {

                        if (index === 0) {
                            return (
                                <View style={styles.rankView}>
                                    <View style={styles.rankBox}>
                                        <Text style={styles.rankHeadingText}>Group Dealer Ranking</Text>
                                        <View style={{
                                            flexDirection: 'row'
                                        }}>
                                            <View style={styles.rankIconBox}>
                                                <VectorImage
                                                    width={25}
                                                    height={16}
                                                    source={SPEED}
                                                // style={{ tintColor: Colors.DARK_GRAY }}
                                                />
                                            </View>
                                            <View style={{
                                                marginTop: 5,
                                                marginLeft: 5
                                            }}>
                                                <Text style={styles.rankText}>30/50</Text>
                                                <View style={{
                                                   marginTop: 5
                                                }}>
                                                    <Text style={styles.baseText}>Based on city</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.rankBox}>
                                        <Text style={styles.rankHeadingText}>Dealer Ranking</Text>
                                        <View style={{
                                            flexDirection: 'row'
                                        }}>
                                            <View style={styles.rankIconBox}>
                                                <VectorImage
                                                    width={25}
                                                    height={16}
                                                    source={SPEED}
                                                // style={{ tintColor: Colors.DARK_GRAY }}
                                                />
                                            </View>
                                            <View style={{
                                                marginTop: 5,
                                                marginLeft: 5
                                            }}>
                                                <Text style={styles.rankText}>14/50</Text>
                                                <View style={{
                                                    marginTop: 5
                                                }}>
                                                    <Text style={styles.baseText}>Based on city</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.retailBox}>
                                        <View style={{
                                            flexDirection: 'row',
                                            marginBottom: 5
                                        }}> 
                                            <Text style={{color: 'red'}}>5/ </Text>
                                            <Text>10</Text>
                                        </View>
                                        <Text style={{ color: 'red', fontSize: 14 }}>Retails</Text>
                                        <View style={{marginTop: 5}}>
                                            <Text style={{ fontSize: 12, color: '#aaa3a3' }}>Ach v/s Tar</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        }
                        else if (index === 1) {
                            return (
                                <View style={{ marginBottom: 5 }}>
                                    {/* <FlatList
                    data={titleNames}
                    listKey={"BOX_COMP"}
                    keyExtractor={(item, index) => "BOX" + index.toString()}
                    numColumns={3}
                    horizontal={false}
                    renderItem={({ item, index }) => {
                      return (
                        <View>
                          <BoxComp width={widthForBoxItem} name={item} value={salesDataAry[index]} iconName={iconNames[index]} bgColor={colorNames[index]} />
                        </View>
                      )
                    }}
                  /> */}

                                    <View style={styles.performView}>
                                        <View style={{ flexDirection: 'column', width: '50%' }}>
                                            <View style={{ marginBottom: 5 }}>
                                                <Text style={styles.text3}>{"My Performance"}</Text>
                                            </View>
                                            <Text style={{ fontSize: 8, color: '#aaa3a3' }}>Last updated March 29 2020 11:40 am</Text>
                                            <View>
                                                <TargetDropdown
                                                    label={"Select Target"}
                                                    value={dropDownData ? dropDownData.value : ''}
                                                    onPress={() =>
                                                        showDropDownModelMethod("TARGET_MODEL", "Select Target")
                                                    }
                                                />
                                            </View>
                                        </View>
                                        <View style={{ width: '50%' }}>
                                            
                                        </View>
                                    </View>

                                </View>
                            )
                        }
                        else if (index === 2) {
                            return (
                                // <View style={[]}>
                                //   <View style={[GlobalStyle.shadow, { padding: 10, backgroundColor: Colors.WHITE, borderRadius: 8 }]}>
                                //     <TargetAchivementComp />
                                //   </View>
                                // </View>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{
                                        width: '95%',
                                        minHeight: 400,
                                        // borderWidth: 1,
                                        shadowColor: Colors.DARK_GRAY,
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowRadius: 4,
                                        shadowOpacity: 0.5,
                                        elevation: 3,
                                        marginHorizontal:20
                                    }}>
                                        {selector.target_parameters_data.length > 0 &&
                                            <DashboardTopTabNavigatorNew />
                                        }                                        
                                    </View>
                                </View>
                            )
                        }
                    }}
                />
            </View>
            {/* <ScrollView style={{}}>
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

        </View>
      </ScrollView> */}
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

    performView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.WHITE,
        marginBottom: 5,
        paddingLeft: 5,
        height: 100,
        // backgroundColor: 'red'
    },

    rankView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        // backgroundColor: Colors.WHITE,
        marginBottom: 5,
        paddingLeft: 5,
        height: 80,
        width: '100%',
    },
    rankIconBox: {
        height: 40,
        width: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 1,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#d2d2d2",
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    rankHeadingText: {
        fontSize: 12,
        fontWeight: "500"
    },
    rankText: {
        fontSize: 16,
        fontWeight: "700"
    },
    baseText: {
        fontSize: 12,
        fontWeight: "800"
    },
    rankBox: {
        paddingTop: 5,
        height: 80,
        width: '35%',
        // backgroundColor: 'red',
        marginRight: 10
    },  

    retailBox: {
        paddingTop: 5,
        height: 80,
        width: '20%',
        // backgroundColor: 'red',
        marginRight: 10,
        alignItems: 'flex-end'
    }
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