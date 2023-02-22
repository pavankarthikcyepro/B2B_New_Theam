import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../../styles";
import moment from "moment/moment";
import URL from "../../../networking/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { getEventSourceModelForSelf } from "../../../redux/homeReducer";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { AppNavigator } from "../../../navigations";
import { RenderSourceModelParameters } from "../Home/TabScreens/components/RenderSourceModelParameters";
import PercentageToggleControl from "../Home/TabScreens/components/EmployeeView/PercentageToggleControl";
import TextTicker from "react-native-text-ticker";

const EventSourceModel = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.homeReducer);
  const { empId, loggedInEmpId, headerTitle, orgId, type, moduleType } =
    route.params;
  const [leadSource, setLeadSource] = useState([]);
  const [leadSourceKeys, setLeadSourceKeys] = useState([]);
  const [isSourceIndex, setIsSourceIndex] = useState(0);
  const [displayType, setDisplayType] = useState(0);
  const [sourceModelTotals, setSourceModelTotals] = useState({});
  const [budgetTotal, setBudgetTotal] = useState(0);
  const [toggleParamsIndex, setToggleParamsIndex] = useState(0);
  const [toggleParamsMetaData, setToggleParamsMetaData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();
  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon="arrow-left"
          color={Colors.WHITE}
          size={30}
          onPress={() => {
            moduleType === "live-leads"
              ? navigation.navigate(
                  AppNavigator.DrawerStackIdentifiers.liveLeads
                )
              : navigation.pop();
          }}
        />
      ),
    });
  }, [navigation]);

  useEffect(async () => {
    navigation.setOptions({
      title: headerTitle ? headerTitle : "Source/Model",
    });
    setIsLoading(true);
    if (isSourceIndex !== 0) {
      setIsSourceIndex(0);
    }
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
      endDate: monthLastDate,
      loggedInEmpId: empId,
      startDate: monthFirstDate,
      levelSelected: null,
      empId: empId,
      pageNo: 0,
      size: 100,
    };

    let key = moduleType !== "live-leads" ? "" : "LIVE-LEADS";
    dispatch(getEventSourceModelForSelf({ type, payload, key }));
  }, [empId, navigation]);

  useEffect(() => {
    handleAnimation();
  }, [isLoading || selector.isEventLoading]);

  const handleAnimation = () => {
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ).start();
  };

  const interpolateRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  const animatedStyle = {
    transform: [
      {
        rotate: interpolateRotating,
      },
    ],
  };
  
  useEffect(() => {
    setToggleParamsIndex(0);
    let data = [...paramsMetadata];
    data = data.filter((x) => x.toggleIndex === 0);
    setToggleParamsMetaData([...data]);
  }, [isSourceIndex]);

  useEffect(() => {
    if (selector.eventSourceModelForSelf) {
      setIsLoading(true);
      const json = selector.eventSourceModelForSelf;
      let data = Object.assign([], json);

      for (let i = 0; i < paramsMetadata.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (data[j].paramName === paramsMetadata[i].paramName) {
            let tmpIndex = Object.assign({}, json[j]);
            tmpIndex.toggleIndex = paramsMetadata[i].toggleIndex;
            data[j] = Object.assign({}, tmpIndex);
          }
        }
      }

      let newData = [...data];
      if (toggleParamsIndex !== 2) {
        newData = newData.filter((x) => x.toggleIndex === toggleParamsIndex);
      }

      const sourceUnique = new Set(newData.map((x) => x.event));
      setLeadSourceKeys([...sourceUnique]);
      const groupedSources = getData([...newData]);
      setLeadSource(groupedSources);
      setIsLoading(false);
    }
  }, [selector.eventSourceModelForSelf, toggleParamsIndex]);

  useEffect(() => {
    if (leadSource) {
      getTotal();
      getBudgetTotal();
    }
  }, [leadSource]);

  const getTotal = () => {
    const keys = leadSourceKeys;
    let data = leadSource;
    let newData = paramsMetadata;
    if (toggleParamsIndex !== 2) {
      newData = newData.filter((x) => x.toggleIndex === toggleParamsIndex);
    }

    let totals = {};
    for (let i = 0; i < newData.length; i++) {
      totals[newData[i].paramName] = 0;
    }

    keys.map((x) => {
      data[x].forEach((d) => {
        totals[d.paramName] = +totals[d.paramName] + +d.achievment;
      });
    });
    setSourceModelTotals({ ...totals });
  };

  let paramsMetadata = [
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
    {
      color: "#FA03B9",
      paramName: "Test Drive",
      shortName: "TD",
      initial: "T",
      toggleIndex: 0,
    },
    {
      color: "#9E31BE",
      paramName: "Home Visit",
      shortName: "Visit",
      initial: "V",
      toggleIndex: 0,
    },
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
    {
      color: "#9E31BE",
      paramName: "Exchange",
      shortName: "Exg",
      initial: "Ex",
      toggleIndex: 1,
    },
    {
      color: "#EC3466",
      paramName: "Finance",
      shortName: "Fin",
      initial: "F",
      toggleIndex: 1,
    },
    {
      color: "#1C95A6",
      paramName: "Insurance",
      shortName: "Ins",
      initial: "I",
      toggleIndex: 1,
    },
    {
      color: "#1C95A6",
      paramName: "EXTENDEDWARRANTY",
      shortName: "ExW",
      initial: "ExW",
      toggleIndex: 1,
    },
    {
      color: "#C62159",
      paramName: "Accessories",
      shortName: "Acc",
      initial: "A",
      toggleIndex: 1,
    },
  ];

  if (moduleType !== "live-leads") {
    paramsMetadata.splice(6, 0, {
      color: "#C62159",
      paramName: "DROPPED",
      shortName: "Lost",
      initial: "DRP",
      toggleIndex: 0,
    });
  }

  paramsMetadata = [
    ...paramsMetadata,
    {
      color: "#9E31BE",
      paramName: "CONTACT PER CAR",
      shortName: "Cont/Car",
      initial: "CC",
      toggleIndex: 0,
    },
    {
      color: "#1C95A6",
      paramName: "ENQUIRY PER CAR",
      shortName: "Enq/Car",
      initial: "EC",
      toggleIndex: 0,
    },
    {
      color: "#C62159",
      paramName: "BOOKING PER CAR",
      shortName: "Bkg/Car",
      initial: "BC",
      toggleIndex: 0,
    },
  ];

  const getData = (data, type) => {
    return (
      data &&
      data.reduce((r, a) => {
        const key = a["event"];
        r[key] = r[key] || [];
        r[key].push(a);
        return r;
      }, Object.create(null))
    );
  };

  const getBudgetTotal = () => {
    const data = Object.values(leadSource);
    let total = 0;

    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        total = total + data[i][0].budget;
      }
    }
    setBudgetTotal(total);
  };

  const renderDataView = () => {
    const keys = leadSourceKeys;
    const data = leadSource;
    if (Object.keys(data).length > 0) {
      return (
        <>
          {keys &&
            keys.length > 0 &&
            keys.map((x, index) => {
              return (
                <View key={`${index}`}>
                  <View style={styles.flexRow}>
                    {data[x] && (
                      <RenderSourceModelParameters
                        item={{ targetAchievements: data[x] }}
                        displayType={displayType}
                        moduleType={moduleType}
                        sourceModelTotals={sourceModelTotals}
                        isEvent={true}
                        eventIndex={index}
                      />
                    )}
                  </View>
                </View>
              );
            })}
        </>
      );
    } else {
      return (
        <Text
          style={{
            alignSelf: "center",
            marginVertical: 10,
            color: Colors.DARK_GRAY,
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          No Events
        </Text>
      );
    }
  };

  function renderTitleColumn() {
    const keys = leadSourceKeys;
    const data = leadSource;
    if (Object.keys(data).length > 0) {
      return (
        <>
          {keys &&
            keys.length > 0 &&
            keys.map((x, index) => {
              return (
                <View key={`${index}`} style={styles.titleColumnView}>
                  <Text style={styles.titleColumnText} numberOfLines={2}>
                    {x}
                  </Text>
                </View>
              );
            })}
        </>
      );
    } else {
      return (
        <View
          key={`0`}
          style={[
            styles.titleColumnView,
            { backgroundColor: Colors.WHITE, height: 27 },
          ]}
        >
          <Text style={styles.titleColumnText} numberOfLines={2}>
            {""}
          </Text>
        </View>
      );
    }
  }

  const columnTitleBlock = (title, color, width = 80) => {
    return (
      <View
        style={[
          styles.flexRow,
          styles.justifyAlignCenter,
          {
            width: width,
          },
        ]}
      >
        <Text style={{ color: color }}>{title}</Text>
      </View>
    );
  };
  
  const FormattedTextTick = ({ children }) => {
    return (
      <TextTicker
        duration={10000}
        loop={true}
        bounce={false}
        repeatSpacer={50}
        marqueeDelay={0}
        style={{
          marginBottom: 0,
        }}
      >
        {children}
      </TextTicker>
    );
  };

  return (
    <>
      <View>
        <View style={styles.sourceModelContainer}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              borderBottomWidth: 2,
              borderBottomColor: Colors.RED,
              paddingBottom: 8,
            }}
          >
            {moduleType !== "live-leads" && (
              <>
                <SegmentedControl
                  style={{
                    marginHorizontal: 4,
                    justifyContent: "center",
                    alignSelf: "flex-end",
                    height: 24,
                    marginTop: 8,
                    width: "75%",
                  }}
                  values={["ETVBRL", "Allied", "View All"]}
                  selectedIndex={toggleParamsIndex}
                  tintColor={Colors.RED}
                  fontStyle={{ color: Colors.BLACK, fontSize: 10 }}
                  activeFontStyle={{ color: Colors.WHITE, fontSize: 10 }}
                  onChange={(event) => {
                    const index = event.nativeEvent.selectedSegmentIndex;
                    let data = [...paramsMetadata];
                    if (index !== 2) {
                      data = data.filter((x) => x.toggleIndex === index);
                    } else {
                      data = [...paramsMetadata];
                    }
                    setToggleParamsMetaData([...data]);
                    setToggleParamsIndex(index);
                  }}
                />
                <View
                  style={{
                    height: 24,
                    marginTop: 5,
                    width: "20%",
                    marginLeft: 4,
                  }}
                >
                  <View style={styles.percentageToggleView}>
                    <PercentageToggleControl
                      toggleChange={(x) => setDisplayType(x)}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
          <View style={{ height: "85%" }}>
            {isLoading || selector.isEventLoading ? (
              <View
                style={{
                  marginVertical: 15,
                  justifyContent: "center",
                  alignSelf: "center",
                  borderRadius: 8,
                }}
              >
                <Animated.Image
                  style={[{ width: 40, height: 40 }, animatedStyle]}
                  resizeMode={"contain"}
                  source={require("../../../assets/images/cy.png")}
                />
              </View>
            ) : (
              <ScrollView>
                <View style={[styles.flexRow, { paddingHorizontal: 6 }]}>
                  <View>
                    <View
                      style={{
                        height: 20,
                        justifyContent: "center",
                        marginLeft: 10,
                      }}
                    >
                      <Text>Events</Text>
                    </View>
                    {renderTitleColumn()}
                    <View style={[styles.flexRow, styles.totalTextView]}>
                      {/* <Text style={styles.totalTitleText}>Total</Text> */}
                    </View>
                  </View>
                  <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                      scrollViewRef?.current?.scrollTo({
                        y: 0,
                        animated: true,
                      });
                    }}
                    horizontal
                  >
                    <View>
                      {/* TOP Header view */}
                      <View key={"headers"} style={[styles.flexRow]}>
                        <View style={[styles.flexRow, { height: 20 }]}>
                          {columnTitleBlock("Date", Colors.GREEN, 100)}
                          {columnTitleBlock("Budget", Colors.CORAL)}
                          {toggleParamsMetaData.map((param, i) => {
                            if (moduleType === "live-leads") {
                              if (
                                param.paramName === "INVOICE" ||
                                param.paramName === "Enquiry" ||
                                param.paramName === "Booking" ||
                                param.paramName === "PreEnquiry"
                              ) {
                                return (
                                  <View
                                    key={`${param.paramName}__${i}`}
                                    style={[
                                      styles.flexRow,
                                      styles.justifyAlignCenter,
                                      {
                                        width:
                                          param.paramName === "Accessories" ||
                                          param.paramName.includes("PER CAR")
                                            ? 80
                                            : 60,
                                      },
                                    ]}
                                  >
                                    <Text style={{ color: param.color }}>
                                      {param.shortName}
                                    </Text>
                                  </View>
                                );
                              }
                            } else {
                              return (
                                <View
                                  key={`${param.paramName}__${i}`}
                                  style={[
                                    styles.flexRow,
                                    styles.justifyAlignCenter,
                                    {
                                      width:
                                        param.paramName === "Accessories" ||
                                        param.paramName.includes("PER CAR")
                                          ? 80
                                          : 60,
                                    },
                                  ]}
                                >
                                  <Text style={{ color: param.color }}>
                                    {param.shortName}
                                  </Text>
                                </View>
                              );
                            }
                          })}
                        </View>
                      </View>
                      <View>{renderDataView()}</View>
                      {/* Total section */}
                      <View>
                        <View style={styles.paramsTotalContainerView}>
                          <View style={styles.paramsTotalContainerSubView}>
                            <View style={styles.paramsTotalContainer}>
                              <View
                                style={{ width: 95, justifyContent: "center" }}
                              >
                                <Text style={styles.totalTitleText}>Total</Text>
                              </View>
                              <View
                                key={`budget__i`}
                                style={[
                                  styles.justifyAlignCenter,
                                  { width: 80 },
                                ]}
                              >
                                <FormattedTextTick>
                                  <Text style={{ color: Colors.WHITE }}>
                                    {budgetTotal}
                                  </Text>
                                </FormattedTextTick>
                              </View>
                              {Object.keys(sourceModelTotals).map(
                                (x, index) => {
                                  if (moduleType === "live-leads") {
                                    if (
                                      x === "INVOICE" ||
                                      x === "Enquiry" ||
                                      x === "Booking" ||
                                      x === "PreEnquiry"
                                    ) {
                                      return (
                                        <View
                                          key={`${index}`}
                                          style={[
                                            styles.justifyAlignCenter,
                                            {
                                              width:
                                                x === "Accessories" ||
                                                x.includes("PER CAR")
                                                  ? 80
                                                  : 60,
                                            },
                                          ]}
                                        >
                                          <Text style={{ color: Colors.WHITE }}>
                                            {sourceModelTotals[x]}
                                          </Text>
                                        </View>
                                      );
                                    }
                                  } else {
                                    return (
                                      <View
                                        key={`${index}`}
                                        style={[
                                          styles.justifyAlignCenter,
                                          {
                                            width:
                                              x === "Accessories" ||
                                              x.includes("PER CAR")
                                                ? 80
                                                : 60,
                                          },
                                        ]}
                                      >
                                        <Text style={{ color: Colors.WHITE }}>
                                          {sourceModelTotals[x]}
                                        </Text>
                                      </View>
                                    );
                                  }
                                }
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default EventSourceModel;

const styles = StyleSheet.create({
  flexRow: { flexDirection: "row", display: "flex" },
  titleColumnView: {
    height: 25,
    marginVertical: 6,
    justifyContent: "center",
    backgroundColor: "rgba(223,228,231,0.67)",
    paddingLeft: 8,
  },
  titleColumnText: {
    maxWidth: 100,
    color: Colors.BLACK,
    fontWeight: "500",
    fontSize: 10,
  },
  justifyAlignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButtonView: {
    borderColor: Colors.RED,
    borderWidth: 1,
    borderRadius: 5,
    padding: 0.75,
    height: 35,
    marginTop: 10,
    justifyContent: "center",
    width: "70%",
  },
  toggleViewButtons: {
    width: "50%",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  percentageToggleView: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  sourceModelContainer: { backgroundColor: Colors.WHITE, marginHorizontal: 12 },
  totalTextView: {
    justifyContent: "flex-end",
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.RED,
  },
  totalTitleText: {
    color: Colors.WHITE,
    fontWeight: "bold",
  },
  paramsTotalContainerView: {
    flexDirection: "row",
    height: 40,
    backgroundColor: Colors.RED,
  },
  paramsTotalContainerSubView: {
    width: "92%",
    minHeight: 25,
    flexDirection: "column",
    marginRight: 5,
    paddingHorizontal: 5,
  },
  paramsTotalContainer: { width: "92%", minHeight: 40, flexDirection: "row" },
});
