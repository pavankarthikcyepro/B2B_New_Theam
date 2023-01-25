import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    Pressable,
    Keyboard,
    ActivityIndicator,
    KeyboardAvoidingView,
    Alert,
    BackHandler,
    Image,
    TouchableOpacity,
    Modal
} from "react-native";
import {
    DefaultTheme,
    Checkbox,
    IconButton,
    List,
    Button,
    ToggleButton, Switch
} from "react-native-paper";
import {
    showAlertMessage,
    showToast,
    showToastRedAlert,
    showToastSucess,
} from "../../../../utils/toast";
import { Colors, GlobalStyle } from "../../../../styles";
import * as AsyncStore from "../../../../asyncStore";

import VectorImage from "react-native-vector-image";
import { useDispatch, useSelector } from "react-redux";
import {
    TextinputComp,
    DropDownComponant,
    DatePickerComponent,
} from "../../../../components";
import {
    convertDateStringToMilliseconds,
    convertDateStringToMillisecondsUsingMoment,
    emiCalculator,
    GetCarModelList,
    GetDropList,
    GetFinanceBanksList,
    PincodeDetails,
    PincodeDetailsNew
} from "../../../../utils/helperFunctions";
import {
    RadioTextItem,
    DropDownSelectionItem,
    ImageSelectItem,
    DateSelectItem,
} from "../../../../pureComponents";
import {
    setDropDownData,
    updateFuelAndTransmissionType,
    updatedmsLeadProduct
} from "../../../../redux/preBookingFormReducer";
import { useNavigation } from '@react-navigation/native';
export const PreBookingModelListitemCom = ({
  from,
  modelOnclick,
  isPrimaryOnclick,
  item,
  index,
  leadStage,
  isSubmitPress,
  isOnlyOne,
  onChangeSubmit,
  carModelsList = [],
  disabled = false,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const selector = useSelector((state) => state.preBookingFormReducer);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [isVariantUpdated, setisVariantUpdated] = useState(false);

  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carVariant, setCarVariant] = useState("");
  const [carFuelType, setCarFuelType] = useState("");
  const [carTransmissionType, setCarTransmissionType] = useState("");
  const [carColor, setCarColor] = useState("");
  const [isPrimary, setisPrimary] = useState("N");

  const [carColorsData, setCarColorsData] = useState([]);
  const [userData, setUserData] = useState({
    orgId: "",
    employeeId: "",
    employeeName: "",
    isSelfManager: "",
    isTracker: "",
  });
  const [selectedCarVarientsData, setSelectedCarVarientsData] = useState({
    varientList: [],
    varientListForDropDown: [],
  });
  const [carModelsData, setCarModelsData] = useState([]);

  const [isEdit, setIsEdit] = useState(false);

  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();
    onChangeSubmit();
    switch (key) {
      case "MODEL":
        setDataForDropDown([...carModelsData]);
        break;
      case "VARIENT":
        setDataForDropDown([...selectedCarVarientsData.varientListForDropDown]);
        break;
      case "COLOR":
        setDataForDropDown([...carColorsData]);
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };
  useEffect(() => {
    // navigation.addListener('focus', () => {
    //     getAsyncstoreData();
    // })
    getAsyncstoreData();
    //   getBranchId();
    // setComponentAppear(true);
    //  getCustomerType();

    //  BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    // return () => {
    //   BackHandler.removeEventListener(
    //     "hardwareBackPress",
    //     handleBackButtonClick
    //   );
    // };
  }, [navigation]);
  const getAsyncstoreData = async () => {
    try {
      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      setCarColor(item?.color);
      setCarModel(item?.model);
      if (item?.model) {
        updateVariantModelsData(item?.model, false);
      }

      if (item?.variant) {
        updateColorsDataForSelectedVarient(
          item?.variant,
          selectedCarVarientsData.varientList
        );
      }
      setCarFuelType(item?.fuel);
      // if (leadStage === 'PREBOOKING')
      setisPrimary(item?.isPrimary);
      setCarTransmissionType(item?.transimmisionType);
      setCarVariant(item?.variant);
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        setUserData({
          orgId: jsonObj.orgId,
          employeeId: jsonObj.employeeId,
          employeeName: jsonObj.empName,
          isSelfManager: jsonObj.isSelfManager,
          isTracker: jsonObj.isTracker,
        });
        getCarModelListFromServer(jsonObj.orgId);
        updateVariantModelsData(item.model, false);
        // Get Token
        // AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
        //     if (token.length > 0) {
        //         getInsurenceCompanyNamesFromServer(token, jsonObj.orgId);
        //         getBanksListFromServer(jsonObj.orgId, token);
        //         GetEnquiryDropReasons(jsonObj.orgId, token);
        //     }
        // });
      }
    } catch (error) {
      // alert(error)
    }
  };
  const updateVariantModelsData = async (
    selectedModelName,
    fromInitialize,
    selectedVarientName
  ) => {
    if (!selectedModelName || selectedModelName.length === 0) {
      return;
    }
    if (item.model == selectedModelName) {
      return;
    }

    let arrTemp = carModelsData.filter(function (obj) {
      return obj.model === selectedModelName;
    });

    //  alert(JSON.stringify(carModelsData))

    let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
    if (carModelObj !== undefined) {
      let newArray = [];
      setCarModel(selectedModelName);
      setCarColor("");
      setCarVariant("");
      setCarFuelType("");

      setCarTransmissionType("");
      try {
        var carmodeldata;
        carmodeldata = {
          color: "",
          fuel: "",
          id: item.id,
          model: selectedModelName,
          transimmisionType: "",
          variant: "",
          isPrimary: item.isPrimary,
        };
        // var modelsarr = await selector.dmsLeadProducts;
          carModelsList.length > 0 ? carModelsList : selector.dmsLeadProducts;
        modelsarr[index] = await carmodeldata;
        modelOnclick(index, carmodeldata, "update");

        await dispatch(updatedmsLeadProduct(modelsarr));
      } catch (error) {}
      let mArray = carModelObj.varients;
      if (mArray.length) {
        mArray.forEach((item) => {
          newArray.push({
            id: item.id,
            name: item.name,
          });
        });
        setSelectedCarVarientsData({
          varientList: [...mArray],
          varientListForDropDown: [...newArray],
        });
        if (fromInitialize) {
          updateColorsDataForSelectedVarient(selectedVarientName, [...mArray]);
        }
      }
    }
  };

  const setInitialValients = async (selectedModelName) => {
    if (!selectedModelName || selectedModelName.length === 0) {
      return;
    }
    let arrTemp = carModelsData.filter(function (obj) {
      return obj.model === selectedModelName;
    });

    let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
    if (carModelObj !== undefined) {
      let newArray = [];
      // setCarModel(selectedModelName)

      // selector.dmsLeadProducts[index] = carmodeldata
      let mArray = carModelObj.varients;
      if (mArray.length) {
        mArray.forEach((item) => {
          newArray.push({
            id: item.id,
            name: item.name,
          });
        });
        setSelectedCarVarientsData({
          varientList: [...mArray],
          varientListForDropDown: [...newArray],
        });
        // updateColorsDataForSelectedVarient(selectedVarientName, [...mArray]);
      }
    }
  };

  const updateColorsDataForSelectedVarient = async (
    selectedVarientName,
    varientList
  ) => {
    if (!selectedVarientName || selectedVarientName.length === 0) {
      return;
    }

    let arrTemp = varientList.filter(function (obj) {
      return obj.name === selectedVarientName;
    });

    let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
    if (carModelObj !== undefined) {
      let newArray = [];
      let mArray = carModelObj.vehicleImages;
      if (mArray.length) {
        mArray.map((item) => {
          newArray.push({
            id: item.id,
            name: item.color,
          });
        });
        const obj = {
          fuelType: carModelObj.fuelType,
          transmissionType: carModelObj.transmission_type,
        };
        // setCarModel(selectedModelName)
        setCarColor("");
        const selectedVarList = await addVariantsName(selector.dmsLeadProducts);
        // selectedVarList =  await selectedVariants
        if (
          selectedVarList &&
          selectedVarList.length >= 0 &&
          !selectedVarList.includes(selectedVarientName)
        ) {
          await setisVariantUpdated(true);
          setCarVariant(selectedVarientName);
          setCarFuelType(carModelObj.fuelType);
          setCarTransmissionType(carModelObj.transmission_type);
          var carmodeldata;
          if (leadStage === "PREBOOKING") {
            carmodeldata = {
              color: "",
              fuel: carModelObj.fuelType,
              id: item.id,
              model: carModel,
              transimmisionType: carModelObj.transmission_type,
              variant: selectedVarientName,
              isPrimary: item.isPrimary,
            };
          } else {
            carmodeldata = {
              color: "",
              fuel: carModelObj.fuelType,
              id: item.id,
              model: carModel,
              transimmisionType: carModelObj.transmission_type,
              variant: selectedVarientName,
            };
          }

          // const modelsarr = [...selector.dmsLeadProducts];
          const modelsarr =
            carModelsList.length > 0 ? carModelsList : selector.dmsLeadProducts;
          modelsarr[index] = carmodeldata;
          modelOnclick(index, carmodeldata, "update");

          dispatch(updatedmsLeadProduct(modelsarr));
          dispatch(updateFuelAndTransmissionType(obj));
          setCarColorsData([...newArray]);
          //    setInitialColors(
          //        selectedVarientName,
          //        varientList
          //    );
        } else showToast("Please select a different variant");
        // if (selectedVarList && selectedVarList.length >= 0 && !selectedVarList.includes(selectedVarientName))
        // showToast("please procced")
        // else showToast("else")
      }
    }
  };
  const addVariantsName = async (dmsLeadProducts) => {
    try {
      var variants = [];
      for (let i = 0; i < dmsLeadProducts.length; i++) {
        var variantName = "";
        if (
          dmsLeadProducts[i].variant &&
          dmsLeadProducts[i].variant != null &&
          dmsLeadProducts[i].variant != ""
        ) {
          variantName = await dmsLeadProducts[i].variant;
          await variants.push(variantName);
        }
      }
      return variants;
    } catch (error) {}
  };

  const setInitialColors = (selectedVarientName, varientList) => {
    if (!selectedVarientName || selectedVarientName.length === 0) {
      return;
    }

    let arrTemp = varientList.filter(function (obj) {
      return obj.name === selectedVarientName;
    });

    let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
    if (carModelObj !== undefined) {
      let newArray = [];
      let mArray = carModelObj.vehicleImages;
      if (mArray.length) {
        mArray.map((item) => {
          newArray.push({
            id: item.id,
            name: item.color,
          });
        });
        const obj = {
          fuelType: carModelObj.fuelType,
          transmissionType: carModelObj.transmission_type,
        };
        setCarFuelType(carModelObj.fuelType);
        setCarTransmissionType(carModelObj.transmission_type);
        var carmodeldata;

        // const modelsarr = selector.dmsLeadProducts;
        let modelsarr =
          carModelsList.length > 0 ? carModelsList : selector.dmsLeadProducts;
        modelsarr[index] = carmodeldata;
        modelOnclick(index, carmodeldata, "update");

        dispatch(updatedmsLeadProduct(modelsarr));
        dispatch(updateFuelAndTransmissionType(obj));
        setCarColorsData([...newArray]);
      }
    }
  };

  useEffect(() => {
    if (carModelsData.length > 0) {
      if (item?.model) {
        setInitialValients(item?.model);
      }
    }
  }, [carModelsData]);

  useEffect(() => {
    if (selectedCarVarientsData.varientList.length > 0) {
      try {
        if (item?.variant) {
          setInitialColors(item?.variant, selectedCarVarientsData.varientList);
        }
        // }
      } catch (error) {}
    }
  }, [selectedCarVarientsData]);

  const getCarModelListFromServer = (orgId) => {
    // Call Api
    GetCarModelList(orgId)
      .then(
        (resolve) => {
          let modalList = [];
          if (resolve.length > 0) {
            resolve.forEach((item) => {
              modalList.push({
                id: item.vehicleId,
                name: item.model,
                isChecked: false,
                ...item,
              });
            });
          }
          setCarModelsData([...modalList]);
        },
        (rejected) => {
          // alert("reject")
        }
      )
      .finally(() => {
        //  alert("final")
        // Get Enquiry Details
        // getEnquiryDetailsFromServer();
      });
  };
  const updateColor = (dataobj) => {
    setCarColor(dataobj.name);
    var carmodeldata;
    if (leadStage === "PREBOOKING") {
      carmodeldata = {
        color: dataobj.name,
        fuel: carFuelType,
        id: item.id,
        model: carModel,
        transimmisionType: carTransmissionType,
        variant: carVariant,
        isPrimary: item.isPrimary,
      };
    } else {
      carmodeldata = {
        color: dataobj.name,
        fuel: carFuelType,
        id: item.id,
        model: carModel,
        transimmisionType: carTransmissionType,
        variant: carVariant,
        isPrimary: item.isPrimary,
      };
    }

    const modelsarr = selector.dmsLeadProducts;
    modelsarr[index] = carmodeldata;
    modelOnclick(index, carmodeldata, "update");
    dispatch(updatedmsLeadProduct(modelsarr));
  };
  return (
    <View disabled={disabled}>
      <DropDownComponant
        disabled={disabled}
        visible={showDropDownModel}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          if (dropDownKey === "MODEL") {
            updateVariantModelsData(item.name, false);
          } else if (dropDownKey === "VARIENT") {
            updateColorsDataForSelectedVarient(
              item.name,
              selectedCarVarientsData.varientList
            );
          } else if (dropDownKey === "COLOR") {
            updateColor(item);
          } else if (
            dropDownKey === "C_MAKE" ||
            dropDownKey === "R_MAKE" ||
            dropDownKey === "A_MAKE"
          ) {
            updateModelTypesForCustomerNeedAnalysis(item.name, dropDownKey);
          }
          setShowDropDownModel(false);
          dispatch(
            setDropDownData({ key: dropDownKey, value: item.name, id: item.id })
          );
        }}
      />
      <View
        style={{
          padding: 5,
          marginVertical: 10,
          borderRadius: 5,
          backgroundColor: Colors.LIGHT_GRAY2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ height: 50, width: "46%", justifyContent: "center" }}>
            <Text
              style={{
                color: Colors.WHITE,
                fontSize: 18,
                marginLeft: 10,
                textAlignVertical: "center",
              }}
              numberOfLines={2}
            >
              {carModel}
            </Text>
          </View>

          {/* {leadStage === 'PREBOOKING' ?
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: Colors.WHITE, fontSize: 16, marginRight: 10 }}>Is Primary</Text>
                            <Switch
                                icon=" toggle-switch-off-outline"
                                value={isPrimary}
                                onValueChange={() => {
                                    
                                    isPrimaryOnclick(!isPrimary, index, item);
                                    setisPrimary(!isPrimary)}}
                                color={Colors.PINK}
                                size={35} />
                        </View> : null
                    } 
                     */}
          <View
            style={{ flexDirection: "row", alignItems: "center" }}
            disabled={disabled}
          >
            <Text
              style={{ color: Colors.WHITE, fontSize: 16, marginRight: 10 }}
            >
              Is Primary
            </Text>
            <Switch
              icon=" toggle-switch-off-outline"
              value={isPrimary === "Y" ? true : false}
              disabled={disabled}
              onValueChange={() => {
                if (isPrimary === "N") {
                  isPrimaryOnclick("Y", index, item);
                  setisPrimary("Y");
                }
              }}
              color={Colors.PINK}
              size={35}
            />
          </View>
          <TouchableOpacity
            disabled={isOnlyOne}
            onPress={(value) => modelOnclick(index, item, "delete")}
          >
            <IconButton
              icon="trash-can-outline"
              color={isOnlyOne ? Colors.DARK_GRAY : Colors.PINK}
              size={25}
              disabled={isOnlyOne}
              //  onPress={alert("delete")}
            />
          </TouchableOpacity>
        </View>

        <DropDownSelectionItem
          label={"Model*"}
          value={carModel}
          onPress={() => showDropDownModelMethod("MODEL", "Select Model")}
          disabled={disabled}
        />
        <Text
          style={[
            GlobalStyle.underline,
            {
              backgroundColor:
                isSubmitPress && carModel === ""
                  ? "red"
                  : "rgba(208, 212, 214, 0.7)",
            },
          ]}
        ></Text>
        <DropDownSelectionItem
          label={"Variant*"}
          value={carVariant}
          onPress={() => showDropDownModelMethod("VARIENT", "Select Variant")}
          disabled={disabled}
        />
        <Text
          style={[
            GlobalStyle.underline,
            {
              backgroundColor:
                isSubmitPress && carVariant === ""
                  ? "red"
                  : "rgba(208, 212, 214, 0.7)",
            },
          ]}
        ></Text>
        <DropDownSelectionItem
          label={"Color*"}
          value={carColor}
          onPress={() => showDropDownModelMethod("COLOR", "Select Color")}
          disabled={disabled}
        />
        <Text
          style={[
            GlobalStyle.underline,
            {
              backgroundColor:
                isSubmitPress && carColor === ""
                  ? "red"
                  : "rgba(208, 212, 214, 0.7)",
            },
          ]}
        ></Text>
        <TextinputComp
          style={{ height: 65, width: "100%" }}
          label={userData.isSelfManager == "Y" ? "Range*" : "Fuel Type*"}
          editable={false}
          value={carFuelType}
          disabled={disabled}
        />
        <Text style={GlobalStyle.underline} />

        <TextinputComp
          style={{ height: 65, width: "100%" }}
          label={
            userData.isSelfManager == "Y"
              ? "Battery Type*"
              : userData.isTracker == "Y"
              ? "Clutch type*"
              : "Transmission Type*"
          }
          editable={false}
          value={carTransmissionType}
          disabled={disabled}
        />
        <Text style={GlobalStyle.underline} />
      </View>
      {/* <View style={styles.space}></View> */}
      <Modal
        animationType="fade"
        visible={imagePath !== ""}
        onRequestClose={() => {
          setImagePath("");
        }}
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View style={{ width: "90%" }}>
            <Image
              style={{ width: "100%", height: 400, borderRadius: 4 }}
              resizeMode="contain"
              source={{ uri: imagePath }}
            />
          </View>
          <TouchableOpacity
            style={{
              width: 100,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              left: "37%",
              bottom: "15%",
              borderRadius: 5,
              backgroundColor: Colors.RED,
            }}
            onPress={() => setImagePath("")}
          >
            <Text
              style={{ fontSize: 14, fontWeight: "600", color: Colors.WHITE }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};