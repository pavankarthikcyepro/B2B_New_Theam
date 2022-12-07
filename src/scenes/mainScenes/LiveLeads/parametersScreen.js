import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LoaderComponent } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import * as AsyncStore from "../../../asyncStore";
import { ScrollView } from "react-native-gesture-handler";
import { Colors } from "../../../styles";

import {
  delegateTask,
  getEmployeesList,
  getReportingManagerList,
  getUserWiseTargetParameters,
} from "../../../redux/liveLeadsReducer";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Card, IconButton } from "react-native-paper";
import { RenderGrandTotal } from "../Home/TabScreens/components/RenderGrandTotal";
import { RenderEmployeeParameters } from "../Home/TabScreens/components/RenderEmployeeParameters";
import { AppNavigator } from "../../../navigations";
import {
  EmsTopTabNavigatorIdentifiers,
  EMSTopTabNavigatorTwo,
} from "../../../navigations/emsTopTabNavigator";
import URL from "../../../networking/endpoints";
import { client } from "../../../networking/client";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 100) / 5;

const ParametersScreen = ({ route }) => {
  const navigation = useNavigation();
  const selector = useSelector((state) => state.liveLeadsReducer);
  const dispatch = useDispatch();

  const [retailData, setRetailData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [enqData, setEnqData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [selectedName, setSelectedName] = useState(null);

  const [selfInsightsData, setSelfInsightsData] = useState([]);

  const [allParameters, setAllParameters] = useState([]);
  const [myParameters, setMyParameters] = useState([]);

  const [employeeListDropdownItem, setEmployeeListDropdownItem] = useState(0);
  const [
    reoprtingManagerListDropdownItem,
    setReoprtingManagerListDropdownItem,
  ] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

  const [branches, setBranches] = useState([]);
  const [togglePercentage, setTogglePercentage] = useState(0);
  const [toggleParamsIndex, setToggleParamsIndex] = useState(0);
  const [toggleParamsMetaData, setToggleParamsMetaData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const color = [
    "#9f31bf",
    "#00b1ff",
    "#fb03b9",
    "#ffa239",
    "#d12a78",
    "#0800ff",
    "#1f93ab",
    "#ec3466",
  ];

  const paramsMetadata = [
    // 'Enquiry', 'Test Drive', 'Home Visit', 'Booking', 'INVOICE', 'Finance', 'Insurance', 'Exchange', 'EXTENDEDWARRANTY', 'Accessories'
    {
      color: "#FA03B9",
      paramName: "PreEnquiry",
      shortName: "Con",
      initial: "C",
      toggleIndex: 0,
    },
    {
      color: "#FA03B9",
      paramName: "Enquiry",
      shortName: "Enq",
      initial: "E",
      toggleIndex: 0,
    },
    // {color: '#FA03B9', paramName: 'Test Drive', shortName: 'TD', initial: 'T', toggleIndex: 0},
    // {color: '#9E31BE', paramName: 'Home Visit', shortName: 'Visit', initial: 'V', toggleIndex: 0},
    {
      color: "#1C95A6",
      paramName: "Booking",
      shortName: "Bkg",
      initial: "B",
      toggleIndex: 0,
    },
    {
      color: "#C62159",
      paramName: "INVOICE",
      shortName: "Retail",
      initial: "R",
      toggleIndex: 0,
    },
    // {color: '#9E31BE', paramName: 'Exchange', shortName: 'Exg', initial: 'Ex', toggleIndex: 1},
    // {color: '#EC3466', paramName: 'Finance', shortName: 'Fin', initial: 'F', toggleIndex: 1},
    // {color: '#1C95A6', paramName: 'Insurance', shortName: 'Ins', initial: 'I', toggleIndex: 1},
    // {color: '#1C95A6', paramName: 'EXTENDEDWARRANTY', shortName: 'ExW', initial: 'ExW', toggleIndex: 1},
    // {color: '#C62159', paramName: 'Accessories', shortName: 'Acc', initial: 'A', toggleIndex: 1},
  ];

  const getEmployeeListFromServer = async (user) => {
    const payload = {
      empId: user.empId,
    };
    dispatch(getEmployeesList(payload));
  };

  const getReportingManagerListFromServer = async (user) => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      dispatch(
        delegateTask({
          fromUserId: jsonObj.empId,
          toUserId: user.empId,
        })
      );
    }
    dispatch(getReportingManagerList(user.orgId));
  };

  useEffect(() => {
     navigation.addListener("focus", () => {
    setSelfInsightsData([]);
     });
  }, [navigation]);

  useEffect(() => {
    const dateFormat = "YYYY-MM-DD";
    const currentDate = moment().format(dateFormat);
    const monthLastDate = moment(currentDate, dateFormat)
      .subtract(0, "months")
      .endOf("month")
      .format(dateFormat);
    // setDateDiff((new Date(monthLastDate).getTime() - new Date(currentDate).getTime()) / (1000 * 60 * 60 * 24));

    const isInsights = selector.isTeamPresent && !selector.isDSE;
    const isSelf = selector.isDSE;
    const dashboardSelfParamsData = isSelf
      ? selector.self_target_parameters_data
      : selector.insights_target_parameters_data;
    if (dashboardSelfParamsData.length > 0) {
      let tempRetail = [];
      tempRetail = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "invoice";
      });
      if (tempRetail.length > 0) {
        const params = { ...tempRetail[0] };
        params.paramShortName = "Ret";
        tempRetail[0] = params;
        setRetailData(tempRetail[0]);
      }

      let tempBooking = [];
      tempBooking = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "booking";
      });
      if (tempBooking.length > 0) {
        const params = { ...tempBooking[0] };
        params.paramShortName = "Bkg";
        tempBooking[0] = params;
        setBookingData(tempBooking[0]);
      }

      let tempEnq = [];
      tempEnq = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "enquiry";
      });
      if (tempEnq.length > 0) {
        const params = { ...tempEnq[0] };
        params.paramShortName = "Enq";
        tempEnq[0] = params;
        setEnqData(tempEnq[0]);
      }

      let tempCon = [];
      tempCon = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "preenquiry";
      });
      if (tempCon.length > 0) {
        const params = { ...tempCon[0] };
        params.paramShortName = "Con";
        tempCon[0] = params;
        setContactData(tempCon[0]);
      }

      setSelfInsightsData([
        tempCon[0],
        tempEnq[0],
        tempBooking[0],
        tempRetail[0],
      ]);
    } else {
    }

    const unsubscribe = navigation.addListener("focus", () => {
      const dateFormat = "YYYY-MM-DD";
      const currentDate = moment().format(dateFormat);
      const monthLastDate = moment(currentDate, dateFormat)
        .subtract(0, "months")
        .endOf("month")
        .format(dateFormat);
      // setDateDiff((new Date(monthLastDate).getTime() - new Date(currentDate).getTime()) / (1000 * 60 * 60 * 24));
    });

    return unsubscribe;
  }, [
    selector.self_target_parameters_data,
    selector.insights_target_parameters_data,
  ]); //selector.self_target_parameters_data]

  useEffect(async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (
        selector.login_employee_details.hasOwnProperty("roles") &&
        selector.login_employee_details.roles.length > 0
      ) {
        let rolesArr = [];
        rolesArr = selector.login_employee_details?.roles.filter((item) => {
          return (
            item === "Admin Prod" ||
            item === "App Admin" ||
            item === "Manager" ||
            item === "TL" ||
            item === "General Manager" ||
            item === "branch manager" ||
            item === "Testdrive_Manager"
          );
        });
        if (rolesArr.length > 0) {
          // setIsTeamPresent(true)
        }
      }
    }

    try {
      const branchData = await AsyncStore.getData("BRANCHES_DATA");
      if (branchData) {
        const branchesList = JSON.parse(branchData);
        setBranches([...branchesList]);
      }
    } catch (e) {
      // Alert.alert('Error occurred - Employee total', `${JSON.stringify(e)}`);
    }
  }, [selector.login_employee_details]);

  useEffect(() => {
    setTogglePercentage(0);
    // setIsTeam(selector.isTeam);
    if (selector.isTeam) {
      setToggleParamsIndex(0);
      let data = [...paramsMetadata];
      data = data.filter((x) => x.toggleIndex === 0);
      setToggleParamsMetaData([...data]);
    }
  }, [selector.isTeam]);

  useEffect(async () => {
    try {
      setIsLoading(true);
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        if (selector.all_emp_parameters_data.length > 0) {
          let myParams = [
            ...selector.all_emp_parameters_data.filter(
              (item) => item.empId === jsonObj.empId
            ),
          ];
          setMyParameters(myParams);
          let tempParams = [
            ...selector.all_emp_parameters_data.filter(
              (item) => item.empId !== jsonObj.empId
            ),
          ];
          for (let i = 0; i < tempParams.length; i++) {
            tempParams[i] = {
              ...tempParams[i],
              isOpenInner: false,
              employeeTargetAchievements: [],
              tempTargetAchievements: tempParams[i]?.targetAchievements,
            };
            // tempParams[i]["isOpenInner"] = false;
            // tempParams[i]["employeeTargetAchievements"] = [];
            if (i === tempParams.length - 1) {
              setAllParameters([...tempParams]);
            }
            let newIds = tempParams.map((emp) => emp.empId);
            for (let k = 0; k < newIds.length; k++) {
              const element = newIds[k].toString();
              let tempPayload = getTotalPayload(employeeData, element);
              const response = await client.post(
                URL.GET_LIVE_LEADS_INSIGHTS(),
                tempPayload
              );

              const json = await response.json();
              tempParams[k].targetAchievements = json;
              setAllParameters([...tempParams]);
            }
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [selector.all_emp_parameters_data]);

  const getColor = (ach, tar) => {
    if (ach > 0 && tar === 0) {
      return "#1C95A6";
    } else if (ach === 0 || tar === 0) {
      return "#FA03B9";
    } else {
      if ((ach / tar) * 100 === 50) {
        return "#EC3466";
      } else if ((ach / tar) * 100 > 50) {
        return "#1C95A6";
      } else if ((ach / tar) * 100 < 50) {
        return "#FA03B9";
      }
    }
  };

  // Main Dashboard params Data
  const renderData = (item, color) => {
    return (
      <View
        style={{ flexDirection: "row", backgroundColor: Colors.BORDER_COLOR }}
      >
        <RenderEmployeeParameters
          item={item}
          displayType={togglePercentage}
          params={toggleParamsMetaData}
          navigation={navigation}
          moduleType={"live-leads"}
        />
      </View>
    );
  };

  const getBranchName = (branchId) => {
    let branchName = "";
    if (branches.length > 0) {
      const branch = branches.find((x) => +x.branchId === +branchId);
      if (branch) {
        branchName = branch.branchName.split(" - ")[0];
      }
    }
    return branchName;
  };

  const getTotalPayload = (employeeData, item) => {
    const jsonObj = JSON.parse(employeeData);
    const dateFormat = "YYYY-MM-DD";
    const currentDate = moment().format(dateFormat);
    const monthFirstDate = moment(currentDate, dateFormat)
      .subtract(0, "months")
      .startOf("month")
      .format(dateFormat);
    const monthLastDate = moment(currentDate, dateFormat)
      .subtract(0, "months")
      .endOf("month")
      .format(dateFormat);
    return {
      empId: item,
      endDate: monthLastDate,
      levelSelected: null,
      loggedInEmpId: item,
      orgId: jsonObj.orgId,
      pageNo: 0,
      selectedEmpId: item,
      size: 100,
      startDate: "2021-01-01",
    };
  };
  const onEmployeeNameClick = async (item, index) => {
    setSelectedName(item.empName); // to display name on click of the left view - first letter
    setTimeout(() => {
      setSelectedName("");
    }, 900);
    let localData = [...allParameters];
    let current = localData[index].isOpenInner;
    for (let i = 0; i < localData.length; i++) {
      localData[i].isOpenInner = false;
      if (i === localData.length - 1) {
        localData[index].isOpenInner = !current;
      }
    }
    if (!current) {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().format(dateFormat);
        const monthFirstDate = moment(currentDate, dateFormat)
          .subtract(0, "months")
          .startOf("month")
          .format(dateFormat);
        const monthLastDate = moment(currentDate, dateFormat)
          .subtract(0, "months")
          .endOf("month")
          .format(dateFormat);
        let payload = {
          orgId: jsonObj.orgId,
          selectedEmpId: item.empId,
          endDate: currentDate,
          loggedInEmpId: jsonObj.empId,
          empId: item.empId,
          startDate: monthFirstDate,
          levelSelected: null,
          pageNo: 0,
          size: 100,
        };
        Promise.all([dispatch(getUserWiseTargetParameters(payload))]).then(
          async (res) => {
            let tempRawData = [];
            tempRawData = res[0]?.payload?.employeeTargetAchievements.filter(
              (emp) => emp.empId !== item.empId
            );
            if (tempRawData.length > 0) {
              for (let i = 0; i < tempRawData.length; i++) {
                (tempRawData[i].empName = tempRawData[i].empName),
                  (tempRawData[i] = {
                    ...tempRawData[i],
                    isOpenInner: false,
                    branchName: getBranchName(tempRawData[i].branchId),
                    employeeTargetAchievements: [],
                    tempTargetAchievements: tempRawData[i]?.targetAchievements,
                  });
                if (i === tempRawData.length - 1) {
                  localData[index].employeeTargetAchievements = tempRawData;
                  let newIds = tempRawData.map((emp) => emp.empId);
                  if (newIds.length >= 2) {
                    for (let i = 0; i < newIds.length; i++) {
                      const element = newIds[i].toString();
                      let tempPayload = getTotalPayload(employeeData, element);
                      const response = await client.post(
                        URL.GET_LIVE_LEADS_INSIGHTS(),
                        tempPayload
                      );
                      const json = await response.json();
                      if (Array.isArray(json)) {
                        localData[index].employeeTargetAchievements[
                          i
                        ].targetAchievements = json;
                      }
                    }
                  }
                }
              }
            }
            // alert(JSON.stringify(localData))
            setAllParameters([...localData]);
          }
        );

        // if (localData[index].employeeTargetAchievements.length > 0) {
        //   for (let j = 0; j < localData[index].employeeTargetAchievements.length; j++) {
        //     localData[index].employeeTargetAchievements[j].isOpenInner = false;
        //   }
        // }
      }
    } else {
      setAllParameters([...localData]);
    }
  };

  const paramNameLabels = { preenquiry: "Contacts", invoice: "Retail" };

  function convertParamNameLabels(paramName) {
    paramName = paramName ? paramName : "";
    if (paramNameLabels.hasOwnProperty(paramName.toLowerCase())) {
      paramName = paramNameLabels[paramName.toLowerCase()];
    }
    return paramName;
  }

  function navigateToEmsScreen(item) {
    const leads = ["enquiry", "booking", "invoice"];
    const { paramName } = item;
    const isContact = paramName.toLowerCase() === "preenquiry";
    const isLead = leads.includes(paramName.toLowerCase());
    if (isLead) {
      navigation.navigate(AppNavigator.TabStackIdentifiers.ems);
      setTimeout(() => {
        navigation.navigate("LEADS", {
          param: paramName === "INVOICE" ? "Retail" : paramName,
          moduleType: "live-leads",
        });
      }, 1000);
    } else if (isContact) {
      navigation.navigate(AppNavigator.TabStackIdentifiers.ems);
      setTimeout(() => {
        navigation.navigate(EmsTopTabNavigatorIdentifiers.preEnquiry, {
          moduleType: "live-leads",
        });
      }, 100);
    }
  }

  const renderSelfInsightsView = (item, index) => {
    return (
      <Card
        style={[
          styles.paramCard,
          {
            borderColor: color[index % color.length],
          },
        ]}
      >
        <View style={styles.insightParamsContainer}>
          <Text style={styles.insightParamsLabel}>
            {convertParamNameLabels(item?.paramName)}
          </Text>
          <Text
            style={[
              styles.achievementCountView,
              {
                textDecorationLine:
                  item?.achievment && item?.achievment > 0
                    ? "underline"
                    : "none",
              },
            ]}
            onPress={() =>
              item?.achievment && item?.achievment > 0
                ? navigateToEmsScreen(item)
                : null
            }
          >
            {item?.achievment && item?.achievment > 0 ? item?.achievment : 0}
          </Text>
          <View></View>
        </View>
      </Card>
      // <View
      //     style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, marginHorizontal: 8, alignItems: 'center'}}>
      //     <Text
      //         style={{width: '40%'}}>{convertParamNameLabels(item?.paramName)}</Text>
      //     <Text style={{ minWidth: 45,
      //         height: 25,
      //         borderColor: color[index % color.length],
      //         borderWidth: 1,
      //         borderRadius: 8,
      //         justifyContent: "center",
      //         alignItems: "center",
      //         textAlign: 'center',
      //         paddingTop: 4}} onPress={() => navigateToEmsScreen(item)}>{item?.achievment}</Text>
      //     <View></View>
      // </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        {selector.isTeam ? (
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                // borderBottomWidth: 2,
                // borderBottomColor: Colors.RED,
                paddingBottom: 8,
              }}
            >
              {/*<SegmentedControl*/}
              {/*    style={{*/}
              {/*        marginHorizontal: 4,*/}
              {/*        justifyContent: 'center',*/}
              {/*        alignSelf: 'flex-end',*/}
              {/*        height: 24,*/}
              {/*        marginTop: 8,*/}
              {/*        width: '75%'*/}
              {/*    }}*/}
              {/*    values={['ETVBRL', 'Allied', 'View All']}*/}
              {/*    selectedIndex={toggleParamsIndex}*/}
              {/*    tintColor={Colors.RED}*/}
              {/*    fontStyle={{color: Colors.BLACK, fontSize: 10}}*/}
              {/*    activeFontStyle={{color: Colors.WHITE, fontSize: 10}}*/}
              {/*    onChange={event => {*/}
              {/*        const index = event.nativeEvent.selectedSegmentIndex;*/}
              {/*        let data = [...paramsMetadata];*/}
              {/*        if (index !== 2) {*/}
              {/*            data = data.filter(x => x.toggleIndex === index);*/}
              {/*        } else {*/}
              {/*            data = [...paramsMetadata];*/}
              {/*        }*/}
              {/*        setToggleParamsMetaData([...data]);*/}
              {/*        setToggleParamsIndex(index);*/}
              {/*    }}*/}
              {/*/>*/}
              {/*<View style={{height: 24, width: '20%', marginLeft: 4}}>*/}
              {/*    <View style={styles.percentageToggleView}>*/}
              {/*        <PercentageToggleControl toggleChange={(x) => setTogglePercentage(x)}/>*/}
              {/*    </View>*/}
              {/*</View>*/}
            </View>
            {isLoading ? (
              <ActivityIndicator color={Colors.RED} size={"large"} />
            ) : (
              <ScrollView
                contentContainerStyle={{
                  paddingRight: 0,
                  flexDirection: "column",
                }}
                horizontal={true}
                directionalLockEnabled={true}
              >
                {/* TOP Header view */}
                <View
                  key={"headers"}
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 0.5,
                    paddingBottom: 4,
                    borderBottomColor: Colors.GRAY,
                  }}
                >
                  <View
                    style={{ width: 70, height: 20, marginRight: 5 }}
                  ></View>
                  <View
                    style={{ width: "100%", height: 20, flexDirection: "row" }}
                  >
                    {toggleParamsMetaData.map((param) => {
                      return (
                        <View style={styles.itemBox} key={param.shortName}>
                          <Text
                            style={{
                              color: param.color,
                              fontSize: 12,
                            }}
                          >
                            {param.shortName}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
                {/* Employee params section */}
                {myParameters.length > 0 &&
                  myParameters.map((item, index) => {
                    return (
                      <View key={`${item.empId} ${index}`}>
                        <View
                          style={{
                            paddingHorizontal: 8,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 12,
                            width: "100%",
                          }}
                        >
                          <Text style={{ fontSize: 12, fontWeight: "600" }}>
                            {item.empName}
                          </Text>
                          <Pressable
                            onPress={() => {
                              navigation.navigate(
                                AppNavigator.HomeStackIdentifiers.sourceModel,
                                {
                                  empId: item.empId,
                                  headerTitle: item.empName,
                                  loggedInEmpId:
                                    selector.login_employee_details.empId,
                                  orgId: selector.login_employee_details.orgId,
                                  type: "TEAM",
                                  moduleType: "live-leads",
                                }
                              );
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: "600",
                                color: Colors.BLUE,
                              }}
                            >
                              Source/Model
                            </Text>
                          </Pressable>
                        </View>
                        {/*Source/Model View END */}
                        <View
                          style={[
                            { flexDirection: "row" },
                            item.isOpenInner && {
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: "#C62159",
                            },
                          ]}
                        >
                          {/*RIGHT SIDE VIEW*/}
                          <View
                            style={[
                              {
                                width: "100%",
                                minHeight: 40,
                                flexDirection: "column",
                                paddingHorizontal: 5,
                              },
                            ]}
                          >
                            <View
                              style={{
                                width: "100%",
                                minHeight: 40,
                                flexDirection: "row",
                              }}
                            >
                              <RenderLevel1NameView
                                level={0}
                                item={item}
                                branchName={getBranchName(item.branchId)}
                                color={"#C62159"}
                                titleClick={() => {}}
                                disable={true}
                              />
                              {renderData(item, "#C62159")}
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                {allParameters.length > 0 &&
                  allParameters.map((item, index) => {
                    return (
                      <View key={`${item.empId} ${index}`}>
                        <View
                          style={{
                            paddingHorizontal: 8,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 12,
                            width: "100%",
                          }}
                        >
                          <Text style={{ fontSize: 12, fontWeight: "600" }}>
                            {item.empName}
                          </Text>
                          <Pressable
                            onPress={() => {
                              navigation.navigate(
                                AppNavigator.HomeStackIdentifiers.sourceModel,
                                {
                                  empId: item.empId,
                                  headerTitle: item.empName,
                                  loggedInEmpId:
                                    selector.login_employee_details.empId,
                                  orgId: selector.login_employee_details.orgId,
                                  type: "TEAM",
                                  moduleType: "live-leads",
                                }
                              );
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: "600",
                                color: Colors.BLUE,
                              }}
                            >
                              Source/Model
                            </Text>
                          </Pressable>
                        </View>
                        {/*Source/Model View END */}
                        <View
                          style={[
                            { flexDirection: "row" },
                            item.isOpenInner && {
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: "#C62159",
                            },
                          ]}
                        >
                          {/*RIGHT SIDE VIEW*/}
                          <View
                            style={[
                              {
                                width: "100%",
                                minHeight: 40,
                                flexDirection: "column",
                                paddingHorizontal: 5,
                              },
                            ]}
                          >
                            <View
                              style={{
                                width: "100%",
                                minHeight: 40,
                                flexDirection: "row",
                              }}
                            >
                              <RenderLevel1NameView
                                level={0}
                                item={item}
                                branchName={getBranchName(item.branchId)}
                                color={"#C62159"}
                                titleClick={async () => {
                                  await onEmployeeNameClick(item, index);
                                }}
                              />
                              {renderData(item, "#C62159")}
                            </View>

                            {item.isOpenInner &&
                              item.employeeTargetAchievements.length > 0 &&
                              item.employeeTargetAchievements.map(
                                (innerItem1, innerIndex1) => {
                                  return (
                                    <View
                                      key={innerIndex1}
                                      style={[
                                        {
                                          width: "100%",
                                          minHeight: 40,
                                          flexDirection: "column",
                                        },
                                        innerItem1.isOpenInner && {
                                          borderRadius: 10,
                                          borderWidth: 1,
                                          borderColor: "#F59D00",
                                          backgroundColor: "#FFFFFF",
                                        },
                                      ]}
                                    >
                                      <View
                                        style={[
                                          {
                                            width: "100%",
                                            minHeight: 40,
                                            flexDirection: "column",
                                          },
                                        ]}
                                      >
                                        <View
                                          style={{
                                            paddingHorizontal: 4,
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            marginTop: 8,
                                          }}
                                        >
                                          <Text
                                            style={{
                                              fontSize: 10,
                                              fontWeight: "500",
                                            }}
                                          >
                                            {innerItem1.empName}
                                          </Text>
                                          <Pressable
                                            onPress={() => {
                                              navigation.navigate(
                                                AppNavigator
                                                  .HomeStackIdentifiers
                                                  .sourceModel,
                                                {
                                                  empId: innerItem1.empId,
                                                  headerTitle:
                                                    innerItem1.empName,
                                                  type: "TEAM",
                                                  moduleType: "live-leads",
                                                }
                                              );
                                            }}
                                          >
                                            <Text
                                              style={{
                                                fontSize: 12,
                                                fontWeight: "600",
                                                color: Colors.BLUE,
                                                marginLeft: 8,
                                              }}
                                            >
                                              Source/Model
                                            </Text>
                                          </Pressable>
                                        </View>
                                        {/*Source/Model View END */}
                                        <View style={{ flexDirection: "row" }}>
                                          <RenderLevel1NameView
                                            level={1}
                                            item={innerItem1}
                                            color={"#F59D00"}
                                            titleClick={async () => {
                                              setSelectedName(
                                                innerItem1.empName
                                              );
                                              setTimeout(() => {
                                                setSelectedName("");
                                              }, 900);
                                              let localData = [
                                                ...allParameters,
                                              ];
                                              let current =
                                                localData[index]
                                                  .employeeTargetAchievements[
                                                  innerIndex1
                                                ].isOpenInner;
                                              for (
                                                let i = 0;
                                                i <
                                                localData[index]
                                                  .employeeTargetAchievements
                                                  .length;
                                                i++
                                              ) {
                                                localData[
                                                  index
                                                ].employeeTargetAchievements[
                                                  i
                                                ].isOpenInner = false;
                                                if (
                                                  i ===
                                                  localData[index]
                                                    .employeeTargetAchievements
                                                    .length -
                                                    1
                                                ) {
                                                  localData[
                                                    index
                                                  ].employeeTargetAchievements[
                                                    innerIndex1
                                                  ].isOpenInner = !current;
                                                }
                                              }

                                              if (!current) {
                                                let employeeData =
                                                  await AsyncStore.getData(
                                                    AsyncStore.Keys
                                                      .LOGIN_EMPLOYEE
                                                  );
                                                if (employeeData) {
                                                  const jsonObj =
                                                    JSON.parse(employeeData);
                                                  const dateFormat =
                                                    "YYYY-MM-DD";
                                                  const currentDate =
                                                    moment().format(dateFormat);
                                                  const monthFirstDate = moment(
                                                    currentDate,
                                                    dateFormat
                                                  )
                                                    .subtract(0, "months")
                                                    .startOf("month")
                                                    .format(dateFormat);
                                                  const monthLastDate = moment(
                                                    currentDate,
                                                    dateFormat
                                                  )
                                                    .subtract(0, "months")
                                                    .endOf("month")
                                                    .format(dateFormat);
                                                  let payload = {
                                                    orgId: jsonObj.orgId,
                                                    selectedEmpId:
                                                      innerItem1.empId,
                                                    endDate: currentDate,
                                                    loggedInEmpId:
                                                      jsonObj.empId,
                                                    empId: innerItem1.empId,
                                                    startDate: monthFirstDate,
                                                    levelSelected: null,
                                                    pageNo: 0,
                                                    size: 100,
                                                  };
                                                  Promise.all([
                                                    dispatch(
                                                      getUserWiseTargetParameters(
                                                        payload
                                                      )
                                                    ),
                                                  ]).then(async (res) => {
                                                    let tempRawData = [];
                                                    tempRawData =
                                                      res[0]?.payload?.employeeTargetAchievements.filter(
                                                        (item) =>
                                                          item.empId !==
                                                          innerItem1.empId
                                                      );
                                                    if (
                                                      tempRawData.length > 0
                                                    ) {
                                                      for (
                                                        let i = 0;
                                                        i < tempRawData.length;
                                                        i++
                                                      ) {
                                                        tempRawData[i] = {
                                                          ...tempRawData[i],
                                                          isOpenInner: false,
                                                          employeeTargetAchievements:
                                                            [],
                                                          tempTargetAchievements:
                                                            tempRawData[i]
                                                              ?.targetAchievements,
                                                        };
                                                        if (
                                                          i ===
                                                          tempRawData.length - 1
                                                        ) {
                                                          localData[
                                                            index
                                                          ].employeeTargetAchievements[
                                                            innerIndex1
                                                          ].employeeTargetAchievements =
                                                            tempRawData;
                                                          let newIds =
                                                            tempRawData.map(
                                                              (emp) => emp.empId
                                                            );
                                                          if (
                                                            newIds.length >= 2
                                                          ) {
                                                            for (
                                                              let i = 0;
                                                              i < newIds.length;
                                                              i++
                                                            ) {
                                                              const element =
                                                                newIds[
                                                                  i
                                                                ].toString();
                                                              let tempPayload =
                                                                getTotalPayload(
                                                                  employeeData,
                                                                  element
                                                                );
                                                              const response =
                                                                await client.post(
                                                                  URL.GET_LIVE_LEADS_INSIGHTS(),
                                                                  tempPayload
                                                                );
                                                              const json =
                                                                await response.json();
                                                              if (
                                                                Array.isArray(
                                                                  json
                                                                )
                                                              ) {
                                                                localData[
                                                                  index
                                                                ].employeeTargetAchievements[
                                                                  innerIndex1
                                                                ].employeeTargetAchievements[
                                                                  i
                                                                ].targetAchievements =
                                                                  json;
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                    setAllParameters([
                                                      ...localData,
                                                    ]);
                                                  });

                                                  // if (localData[index].employeeTargetAchievements.length > 0) {
                                                  //   for (let j = 0; j < localData[index].employeeTargetAchievements.length; j++) {
                                                  //     localData[index].employeeTargetAchievements[j].isOpenInner = false;
                                                  //   }
                                                  // }
                                                  // setAllParameters([...localData])
                                                }
                                              } else {
                                                setAllParameters([
                                                  ...localData,
                                                ]);
                                              }
                                              // setAllParameters([...localData])
                                            }}
                                          />
                                          {renderData(innerItem1, "#F59D00")}
                                        </View>
                                        {innerItem1.isOpenInner &&
                                          innerItem1.employeeTargetAchievements
                                            .length > 0 &&
                                          innerItem1.employeeTargetAchievements.map(
                                            (innerItem2, innerIndex2) => {
                                              return (
                                                <View
                                                  key={innerIndex2}
                                                  style={[
                                                    {
                                                      width: "98%",
                                                      minHeight: 40,
                                                      flexDirection: "column",
                                                    },
                                                    innerItem2.isOpenInner && {
                                                      borderRadius: 10,
                                                      borderWidth: 1,
                                                      borderColor: "#2C97DE",
                                                      backgroundColor:
                                                        "#EEEEEE",
                                                      marginHorizontal: 5,
                                                    },
                                                  ]}
                                                >
                                                  <View
                                                    style={{
                                                      paddingHorizontal: 4,
                                                      display: "flex",
                                                      flexDirection: "row",
                                                      justifyContent:
                                                        "space-between",
                                                      paddingVertical: 4,
                                                    }}
                                                  >
                                                    <Text
                                                      style={{
                                                        fontSize: 10,
                                                        fontWeight: "500",
                                                      }}
                                                    >
                                                      {innerItem2.empName}
                                                    </Text>
                                                    <Pressable
                                                      onPress={() => {
                                                        navigation.navigate(
                                                          AppNavigator
                                                            .HomeStackIdentifiers
                                                            .sourceModel,
                                                          {
                                                            empId:
                                                              innerItem2.empId,
                                                            headerTitle:
                                                              innerItem2.empName,
                                                            type: "TEAM",
                                                            moduleType:
                                                              "live-leads",
                                                          }
                                                        );
                                                      }}
                                                    >
                                                      <Text
                                                        style={{
                                                          fontSize: 12,
                                                          fontWeight: "600",
                                                          color: Colors.BLUE,
                                                          marginLeft: 8,
                                                        }}
                                                      >
                                                        Source/Model
                                                      </Text>
                                                    </Pressable>
                                                  </View>
                                                  <View
                                                    style={{
                                                      flexDirection: "row",
                                                    }}
                                                  >
                                                    <RenderLevel1NameView
                                                      level={2}
                                                      item={innerItem2}
                                                      color={"#2C97DE"}
                                                      titleClick={async () => {
                                                        setSelectedName(
                                                          innerItem2.empName
                                                        );
                                                        setTimeout(() => {
                                                          setSelectedName("");
                                                        }, 900);
                                                        let localData = [
                                                          ...allParameters,
                                                        ];
                                                        let current =
                                                          localData[index]
                                                            .employeeTargetAchievements[
                                                            innerIndex1
                                                          ]
                                                            .employeeTargetAchievements[
                                                            innerIndex2
                                                          ].isOpenInner;
                                                        for (
                                                          let i = 0;
                                                          i <
                                                          localData[index]
                                                            .employeeTargetAchievements[
                                                            innerIndex1
                                                          ]
                                                            .employeeTargetAchievements
                                                            .length;
                                                          i++
                                                        ) {
                                                          localData[
                                                            index
                                                          ].employeeTargetAchievements[
                                                            innerIndex1
                                                          ].employeeTargetAchievements[
                                                            i
                                                          ].isOpenInner = false;
                                                          if (
                                                            i ===
                                                            localData[index]
                                                              .employeeTargetAchievements[
                                                              innerIndex1
                                                            ]
                                                              .employeeTargetAchievements
                                                              .length -
                                                              1
                                                          ) {
                                                            localData[
                                                              index
                                                            ].employeeTargetAchievements[
                                                              innerIndex1
                                                            ].employeeTargetAchievements[
                                                              innerIndex2
                                                            ].isOpenInner =
                                                              !current;
                                                          }
                                                        }

                                                        if (!current) {
                                                          let employeeData =
                                                            await AsyncStore.getData(
                                                              AsyncStore.Keys
                                                                .LOGIN_EMPLOYEE
                                                            );
                                                          if (employeeData) {
                                                            const jsonObj =
                                                              JSON.parse(
                                                                employeeData
                                                              );
                                                            const dateFormat =
                                                              "YYYY-MM-DD";
                                                            const currentDate =
                                                              moment().format(
                                                                dateFormat
                                                              );
                                                            const monthFirstDate =
                                                              moment(
                                                                currentDate,
                                                                dateFormat
                                                              )
                                                                .subtract(
                                                                  0,
                                                                  "months"
                                                                )
                                                                .startOf(
                                                                  "month"
                                                                )
                                                                .format(
                                                                  dateFormat
                                                                );
                                                            const monthLastDate =
                                                              moment(
                                                                currentDate,
                                                                dateFormat
                                                              )
                                                                .subtract(
                                                                  0,
                                                                  "months"
                                                                )
                                                                .endOf("month")
                                                                .format(
                                                                  dateFormat
                                                                );
                                                            let payload = {
                                                              orgId:
                                                                jsonObj.orgId,
                                                              selectedEmpId:
                                                                innerItem2.empId,
                                                              endDate:
                                                                currentDate,
                                                              loggedInEmpId:
                                                                jsonObj.empId,
                                                              empId:
                                                                innerItem2.empId,
                                                              startDate:
                                                                monthFirstDate,
                                                              levelSelected:
                                                                null,
                                                              pageNo: 0,
                                                              size: 100,
                                                            };
                                                            Promise.all([
                                                              dispatch(
                                                                getUserWiseTargetParameters(
                                                                  payload
                                                                )
                                                              ),
                                                            ]).then((res) => {
                                                              let tempRawData =
                                                                [];
                                                              tempRawData =
                                                                res[0]?.payload?.employeeTargetAchievements.filter(
                                                                  (item) =>
                                                                    item.empId !==
                                                                    innerItem2.empId
                                                                );
                                                              if (
                                                                tempRawData.length >
                                                                0
                                                              ) {
                                                                for (
                                                                  let i = 0;
                                                                  i <
                                                                  tempRawData.length;
                                                                  i++
                                                                ) {
                                                                  tempRawData[
                                                                    i
                                                                  ] = {
                                                                    ...tempRawData[
                                                                      i
                                                                    ],
                                                                    isOpenInner: false,
                                                                    employeeTargetAchievements:
                                                                      [],
                                                                  };
                                                                  if (
                                                                    i ===
                                                                    tempRawData.length -
                                                                      1
                                                                  ) {
                                                                    localData[
                                                                      index
                                                                    ].employeeTargetAchievements[
                                                                      innerIndex1
                                                                    ].employeeTargetAchievements[
                                                                      innerIndex2
                                                                    ].employeeTargetAchievements =
                                                                      tempRawData;
                                                                  }
                                                                }
                                                              }
                                                              setAllParameters([
                                                                ...localData,
                                                              ]);
                                                            });

                                                            // if (localData[index].employeeTargetAchievements.length > 0) {
                                                            //   for (let j = 0; j < localData[index].employeeTargetAchievements.length; j++) {
                                                            //     localData[index].employeeTargetAchievements[j].isOpenInner = false;
                                                            //   }
                                                            // }
                                                            // setAllParameters([...localData])
                                                          }
                                                        } else {
                                                          setAllParameters([
                                                            ...localData,
                                                          ]);
                                                        }
                                                        // setAllParameters([...localData])
                                                      }}
                                                    />
                                                    {renderData(
                                                      innerItem2,
                                                      "#2C97DE"
                                                    )}
                                                  </View>
                                                  {innerItem2.isOpenInner &&
                                                    innerItem2
                                                      .employeeTargetAchievements
                                                      .length > 0 &&
                                                    innerItem2.employeeTargetAchievements.map(
                                                      (
                                                        innerItem3,
                                                        innerIndex3
                                                      ) => {
                                                        return (
                                                          <View
                                                            key={innerIndex3}
                                                            style={[
                                                              {
                                                                width: "98%",
                                                                minHeight: 40,
                                                                flexDirection:
                                                                  "column",
                                                              },
                                                              innerItem3.isOpenInner && {
                                                                borderRadius: 10,
                                                                borderWidth: 1,
                                                                borderColor:
                                                                  "#EC3466",
                                                                backgroundColor:
                                                                  "#FFFFFF",
                                                                marginHorizontal: 5,
                                                              },
                                                            ]}
                                                          >
                                                            <View
                                                              style={{
                                                                paddingHorizontal: 4,
                                                                display: "flex",
                                                                flexDirection:
                                                                  "row",
                                                                justifyContent:
                                                                  "space-between",
                                                                paddingVertical: 4,
                                                              }}
                                                            >
                                                              <Text
                                                                style={{
                                                                  fontSize: 10,
                                                                  fontWeight:
                                                                    "500",
                                                                }}
                                                              >
                                                                {
                                                                  innerItem3.empName
                                                                }
                                                              </Text>
                                                              <Pressable
                                                                onPress={() => {
                                                                  navigation.navigate(
                                                                    AppNavigator
                                                                      .HomeStackIdentifiers
                                                                      .sourceModel,
                                                                    {
                                                                      empId:
                                                                        innerItem3.empId,
                                                                      headerTitle:
                                                                        innerItem3.empName,
                                                                      type: "TEAM",
                                                                      moduleType:
                                                                        "live-leads",
                                                                    }
                                                                  );
                                                                }}
                                                              >
                                                                <Text
                                                                  style={{
                                                                    fontSize: 12,
                                                                    fontWeight:
                                                                      "600",
                                                                    color:
                                                                      Colors.BLUE,
                                                                    marginLeft: 8,
                                                                  }}
                                                                >
                                                                  Source/Model
                                                                </Text>
                                                              </Pressable>
                                                            </View>
                                                            <View
                                                              style={{
                                                                flexDirection:
                                                                  "row",
                                                              }}
                                                            >
                                                              <RenderLevel1NameView
                                                                level={3}
                                                                item={
                                                                  innerItem3
                                                                }
                                                                color={
                                                                  "#EC3466"
                                                                }
                                                                titleClick={async () => {
                                                                  setSelectedName(
                                                                    innerItem3.empName
                                                                  );
                                                                  setTimeout(
                                                                    () => {
                                                                      setSelectedName(
                                                                        ""
                                                                      );
                                                                    },
                                                                    900
                                                                  );
                                                                  let localData =
                                                                    [
                                                                      ...allParameters,
                                                                    ];
                                                                  let current =
                                                                    localData[
                                                                      index
                                                                    ]
                                                                      .employeeTargetAchievements[
                                                                      innerIndex1
                                                                    ]
                                                                      .employeeTargetAchievements[
                                                                      innerIndex2
                                                                    ]
                                                                      .employeeTargetAchievements[
                                                                      innerIndex3
                                                                    ]
                                                                      .isOpenInner;
                                                                  for (
                                                                    let i = 0;
                                                                    i <
                                                                    localData[
                                                                      index
                                                                    ]
                                                                      .employeeTargetAchievements[
                                                                      innerIndex1
                                                                    ]
                                                                      .employeeTargetAchievements[
                                                                      innerIndex2
                                                                    ]
                                                                      .employeeTargetAchievements
                                                                      .length;
                                                                    i++
                                                                  ) {
                                                                    localData[
                                                                      index
                                                                    ].employeeTargetAchievements[
                                                                      innerIndex1
                                                                    ].employeeTargetAchievements[
                                                                      innerIndex2
                                                                    ].employeeTargetAchievements[
                                                                      i
                                                                    ].isOpenInner = false;
                                                                    if (
                                                                      i ===
                                                                      localData[
                                                                        index
                                                                      ]
                                                                        .employeeTargetAchievements[
                                                                        innerIndex1
                                                                      ]
                                                                        .employeeTargetAchievements[
                                                                        innerIndex2
                                                                      ]
                                                                        .employeeTargetAchievements
                                                                        .length -
                                                                        1
                                                                    ) {
                                                                      localData[
                                                                        index
                                                                      ].employeeTargetAchievements[
                                                                        innerIndex1
                                                                      ].employeeTargetAchievements[
                                                                        innerIndex2
                                                                      ].employeeTargetAchievements[
                                                                        innerIndex3
                                                                      ].isOpenInner =
                                                                        !current;
                                                                    }
                                                                  }

                                                                  if (
                                                                    !current
                                                                  ) {
                                                                    let employeeData =
                                                                      await AsyncStore.getData(
                                                                        AsyncStore
                                                                          .Keys
                                                                          .LOGIN_EMPLOYEE
                                                                      );
                                                                    if (
                                                                      employeeData
                                                                    ) {
                                                                      const jsonObj =
                                                                        JSON.parse(
                                                                          employeeData
                                                                        );
                                                                      const dateFormat =
                                                                        "YYYY-MM-DD";
                                                                      const currentDate =
                                                                        moment().format(
                                                                          dateFormat
                                                                        );
                                                                      const monthFirstDate =
                                                                        moment(
                                                                          currentDate,
                                                                          dateFormat
                                                                        )
                                                                          .subtract(
                                                                            0,
                                                                            "months"
                                                                          )
                                                                          .startOf(
                                                                            "month"
                                                                          )
                                                                          .format(
                                                                            dateFormat
                                                                          );
                                                                      const monthLastDate =
                                                                        moment(
                                                                          currentDate,
                                                                          dateFormat
                                                                        )
                                                                          .subtract(
                                                                            0,
                                                                            "months"
                                                                          )
                                                                          .endOf(
                                                                            "month"
                                                                          )
                                                                          .format(
                                                                            dateFormat
                                                                          );
                                                                      let payload =
                                                                        {
                                                                          orgId:
                                                                            jsonObj.orgId,
                                                                          selectedEmpId:
                                                                            innerItem3.empId,
                                                                          endDate:
                                                                            currentDate,
                                                                          loggedInEmpId:
                                                                            jsonObj.empId,
                                                                          empId:
                                                                            innerItem3.empId,
                                                                          startDate:
                                                                            monthFirstDate,
                                                                          levelSelected:
                                                                            null,
                                                                          pageNo: 0,
                                                                          size: 100,
                                                                        };
                                                                      Promise.all(
                                                                        [
                                                                          dispatch(
                                                                            getUserWiseTargetParameters(
                                                                              payload
                                                                            )
                                                                          ),
                                                                        ]
                                                                      ).then(
                                                                        (
                                                                          res
                                                                        ) => {
                                                                          let tempRawData =
                                                                            [];
                                                                          tempRawData =
                                                                            res[0]?.payload?.employeeTargetAchievements.filter(
                                                                              (
                                                                                item
                                                                              ) =>
                                                                                item.empId !==
                                                                                innerItem3.empId
                                                                            );
                                                                          if (
                                                                            tempRawData.length >
                                                                            0
                                                                          ) {
                                                                            for (
                                                                              let i = 0;
                                                                              i <
                                                                              tempRawData.length;
                                                                              i++
                                                                            ) {
                                                                              tempRawData[
                                                                                i
                                                                              ] =
                                                                                {
                                                                                  ...tempRawData[
                                                                                    i
                                                                                  ],
                                                                                  isOpenInner: false,
                                                                                  employeeTargetAchievements:
                                                                                    [],
                                                                                };
                                                                              if (
                                                                                i ===
                                                                                tempRawData.length -
                                                                                  1
                                                                              ) {
                                                                                localData[
                                                                                  index
                                                                                ].employeeTargetAchievements[
                                                                                  innerIndex1
                                                                                ].employeeTargetAchievements[
                                                                                  innerIndex2
                                                                                ].employeeTargetAchievements[
                                                                                  innerIndex3
                                                                                ].employeeTargetAchievements =
                                                                                  tempRawData;
                                                                              }
                                                                            }
                                                                          }
                                                                          setAllParameters(
                                                                            [
                                                                              ...localData,
                                                                            ]
                                                                          );
                                                                        }
                                                                      );
                                                                    }
                                                                  } else {
                                                                    setAllParameters(
                                                                      [
                                                                        ...localData,
                                                                      ]
                                                                    );
                                                                  }
                                                                  // setAllParameters([...localData])
                                                                }}
                                                              />

                                                              {renderData(
                                                                innerItem3,
                                                                "#EC3466"
                                                              )}
                                                            </View>
                                                            {innerItem3.isOpenInner &&
                                                              innerItem3
                                                                .employeeTargetAchievements
                                                                .length > 0 &&
                                                              innerItem3.employeeTargetAchievements.map(
                                                                (
                                                                  innerItem4,
                                                                  innerIndex4
                                                                ) => {
                                                                  return (
                                                                    <View
                                                                      key={
                                                                        innerIndex4
                                                                      }
                                                                      style={[
                                                                        {
                                                                          width:
                                                                            "98%",
                                                                          minHeight: 40,
                                                                          flexDirection:
                                                                            "column",
                                                                        },
                                                                        innerItem4.isOpenInner && {
                                                                          borderRadius: 10,
                                                                          borderWidth: 1,
                                                                          borderColor:
                                                                            "#1C95A6",
                                                                          backgroundColor:
                                                                            "#EEEEEE",
                                                                          marginHorizontal: 5,
                                                                        },
                                                                      ]}
                                                                    >
                                                                      <View
                                                                        style={{
                                                                          flexDirection:
                                                                            "row",
                                                                        }}
                                                                      >
                                                                        <RenderLevel1NameView
                                                                          level={
                                                                            4
                                                                          }
                                                                          item={
                                                                            innerItem4
                                                                          }
                                                                          color={
                                                                            "#1C95A6"
                                                                          }
                                                                          titleClick={async () => {
                                                                            setSelectedName(
                                                                              innerItem4.empName
                                                                            );
                                                                            setTimeout(
                                                                              () => {
                                                                                setSelectedName(
                                                                                  ""
                                                                                );
                                                                              },
                                                                              900
                                                                            );
                                                                            let localData =
                                                                              [
                                                                                ...allParameters,
                                                                              ];
                                                                            let current =
                                                                              localData[
                                                                                index
                                                                              ]
                                                                                .employeeTargetAchievements[
                                                                                innerIndex1
                                                                              ]
                                                                                .employeeTargetAchievements[
                                                                                innerIndex2
                                                                              ]
                                                                                .employeeTargetAchievements[
                                                                                innerIndex3
                                                                              ]
                                                                                .employeeTargetAchievements[
                                                                                innerIndex4
                                                                              ]
                                                                                .isOpenInner;
                                                                            for (
                                                                              let i = 0;
                                                                              i <
                                                                              localData[
                                                                                index
                                                                              ]
                                                                                .employeeTargetAchievements[
                                                                                innerIndex1
                                                                              ]
                                                                                .employeeTargetAchievements[
                                                                                innerIndex2
                                                                              ]
                                                                                .employeeTargetAchievements[
                                                                                innerIndex3
                                                                              ]
                                                                                .employeeTargetAchievements
                                                                                .length;
                                                                              i++
                                                                            ) {
                                                                              localData[
                                                                                index
                                                                              ].employeeTargetAchievements[
                                                                                innerIndex1
                                                                              ].employeeTargetAchievements[
                                                                                innerIndex2
                                                                              ].employeeTargetAchievements[
                                                                                innerIndex3
                                                                              ].employeeTargetAchievements[
                                                                                i
                                                                              ].isOpenInner = false;
                                                                              if (
                                                                                i ===
                                                                                localData[
                                                                                  index
                                                                                ]
                                                                                  .employeeTargetAchievements[
                                                                                  innerIndex1
                                                                                ]
                                                                                  .employeeTargetAchievements[
                                                                                  innerIndex2
                                                                                ]
                                                                                  .employeeTargetAchievements[
                                                                                  innerIndex3
                                                                                ]
                                                                                  .employeeTargetAchievements
                                                                                  .length -
                                                                                  1
                                                                              ) {
                                                                                localData[
                                                                                  index
                                                                                ].employeeTargetAchievements[
                                                                                  innerIndex1
                                                                                ].employeeTargetAchievements[
                                                                                  innerIndex2
                                                                                ].employeeTargetAchievements[
                                                                                  innerIndex3
                                                                                ].employeeTargetAchievements[
                                                                                  innerIndex4
                                                                                ].isOpenInner =
                                                                                  !current;
                                                                              }
                                                                            }

                                                                            if (
                                                                              !current
                                                                            ) {
                                                                              let employeeData =
                                                                                await AsyncStore.getData(
                                                                                  AsyncStore
                                                                                    .Keys
                                                                                    .LOGIN_EMPLOYEE
                                                                                );
                                                                              if (
                                                                                employeeData
                                                                              ) {
                                                                                const jsonObj =
                                                                                  JSON.parse(
                                                                                    employeeData
                                                                                  );
                                                                                const dateFormat =
                                                                                  "YYYY-MM-DD";
                                                                                const currentDate =
                                                                                  moment().format(
                                                                                    dateFormat
                                                                                  );
                                                                                const monthFirstDate =
                                                                                  moment(
                                                                                    currentDate,
                                                                                    dateFormat
                                                                                  )
                                                                                    .subtract(
                                                                                      0,
                                                                                      "months"
                                                                                    )
                                                                                    .startOf(
                                                                                      "month"
                                                                                    )
                                                                                    .format(
                                                                                      dateFormat
                                                                                    );
                                                                                const monthLastDate =
                                                                                  moment(
                                                                                    currentDate,
                                                                                    dateFormat
                                                                                  )
                                                                                    .subtract(
                                                                                      0,
                                                                                      "months"
                                                                                    )
                                                                                    .endOf(
                                                                                      "month"
                                                                                    )
                                                                                    .format(
                                                                                      dateFormat
                                                                                    );
                                                                                let payload =
                                                                                  {
                                                                                    orgId:
                                                                                      jsonObj.orgId,
                                                                                    selectedEmpId:
                                                                                      innerItem4.empId,
                                                                                    endDate:
                                                                                      currentDate,
                                                                                    loggedInEmpId:
                                                                                      jsonObj.empId,
                                                                                    empId:
                                                                                      innerItem4.empId,
                                                                                    startDate:
                                                                                      monthFirstDate,
                                                                                    levelSelected:
                                                                                      null,
                                                                                    pageNo: 0,
                                                                                    size: 100,
                                                                                  };
                                                                                Promise.all(
                                                                                  [
                                                                                    dispatch(
                                                                                      getUserWiseTargetParameters(
                                                                                        payload
                                                                                      )
                                                                                    ),
                                                                                  ]
                                                                                ).then(
                                                                                  (
                                                                                    res
                                                                                  ) => {
                                                                                    let tempRawData =
                                                                                      [];
                                                                                    tempRawData =
                                                                                      res[0]?.payload?.employeeTargetAchievements.filter(
                                                                                        (
                                                                                          item
                                                                                        ) =>
                                                                                          item.empId !==
                                                                                          innerItem4.empId
                                                                                      );
                                                                                    if (
                                                                                      tempRawData.length >
                                                                                      0
                                                                                    ) {
                                                                                      for (
                                                                                        let i = 0;
                                                                                        i <
                                                                                        tempRawData.length;
                                                                                        i++
                                                                                      ) {
                                                                                        tempRawData[
                                                                                          i
                                                                                        ] =
                                                                                          {
                                                                                            ...tempRawData[
                                                                                              i
                                                                                            ],
                                                                                            isOpenInner: false,
                                                                                            employeeTargetAchievements:
                                                                                              [],
                                                                                          };
                                                                                        if (
                                                                                          i ===
                                                                                          tempRawData.length -
                                                                                            1
                                                                                        ) {
                                                                                          localData[
                                                                                            index
                                                                                          ].employeeTargetAchievements[
                                                                                            innerIndex1
                                                                                          ].employeeTargetAchievements[
                                                                                            innerIndex2
                                                                                          ].employeeTargetAchievements[
                                                                                            innerIndex3
                                                                                          ].employeeTargetAchievements[
                                                                                            innerIndex4
                                                                                          ].employeeTargetAchievements =
                                                                                            tempRawData;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                    setAllParameters(
                                                                                      [
                                                                                        ...localData,
                                                                                      ]
                                                                                    );
                                                                                  }
                                                                                );
                                                                              }
                                                                            } else {
                                                                              setAllParameters(
                                                                                [
                                                                                  ...localData,
                                                                                ]
                                                                              );
                                                                            }
                                                                            // setAllParameters([...localData])
                                                                          }}
                                                                        />
                                                                        {renderData(
                                                                          innerItem4,
                                                                          "#1C95A6"
                                                                        )}
                                                                      </View>
                                                                      {innerItem4.isOpenInner &&
                                                                        innerItem4
                                                                          .employeeTargetAchievements
                                                                          .length >
                                                                          0 &&
                                                                        innerItem4.employeeTargetAchievements.map(
                                                                          (
                                                                            innerItem5,
                                                                            innerIndex5
                                                                          ) => {
                                                                            return (
                                                                              <View
                                                                                key={
                                                                                  innerIndex5
                                                                                }
                                                                                style={[
                                                                                  {
                                                                                    width:
                                                                                      "98%",
                                                                                    minHeight: 40,
                                                                                    flexDirection:
                                                                                      "column",
                                                                                  },
                                                                                  innerItem5.isOpenInner && {
                                                                                    borderRadius: 10,
                                                                                    borderWidth: 1,
                                                                                    borderColor:
                                                                                      "#C62159",
                                                                                    backgroundColor:
                                                                                      "#FFFFFF",
                                                                                    marginHorizontal: 5,
                                                                                  },
                                                                                ]}
                                                                              >
                                                                                <View
                                                                                  style={{
                                                                                    flexDirection:
                                                                                      "row",
                                                                                  }}
                                                                                >
                                                                                  <RenderLevel1NameView
                                                                                    level={
                                                                                      5
                                                                                    }
                                                                                    item={
                                                                                      innerItem5
                                                                                    }
                                                                                    color={
                                                                                      "#C62159"
                                                                                    }
                                                                                    titleClick={async () => {
                                                                                      setSelectedName(
                                                                                        innerItem5.empName
                                                                                      );
                                                                                      setTimeout(
                                                                                        () => {
                                                                                          setSelectedName(
                                                                                            ""
                                                                                          );
                                                                                        },
                                                                                        900
                                                                                      );
                                                                                      let localData =
                                                                                        [
                                                                                          ...allParameters,
                                                                                        ];
                                                                                      let current =
                                                                                        localData[
                                                                                          index
                                                                                        ]
                                                                                          .employeeTargetAchievements[
                                                                                          innerIndex1
                                                                                        ]
                                                                                          .employeeTargetAchievements[
                                                                                          innerIndex2
                                                                                        ]
                                                                                          .employeeTargetAchievements[
                                                                                          innerIndex3
                                                                                        ]
                                                                                          .employeeTargetAchievements[
                                                                                          innerIndex4
                                                                                        ]
                                                                                          .employeeTargetAchievements[
                                                                                          innerIndex5
                                                                                        ]
                                                                                          .isOpenInner;
                                                                                      for (
                                                                                        let i = 0;
                                                                                        i <
                                                                                        localData[
                                                                                          index
                                                                                        ]
                                                                                          .employeeTargetAchievements[
                                                                                          innerIndex1
                                                                                        ]
                                                                                          .employeeTargetAchievements[
                                                                                          innerIndex2
                                                                                        ]
                                                                                          .employeeTargetAchievements[
                                                                                          innerIndex3
                                                                                        ]
                                                                                          .employeeTargetAchievements[
                                                                                          innerIndex4
                                                                                        ]
                                                                                          .employeeTargetAchievements
                                                                                          .length;
                                                                                        i++
                                                                                      ) {
                                                                                        localData[
                                                                                          index
                                                                                        ].employeeTargetAchievements[
                                                                                          innerIndex1
                                                                                        ].employeeTargetAchievements[
                                                                                          innerIndex2
                                                                                        ].employeeTargetAchievements[
                                                                                          innerIndex3
                                                                                        ].employeeTargetAchievements[
                                                                                          innerIndex4
                                                                                        ].employeeTargetAchievements[
                                                                                          i
                                                                                        ].isOpenInner = false;
                                                                                        if (
                                                                                          i ===
                                                                                          localData[
                                                                                            index
                                                                                          ]
                                                                                            .employeeTargetAchievements[
                                                                                            innerIndex1
                                                                                          ]
                                                                                            .employeeTargetAchievements[
                                                                                            innerIndex2
                                                                                          ]
                                                                                            .employeeTargetAchievements[
                                                                                            innerIndex3
                                                                                          ]
                                                                                            .employeeTargetAchievements[
                                                                                            innerIndex4
                                                                                          ]
                                                                                            .employeeTargetAchievements
                                                                                            .length -
                                                                                            1
                                                                                        ) {
                                                                                          localData[
                                                                                            index
                                                                                          ].employeeTargetAchievements[
                                                                                            innerIndex1
                                                                                          ].employeeTargetAchievements[
                                                                                            innerIndex2
                                                                                          ].employeeTargetAchievements[
                                                                                            innerIndex3
                                                                                          ].employeeTargetAchievements[
                                                                                            innerIndex4
                                                                                          ].employeeTargetAchievements[
                                                                                            innerIndex5
                                                                                          ].isOpenInner =
                                                                                            !current;
                                                                                        }
                                                                                      }

                                                                                      if (
                                                                                        !current
                                                                                      ) {
                                                                                        let employeeData =
                                                                                          await AsyncStore.getData(
                                                                                            AsyncStore
                                                                                              .Keys
                                                                                              .LOGIN_EMPLOYEE
                                                                                          );
                                                                                        if (
                                                                                          employeeData
                                                                                        ) {
                                                                                          const jsonObj =
                                                                                            JSON.parse(
                                                                                              employeeData
                                                                                            );
                                                                                          const dateFormat =
                                                                                            "YYYY-MM-DD";
                                                                                          const currentDate =
                                                                                            moment().format(
                                                                                              dateFormat
                                                                                            );
                                                                                          const monthFirstDate =
                                                                                            moment(
                                                                                              currentDate,
                                                                                              dateFormat
                                                                                            )
                                                                                              .subtract(
                                                                                                0,
                                                                                                "months"
                                                                                              )
                                                                                              .startOf(
                                                                                                "month"
                                                                                              )
                                                                                              .format(
                                                                                                dateFormat
                                                                                              );
                                                                                          const monthLastDate =
                                                                                            moment(
                                                                                              currentDate,
                                                                                              dateFormat
                                                                                            )
                                                                                              .subtract(
                                                                                                0,
                                                                                                "months"
                                                                                              )
                                                                                              .endOf(
                                                                                                "month"
                                                                                              )
                                                                                              .format(
                                                                                                dateFormat
                                                                                              );
                                                                                          let payload =
                                                                                            {
                                                                                              orgId:
                                                                                                jsonObj.orgId,
                                                                                              selectedEmpId:
                                                                                                innerItem5.empId,
                                                                                              endDate:
                                                                                                currentDate,
                                                                                              loggedInEmpId:
                                                                                                jsonObj.empId,
                                                                                              empId:
                                                                                                innerItem5.empId,
                                                                                              startDate:
                                                                                                monthFirstDate,
                                                                                              levelSelected:
                                                                                                null,
                                                                                              pageNo: 0,
                                                                                              size: 100,
                                                                                            };
                                                                                          Promise.all(
                                                                                            [
                                                                                              dispatch(
                                                                                                getUserWiseTargetParameters(
                                                                                                  payload
                                                                                                )
                                                                                              ),
                                                                                            ]
                                                                                          ).then(
                                                                                            (
                                                                                              res
                                                                                            ) => {
                                                                                              let tempRawData =
                                                                                                [];
                                                                                              tempRawData =
                                                                                                res[0]?.payload?.employeeTargetAchievements.filter(
                                                                                                  (
                                                                                                    item
                                                                                                  ) =>
                                                                                                    item.empId !==
                                                                                                    innerItem5.empId
                                                                                                );
                                                                                              if (
                                                                                                tempRawData.length >
                                                                                                0
                                                                                              ) {
                                                                                                for (
                                                                                                  let i = 0;
                                                                                                  i <
                                                                                                  tempRawData.length;
                                                                                                  i++
                                                                                                ) {
                                                                                                  tempRawData[
                                                                                                    i
                                                                                                  ] =
                                                                                                    {
                                                                                                      ...tempRawData[
                                                                                                        i
                                                                                                      ],
                                                                                                      isOpenInner: false,
                                                                                                      employeeTargetAchievements:
                                                                                                        [],
                                                                                                    };
                                                                                                  if (
                                                                                                    i ===
                                                                                                    tempRawData.length -
                                                                                                      1
                                                                                                  ) {
                                                                                                    localData[
                                                                                                      index
                                                                                                    ].employeeTargetAchievements[
                                                                                                      innerIndex1
                                                                                                    ].employeeTargetAchievements[
                                                                                                      innerIndex2
                                                                                                    ].employeeTargetAchievements[
                                                                                                      innerIndex3
                                                                                                    ].employeeTargetAchievements[
                                                                                                      innerIndex4
                                                                                                    ].employeeTargetAchievements[
                                                                                                      innerIndex5
                                                                                                    ].employeeTargetAchievements =
                                                                                                      tempRawData;
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                              setAllParameters(
                                                                                                [
                                                                                                  ...localData,
                                                                                                ]
                                                                                              );
                                                                                            }
                                                                                          );
                                                                                        }
                                                                                      } else {
                                                                                        setAllParameters(
                                                                                          [
                                                                                            ...localData,
                                                                                          ]
                                                                                        );
                                                                                      }
                                                                                      // setAllParameters([...localData])
                                                                                    }}
                                                                                  />
                                                                                  {renderData(
                                                                                    innerItem5,
                                                                                    "#C62159"
                                                                                  )}
                                                                                </View>
                                                                                {innerItem5.isOpenInner &&
                                                                                  innerItem5
                                                                                    .employeeTargetAchievements
                                                                                    .length >
                                                                                    0 &&
                                                                                  innerItem5.employeeTargetAchievements.map(
                                                                                    (
                                                                                      innerItem6,
                                                                                      innerIndex6
                                                                                    ) => {
                                                                                      return (
                                                                                        <View
                                                                                          key={
                                                                                            innerIndex6
                                                                                          }
                                                                                          style={[
                                                                                            {
                                                                                              width:
                                                                                                "98%",
                                                                                              minHeight: 40,
                                                                                              flexDirection:
                                                                                                "column",
                                                                                            },
                                                                                            innerItem6.isOpenInner && {
                                                                                              borderRadius: 10,
                                                                                              borderWidth: 1,
                                                                                              borderColor:
                                                                                                "#C62159",
                                                                                              backgroundColor:
                                                                                                "#FFFFFF",
                                                                                              marginHorizontal: 5,
                                                                                            },
                                                                                          ]}
                                                                                        >
                                                                                          <View
                                                                                            style={{
                                                                                              flexDirection:
                                                                                                "row",
                                                                                            }}
                                                                                          >
                                                                                            <RenderLevel1NameView
                                                                                              level={
                                                                                                6
                                                                                              }
                                                                                              item={
                                                                                                innerItem6
                                                                                              }
                                                                                              color={
                                                                                                "#C62159"
                                                                                              }
                                                                                              titleClick={async () => {
                                                                                                setSelectedName(
                                                                                                  innerItem6.empName
                                                                                                );
                                                                                                setTimeout(
                                                                                                  () => {
                                                                                                    setSelectedName(
                                                                                                      ""
                                                                                                    );
                                                                                                  },
                                                                                                  900
                                                                                                );
                                                                                                let localData =
                                                                                                  [
                                                                                                    ...allParameters,
                                                                                                  ];
                                                                                                let current =
                                                                                                  localData[
                                                                                                    index
                                                                                                  ]
                                                                                                    .employeeTargetAchievements[
                                                                                                    innerIndex1
                                                                                                  ]
                                                                                                    .employeeTargetAchievements[
                                                                                                    innerIndex2
                                                                                                  ]
                                                                                                    .employeeTargetAchievements[
                                                                                                    innerIndex3
                                                                                                  ]
                                                                                                    .employeeTargetAchievements[
                                                                                                    innerIndex4
                                                                                                  ]
                                                                                                    .employeeTargetAchievements[
                                                                                                    innerIndex5
                                                                                                  ]
                                                                                                    .employeeTargetAchievements[
                                                                                                    innerIndex6
                                                                                                  ]
                                                                                                    .isOpenInner;
                                                                                                for (
                                                                                                  let i = 0;
                                                                                                  i <
                                                                                                  localData[
                                                                                                    index
                                                                                                  ]
                                                                                                    .employeeTargetAchievements[
                                                                                                    innerIndex1
                                                                                                  ]
                                                                                                    .employeeTargetAchievements[
                                                                                                    innerIndex2
                                                                                                  ]
                                                                                                    .employeeTargetAchievements[
                                                                                                    innerIndex3
                                                                                                  ]
                                                                                                    .employeeTargetAchievements[
                                                                                                    innerIndex4
                                                                                                  ]
                                                                                                    .employeeTargetAchievements[
                                                                                                    innerIndex5
                                                                                                  ]
                                                                                                    .employeeTargetAchievements
                                                                                                    .length;
                                                                                                  i++
                                                                                                ) {
                                                                                                  localData[
                                                                                                    index
                                                                                                  ].employeeTargetAchievements[
                                                                                                    innerIndex1
                                                                                                  ].employeeTargetAchievements[
                                                                                                    innerIndex2
                                                                                                  ].employeeTargetAchievements[
                                                                                                    innerIndex3
                                                                                                  ].employeeTargetAchievements[
                                                                                                    innerIndex4
                                                                                                  ].employeeTargetAchievements[
                                                                                                    innerIndex5
                                                                                                  ].employeeTargetAchievements[
                                                                                                    i
                                                                                                  ].isOpenInner = false;
                                                                                                  if (
                                                                                                    i ===
                                                                                                    localData[
                                                                                                      index
                                                                                                    ]
                                                                                                      .employeeTargetAchievements[
                                                                                                      innerIndex1
                                                                                                    ]
                                                                                                      .employeeTargetAchievements[
                                                                                                      innerIndex2
                                                                                                    ]
                                                                                                      .employeeTargetAchievements[
                                                                                                      innerIndex3
                                                                                                    ]
                                                                                                      .employeeTargetAchievements[
                                                                                                      innerIndex4
                                                                                                    ]
                                                                                                      .employeeTargetAchievements[
                                                                                                      innerIndex5
                                                                                                    ]
                                                                                                      .employeeTargetAchievements
                                                                                                      .length -
                                                                                                      1
                                                                                                  ) {
                                                                                                    localData[
                                                                                                      index
                                                                                                    ].employeeTargetAchievements[
                                                                                                      innerIndex1
                                                                                                    ].employeeTargetAchievements[
                                                                                                      innerIndex2
                                                                                                    ].employeeTargetAchievements[
                                                                                                      innerIndex3
                                                                                                    ].employeeTargetAchievements[
                                                                                                      innerIndex4
                                                                                                    ].employeeTargetAchievements[
                                                                                                      innerIndex5
                                                                                                    ].employeeTargetAchievements[
                                                                                                      innerIndex6
                                                                                                    ].isOpenInner =
                                                                                                      !current;
                                                                                                  }
                                                                                                }

                                                                                                if (
                                                                                                  !current
                                                                                                ) {
                                                                                                  let employeeData =
                                                                                                    await AsyncStore.getData(
                                                                                                      AsyncStore
                                                                                                        .Keys
                                                                                                        .LOGIN_EMPLOYEE
                                                                                                    );
                                                                                                  if (
                                                                                                    employeeData
                                                                                                  ) {
                                                                                                    const jsonObj =
                                                                                                      JSON.parse(
                                                                                                        employeeData
                                                                                                      );
                                                                                                    const dateFormat =
                                                                                                      "YYYY-MM-DD";
                                                                                                    const currentDate =
                                                                                                      moment().format(
                                                                                                        dateFormat
                                                                                                      );
                                                                                                    const monthFirstDate =
                                                                                                      moment(
                                                                                                        currentDate,
                                                                                                        dateFormat
                                                                                                      )
                                                                                                        .subtract(
                                                                                                          0,
                                                                                                          "months"
                                                                                                        )
                                                                                                        .startOf(
                                                                                                          "month"
                                                                                                        )
                                                                                                        .format(
                                                                                                          dateFormat
                                                                                                        );
                                                                                                    const monthLastDate =
                                                                                                      moment(
                                                                                                        currentDate,
                                                                                                        dateFormat
                                                                                                      )
                                                                                                        .subtract(
                                                                                                          0,
                                                                                                          "months"
                                                                                                        )
                                                                                                        .endOf(
                                                                                                          "month"
                                                                                                        )
                                                                                                        .format(
                                                                                                          dateFormat
                                                                                                        );
                                                                                                    let payload =
                                                                                                      {
                                                                                                        orgId:
                                                                                                          jsonObj.orgId,
                                                                                                        selectedEmpId:
                                                                                                          innerItem6.empId,
                                                                                                        endDate:
                                                                                                          currentDate,
                                                                                                        loggedInEmpId:
                                                                                                          jsonObj.empId,
                                                                                                        empId:
                                                                                                          innerItem6.empId,
                                                                                                        startDate:
                                                                                                          monthFirstDate,
                                                                                                        levelSelected:
                                                                                                          null,
                                                                                                        pageNo: 0,
                                                                                                        size: 100,
                                                                                                      };
                                                                                                    Promise.all(
                                                                                                      [
                                                                                                        dispatch(
                                                                                                          getUserWiseTargetParameters(
                                                                                                            payload
                                                                                                          )
                                                                                                        ),
                                                                                                      ]
                                                                                                    ).then(
                                                                                                      (
                                                                                                        res
                                                                                                      ) => {
                                                                                                        let tempRawData =
                                                                                                          [];
                                                                                                        tempRawData =
                                                                                                          res[0]?.payload?.employeeTargetAchievements.filter(
                                                                                                            (
                                                                                                              item
                                                                                                            ) =>
                                                                                                              item.empId !==
                                                                                                              innerItem6.empId
                                                                                                          );
                                                                                                        if (
                                                                                                          tempRawData.length >
                                                                                                          0
                                                                                                        ) {
                                                                                                          for (
                                                                                                            let i = 0;
                                                                                                            i <
                                                                                                            tempRawData.length;
                                                                                                            i++
                                                                                                          ) {
                                                                                                            tempRawData[
                                                                                                              i
                                                                                                            ] =
                                                                                                              {
                                                                                                                ...tempRawData[
                                                                                                                  i
                                                                                                                ],
                                                                                                                isOpenInner: false,
                                                                                                                employeeTargetAchievements:
                                                                                                                  [],
                                                                                                              };
                                                                                                            if (
                                                                                                              i ===
                                                                                                              tempRawData.length -
                                                                                                                1
                                                                                                            ) {
                                                                                                              localData[
                                                                                                                index
                                                                                                              ].employeeTargetAchievements[
                                                                                                                innerIndex1
                                                                                                              ].employeeTargetAchievements[
                                                                                                                innerIndex2
                                                                                                              ].employeeTargetAchievements[
                                                                                                                innerIndex3
                                                                                                              ].employeeTargetAchievements[
                                                                                                                innerIndex4
                                                                                                              ].employeeTargetAchievements[
                                                                                                                innerIndex5
                                                                                                              ].employeeTargetAchievements[
                                                                                                                innerIndex6
                                                                                                              ].employeeTargetAchievements =
                                                                                                                tempRawData;
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                        setAllParameters(
                                                                                                          [
                                                                                                            ...localData,
                                                                                                          ]
                                                                                                        );
                                                                                                      }
                                                                                                    );
                                                                                                  }
                                                                                                } else {
                                                                                                  setAllParameters(
                                                                                                    [
                                                                                                      ...localData,
                                                                                                    ]
                                                                                                  );
                                                                                                }
                                                                                                // setAllParameters([...localData])
                                                                                              }}
                                                                                            />
                                                                                            {renderData(
                                                                                              innerItem6,
                                                                                              "#C62159"
                                                                                            )}
                                                                                          </View>
                                                                                        </View>
                                                                                      );
                                                                                    }
                                                                                  )}
                                                                              </View>
                                                                            );
                                                                          }
                                                                        )}
                                                                    </View>
                                                                  );
                                                                }
                                                              )}
                                                          </View>
                                                        );
                                                      }
                                                    )}
                                                </View>
                                              );
                                            }
                                          )}
                                      </View>
                                    </View>
                                  );
                                }
                              )}
                            {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                          </View>
                        </View>
                      </View>
                    );
                  })}
                {/* Grand Total Section */}
                {selector.totalParameters.length > 0 && (
                  <View>
                    <Pressable
                      style={{ alignSelf: "flex-end" }}
                      onPress={() => {
                        navigation.navigate(
                          AppNavigator.HomeStackIdentifiers.sourceModel,
                          {
                            empId: selector.login_employee_details.empId,
                            headerTitle: "Grand Total",
                            loggedInEmpId:
                              selector.login_employee_details.empId,
                            type: "TEAM",
                            moduleType: "live-leads",
                          }
                        );
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: Colors.BLUE,
                          marginLeft: 8,
                          paddingRight: 12,
                        }}
                      >
                        Source/Model
                      </Text>
                    </Pressable>

                    <View style={{ flexDirection: "row", height: 40 }}>
                      <View
                        style={{
                          width: 70,
                          minHeight: 40,
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: "row",
                          backgroundColor: Colors.RED,
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: 6,
                          }}
                        >
                          <Text
                            style={[
                              styles.grandTotalText,
                              {
                                color: Colors.WHITE,
                                fontSize: 12,
                              },
                            ]}
                          >
                            Total
                          </Text>
                        </View>
                        {/*<View>*/}
                        {/*    <Text style={{*/}
                        {/*        fontSize: 6,*/}
                        {/*        fontWeight: 'bold',*/}
                        {/*        paddingVertical: 6,*/}
                        {/*        paddingRight: 2,*/}
                        {/*        height: 20,*/}
                        {/*        color: Colors.WHITE*/}
                        {/*    }}>CNT</Text>*/}
                        {/*    <Text style={{*/}
                        {/*        fontSize: 6,*/}
                        {/*        fontWeight: 'bold',*/}
                        {/*        paddingVertical: 6,*/}
                        {/*        height: 20,*/}
                        {/*        color: Colors.WHITE*/}
                        {/*    }}>TGT</Text>*/}
                        {/*</View>*/}
                      </View>
                      <View
                        style={{
                          minHeight: 40,
                          flexDirection: "column",
                        }}
                      >
                        <View
                          style={{
                            minHeight: 40,
                            flexDirection: "row",
                          }}
                        >
                          <RenderGrandTotal
                            totalParams={selector.totalParameters}
                            displayType={togglePercentage}
                            params={toggleParamsMetaData}
                            moduleType={"live-leads"}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        ) : (
          // IF Self or insights
          <>
            <View style={{ marginTop: 16, marginHorizontal: 24 }}>
              <Pressable
                style={{ alignSelf: "flex-end" }}
                onPress={() => {
                  navigation.navigate(
                    AppNavigator.HomeStackIdentifiers.sourceModel,
                    {
                      empId: selector.login_employee_details.empId,
                      headerTitle: "Source/Model",
                      loggedInEmpId: selector.login_employee_details.empId,
                      type: selector.isDSE ? "SELF" : "INSIGHTS",
                      moduleType: "live-leads",
                    }
                  );
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: Colors.BLUE,
                    textDecorationLine: "underline",
                  }}
                >
                  Source/Model
                </Text>
              </Pressable>
            </View>

            <View>
              {/*<RenderSelfInsights data={selfInsightsData} type={togglePercentage} navigation={navigation} moduleType={'live-leads'}/>*/}
              {selfInsightsData &&
                selfInsightsData.length > 0 &&
                !selector.isLoading && (
                  <FlatList
                    data={selfInsightsData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) =>
                      renderSelfInsightsView(item, index)
                    }
                  />
                )}
            </View>
          </>
        )}
      </View>
      {!selector.isLoading ? null : (
        <LoaderComponent
          visible={selector.isLoading}
          onRequestClose={() => {}}
        />
      )}
    </>
  );
};

export default ParametersScreen;

export const RenderLevel1NameView = ({
  level,
  item,
  branchName = "",
  color,
  titleClick,
  disable = false,
}) => {
  return (
    <View
      style={{
        width: 70,
        justifyContent: "center",
        textAlign: "center",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          disabled={disable}
          style={{
            width: 30,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: color,
            borderRadius: 20,
            marginTop: 5,
            marginBottom: 5,
          }}
          onPress={titleClick}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#fff",
            }}
          >
            {item.empName.charAt(0)}
          </Text>
        </TouchableOpacity>
        {level === 0 && !!branchName && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="map-marker"
              style={{ padding: 0, margin: 0 }}
              color={Colors.RED}
              size={8}
            />
            <Text style={{ fontSize: 8 }} numberOfLines={2}>
              {branchName}
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          width: "35%",
          justifyContent: "center",
          textAlign: "center",
          alignItems: "flex-end",
          display: "flex",
          flexDirection: "column",
          marginRight: 5,
        }}
      >
        <Text
          style={{
            fontSize: 6,
            fontWeight: "bold",
            paddingVertical: 6,
            height: 25,
          }}
        >
          CNT
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingTop: 10,
  },
  statWrap: {
    flexDirection: "row",
    width: "48%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 30,
    backgroundColor: "#F5F5F5",
  },
  itemBox: {
    width: 68,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  shuffleBGView: {
    width: 30,
    height: 30,
    borderRadius: 60 / 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  dropdownContainer: {
    backgroundColor: "white",
    padding: 13,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    width: "95%",
    height: 45,
    borderRadius: 5,
    margin: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  grandTotalText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  totalView: { minHeight: 40, alignItems: "center", justifyContent: "center" },
  totalText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
    textAlign: "center",
  },
  percentageToggleView: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  insightParamsContainer: {
    marginHorizontal: 16,
  },
  insightParamsLabel: {},
  achievementCountView: {
    marginTop: 6,
    fontSize: 24,
  },
  paramCard: {
    padding: 8,
    margin: 16,
    borderWidth: 1,
    // height: '75%',
    width: "90%",
  },
});
