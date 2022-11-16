import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../../../../../styles";
import moment from "moment/moment";
import { RenderSourceModelParameters } from "../RenderSourceModelParameters";
import PercentageToggleControl from "./PercentageToggleControl";
import URL from "../../../../../../networking/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { getSourceModelDataForSelf } from "../../../../../../redux/homeReducer";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { AppNavigator } from "../../../../../../navigations";

const SourceModel = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.homeReducer);
  const { empId, loggedInEmpId, headerTitle, orgId, type, moduleType } =
    route.params;
  const [leadSource, setLeadSource] = useState([]);
  const [vehicleModel, setVehicleModel] = useState([]);
  const [leadSourceKeys, setLeadSourceKeys] = useState([]);
  const [vehicleModelKeys, setVehicleModelKeys] = useState([]);
  const [isSourceIndex, setIsSourceIndex] = useState(0);
  const [displayType, setDisplayType] = useState(0);
  const [sourceModelTotals, setSourceModelTotals] = useState({});
  const [toggleParamsIndex, setToggleParamsIndex] = useState(0);
  const [toggleParamsMetaData, setToggleParamsMetaData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();
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
      // endDate: monthLastDate,
      endDate: moduleType === "live-leads" ? currentDate : monthLastDate,
      loggedInEmpId: empId,
      empId: empId,
      // startDate: monthFirstDate,
      startDate: moduleType === "live-leads" ? "2021-01-01" : monthFirstDate,
      levelSelected: null,
      page: 0,
      size: 100,
    };

    const urlSelf = URL.MODEL_SOURCE_SELF();
    const urlInsights = URL.MODEL_SOURCE_INSIGHTS();
    const urlTeam = URL.MODEL_SOURCE_TEAM();
    let url = "";
    switch (type) {
      case "SELF":
        url = urlSelf;
        break;
      case "INSIGHTS":
        url = urlInsights;
        break;
      case "TEAM":
        url = urlTeam;
        const data = {
          // orgId: orgId,
          // selectedEmpId: empId,
        };
        payload = {
          ...payload,
          ...data,
        };
        break;
    }
    let tempPayload = {
      orgId: orgId,
      endDate: moduleType === "live-leads" ? currentDate : monthLastDate,
      loggedInEmpId: loggedInEmpId,
      empId: empId,
      startDate: moduleType === "live-leads" ? "2021-01-01" : monthFirstDate,
      levelSelected: null,
      pageNo: 0,
      size: 100,
    };
    let key = moduleType !== "live-leads" ? "" : "LIVE-LEADS";
    dispatch(getSourceModelDataForSelf({ type, payload, key }));
  }, [empId, navigation]);

  useEffect(() => {
    setToggleParamsIndex(0);
    let data = [...paramsMetadata];
    data = data.filter((x) => x.toggleIndex === 0);
    setToggleParamsMetaData([...data]);
  }, [isSourceIndex]);

  useEffect(() => {
    if (selector.sourceModelData) {
      setIsLoading(true);
      const json = selector.sourceModelData;
      const sourceData = [];
      const modelData = [];
      const data = type === "TEAM" ? json : json;
      data &&
        data.length > 0 &&
        data.filter((x) => {
          if (x.model) {
            modelData.push(x);
          }
          if (x.source) {
            sourceData.push(x);
          }
        });
      for (let i = 0; i < paramsMetadata.length; i++) {
        for (let j = 0; j < sourceData.length; j++) {
          if (sourceData[j].paramName === paramsMetadata[i].paramName) {
            let temp = Object.assign({}, sourceData[j]);
            temp["toggleIndex"] = paramsMetadata[i].toggleIndex;
            sourceData[j] = temp;
          }
        }
      }

      for (let i = 0; i < paramsMetadata.length; i++) {
        for (let j = 0; j < modelData.length; j++) {
          if (modelData[j].paramName === paramsMetadata[i].paramName) {
            let temp = Object.assign({}, modelData[j]);
            temp["toggleIndex"] = paramsMetadata[i].toggleIndex;
            modelData[j] = temp;
          }
        }
      }

      let newSourceData = [...sourceData];
      let newModelData = [...modelData];
      if (toggleParamsIndex !== 2) {
        newSourceData = newSourceData.filter(
          (x) => x.toggleIndex === toggleParamsIndex
        );
        newModelData = newModelData.filter(
          (x) => x.toggleIndex === toggleParamsIndex
        );
      }

      const sourceUnique = new Set(newSourceData.map((x) => x.source));
      const modelUnique = new Set(newModelData.map((x) => x.model));
      setLeadSourceKeys([...sourceUnique]);
      setVehicleModelKeys([...modelUnique]);
      const groupedSources = getData([...newSourceData], 0);
      setLeadSource(groupedSources);
      const groupedModels = getData([...newModelData], 1);
      setVehicleModel(groupedModels);
      // getTotal(0);
      setIsLoading(false);
    }
  }, [selector.sourceModelData, toggleParamsIndex]);

  useEffect(() => {
    if (leadSource) {
      getTotal(isSourceIndex);
    }
  }, [leadSource]);

  const getTotal = (type) => {
    const keys = type === 0 ? leadSourceKeys : vehicleModelKeys;
    let data = type === 0 ? leadSource : vehicleModel;
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

  const paramsMetadata = [
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

  const getData = (data, type) => {
    return (
      data &&
      data.reduce((r, a) => {
        const key = a[type === 0 ? "source" : "model"];
        r[key] = r[key] || [];
        r[key].push(a);
        return r;
      }, Object.create(null))
    );
  };

  const renderDataView = () => {
    const keys = isSourceIndex === 0 ? leadSourceKeys : vehicleModelKeys;
    const data = isSourceIndex === 0 ? leadSource : vehicleModel;
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
                    />
                  )}
                </View>
              </View>
            );
          })}
      </>
    );
  };

  function renderTitleColumn() {
    const keys = isSourceIndex === 0 ? leadSourceKeys : vehicleModelKeys;
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
  }
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
  return (
    <>
      <View>
        <View
          style={[
            styles.flexRow,
            styles.justifyAlignCenter,
            { marginBottom: 8 },
          ]}
        >
          <View style={[styles.flexRow, styles.toggleButtonView]}>
            <TouchableOpacity
              onPress={() => {
                if (isSourceIndex !== 0) {
                  setIsSourceIndex(0);
                  getTotal(0);
                  setToggleParamsIndex(0);
                }
              }}
              style={[
                styles.toggleViewButtons,
                styles.justifyAlignCenter,
                {
                  backgroundColor:
                    isSourceIndex === 1 ? Colors.WHITE : Colors.RED,
                },
              ]}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  { color: isSourceIndex === 1 ? Colors.BLACK : Colors.WHITE },
                ]}
              >
                Lead Source
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (isSourceIndex === 0) {
                  setIsSourceIndex(1);
                  getTotal(1);
                  setToggleParamsIndex(0);
                }
              }}
              style={[
                styles.toggleViewButtons,
                styles.justifyAlignCenter,
                {
                  backgroundColor:
                    isSourceIndex === 1 ? Colors.RED : Colors.WHITE,
                },
              ]}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  { color: isSourceIndex === 1 ? Colors.WHITE : Colors.BLACK },
                ]}
              >
                Vehicle Model
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
            {isLoading || isEmpty(leadSource) ? (
              <ActivityIndicator color={Colors.RED} size={"large"} />
            ) : (
              <ScrollView>
                <View style={[styles.flexRow, { paddingHorizontal: 6 }]}>
                  <View>
                    <View style={{ height: 20 }}></View>
                    {renderTitleColumn()}
                    <View style={[styles.flexRow, styles.totalTextView]}>
                      <Text style={styles.totalTitleText}>Total</Text>
                    </View>
                  </View>
                  <ScrollView
                    ref={scrollViewRef}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                      scrollViewRef?.current?.scrollTo({ y: 0, animated: true });
                    }}
                    horizontal
                  >
                    <View>
                      {/* TOP Header view */}
                      <View key={"headers"} style={[styles.flexRow]}>
                        <View style={[styles.flexRow, { height: 20 }]}>
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
                                          param.paramName === "Accessories"
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
                              if (param.paramName !== "PreEnquiry") {
                                return (
                                  <View
                                    key={`${param.paramName}__${i}`}
                                    style={[
                                      styles.flexRow,
                                      styles.justifyAlignCenter,
                                      {
                                        width:
                                          param.paramName === "Accessories"
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
                                            { width: 60 },
                                          ]}
                                        >
                                          <Text style={{ color: Colors.WHITE }}>
                                            {sourceModelTotals[x]}
                                          </Text>
                                        </View>
                                      );
                                    }
                                  } else {
                                    if (x !== "PreEnquiry") {
                                      return (
                                        <View
                                          key={`${index}`}
                                          style={[
                                            styles.justifyAlignCenter,
                                            { width: 60 },
                                          ]}
                                        >
                                          <Text style={{ color: Colors.WHITE }}>
                                            {sourceModelTotals[x]}
                                          </Text>
                                        </View>
                                      );
                                    }
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

export default SourceModel;

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
    justifyContent: "flex-start",
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.RED,
  },
  totalTitleText: {
    flexDirection: "row",
    color: Colors.WHITE,
    textAlign: "center",
    marginLeft: 8,
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
