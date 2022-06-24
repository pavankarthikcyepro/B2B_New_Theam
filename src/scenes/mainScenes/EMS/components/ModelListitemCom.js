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
} from "react-native-paper";
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
    clearState,
    setEditable,
    setDatePicker,
    setPersonalIntro,
    setCommunicationAddress,
    setCustomerProfile,
    updateSelectedDate,
    setFinancialDetails,
    setCustomerNeedAnalysis,
    setImagePicker,
    setUploadDocuments,
    setDropDownData,
    setAdditionalBuyerDetails,
    setReplacementBuyerDetails,
    setEnquiryDropDetails,
    getEnquiryDetailsApi,
    getAutoSaveEnquiryDetailsApi,
    updateDmsContactOrAccountDtoData,
    updateDmsLeadDtoData,
    updateDmsAddressData,
    updateModelSelectionData,
    updateFinancialData,
    setDropDownDataNew,
    getCustomerTypesApi,
    updateFuelAndTransmissionType,
    updateCustomerNeedAnalysisData,
    updateAdditionalOrReplacementBuyerData,
    dropEnquiryApi,
    updateEnquiryDetailsApi,
    uploadDocumentApi,
    updateDmsAttachmentDetails,
    getPendingTasksApi,
    updateAddressByPincode,
    updateRef,
    customerLeadRef,
    updateEnquiryDetailsApiAutoSave,
    clearPermanentAddr,
    updateAddressByPincode2,
    autoSaveEnquiryDetailsApi,
    updatedmsLeadProduct
} from "../../../../redux/enquiryFormReducer";
export const ModelListitemCom = ({ modelOnclick,item, index}) =>{
    const dispatch = useDispatch();

    const selector = useSelector((state) => state.enquiryFormReducer);
    const [dropDownKey, setDropDownKey] = useState("");
    const [dropDownTitle, setDropDownTitle] = useState("Select Data");
    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [dataForDropDown, setDataForDropDown] = useState([]);
    const [isSubmitPress, setIsSubmitPress] = useState(false);
    const [imagePath, setImagePath] = useState('');
    const [carModel, setCarModel] = useState('');
    const [carVariant, setCarVariant] = useState('');
    const [carFuelType, setCarFuelType] = useState('');
    const [carTransmissionType, setCarTransmissionType] = useState('');
    const [carColor, setCarColor] = useState('');







    const [carColorsData, setCarColorsData] = useState([]);
    const [userData, setUserData] = useState({
        orgId: "",
        employeeId: "",
        employeeName: "",
    });
    const [selectedCarVarientsData, setSelectedCarVarientsData] = useState({
        varientList: [],
        varientListForDropDown: [],
    });
    const [carModelsData, setCarModelsData] = useState([]);


    const showDropDownModelMethod = (key, headerText) => {
        Keyboard.dismiss();

        switch (key) {
            case "MODEL":
               console.log("onpreseed", carModelsData)
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
    }, []);
    const getAsyncstoreData = async () => {
        try{
            const employeeData = await AsyncStore.getData(
                AsyncStore.Keys.LOGIN_EMPLOYEE
            );
            setCarColor(item.color)
            setCarModel(item.model)
            setCarFuelType(item.fuel)
            setCarTransmissionType(item.transimmisionType)
            setCarVariant(item.variant)
            if (employeeData) {

                const jsonObj = JSON.parse(employeeData);
                setUserData({
                    orgId: jsonObj.orgId,
                    employeeId: jsonObj.employeeId,
                    employeeName: jsonObj.empName,
                });
                getCarModelListFromServer(jsonObj.orgId);

                // Get Token
                AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
                    if (token.length > 0) {
                        getInsurenceCompanyNamesFromServer(token, jsonObj.orgId);
                        getBanksListFromServer(jsonObj.orgId, token);
                        GetEnquiryDropReasons(jsonObj.orgId, token);
                    }
                });
            }
        }catch(error){
         alert(error)
        }
       
    };
    const updateVariantModelsData = async(
        selectedModelName,
        fromInitialize,
        selectedVarientName
    ) => {
        if (!selectedModelName || selectedModelName.length === 0) {
            return;
        }

        let arrTemp = carModelsData.filter(function (obj) {
            return obj.model === selectedModelName;
        });

        let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
        if (carModelObj !== undefined) {
            let newArray = [];
            setCarModel(selectedModelName)
            setCarColor("")
            setCarVariant('')
            setCarFuelType('')
            setCarTransmissionType('')
            try{
                const carmodeldata = {
                    "color": '',
                    "fuel": '',
                    "id": item.id,
                    "model": selectedModelName,
                    "transimmisionType": '',
                    "variant": ''
                }
                var modelsarr = await selector.dmsLeadProducts
                modelsarr[index] = await carmodeldata
                modelOnclick(index, carmodeldata, "update")

             // await alert(index + JSON.stringify(modelsarr))
                await dispatch(updatedmsLeadProduct(modelsarr))
            }catch(error){
               // alert(error)
            }
           
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
                if (fromInitialize) {
                    updateColorsDataForSelectedVarient(selectedVarientName, [...mArray]);
                }
            }
        }
    };

    const updateColorsDataForSelectedVarient = (
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
                setCarColor("")
                setCarVariant(selectedVarientName)
                setCarFuelType(carModelObj.fuelType)
                setCarTransmissionType(carModelObj.transmission_type)
                const carmodeldata = {
                    "color": '', 
                    "fuel": carModelObj.fuelType,
                    "id": item.id, 
                    "model": carModel,
                    "transimmisionType": carModelObj.transmission_type, 
                    "variant": selectedVarientName
                }
                const modelsarr = selector.dmsLeadProducts
                modelsarr[index] = carmodeldata
               modelOnclick(index, carmodeldata, "update")

                dispatch(updatedmsLeadProduct(modelsarr))
                dispatch(updateFuelAndTransmissionType(obj));
                setCarColorsData([...newArray]);
            }
        }
    };
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
                    console.log("getCarModelListFromServer Failed");
                }
            )
            .finally(() => {
              //  alert("final")
                // Get Enquiry Details
                getEnquiryDetailsFromServer();
            });
    };
    const updateColor = (dataobj)=>{
        setCarColor(dataobj.name)
        const carmodeldata = {
            "color": dataobj.name,
            "fuel": carFuelType,
            "id": item.id,
            "model": carModel,
            "transimmisionType": carTransmissionType,
            "variant": carVariant
        }
        const modelsarr = selector.dmsLeadProducts
        modelsarr[index] = carmodeldata
        modelOnclick(index, carmodeldata, "update")
        dispatch(updatedmsLeadProduct(modelsarr))
    }
    return(
        <View >
            <DropDownComponant
                visible={showDropDownModel}
                headerTitle={dropDownTitle}
                data={dataForDropDown}
                onRequestClose={() => setShowDropDownModel(false)}
                selectedItems={(item) => {
                    console.log("ITEM:", JSON.stringify(item));
                    if (dropDownKey === "MODEL") {
                        updateVariantModelsData(item.name, false);
                    } else if (dropDownKey === "VARIENT") {
                        updateColorsDataForSelectedVarient(
                            item.name,
                            selectedCarVarientsData.varientList
                        );
                    } else if (dropDownKey === "COLOR") {
                      updateColor(item)
                        
                    }
                    else if (
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
            <View style={{ padding: 5, marginVertical: 10, borderRadius: 5, backgroundColor: Colors.LIGHT_GRAY2 }}>
                <View style={{flexDirection:'row',width:'100%', justifyContent:'space-between'}}>
                    <Text style={{color:Colors.WHITE, fontSize:18, marginLeft:10,textAlignVertical:'center'}}>{carModel}</Text>
                    <TouchableOpacity 
                        onPress={(value) => modelOnclick(index, item, "delete")}>               
                          <IconButton
                        icon="trash-can-outline"
                        color={Colors.PINK}
                        size={25}
                  //  onPress={alert("delete")}
                    />
                    </TouchableOpacity>

                </View>
               
           
            <DropDownSelectionItem
                label={"Model*"}
                    value={carModel}
                onPress={() =>
                    showDropDownModelMethod("MODEL", "Select Model")
                }
            />
            <Text style={[GlobalStyle.underline, { backgroundColor: isSubmitPress && selector.model === '' ? 'red' : 'rgba(208, 212, 214, 0.7)' }]}></Text>
            <DropDownSelectionItem
                  label={"Variant*"}
                value={carVariant}
                  onPress={() =>
                    showDropDownModelMethod("VARIENT", "Select Variant")
                  }
                />
                <Text style={[GlobalStyle.underline, { backgroundColor: isSubmitPress && selector.varient === '' ? 'red' : 'rgba(208, 212, 214, 0.7)' }]}></Text>
                <DropDownSelectionItem
                  label={"Color*"}
                  value={carColor}
                  onPress={() =>
                    showDropDownModelMethod("COLOR", "Select Color")
                  }
                />
                <Text style={[GlobalStyle.underline, { backgroundColor: isSubmitPress && selector.color === '' ? 'red' : 'rgba(208, 212, 214, 0.7)' }]}></Text>
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"Fuel Type"}
                  editable={false}
                  value={carFuelType}
                />
                <Text style={[GlobalStyle.underline, { backgroundColor: isSubmitPress && selector.fuel_type === '' ? 'red' : 'rgba(208, 212, 214, 0.7)' }]}></Text>

                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"Transmission Type"}
                  editable={false}
                  value={carTransmissionType}
                />
                <Text style={[GlobalStyle.underline, { backgroundColor: isSubmitPress && selector.transmission_type === '' ? 'red' : 'rgba(208, 212, 214, 0.7)' }]}></Text>
            </View>
              {/* <View style={styles.space}></View> */}
            <Modal
                animationType="fade"
                visible={imagePath !== ''}
                onRequestClose={() => { setImagePath('') }}
                transparent={true}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                }}>
                    <View style={{ width: '90%' }}>
                        <Image style={{ width: '100%', height: 400, borderRadius: 4 }} resizeMode="contain" source={{ uri: imagePath }} />
                    </View>
                    <TouchableOpacity style={{ width: 100, height: 40, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: '37%', bottom: '15%', borderRadius: 5, backgroundColor: Colors.RED }} onPress={() => setImagePath('')}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.WHITE }}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}