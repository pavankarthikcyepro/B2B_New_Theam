import React, { useEffect, useState } from "react";
import {
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

const SourceModel = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.homeReducer);
  const { empId, loggedInEmpId, orgId, type } = route.params;
  const [leadSource, setLeadSource] = useState([]);
  const [vehicleModel, setVehicleModel] = useState([]);
  const [leadSourceKeys, setLeadSourceKeys] = useState([]);
  const [vehicleModelKeys, setVehicleModelKeys] = useState([]);
  const [isSourceIndex, setIsSourceIndex] = useState(0);
  const [displayType, setDisplayType] = useState(0);
  const [sourceModelTotals, setSourceModelTotals] = useState({});
  const [toggleParamsIndex, setToggleParamsIndex] = useState(0);
  const [toggleParamsMetaData, setToggleParamsMetaData] = useState([]);

  useEffect(async () => {
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
      loggedInEmpId: loggedInEmpId,
      empId: empId,
      startDate: monthFirstDate,
      levelSelected: null,
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
          orgId: orgId,
          selectedEmpId: loggedInEmpId,
        };
        payload = {
          ...payload,
          ...data,
        };
        break;
    }
    dispatch(getSourceModelDataForSelf({ type, payload }));
  }, [empId]);

  useEffect(() => {
    if (leadSource) {
      getTotal(0);
    }
  }, [leadSource]);

  const paramsMetadata = [
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

  useEffect(() => {
    setToggleParamsIndex(0);
    let data = [...paramsMetadata];
    data = data.filter((x) => x.toggleIndex === 0);
    setToggleParamsMetaData([...data]);
  }, [isSourceIndex]);

  useEffect(() => {
    if (selector.sourceModelData) {
      const json = selector.sourceModelData;
      let sourceData = [];
      let modelData = [];
      const data = type === "TEAM" ? json.overallTargetAchivements : json;
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

      //   console.log("toggleParamsMetaData ==> ", toggleParamsMetaData[0]);
      //   console.log("sourceData ==> ", Object.assign([], sourceData));

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
      const modelUnique = new Set(modelData.map((x) => x.model));
      setLeadSourceKeys([...sourceUnique]);
      setVehicleModelKeys([...modelUnique]);
      const groupedSources = getData([...newSourceData], 0);
      setLeadSource(groupedSources);
      const groupedModels = getData([...newModelData], 1);
      setVehicleModel(groupedModels);
      // getTotal(0);
    }
  }, [selector.sourceModelData, toggleParamsIndex]);

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
                  {
                    color: isSourceIndex === 1 ? Colors.BLACK : Colors.WHITE,
                  },
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
                  {
                    color: isSourceIndex === 1 ? Colors.WHITE : Colors.BLACK,
                  },
                ]}
              >
                Vehicle Model
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottomWidth: 2,
            borderBottomColor: Colors.RED,
            paddingBottom: 8,
          }}
        >
          <SegmentedControl
            style={{
              marginHorizontal: 4,
              justifyContent: "center",
              alignSelf: "flex-end",
              height: 24,
              marginTop: 8,
              width: "75%",
            }}
            values={["ETVBR", "Alead", "View All"]}
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
            style={{ height: 24, marginTop: 8, width: "20%", marginLeft: 4 }}
          >
            <View style={styles.percentageToggleView}>
              <PercentageToggleControl
                toggleChange={(x) => setDisplayType(x)}
              />
            </View>
          </View>
        </View>
        <View style={{ height: "85%" }}>
          <ScrollView>
            <View style={[styles.flexRow, { paddingHorizontal: 6 }]}>
              <View>
                <View style={{ height: 20 }}></View>
                {renderTitleColumn()}
                <View
                  style={[
                    styles.flexRow,
                    {
                      justifyContent: "flex-start",
                      flex: 1,
                      alignItems: "center",
                      backgroundColor: Colors.RED,
                    },
                  ]}
                >
                  <Text
                    style={{
                      flexDirection: "row",
                      color: Colors.WHITE,
                      textAlign: "center",
                      marginLeft: 8,
                      fontWeight: "bold",
                    }}
                  >
                    Total
                  </Text>
                </View>
              </View>
              <ScrollView horizontal bounces={false}>
                <View>
                  {/* TOP Header view */}
                  <View key={"headers"} style={[styles.flexRow]}>
                    <View style={[styles.flexRow, { height: 20 }]}>
                      {toggleParamsMetaData.map((param, i) => {
                        return (
                          <View
                            key={`${param.paramName}__${i}`}
                            style={[
                              styles.flexRow,
                              styles.justifyAlignCenter,
                              {
                                width:
                                  param.paramName === "Accessories" ? 80 : 60,
                              },
                            ]}
                          >
                            <Text style={{ color: param.color }}>
                              {param.shortName}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                  <View>{renderDataView()}</View>
                  {/* Total section */}
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        height: 40,
                        backgroundColor: Colors.RED,
                      }}
                    >
                      <View
                        style={{
                          width: "92%",
                          minHeight: 25,
                          flexDirection: "column",
                          marginRight: 5,
                          paddingHorizontal: 5,
                        }}
                      >
                        <View
                          style={{
                            width: "92%",
                            minHeight: 40,
                            flexDirection: "row",
                          }}
                        >
                          {Object.keys(sourceModelTotals).map((x, index) => {
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
                          })}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </ScrollView>
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
  },
  titleColumnText: { maxWidth: 100, fontWeight: "bold", fontSize: 12 },
  justifyAlignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButtonView: {
    borderColor: Colors.RED,
    borderWidth: 1,
    borderRadius: 5,
    padding: 0.75,
    height: 41,
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
});
