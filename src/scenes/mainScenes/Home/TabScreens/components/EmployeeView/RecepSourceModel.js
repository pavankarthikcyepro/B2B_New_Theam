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
import {
  getReceptionistManagerModel,
  getReceptionistManagerSource,
  getReceptionistModel,
  getReceptionistModelLive,
  getReceptionistSource,
  getReceptionistSourceLive,
  getSourceModelDataForSelf,
} from "../../../../../../redux/homeReducer";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { IconButton } from "react-native-paper";
import { AppNavigator } from "../../../../../../navigations";
import { achievementPercentage } from "../../../../../../utils/helperFunctions";
import AnimLoaderComp from "../../../../../../components/AnimLoaderComp";
import { useIsFocused } from "@react-navigation/native";

const RecepSourceModel = ({ route, navigation }) => {
  const paramsMetadata = [
    {
      color: "#FA03B9",
      paramName: "Enquiry",
      shortName: "Enq",
      initial: "E",
      toggleIndex: 0,
    },
    // {
    //   color: "#FA03B9",
    //   paramName: "Test Drive",
    //   shortName: "TD",
    //   initial: "T",
    //   toggleIndex: 0,
    // },
    // {
    //   color: "#9E31BE",
    //   paramName: "Home Visit",
    //   shortName: "Visit",
    //   initial: "V",
    //   toggleIndex: 0,
    // },
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
      paramName: "Lost",
      shortName: "Lost",
      initial: "L",
      toggleIndex: 0,
    },
  ];
  const idFocused= useIsFocused();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.homeReducer);
  const liveLeads_selector = useSelector((state) => state.liveLeadsReducer);
  const {
    empId,
    loggedInEmpId,
    headerTitle,
    orgId,
    type,
    moduleType,
    role,
    branchList, empList, self
  } = route.params;
  const [leadSource, setLeadSource] = useState([]);
  const [vehicleModel, setVehicleModel] = useState([]);
  const [leadSourceKeys, setLeadSourceKeys] = useState([]);
  const [vehicleModelKeys, setVehicleModelKeys] = useState([]);
  const [isSourceIndex, setIsSourceIndex] = useState(0);
  const [displayType, setDisplayType] = useState(0);
  const [sourceModelTotals, setSourceModelTotals] = useState({});
  const [toggleParamsIndex, setToggleParamsIndex] = useState(0);
  const [toggleParamsMetaData, setToggleParamsMetaData] =
    useState(paramsMetadata);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef();

  useEffect(async () => {
    navigation.addListener("focus", () => {
      setIsSourceIndex(0);
      getTotal(0);
      setToggleParamsIndex(0);
      navigation.setOptions({
        headerLeft: () => (
          <IconButton
            icon="arrow-left"
            color={Colors.WHITE}
            size={30}
            onPress={() => {
              // if (role == "Reception") {
              //   navigation.pop();
              // } else if (role == "CRM") {
              //   navigation.pop();
              // } else 
              if (moduleType === "live-leads") {
                navigation.navigate(
                  AppNavigator.DrawerStackIdentifiers.liveLeads)
              } else if (moduleType === "DigitalDashboard"){
                navigation.navigate(
                  AppNavigator.DrawerStackIdentifiers.digitalDashboard)
              }
              else {
                navigation.goBack();
              }
            }}
          />
        ),
      });

      navigation.setOptions({
        title: headerTitle ? headerTitle : "Source/Model",
      });
      if (isSourceIndex !== 0) {
        setIsSourceIndex(0);
      }
      setIsLoading(true);
     
      if (moduleType === "live-leads") {
        // let payloadReceptionist = { "orgId": orgId, "loggedInEmpId": loggedInEmpId, "branchList": selector.saveLiveleadObject?.levelSelected }
        // dispatch(getReceptionistSourceLive(payloadReceptionist));
        // dispatch(getReceptionistModelLive(payloadReceptionist));
      } else {
        let newPayload = {
          orgId: orgId,
          loggedInEmpId: loggedInEmpId,
          "startDate": selector.receptionistFilterIds.startDate,
          "endDate": selector.receptionistFilterIds.endDate,
          "dealerCodes": selector.receptionistFilterIds.dealerCodes,
          "empList":empList? empList : null
        };
        let payload = {
          orgId: orgId,
          branchList: branchList,
        };
       
        if (role == "Reception" || role == "Tele Caller" || role == "CRE" || role == "Field DSE" || role == "CRM_INd") {
          dispatch(getReceptionistSource(newPayload));
          dispatch(getReceptionistModel(newPayload));
        } else if (role == "CRM" && !selector.saveCRMfilterObj?.selectedempId) {
          let newPayload3 = {
            orgId: orgId,
            loggedInEmpId: loggedInEmpId,
            "startDate": selector.receptionistFilterIds.startDate,
            "endDate": selector.receptionistFilterIds.endDate,
            "dealerCodes": selector.receptionistFilterIds.dealerCodes,
            "empList": empList ? empList : null,
            "self": self
          };
          dispatch(getReceptionistManagerSource(newPayload3));
          dispatch(getReceptionistManagerModel(newPayload3));
        } else if (selector.saveCRMfilterObj?.selectedempId) {
          let newPayload2 = {
            orgId: orgId,
            loggedInEmpId: selector.saveCRMfilterObj?.selectedempId[0],
            "startDate": selector.saveCRMfilterObj.startDate,
            "endDate": selector.saveCRMfilterObj.endDate,
            "dealerCodes": selector.saveCRMfilterObj.dealerCodes
          };
          dispatch(getReceptionistSource(newPayload2));
          dispatch(getReceptionistModel(newPayload2));
        }
        else {
          dispatch(getReceptionistManagerSource(payload));
          dispatch(getReceptionistManagerModel(payload));
        }
      }
    })
    
    
  }, [empId, navigation]);

  useEffect(() => {
    getTotal(0);
  }, [selector.receptionistSource]);

  useEffect(() => {
    setToggleParamsIndex(0);
    let data = [...paramsMetadata];
    // data = data.filter((x) => x.toggleIndex === 0);
    setToggleParamsMetaData([...data]);
  }, [isSourceIndex]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      if (moduleType === "live-leads") {
      
        if (liveLeads_selector.saveLiveleadObject?.levelSelected !== "") {
          let payloadReceptionist = { "orgId": orgId, "loggedInEmpId": loggedInEmpId, "branchList": liveLeads_selector.saveLiveleadObject?.levelSelected }
          dispatch(getReceptionistSourceLive(payloadReceptionist));
          dispatch(getReceptionistModelLive(payloadReceptionist));
        } else {
          let payloadReceptionist = { "orgId": orgId, "loggedInEmpId": loggedInEmpId }
          dispatch(getReceptionistSourceLive(payloadReceptionist));
          dispatch(getReceptionistModelLive(payloadReceptionist));
        }

      }
    })
    
  
    
  }, [liveLeads_selector.saveLiveleadObject])
  

  useEffect(() => {
    if (selector.sourceModelData) {
      // setIsLoading(true);
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
      // setIsLoading(false);
    }
  }, [selector.sourceModelData, toggleParamsIndex]);

  useEffect(() => {
    if (leadSource) {
      getTotal(isSourceIndex);
    }
  }, [leadSource]);

  const getTotal = (type) => {
    const keys = type === 0 ? leadSourceKeys : vehicleModelKeys;
    let data =
      type === 0 ? selector.receptionistSource : selector.receptionistModel;
    const result = data.reduce((accum, current) => {
      Object.entries(current).forEach(([key, value]) => {
        accum[key] = accum[key] + value || value;
      });
      return {
        ...accum,
      };
    }, {});

    setSourceModelTotals({ ...result });
    setIsLoading(false);
  };

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

  function getPercentage(target, total) {
    return target > 0 ? Math.round((target / total) * 100) : 0;
  }

  const renderDataView = () => {
    const keys = isSourceIndex === 0 ? leadSourceKeys : vehicleModelKeys;
    const data = isSourceIndex === 0 ? leadSource : vehicleModel;
    const newData =
      isSourceIndex === 0
        ? selector.receptionistSource
        : selector.receptionistModel;
    return (
      <>
        {
          // keys &&
          //   keys.length > 0 &&
          newData.map((x, index) => {
            return (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    // backgroundColor: "#D7EAF9",
                    // backgroundColor: "#FAAFBA",
                    backgroundColor: "rgba(223,228,231,0.67)",
                    // paddingVertical: 6,
                    height: 35,
                    alignItems: "center",
                    marginVertical: 5,
                  }}
                >
                  {toggleParamsMetaData.map((param, i) => {
                    return (
                      <View
                        style={{
                          width: 50,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: Colors.RED }}>
                          {displayType == 0
                            ? x[param?.initial?.toLowerCase()]
                            : `${getPercentage(
                                x[param?.initial?.toLowerCase()],
                                sourceModelTotals[param?.initial?.toLowerCase()]
                              )}%`}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </>
            );
          })
        }
      </>
    );
  };

  const renderTitleView = () => {
    const keys = isSourceIndex === 0 ? leadSourceKeys : vehicleModelKeys;
    const data = isSourceIndex === 0 ? leadSource : vehicleModel;
    const newData =
      isSourceIndex === 0
        ? selector.receptionistSource
        : selector.receptionistModel;
    return (
      <>
        {
          // keys &&
          //   keys.length > 0 &&
          newData.map((x, index) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  // backgroundColor: "#D7EAF9",
                  // backgroundColor: "#FAAFBA",
                  backgroundColor: "rgba(223,228,231,0.67)",
                  // paddingVertical: 6,
                  height: 35,
                  alignItems: "center",
                  marginVertical: 5,
                }}
              >
                <View style={{ width: 175 }}>
                  <Text
                    style={{
                      color: Colors.BLACK,
                      fontSize: 13,
                      fontWeight: "500",
                    }}
                  >
                    {x?.source && x?.subsource
                      ? x?.source + " - " + x?.subsource
                      : x?.model}
                  </Text>
                </View>
              </View>
            );
          })
        }
      </>
    );
  };

  return (
    <>
      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
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
                  Source Wise
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
                  Model Wise
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.percentageToggleView}>
          <PercentageToggleControl toggleChange={(x) => setDisplayType(x)} />
        </View>
        <View style={{ marginLeft: 10, flexDirection: "row" }}>
          <View style={{ flexDirection: "column", width: 175 }}>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                borderColor: "#CECECE",
                borderWidth: 2,
                paddingVertical: 1,
                marginVertical: 10,
                borderRightWidth: 0,
              }}
            >
              <View
                style={{ width: 175, height: 35, justifyContent: "center" }}
              >
                <Text style={styles.tableTitleText}>
                  {isSourceIndex == 0 ? "Sources" : "Models"}
                </Text>
              </View>
            </View>
            {renderTitleView()}
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                marginBottom: 40,
                backgroundColor: Colors.RED,
                // paddingVertical: 10,
                height: 40,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: Colors.WHITE,
                  fontSize: 13,
                  fontWeight: "500",
                  width: 112,
                }}
              >
                {" Total"}
              </Text>
            </View>
          </View>
          <ScrollView nestedScrollEnabled horizontal>
            <View style={{ flexDirection: "column" }}>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  borderColor: "#CECECE",
                  borderWidth: 2,
                  paddingVertical: 1,
                  marginVertical: 10,
                  borderLeftWidth: 0,
                }}
              >
                {toggleParamsMetaData.map((item) => {
                  if (item.paramName !== "PreEnquiry") {
                    return (
                      <View
                        style={{
                          width: 50,
                          alignItems: "center",
                          justifyContent: "center",
                          paddingVertical: 5,
                          height: 35,
                        }}
                      >
                        <Text
                          style={{
                            color: item.color,
                            fontSize: 14,
                            fontWeight: "500",
                          }}
                        >
                          {item.shortName}
                        </Text>
                      </View>
                    );
                  }
                })}
              </View>
              {isLoading && <AnimLoaderComp visible={true} />}
              {renderDataView()}
              <>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 15,
                    marginBottom: 40,
                    backgroundColor: Colors.RED,
                    // paddingVertical: 10,
                    height: 40,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <View />
                    {toggleParamsMetaData.map((param, i) => {
                      return (
                        <View
                          style={{
                            width: 50,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: Colors.WHITE,
                              fontSize: 13,
                              fontWeight: "600",
                              // textDecorationLine: "underline",
                            }}
                          >
                            {sourceModelTotals[param?.initial?.toLowerCase()]}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
};

export default RecepSourceModel;

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
  tableTitleText: {
    fontWeight: "bold",
    marginLeft: 5
  }
});
