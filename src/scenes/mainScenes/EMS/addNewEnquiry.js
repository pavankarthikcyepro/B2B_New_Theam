/** @format */

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  BackHandler,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import {
  DefaultTheme,
  Checkbox,
  IconButton,
  List,
  Button,
  Divider,
} from "react-native-paper";
import { Colors, GlobalStyle } from "../../../styles";
import VectorImage from "react-native-vector-image";
import { useDispatch, useSelector } from "react-redux";
import {
  TextinputComp,
  DropDownComponant,
  DatePickerComponent,
  SelectEmployeeComponant,
} from "../../../components";
import { ModelListitemCom } from "./components/ModelListitemCom";
import { ProformaComp } from "./components/ProformComp";

import {
  clearStateData,
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
  getEnquiryDetailsApiAuto,
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
  updatedmsLeadProduct,
  clearState2,
  getEventConfigList,
  getEnquiryTypesApi,
  postEvalutionApi,
  postFinanaceApi,
  getOrgTags,
  postOrgTags,
  getBranchList,
} from "../../../redux/enquiryFormReducer";
import {
  RadioTextItem,
  DropDownSelectionItem,
  ImageSelectItem,
  DateSelectItem,
} from "../../../pureComponents";
import { ImagePickerComponent } from "../../../components";
// import { Dropdown } from "sharingan-rn-modal-dropdown";
import { Dropdown } from "react-native-element-dropdown";
import {
  Salutation_Types,
  Enquiry_Segment_Data,
  Enquiry_Sub_Source_Type_Data,
  Enquiry_Category_Type_Data,
  Buyer_Type_Data,
  Kms_Travelled_Type_Data,
  Who_Drive_Type_Data,
  How_Many_Family_Members_Data,
  Prime_Exception_Types_Data,
  Finance_Types,
  Finance_Category_Types,
  Bank_Financer_Types,
  Approx_Auual_Income_Types,
  All_Car_Brands,
  Transmission_Types,
  Fuel_Types,
  Enquiry_Drop_Reasons,
  Insurence_Types,
  Referred_By_Source,
  Gender_Types,
} from "../../../jsonData/enquiryFormScreenJsonData";
import {
  showAlertMessage,
  showToast,
  showToastRedAlert,
  showToastSucess,
} from "../../../utils/toast";
import * as AsyncStore from "../../../asyncStore";
import {
  convertDateStringToMilliseconds,
  convertDateStringToMillisecondsUsingMoment,
  convertTimeStampToDateString,
  emiCalculator,
  GetCarModelList,
  GetDropList,
  GetEnquiryCarModelList,
  GetFinanceBanksList,
  isCheckPanOrAadhaar,
  PincodeDetails,
  PincodeDetailsNew,
} from "../../../utils/helperFunctions";

import CREATE_NEW from "../../../assets/images/create_new.svg";
import URL from "../../../networking/endpoints";
import { getEnquiryList } from "../../../redux/enquiryReducer";
import { AppNavigator } from "../../../navigations";
import {
  isValidateAlphabetics,
  isValidate,
  isValidateAplhaNumeric,
  isMobileNumber,
} from "../../../utils/helperFunctions";
import uuid from "react-native-uuid";
import { DropComponent } from "./components/dropComp";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Geolocation from "@react-native-community/geolocation";
import {
  changeEnquiryStatusApi,
  getTaskDetailsApi,
  updateTaskApi,
  getEnquiryDetailsApi as proceedGetEnquiryDetailsApi,
  updateEnquiryDetailsApi as proceedUpdateEnquiryDetailsApi,
  clearState as preClearState,
} from "../../../redux/proceedToPreBookingReducer";
import { EmsTopTabNavigatorIdentifiers } from "../../../navigations/emsTopTabNavigator";
import {
  getCurrentTasksListApi,
  getPendingTasksListApi,
} from "../../../redux/mytaskReducer";
import {
  CustomerTypesObj,
  CustomerTypesObj21,
  CustomerTypesObj22,
  EnquiryTypes21,
  EnquiryTypes22,
} from "../../../jsonData/preEnquiryScreenJsonData";
import { getEmployeesListApi } from "../../../redux/confirmedPreEnquiryReducer";
import { client } from "../../../networking/client";
import Fontisto from "react-native-vector-icons/Fontisto";
import AnimLoaderComp from "../../../components/AnimLoaderComp";
import DuplicateMobileModel from "../../../components/DuplicateMobileModel";
const theme = {
  ...DefaultTheme,
  // Specify custom property
  roundness: 0,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    background: Colors.WHITE,
  },
};
let EventListData = [
  {
    eventName: "omega thon",
    eventLocation: "Ahmedabad",
    Startdate: "10/12/2022",
    Enddate: "10/12/2022",
    isSelected: false,
    id: 0,
  },
  {
    eventName: "omega thon22",
    eventLocation: "Ahmedabad",
    Startdate: "10/12/2022",
    Enddate: "10/12/2022",
    isSelected: false,
    id: 1,
  },
  {
    eventName: "omega thon22",
    eventLocation: "Ahmedabad",
    Startdate: "10/12/2022",
    Enddate: "10/12/2022",
    isSelected: false,
    id: 2,
  },
  {
    eventName: "omega thon22",
    eventLocation: "Ahmedabad",
    Startdate: "10/12/2022",
    Enddate: "10/12/2022",
    isSelected: false,
    id: 3,
  },
  {
    eventName: "omega thon22",
    eventLocation: "Ahmedabad",
    Startdate: "10/12/2022",
    Enddate: "10/12/2022",
    isSelected: false,
    id: 4,
  },
];
const dmsAttachmentsObj = {
  branchId: null,
  contentSize: 0,
  createdBy: convertDateStringToMilliseconds(new Date()),
  description: null,
  documentNumber: "",
  documentPath: "",
  documentType: "",
  documentVersion: 0,
  fileName: "",
  gstNumber: null,
  id: 0,
  isActive: null,
  isPrivate: null,
  keyName: "",
  modifiedBy: "",
  orgId: null,
  ownerId: null,
  ownerName: "",
  parentId: null,
  tinNumber: null,
};

const orgTagDateFormate = "YYYY-MM-DD hh:mm:ss";

const AddNewEnquiryScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const headNavigation = useNavigation();
  let scrollRef = useRef(null);
  const selector = useSelector((state) => state.enquiryFormReducer);
  const homeSelector = useSelector((state) => state.homeReducer);
  const proceedToPreSelector = useSelector(
    (state) => state.proceedToPreBookingReducer
  );
  const employeeSelector = useSelector(
    (state) => state.confirmedPreEnquiryReducer
  );
  const [openAccordian, setOpenAccordian] = useState("0");
  const [componentAppear, setComponentAppear] = useState(false);
  //   const { universalId, enqDetails, leadStatus, leadStage } = route.params;
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [carModelsData, setCarModelsData] = useState([]);
  const [selectedCarVarientsData, setSelectedCarVarientsData] = useState({
    varientList: [],
    varientListForDropDown: [],
  });
  const [carColorsData, setCarColorsData] = useState([]);
  const [carModelsList, setCarModelsList] = useState([]);

  const [c_model_types, set_c_model_types] = useState([]);
  const [r_model_types, set_r_model_types] = useState([]);
  const [a_model_types, set_a_model_types] = useState([]);
  const [showPreBookingBtn, setShowPreBookingBtn] = useState(false);
  const [isDropSelected, setIsDropSelected] = useState(false);
  const [userData, setUserData] = useState({
    branchId: "",
    orgId: "",
    employeeId: "",
    employeeName: "",
    isSelfManager: "",
    isTracker: "",
    approverId: "",
    orgName: "",
  });
  const [uploadedImagesDataObj, setUploadedImagesDataObj] = useState({});
  const [modelsList, setModelsList] = useState([]);

  const [typeOfActionDispatched, setTypeOfActionDispatched] = useState("");
  const [minOrMaxDate, setMinOrMaxDate] = useState({
    minDate: null,
    maxDate: null,
  });
  const [insurenceCompayList, serInsurenceCompanyList] = useState([]);
  const [financeBanksList, setFinanceBanksList] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");

  // drop section
  const [dropData, setDropData] = useState([]);
  const [dropReason, setDropReason] = useState("");
  const [dropSubReason, setDropSubReason] = useState("");
  const [dropBrandName, setDropBrandName] = useState("");
  const [dropDealerName, setDropDealerName] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [dropModel, setDropModel] = useState("");
  const [dropPriceDifference, setDropPriceDifference] = useState("");
  const [dropRemarks, setDropRemarks] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [addressData, setAddressData] = useState([]);
  const [addressData2, setAddressData2] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [isSubmitPress, setIsSubmitPress] = useState(false);
  const [isPrimaryCureentIndex, setIsPrimaryCurrentIndex] = useState(0);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [authToken, setAuthToken] = useState("");

  const [makerData, setMakerData] = useState([]);
  const [subSourceData, setSubSourceData] = useState([]);
  const [sourceData, setSourceData] = useState(0);
  const [subsourceID, setSubSourceId] = useState(0);
  const [showEmployeeSelectModel, setEmployeeSelectModel] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isEventListModalVisible, setisEventListModalVisible] = useState(false);
  const [eventListdata, seteventListData] = useState([]);
  const [selectedEventData, setSelectedEventData] = useState([]);
  const [isMultipleSelection, setIsMultipleSelection] = useState(false);
  const [selectedTags, setSelectedTags] = useState("");
  const [tagList, setTagList] = useState([]);

  const [duplicateMobileErrorData, setDuplicateMobileErrorData] = useState("");
  const [duplicateMobileModelVisible, setDuplicateMobileModelVisible] =
    useState(false);
  const [isLocationDisabled, setIsLocationDisabled] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon="arrow-left"
          color={Colors.WHITE}
          size={30}
          onPress={goParentScreen}
        />
      ),
    });
  }, [navigation]);

  // useEffect(() => {

  //   const interval = setInterval(() => {
  //     if (enqDetails?.leadStage === "ENQUIRY" && enqDetails?.leadStatus === null) {
  //       autoSave()
  //     }
  //   }, 10000);
  //   return () => {

  //   let interval;
  //   navigation.addListener('focus', () => {
  //     interval = setInterval(() => {
  //       updateEnquiry()
  //     }, 60000);
  //   });
  //   navigation.addListener('blur', () => {

  //     clearInterval(interval)
  //   }
  // }, [autoSave, selector]);

  const clearLocalData = () => {
    setOpenAccordian("0");
    setComponentAppear(false);
    setShowDropDownModel(false);
    setDataForDropDown([]);
    setDropDownKey("");
    setDropDownTitle("Select Data");
    setCarModelsData([]);
    setSelectedCarVarientsData({
      varientList: [],
      varientListForDropDown: [],
    });
    setCarColorsData([]);
    set_c_model_types([]);
    set_r_model_types([]);
    set_a_model_types([]);
    setCarModelsList([]);
    setShowPreBookingBtn(false);
    setIsDropSelected(false);
    setUserData({
      branchId: "",
      orgId: "",
      employeeId: "",
      employeeName: "",
      isSelfManager: "",
      isTracker: "",
      approverId: "",
      orgName: ""
    });
    setUploadedImagesDataObj({});
    setTypeOfActionDispatched("");
    setMinOrMaxDate({
      minDate: null,
      maxDate: null,
    });
    serInsurenceCompanyList([]);
    setFinanceBanksList([]);
    setSelectedBranchId("");
    setIsMultipleSelection(false);
    setSelectedTags("");
    setTagList([]);
    
    // drop section
    setDropData([]);
    setDropReason("");
    setDropSubReason("");
    setDropBrandName("");
    setDropDealerName("");
    setDropLocation("");
    setDropModel("");
    setDropPriceDifference("");
    setDropRemarks("");
    setImagePath("");
    setAddressData([]);
    setAddressData2([]);
    setDefaultAddress(null);
  };

  const goParentScreen = () => {
    clearLocalData();
    dispatch(clearState());
    navigation.goBack();
  };

  const goToLeadScreen = () => {
    clearLocalData();
    dispatch(clearState());
    navigation.navigate(EmsTopTabNavigatorIdentifiers.leads, {
      fromScreen: "enquiry",
    });
  };

  useEffect(() => {
    return () => {
      dispatch(clearStateData());
      clearLocalData();
    };
  }, []);

  useEffect(() => {
    getAuthToken();
    getAsyncstoreData();
    getBranchId();
    setComponentAppear(true);
    getCustomerEnquiryType();
    //  const dms = [{ "color": "Outback Bronze", "fuel": "Petrol", "id": 2704, "model": "Kwid",
    //           "transimmisionType": "Manual", "variant": "KWID RXT 1.0L EASY- R BS6 ORVM MY22" },
    //            { "color": "Caspian Blue", "fuel": "Petrol", "id": 1833, "model": "Kiger", "transimmisionType": "Automatic",
    //           "variant": "Rxt 1.0L Ece Easy-R Ece My22" }]
    //           setModelsList(dms)
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    // return () => {
    //   BackHandler.removeEventListener(
    //     "hardwareBackPress",
    //     handleBackButtonClick
    //   );
    // };
  }, []);

  useEffect(() => {
    if (homeSelector.filter_drop_down_data?.Location?.sublevels.length == 1) {
      const { sublevels } = homeSelector.filter_drop_down_data.Location;
      let payload = {
        orgId: sublevels[0].orgId,
        locationId: sublevels[0].id,
      };
      setIsLocationDisabled(true);
      dispatch(setDropDownData({ key: "LOCATION", value: sublevels[0].name }));
      dispatch(getBranchList(payload));
    }
  }, [homeSelector.filter_drop_down_data]);
  
  useEffect(() => {
    if (homeSelector.filter_drop_down_data?.Location?.sublevels.length > 0) {
      const { sublevels } = homeSelector.filter_drop_down_data.Location;
      for (let i = 0; i < sublevels.length; i++) {
        const element = sublevels[i];
        if (element.name == selector.selectedLocation) {
          let payload = {
            orgId: element.orgId,
            locationId: element.id,
          };
          dispatch(getBranchList(payload));
          break;
        }
      }
      setSubSourceData([]);
    }
  }, [selector.selectedLocation]);
  
  useEffect(() => {
    if (selector.branchList.length == 1) {
      const element = selector.branchList;
      dispatch(setDropDownData({ key: "BRANCH", value: element[0].name }));
      dispatch(setDropDownData({ key: "ORG_ID", value: element[0].orgId }));
      dispatch(
        setDropDownData({ key: "BRANCH_ID", value: element[0].branchId })
      );
    }
  }, [selector.branchList]);
  
  useEffect(() => {
    if (selector.selectedBranch) {
      for (let i = 0; i < selector.branchList.length; i++) {
        const element = selector.branchList[i];
        if (element.name == selector.selectedBranch) {
          dispatch(setDropDownData({ key: "ORG_ID", value: element.orgId }));
          dispatch(
            setDropDownData({ key: "BRANCH_ID", value: element.branchId })
          );
          break;
        }
      }
      setSubSourceData([]);
    }
  }, [selector.selectedBranch]);

  useEffect(() => {
    if (selector.orgTagList.length > 0) {
      let newArr = [];
      for (let i = 0; i < selector.orgTagList.length; i++) {
        const element = selector.orgTagList[i];
        let obj = {
          ...element,
          selected: false,
        };
        newArr.push(obj);
      }
      setTagList(Object.assign([], newArr));
    }
    return () => {};
  }, [selector.orgTagList]);

  useEffect(() => {
    if (
      employeeSelector.employees_list.length > 0 &&
      employeeSelector.employees_list_status === "success"
    ) {
      let newData = [];
      employeeSelector.employees_list.forEach((element) => {
        const obj = {
          id: element.empId,
          name: element.empName,
          selected: false,
        };
        newData.push(obj);
      });
      setEmployeesData([...newData]);
      setSelectedEmployee("");
      // if (selector.source_of_enquiry) {
      //   setEmployeeSelectModel(true);
      // }
    } else {
      setEmployeesData([]);
      setSelectedEmployee("");
    }
  }, [employeeSelector.employees_list, employeeSelector.employees_list_status]);

  const getAuthToken = async () => {
    const token = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
    if (token) {
      setAuthToken(token);
    }
  };

  useEffect(() => {
    navigation.addListener("blur", () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    });

    // return () => {
    //     unsubscribe;
    // };
  }, [navigation]);

  const getCustomerEnquiryType = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      dispatch(getCustomerTypesApi(jsonObj.orgId));
      dispatch(getEnquiryTypesApi(jsonObj.orgId));
    }
  };

  const getBranchId = () => {
    AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_ID).then((branchId) => {
      setSelectedBranchId(branchId);
    });
  };

  const scrollToPos = (itemIndex) => {
    scrollRef.current.scrollTo({ y: itemIndex * 70 });
  };

  const handleBackButtonClick = () => {
    goParentScreen();
    return true;
  };

  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData({
        branchId: jsonObj.branchId,
        orgId: jsonObj.orgId,
        employeeId: jsonObj.empId,
        employeeName: jsonObj.empName,
        isSelfManager: jsonObj.isSelfManager,
        isTracker: jsonObj.isTracker,
        approverId: jsonObj.approverId,
        orgName: jsonObj.orgName,
      });
      dispatch(getOrgTags(jsonObj.orgId));
      getCarMakeListFromServer(jsonObj.orgId);
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
  };

  const GetEnquiryDropReasons = (orgId, token) => {
    GetDropList(orgId, token, "Enquiry").then(
      (resolve) => {
        setDropData(resolve);
      },
      (reject) => {
        console.error("Getting drop list faild");
      }
    );
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
          //  alert("entry---------",JSON.stringify(selector.dmsLeadProducts))
          if (selector.dmsLeadProducts.length > 0) {
            setCarModelsList(selector.dmsLeadProducts);
          } else {
            let tempModelObj = {
              color: "",
              fuel: "",
              id: 0,
              model: selector.enquiry_details_response?.dmsLeadDto?.model,
              transimmisionType: "",
              variant: "",
              isPrimary: "N",
            };
            setCarModelsList([tempModelObj]);
          }
        },
        (rejected) => {}
      )
      .finally(() => {
        // Get Enquiry Details
        getEnquiryDetailsFromServer();
      });
  };

  const getCarMakeListFromServer = (orgId) => {
    // Call Api
    GetEnquiryCarModelList(orgId)
      .then(
        (resolve) => {
          let makeList = [];
          if (resolve.length > 0) {
            resolve.forEach((item) => {
              makeList.push({
                ...item,
                name: item.otherMaker,
              });
            });
            setMakerData([...makeList]);
          }
        },
        (rejected) => {}
      )
      .finally(() => {});
  };

  const getInsurenceCompanyNamesFromServer = async (token, orgId) => {
    // await fetch(URL.GET_INSURENCE_COMPANY_NAMES(orgId), {
    //   method: "GET",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     "auth-token": token,
    //   },
    // })
    await client
      .get(URL.GET_INSURENCE_COMPANY_NAMES(orgId))
      .then((json) => json.json())
      .then((res) => {
        if (res != null && res.length > 0) {
          const companyList = res.map((item, index) => {
            return { ...item, name: item.company_name };
          });
          serInsurenceCompanyList([...companyList]);
        }
      })
      .catch((error) => {
        showToastRedAlert(error.message);
      });
  };

  const deleteModalFromServer = async ({ token, value }) => {
    //alert(value.id)
    await fetch(URL.DELETE_MODEL_CARD(value.id), {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    })
      .then((json) => {
        json.json();
      })
      .then((res) => {
        //alert("delete : ", res.status);
        //alert(res)
      })
      .catch((error) => {
        showToastRedAlert(error.message);
      });
  };

  const getBanksListFromServer = (orgId, token) => {
    GetFinanceBanksList(orgId, token).then(
      (resp) => {
        const bankList = resp.map((item) => {
          return { ...item, name: item.bank_name };
        });
        setFinanceBanksList([...bankList]);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const postEvalutionForm = (universalId)=>{
    // todo manthan
    if (selector.buyer_type.length !== 0){
      let payload = {
        "universalId":universalId,
        "evaluationApproverId": userData.approverId,
        // "oldBuyerType": "",
        "status": "ASSIGNED",
        "newBuyerType": selector.buyer_type
      }
      dispatch(postEvalutionApi(payload));
    }
  }
  const postFinanceForm = (universalId) => {
    // todo manthan
    if (selector.retail_finance.length !== 0) {
      let payload = {
        "universalId": universalId,
        "evaluationApproverId": userData.approverId,
        // "oldBuyerType": "",
        "status": "ASSIGNED",
        "newBuyerType": selector.retail_finance
      }
      dispatch(postFinanaceApi(payload));
    }
  }

  useEffect(() => {
    try {
      if (selector.dmsLeadProducts && selector.dmsLeadProducts.length > 0) {
        // setCarModelsList(selector.dmsLeadProducts)
        addingIsPrimary();
      } else {
        let tempModelObj = {
          color: "",
          fuel: "",
          id: 0,
          model: selector.enquiry_details_response?.dmsLeadDto?.model,
          transimmisionType: "",
          variant: "",
          isPrimary: "N",
        };
        setCarModelsList([tempModelObj]);
      }
    } catch (error) {
      // alert("useeffect"+error)
    }
  }, [selector.dmsLeadProducts, selector.enquiry_details_response]); //selector.dmsLeadProducts, selector.enquiry_details_response

  useEffect(() => {
    if (selector.pincode) {
      if (selector.pincode.length != 6) {
        return;
      }
      PincodeDetailsNew(selector.pincode).then(
        (res) => {
          // dispatch an action to update address
          let tempAddr = [];
          if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              if (
                res[i].Block === selector.village ||
                res[i].Name === selector.village
              ) {
                setDefaultAddress(res[i]);
              }
              tempAddr.push({ label: res[i].Name, value: res[i] });
              if (i === res.length - 1) {
                setAddressData([...tempAddr]);
              }
            }
          }
          // dispatch(updateAddressByPincode(resolve));
        },
        (rejected) => {}
      );
    }
  }, [selector.pincode]);

  useEffect(() => {
    if (selector.enquiry_details_response) {
      setShowPreBookingBtn(false);
      let dmsContactOrAccountDto;
      if (selector.enquiry_details_response.hasOwnProperty("dmsAccountDto")) {
        dmsContactOrAccountDto =
          selector.enquiry_details_response.dmsAccountDto;
      } else if (
        selector.enquiry_details_response.hasOwnProperty("dmsContactDto")
      ) {
        dmsContactOrAccountDto =
          selector.enquiry_details_response.dmsContactDto;
      }
      const dmsLeadDto = selector.enquiry_details_response.dmsLeadDto;
      if (dmsLeadDto.leadStatus === "ENQUIRYCOMPLETED") {
        setShowPreBookingBtn(true);
      }

      // if (dmsLeadDto.leadStage == "ENQUIRY" && dmsLeadDto.leadStatus == null) {
      //   dispatch(getAutoSaveEnquiryDetailsApi(universalId));
      // }

      // Update dmsContactOrAccountDto
      dispatch(updateDmsContactOrAccountDtoData(dmsContactOrAccountDto));
      // Update updateDmsLeadDtoData
      dispatch(updateDmsLeadDtoData(dmsLeadDto));
      if (dmsLeadDto.model) {
        updateVariantModelsData(dmsLeadDto.model, false);
      }
      // Update Addresses
      dispatch(updateDmsAddressData(dmsLeadDto.dmsAddresses));
      // Updaet Model Selection
      dispatch(updateModelSelectionData(dmsLeadDto.dmsLeadProducts));
      //   alert("reponse---------", JSON.stringify(dmsLeadDto.dmsLeadProducts))
      //  setCarModelsList(selector.dmsLeadProducts)
      // Update Finance Details
      dispatch(updateFinancialData(dmsLeadDto.dmsfinancedetails));
      // Update Customer Need Analysys
      dispatch(updateCustomerNeedAnalysisData(dmsLeadDto.dmsLeadScoreCards));
      // Update Additional ore Replacement Buyer Data
      dispatch(
        updateAdditionalOrReplacementBuyerData(dmsLeadDto.dmsExchagedetails)
      );
      // Update Attachment details

      saveAttachmentDetailsInLocalObject(
        dmsLeadDto.dmsAttachments,
        dmsLeadDto.dmsExchagedetails
      );
      dispatch(updateDmsAttachmentDetails(dmsLeadDto.dmsAttachments));
    }
  }, [selector.enquiry_details_response]); //selector.enquiry_details_response

  useEffect(() => {
    if (selector.event_list_response_Config_status === "success") {
      //todo

      let data = selector.event_list_Config;
      if (data) {
        let addSelectedFlag = data.content.map((i) => ({
          ...i,
          isSelected: false,
        }));

        seteventListData(addSelectedFlag);
        setisEventListModalVisible(true);
      }
    }
  }, [selector.event_list_response_Config_status]);

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const saveAttachmentDetailsInLocalObject = (dmsAttachments, exchangeDoc) => {
    if (dmsAttachments.length > 0) {
      const dataObj = {};
      dmsAttachments.forEach((item, index) => {
        if (!dataObj[item.documentType]) {
          const obj = {
            documentPath: item.documentPath,
            documentType: item.documentType,
            fileName: item.fileName,
            keyName: item.keyName,
          };
          dataObj[item.documentType] = obj;
        }
      });

      if (exchangeDoc.length > 0 && !isEmpty(exchangeDoc[0])) {
        const obj = {
          documentPath: exchangeDoc[0]?.regDocumentPath,
          documentType: "regNoD",
          fileName: exchangeDoc[0]?.regDocumentPath?.split("/")?.pop(),
          keyName: exchangeDoc[0]?.regDocumentKey,
        };
        dataObj["regNoD"] = obj;
        if (exchangeDoc[0]?.insuranceAvailable == "true") {
          const obj = {
            documentPath: exchangeDoc[0]?.insuranceDocumentPath,
            documentType: "insurance",
            fileName: exchangeDoc[0]?.insuranceDocumentPath?.split("/")?.pop(),
            keyName: exchangeDoc[0]?.insuranceDocumentKey,
          };
          dataObj["insurance"] = obj;
        }
      }
      setUploadedImagesDataObj({ ...dataObj });
    }
  };

  useEffect(() => {
    if (selector.model_drop_down_data_update_statu === "update") {
      updateVariantModelsData(selector.model, true, selector.varient);
    }
  }, [selector.model_drop_down_data_update_statu]);

  const getEnquiryDetailsFromServer = () => {
    if (false) {
      // if (selector.isOpened) {
      // dispatch(getAutoSaveEnquiryDetailsApi(universalId));
      if (leadStatus === "ENQUIRYCOMPLETED" && leadStage === "ENQUIRY") {
        // dispatch(getEnquiryDetailsApi({ universalId, leadStage, leadStatus }));
      } else {
        Promise.all([
          dispatch(),
          // getEnquiryDetailsApiAuto({ universalId, leadStage, leadStatus })
        ])
          .then(() => {
            dispatch();
            // getEnquiryDetailsApi({ universalId, leadStage, leadStatus })
          })
          .catch(() => {});
      }
      // dispatch(getEnquiryDetailsApi({universalId, leadStage, leadStatus}));
      // } else {
    }
  };

  const updateAccordian = (selectedIndex) => {
    Keyboard.dismiss();
    if (selectedIndex != openAccordian) {
      setOpenAccordian(selectedIndex);
    } else {
      setOpenAccordian(0);
    }
  };

  // let dmsEntity = selector.enquiry_details_response;

  const addingIsPrimary = async () => {
    try {
      let array = await [...selector.dmsLeadProducts];
      for (let i = 0; i < selector.dmsLeadProducts.length; i++) {
        var item = await array[i];
        if (i == 0) {
          var isPrimary = "Y";
          if (item.isPrimary && item.isPrimary != null)
            isPrimary = item.isPrimary;
          item = await {
            color: item.color,
            fuel: item.fuel,
            id: item.id,
            model: item.model,
            transimmisionType: item.transimmisionType,
            variant: item.variant,
            isPrimary: isPrimary,
          };
          if (
            item.isPrimary &&
            item.isPrimary != null &&
            item.isPrimary === "Y"
          )
            setIsPrimaryCurrentIndex(i);
          updateVariantModelsData(item.model, true, item.variant);
        } else {
          var isPrimary = "N";
          if (item.isPrimary && item.isPrimary != null)
            isPrimary = item.isPrimary;
          item = await {
            color: item.color,
            fuel: item.fuel,
            id: item.id,
            model: item.model,
            transimmisionType: item.transimmisionType,
            variant: item.variant,
            isPrimary: isPrimary,
          };
        }
        array[i] = await item;
        if (item.isPrimary && item.isPrimary != null && item.isPrimary === "Y")
          setIsPrimaryCurrentIndex(i);
      }

      await setCarModelsList(array);
    } catch (error) {}
  };

  const checkModelSelection = () => {
    let error = false;
    for (let i = 0; i < carModelsList.length; i++) {
      if (carModelsList[i].model.length == 0) {
        error = true;
        showToast("Please fill model");
        break;
      } else if (carModelsList[i].variant.length == 0) {
        error = true;
        showToast("Please fill model variant");
        break;
      } else if (carModelsList[i].color.length == 0) {
        error = true;
        showToast("Please fill model Color");
        break;
      }
    }

    if (error) {
      return true;
    }
    return false;
  };

  const submitClicked = async () => {
    //Personal Intro
    setIsSubmitPress(true);

    // if (selector.enquiry_segment.toLowerCase() == "personal") {
    //   if (
    //     selector.dateOfBirth.length == 0
    //     // ||
    //     // selector.anniversaryDate.length == 0
    //   ) {
    //     scrollToPos(0);
    //     setOpenAccordian("2");
    //     showToast("Please fill required fields in Personal Intro");
    //     return;
    //   }
    // }

    if (selector.enquiry_segment.toLowerCase() == "personal") {
      if (selector.gender.length == 0) {
        scrollToPos(0);
        setOpenAccordian("2");
        showToast("Please select Gender");
        return;
      }
    }
    if (selector.firstName.length == 0) {
      scrollToPos(0);
      setOpenAccordian("2");
      showToastRedAlert("Please enter first name");
      return;
    }
    if (!isValidate(selector.firstName)) {
      scrollToPos(0);
      setOpenAccordian("2");
      showToast("please enter alphabetics only in firstname");
      return;
    }
    if (selector.lastName.length == 0) {
      scrollToPos(0);
      showToastRedAlert("Please enter last name");
      return;
    }
    if (selector.mobile.length == 0) {
      scrollToPos(0);
      showToastRedAlert("Please enter mobile number");
      return;
    }
    if (!isValidate(selector.lastName)) {
      scrollToPos(0);
      setOpenAccordian("2");
      showToast("please enter alphabetics only in lastname");
      return;
    }
    
    if (selector.selectedLocation == "") {
      scrollToPos(0);
      setOpenAccordian("11");
      showToast("Please select location");
      return;
    }
    if (selector.selectedBranch == "") {
      scrollToPos(0);
      setOpenAccordian("11");
      showToast("Please select branch");
      return;
    }

    if (selector.enquiry_segment.length == 0) {
      scrollToPos(2);
      setOpenAccordian("1");
      showToast("Please select enquiry segment");
      return;
    }

    if (selector.customer_type.length == 0) {
      scrollToPos(2);
      setOpenAccordian("1");
      showToast("Please select customer type");
      return;
    }
    if (selector.source_of_enquiry.length == 0) {
      scrollToPos(2);
      setOpenAccordian("1");
      showToast("Please fill Source Of Enquiry");
      return;
    }
    if (selector.sub_source_of_enquiry.length == 0) {
      scrollToPos(2);
      setOpenAccordian("1");
      showToast("Please fill Sub Source Of Enquiry");
      return;
    }
    if (selector.buyer_type.length == 0) {
      scrollToPos(2);
      setOpenAccordian("1");
      showToast("Please fill  Buyer type");
      return;
    }

    // if (
    //   selector.p_pincode.length == 0
    //   ||
    //   selector.p_urban_or_rural.length == 0 ||
    //   selector.p_houseNum.length == 0 ||
    //   selector.p_streetName.length == 0 ||
    //   selector.p_village.length == 0 ||
    //   selector.p_mandal.length == 0 ||
    //   selector.p_city.length == 0 ||
    //   selector.p_district.length == 0 ||
    //   selector.p_state.length == 0
    // ) {
    //   scrollToPos(14);
    //   setOpenAccordian("3");
    //   showToast("Please fill permanent address ");
    //   return;
    // }
    if (selector.pincode.length == 0) {
      scrollToPos(14);
      setOpenAccordian("3");
      showToast("Please fill Communication pincode");
      return;
    }

    if (selector.p_pincode.length == 0) {
      scrollToPos(14);
      setOpenAccordian("3");
      showToast("Please fill Permanent pincode");
      return;
    }

    // if (selector.p_urban_or_rural.length == 0) {
    //   scrollToPos(14);
    //   setOpenAccordian("3");
    //   showToast("Please fill Permanent Urban or Rural");
    //   return;
    // }

    if (carModelsList[0].model === undefined) {
      scrollToPos(4);
      setOpenAccordian("4");
      return;
    }
    if (checkModelSelection()) {
      scrollToPos(4);
      setOpenAccordian("4");
      return;
    }

    let primaryTempCars = [];
    primaryTempCars = carModelsList.filter((item) => {
      return item.isPrimary === "Y";
    });

    if (!primaryTempCars.length > 0) {
      scrollToPos(4);
      setOpenAccordian("4");
      showToast("Select is Primary for atleast one vehicle");
      return;
    }

    //Finance Details
    if (selector.retail_finance.length == 0) {
      scrollToPos(5);
      setOpenAccordian("5");
      showToast("Please fill required fields in Finance Details");
      return;
    }
    // if (selector.retail_finance === "In House") {
    //   if (selector.finance_category.length == 0) {
    //     showToast("Please fill finance category");
    //     return;
    //   }
    //   if (selector.loan_of_tenure.length == 0) {
    //     showToast("Please fill loan of tenure");
    //     return;
    //   }
    //   if (selector.emi.length == 0) {
    //     showToast("Please fill emi");
    //     return;
    //   }
    //   if (selector.approx_annual_income.length == 0) {
    //     showToast("Please fill approx annual income");
    //     return;
    //   }
    //   if (selector.bank_or_finance.length == 0) {
    //     showToast("Please fill bank/Finance");
    //     return;
    //   }
    // }

    // Leashing
    // if (selector.retail_finance == "Leasing") {
    //   if (selector.leashing_name.length == 0) {
    //     showToast("Please fill required fields in leasing name");
    //     return;
    //   }
    // }

    //Customer Customer need Analysis
    // if (selector.c_voice_of_customer_remarks == 0) {
    //   showToast("Please fill required remarks field in Customer need Analysis");
    //   return;
    // }

    if (selector.buyer_type === "Additional Buyer") {
      // if (
      //   selector.a_make == 0 ||
      //   selector.a_model == 0 ||
      //   selector.a_varient == 0 ||
      //   selector.a_color == 0 ||
      //   selector.a_reg_no == 0
      // ) {
      //   scrollToPos(8);
      //   setOpenAccordian("8");
      //   showToast("Please fill required fields in Addtional buyer ");
      //   return;
      // }
      // if (!isValidateAlphabetics(selector.a_varient)) {
      //   scrollToPos(8);
      //   setOpenAccordian("8");
      //   showToast("Please enter alphabetics only in varient ");
      //   return;
      // }
      if (!isValidateAlphabetics(selector.a_color)) {
        scrollToPos(8);
        setOpenAccordian("8");
        showToast("Please enter alphabetics only in color ");
        return;
      }
    }

    if (
      selector.buyer_type === "Replacement Buyer" ||
      selector.buyer_type === "Exchange Buyer"
    ) {
      if (selector.r_color.length > 0) {
        if (!isValidateAlphabetics(selector.r_color)) {
          scrollToPos(9);
          setOpenAccordian("9");
          showToast("Please enter alphabetics only in color ");
          return;
        }
      }
      if (selector.r_reg_no.length == 0) {
        scrollToPos(9);
        setOpenAccordian("9");
        showToast("Please fill reg no is mandatory");
        return;
      }
      if (!isValidateAlphabetics(selector.r_model_other_name)) {
        scrollToPos(9);
        setOpenAccordian("9");
        showToast("Please enter proper model other name");
        return;
      }

      // if (selector.r_insurence_company_name.length == 0) {
      //   showToast("Please select the insurance company name");
      //   return;
      // }

      if (selector.r_hypothication_checked === true) {
        if (selector.r_hypothication_name.length > 0) {
          if (!isValidateAlphabetics(selector.r_hypothication_name)) {
            scrollToPos(9);
            setOpenAccordian("9");
            showToast("Please enter the proper Hypothication name");
            return;
          }
        }
        if (selector.r_hypothication_branch.length > 0) {
          if (!isValidateAlphabetics(selector.r_hypothication_branch)) {
            scrollToPos(9);
            setOpenAccordian("9");
            showToast("Please enter the proper Hypothication branch");
            return;
          }
        }
      }
    }

    if (selector.c_looking_for_any_other_brand_checked === true) {
      if (selector.c_dealership_name.length > 0) {
        if (!isValidateAlphabetics(selector.c_dealership_name)) {
          scrollToPos(7);
          setOpenAccordian("7");
          showToast("please enter the validate Dealership name");
          return;
        }
      }
    }

    // if (
    //   selector.leashing_name.length > 0 &&
    //   !isValidateAlphabetics(selector.leashing_name)
    // ) {
    //   showToast("Please enter proper leasing name");
    //   return;
    // }

    if (isCheckPanOrAadhaar("pan", selector.pan_number)) {
      scrollToPos(6);
      setOpenAccordian("6");
      showToast("Please enter proper PAN number");
      return;
    }

    if (isCheckPanOrAadhaar("aadhaar", selector.adhaar_number)) {
      scrollToPos(6);
      setOpenAccordian("6");
      showToast("Please enter proper Aadhaar number");
      return;
    }

    if (
      selector.gstin_number.length > 0 &&
      !isValidateAplhaNumeric(selector.gstin_number)
    ) {
      scrollToPos(6);
      setOpenAccordian("6");
      showToast("Please enter proper gstin number");
      return;
    }

    // check if events are selected
    if (selector.source_of_enquiry === "Events") {
      if (selectedEventData.length <= 0) {
        showToast("Please select event details");
        return;
      }
    }

    // if (!selector.enquiry_details_response) {
    //   return;
    // }

    let dmsContactOrAccountDto = {};
    let dmsLeadDto = {};
    let formData;

    // const dmsEntity = selector.enquiry_details_response;
    // if (dmsEntity.hasOwnProperty("dmsContactDto"))
    //   dmsContactOrAccountDto = mapContactOrAccountDto(dmsEntity.dmsContactDto);
    // else if (dmsEntity.hasOwnProperty("dmsAccountDto"))
    //   dmsContactOrAccountDto = mapContactOrAccountDto(dmsEntity.dmsAccountDto);

    if (true) {
      // try {
      //   dmsLeadDto = mapLeadDto(dmsEntity.dmsLeadDto);
      // } catch (error) {}
      // dmsLeadDto.firstName = selector.firstName;
      // dmsLeadDto.lastName = selector.lastName;
      // dmsLeadDto.phone = selector.mobile;
      // dmsLeadDto.dmsLeadProducts = carModelsList;

      let primaryModel = carModelsList.filter((item) => item.isPrimary === "Y");
      // dmsLeadDto.model = primaryModel[0].model;

      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );

      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        let empObj = {
          branchId: selector.selectedBranchId ?? jsonObj.branchs[0]?.branchId,
          modifiedBy: jsonObj.empName,
          orgId: jsonObj.orgId,
          ownerName: jsonObj.empName,
        };

        let dmsLeadEventDto;
        if (selectedEventData.length > 0) {
          dmsLeadEventDto = {
            id: selectedEventData[0].id,
            eventId: selectedEventData[0].eventId,
            eventName: selectedEventData[0].name,
            eventLocation: selectedEventData[0].location,
            startDate: selectedEventData[0].startdate,
            endDate: selectedEventData[0].enddate,
          };
        } else {
          dmsLeadEventDto = {};
        }
        let payloadx = {
          dmsAccountDto: {
            branchId: selector.selectedBranchId ?? jsonObj.branchs[0]?.branchId,
            company: selector.company_name,
            createdBy: jsonObj.empName,
            customerType: selector.customer_type,
            email: selector.email,
            enquirySource: sourceData,
            subSource: subsourceID,
            firstName: selector.firstName,
            lastName: selector.lastName,
            modifiedBy: jsonObj.empName,
            orgId: jsonObj.orgId,
            ownerName: jsonObj.empName,
            phone: selector.mobile,
            secondaryPhone: selector.alterMobile,
            status: "PREENQUIRY",
            age: selector.age,
            anniversaryDate: selector.anniversaryDate
              ? convertDateStringToMillisecondsUsingMoment(
                  selector.anniversaryDate
                )
              : "",
            annualRevenue: selector.approx_annual_income,
            dateOfBirth: selector.dateOfBirth
              ? convertDateStringToMillisecondsUsingMoment(selector.dateOfBirth)
              : "",
            gender: selector.gender,
            kmsTravelledInMonth: selector.kms_travelled_month,
            membersInFamily: selector.members,
            occupation: selector.occupation,
            primeExpectationFromCar: selector.prime_expectation_from_car,
            referedByFirstname: selector.rf_by_first_name,
            referedByLastname: selector.rf_by_last_name,
            refferedMobileNo: selector.rf_by_mobile,
            refferedSource: selector.rf_by_source,
            reffered_Sourcelocation: selector.rf_by_source_location,
            salutation: selector.salutation,
            whoDrives: selector.who_drives,
            relation: selector.relation,
            relationName: selector.relationName,
            designation: selector.designation,
            companyName: selector.company_name,
          },
          dmsLeadDto: {
            branchId: selector.selectedBranchId ?? jsonObj.branchs[0]?.branchId,
            createdBy: jsonObj.empName,
            enquirySegment: selector.enquiry_segment,
            firstName: selector.firstName,
            lastName: selector.lastName,
            leadStage: "PREENQUIRY",
            // modifieddatetime: moment(new Date()).valueOf(),
            // createddatetime: moment(new Date()).valueOf(),
            model: primaryModel[0].model,
            organizationId: jsonObj.orgId,
            phone: selector.mobile,
            sourceOfEnquiry: sourceData,
            eventCode: dmsLeadEventDto.id,
            email: selector.email,
            referencenumber: "",
            buyerType: selector.buyer_type,
            salesConsultant:
              selectedEmployee.length > 0 ? selectedEmployee : null,
            dmsExpectedDeliveryDate: selector.expected_delivery_date
              ? Number(selector.expected_delivery_date)
              : convertDateStringToMillisecondsUsingMoment(new Date()),
            dmsAddresses: [
              {
                addressType: "Communication",
                houseNo: selector.houseNum,
                street: selector.streetName,
                city: selector.city,
                district: selector.district,
                pincode: selector.pincode,
                state: selector.state,
                village: selector.village,
                county: "India",
                mandal: selector.mandal,
                rural: selector.urban_or_rural === 2 ? true : false,
                urban: selector.urban_or_rural === 1 ? true : false,
                id: 0,
              },
              {
                addressType: "Permanent",
                houseNo: selector.p_houseNum,
                street: selector.p_streetName,
                city: selector.p_city,
                district: selector.p_district,
                pincode: selector.p_pincode,
                state: selector.p_state,
                village: selector.p_village,
                county: "India",
                mandal: selector.p_mandal,
                rural: selector.p_urban_or_rural === 2 ? true : false,
                urban: selector.p_urban_or_rural === 1 ? true : false,
                id: 0,
              },
            ],
            dmsLeadProducts: carModelsList,
            dmsExchagedetails: [
              {
                buyerType: selector.buyer_type,
                brand:
                  selector.buyer_type === "Additional Buyer"
                    ? selector.a_make
                    : selector.r_make,
                varient:
                  selector.buyer_type === "Additional Buyer"
                    ? selector.a_varient
                    : selector.a_varient,
                fuelType: selector.r_fuel_type,
                regNo:
                  selector.buyer_type === "Additional Buyer"
                    ? selector.a_reg_no
                    : selector.r_reg_no,
                kiloMeters: selector.r_kms_driven_or_odometer_reading,
                hypothication: selector.r_hypothication_name,
                model:
                  selector.buyer_type === "Additional Buyer"
                    ? selector.a_model
                    : selector.r_model,
                color:
                  selector.buyer_type === "Additional Buyer"
                    ? selector.a_color
                    : selector.r_color,
                transmission: selector.r_transmission_type,
                yearofManufacture: selector.r_mfg_year,
                hypothicationBranch: selector.r_hypothication_branch,
                hypothicationRequirement: selector.r_hypothication_checked,
                expectedPrice: selector.r_expected_price
                  ? Number(selector.r_expected_price)
                  : null,
                registrationDate: moment(
                  selector.r_registration_date,
                  "DD/MM/YYYY"
                ),
                registrationValidityDate: moment(
                  selector.r_registration_validity_date,
                  "DD/MM/YYYY"
                ),
                insuranceAvailable: `${selector.r_insurence_checked}`,
                insuranceDocumentAvailable:
                  selector.r_insurence_document_checked,
                insuranceType: selector.r_insurence_type,
                insuranceFromDate: moment(
                  selector.r_insurence_from_date,
                  "DD/MM/YYYY"
                ),
                insuranceToDate: moment(
                  selector.r_insurence_to_date,
                  "DD/MM/YYYY"
                ),
                insuranceCompanyName: selector.r_insurence_company_name,
                insuranceDocumentKey: selector.insuranceDocumentKey,
                regDocumentKey: selector.regDocumentKey,
                insuranceDocumentPath: selector.insuranceDocumentPath,
                regDocumentPath: selector.regDocumentPath,
                insuranceExpiryDate: selector.r_insurence_to_date
                  ? moment(selector.r_insurence_to_date, "DD/MM/YYYY")
                  : "",
                id: 0,
              },
            ],
            dmsLeadScoreCards: [
              {
                lookingForAnyOtherBrand:
                  selector.c_looking_for_any_other_brand_checked,
                brand: selector.c_make,
                otherMake: selector.c_make_other_name,
                model: selector.c_model,
                otherModel: selector.c_model_other_name,
                variant: selector.c_variant,
                color: selector.c_color,
                fuel: selector.c_fuel_type,
                transmissionType: selector.c_transmission_type,
                dealershipName: selector.c_dealership_name,
                dealershipLocation: selector.c_dealership_location,
                priceRange: selector.c_price_range,
                decisionPendingReason: selector.c_dealership_pending_reason,
                onRoadPriceanyDifference: selector.c_on_road_price,
                customerFrom: "",
                village: "",
                hamlet: "",
                mandal: "",
                mandalHq: "",
                town: "",
                dist: "",
                distHq: "",
                voiceofCustomerRemarks: selector.c_voice_of_customer_remarks,
                id: 0,
              },
            ],
            dmsfinancedetails: [
              {
                financeType: selector.retail_finance,
                financeCategory: selector.finance_category,
                downPayment: selector.down_payment,
                loanAmount: selector.loan_amount
                  ? Number(selector.loan_amount)
                  : null,
                financeCompany: selector.bank_or_finance,
                expectedTenureYears: selector.loan_of_tenure,
                annualIncome: selector.approx_annual_income,
                location: selector.location,
                rateOfInterest: selector.rate_of_interest,
                emi: selector.emi,
                id: 0,
              },
            ],
            subSource: selector.sub_source_of_enquiry,
          },

          dmsLeadEventDto: dmsLeadEventDto,
        };

        let tempAttachments = Object.assign(
          [],
          payloadx.dmsLeadDto.dmsAttachments
        );

        let imgObjArr = [];
        if (Object.keys(uploadedImagesDataObj).length > 0) {
          imgObjArr = Object.entries(uploadedImagesDataObj).map((e) => ({
            name: e[0],
            value: e[1],
          }));
        }

        for (let i = 0; i < imgObjArr.length; i++) {
          let isAvailable = false;
          for (let j = 0; j < tempAttachments.length; j++) {
            if (tempAttachments[j].documentType == imgObjArr[i].name) {
              isAvailable = true;
              break;
            }
          }

          if (!isAvailable) {
            let newObj = {
              ...dmsAttachmentsObj,
              documentPath: imgObjArr[i].value.documentPath,
              fileName: imgObjArr[i].value.fileName,
              keyName: imgObjArr[i].value.keyName,
              documentType: imgObjArr[i].name,
              createdBy: convertDateStringToMilliseconds(new Date()),
              ...empObj,
            };

            if (imgObjArr[i].name === "pan" && selector.pan_number) {
              newObj.documentNumber = selector.pan_number;
            } else if (
              imgObjArr[i].name == "aadhar" &&
              selector.adhaar_number
            ) {
              newObj.documentNumber = selector.adhaar_number;
            } else if (
              imgObjArr[i].name == "employeeId" &&
              selector.employee_id
            ) {
              newObj.documentNumber = selector.employee_id;
            }

            tempAttachments.push(Object.assign({}, newObj));
          }
        }

        let panArr = tempAttachments.filter((item) => {
          return item.documentType === "pan";
        });

        let aadharArr = tempAttachments.filter((item) => {
          return item.documentType === "aadhar";
        });

        let empArr = tempAttachments.filter((item) => {
          return item.documentType === "employeeId";
        });

        // if pan number
        if (!panArr.length && selector.pan_number) {
          let newObj = {
            ...dmsAttachmentsObj,
            documentNumber: selector.pan_number,
            documentType: "pan",
            ...empObj,
          };
          tempAttachments.push(Object.assign({}, newObj));
        }

        // if aadhar number
        if (!aadharArr.length && selector.adhaar_number) {
          let newObj = {
            ...dmsAttachmentsObj,
            documentNumber: selector.adhaar_number,
            documentType: "aadhar",
            ...empObj,
          };
          tempAttachments.push(Object.assign({}, newObj));
        }

        // if emp id
        if (!empArr.length && selector.employee_id) {
          let newObj = {
            ...dmsAttachmentsObj,
            documentNumber: selector.employee_id,
            documentType: "employeeId",
            ...empObj,
          };
          tempAttachments.push(Object.assign({}, newObj));
        }

        payloadx.dmsLeadDto.dmsAttachments = Object.assign([], tempAttachments);
        let payloady = {
          dmsContactDto: payloadx.dmsAccountDto,
          dmsLeadDto: payloadx.dmsLeadDto,
          dmsLeadEventDto: payloadx.dmsLeadEventDto,
        };
        try {
          if (
            selector.customer_type === "Individual" &&
            selector.enquiry_segment === "Personal"
          ) {
            const response = await client.post(URL.ENQUIRY_CONTACT(), payloady);

            const json = await response.json();
            if (json.success) {
              submitOrgTags(json);
              displayCreateEnquiryLeadAlert(
                json?.dmsEntity?.leadCustomerReference?.referencenumber
              );
              postEvalutionForm(json?.dmsEntity?.dmsLeadDto?.crmUniversalId);
              postFinanceForm(json?.dmsEntity?.dmsLeadDto?.crmUniversalId);
              // showToastRedAlert("Enquiry is generated Successfully");
              // goToLeadScreen();
            } else {
              DuplicateErrorModal(json);
            }
          } else {
            const response1 = await client.post(
              URL.ENQURIY_ACCOUNT(),
              payloadx
            );

            const json1 = await response1.json();
            if (json1.success) {
              submitOrgTags(json1);
              displayCreateEnquiryLeadAlert(
                json1?.dmsEntity?.leadCustomerReference?.referencenumber
              );
              postEvalutionForm(json1?.dmsEntity?.dmsLeadDto?.crmUniversalId);
              postFinanceForm(json1?.dmsEntity?.dmsLeadDto?.crmUniversalId);
              // showToastRedAlert("Enquiry is generated Successfully");
              // goToLeadScreen();
            } else {
              DuplicateErrorModal(json1);
            }
          }
          // navigation.goBack();
        } catch (error) {
          console.error(error);
        }
      }
    }
    // if (selector.enquiry_details_response.hasOwnProperty("dmsContactDto")) {
    //   formData = {
    //     dmsContactDto: dmsContactOrAccountDto,
    //     dmsLeadDto: dmsLeadDto,
    //   };
    // } else {
    //   formData = {
    //     dmsAccountDto: dmsContactOrAccountDto,
    //     dmsLeadDto: dmsLeadDto,
    //   };
    // }

    // setTypeOfActionDispatched("UPDATE_ENQUIRY");
    // let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    // if (employeeData) {
    //   const jsonObj = JSON.parse(employeeData);
    //   const refPayload = {
    //     branchid: jsonObj.branchs[0]?.branchId,
    //     leadstage: "ENQUIRY",
    //     orgid: jsonObj.orgId,
    //   };
    //   return;
    //   Promise.all([
    //     dispatch(updateEnquiryDetailsApi(formData)),
    //     dispatch(customerLeadRef(refPayload)),
    //   ]).then(async (res) => {
    //     const payload = {
    //       refNo: res[1].payload.dmsEntity.leadCustomerReference.referencenumber,
    //       orgId: jsonObj.orgId,
    //       stageCompleted: "ENQUIRY",
    //     };
    //     dispatch(updateRef(payload));
    //   });
    // }
  };

  const submitOrgTags = (json) => {
    const { dmsLeadDto, task } = json.dmsEntity;
    const { id } = dmsLeadDto;
    const { universalId } = task;
    let defaultObj = {
      leadId: id,
      universalId: universalId,
      isActive: "N",
      createdDatetime: moment().format(orgTagDateFormate),
      updatedDatetime: moment().format(orgTagDateFormate),
    };

    let payloadArr = [
      { ...defaultObj, tagName: "VIP" },
      { ...defaultObj, tagName: "HNI" },
      { ...defaultObj, tagName: "SPL" },
    ];

    if (selectedTags.includes("VIP")) {
      payloadArr[0].isActive = "Y";
    }
    if (selectedTags.includes("HNI")) {
      payloadArr[1].isActive = "Y";
    }
    if (selectedTags.includes("SPL")) {
      payloadArr[2].isActive = "Y";
    }
    dispatch(postOrgTags(payloadArr));
  };

  const DuplicateErrorModal = (data) => {
    const { message } = data;
    if (message.includes("Account already exists")) {
      const msgArr = message.split("[");
      const msgArr2 = msgArr[1].split("]").join("");
      const msgArr3 = msgArr2.split(":");
      const msgArr4 = msgArr3[1].split(",");
      const createdDate = msgArr3[2].trim();
      const createdBy = msgArr4[0].trim();

      const msgEnq = msgArr[2].split("]").join("");
      const msgEnq2 = msgEnq.split(":");
      const enqNumber = msgEnq2[1].trim();

      let newObj = {
        createdBy: createdBy,
        createdDate: createdDate,
        enqNumber: enqNumber,
        mobileNumber: selector.mobile,
      };
      setDuplicateMobileErrorData(Object.assign({}, newObj));
      setDuplicateMobileModelVisible(true);
    } else {
      showToast(data.message);
    }
  };

  const mapContactOrAccountDto = (prevData) => {
    let dataObj = { ...prevData };
    if (selector.dateOfBirth) {
      dataObj.dateOfBirth = convertDateStringToMillisecondsUsingMoment(
        selector.dateOfBirth
      );
    } else {
      dataObj.dateOfBirth = "";
    }
    dataObj.email = selector.email;
    dataObj.firstName = selector.firstName;
    dataObj.lastName = selector.lastName;
    dataObj.phone = selector.mobile;
    dataObj.secondaryPhone = selector.alterMobile;
    dataObj.gender = selector.gender;
    dataObj.relation = selector.relation;
    dataObj.salutation = selector.salutation;
    dataObj.relationName = selector.relationName;
    dataObj.age = selector.age;

    dataObj.occupation = selector.occupation;
    dataObj.designation = selector.designation;
    dataObj.customerType = selector.customer_type;
    dataObj.anniversaryDate = convertDateStringToMillisecondsUsingMoment(
      selector.anniversaryDate
    );
    dataObj.annualRevenue = selector.approx_annual_income;
    dataObj.company = selector.company_name;
    dataObj.companyName = selector.company_name;
    dataObj.kmsTravelledInMonth = selector.kms_travelled_month;
    dataObj.membersInFamily = selector.members;
    dataObj.primeExpectationFromCar = selector.prime_expectation_from_car;
    dataObj.whoDrives = selector.who_drives;

    dataObj.referedByFirstname = selector.rf_by_first_name;
    dataObj.referedByLastname = selector.rf_by_last_name;
    dataObj.refferedMobileNo = selector.rf_by_mobile;
    dataObj.refferedSource = selector.rf_by_source;
    dataObj.reffered_Sourcelocation = selector.rf_by_source_location;
    return dataObj;
  };

  const mapLeadDto = (prevData) => {
    let dataObj = { ...prevData };
    dataObj.buyerType = selector.buyer_type;
    dataObj.enquiryCategory = selector.enquiry_category;
    dataObj.enquirySegment = selector.enquiry_segment;
    dataObj.enquirySource = selector.source_of_enquiry;
    dataObj.eventCode = selector.event_code;
    dataObj.subSource = selector.sub_source_of_enquiry;
    dataObj.gstNumber = selector.gstin_number;
    dataObj.dmsExpectedDeliveryDate = selector.expected_delivery_date
      ? Number(selector.expected_delivery_date)
      : convertDateStringToMillisecondsUsingMoment(new Date());
    dataObj.leadStatus = "ENQUIRYCOMPLETED";
    dataObj.dmsAddresses = mapDMSAddress(dataObj.dmsAddresses);
    dataObj.dmsLeadProducts = mapLeadProducts(dataObj.dmsLeadProducts);
    dataObj.model = carModelsList[0]?.model;
    dataObj.dmsfinancedetails = mapDmsFinanceDetails(dataObj.dmsfinancedetails);
    dataObj.dmsLeadScoreCards = mapDmsLeadScoreCards(dataObj.dmsLeadScoreCards);
    dataObj.dmsExchagedetails = mapExchangeDetails(dataObj.dmsExchagedetails);
    dataObj.dmsAttachments = mapDmsAttachments(dataObj.dmsAttachments);
    return dataObj;
  };

  const mapDMSAddress = (prevDmsAddresses) => {
    let dmsAddresses = [...prevDmsAddresses];
    if (dmsAddresses.length == 2) {
      dmsAddresses.forEach((address, index) => {
        let dataObj = { ...address };
        if (address.addressType === "Communication") {
          dataObj.pincode = selector.pincode;
          dataObj.houseNo = selector.houseNum;
          dataObj.street = selector.streetName;
          dataObj.village = selector.village;
          dataObj.mandal = selector.mandal;
          dataObj.city = selector.city;
          dataObj.district = selector.district;
          dataObj.state = selector.state;
          dataObj.urban = selector.urban_or_rural === 1 ? true : false;
          dataObj.rural = selector.urban_or_rural === 2 ? true : false;
        } else if (address.addressType === "Permanent") {
          dataObj.pincode = selector.p_pincode;
          dataObj.houseNo = selector.p_houseNum;
          dataObj.street = selector.p_streetName;
          dataObj.village = selector.p_village;
          dataObj.mandal = selector.p_mandal;
          dataObj.city = selector.p_city;
          dataObj.district = selector.p_district;
          dataObj.state = selector.p_state;
          dataObj.urban = selector.p_urban_or_rural === 1 ? true : false;
          dataObj.rural = selector.p_urban_or_rural === 2 ? true : false;
        }
        dmsAddresses[index] = dataObj;
      });
    }
    return dmsAddresses;
  };

  const mapLeadProducts = async (prevDmsLeadProducts) => {
    let dmsLeadProducts = [...prevDmsLeadProducts];
    let dataObj = {};
    // if (dmsLeadProducts.length > 0) {
    //   dataObj = { ...dmsLeadProducts[0] };
    // }
    // dataObj.id = dataObj.id ? dataObj.id : 0;
    // dataObj.model = selector.model;
    // dataObj.variant = selector.varient;
    // dataObj.color = selector.color;
    // dataObj.fuel = selector.fuel_type;
    // dataObj.transimmisionType = selector.transmission_type;
    // alert(JSON.stringify(carModelsList))
    dmsLeadProducts = await carModelsList;
    return dmsLeadProducts;
  };

  const mapDmsFinanceDetails = (prevDmsFinancedetails) => {
    let dmsfinancedetails = [...prevDmsFinancedetails];
    let dataObj = {};
    if (dmsfinancedetails.length > 0) {
      dataObj = { ...dmsfinancedetails[0] };
    }
    dataObj.financeType = selector.retail_finance;
    dataObj.financeCategory = selector.finance_category;
    dataObj.downPayment = selector.down_payment;
    dataObj.loanAmount = selector.loan_amount
      ? Number(selector.loan_amount)
      : null;
    dataObj.rateOfInterest = selector.rate_of_interest;
    dataObj.expectedTenureYears = selector.loan_of_tenure;
    dataObj.emi = selector.emi;
    dataObj.annualIncome = selector.approx_annual_income;
    dataObj.location = selector.location;
    if (selector.retail_finance === "In House") {
      dataObj.financeCompany = selector.bank_or_finance;
    } else if (selector.retail_finance === "Out House") {
      dataObj.financeCompany = selector.bank_or_finance_name;
    } else if (selector.retail_finance === "Leasing") {
      dataObj.financeCompany = selector.leashing_name;
    }
    dmsfinancedetails[0] = dataObj;
    return dmsfinancedetails;
  };

  const mapDmsLeadScoreCards = (prevDmsLeadScoreCards) => {
    let dmsLeadScoreCards = [...prevDmsLeadScoreCards];
    let dataObj = {};
    if (dmsLeadScoreCards.length > 0) {
      dataObj = { ...dmsLeadScoreCards[0] };
    }
    dataObj.lookingForAnyOtherBrand =
      selector.c_looking_for_any_other_brand_checked;
    dataObj.brand = selector.c_make;
    dataObj.model = selector.c_model;
    dataObj.otherMake = selector.c_make_other_name;
    dataObj.otherModel = selector.c_model_other_name;
    dataObj.variant = selector.c_variant;
    dataObj.color = selector.c_color;
    dataObj.fuel = selector.c_fuel_type;
    dataObj.transmissionType = selector.c_transmission_type;
    dataObj.priceRange = selector.c_price_range;
    dataObj.onRoadPriceanyDifference = selector.c_on_road_price;
    dataObj.dealershipName = selector.c_dealership_name;
    dataObj.dealershipLocation = selector.c_dealership_location;
    dataObj.decisionPendingReason = selector.c_dealership_pending_reason;
    dataObj.voiceofCustomerRemarks = selector.c_voice_of_customer_remarks;
    dmsLeadScoreCards[0] = dataObj;
    return dmsLeadScoreCards;
  };

  const mapExchangeDetails = (prevDmsExchagedetails) => {
    let dmsExchagedetails = [...prevDmsExchagedetails];
    if (dmsExchagedetails.length > 0) {
      const dataObj = formatExchangeDetails(dmsExchagedetails[0]);
      dmsExchagedetails[0] = dataObj;
    } else {
      const dataObj = formatExchangeDetails({});
      dmsExchagedetails[0] = dataObj;
    }
    return dmsExchagedetails;
  };

  const modelOnclick = async (index, value, type) => {
    try {
      if (type == "update") {
        let arr = [...carModelsList];
        arr[index] = value;
        // arr.splice(carModelsList, index, value);
        let primaryModel = [];
        primaryModel = arr.filter((item) => item.isPrimary === "Y");
        if (primaryModel.length > 0) {
          if (
            primaryModel[0].variant !== "" &&
            primaryModel[0].model !== "" &&
            primaryModel[0].color !== ""
          ) {
            updateVariantModelsData(
              primaryModel[0].model,
              true,
              primaryModel[0].variant,
              primaryModel[0].color
            );
          }
        }
        await setCarModelsList([...arr]);
      } else {
        if (type == "delete") {
          let arr = await [...carModelsList];
          arr.splice(index, 1);
          setCarModelsList(Object.assign([], arr));
          dispatch(updatedmsLeadProduct(Object.assign([], arr)));
          deleteModalFromServer({ value });
        }
      }
    } catch (error) {
      // alert(error)
    }
  };

  const isPrimaryOnclick = async (isPrimaryEnabled, index, item) => {
    try {
      if (isPrimaryEnabled === "Y") {
        await setIsPrimaryCurrentIndex(index);
        await setCarModelsList([]);
        updateVariantModelsData(item.model, true, item.variant, item.color); //item.variant, item.color
      }
      if (carModelsList && carModelsList.length > 0) {
        let arr = await [...carModelsList];
        var data = arr[isPrimaryCureentIndex];
        if (data) {
          const cardata = await {
            color: data.color,
            fuel: data.fuel,
            id: data.id,
            model: data.model,
            transimmisionType: data.transimmisionType,
            variant: data.variant,
            isPrimary: "N",
          };
          arr[isPrimaryCureentIndex] = cardata;
        }
        const selecteditem = await {
          color: item.color,
          fuel: item.fuel,
          id: item.id,
          model: item.model,
          transimmisionType: item.transimmisionType,
          variant: item.variant,
          isPrimary: "Y",
        };
        arr[index] = selecteditem;
        dispatch(updatedmsLeadProduct([...arr]));
        await setCarModelsList([...arr]);
        await setIsPrimaryCurrentIndex(index);
      }
    } catch (error) {
      // alert(error)
    }
  };

  const formatExchangeDetails = (prevData) => {
    let dataObj = { ...prevData };
    if (selector.buyer_type === "Additional Buyer") {
      dataObj.buyerType = selector.buyer_type;
      dataObj.brand = selector.a_make;
      dataObj.model = selector.a_model;
      dataObj.varient = selector.a_varient;
      dataObj.color = selector.a_color;
      dataObj.regNo = selector.a_reg_no;
    } else if (
      selector.buyer_type === "Replacement Buyer" ||
      selector.buyer_type === "Exchange Buyer"
    ) {
      dataObj.buyerType = selector.buyer_type;
      dataObj.regNo = selector.r_reg_no;
      dataObj.brand = selector.r_make;
      dataObj.model = selector.r_model;
      dataObj.varient = selector.r_varient;
      dataObj.color = selector.r_color;
      dataObj.fuelType = selector.r_fuel_type;
      dataObj.transmission = selector.r_transmission_type;
      // Pending
      // dataObj.yearofManufacture = convertDateStringToMillisecondsUsingMoment(
      //   selector.r_mfg_year
      // );
      dataObj.regDocumentKey = selector.regDocumentKey;
      dataObj.regDocumentPath = selector.regDocumentPath;
      dataObj.insuranceDocumentKey = selector.insuranceDocumentKey;
      dataObj.insuranceDocumentPath = selector.insuranceDocumentPath;
      dataObj.yearofManufacture = selector.r_mfg_year;
      dataObj.kiloMeters = selector.r_kms_driven_or_odometer_reading;
      dataObj.expectedPrice = selector.r_expected_price
        ? Number(selector.r_expected_price)
        : null;
      dataObj.hypothicationRequirement = selector.r_hypothication_checked;
      dataObj.hypothication = selector.r_hypothication_name;
      dataObj.hypothicationBranch = selector.r_hypothication_branch;
      // Pending
      dataObj.registrationDate = moment(
        selector.r_registration_date,
        "DD/MM/YYYY"
      );
      dataObj.registrationValidityDate = moment(
        selector.r_registration_validity_date,
        "DD/MM/YYYY"
      );
      dataObj.insuranceAvailable = `${selector.r_insurence_checked}`;
      dataObj.insuranceDocumentAvailable =
        selector.r_insurence_document_checked;
      dataObj.insuranceCompanyName = selector.r_insurence_company_name;
      // Pending
      dataObj.insuranceExpiryDate = selector.r_insurence_to_date
        ? moment(selector.r_insurence_to_date, "DD/MM/YYYY")
        : "";
      dataObj.insuranceType = selector.r_insurence_type;
      // Pending
      dataObj.insuranceFromDate = moment(
        selector.r_insurence_from_date,
        "DD/MM/YYYY"
      );
      dataObj.insuranceToDate = moment(
        selector.r_insurence_to_date,
        "DD/MM/YYYY"
      );
    }
    return dataObj;
  };

  const mapDmsAttachments = (prevDmsAttachments) => {
    let dmsAttachments = [...prevDmsAttachments];
    if (dmsAttachments.length > 0) {
      dmsAttachments.forEach((obj, index) => {
        const item = uploadedImagesDataObj[obj.documentType];

        let finalObj = {};

        if (item) {
          finalObj = formatAttachment(
            { ...obj },
            item,
            index,
            obj.documentType
          );
        } else {
          let subItem = {
            documentType: obj.documentType,
            documentPath: "",
            keyName: "",
            fileName: "",
          };

          finalObj = formatAttachment(
            { ...obj },
            subItem,
            index,
            obj.documentType
          );
        }

        dmsAttachments[index] = finalObj;
      });
    } else {
      Object.keys(uploadedImagesDataObj).forEach((key, index) => {
        const item = uploadedImagesDataObj[key];
        const object = formatAttachment({}, item, index, item.documentType);
        dmsAttachments.push(object);
      });
    }
    return dmsAttachments;
  };

  const formatAttachment = (data, photoObj, index, typeOfDocument) => {
    let object = { ...dmsAttachmentsObj, ...data };
    object.branchId = selector.selectedBranchId ?? selectedBranchId;
    object.ownerName = userData.employeeName;
    object.orgId = userData.orgId;
    object.documentType = photoObj?.documentType;
    object.documentPath = photoObj?.documentPath;
    object.keyName = photoObj?.keyName;
    object.fileName = photoObj?.fileName;
    object.createdBy = convertDateStringToMilliseconds(new Date());
    // object.id = `${index}`;
    object.modifiedBy = userData.employeeName;
    object.ownerId = userData.employeeId;
    switch (typeOfDocument) {
      case "pan":
        object.documentNumber = selector.pan_number;
        break;
      case "aadhar":
        object.documentNumber = selector.adhaar_number;
        break;
      case "regNoD":
        object.documentNumber = selector.r_reg_no;
        break;
      case "employeeId":
        object.documentNumber = selector.employee_id;
        break;
    }
    return object;
  };

  const showPendingTaskAlert = (data = [], probookingTaskObj) => {
    if (data.length > 0) {
      let taskNames = "";
      let enableProceedToPrebooking = false;
      data.forEach((item) => {
        if (item === "Proceed to Pre Booking") {
          enableProceedToPrebooking = true;
        } else {
          taskNames += item;
        }
      });

      if (enableProceedToPrebooking) {
        const dataObj = probookingTaskObj;
        const taskId = dataObj.taskId;
        // const universalId = dataObj.universalId;
        const taskStatus = dataObj.taskStatus;

        if (taskNames === "") {
          navigation.navigate(
            AppNavigator.EmsStackIdentifiers.proceedToPreBooking,
            {
              identifier: "PROCEED_TO_PRE_BOOKING",
              taskId,
              // universalId,
              taskStatus,
            }
          );
        } else {
          Alert.alert(
            "Below tasks are pending, do you want to continue to proceed",
            taskNames,
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Proceed",
                onPress: () => {
                  proceedToFinalPreBookingClicked(taskId);
                  // navigation.navigate(
                  //   AppNavigator.EmsStackIdentifiers.proceedToPreBooking,
                  //   {
                  //     identifier: "PROCEED_TO_PRE_BOOKING",
                  //     taskId,
                  //     universalId,
                  //     taskStatus,
                  //   }
                  // );
                },
              },
            ]
          );
        }
      } else {
        showAlertMessage("Below tasks are pending...", taskNames);
      }
    }
  };

  useEffect(() => {
    navigation.addListener("blur", () => {
      getCurrentLocation();
    });
  }, [navigation]);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition((info) => {
      setCurrentLocation({
        lat: info.coords.latitude,
        long: info.coords.longitude,
      });
    });
  };

  const proceedToFinalPreBookingClicked = async (taskId) => {
    setTypeOfActionDispatched("PROCEED_TO_PREBOOKING");

    let response = await dispatch(getTaskDetailsApi(taskId));

    if (response?.payload?.dmsEntity?.task?.taskId) {
      const newTaskObj = { ...response.payload.dmsEntity.task };
      newTaskObj.taskStatus = "CLOSED";
      newTaskObj.lat = currentLocation ? currentLocation.lat.toString() : null;
      newTaskObj.lon = currentLocation ? currentLocation.long.toString() : null;
      dispatch(updateTaskApi(newTaskObj));
    }
  };

  // Handle Update Current Task Response
  useEffect(() => {
    if (typeOfActionDispatched === "PROCEED_TO_PREBOOKING") {
      if (proceedToPreSelector.update_task_response_status === "success") {
        // const endUrl = `${universalId}` + "?" + "stage=PREBOOKING";
        // dispatch(changeEnquiryStatusApi(endUrl));
      } else if (
        proceedToPreSelector.update_task_response_status === "failed"
      ) {
        showToastRedAlert("something went wrong");
      }
    }
  }, [proceedToPreSelector.update_task_response_status]);

  // Handle Change Enquiry Status response
  useEffect(() => {
    if (typeOfActionDispatched === "PROCEED_TO_PREBOOKING") {
      if (proceedToPreSelector.change_enquiry_status === "success") {
        callCustomerLeadReferenceApi();
      } else if (proceedToPreSelector.change_enquiry_status === "failed") {
        showToastRedAlert("something went wrong");
      }
    }
  }, [proceedToPreSelector.change_enquiry_status]);

  const callCustomerLeadReferenceApi = async () => {
    const payload = {
      branchid: selector.selectedBranchId ?? userData.branchId,
      leadstage: "PREBOOKING",
      orgid: userData.orgId,
      // universalId: universalId,
    };
    const url = URL.CUSTOMER_LEAD_REFERENCE();
    // await fetch(url, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": authToken,
    //   },
    //   method: "POST",
    //   body: JSON.stringify(payload),
    // })
    await client
      .post(url, payload)
      .then((res) => res.json())
      .then((jsonRes) => {
        if (jsonRes.success === true) {
          if (jsonRes.dmsEntity?.leadCustomerReference) {
            const refNumber =
              jsonRes.dmsEntity?.leadCustomerReference.referencenumber;
            updateEnuiquiryDetails(refNumber);
          }
        }
      })
      .catch((err) => console.error(err));
  };

  const updateEnuiquiryDetails = async (refNumber) => {
    return;
    // let response = await dispatch(proceedGetEnquiryDetailsApi(universalId));

    if (response?.payload?.dmsEntity) {
      let enquiryDetailsObj = { ...response.payload.dmsEntity };
      let dmsLeadDto = { ...enquiryDetailsObj.dmsLeadDto };
      if (typeOfActionDispatched === "PROCEED_TO_PREBOOKING") {
        dmsLeadDto.leadStatus = "ENQUIRYCOMPLETED";
        dmsLeadDto.leadStage = "PREBOOKING";
        dmsLeadDto.referencenumber = refNumber;
      }

      enquiryDetailsObj.dmsLeadDto = dmsLeadDto;
      dispatch(proceedUpdateEnquiryDetailsApi(enquiryDetailsObj));
    }
  };

  // Handle Enquiry Update response
  useEffect(() => {
    if (typeOfActionDispatched === "PROCEED_TO_PREBOOKING") {
      if (
        proceedToPreSelector.update_enquiry_details_response_status ===
          "success" &&
        proceedToPreSelector.update_enquiry_details_response
      ) {
        if (typeOfActionDispatched === "PROCEED_TO_PREBOOKING") {
          displayCreateEnquiryAlert();
        }
      } else if (
        proceedToPreSelector.update_enquiry_details_response_status === "failed"
      ) {
        showToastRedAlert("something went wrong");
      }
    } else {
      if (
        proceedToPreSelector.update_enquiry_details_response_status ===
        "success"
      ) {
        clearState();
        clearLocalData();
      }
    }
  }, [
    proceedToPreSelector.update_enquiry_details_response_status,
    proceedToPreSelector.update_enquiry_details_response,
  ]);

  const displayCreateEnquiryAlert = () => {
    let refNumber = "";
    if (proceedToPreSelector.update_enquiry_details_response) {
      refNumber =
        proceedToPreSelector.update_enquiry_details_response.dmsLeadDto
          .referencenumber;
    }

    Alert.alert(
      "Booking Approval Successfully Created",
      refNumber,
      [
        {
          text: "OK",
          onPress: () => goToParentScreen(),
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  const goToParentScreen = () => {
    getMyTasksListFromServer();
    navigation.navigate(EmsTopTabNavigatorIdentifiers.leads, {
      fromScreen: "proceedToBookingApproval",
    });
    dispatch(preClearState());
    dispatch(clearState2());
    clearState();
    clearLocalData();
  };

  const getMyTasksListFromServer = () => {
    if (userData.employeeId) {
      const endUrl = `empid=${userData.employeeId}&limit=10&offset=${0}`;
      dispatch(getCurrentTasksListApi(endUrl));
      dispatch(getPendingTasksListApi(endUrl));
    }
  };

  useEffect(() => {
    if (
      selector.get_pending_tasks_response_status === "success" &&
      selector.get_pending_tasks_response_list.length > 0
    ) {
      let pendingTaskNames = [];
      let proBookingTaskObj = {};
      selector.get_pending_tasks_response_list.forEach((element) => {
        if (
          element.taskName === "Test Drive" &&
          (element.taskStatus === "" || element.taskStatus === "ASSIGNED")
        ) {
          pendingTaskNames.push("Test Drive : Pending \n");
        }
        if (
          element.taskName === "Home Visit" &&
          (element.taskStatus === "" || element.taskStatus === "ASSIGNED")
        ) {
          pendingTaskNames.push("Home Visit : Pending \n");
        }
        if (
          element.taskName === "Evaluation" &&
          (element.taskStatus === "" || element.taskStatus === "ASSIGNED") &&
          (selector.enquiry_details_response.dmsLeadDto.buyerType ===
            "Replacement Buyer" ||
            selector.enquiry_details_response.dmsLeadDto.buyerType ===
              "Exchange Buyer")
        ) {
          pendingTaskNames.push("Evaluation : Pending \n");
        }
        if (
          element.taskName === "Proceed to Pre Booking" &&
          element.assignee.empId === userData.employeeId
          // element.universalId === universalId
        ) {
          pendingTaskNames.push("Proceed to Pre Booking");
          proBookingTaskObj = element;
        }
      });
      showPendingTaskAlert(pendingTaskNames, proBookingTaskObj);
    }
  }, [
    selector.get_pending_tasks_response_status,
    selector.get_pending_tasks_response_list,
  ]);

  const proceedToPreBookingClicked = async () => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (
        selector.enquiry_details_response.dmsLeadDto.salesConsultant ==
          jsonObj.empName ||
        selector.enquiry_details_response.dmsLeadDto.createdBy ==
          jsonObj.empName
      ) {
        // if (universalId) {
        //   const endUrl = universalId + "?" + "stage=Enquiry";
        //   dispatch(getPendingTasksApi(endUrl));
        // }
      } else {
        alert("Permission Denied");
        // Alert.alert(
        //   'Permission Denied',
        //   [
        //     {
        //       text: 'OK',
        //     }
        //   ],
        //   { cancelable: false }
        // );
      }
    }
  };

  // useEffect(() => {
  //   if (selector.enquiry_drop_response_status === "success") {
  //     showToastSucess("Sucessfully Enquiry Dropped.")
  //     navigation.goBack();
  //   }
  // }, [selector.enquiry_drop_response_status]);

  useEffect(() => {
    if (selector.update_enquiry_details_response === "success") {
      if (typeOfActionDispatched === "DROP_ENQUIRY") {
        // showToastSucess("Successfully Enquiry Dropped");
        // getEnquiryListFromServer();
      } else if (typeOfActionDispatched === "UPDATE_ENQUIRY") {
        showToastSucess("Successfully Enquiry Updated");
        goToLeadScreen();
      }
    }
  }, [selector.update_enquiry_details_response]);

  const getEnquiryListFromServer = () => {
    if (userData.employeeId) {
      let endUrl =
        "?limit=10&offset=" +
        "0" +
        "&status=ENQUIRY&empId=" +
        userData.employeeId;
      dispatch(getEnquiryList(endUrl));
    }
  };

  const proceedToCancelEnquiry = () => {
    if (dropRemarks.length === 0 || dropReason.length === 0) {
      showToastRedAlert("Please enter details for drop");
      return;
    }

    if (!selector.enquiry_details_response) {
      return;
    }

    let enquiryDetailsObj = { ...selector.enquiry_details_response };
    let dmsLeadDto = { ...enquiryDetailsObj.dmsLeadDto };
    // dmsLeadDto.leadStatus = "ENQUIRYCOMPLETED";
    dmsLeadDto.leadStage = "DROPPED";
    enquiryDetailsObj.dmsLeadDto = dmsLeadDto;

    let leadId = selector.enquiry_details_response.dmsLeadDto.id;
    if (!leadId) {
      showToast("lead id not found");
      return;
    }

    const payload = {
      dmsLeadDropInfo: {
        additionalRemarks: dropRemarks,
        branchId: Number(selector.selectedBranchId ?? selectedBranchId),
        brandName: dropBrandName,
        dealerName: dropDealerName,
        location: dropLocation,
        model: dropModel,
        leadId: leadId,
        // crmUniversalId: universalId,
        lostReason: dropReason,
        lostSubReason: dropSubReason,
        organizationId: userData.orgId,
        otherReason: "",
        droppedBy: userData.employeeId,
        stage: "ENQUIRY",
        status: "ENQUIRY",
      },
    };
    setTypeOfActionDispatched("DROP_ENQUIRY");
    dispatch(dropEnquiryApi(payload));
    dispatch(updateEnquiryDetailsApi(enquiryDetailsObj));
  };

  useEffect(() => {
    if (
      selector.enquiry_drop_response_status === "success" &&
      selector.refNo !== ""
    ) {
      Alert.alert("Sent For Approval", `Enquiry Number: ${selector.refNo}`, [
        {
          text: "OK",
          onPress: () => {
            goToLeadScreen();
          },
        },
      ]);
    }
  }, [selector.enquiry_drop_response_status, selector.refNo]);

  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();
    setIsMultipleSelection(false);
    switch (key) {
      case "ENQUIRY_SEGMENT":
        if (selector.enquiry_type_list?.length === 0) {
          showToast("No Enquiry Types found");
          return;
        }
        let eData = selector.enquiry_type_list;
        let eNewData = eData?.map((val) => ({
          ...val,
          name: val?.segment_type || "",
        }));
        setDataForDropDown([...eNewData]);
        break;
      case "CUSTOMER_TYPE":
        if (selector.customer_types_data?.length === 0) {
          showToast("No Customer Types found");
          return;
        }
        let cData = selector.customer_types_data;
        let cNewData = cData.map((val) => ({
          ...val,
          name: val?.customer_type || "",
        }));
        setDataForDropDown([...cNewData]);
        break;
      case "SOURCE_OF_ENQUIRY":
        if (homeSelector.source_of_enquiry_list.length === 0) {
          showToast("No data found");
          return;
        } else {
        }
        setDataForDropDown([...homeSelector.source_of_enquiry_list]);
        break;
      case "SUB_SOURCE_OF_ENQUIRY":
        setDataForDropDown([...subSourceData]);
        break;
      case "ENQUIRY_CATEGORY":
        setDataForDropDown([...Enquiry_Category_Type_Data]);
        break;
      case "BUYER_TYPE":
        setDataForDropDown([...Buyer_Type_Data]);
        break;
      case "KMS_TRAVELLED":
        setDataForDropDown([...Kms_Travelled_Type_Data]);
        break;
      case "WHO_DRIVES":
        setDataForDropDown([...Who_Drive_Type_Data]);
        break;
      case "MEMBERS":
        setDataForDropDown([...How_Many_Family_Members_Data]);
        break;
      case "PRIME_EXPECTATION_CAR":
        setDataForDropDown([...Prime_Exception_Types_Data]);
        break;
      case "SALUTATION":
        setDataForDropDown([...Salutation_Types]);
        break;
      case "GENDER":
        setDataForDropDown([...Gender_Types]);
        break;
      case "RELATION":
        setDataForDropDown([...selector.relation_types_data]);
        break;
      case "MODEL":
        setDataForDropDown([...carModelsData]);
        break;
      case "VARIENT":
        setDataForDropDown([...selectedCarVarientsData.varientListForDropDown]);
        break;
      case "COLOR":
        setDataForDropDown([...carColorsData]);
        break;
      case "RETAIL_FINANCE":
        setDataForDropDown([...Finance_Types]);
        break;
      case "FINANCE_CATEGORY":
        setDataForDropDown([...Finance_Category_Types]);
        break;
      case "BANK_FINANCE":
        setDataForDropDown([...financeBanksList]);
        break;
      case "APPROX_ANNUAL_INCOME":
        setDataForDropDown([...Approx_Auual_Income_Types]);
        break;
      case "C_MAKE":
        setDataForDropDown([...makerData]);
        break;
      case "C_MODEL":
        setDataForDropDown([...c_model_types]);
        break;
      case "C_FUEL_TYPE":
        setDataForDropDown([...Fuel_Types]);
        break;
      case "C_TRANSMISSION_TYPE":
        setDataForDropDown([...Transmission_Types]);
        break;
      case "R_MAKE":
        setDataForDropDown([...makerData]);
        break;
      case "R_MODEL":
        setDataForDropDown([...r_model_types]);
        break;
      case "R_FUEL_TYPE":
        setDataForDropDown([...Fuel_Types]);
        break;
      case "R_TRANSMISSION_TYPE":
        setDataForDropDown([...Transmission_Types]);
        break;
      case "R_INSURENCE_TYPE":
        setDataForDropDown([...Insurence_Types]);
        break;
      case "A_MAKE":
        setDataForDropDown([...All_Car_Brands]);
        break;
      case "A_MODEL":
        setDataForDropDown([...a_model_types]);
        break;
      case "RF_SOURCE":
        setDataForDropDown([...Referred_By_Source]);
        break;
      case "R_INSURENCE_COMPANY_NAME":
        setDataForDropDown([...insurenceCompayList]);
        break;
      case "SELECT_TAG":
        setIsMultipleSelection(true);
        setDataForDropDown(tagList);
        break;
      case "LOCATION":
        if (
          homeSelector?.filter_drop_down_data?.Location?.sublevels.length > 0
        ) {
          setDataForDropDown([
            ...homeSelector.filter_drop_down_data.Location.sublevels,
          ]);
        } else {
          showToast("No Locations found");
          return;
        }
        break;
      case "BRANCH":
        if (selector.branchList.length == 0) {
          showToast("No Branch found");
          return;
        }
        setDataForDropDown([...selector.branchList]);
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  const updateVariantModelsData = (
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
            id: item.varient_id,
            name: item.color,
          });
        });
        const obj = {
          fuelType: carModelObj.fuelType,
          transmissionType: carModelObj.transmission_type,
        };
        dispatch(updateFuelAndTransmissionType(obj));
        setCarColorsData([...newArray]);
      }
    }
  };

  const updateModelTypesForCustomerNeedAnalysis = (brandName, dropDownKey) => {
    let modelsData = [];
    makerData.forEach((item) => {
      if (item.otherMaker === brandName) {
        let newArr = item.othermodels;
        let finalArr = [];
        newArr.forEach((newItem) => {
          let newObj = {
            ...newItem,
            name: newItem.otherModel,
          };
          finalArr.push(newObj);
        });

        modelsData = finalArr;
      }
    });
    // alert("color")
    switch (dropDownKey) {
      case "C_MAKE":
        return set_c_model_types([...modelsData]);
      case "R_MAKE":
        return set_r_model_types([...modelsData]);
      case "A_MAKE":
        return set_a_model_types([...modelsData]);
    }
  };

  const uploadSelectedImage = async (selectedPhoto, keyId) => {
    const photoUri = selectedPhoto.uri;
    if (!photoUri) {
      return;
    }

    const formData = new FormData();
    const fileType = photoUri.substring(photoUri.lastIndexOf(".") + 1);
    const fileNameArry = photoUri
      .substring(photoUri.lastIndexOf("/") + 1)
      .split(".");
    // const fileName = fileNameArry.length > 0 ? fileNameArry[0] : "None";
    const fileName = uuid.v4();
    formData.append("file", {
      name: `${fileName}-.${fileType}`,
      type: `image/${fileType}`,
      uri: Platform.OS === "ios" ? photoUri.replace("file://", "") : photoUri,
      // randomNumber: userData.employeeId, //logedd in employeeID
    });
    formData.append("randomNumber", userData.employeeId);

    switch (keyId) {
      case "UPLOAD_PAN":
        formData.append("documentType", "pan");
        break;
      case "UPLOAD_ADHAR":
        formData.append("documentType", "aadhar");
        break;
      case "UPLOAD_REG_DOC":
        formData.append("documentType", "regNoD");
        break;
      case "UPLOAD_INSURENCE":
        formData.append("documentType", "insurance");
        break;
      case "UPLOAD_EMPLOYEE_ID":
        formData.append("documentType", "employeeId");
        break;
      case "UPLOAD_3_MONTHS_PAYSLIP":
        formData.append("documentType", "payslips");
        break;
      case "UPLOAD_PATTA_PASS_BOOK":
        formData.append("documentType", "pattaPassBook");
        break;
      case "UPLOAD_PENSION_LETTER":
        formData.append("documentType", "pensionLetter");
        break;
      case "UPLOAD_IMA_CERTIFICATE":
        formData.append("documentType", "imaCertificate");
        break;
      case "UPLOAD_LEASING_CONFIRMATION":
        formData.append("documentType", "leasingConfirmationLetter");
        break;
      case "UPLOAD_ADDRESS_PROOF":
        formData.append("documentType", "address");
        break;
      default:
        formData.append("documentType", "default");
        break;
    }
    await fetch(URL.UPLOAD_RANDOM_DOCUMENT(), {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + authToken,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          if (keyId === "UPLOAD_REG_DOC") {
            dispatch(
              setReplacementBuyerDetails({
                key: "R_REG_DOC_KEY",
                text: response.keyName,
              })
            );
            dispatch(
              setReplacementBuyerDetails({
                key: "R_REG_DOC_PATH",
                text: response.documentPath,
              })
            );
          } else if (keyId === "UPLOAD_INSURENCE") {
            dispatch(
              setReplacementBuyerDetails({
                key: "R_INS_DOC_KEY",
                text: response.keyName,
              })
            );
            dispatch(
              setReplacementBuyerDetails({
                key: "R_INS_DOC_PATH",
                text: response.documentPath,
              })
            );
          } else {
            const dataObj = { ...uploadedImagesDataObj };
            dataObj[response.documentType] = response;
            setUploadedImagesDataObj({ ...dataObj });
          }
        }
      })
      .catch((error) => {
        showToastRedAlert(
          error.message ? error.message : "Something went wrong"
        );
        console.error("error", error);
      });
  };

  const deteleButtonPressed = (from) => {
    const imagesDataObj = { ...uploadedImagesDataObj };
    switch (from) {
      case "PAN":
        delete imagesDataObj.pan;
        break;
      case "AADHAR":
        delete imagesDataObj.aadhar;
        break;
      case "regNoD":
        dispatch(
          setReplacementBuyerDetails({
            key: "R_REG_DOC_KEY",
            text: "",
          })
        );
        dispatch(
          setReplacementBuyerDetails({
            key: "R_REG_DOC_PATH",
            text: "",
          })
        );
        break;
      case "INSURENCE":
        delete imagesDataObj.insurance;
        dispatch(
          setReplacementBuyerDetails({
            key: "R_INS_DOC_KEY",
            text: "",
          })
        );
        dispatch(
          setReplacementBuyerDetails({
            key: "R_INS_DOC_PATH",
            text: "",
          })
        );
        break;
      case "EMPLOYEE_ID":
        delete imagesDataObj.employeeId;
        break;
      case "3_MONTHS_PAYSLIP":
        delete imagesDataObj.payslips;
        break;
      case "PATTA_PASS_BOOK":
        delete imagesDataObj.pattaPassBook;
        break;
      case "PENSION_LETTER":
        delete imagesDataObj.pensionLetter;
        break;
      case "IMA_CERTIFICATE":
        delete imagesDataObj.imaCertificate;
        break;
      case "LEASING_CONFIRMATION":
        delete imagesDataObj.leasingConfirmationLetter;
        break;
      case "ADDRESS_PROOF":
        delete imagesDataObj.address;
        break;
      default:
        break;
    }
    setUploadedImagesDataObj({ ...imagesDataObj });
  };

  const DisplaySelectedImage = ({ fileName, from }) => {
    return (
      <View style={styles.selectedImageBckVw}>
        <Text style={styles.selectedImageTextStyle} numberOfLines={1}>
          {fileName}
        </Text>
        <IconButton
          icon="close-circle-outline"
          color={Colors.RED}
          style={{ padding: 0, margin: 0 }}
          size={15}
          onPress={() => deteleButtonPressed(from)}
        />
      </View>
    );
  };
  const navigateToProforma = () => {
    navigation.navigate(AppNavigator.EmsStackIdentifiers.ProformaScreen, {
      modelDetails: selector.dmsLeadProducts[0],
      branchId: selectedBranchId,
      // universalId: universalId,
    });
  };
  const updateAddressDetails = (pincode) => {
    if (pincode.length != 6) {
      return;
    }

    PincodeDetailsNew(pincode).then(
      (res) => {
        // dispatch an action to update address
        let tempAddr = [];
        if (res) {
          if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              tempAddr.push({ label: res[i].Name, value: res[i] });
              if (i === res.length - 1) {
                setAddressData([...tempAddr]);
              }
            }
          }
        }
        // dispatch(updateAddressByPincode(resolve));
      },
      (rejected) => {}
    );
  };

  const updateAddressDetails2 = (pincode) => {
    if (pincode.length != 6) {
      return;
    }

    PincodeDetailsNew(pincode).then(
      (res) => {
        // dispatch an action to update address
        let tempAddr = [];
        if (res) {
          if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              tempAddr.push({ label: res[i].Name, value: res[i] });
              if (i === res.length - 1) {
                setAddressData2([...tempAddr]);
              }
            }
          }
        }
        // dispatch(updateAddressByPincode(resolve));
      },
      (rejected) => {}
    );
  };

  const emiCal = (principle, tenure, interestRate) => {
    const amount = emiCalculator(principle, tenure, interestRate);
    dispatch(setFinancialDetails({ key: "EMI", text: amount }));
  };

  if (!componentAppear) {
    return (
      <View style={styles.initialContainer}>
        <AnimLoaderComp visible={true} />
      </View>
    );
  }

  const isPermanent = () => {
    if (
      selector?.p_pincode == selector?.pincode &&
      selector?.p_houseNum == selector?.houseNum &&
      selector?.p_streetName == selector?.streetName &&
      selector?.p_village == selector?.village &&
      selector?.p_mandal == selector?.mandal &&
      selector?.p_city == selector?.city &&
      selector?.p_district == selector?.district &&
      selector?.p_state == selector?.state
    ) {
      return "YES";
    } else {
      return "NO";
    }
  };
  const getEventListFromServer = (startDate, endDate) => {
    if (
      startDate === undefined ||
      startDate === null ||
      endDate === undefined ||
      endDate === null
    ) {
      return;
    }

    const payload = {
      startDate: startDate,
      endDate: endDate,
      empId: userData.employeeId,
      branchId: selector.selectedBranchId ?? userData.branchId,
      orgId: userData.orgId,
    };
    dispatch(getEventListApi(payload));
  };

  const getEventConfigListFromServer = (startDate, endDate) => {
    if (
      startDate === undefined ||
      startDate === null ||
      endDate === undefined ||
      endDate === null
    ) {
      return;
    }

    const payload = {
      startDate: startDate,
      endDate: endDate,
      empId: userData.employeeId,
      branchId: selector.selectedBranchId ?? userData.branchId,
      orgId: userData.orgId,
    };
    dispatch(getEventConfigList(payload));
  };

  const updateSubSourceData = (item) => {
    if (item.subsource && item.subsource.length > 0) {
      const updatedData = [];
      item.subsource.forEach((subItem, index) => {
        const newItem = { ...subItem };
        newItem.name = subItem.subSource;
        if (newItem.status === "Active") {
          updatedData.push(newItem);
        }
      });
      setSubSourceData(updatedData);
    } else {
      setSubSourceData([]);
    }
  };

  const getEmployeeListFromServer = async (sourceOfEnquiryId) => {
    const data = {
      sourceId: sourceOfEnquiryId,
      orgId: userData.orgId,
      branchId: selector.selectedBranchId ?? userData.branchId,
    };
    Promise.all([dispatch(getEmployeesListApi(data))]).then(async (res) => {});
  };

  const updateEmployee = (employeeObj) => {
    setSelectedEmployee(employeeObj.name);
    setEmployeeSelectModel(false);
  };

  const displayCreateEnquiryLeadAlert = async (data) => {
    Alert.alert(
      "Enquiry Created Successfully",
      "Enquiry Number: " + data,
      [
        {
          text: "OK",
          onPress: () => {
            goToLeadScreen();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const addSelectedEvent = () => {
    // todo add api call

    let findSelected = eventListdata.filter((item) => {
      if (item.isSelected === true) {
        return item;
      }
    });
    if (findSelected.length > 0) {
      setSelectedEventData(findSelected);
      setisEventListModalVisible(false);
    } else {
      showToast("Please select event");
    }
  };

  const eventListTableRow = (
    txt1,
    txt2,
    txt3,
    txt4,
    isDisplayRadio,
    isRadioSelected,
    isClickable,
    itemMain,
    index
  ) => {
    return (
      <>
        <TouchableOpacity
          style={styles.eventTouchable}
          disabled={isClickable}
          onPress={() => {
            // let temp = [...eventListdata].filter(item => item.id === itemMain.id).map(i => i.isSelected = true)
            let temp = eventListdata.map((i) =>
              i.id === itemMain.id
                ? { ...i, isSelected: true }
                : { ...i, isSelected: false }
            );

            seteventListData(temp);
          }}
        >
          {/* todo */}
          {isDisplayRadio ? (
            <Fontisto
              name={
                itemMain.isSelected ? "radio-btn-active" : "radio-btn-passive"
              }
              size={12}
              color={Colors.RED}
              style={{ marginEnd: 10 }}
            />
          ) : (
            <View style={{ marginEnd: 10, width: 12 }}>{}</View>
          )}

          <Text numberOfLines={1} style={styles.eventText}>
            {txt1}
          </Text>
          <Text numberOfLines={1} style={styles.eventText}>
            {txt2}
          </Text>
          <Text numberOfLines={1} style={styles.eventText}>
            {txt3}
          </Text>
          <Text numberOfLines={1} style={styles.eventText}>
            {txt4}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const addEventListModal = () => {
    return (
      <Modal
        animationType="fade"
        visible={isEventListModalVisible}
        onRequestClose={() => {}}
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
          <View style={styles.modelView}>
            <Text style={styles.selectTitle}>Select Event</Text>
            <ScrollView
              style={{
                width: "100%",
              }}
              horizontal={true}
            >
              <View style={{ flexDirection: "column" }}>
                <Text style={GlobalStyle.underline} />
                <View
                  style={{
                    height: 30,
                    borderBottomColor: "rgba(208, 212, 214, 0.7)",
                    borderBottomWidth: 2,
                  }}
                >
                  {eventListTableRow(
                    "Event Name",
                    "Event location",
                    "Start Date",
                    "End Date",
                    false,
                    false,
                    true,
                    0,
                    0
                  )}
                  {/* <Text style={GlobalStyle.underline} /> */}
                </View>
                <View>
                  <FlatList
                    key={"CATEGORY_LIST"}
                    data={eventListdata}
                    style={{ height: "80%" }}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => {
                      return (
                        <View
                          style={{ alignItems: "center", marginVertical: 20 }}
                        >
                          <Text>{"Data Not Available"}</Text>
                        </View>
                      );
                    }}
                    renderItem={({ item, index }) => {
                      return (
                        <>
                          <View
                            style={{
                              height: 35,
                              borderBottomColor: "rgba(208, 212, 214, 0.7)",
                              borderBottomWidth: 4,
                              marginTop: 5,
                            }}
                          >
                            {/* {eventListTableRow(item.eventName, item.eventLocation, item.Startdate, item.Enddate, true, false, false, item, index)} */}
                            {eventListTableRow(
                              item.name,
                              item.location,
                              moment(item.startdate).format("DD-MM-YYYY"),
                              moment(item.enddate).format("DD-MM-YYYY"),
                              true,
                              false,
                              false,
                              item,
                              index
                            )}
                          </View>
                        </>
                      );
                    }}
                  />
                </View>
              </View>
            </ScrollView>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-end",
                marginTop: 10,
              }}
            >
              <Button
                mode="contained"
                style={{ flex: 1, marginRight: 10 }}
                color={Colors.GRAY}
                labelStyle={{ textTransform: "none" }}
                onPress={() => setisEventListModalVisible(false)}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                style={{ flex: 1 }}
                color={Colors.PINK}
                labelStyle={{ textTransform: "none" }}
                onPress={() => addSelectedEvent()}
              >
                Add
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const onDropDownClear = (key) => {
    if (key) {
      dispatch(
        setDropDownData({
          key: key,
          value: "",
          id: "",
        })
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>
      <DuplicateMobileModel
        duplicateMobileModelVisible={duplicateMobileModelVisible}
        onRequestClose={() => {
          setDuplicateMobileModelVisible(false);
          setDuplicateMobileErrorData("");
        }}
        duplicateMobileErrorData={duplicateMobileErrorData}
      />

      <SelectEmployeeComponant
        visible={showEmployeeSelectModel}
        headerTitle={"Select Employee"}
        data={employeesData}
        selectedEmployee={(employee) => updateEmployee(employee)}
        onRequestClose={() => {
          setDisabled(false);
          setEmployeeSelectModel(false);
        }}
      />
      <ImagePickerComponent
        visible={selector.showImagePicker}
        keyId={selector.imagePickerKeyId}
        selectedImage={(data, keyId) => {
          uploadSelectedImage(data, keyId);
        }}
        onDismiss={() => dispatch(setImagePicker(""))}
      />

      <DropDownComponant
        multiple={isMultipleSelection}
        visible={showDropDownModel}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          if (isMultipleSelection) {
            setTagList([...item]);
            let names = [];
            let selectedNames = [];

            if (item.length > 0) {
              setIsSubmitPress(false);
              item.forEach((obj) => {
                if (obj.selected != undefined && obj.selected == true) {
                  names.push(obj.name);
                }
              });
              selectedNames = names?.join(", ");
            } else {
              setIsSubmitPress(true);
            }

            setSelectedTags(selectedNames);
            setShowDropDownModel(false);
          } else {
            if (dropDownKey === "MODEL") {
              updateVariantModelsData(item.name, false);
            } else if (dropDownKey === "VARIENT") {
              updateColorsDataForSelectedVarient(
                item.name,
                selectedCarVarientsData.varientList
              );
            } else if (
              dropDownKey === "C_MAKE" ||
              dropDownKey === "R_MAKE" ||
              dropDownKey === "A_MAKE"
            ) {
              updateModelTypesForCustomerNeedAnalysis(item.name, dropDownKey);
            }

            if (
              dropDownKey === "RETAIL_FINANCE" &&
              selector.retail_finance !== item.name
            ) {
              dispatch(
                setFinancialDetails({ key: "BANK_R_FINANCE_NAME", text: "" })
              );
              dispatch(setFinancialDetails({ key: "LOAN_AMOUNT", text: "" }));
              dispatch(
                setFinancialDetails({ key: "RATE_OF_INTEREST", text: "" })
              );
            }
            if (dropDownKey === "SOURCE_OF_ENQUIRY") {
              setSelectedEventData([]);
              if (item.name === "Events") {
                const startOfMonth = moment()
                  .startOf("month")
                  .format("YYYY-MM-DD");
                const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
                getEventConfigListFromServer(startOfMonth, endOfMonth);
              }
              if (item.name === "Event") {
                getEventListFromServer();
              }
              getEmployeeListFromServer(item.id);
              setSourceData(item.id);
              updateSubSourceData(item);
            }
            if (dropDownKey === "SUB_SOURCE_OF_ENQUIRY") {
              setSubSourceId(item.id);
            }
            setShowDropDownModel(false);
            dispatch(
              setDropDownData({
                key: dropDownKey,
                value: item.name,
                id: item.id,
                orgId: userData.orgId,
              })
            );
          }
        }}
      />

      {addEventListModal()}

      {/* {selector.showDatepicker && (
        <DatePickerComponent
          visible={selector.showDatepicker}
          mode={"date"}
          value={new Date(Date.now())}
          minimumDate={selector.minDate}
          maximumDate={selector.maxDate}
          onChange={(event, selectedDate) => {
            if (Platform.OS === "android") {
              if (!selectedDate) {
                dispatch(
                  updateSelectedDate({ key: "NONE", text: selectedDate })
                );
              } else {
                dispatch(updateSelectedDate({ key: "", text: selectedDate }));
              }
            } else {
              dispatch(updateSelectedDate({ key: "", text: selectedDate }));
            }
          }}
          onRequestClose={() => dispatch(setDatePicker())}
        />
      )} */}

      {/* {selector.showDatepicker && ( */}
      <DatePickerComponent
        visible={selector.showDatepicker}
        mode={"date"}
        value={new Date(Date.now())}
        minimumDate={selector.minDate}
        maximumDate={selector.maxDate}
        onChange={(event, selectedDate) => {
          if (Platform.OS === "android") {
            if (!selectedDate) {
              dispatch(updateSelectedDate({ key: "NONE", text: selectedDate }));
            } else {
              dispatch(updateSelectedDate({ key: "", text: selectedDate }));
            }
          } else {
            dispatch(updateSelectedDate({ key: "", text: selectedDate }));
          }
        }}
        onRequestClose={() => dispatch(setDatePicker())}
      />
      {/* )} */}

      {/* <View style={styles.view1}>
        <Text style={styles.titleText}>{"Details Overview"}</Text>
        <IconButton
          icon={selector.enableEdit ? "account-edit" : "account-edit-outline"}
          color={Colors.DARK_GRAY}
          size={30}
          style={{ paddingRight: 0 }}
          onPress={() => dispatch(setEditable())}
        />
      </View> */}

      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
        }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 10,
            paddingHorizontal: 5,
          }}
          keyboardShouldPersistTaps={"handled"}
          style={{ flex: 1 }}
          ref={scrollRef}
        >
          <View style={styles.baseVw}>
            {/*}       {(leadStatus === 'ENQUIRYCOMPLETED' && leadStage === 'ENQUIRY' && carModelsList && carModelsList.length > 0) ? <Button style={{ height: 40, width: 200, marginBottom: 15, alignSelf: 'flex-end', alignContent: 'center', backgroundColor: Colors.PINK, color: Colors.WHITE }}
              labelStyle={{ textTransform: "none", fontSize: 16, color: Colors.WHITE }}
              onPress={() => navigateToProforma()}>Proforma Invoice</Button> : null}


           {(leadStatus === 'ENQUIRYCOMPLETED' && leadStage === 'ENQUIRY' && carModelsList && carModelsList.length > 0) ?
            <Button style={{height:40, width:200,marginBottom:15, alignSelf:'flex-end', alignContent:'center', backgroundColor:Colors.PINK, color: Colors.WHITE}}
              labelStyle={{ textTransform: "none",fontSize:16, color: Colors.WHITE }}
        onPress={()=> navigateToProforma()}>Proforma Invoice</Button> : null}
        */}

            <List.AccordionGroup
              expandedId={openAccordian}
              onAccordionPress={(expandedId) => updateAccordian(expandedId)}
            >
              {/* {leadStatus === "ENQUIRYCOMPLETED" && leadStage === "ENQUIRY" ? (
                <List.Accordion
                  id={"10"}
                  title={"Proforma Invoice"}
                  titleStyle={{
                    color: openAccordian === "10" ? Colors.BLACK : Colors.BLACK,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  style={[
                    {
                      backgroundColor:
                        openAccordian === "10" ? Colors.RED : Colors.WHITE,
                      height: 60,
                      // justifyContent: 'center'
                    },
                    styles.accordianBorder,
                  ]}
                >
                  <ProformaComp
                    route={route}
                    userData={userData}
                    modelDetails={selector.dmsLeadProducts[0]}
                    branchId={selectedBranchId}
                    universalId={route.params.universalId}
                  />
                </List.Accordion>
              ) : null}
              <View style={styles.space}></View> */}

              {/* 1. Personal Intro */}
              <List.Accordion
                id={"2"}
                title="Personal Info"
                titleStyle={{
                  color: openAccordian === "2" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "2" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View style={styles.view3}>
                  <View
                    style={{
                      width:
                        selector.enquiry_segment.toLowerCase() === "personal"
                          ? "45%"
                          : "100%",
                    }}
                  >
                    <DropDownSelectionItem
                      label={"Salutation"}
                      value={selector.salutation}
                      onPress={() =>
                        showDropDownModelMethod(
                          "SALUTATION",
                          "Select Salutation"
                        )
                      }
                      clearOption={true}
                      clearKey={"SALUTATION"}
                      onClear={onDropDownClear}
                    />
                    <Text style={GlobalStyle.underline} />
                  </View>
                  <View style={{ width: "45%" }}>
                    {selector.enquiry_segment.toLowerCase() === "personal" ? (
                      <>
                        <DropDownSelectionItem
                          label={"Gender*"}
                          value={selector.gender}
                          onPress={() =>
                            showDropDownModelMethod("GENDER", "Gender")
                          }
                        />

                        <Text
                          style={[
                            GlobalStyle.underline,
                            {
                              backgroundColor:
                                isSubmitPress && selector.gender === ""
                                  ? "red"
                                  : "rgba(208, 212, 214, 0.7)",
                            },
                          ]}
                        ></Text>
                      </>
                    ) : null}
                  </View>
                </View>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.firstName}
                  label={"First Name*"}
                  autoCapitalize="words"
                  keyboardType={"default"}
                  // editable={false}
                  onChangeText={(text) =>
                    dispatch(
                      setPersonalIntro({ key: "FIRST_NAME", text: text })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.firstName === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.lastName}
                  label={"Last Name*"}
                  // editable={false}
                  autoCapitalize={"words"}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(setPersonalIntro({ key: "LAST_NAME", text: text }))
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.lastName === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>

                <View style={styles.view3}>
                  <View style={{ width: "45%" }}>
                    <DropDownSelectionItem
                      label={"Relation"}
                      value={selector.relation}
                      onPress={() => {
                        showDropDownModelMethod("RELATION", "Relation");
                      }}
                      clearOption={true}
                      clearKey={"RELATION"}
                      onClear={onDropDownClear}
                    />
                  </View>
                  <View style={{ width: "45%" }}>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.relationName}
                      label={"Relation Name"}
                      autoCapitalize="words"
                      keyboardType={"default"}
                      maxLength={50}
                      onChangeText={(text) =>
                        dispatch(
                          setPersonalIntro({ key: "RELATION_NAME", text: text })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                </View>

                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.mobile}
                  label={"Mobile Number*"}
                  editable={true}
                  maxLength={10}
                  keyboardType={"phone-pad"}
                  onChangeText={(text) =>
                    dispatch(setPersonalIntro({ key: "MOBILE", text: text }))
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.mobile === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.alterMobile}
                  label={"Alternate Mobile Number"}
                  editable={true}
                  keyboardType={"phone-pad"}
                  maxLength={10}
                  onChangeText={(text) =>
                    dispatch(
                      setPersonalIntro({ key: "ALTER_MOBILE", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.email}
                  label={"Email ID"}
                  editable={true}
                  keyboardType={"email-address"}
                  onChangeText={(text) =>
                    dispatch(setPersonalIntro({ key: "EMAIL", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>

                {selector.enquiry_segment.toLowerCase() == "personal" ? (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: Colors.WHITE,
                      }}
                    >
                      <View style={{ width: "45%" }}>
                        <DateSelectItem
                          label={"Date Of Birth"}
                          value={selector.dateOfBirth}
                          onPress={() =>
                            dispatch(setDatePicker("DATE_OF_BIRTH"))
                          }
                        />
                      </View>
                      <View style={{ width: "45%" }}>
                        <TextinputComp
                          style={styles.textInputStyle}
                          value={selector?.age?.toString()}
                          label={"Age"}
                          keyboardType={"phone-pad"}
                          maxLength={5}
                          onChangeText={(text) =>
                            dispatch(
                              setPersonalIntro({ key: "AGE", text: text })
                            )
                          }
                        />
                        <Text style={GlobalStyle.underline}></Text>
                      </View>
                    </View>
                    <DateSelectItem
                      label={"Anniversary Date"}
                      value={selector.anniversaryDate}
                      onPress={() =>
                        dispatch(setDatePicker("ANNIVERSARY_DATE"))
                      }
                    />
                  </View>
                ) : null}
              </List.Accordion>
              <View style={styles.space}></View>

              {/* Select Location & Dealer Code */}
              <List.Accordion
                id={"11"}
                title="Select Location & Dealer Code"
                titleStyle={{
                  color: openAccordian === "11" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "11" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <DropDownSelectionItem
                  label={"Location*"}
                  value={selector.selectedLocation}
                  disabled={isLocationDisabled}
                  onPress={() =>
                    showDropDownModelMethod("LOCATION", "Select Location")
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.selectedLocation === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <DropDownSelectionItem
                  label={"Branch*"}
                  value={selector.selectedBranch}
                  onPress={() =>
                    showDropDownModelMethod("BRANCH", "Select Branch")
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.selectedBranch === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
              </List.Accordion>
              <View style={styles.space}></View>

              {/* 2.Customer Profile */}
              {selector.selectedBranch ? (
                <>
                  <List.Accordion
                    id={"1"}
                    title={"Customer Profile"}
                    titleStyle={{
                      color:
                        openAccordian === "1" ? Colors.BLACK : Colors.BLACK,
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                    style={[
                      {
                        backgroundColor:
                          openAccordian === "1" ? Colors.RED : Colors.WHITE,
                        height: 60,
                        // justifyContent: 'center'
                      },
                      styles.accordianBorder,
                    ]}
                  >
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.occupation}
                      autoCapitalize="words"
                      label={"Occupation"}
                      keyboardType={"default"}
                      maxLength={40}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerProfile({ key: "OCCUPATION", text: text })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.designation}
                      autoCapitalize="words"
                      label={"Designation"}
                      keyboardType={"default"}
                      maxLength={40}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerProfile({ key: "DESIGNATION", text: text })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline} />

                    <DropDownSelectionItem
                      label={"Enquiry Segment*"}
                      // disabled={!selector.enableEdit}
                      value={selector.enquiry_segment}
                      onPress={() =>
                        showDropDownModelMethod(
                          "ENQUIRY_SEGMENT",
                          "Select Enquiry Segment"
                        )
                      }
                    />
                    <Text
                      style={[
                        GlobalStyle.underline,
                        {
                          backgroundColor:
                            isSubmitPress && selector.enquiry_segment === ""
                              ? "red"
                              : "rgba(208, 212, 214, 0.7)",
                        },
                      ]}
                    ></Text>
                    <DropDownSelectionItem
                      label={"Customer Type*"}
                      disabled={
                        selector.enquiry_segment.length > 0 ? false : true
                      }
                      value={selector.customer_type}
                      onPress={() =>
                        showDropDownModelMethod(
                          "CUSTOMER_TYPE",
                          "Select Customer Type"
                        )
                      }
                    />
                    <Text
                      style={[
                        GlobalStyle.underline,
                        {
                          backgroundColor:
                            isSubmitPress && selector.customer_type === ""
                              ? "red"
                              : "rgba(208, 212, 214, 0.7)",
                        },
                      ]}
                    ></Text>
                    {selector.customer_type.toLowerCase() === "fleet" ||
                    selector.customer_type.toLowerCase() === "institution" ||
                    selector.customer_type.toLowerCase() === "corporate" ||
                    selector.customer_type.toLowerCase() === "government" ||
                    selector.customer_type.toLowerCase() === "retired" ||
                    selector.customer_type.toLowerCase() === "other" ? (
                      <View>
                        <TextinputComp
                          style={styles.textInputStyle}
                          value={selector.company_name}
                          label={"Company Name"}
                          autoCapitalize="words"
                          keyboardType={"default"}
                          maxLength={50}
                          onChangeText={(text) =>
                            dispatch(
                              setCustomerProfile({
                                key: "COMPANY_NAME",
                                text: text,
                              })
                            )
                          }
                        />
                        <Text style={GlobalStyle.underline}></Text>
                      </View>
                    ) : null}
                    <View>
                      <DropDownSelectionItem
                        label={"Source Of Enquiry*"}
                        value={selector.source_of_enquiry}
                        onPress={() =>
                          showDropDownModelMethod(
                            "SOURCE_OF_ENQUIRY",
                            "Source Of Enquiry"
                          )
                        }
                      />
                      <Text
                        style={[
                          GlobalStyle.underline,
                          {
                            backgroundColor:
                              isSubmitPress && selector.source_of_enquiry === ""
                                ? "red"
                                : "rgba(208, 212, 214, 0.7)",
                          },
                        ]}
                      ></Text>
                    </View>
                    {/* <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.source_of_enquiry}
                  label={"Source Of Enquiry*"}
                  editable={true}
                /> */}
                    <Text style={GlobalStyle.underline}></Text>

                    {selector.source_of_enquiry.toLowerCase() === "event" && (
                      <View>
                        <TextinputComp
                          style={styles.textInputStyle}
                          value={selector.event_code}
                          label={"Event Code"}
                          editable={false}
                        />
                        <Text style={GlobalStyle.underline}></Text>
                      </View>
                    )}

                    {/* {(selector.source_of_enquiry
                  .toLowerCase()
                  .trim()
                  .replace(/ /g, "") === "digitalmarketing" ||
                  selector.source_of_enquiry
                    .toLowerCase()
                    .trim()
                    .replace(/ /g, "") === "socialnetwork") && ( */}
                    {selector.source_of_enquiry.length !== 0 && (
                      <View>
                        <DropDownSelectionItem
                          label={"Sub Source Of Enquiry*"}
                          disabled={false}
                          value={selector.sub_source_of_enquiry}
                          onPress={() =>
                            showDropDownModelMethod(
                              "SUB_SOURCE_OF_ENQUIRY",
                              "Sub Source Of Enquiry"
                            )
                          }
                        />
                        <Text
                          style={[
                            GlobalStyle.underline,
                            {
                              backgroundColor:
                                isSubmitPress &&
                                selector.sub_source_of_enquiry === ""
                                  ? "red"
                                  : "rgba(208, 212, 214, 0.7)",
                            },
                          ]}
                        ></Text>
                      </View>
                    )}
                    {/* )} */}

                    {selector.source_of_enquiry.toLowerCase() ===
                      "reference" && (
                      <View>
                        <TextinputComp
                          style={styles.textInputStyle}
                          value={selector.rf_by_first_name}
                          label={"Referred BY First Name"}
                          keyboardType={"default"}
                          onChangeText={(text) =>
                            dispatch(
                              setCustomerProfile({
                                key: "RF_FIRST_NAME",
                                text: text,
                              })
                            )
                          }
                        />
                        <Text style={GlobalStyle.underline}></Text>
                        <TextinputComp
                          style={styles.textInputStyle}
                          value={selector.rf_by_last_name}
                          label={"Referred BY Last Name"}
                          keyboardType={"default"}
                          onChangeText={(text) =>
                            dispatch(
                              setCustomerProfile({
                                key: "RF_LAST_NAME",
                                text: text,
                              })
                            )
                          }
                        />
                        <Text style={GlobalStyle.underline}></Text>
                        <TextinputComp
                          style={styles.textInputStyle}
                          value={selector.rf_by_mobile}
                          label={"Referred BY Mobile"}
                          keyboardType={"number-pad"}
                          maxLength={10}
                          onChangeText={(text) =>
                            dispatch(
                              setCustomerProfile({
                                key: "RF_MOBILE",
                                text: text,
                              })
                            )
                          }
                        />
                        <Text style={GlobalStyle.underline}></Text>
                        <DropDownSelectionItem
                          label={"Referred BY Source"}
                          value={selector.rf_by_source}
                          onPress={() =>
                            showDropDownModelMethod(
                              "RF_SOURCE",
                              "Referred BY Source"
                            )
                          }
                          clearOption={true}
                          clearKey={"RF_SOURCE"}
                          onClear={onDropDownClear}
                        />
                        <TextinputComp
                          style={styles.textInputStyle}
                          value={selector.rf_by_source_location}
                          label={"Referred BY Source Location"}
                          keyboardType={"default"}
                          onChangeText={(text) =>
                            dispatch(
                              setCustomerProfile({
                                key: "RF_SOURCE_LOCATION",
                                text: text,
                              })
                            )
                          }
                        />
                        <Text style={GlobalStyle.underline}></Text>
                      </View>
                    )}

                    <DateSelectItem
                      label={"Expected Delivery Date*"}
                      value={
                        selector.expected_delivery_date
                          ? moment(
                              new Date(Number(selector.expected_delivery_date))
                            ).format("DD/MM/YYYY")
                          : moment().format("DD/MM/YYYY")
                      }
                      onPress={() =>
                        dispatch(setDatePicker("EXPECTED_DELIVERY_DATE"))
                      }
                    />

                    <DropDownSelectionItem
                      label={"Enquiry Category*"}
                      disabled={true}
                      value={
                        selector.enquiry_category.length == 0
                          ? "Hot"
                          : selector.enquiry_category
                      }
                      onPress={() =>
                        showDropDownModelMethod(
                          "ENQUIRY_CATEGORY",
                          "Enquiry Category"
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <DropDownSelectionItem
                      label={"Select Tag"}
                      value={selectedTags}
                      onPress={() => {
                        showDropDownModelMethod("SELECT_TAG", "Select Tag");
                      }}
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <DropDownSelectionItem
                      label={"Buyer Type*"}
                      value={selector.buyer_type}
                      onPress={() =>
                        showDropDownModelMethod("BUYER_TYPE", "Buyer Type")
                      }
                    />
                    <Text
                      style={[
                        GlobalStyle.underline,
                        {
                          backgroundColor:
                            isSubmitPress && selector.buyer_type === ""
                              ? "red"
                              : "rgba(208, 212, 214, 0.7)",
                        },
                      ]}
                    ></Text>
                    <DropDownSelectionItem
                      label={"KMs Travelled in Month"}
                      value={selector.kms_travelled_month}
                      onPress={() =>
                        showDropDownModelMethod(
                          "KMS_TRAVELLED",
                          "KMs Travelled in Month"
                        )
                      }
                      clearOption={true}
                      clearKey={"KMS_TRAVELLED"}
                      onClear={onDropDownClear}
                    />

                    <DropDownSelectionItem
                      label={"Who Drives"}
                      value={selector.who_drives}
                      onPress={() =>
                        showDropDownModelMethod("WHO_DRIVES", "Who Drives")
                      }
                      clearOption={true}
                      clearKey={"WHO_DRIVES"}
                      onClear={onDropDownClear}
                    />

                    <DropDownSelectionItem
                      label={"How many members in your family?"}
                      value={selector.members}
                      onPress={() =>
                        showDropDownModelMethod(
                          "MEMBERS",
                          "How many members in your family?"
                        )
                      }
                      clearOption={true}
                      clearKey={"MEMBERS"}
                      onClear={onDropDownClear}
                    />

                    <DropDownSelectionItem
                      label={"What is prime expectation from the Vehicle?"}
                      value={selector.prime_expectation_from_car}
                      onPress={() =>
                        showDropDownModelMethod(
                          "PRIME_EXPECTATION_CAR",
                          "What is prime expectation from the Vehicle?"
                        )
                      }
                      clearOption={true}
                      clearKey={"PRIME_EXPECTATION_CAR"}
                      onClear={onDropDownClear}
                    />
                  </List.Accordion>
                  <View style={styles.space}></View>
                </>
              ) : null}

              {/* // 3.Communication Address */}
              <List.Accordion
                id={"3"}
                title={"Communication Address"}
                titleStyle={{
                  color: openAccordian === "3" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "3" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.pincode}
                  label={"Pincode*"}
                  maxLength={6}
                  keyboardType={"phone-pad"}
                  onChangeText={(text) => {
                    // get addreess by pincode
                    if (text.length === 6) {
                      updateAddressDetails(text);
                    }
                    dispatch(
                      setCommunicationAddress({ key: "PINCODE", text: text })
                    );
                    setDefaultAddress(null);
                  }}
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.pincode === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>

                {addressData.length > 0 && (
                  <>
                    <Text style={GlobalStyle.underline}></Text>
                    <View style={styles.addressDropDownRow}>
                      <Dropdown
                        style={[styles.dropdownContainer]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={addressData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={"Select address"}
                        searchPlaceholder="Search..."
                        value={defaultAddress}
                        // onFocus={() => setIsFocus(true)}
                        // onBlur={() => setIsFocus(false)}
                        onChange={(val) => {
                          dispatch(updateAddressByPincode(val.value));
                        }}
                      />

                      {selector.isAddressSet ? (
                        <IconButton
                          onPress={() => {
                            let tmp = addressData;
                            setAddressData([]);
                            setAddressData([...tmp]);
                            dispatch(updateAddressByPincode(""));
                          }}
                          icon="close-circle-outline"
                          color={Colors.BLACK}
                          size={20}
                          style={styles.addressClear}
                        />
                      ) : null}
                    </View>
                  </>
                )}
                <Text style={GlobalStyle.underline}></Text>
                <View style={styles.radioGroupBcVw}>
                  <RadioTextItem
                    label={"Urban"}
                    value={"urban"}
                    status={selector.urban_or_rural === 1 ? true : false}
                    onPress={() =>
                      dispatch(
                        setCommunicationAddress({
                          key: "RURAL_URBAN",
                          text: "1",
                        })
                      )
                    }
                  />
                  <RadioTextItem
                    label={"Rural"}
                    value={"rural"}
                    status={selector.urban_or_rural === 2 ? true : false}
                    onPress={() =>
                      dispatch(
                        setCommunicationAddress({
                          key: "RURAL_URBAN",
                          text: "2",
                        })
                      )
                    }
                  />
                </View>
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.houseNum}
                  label={"H.No"}
                  maxLength={50}
                  keyboardType={"number-pad"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "HOUSE_NO", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline} />
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.streetName}
                  label={"Street Name"}
                  autoCapitalize="words"
                  maxLength={120}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({
                        key: "STREET_NAME",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline} />
                {/* {selector.isAddressSet && ( */}
                <>
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.village}
                    label={"Village/Town"}
                    autoCapitalize="words"
                    maxLength={50}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setCommunicationAddress({
                          key: "VILLAGE",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline} />

                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.mandal}
                    label={"Mandal/Tahsil"}
                    autoCapitalize="words"
                    maxLength={50}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setCommunicationAddress({
                          key: "MANDAL",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline} />

                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.city}
                    label={"City"}
                    autoCapitalize="words"
                    maxLength={50}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setCommunicationAddress({ key: "CITY", text: text })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline} />
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.district}
                    label={"District"}
                    autoCapitalize="words"
                    maxLength={50}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setCommunicationAddress({
                          key: "DISTRICT",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline} />
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.state}
                    label={"State"}
                    autoCapitalize="words"
                    maxLength={50}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setCommunicationAddress({
                          key: "STATE",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline} />
                </>
                {/* )} */}
                <View
                  style={{ height: 20, backgroundColor: Colors.WHITE }}
                ></View>

                {/* // Permanent Addresss */}
                <View
                  style={{ backgroundColor: Colors.WHITE, paddingLeft: 12 }}
                >
                  <Text style={styles.permanentAddText}>
                    {"Permanent Address Same as Communication Address"}
                  </Text>
                </View>
                <View style={styles.radioGroupBcVw}>
                  <RadioTextItem
                    label={"Yes"}
                    value={"yes"}
                    status={
                      selector.is_permanent_address_same === "YES" ||
                      isPermanent() === "YES"
                        ? true
                        : false
                    }
                    onPress={() =>
                      dispatch(
                        setCommunicationAddress({
                          key: "PERMANENT_ADDRESS",
                          text: "true",
                        })
                      )
                    }
                  />
                  <RadioTextItem
                    label={"No"}
                    value={"no"}
                    status={
                      selector.is_permanent_address_same === "NO" ? true : false
                    }
                    onPress={() => {
                      dispatch(
                        setCommunicationAddress({
                          key: "PERMANENT_ADDRESS",
                          text: "false",
                        })
                      );
                      dispatch(clearPermanentAddr());
                    }}
                  />
                </View>
                <Text style={GlobalStyle.underline}></Text>

                {/* {selector.is_permanent_address_same === "NO" ? ( */}
                <View>
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.p_pincode}
                    label={"Pincode*"}
                    maxLength={6}
                    keyboardType={"phone-pad"}
                    onChangeText={(text) => {
                      if (text.length === 6) {
                        updateAddressDetails2(text);
                      }
                      dispatch(
                        dispatch(
                          setCommunicationAddress({
                            key: "P_PINCODE",
                            text: text,
                          })
                        )
                      );
                    }}
                  />
                  <Text
                    style={[
                      GlobalStyle.underline,
                      {
                        backgroundColor:
                          isSubmitPress && selector.p_pincode === ""
                            ? "red"
                            : "rgba(208, 212, 214, 0.7)",
                      },
                    ]}
                  ></Text>

                  {addressData2.length > 0 && (
                    <>
                      <View style={styles.addressDropDownRow}>
                        <Dropdown
                          style={[styles.dropdownContainer]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          iconStyle={styles.iconStyle}
                          data={addressData2}
                          search
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder={"Select address"}
                          searchPlaceholder="Search..."
                          // value={defaultAddress}
                          // onFocus={() => setIsFocus(true)}
                          // onBlur={() => setIsFocus(false)}
                          onChange={(val) => {
                            dispatch(updateAddressByPincode2(val.value));
                          }}
                        />
                        {selector.isAddressSet2 ? (
                          <IconButton
                            onPress={() => {
                              let tmp = addressData2;
                              setAddressData2([]);
                              setAddressData2([...tmp]);
                              dispatch(updateAddressByPincode2(""));
                            }}
                            icon="close-circle-outline"
                            color={Colors.BLACK}
                            size={20}
                            style={styles.addressClear}
                          />
                        ) : null}
                      </View>
                    </>
                  )}
                  <Text style={GlobalStyle.underline}></Text>
                  <View style={styles.radioGroupBcVw}>
                    <RadioTextItem
                      label={"Urban"}
                      value={"urban"}
                      status={selector.p_urban_or_rural === 1 ? true : false}
                      onPress={() =>
                        dispatch(
                          setCommunicationAddress({
                            key: "P_RURAL_URBAN",
                            text: "1",
                          })
                        )
                      }
                    />
                    <RadioTextItem
                      label={"Rural"}
                      value={"rural"}
                      status={selector.p_urban_or_rural === 2 ? true : false}
                      onPress={() =>
                        dispatch(
                          setCommunicationAddress({
                            key: "P_RURAL_URBAN",
                            text: "2",
                          })
                        )
                      }
                    />
                  </View>
                  <Text style={GlobalStyle.underline}></Text>

                  <TextinputComp
                    style={styles.textInputStyle}
                    label={"H.No"}
                    // keyboardType={"number-pad"}
                    maxLength={50}
                    value={selector.p_houseNum}
                    onChangeText={(text) =>
                      dispatch(
                        setCommunicationAddress({
                          key: "P_HOUSE_NO",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline} />
                  <TextinputComp
                    style={styles.textInputStyle}
                    label={"Street Name"}
                    autoCapitalize="words"
                    keyboardType={"default"}
                    maxLength={50}
                    value={selector.p_streetName}
                    onChangeText={(text) =>
                      dispatch(
                        setCommunicationAddress({
                          key: "P_STREET_NAME",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.p_village}
                    label={"Village/Town"}
                    autoCapitalize="words"
                    maxLength={50}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setCommunicationAddress({
                          key: "P_VILLAGE",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline} />
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.p_mandal}
                    label={"Mandal"}
                    autoCapitalize="words"
                    maxLength={50}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setCommunicationAddress({
                          key: "P_MANDAL",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.p_city}
                    label={"City"}
                    autoCapitalize="words"
                    maxLength={50}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setCommunicationAddress({
                          key: "P_CITY",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline} />
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.p_district}
                    label={"District"}
                    autoCapitalize="words"
                    maxLength={50}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setCommunicationAddress({
                          key: "P_DISTRICT",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline} />
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.p_state}
                    label={"State"}
                    autoCapitalize="words"
                    maxLength={50}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setCommunicationAddress({
                          key: "P_STATE",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline} />
                </View>
                {/* ) : null} */}
              </List.Accordion>
              <View style={styles.space}></View>
              {/* // 4.Model Selection */}
              <List.Accordion
                id={"4"}
                title={"Model Selection"}
                titleStyle={{
                  color: openAccordian === "4" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "4" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                {/* <View style={{marginHorizontal:5}}> */}
                <TouchableOpacity
                  onPress={() => {
                    if (checkModelSelection()) {
                      scrollToPos(4);
                      setOpenAccordian("4");
                      return;
                    }

                    const carmodeldata = {
                      color: "",
                      fuel: "",
                      id: 0,
                      model: "",
                      transimmisionType: "",
                      variant: "",
                      isPrimary: "N",
                    };

                    let arr = [...carModelsList];
                    arr.push(carmodeldata);
                    setCarModelsList(arr);
                    //selector.dmsLeadProducts = [...selector.dmsLeadProducts, carmodeldata]
                  }}
                  style={styles.addmodelView}
                >
                  <Text style={styles.addmodelTxt}>Add Model</Text>
                </TouchableOpacity>
                <FlatList
                  //  style={{ height: faltListHeight }}
                  data={carModelsList}
                  extraData={carModelsList}
                  // keyExtractor={(item, index) => item.id.toString()}
                  renderItem={({ item, index }) => {
                    return (
                      // <Pressable onPress={() => selectedItem(item, index)}>
                      <View>
                        <ModelListitemCom
                          modelOnclick={modelOnclick}
                          isPrimaryOnclick={isPrimaryOnclick}
                          index={index}
                          item={item}
                          isSubmitPress={isSubmitPress}
                          isOnlyOne={carModelsList.length === 1 ? true : false}
                          onChangeSubmit={() => setIsSubmitPress(false)}
                        />

                        {/* <Divider /> */}
                      </View>
                      // </Pressable>
                    );
                  }}
                />
                {/* <DropDownSelectionItem
                    label={"Model*"}
                    value={selector.model}
                    onPress={() =>
                      showDropDownModelMethod("MODEL", "Select Model")
                    }
                  />
                  <Text style={[GlobalStyle.underline, { backgroundColor: isSubmitPress && selector.model === '' ? 'red' : 'rgba(208, 212, 214, 0.7)' }]}></Text>

                </View>

                <DropDownSelectionItem
                  label={"Variant*"}
                  value={selector.varient}
                  onPress={() =>
                    showDropDownModelMethod("VARIENT", "Select Variant")
                  }
                />
                <Text style={[GlobalStyle.underline, { backgroundColor: isSubmitPress && selector.varient === '' ? 'red' : 'rgba(208, 212, 214, 0.7)' }]}></Text>
                <DropDownSelectionItem
                  label={"Color*"}
                  value={selector.color}
                  onPress={() =>
                    showDropDownModelMethod("COLOR", "Select Color")
                  }
                />
                <Text style={[GlobalStyle.underline, { backgroundColor: isSubmitPress && selector.color === '' ? 'red' : 'rgba(208, 212, 214, 0.7)' }]}></Text>
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"Fuel Type"}
                  editable={false}
                  value={selector.fuel_type}
                />
                <Text style={[GlobalStyle.underline, { backgroundColor: isSubmitPress && selector.fuel_type === '' ? 'red' : 'rgba(208, 212, 214, 0.7)' }]}></Text>

                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"Transmission Type"}
                  editable={false}
                  value={selector.transmission_type}
                />
                <Text style={[GlobalStyle.underline, { backgroundColor: isSubmitPress && selector.transmission_type === '' ? 'red' : 'rgba(208, 212, 214, 0.7)' }]}></Text> */}
              </List.Accordion>
              <View style={styles.space}></View>
              {/* // 5. Financial Details*/}
              <List.Accordion
                id={"5"}
                title={"Finance Details"}
                titleStyle={{
                  color: openAccordian === "5" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "5" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <DropDownSelectionItem
                  label={"Retail Finance*"}
                  value={selector.retail_finance}
                  onPress={() =>
                    showDropDownModelMethod("RETAIL_FINANCE", "Retail Finance")
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.retail_finance === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                {selector.retail_finance === "Out House" ? (
                  <View>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Bank/Finance Name"}
                      keyboardType={"default"}
                      autoCapitalize="words"
                      value={selector.bank_or_finance_name}
                      onChangeText={(text) =>
                        dispatch(
                          setFinancialDetails({
                            key: "BANK_R_FINANCE_NAME",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Location"}
                      keyboardType={"default"}
                      autoCapitalize="words"
                      value={selector.location}
                      onChangeText={(text) =>
                        dispatch(
                          setFinancialDetails({ key: "LOCATION", text: text })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                ) : null}

                {selector.retail_finance === "Leasing" && (
                  <View>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Leasing Name"}
                      maxLength={50}
                      autoCapitalize="words"
                      value={selector.leashing_name}
                      onChangeText={(text) =>
                        dispatch(
                          setFinancialDetails({
                            key: "LEASHING_NAME",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}

                {selector.retail_finance === "In House" && (
                  <DropDownSelectionItem
                    label={"Finance Category"}
                    value={selector.finance_category}
                    onPress={() =>
                      showDropDownModelMethod(
                        "FINANCE_CATEGORY",
                        "Finance Category"
                      )
                    }
                    clearOption={true}
                    clearKey={"FINANCE_CATEGORY"}
                    onClear={onDropDownClear}
                  />
                )}

                {selector.retail_finance === "In House" && (
                  <View>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Down Payment"}
                      maxLength={10}
                      keyboardType={"numeric"}
                      value={selector.down_payment}
                      onChangeText={(text) =>
                        dispatch(
                          setFinancialDetails({
                            key: "DOWN_PAYMENT",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}

                {(selector.retail_finance === "In House" ||
                  selector.retail_finance === "Out House") && (
                  <View>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Loan Amount"}
                      keyboardType={"numeric"}
                      maxLength={10}
                      value={selector.loan_amount}
                      onChangeText={(text) => {
                        emiCal(
                          text,
                          selector.loan_of_tenure,
                          selector.rate_of_interest
                        );
                        dispatch(
                          setFinancialDetails({
                            key: "LOAN_AMOUNT",
                            text: text,
                          })
                        );
                      }}
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Rate of Interest"}
                      keyboardType={"numeric"}
                      maxLength={10}
                      value={selector.rate_of_interest?.toString()}
                      onChangeText={(text) => {
                        emiCal(
                          selector.loan_amount,
                          selector.loan_of_tenure,
                          text
                        );
                        dispatch(
                          setFinancialDetails({
                            key: "RATE_OF_INTEREST",
                            text: text,
                          })
                        );
                      }}
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}

                {selector.retail_finance === "In House" && (
                  <View>
                    <DropDownSelectionItem
                      label={"Bank/Financer"}
                      value={selector.bank_or_finance}
                      onPress={() =>
                        showDropDownModelMethod("BANK_FINANCE", "Bank/Financer")
                      }
                      clearOption={true}
                      clearKey={"BANK_FINANCE"}
                      onClear={onDropDownClear}
                    />

                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Loan of Tenure(Months)"}
                      keyboardType={"numeric"}
                      maxLength={3}
                      value={selector.loan_of_tenure?.toString()}
                      onChangeText={(text) => {
                        emiCal(
                          selector.loan_amount,
                          text,
                          selector.rate_of_interest
                        );
                        dispatch(
                          setFinancialDetails({
                            key: "LOAN_OF_TENURE",
                            text: text,
                          })
                        );
                      }}
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"EMI(Approximately)"}
                      keyboardType={"default"}
                      value={selector.emi}
                      onChangeText={(text) =>
                        dispatch(
                          setFinancialDetails({ key: "EMI", text: text })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <DropDownSelectionItem
                      label={"Approx Annual Income"}
                      value={selector.approx_annual_income}
                      onPress={() =>
                        showDropDownModelMethod(
                          "APPROX_ANNUAL_INCOME",
                          "Approx Annual Income"
                        )
                      }
                      clearOption={true}
                      clearKey={"APPROX_ANNUAL_INCOME"}
                      onClear={onDropDownClear}
                    />
                  </View>
                )}
              </List.Accordion>
              <View style={styles.space}></View>
              {/* // 6.Upload Documents */}
              <List.Accordion
                id={"6"}
                title={"Upload Documents"}
                titleStyle={{
                  color: openAccordian === "6" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "6" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.pan_number}
                  label={"Pan Number"}
                  keyboardType={"default"}
                  maxLength={10}
                  autoCapitalize={"characters"}
                  onChangeText={(text) => {
                    dispatch(
                      setUploadDocuments({
                        key: "PAN",
                        text: text.replace(/[^a-zA-Z0-9]/g, ""),
                      })
                    );
                  }}
                />
                <Text style={GlobalStyle.underline}></Text>
                <View style={styles.select_image_bck_vw}>
                  <ImageSelectItem
                    name={"Upload Pan"}
                    onPress={() => dispatch(setImagePicker("UPLOAD_PAN"))}
                  />
                </View>
                {uploadedImagesDataObj?.pan?.fileName ? (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={styles.preViewBtn}
                      onPress={() => {
                        if (uploadedImagesDataObj.pan?.documentPath) {
                          setImagePath(uploadedImagesDataObj.pan?.documentPath);
                        }
                      }}
                    >
                      <Text style={styles.previewTxt}>Preview</Text>
                    </TouchableOpacity>
                    <View style={{ width: "80%" }}>
                      <DisplaySelectedImage
                        fileName={uploadedImagesDataObj.pan.fileName}
                        from={"PAN"}
                      />
                    </View>
                  </View>
                ) : null}

                {/* // Adhal Number */}
                {selector.enquiry_segment.toLowerCase() === "personal" ? (
                  <View>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.adhaar_number}
                      label={"Aadhaar Number"}
                      keyboardType={"number-pad"}
                      maxLength={12}
                      onChangeText={(text) =>
                        dispatch(
                          setUploadDocuments({
                            key: "ADHAR",
                            text: text.replace(/[^0-9]/g, ""),
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"Upload Aadhaar"}
                        onPress={() => dispatch(setImagePicker("UPLOAD_ADHAR"))}
                      />
                    </View>
                    {uploadedImagesDataObj?.aadhar?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.preViewBtn}
                          onPress={() => {
                            if (uploadedImagesDataObj.aadhar?.documentPath) {
                              setImagePath(
                                uploadedImagesDataObj.aadhar?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previewTxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={uploadedImagesDataObj.aadhar.fileName}
                            from={"AADHAR"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* // Employeed ID */}
                {selector.enquiry_segment.toLowerCase() === "personal" &&
                (selector.customer_type.toLowerCase() === "corporate" ||
                  selector.customer_type.toLowerCase() === "government" ||
                  selector.customer_type.toLowerCase() === "retired") ? (
                  <View>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.employee_id}
                      label={"Employee ID"}
                      maxLength={15}
                      onChangeText={(text) =>
                        dispatch(
                          setUploadDocuments({
                            key: "EMPLOYEE_ID",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"Employee ID"}
                        onPress={() =>
                          dispatch(setImagePicker("UPLOAD_EMPLOYEE_ID"))
                        }
                      />
                    </View>
                    {uploadedImagesDataObj?.employeeId?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.preViewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.employeeId?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.employeeId?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previewTxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={uploadedImagesDataObj.employeeId.fileName}
                            from={"EMPLOYEE_ID"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* Last 3 month payslip */}
                {selector.enquiry_segment.toLowerCase() === "personal" &&
                (selector.customer_type.toLowerCase() === "corporate" ||
                  selector.customer_type.toLowerCase() === "government") ? (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"Last 3 months payslip"}
                        onPress={() =>
                          dispatch(setImagePicker("UPLOAD_3_MONTHS_PAYSLIP"))
                        }
                      />
                    </View>
                    {uploadedImagesDataObj?.payslips ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.preViewBtn}
                          onPress={() => {
                            if (uploadedImagesDataObj?.payslips?.documentPath) {
                              setImagePath(
                                uploadedImagesDataObj.payslips?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previewTxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={uploadedImagesDataObj?.payslips.fileName}
                            from={"3_MONTHS_PAYSLIP"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* Patta Pass book */}
                {selector.enquiry_segment.toLowerCase() === "personal" &&
                selector.customer_type.toLowerCase() === "farmer" ? (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"Patta Pass Book"}
                        onPress={() =>
                          dispatch(setImagePicker("UPLOAD_PATTA_PASS_BOOK"))
                        }
                      />
                    </View>
                    {uploadedImagesDataObj.pattaPassBook ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.preViewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.pattaPassBook?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.pattaPassBook
                                  ?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previewTxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={
                              uploadedImagesDataObj.pattaPassBook.fileName
                            }
                            from={"PATTA_PASS_BOOK"}
                          />
                        </View>
                      </View>
                    ) : uploadedImagesDataObj.pattaPassBook ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.preViewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.pattaPassBook?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.pattaPassBook
                                  ?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previewTxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={
                              uploadedImagesDataObj.pattaPassBook.fileName
                            }
                            from={"PATTA_PASS_BOOK"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* Pension Letter */}
                {selector.enquiry_segment.toLowerCase() === "personal" &&
                selector.customer_type.toLowerCase() === "retired" ? (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"Pension Letter"}
                        onPress={() =>
                          dispatch(setImagePicker("UPLOAD_PENSION_LETTER"))
                        }
                      />
                    </View>
                    {uploadedImagesDataObj.pensionLetter ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.preViewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.pensionLetter?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.pensionLetter
                                  ?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previewTxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={
                              uploadedImagesDataObj.pensionLetter.fileName
                            }
                            from={"PENSION_LETTER"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* IMA Certificate */}
                {selector.enquiry_segment.toLowerCase() === "personal" &&
                selector.customer_type.toLowerCase() === "doctor" ? (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"IMA Certificate"}
                        onPress={() =>
                          dispatch(setImagePicker("UPLOAD_IMA_CERTIFICATE"))
                        }
                      />
                    </View>
                    {uploadedImagesDataObj.imaCertificate ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.preViewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.imaCertificate?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.imaCertificate
                                  ?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previewTxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={
                              uploadedImagesDataObj.imaCertificate.fileName
                            }
                            from={"IMA_CERTIFICATE"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* Leasing Confirmation */}
                {selector.enquiry_segment.toLowerCase() === "commercial" &&
                selector.customer_type.toLowerCase() === "fleet" ? (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"Leasing Confirmation"}
                        onPress={() =>
                          dispatch(
                            setImagePicker("UPLOAD_LEASING_CONFIRMATION")
                          )
                        }
                      />
                    </View>
                    {uploadedImagesDataObj.leasingConfirmationLetter ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.preViewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.leasingConfirmationLetter
                                ?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.leasingConfirmationLetter
                                  ?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previewTxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={
                              uploadedImagesDataObj.leasingConfirmationLetter
                                .fileName
                            }
                            from={"LEASING_CONFIRMATION"}
                          />
                        </View>
                      </View>
                    ) : uploadedImagesDataObj.leasingConfirmationLetter ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.preViewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.leasingConfirmationLetter
                                ?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.leasingConfirmationLetter
                                  ?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previewTxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={
                              uploadedImagesDataObj.leasingConfirmationLetter
                                .fileName
                            }
                            from={"LEASING_CONFIRMATION"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* Address Proof */}
                {selector.enquiry_segment.toLowerCase() === "company" &&
                selector.customer_type.toLowerCase() === "institution" ? (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"Address Proof"}
                        onPress={() =>
                          dispatch(setImagePicker("UPLOAD_ADDRESS_PROOF"))
                        }
                      />
                    </View>
                    {uploadedImagesDataObj.address ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.preViewBtn}
                          onPress={() => {
                            if (uploadedImagesDataObj.address?.documentPath) {
                              setImagePath(
                                uploadedImagesDataObj.address?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previewTxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={uploadedImagesDataObj.address.fileName}
                            from={"ADDRESS_PROOF"}
                          />
                        </View>
                      </View>
                    ) : uploadedImagesDataObj.addressProof?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.preViewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.addressProof?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.addressProof?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previewTxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={
                              uploadedImagesDataObj.addressProof.fileName
                            }
                            from={"ADDRESS_PROOF"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* GSTIN Number */}
                {selector.enquiry_segment.toLowerCase() === "company" &&
                selector.customer_type.toLowerCase() === "institution" ? (
                  <View>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.gstin_number}
                      label={"GSTIN Number"}
                      maxLength={30}
                      onChangeText={(text) =>
                        dispatch(
                          setUploadDocuments({
                            key: "GSTIN_NUMBER",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                ) : null}
              </List.Accordion>
              <View style={styles.space}></View>
              {/* // 7.Customer Need Analysis */}
              <List.Accordion
                id={"7"}
                title={"Customer Need Analysis"}
                titleStyle={{
                  color: openAccordian === "7" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "7" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View style={styles.view2}>
                  <Text style={styles.looking_any_text}>
                    {"Looking for any other brand"}
                  </Text>
                  <Checkbox.Android
                    status={
                      selector.c_looking_for_any_other_brand_checked
                        ? "checked"
                        : "unchecked"
                    }
                    uncheckedColor={Colors.DARK_GRAY}
                    color={Colors.RED}
                    onPress={() =>
                      dispatch(
                        setCustomerNeedAnalysis({
                          key: "CHECK_BOX",
                          text: "",
                        })
                      )
                    }
                  />
                </View>

                {selector.c_looking_for_any_other_brand_checked && (
                  <View>
                    <DropDownSelectionItem
                      label={"Make"}
                      value={selector.c_make}
                      onPress={() => showDropDownModelMethod("C_MAKE", "Make")}
                      clearOption={true}
                      clearKey={"C_MAKE"}
                      onClear={onDropDownClear}
                    />
                    {selector.c_make === "Other" && (
                      <View>
                        <TextinputComp
                          style={{ height: 65, width: "100%" }}
                          label={"Make Other Name"}
                          editable={true}
                          maxLength={50}
                          value={selector.c_make_other_name}
                          onChangeText={(text) =>
                            dispatch(
                              setCustomerNeedAnalysis({
                                key: "C_MAKE_OTHER_NAME",
                                text: text,
                              })
                            )
                          }
                        />
                        <Text style={GlobalStyle.underline}></Text>
                      </View>
                    )}
                    <DropDownSelectionItem
                      label={"Model"}
                      value={selector.c_model}
                      onPress={() =>
                        showDropDownModelMethod("C_MODEL", "Model")
                      }
                      clearOption={true}
                      clearKey={"C_MODEL"}
                      onClear={onDropDownClear}
                    />
                    {selector.c_model === "Other" && (
                      <View>
                        <TextinputComp
                          style={{ height: 65, width: "100%" }}
                          label={"Model Other Name"}
                          editable={true}
                          value={selector.c_model_other_name}
                          onChangeText={(text) =>
                            dispatch(
                              setCustomerNeedAnalysis({
                                key: "C_MODEL_OTHER_NAME",
                                text: text,
                              })
                            )
                          }
                        />
                        <Text style={GlobalStyle.underline}></Text>
                      </View>
                    )}

                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Variant"}
                      editable={true}
                      maxLength={40}
                      autoCapitalize="words"
                      value={selector.c_variant}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerNeedAnalysis({
                            key: "C_VARIANT",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Color"}
                      autoCapitalize="words"
                      editable={true}
                      maxLength={40}
                      value={selector.c_color}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerNeedAnalysis({
                            key: "C_COLOR",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <DropDownSelectionItem
                      label={
                        userData?.isSelfManager == "N" ||
                        userData?.orgName?.includes("BikeWo Corporation")
                          ? "Fuel Type"
                          : "Range"
                      }
                      value={selector.c_fuel_type}
                      onPress={() =>
                        showDropDownModelMethod("C_FUEL_TYPE", "Fuel Type")
                      }
                      clearOption={true}
                      clearKey={"C_FUEL_TYPE"}
                      onClear={onDropDownClear}
                    />
                    <DropDownSelectionItem
                      label={
                        userData?.orgName?.includes("BikeWo Corporation")
                          ? "Transmission Type"
                          : userData.isSelfManager == "Y"
                          ? "Battery Type"
                          : userData.isTracker == "Y"
                          ? "Clutch Type"
                          : "Transmission Type"
                      }
                      value={selector.c_transmission_type}
                      onPress={() =>
                        showDropDownModelMethod(
                          "C_TRANSMISSION_TYPE",
                          "Transmission Type"
                        )
                      }
                      clearOption={true}
                      clearKey={"C_TRANSMISSION_TYPE"}
                      onClear={onDropDownClear}
                    />

                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.c_price_range}
                      label={"Price Range"}
                      keyboardType={"number-pad"}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerNeedAnalysis({
                            key: "PRICE_RANGE",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.c_on_road_price}
                      label={"On Road Price"}
                      keyboardType={"number-pad"}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerNeedAnalysis({
                            key: "ON_ROAD_PRICE",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.c_dealership_name}
                      label={"DealerShip Name"}
                      autoCapitalize="words"
                      keyboardType={"default"}
                      maxLength={50}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerNeedAnalysis({
                            key: "DEALERSHIP_NAME",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.c_dealership_location}
                      label={"DealerShip Location"}
                      autoCapitalize="words"
                      keyboardType={"default"}
                      maxLength={50}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerNeedAnalysis({
                            key: "DEALERSHIP_LOCATION",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.c_dealership_pending_reason}
                      label={"Dealership Pending Reason"}
                      autoCapitalize="words"
                      keyboardType={"default"}
                      maxLength={50}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerNeedAnalysis({
                            key: "DEALERSHIP_PENDING_REASON",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}

                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.c_voice_of_customer_remarks}
                  label={"Voice of Customer Remarks "}
                  autoCapitalize="words"
                  keyboardType={"default"}
                  maxLength={50}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerNeedAnalysis({
                        key: "VOICE_OF_CUSTOMER_REMARKS",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
              </List.Accordion>
              {selector.buyer_type == "Additional Buyer" ||
              selector.buyer_type == "Replacement Buyer" ||
              selector.buyer_type == "Exchange Buyer" ? (
                <View style={styles.space}></View>
              ) : null}
              {/* // 8.Additional Buyer */}
              {selector.buyer_type == "Additional Buyer" ? (
                <List.Accordion
                  id={"8"}
                  title={"Additional Buyer"}
                  titleStyle={{
                    color: openAccordian === "8" ? Colors.BLACK : Colors.BLACK,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  style={[
                    {
                      backgroundColor:
                        openAccordian === "8" ? Colors.RED : Colors.WHITE,
                      height: 60,
                    },
                    styles.accordianBorder,
                  ]}
                >
                  <DropDownSelectionItem
                    label={"Make"}
                    value={selector.a_make}
                    onPress={() => showDropDownModelMethod("A_MAKE", "Make")}
                    clearOption={true}
                    clearKey={"A_MAKE"}
                    onClear={onDropDownClear}
                  />
                  {selector.a_make === "Other" && (
                    <View>
                      <TextinputComp
                        style={{ height: 65, width: "100%" }}
                        label={"Make Other Name"}
                        editable={true}
                        maxLength={50}
                        value={selector.a_make_other_name}
                        onChangeText={(text) =>
                          dispatch(
                            setAdditionalBuyerDetails({
                              key: "A_MAKE_OTHER_NAME",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  )}
                  <DropDownSelectionItem
                    label={"Model"}
                    value={selector.a_model}
                    onPress={() => showDropDownModelMethod("A_MODEL", "Model")}
                    clearOption={true}
                    clearKey={"A_MODEL"}
                    onClear={onDropDownClear}
                  />
                  {selector.a_model === "Other" && (
                    <View>
                      <TextinputComp
                        style={{ height: 65, width: "100%" }}
                        label={"Model Other Name"}
                        editable={true}
                        maxLength={50}
                        value={selector.a_model_other_name}
                        onChangeText={(text) =>
                          dispatch(
                            setAdditionalBuyerDetails({
                              key: "A_MODEL_OTHER_NAME",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  )}

                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.a_varient}
                    label={"Variant"}
                    maxLength={50}
                    autoCapitalize="words"
                    onChangeText={(text) =>
                      dispatch(
                        setAdditionalBuyerDetails({
                          key: "A_VARIENT",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.a_color}
                    label={"Color"}
                    autoCapitalize="words"
                    maxLength={50}
                    onChangeText={(text) =>
                      dispatch(
                        setAdditionalBuyerDetails({
                          key: "A_COLOR",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.a_reg_no}
                    label={"Reg. No."}
                    maxLength={15}
                    keyboardType={"default"}
                    autoCapitalize={"characters"}
                    onChangeText={(text) =>
                      dispatch(
                        setAdditionalBuyerDetails({
                          key: "A_REG_NO",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                </List.Accordion>
              ) : null}

              {/* // 9.Replacement Buyer */}
              {selector.buyer_type == "Replacement Buyer" ||
              selector.buyer_type == "Exchange Buyer" ? (
                <List.Accordion
                  id={"9"}
                  title={"Exchange Buyer"}
                  titleStyle={{
                    color: openAccordian === "9" ? Colors.BLACK : Colors.BLACK,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  style={[
                    {
                      backgroundColor:
                        openAccordian === "9" ? Colors.RED : Colors.WHITE,
                      height: 60,
                    },
                    styles.accordianBorder,
                  ]}
                >
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.r_reg_no}
                    label={"Reg. No.*"}
                    maxLength={12}
                    keyboardType={"default"}
                    autoCapitalize={"characters"}
                    onChangeText={(text) =>
                      dispatch(
                        setReplacementBuyerDetails({
                          key: "R_REG_NO",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text
                    style={[
                      GlobalStyle.underline,
                      {
                        backgroundColor:
                          isSubmitPress && selector.r_reg_no === ""
                            ? "red"
                            : "rgba(208, 212, 214, 0.7)",
                      },
                    ]}
                  ></Text>
                  <View style={styles.select_image_bck_vw}>
                    <ImageSelectItem
                      name={"Upload Reg Doc"}
                      onPress={() => dispatch(setImagePicker("UPLOAD_REG_DOC"))}
                    />
                  </View>
                  {selector.regDocumentPath ? (
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={styles.preViewBtn}
                        onPress={() => {
                          if (selector.regDocumentPath) {
                            setImagePath(selector.regDocumentPath);
                          }
                        }}
                      >
                        <Text style={styles.previewTxt}>Preview</Text>
                      </TouchableOpacity>
                      <View style={{ width: "80%" }}>
                        <DisplaySelectedImage
                          fileName={selector.regDocumentKey}
                          from={"regNoD"}
                        />
                      </View>
                    </View>
                  ) : null}
                  <DropDownSelectionItem
                    label={"Make"}
                    value={selector.r_make}
                    onPress={() => showDropDownModelMethod("R_MAKE", "Make")}
                    clearOption={true}
                    clearKey={"R_MAKE"}
                    onClear={onDropDownClear}
                  />
                  {selector.r_make === "Other" && (
                    <View>
                      <TextinputComp
                        style={{ height: 65, width: "100%" }}
                        label={"Make Other Name"}
                        editable={true}
                        maxLength={50}
                        value={selector.r_make_other_name}
                        onChangeText={(text) =>
                          dispatch(
                            setReplacementBuyerDetails({
                              key: "R_MAKE_OTHER_NAME",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  )}
                  <DropDownSelectionItem
                    label={"Model"}
                    value={selector.r_model}
                    onPress={() => showDropDownModelMethod("R_MODEL", "Model")}
                    clearOption={true}
                    clearKey={"R_MODEL"}
                    onClear={onDropDownClear}
                  />
                  {selector.r_model === "Other" && (
                    <View>
                      <TextinputComp
                        style={{ height: 65, width: "100%" }}
                        label={"Model Other Name"}
                        editable={true}
                        maxLength={50}
                        value={selector.r_model_other_name}
                        onChangeText={(text) =>
                          dispatch(
                            setReplacementBuyerDetails({
                              key: "R_MODEL_OTHER_NAME",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  )}

                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    label={"Variant"}
                    editable={true}
                    value={selector.r_varient}
                    maxLength={50}
                    autoCapitalize="words"
                    onChangeText={(text) =>
                      dispatch(
                        setReplacementBuyerDetails({
                          key: "R_VARIENT",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>

                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    label={"Color"}
                    editable={true}
                    maxLength={50}
                    value={selector.r_color}
                    autoCapitalize="words"
                    onChangeText={(text) =>
                      dispatch(
                        setReplacementBuyerDetails({
                          key: "R_COLOR",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>

                  <DropDownSelectionItem
                    label={
                      userData?.isSelfManager == "N" ||
                      userData?.orgName?.includes("BikeWo Corporation")
                        ? "Fuel Type"
                        : "Range"
                    }
                    value={selector.r_fuel_type}
                    onPress={() =>
                      showDropDownModelMethod("R_FUEL_TYPE", "Fuel Type")
                    }
                    clearOption={true}
                    clearKey={"R_FUEL_TYPE"}
                    onClear={onDropDownClear}
                  />
                  <DropDownSelectionItem
                    label={
                      userData?.orgName?.includes("BikeWo Corporation")
                        ? "Transmission Type"
                        : userData.isSelfManager == "Y"
                        ? "Battery Type"
                        : userData.isTracker == "Y"
                        ? "Clutch Type"
                        : "Transmission Type"
                    }
                    value={selector.r_transmission_type}
                    onPress={() =>
                      showDropDownModelMethod(
                        "R_TRANSMISSION_TYPE",
                        "Transmission Type"
                      )
                    }
                    clearOption={true}
                    clearKey={"R_TRANSMISSION_TYPE"}
                    onClear={onDropDownClear}
                  />

                  <DateSelectItem
                    label={"Mth.Yr. of MFG"}
                    value={selector.r_mfg_year}
                    onPress={() => dispatch(setDatePicker("R_MFG_YEAR"))}
                  />
                  {/* <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.r_mfg_year}
                    label={"Mth.Yr. of MFG"}
                    // keyboardType={"number-pad"}
                    // maxLength={7}
                    onChangeText={(text) => {
                      let regex = /[\d]{2} \/ [\d]{4}/;
                      dispatch(updateSelectedDate({ key: "R_MFG_YEAR", text: text }))
                    }}
                  /> */}
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.r_kms_driven_or_odometer_reading}
                    label={"Kms-Driven/Odometer Reading"}
                    keyboardType={"number-pad"}
                    maxLength={7}
                    onChangeText={(text) =>
                      dispatch(
                        setReplacementBuyerDetails({
                          key: "R_KMS_DRIVEN_OR_ODOMETER_READING",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>

                  <View style={styles.view2}>
                    <Text style={styles.looking_any_text}>
                      {"Hypothication"}
                    </Text>
                    <Checkbox.Android
                      status={
                        selector.r_hypothication_checked
                          ? "checked"
                          : "unchecked"
                      }
                      uncheckedColor={Colors.DARK_GRAY}
                      color={Colors.RED}
                      onPress={() =>
                        dispatch(
                          setReplacementBuyerDetails({
                            key: "R_HYPOTHICATION_CHECKED",
                            text: "",
                          })
                        )
                      }
                    />
                  </View>

                  {selector.r_hypothication_checked && (
                    <View>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.r_hypothication_name}
                        label={"Hypothication Name"}
                        keyboardType={"default"}
                        autoCapitalize="words"
                        maxLength={50}
                        onChangeText={(text) =>
                          dispatch(
                            setReplacementBuyerDetails({
                              key: "R_HYPOTHICATION_NAME",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.r_hypothication_branch}
                        label={"Hypothication Branch"}
                        keyboardType={"default"}
                        autoCapitalize="words"
                        maxLength={50}
                        onChangeText={(text) =>
                          dispatch(
                            setReplacementBuyerDetails({
                              key: "R_HYPOTHICATION_BRANCH",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  )}

                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.r_expected_price}
                    label={"Expected Price"}
                    keyboardType={"number-pad"}
                    onChangeText={(text) =>
                      dispatch(
                        setReplacementBuyerDetails({
                          key: "R_EXP_PRICE",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <DateSelectItem
                    label={"Registration Date"}
                    value={selector.r_registration_date}
                    onPress={() => dispatch(setDatePicker("R_REG_DATE"))}
                  />
                  <DateSelectItem
                    label={"Registration Validity Date"}
                    value={selector.r_registration_validity_date}
                    onPress={() =>
                      dispatch(setDatePicker("R_REG_VALIDITY_DATE"))
                    }
                  />
                  <View style={styles.view2}>
                    <Text style={styles.looking_any_text}>{"Insurance"}</Text>
                    <Checkbox.Android
                      status={
                        selector.r_insurence_checked ? "checked" : "unchecked"
                      }
                      uncheckedColor={Colors.DARK_GRAY}
                      color={Colors.RED}
                      onPress={() =>
                        dispatch(
                          setReplacementBuyerDetails({
                            key: "R_INSURENCE_CHECKED",
                            text: "",
                          })
                        )
                      }
                    />
                  </View>
                  {selector.r_insurence_checked && (
                    <View>
                      <View style={styles.view2}>
                        <Text style={styles.looking_any_text}>
                          {"Insurance Document"}
                        </Text>
                        <Checkbox.Android
                          status={
                            selector.r_insurence_document_checked
                              ? "checked"
                              : "unchecked"
                          }
                          uncheckedColor={Colors.DARK_GRAY}
                          color={Colors.RED}
                          onPress={() =>
                            dispatch(
                              setReplacementBuyerDetails({
                                key: "R_INSURENCE_DOC_CHECKED",
                                text: "",
                              })
                            )
                          }
                        />
                      </View>
                    </View>
                  )}
                  {selector.r_insurence_document_checked && (
                    <View>
                      <View style={styles.select_image_bck_vw}>
                        <ImageSelectItem
                          name={"Upload Insurance"}
                          onPress={() =>
                            dispatch(setImagePicker("UPLOAD_INSURENCE"))
                          }
                        />
                      </View>
                      {/* {uploadedImagesDataObj.insurance ? (
                        <DisplaySelectedImage
                          fileName={uploadedImagesDataObj.insurance.fileName}
                          from={"INSURENCE"}
                        />
                      ) : null} */}
                      {selector.insuranceDocumentPath ? (
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity
                            style={styles.preViewBtn}
                            onPress={() => {
                              if (selector.insuranceDocumentPath) {
                                setImagePath(selector.insuranceDocumentPath);
                              }
                            }}
                          >
                            <Text style={styles.previewTxt}>Preview</Text>
                          </TouchableOpacity>
                          <View style={{ width: "80%" }}>
                            <DisplaySelectedImage
                              fileName={selector.insuranceDocumentKey}
                              from={"INSURENCE"}
                            />
                          </View>
                        </View>
                      ) : null}
                    </View>
                  )}

                  {!selector.r_insurence_checked && (
                    <View>
                      <DateSelectItem
                        label={"Insurance Policy Expiry Date"}
                        value={selector.r_insurence_to_date}
                        onPress={() =>
                          dispatch(setDatePicker("R_INSURENCE_TO_DATE"))
                        }
                      />
                    </View>
                  )}
                  {selector.r_insurence_checked &&
                    !selector.r_insurence_document_checked && (
                      <View>
                        <DropDownSelectionItem
                          label={"Insurance Type"}
                          value={selector.r_insurence_type}
                          onPress={() =>
                            showDropDownModelMethod(
                              "R_INSURENCE_TYPE",
                              "Insurance Type"
                            )
                          }
                          clearOption={true}
                          clearKey={"R_INSURENCE_TYPE"}
                          onClear={onDropDownClear}
                        />
                        <DateSelectItem
                          label={"Insurance From Date"}
                          value={selector.r_insurence_from_date}
                          onPress={() =>
                            dispatch(setDatePicker("R_INSURENCE_FROM_DATE"))
                          }
                        />
                        <DateSelectItem
                          label={"Insurance To Date"}
                          value={selector.r_insurence_to_date}
                          onPress={() =>
                            dispatch(setDatePicker("R_INSURENCE_TO_DATE"))
                          }
                        />
                      </View>
                    )}

                  {!selector.r_insurence_document_checked && (
                    <View>
                      <DropDownSelectionItem
                        label={"Insurance Company Name"}
                        value={selector.r_insurence_company_name}
                        onPress={() =>
                          showDropDownModelMethod(
                            "R_INSURENCE_COMPANY_NAME",
                            "Insurence Company Name"
                          )
                        }
                        clearOption={true}
                        clearKey={"R_INSURENCE_COMPANY_NAME"}
                        onClear={onDropDownClear}
                      />
                      {/* <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.r_insurence_company_name}
                        label={"Insurance Company Name"}
                        keyboardType={"default"}
                        maxLength={50}
                        onChangeText={(text) =>
                          dispatch(
                            setReplacementBuyerDetails({
                              key: "R_INSURENCE_CMPNY_NAME",
                              text: text,
                            })
                          )
                        }
                      /> */}
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  )}
                </List.Accordion>
              ) : null}

              {isDropSelected ? <View style={styles.space}></View> : null}
              {/* 10. Drop section */}
              {isDropSelected ? (
                <List.Accordion
                  id={"10"}
                  title={"Enquiry Lost Section"}
                  titleStyle={{
                    color: openAccordian === "10" ? Colors.BLACK : Colors.BLACK,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  style={[
                    {
                      backgroundColor:
                        openAccordian === "10" ? Colors.RED : Colors.WHITE,
                      height: 60,
                    },
                    styles.accordianBorder,
                  ]}
                >
                  <DropComponent
                    from="ENQUIRY"
                    data={dropData}
                    reason={dropReason}
                    setReason={(text) => setDropReason(text)}
                    subReason={dropSubReason}
                    setSubReason={(text) => setDropSubReason(text)}
                    brandName={dropBrandName}
                    setBrandName={(text) => setDropBrandName(text)}
                    dealerName={dropDealerName}
                    setDealerName={(text) => setDropDealerName(text)}
                    location={dropLocation}
                    setLocation={(text) => setDropLocation(text)}
                    model={dropModel}
                    setModel={(text) => setDropModel(text)}
                    priceDiff={dropPriceDifference}
                    setPriceDiff={(text) => setDropPriceDifference(text)}
                    remarks={dropRemarks}
                    setRemarks={(text) => setDropRemarks(text)}
                  />
                </List.Accordion>
              ) : null}
            </List.AccordionGroup>
          </View>

          {!isDropSelected && (
            <View style={styles.actionBtnView}>
              {/* <Button
                mode="contained"
                style={{ width: 120 }}
                color={Colors.GRAY}
                labelStyle={{ textTransform: "none", color: Colors.WHITE }}
                onPress={() => setIsDropSelected(true)}
              >
                Lost
              </Button> */}
              {employeesData.length > 0 && (
                <Button
                  mode="contained"
                  style={{ width: 120 }}
                  color={Colors.PINK}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() => {
                    setEmployeeSelectModel(true);
                  }}
                >
                  Allocate
                </Button>
              )}
              <Button
                mode="contained"
                style={{ width: 120 }}
                color={Colors.PINK}
                labelStyle={{ textTransform: "none" }}
                onPress={submitClicked}
              >
                Submit
              </Button>
            </View>
          )}
          {showPreBookingBtn && !isDropSelected && (
            <View style={styles.prebookingBtnView}>
              <Button
                mode="contained"
                color={Colors.PINK}
                labelStyle={{ textTransform: "none" }}
                onPress={proceedToPreBookingClicked}
              >
                Proceed to Booking approval
              </Button>
            </View>
          )}
          {isDropSelected && (
            <View style={styles.prebookingBtnView}>
              <Button
                mode="contained"
                color={Colors.RED}
                labelStyle={{ textTransform: "none" }}
                onPress={proceedToCancelEnquiry}
              >
                Proceed To Cancellation
              </Button>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

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
    </SafeAreaView>
  );
};

export default AddNewEnquiryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  initialContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  baseVw: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  shadow: {
    shadowColor: Colors.DARK_GRAY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    elevation: 3,
  },
  textInputStyle: {
    height: 50,
    width: "100%",
  },
  space: {
    height: 5,
  },
  drop_down_view_style: {
    paddingTop: 5,
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  view1: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 5,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "600",
  },
  accordianBckVw: {
    // marginVertical: 5,
    // borderRadius: 10,
    backgroundColor: Colors.WHITE,
  },
  radioGroupBcVw: {
    flexDirection: "row",
    alignItems: "center",
    height: 65,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
  permanentAddText: {
    fontSize: 16,
    fontWeight: "700",
  },
  view2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    paddingTop: 20,
    paddingLeft: 12,
  },
  looking_any_text: {
    fontSize: 16,
    fontWeight: "500",
  },
  select_image_bck_vw: {
    minHeight: 50,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
  actionBtnView: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  prebookingBtnView: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedImageBckVw: {
    paddingLeft: 12,
    paddingRight: 10,
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
  },
  selectedImageTextStyle: {
    fontSize: 12,
    fontWeight: "400",
    width: "80%",
    color: Colors.DARK_GRAY,
  },
  accordianBorder: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "#7a7b7d",
  },
  addView: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "white",
  },
  dropdownContainer: {
    flex: 1,
    padding: 16,
    height: 50,
    borderRadius: 5,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  eventTouchable: {
    flexDirection: "row",
    // justifyContent: "space-around",
    alignItems: "center",
    // height: '15%',
    alignContent: "center",
    width: "100%",
    marginTop: 5,
  },
  eventText: {
    fontSize: 12,
    color: Colors.BLACK,
    textAlign: "left",
    marginEnd: 10,
    width: 100,
  },
  modelView: {
    width: "90%",
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderWidth: 2,
    borderColor: Colors.BLACK,
    flexDirection: "column",
    height: "40%",
  },
  selectTitle: {
    color: Colors.BLACK,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "left",
    margin: 5,
  },
  view3: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: Colors.WHITE,
  },
  addmodelView: {
    width: "40%",
    margin: 5,
    borderRadius: 5,
    backgroundColor: Colors.PINK,
    height: 40,
    alignSelf: "flex-end",
    alignContent: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
  addmodelTxt: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.WHITE,
  },
  preViewBtn: {
    width: "20%",
    height: 30,
    backgroundColor: Colors.SKY_BLUE,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  previewTxt: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: "600",
  },
  addressDropDownRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  addressClear: {
    marginHorizontal: 0,
    paddingHorizontal: 5,
    borderLeftWidth: 1,
    borderRadius: 0,
    borderLeftColor: Colors.GRAY,
    alignSelf: "center",
  },
});
