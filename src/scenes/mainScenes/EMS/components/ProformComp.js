import React, { useState, useEffect } from "react";
import { View, StyleSheet, Keyboard, Text, TextInput, Pressable, Image, Alert, Platform } from "react-native";
import { DropDownSelectionItem } from "../../../../pureComponents";
import { TextinputComp, DropDownComponant } from "../../../../components";
import { GlobalStyle, Colors } from "../../../../styles";
import { showToast } from "../../../../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, List, Button, IconButton, Switch } from "react-native-paper";
import moment from "moment";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Mailer from 'react-native-mail';
var RNFS = require('react-native-fs');


import * as AsyncStore from "../../../../asyncStore";
import {
  getLogoNameApi, getOnRoadPriceAndInsurenceDetailsApi, setDropDownData,
   postProformaInvoiceDetails, getProformaListingDetailsApi, setOfferPriceDetails,
  setOfferPriceDataForSelectedProforma, clearOfferPriceData, clearStateData
} from "../../../../redux/enquiryFormReducer";
import { getFocusedRouteNameFromRoute, useNavigation } from "@react-navigation/native";
import {
  GetCarModelList, GetPaidAccessoriesList,
} from "../../../../utils/helperFunctions";
import { PriceStackIdentifiers } from "../../../../navigations/appNavigator";
import { AppNavigator } from "../../../../navigations";
import { color } from "react-native-reanimated";

const lostToCompetitor = "Lost to Competitor".replace(/\s/g, "").toLowerCase();
const lostToUsedCarsFromCoDelear = "Lost to Used Cars from Co-Dealer".replace(/\s/g, "").toLowerCase();
const lostToCoDealer = "Lost to Co-Dealer".replace(/\s/g, "").toLowerCase();
const lostToCometitorName = "Lost to Competitor name".replace(/\s/g, "").toLowerCase();
const NoProperResponse = "No proper response from Sales Consultant".replace(/\s/g, "").toLowerCase();
const casualEnquiry = "Casual Enquiry".replace(/\s/g, "").toLowerCase();
const lostToSameDealer = "Lost to same dealer used vehicle".replace(/\s/g, "").toLowerCase();
const rupeeSymbol = "\u20B9";

const CheckboxTextAndAmountComp = ({
  title,
  amount,
  titleStyle = {},
  amoutStyle = {},
  isChecked = false,
  onPress,
}) => {
  return (
    <View style={[styles.textAndAmountView, { paddingLeft: 2 }]}>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <Checkbox.Android
          style={{ padding: 0, margin: 0 }}
          status={isChecked ? "checked" : "unchecked"}
          color={Colors.BLUE}
          uncheckedColor={Colors.GRAY}
          onPress={onPress}
        />
        <Text
          style={[
            {
              fontSize: 14,
              fontWeight: "400",
              maxWidth: "70%",
              color: Colors.GRAY,
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
      </View>
      <Text style={[{ fontSize: 14, fontWeight: "400" }, amoutStyle]}>
        {rupeeSymbol + " " + amount}
      </Text>
    </View>
  );
};

const TextAndAmountComp = ({
  title,
  amount,
  text,
  titleStyle = {},
  amoutStyle = {},
}) => {
  return (
    <View style={styles.textAndAmountView}>
      <Text style={[styles.leftLabel, titleStyle]}>{title}</Text>

      {text && text != '' ? <Text style={[{ fontSize: 16, fontWeight: "400", width: '50%', }, amoutStyle]}>
        {text}
      </Text> : <Text style={[{ fontSize: 14, fontWeight: "400" }, amoutStyle]}>
        {rupeeSymbol + " " + amount}
      </Text>}
    </View>
  );
};

const PaidAccessoriesTextAndAmountComp = ({
  title,
  amount,
  titleStyle = {},
  amoutStyle = {},
}) => {
  return (
    <View style={styles.textAndAmountView}>
      <Text
        style={[
          styles.leftLabel,
          titleStyle,
          {
            color: Colors.BLUE,
            textDecorationLine: "underline",
            textDecorationStyle: "solid",
            textDecorationColor: Colors.BLUE,
          },
        ]}
      >
        {title}
      </Text>
      <Text style={[{ fontSize: 14, fontWeight: "400" }, amoutStyle]}>
        {rupeeSymbol + " " + amount}
      </Text>
    </View>
  );
};
export const ProformaComp = ({

  route,
  branchId,
  modelDetails,
  universalId,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  const selector = useSelector((state) => state.enquiryFormReducer);
  const [orgId, setOrgId] = useState("");
  const [selectedVarientId, setSelectedVarientId] = useState(0);
  const [warrentyTypes, setWarrentyTypes] = useState([]);

  const [handlingChargSlctd, setHandlingChargSlctd] = useState(false);

  const [priceInfomationData, setPriceInformationData] = useState({
    ex_showroom_price: 0,
    ex_showroom_price_csd: 0,
    registration_charges: 0,
    handling_charges: 0,
    tcs_percentage: 0,
    tcs_amount: 0,
    essential_kit: 0,
    fast_tag: 0,
    vehicle_road_tax: 0,
  });
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [showMultipleDropDownData, setShowMultipleDropDownData] =
    useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [essentialKitSlctd, setEssentialKitSlctd] = useState(false);

  const [fastTagSlctd, setFastTagSlctd] = useState(false);
  const [financeBanksList, setFinanceBanksList] = useState([]);
  const [lifeTaxAmount, setLifeTaxAmount] = useState(0);
  const [tcsAmount, setTcsAmount] = useState(0);
  const [paidAccessoriesList, setPaidAccessoriesList] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [totalOnRoadPrice, setTotalOnRoadPrice] = useState(0);
  const [totalOnRoadPriceAfterDiscount, setTotalOnRoadPriceAfterDiscount] =
    useState(0);
  const [selectedInsurencePrice, setSelectedInsurencePrice] = useState(0);
  const [selectedAddOnsPrice, setSelectedAddOnsPrice] = useState(0);
  const [selectedWarrentyPrice, setSelectedWarrentyPrice] = useState(0);
  const [selectedPaidAccessoriesPrice, setSelectedPaidAccessoriesPrice] =
    useState(0);
  const [selectedFOCAccessoriesPrice, setSelectedFOCAccessoriesPrice] =
    useState(0);
  const [taxPercent, setTaxPercent] = useState("");
  const [insuranceDiscount, setInsuranceDiscount] = useState("");
  const [insurenceVarientTypes, setInsurenceVarientTypes] = useState([]);
  const [insurenceAddOnTypes, setInsurenceAddOnTypes] = useState([]);

  const [accDiscount, setAccDiscount] = useState("");
  const [initialTotalAmt, setInitialTotalAmt] = useState(0);

  const [paidAccessoriesListNew, setPaidAccessoriesListNew] = useState([]);
  const [selectedFOCAccessoriesList, setSelectedFOCAccessoriesList] = useState(
    []
  );
  const [selectedPaidAccessoriesList, setSelectedPaidAccessoriesList] =
    useState([]);
  const [selectedInsurenceAddons, setSelectedInsurenceAddons] = useState([]);
  const [showApproveRejectBtn, setShowApproveRejectBtn] = useState(false); 
  const [showSendForApprovBtn, setshowSendForApprovBtn] = useState(false);
  const [showSaveBtn, setshowSaveBtn] = useState(false);

  const [showPrebookingPaymentSection, setShowPrebookingPaymentSection] =
    useState(false);
  const [showSubmitDropBtn, setShowSubmitDropBtn] = useState(false);
  const [uploadedImagesDataObj, setUploadedImagesDataObj] = useState({});
  const [isRejectSelected, setIsRejectSelected] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [carModelsData, setCarModelsData] = useState([]);
  const [isnewProformaClicked, setisnewProformaClicked] = useState(false);
  const [isSelectPerformaClick, setisSelectPerformaClick] = useState(false);
  const [openAccordian, setOpenAccordian] = useState("0");
  const [carModel, setCarModel] = useState("");
  const [carColor, setCarColor] = useState("");
  const [carVariant, setCarVariant] = useState("");
  const [proformaDataForDropdown, setproformaDataForDropdown] = useState("");
  const [selectedProfroma, setSelectedProfroma] = useState("");
  const [selectedProfromaData, setSelectedProfromaData] = useState([]);
  const [proformaNo, setProformaNo] = useState("");
  const [selectedVehicleID, setselectedVehicleID] = useState("");
  const [selectedProformaID, setselectedProformaID] = useState("");
  
  const [selectedvehicleImageId, setselectedvehicleImageId] = useState("");
  const [selectedRegistrationCharges, setSelectedRegistrationCharges] = useState({});
  const [registrationChargesType, setRegistrationChargesType] = useState([]);
  const [focPrice, setFocPrice] = useState(selector.for_accessories);
  const [userData, setUserData] = useState({
    orgId: "",
    employeeId: "",
    employeeName: "",
    isManager: false,
    editEnable: false,
    isPreBookingApprover: false,
    isSelfManager: ""
  });
  const [selectedDate, setSelectedDate] = useState(moment().format("DD/MM/YYYY"));

  const [selectedCarVarientsData, setSelectedCarVarientsData] = useState({
    varientList: [],
    varientListForDropDown: [],
  });
  const [carColorsData, setCarColorsData] = useState([]);
  const [isDownLoadVisible, setisDownLoadVisible] = useState(false);

  useEffect(() => {
    getUserData();
    dispatch(getProformaListingDetailsApi(universalId));
    
    
  }, []);

  useEffect(() => {
    if (selector.proforma_listingdata){
      const proformaList =
        selector.proforma_listingdata || [];
      if (proformaList.length > 0) {
        let newProformaList = [];
        proformaList.forEach((item) => {
         
          
          newProformaList.push({
           id : item.id,
            name: moment(item.created_date).format("DD/MM/YYYY h:mm")
          });
         
        });
        setproformaDataForDropdown([...newProformaList])
     
      }
    }
  
    
  }, [selector.proforma_listingdata])
  
  const formateLesseName = () =>{
    if (!selector.enquiry_details_response) {
      return;
    }
   
    let tempDmsdata = "";
    const dmsEntity = selector.enquiry_details_response;
    if (dmsEntity.hasOwnProperty("dmsContactDto"))
      tempDmsdata = selector.enquiry_details_response.dmsContactDto;
    else if (dmsEntity.hasOwnProperty("dmsAccountDto")){
      tempDmsdata = selector.enquiry_details_response.dmsAccountDto;
    }
    
     
    let salutationTemp = 
      tempDmsdata.salutation ? 
        tempDmsdata.salutation+" " : "";

        
    let firstNameTemp = 
    tempDmsdata.firstName ? 
        tempDmsdata.firstName + " " : "";


    let lastNametemp = 
      tempDmsdata.lastName  ?
        tempDmsdata.lastName : "";

      return salutationTemp+firstNameTemp+lastNametemp
      // selector.enquiry_details_response.dmsAccountDto.firstName + " " +
      // selector.enquiry_details_response.dmsAccountDto.lastName
  } 

  const getUserData = async () => {
    try {
      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
        setUserToken(token);
      });
      
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);

        let isManager = false,
            editEnable = false;
        let isPreBookingApprover = false;
        if (
          jsonObj.hrmsRole === "MD" ||
          jsonObj.hrmsRole === "General Manager" ||
          jsonObj.hrmsRole === "Manager" ||
          jsonObj.hrmsRole === "Sales Manager"
        ) {
          isManager = true;
        }
        if (jsonObj.roles.includes("PreBooking Approver")) {
         
          editEnable = true;
          isPreBookingApprover = true;
        }
        setUserData({
          orgId: jsonObj.orgId,
          employeeId: jsonObj.empId,
          employeeName: jsonObj.empName,
          isManager: isManager,
          editEnable: editEnable,
          isPreBookingApprover: isPreBookingApprover,
          isSelfManager: jsonObj.isSelfManager
        });

        
        const data = {
          branchId: branchId,
          orgId: jsonObj.orgId,
        };
        setOrgId(jsonObj.orgId);
        dispatch(getLogoNameApi(data));
        getCarModelListFromServer(jsonObj.orgId);
      }
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    calculateOnRoadPrice(handlingChargSlctd, essentialKitSlctd, fastTagSlctd);
  }, [
    priceInfomationData,
    selectedInsurencePrice,
    selectedAddOnsPrice,
    selectedWarrentyPrice,
    selectedPaidAccessoriesPrice,
    selector.vechicle_registration,
    taxPercent,
    selectedRegistrationCharges
  ]);

  useEffect(() => {
    calculateOnRoadPriceAfterDiscount();
  }, [
    selector.consumer_offer,
    selector.exchange_offer,
    selector.corporate_offer,
    selector.promotional_offer,
    selector.cash_discount,

    selector.for_accessories,
    selector.insurance_discount,
    selector.accessories_discount,
    selector.additional_offer_1,
    selector.additional_offer_2,
    totalOnRoadPrice,
    selector.registrationCharges
  ]);

  useEffect(() => {
    if (route.params?.accessoriesList) {
      updatePaidAccessroies(route.params?.accessoriesList);
     
    }
  }, [route.params?.accessoriesList]);

  useEffect(() => {
    if (selector.vehicle_on_road_price_insurence_details_response) {
      const dmsOnRoadPriceDtoObj =
        selector.vehicle_on_road_price_insurence_details_response;
      // setSelectedInsurencePrice(dmsOnRoadPriceDtoObj.)
      //   setSelectedWarrentyPrice(dmsOnRoadPriceDtoObj.warrantyAmount);
      let handlingChargeSlctdLocal = handlingChargSlctd;
      let essentialKitSlctdLocal = essentialKitSlctd;
      let fastTagSlctdLocal = fastTagSlctd;
      
      // if (
      //   dmsOnRoadPriceDtoObj.handling_charges &&
      //   dmsOnRoadPriceDtoObj.handling_charges > 0
      // ) {
      //   setHandlingChargSlctd(true);
      //   handlingChargeSlctdLocal = true;
      // }
      // if (
      //   dmsOnRoadPriceDtoObj.essential_kit &&
      //   dmsOnRoadPriceDtoObj.essential_kit > 0
      // ) {
      //   setEssentialKitSlctd(true);
      //   essentialKitSlctdLocal = true;
      // }
      // if (dmsOnRoadPriceDtoObj.fast_tag && dmsOnRoadPriceDtoObj.fast_tag > 0) {
      //   setFastTagSlctd(true);
      //   fastTagSlctdLocal = true;
      // }
      calculateOnRoadPrice(
        handlingChargeSlctdLocal,
        essentialKitSlctdLocal,
        fastTagSlctdLocal
      );

      if (
        dmsOnRoadPriceDtoObj.insuranceAddonData &&
        dmsOnRoadPriceDtoObj.insuranceAddonData.length > 0
      ) {
        // let addOnPrice = 0;
        // dmsOnRoadPriceDtoObj.insuranceAddonData.forEach((element, index) => {
        //     addOnPrice += Number(element.add_on_price[0].cost);
        // });
        // setSelectedAddOnsPrice(addOnPrice);
      }

      
        if (dmsOnRoadPriceDtoObj.lifeTaxPercentage) {
        setTaxPercent(
          (
            (Number(dmsOnRoadPriceDtoObj.lifeTaxPercentage) * 1000) /
            10
          ).toString()
        );
        setLifeTaxAmount(
          getLifeTaxNew(Number(dmsOnRoadPriceDtoObj.lifeTaxPercentage) * 100)
        );
      }
      // if (dmsOnRoadPriceDtoObj.tcs_percentage) {
      //   setTaxPercent(
      //     (Number(dmsOnRoadPriceDtoObj.tcs_percentage)).toString()
      //   );
      //   setLifeTaxAmount(
      //     getLifeTaxNew(Number(dmsOnRoadPriceDtoObj.vehicle_road_tax))
      //   );
      // }
      if (dmsOnRoadPriceDtoObj.insuranceDiscount) {
        setInsuranceDiscount(dmsOnRoadPriceDtoObj.insuranceDiscount.toString());
      }
      if (dmsOnRoadPriceDtoObj.accessoriesDiscount) {
        setAccDiscount(dmsOnRoadPriceDtoObj.accessoriesDiscount.toString());
      }
    }
  }, [selector.vehicle_on_road_price_insurence_details_response]);

  useEffect(() => {
    if (selector.enquiry_details_response) {
      // Update Paid Accesories
      const dmsLeadDto = selector.enquiry_details_response.dmsLeadDto;
     
      
      if (dmsLeadDto.dmsAccessories.length > 0) {
        let initialValue = 0;
        let totalPrice = 0,
          totalFOCPrice = 0;
        for (let i = 0; i < dmsLeadDto.dmsAccessories.length; i++) {
          if (dmsLeadDto.dmsAccessories[i].dmsAccessoriesType !== "FOC") {
            totalPrice += dmsLeadDto.dmsAccessories[i].amount;
          } else {
            totalFOCPrice += dmsLeadDto.dmsAccessories[i].amount;
          }
          if (i === dmsLeadDto.dmsAccessories.length - 1) {
            setSelectedPaidAccessoriesPrice(totalPrice);
            setSelectedFOCAccessoriesPrice(totalFOCPrice);
          }
        }
      }
    
      setSelectedPaidAccessoriesList([...dmsLeadDto.dmsAccessories]);
      setPaidAccessoriesListNew([
        ...dmsLeadDto.dmsAccessories.filter(
          (item) => item.dmsAccessoriesType !== "FOC"
        ),
      ]);
      formateLesseName();
    }
  }, [selector?.enquiry_details_response]);

  useEffect(() => {
    if (selector.vehicle_on_road_price_insurence_details_response) {
      const varientTypes =
        selector.vehicle_on_road_price_insurence_details_response
          .insurance_vareint_mapping || [];
      if (varientTypes.length > 0) {
        let newFormatVarientTypes = [];
        varientTypes.forEach((item) => {
          newFormatVarientTypes.push({
            ...item,
            name: item.policy_name,
          });
        
          if (selector.insurance_type === item.policy_name) {
            setSelectedInsurencePrice(item.cost);
          }
        });
        setInsurenceVarientTypes([...newFormatVarientTypes]);
      }

      const allWarrentyTypes =
        selector.vehicle_on_road_price_insurence_details_response
          .extended_waranty || [];
      if (allWarrentyTypes.length > 0) {
        for (const object of allWarrentyTypes) {
          if (object.varient_id === selectedVarientId) {
            const matchedWarrentyTypes = object.warranty || [];
            if (matchedWarrentyTypes.length > 0) {
              let newFormatWarrentyTypes = [];
              matchedWarrentyTypes.forEach((item) => {
                if (Number(item.cost) !== 0) {
                  newFormatWarrentyTypes.push({
                    ...item,
                    name: item.document_name,
                  });
                }
              });

              setWarrentyTypes([...newFormatWarrentyTypes]);
            }
            break;
          }
        }
      }

      const allInsuranceAddOnTypes =
        selector.vehicle_on_road_price_insurence_details_response
          .insuranceAddOn || [];
      if (allInsuranceAddOnTypes.length > 0) {
        for (const object of allInsuranceAddOnTypes) {
          if (object.varient_id === selectedVarientId) {
            const matchedInsurenceAddOnTypes = object.add_on_price || [];
            let newFormatAddOnTypes = [];
            matchedInsurenceAddOnTypes.forEach((item) => {
              newFormatAddOnTypes.push({
                ...item,
                selected: false,
                name: item.document_name,
              });
            });
            setInsurenceAddOnTypes([...newFormatAddOnTypes]);
            break;
          }
        }
      }

      const allRegistrationCharges =
        selector.vehicle_on_road_price_insurence_details_response
          .registration || {};
      function isEmpty(obj) {
        return Object.keys(obj).length === 0;
      }
      if (!isEmpty(allRegistrationCharges)) {
        let x = Object.keys(allRegistrationCharges);
        let newArray = [];
        for (let i = 0; i < x.length; i++) {
          let ladel = x[i].toString();

          let temp = { name: ladel, cost: allRegistrationCharges[ladel] };
          if (selector.registrationCharges !== 0) {
            if (
              selector.registrationCharges === allRegistrationCharges[ladel]
            ) {
              setSelectedRegistrationCharges(temp);
            }
          }
          newArray.push(temp);
        }
        setRegistrationChargesType(newArray);
      }
      
      setPriceInformationData({
        ...selector.vehicle_on_road_price_insurence_details_response,
      });
    }
  }, [selector.vehicle_on_road_price_insurence_details_response]);


  useEffect(() => {
    // setTotalOnRoadPriceAfterDiscount(totalOnRoadPriceAfterDiscount - focPrice)
   
    dispatch(
      setOfferPriceDetails({
        key: "FOR_ACCESSORIES",
        text: focPrice.toString(),
      })
    )
  }, [focPrice]);

  useEffect(() => {
    if (selector.proforma_API_response === "fullfilled"){
        // goParentScreen();
    }
    var key = selector.proforma_API_response;
    switch(key){

      case "ENQUIRYCOMPLETED":
        setshowSendForApprovBtn(true);
        setselectedProformaID(selector.proforma_API_respData)
        break;
      case "SENTFORAPPROVAL":
        setselectedProformaID(selector.proforma_API_respData)
        setshowSaveBtn(false);
        setshowSendForApprovBtn(false);
        setShowApproveRejectBtn(true);
        break;
      case "APPROVED":
        setisDownLoadVisible(true)
        setselectedProformaID(selector.proforma_API_respData)
        setShowApproveRejectBtn(false)
        break;
      case "REJECTED" :
        setshowSaveBtn(true)
        setselectedProformaID(selector.proforma_API_respData)
        setShowApproveRejectBtn(false);
        break;
      // default:
    }
  
  
  }, [selector.proforma_API_response])
  

  const updatePaidAccessroies = (tableData) => {
    
    let totalPrice = 0,
      totFoc = 0,
      totMrp = 0;
    let newFormatSelectedAccessories = [];
    let newFormatSelectedFOCAccessories = [];
    let tempPaidAcc = [];
    tableData.forEach((item) => {
      if (item.selected) {
        totalPrice += item.cost;
        if (item.item === "FOC") {
          totFoc += item.cost;
          // totMrp += item.cost
          newFormatSelectedAccessories.push({
            id: item.id,
            amount: item.cost,
            partName: item.partName,
            accessoriesName: item.partName,
            leadId: selector?.pre_booking_details_response?.dmsLeadDto?.id,
            allotmentStatus: null,
            dmsAccessoriesType: item.item,
          });

        
          // dispatch(
          //   setOfferPriceDetails({
          //     key: "FOR_ACCESSORIES",
          //     text: item.cost.toString(),
          //   })
          // )
        }
        if (item.item !== "FOC") {
          totMrp += item.cost;
          newFormatSelectedAccessories.push({
            id: item.id,
            amount: item.cost,
            partName: item.partName,
            accessoriesName: item.partName,
            leadId: selector?.pre_booking_details_response?.dmsLeadDto?.id,
            allotmentStatus: null,
            dmsAccessoriesType: item.item,
          });
          tempPaidAcc.push({
            id: item.id,
            amount: item.cost,
            partName: item.partName,
            accessoriesName: item.partName,
            leadId: selector?.pre_booking_details_response?.dmsLeadDto?.id,
            allotmentStatus: null,
            dmsAccessoriesType: item.item,
          });
        }
      }
    });
    setSelectedPaidAccessoriesPrice(totMrp);

    setSelectedPaidAccessoriesList([...newFormatSelectedAccessories]);
    setPaidAccessoriesListNew([...tempPaidAcc]);
    if (totFoc > 0) {
      setFocPrice(totFoc)
    }
    else {
      
      dispatch(
        setOfferPriceDetails({
          key: "FOR_ACCESSORIES",
          text: selector.foc_accessoriesFromServer.toString() ? selector.foc_accessoriesFromServer.toString() :"",
        })
      )
    }
    // setSelectedFOCAccessoriesList([...newFormatSelectedFOCAccessories]);
  };



  const newProformaClick = () => {
    setshowSaveBtn(true);
    setshowSendForApprovBtn(false);
    setisnewProformaClicked(true)
    setSelectedProfroma("")
    setSelectedProfromaData([])
    setCarModel("")
    setCarVariant("")
    setCarColor("")
    clearPriceConfirmationData();
    dispatch(clearOfferPriceData());
    setselectedProformaID("");
    setselectedVehicleID("");
    setSelectedVarientId("");
    setselectedvehicleImageId("");
    setShowApproveRejectBtn(false);
    setProformaNo("");
    setSelectedDate(moment().format("DD/MM/YYYY"));
    setisDownLoadVisible(false);
    
  }
  const selectPerformaClick = () => {
    setisSelectPerformaClick(true)
    setisnewProformaClicked(false)
    showDropDownModelMethod("SELECTPERFORMA", "Select Proforma")
  }

  const downloadPdf2 = async (from) => {
    try {
      let siteTypeName =
        (await '<div style="border: 1px solid black;color: black;font-weight: bold" >') +
            '<div>' +
             '<div    id="proforma" style="margin: 0px; width: 1100px; height: 100%">' +
        
        '<table  class="ttable;" style="width: 100%; border: 1px solid black;border - collapse: collapse; ">' + 
        " <tr>" +
        '<td   class="tCenter" colspan="4" style="text-align: center;color: black!important;  ">' +
                  '<strong>PROFORMA INVOICE</strong>' +
              "</td>" +
         "</tr>" +

      "<tr>" +
        '<td   >' +
          // '<div   class="row align-items-center">' +
            // '<div   class="col-md-2 col-2">' +
              '<img   style="width: 100px; height: auto;" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAAwICAgICAwICAgMDAwMEBgQEBAQECAYGBQYJCAoKCQgJCQoMDwwKCw4LCQkNEQ0ODxAQERAKDBITEhATDxAQEP/bAEMBAwMDBAMECAQECBALCQsQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP/AABEIAbcDKgMBIgACEQEDEQH/xAAdAAEAAgIDAQEAAAAAAAAAAAAACAkBBwQFBgMC/8QAXhAAAQMDAgMEAwYQCAsFCQEAAAECAwQFEQYHCBIhCTFBURMiYRRXcYG00RUYGSMyNzhCcnR1kZOUobFSVIKSlbKz0hYXJDM0Q1Zic3bTJSdGZsImREVTVWSDhaLB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADbWxHDhrTiCfeo9H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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/2Q==">' +
            // '</div>' +
        '</td>' +
            '<td>'+ 
              '<div   class="col-md-8 orgname">' +
                '<p  > PPS Jeep </p>' +
                '<p   class="orgname-pad"> GSTN: TS0877223QQW </p>' +
                '<p  >Bldg no. 386/1/383/362/70</p>' +
                '<p   class="orgaddr-pad">GR Grand Plaza, Near JP Nagar Metro Station, Jaraganahalli Village, Kanakapura Main Road</p> ' +
                '<p   class="orgaddr-pad">JP Nagar - IC0700043</p> ' +
                '<p   class="orgaddr-pad">Bangalore - 560078</p> ' +
                '<p   class="orgaddr-pad">Bangalore</p> ' +
              '</div>'+
            '</td>' +
          // '</div>'+
        '<td>' +
                '<tr   >' +
                '<td    >PROFORMA NO :</td>' +
                '<td    > PPSJeep/2022-25708 </td>' +
                '</tr>' +
                '<tr   >' +
                '<td   >DATE</td>' +
                '<td   >7-Dec-2022</td>' +
                '</tr>' +
                '<tr   >' +
                '<td   >PAN NO :</td>' +
                '<td    style="text-transform: uppercase"> gfhfgh5453 </td>' +
                '</tr>' +
                '<tr   >' +
                '<td   >GST NO :</td>' +
                '<td    style="text-transform: uppercase"> 345345435345435 </td>' +
                '</tr>' + 
        '</td>' +
      "</tr>"+

 





     '<tr      class="tCenter">' +
       '<td      colspan="4"><strong     >NEW JEEP COMPASS Model TRAILHAWK 4x4(O2) 2.0D AT</strong></td>' +
    '</tr>' +
    '<tr      class="tCenter">'+
       '<td      colspan="4"><strong     >Exotica Red+Black Roof</strong></td>' +
    '</tr>' +
    '<tr>' +
       '<td  width="25%"><strong     >PARTICULARS</strong></td>' +
       '<td      style="text-align: right" width="25%"><strong     >AMOUNT</strong></td>' +
       '<td      width="25%"><strong     >DISCOUNT</strong></td>' +
       '<td      style="text-align: right" width="25%"><strong     >AMOUNT</strong></td>' +
    '</tr>' +
   '<tr>' +
       '<td      width="25%">Ex-Showroom Price</td>' +
       '<td      class="talign" width="25%"> 3097000 </td>' +
       '<td      width="25%">Consumer Offer</td>' +
       '<td      class="talign" width="25%"> 0 </td>' +
    '</tr>' +
    '<tr >' +
       '<td      width="25%">Life Tax</td>' +
       '<td      class="talign" width="25%"> 0 </td>' +
       '<td      width="25%">Exchange Offer</td>' +
      '<td      class="talign" width="25%"> 0 </td>' +
    '</tr>' +
    '<tr>' +
       '<td     >Registration Charges</td>' +
       '<td      class="talign"> 0 </td>' + 
       '<td      width="25%">Corporate Offer</td>' +
       '<td      class="talign" width="25%"> 0 </td>' +
    '</tr>' +
    '<tr>' +
       '<td     >Insurance ()</td>' +
       '<td      class="talign"> 0 </td>' +
       '<td     >Promotional Offers</td>' +
       '<td      class="talign"> 0 </td>' +
    '</tr>' +
    '<tr >' +
       '<td     >Add-on Insurance</td>' +
       '<td      class="talign">  </td>' +
       '<td     >Cash Discount</td>' +
       '<td      class="talign"> 0 </td>' +
    '</tr>' +
    '<tr     >'+
       '<td     >Warranty ()</td>' +
       '<td      class="talign"> 0 </td>' +
       '<td     >FOC Accessories</td>' +
       '<td      class="talign"> 0 </td>' +
    '</tr>' +
    '<tr     >' +
       '<td     >Handling Charges:</td>' +
       '<td      class="talign"> 0 </td>' +
       '<td     >Insurance Discount</td>' +
       '<td      class="talign"> 0 </td>' +
    '</tr>' +
    '<tr     >' +
       '<td     >Essential Kit:</td>' +
       '<td      class="talign">0</td>' +
       '<td     >Accessories Discount</td>' +
       '<td      class="talign"> 0 </td>' +
    '</tr>' +
    '<tr >' +
       '<td     >TCS(&gt;10Lakhs -&gt; 1%):</td>' +
        '<td      class="talign"> 30970 </td>' +
        '<td     >Additional Offer 1</td>' +
        '<td      class="talign"> 0 </td>' +
    '</tr>' +
        '<tr     >' +
        '<td     >Paid Accessories:</td>' +
        '<td      class="talign"> 0 </td>' +
        '<td     >Additional Offer 2</td>' +
        '<td      class="talign">0</td>' +
    '</tr>'+
    '<tr     >'+
        '<td     >Fast Tag</td>' +
        '<td      class="talign"> 0 </td>' +
       '<td     ></td>' +
        '<td      class="talign"></td>' +
    '</tr>'+
    '<tr     >' +
        '<td     ></td>' +
        '<td      class="talign"></td>' +
        '<td     ></td>' +
        '<td      class="talign"></td>' +
    '</tr > ' +



        '<tr      >' +
          '<td       class="tCenter" style="background-color: rgb(228, 212, 190)"><strong      >NET ON ROAD PRICE</strong></td>' +
        '<td       class="talign" style="background-color: rgb(228, 212, 190)"><strong      >3127970</strong></td>' +
        '<td       class="tCenter" style="background-color: rgb(228, 212, 190)"><strong      >NET ON ROAD PRICE AFTER DISCOUNT</strong></td>' +
        '<td       class="talign" style="background-color: rgb(228, 212, 190)"><strong      >3127970</strong></td>' +
        '</tr>' +


        '<tr      >' +
        '<td       colspan="4">' +
        '<p       style="text-decoration: underline">TERMS AND CONDITIONS</p>' +
          
        '<div       class="ng-star-inserted"> 1) An Intellectual Property clause will inform users that the contents, logo and other visual media you created is your property and is protected by copyright laws. </div>' +
        '<div       class="ng-star-inserted"> 2) A Termination clause will inform users that any accounts on your website and mobile app, or users access to your website and app, can be terminated in case of abuses or at your sole discretion. </div > ' +
      '<div       class="ng-star-inserted"> 3) A Governing Law clause will inform users which laws govern the agreement. These laws should come from the country in which your company is headquartered or the country from which you operate your website and mobile app. </div>' +
        '<div       class="ng-star-inserted"> 4) A Links to Other Websites clause will inform users that you are not responsible for any third party websites that you link to. This kind of clause will generally inform users that they are responsible for reading and agreeing (or disagreeing) with the Terms and Conditions or Privacy Policies of these third parties. </div>' +
        '<div       class="ng-star-inserted"> 5) If your website or mobile app allows users to create content and make that content public to other users, a Content clause will inform users that they own the rights to the content they have created. This clause usually mentions that users must give you (the website or mobile app developer/owner) a license so that you can share this content on your website/mobile app and to make it available to other users. </div>' +
        '<div       class="ng-star-inserted"> 6) Because the content created by users is public to other users, a DMCA notice clause (or Copyright Infringement ) section is helpful to inform users and copyright authors that, if any content is found to be a copyright infringement, you will respond to any DMCA takedown notices received and you will take down the content. </div>' +
        '<div       class="ng-star-inserted"> 7) A Limit What Users Can Do clause can inform users that by agreeing to use your service, theyre also agreeing to not do certain things.This can be part of a very long and thorough list in your Terms and Conditions agreement so as to encompass the most amount of negative uses. </div > ' +
      '<div       class="ng-star-inserted"> 8) Collection of settings initializing the jsPDF-instance </div>' +
        '</td>' +
        '</tr>' +

        '<tr      >' +
        '<td       colspan="4">' +
        '<div       class="row">' +
        '<div       class="col-md-12"><span       class="pull-right"><b      >For, PPS Jeep</b></span></div>' +
        '</div>' +
        '<div       class="row" style="margin-top: 20px">' +
        '<div       class="col-md-12"><span       class="pull-right"><b      >Authorised Signatory</b></span></div>' +
        '</div>' +
        '</td>' +
        '</tr>' +



        "</table>" +
 '</div >' +
    '</div >' +
 '</div >';

        
      let bottomPitch =
        (await '<div style="padding-top:10px;" >') +
        "<p>" +
        "Thank you for using our LED Savings Calculator. Energy Lighting Services is based in Nashville, Tennessee, and has been retrofitting commercial buildings all over North America with LED lighting systems since 2010. We would be honored to help you with your project needs.Please reach out to us if you have any questions.www.energylightingservices.com  855.270.3300  info@elsco.org" +
        "<p>" +
        "</div>";
      let finalHtmlText = await siteTypeName;
      let directoryPath = "";
      if (Platform.OS === "android") {
        directoryPath = "Download";
      }
      else {
        directoryPath = "Documents";
      }
      let options = {
        html: finalHtmlText,
        fileName: "ProformaInvoice",
        directory: directoryPath,
      };
      let file = await RNHTMLtoPDF.convert(options);
      var PdfData = await RNFS.readFile(file.filePath, "base64").then();

      // RNFS.copyFile(file.filePath + "/ProformaInvoice.pdf", RNFS.DocumentDirectoryPath + "/ProformaInvoice2.pdf")

     
      if (from === "email") {
        await Mailer.mail(
          {
            subject: "Invoice",
            //  recipients: ['radhadevi8958@gmail.com'],
            body: "",
            attachments: [
              {
                path: file.filePath, // The absolute path of the file from which to read data.
                type: "pdf", // Mime Type: jpg, png, doc, ppt, html, pdf
                name: "ProformaInvoice.pdf", // Optional: Custom filename for attachment
              },
            ],
          },
          (error, event) => {
            if (error) {
              AlertIOS.alert(
                "Error",
                "Could not send mail. Please send a mail to support@example.com"
              );
            }
          }
        );
      }

      // alert(file.filePath);
      Alert.alert(
        'File Downloaded to following location',
        `${file.filePath}`, // <- this part is optional, you can pass an empty string
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    } catch (error) {
      alert(error);
    }
  };

  const downloadPdf = async (from) => {
    try {
      let siteTypeName =
        (await "<div >") +
        '<div style="border: 1px solid black;color: black;font-weight: bold;" id="invoice">' +
        '<div class="row align-items-center">' +
        '<div class="col-md-1">' +
        '<img style="background: #fff;width: 120px;" src=' +
        selector.proforma_logo +
        ">" +
        "</div>" +
        '<div class="col-md-8 orgname" style="font-size: 18px; font-weight: bold;  margin-left: 30px; border-left: 1px solid black;">' +
        "<p >" +
        selector.proforma_orgName +
        "</p>" +
        // '<p class="orgname-pad">(Authorised Dealer for HYUNDAI MOTOR INDIA LTD.)</p>' +
        // '<p class="orgname-pad">GSTN: 36AAFCB6312A1ZA</p>' +
        "</div>" +
        '<div class="col-md-3" class="orgaddr">' +
        '<P style="margin-top: -10px;">' +
        selector.proforma_branch +
        "</P>" +
        '<P style="margin-top: -10px;">' +
        selector.proforma_city +
        "</P>" +
        '<P style="margin-top: -10px;">' +
        selector.proforma_state +
        "</P>" +
        "</div>" +
        "</div>" +
        '<div class="col-md-12">' +
        '<table class="ttable">' +
        "<colgroup>" +
        '<col style="width:10%;">' +
        '<col style="width:60%;">' +
        '<col style="width:5%;">' +
        '<col style="width:25%;">' +
        "</colgroup>" +
        "<tr>" +
        '<td style="background-color:rgb(185, 200, 241);" colspan="4" ><strong>PROFORMA INVOICE</strong></td>' +
        "</tr>" +
        '<tr class="tCenter">' +
        '<td` style=" border: 1px solid black; border-collapse: collapse;"` >NAME :</td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;">' +
        modelDetails.model +
        "</td>" +
        '<td style=" border: 1px solid black; border-collapse: collapse;" >DATE</td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;">' +
        moment().format("DD/MM/YYYY") +
        "</td>" +
        "</tr>" +
        '<tr class="tCenter">' +
        '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="2" rowspan="4"></td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;">MODEL</td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;">' +
        carModel +
        "</td>" +
        "</tr>" +
        '<tr class="tCenter">' +
        '<td style=" border: 1px solid black; border-collapse: collapse;" >VARIANT</td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;">' +
        carVariant +
        "</td>" +
        " </tr > " +
        '< tr class="tCenter" > ' +
        '<td style=" border: 1px solid black; border-collapse: collapse;">COLOUR</td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;">' +
       carColor +
        "</td>" +
        "</tr>" +
        "< tr > " +
        '<td style=" border: 1px solid black; border-collapse: collapse;"   colspan="2" class="tCenter">AMOUNT</td>' +
        "</tr > " +
        "< tr > " +
        '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="4" style="text-align:center"><strong> DESCRIPTION</strong></td>' +
        "</tr>" +
        "<tr>" +
        '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="2">EX SHOWROOM</td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2" class="talign">' +
        priceInfomationData.ex_showroom_price +
        "</td>" +
        "</tr>" +
        "<tr>" +
        '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="2">LIFE TAX @ 14%</td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="2"class="talign">' +
        lifeTaxAmount +
        "</td>" +
        "</tr>" +
        "<tr>" +
        '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2">INSURANCE</td>' +
        ' <td style=" border: 1px solid black; border-collapse: collapse;" colspan="2"class="talign">' +
        selectedInsurencePrice +
        "</td>" +
        "</tr>" +
        "<tr>" +
        '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2">ESSENTIAL KIT</td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2"class="talign">' +
        priceInfomationData.essential_kit +
        "</td>" +
        "</tr > " +
        "<tr>" +
        '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2">WARRANTY</td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2" class="talign">' +
        selectedWarrentyPrice +
        "</td>" +
        "</tr > " +
        "<tr>" +
        '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="2">TR CHARGES</td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2"class="talign">' +
        tcsAmount +
        "</td>" +
        "</tr>" +
        "<tr>" +
        '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="2">FASTAG</td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2"class="talign">' +
        priceInfomationData.fast_tag +
        "</td>" +
        "</tr>" +
        "<tr>" +
        '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2" class="tCenter"style="background-color:rgb(228, 212, 190)"><strong>NET ON ROAD PRICE</strong> </td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="2"class="talign" style="background-color:rgb(228, 212, 190)"><strong>' +
        totalOnRoadPrice +
        "</strong> </td>" +
        "</tr > " +
        "<tr>" +
        '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="4"><p style="text-decoration:underline">TERMS AND CONDITIONS</p>' +
        "" +
        "</td > " +
        "</tr > " +
        "</table > " +
        '<div class="row">' +
        '<div class="col-md-10">' +
        "</div>" +
        '<div class="col-md-2">' +
        '<p style="float: right; margin-bottom: 50px;"><b>for BHARAT HYUNDAI</b></p><br>' +
        '<p style="float: right;"><b>Authorised Signatory</b></p>' +
        "</div>" +
        "</div > " +
        '<div  style="padding-bottom: 10px; padding-left: 0px;padding-top: 10px;float: right;" data-html2canvas-ignore="true">' +
        '<ul style="list-style-type: none;display:flex">' +
        //'<li style="margin-right:10px"> <button class="btn btn-primary" (click)="submit()">back</button></li>' +
        //'<li><button class="btn btn-primary" (click)="download()">Download</button></li>' +
        "</ul>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div >";
      let bottomPitch =
        (await '<div style="padding-top:10px;" >') +
        "<p>" +
        "Thank you for using our LED Savings Calculator. Energy Lighting Services is based in Nashville, Tennessee, and has been retrofitting commercial buildings all over North America with LED lighting systems since 2010. We would be honored to help you with your project needs.Please reach out to us if you have any questions.www.energylightingservices.com  855.270.3300  info@elsco.org" +
        "<p>" +
        "</div>";
      let finalHtmlText = await siteTypeName;
      let directoryPath = "";
      if (Platform.OS === "android") {
        directoryPath = "Download";
      }
      else {
        directoryPath = "Documents";
      }
      let options = {
        html: finalHtmlText,
        fileName: "ProformaInvoice",
        directory: directoryPath,
      };
      let file = await RNHTMLtoPDF.convert(options);
      var PdfData = await RNFS.readFile(file.filePath, "base64").then();

      // RNFS.copyFile(file.filePath + "/ProformaInvoice.pdf", RNFS.DocumentDirectoryPath + "/ProformaInvoice2.pdf")

    
      
      if (from === "email") {
        await Mailer.mail(
          {
            subject: "Invoice",
            //  recipients: ['radhadevi8958@gmail.com'],
            body: "",
            attachments: [
              {
                path: file.filePath, // The absolute path of the file from which to read data.
                type: "pdf", // Mime Type: jpg, png, doc, ppt, html, pdf
                name: "ProformaInvoice.pdf", // Optional: Custom filename for attachment
              },
            ],
          },
          (error, event) => {
            if (error) {
              AlertIOS.alert(
                "Error",
                "Could not send mail. Please send a mail to support@example.com"
              );
            }
          }
        );
      }

      // alert(file.filePath);
      Alert.alert(
        'File Downloaded to following location',
        `${file.filePath}`, // <- this part is optional, you can pass an empty string
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    } catch (error) {
      alert(error);
    }
  };
  const saveProformaDetails = async (from) => {
    var proformaStatus = "";
    if (from === "save") {
      proformaStatus = "ENQUIRYCOMPLETED";
      const data1 = {
        vehicleId: selectedVehicleID,
        varientId: selectedVarientId,
        vehicleImageId: selectedvehicleImageId,
        performaUUID: proformaNo? proformaNo :"",

        crmUniversalId: universalId,
        id: selectedProformaID ? selectedProformaID :"",
        performa_status: proformaStatus,
        performa_comments: "xyz",
        oth_performa_column: {
          ex_showroom_price: priceInfomationData.ex_showroom_price,
          lifeTaxPercentage: taxPercent,
          life_tax: lifeTaxAmount,
          registration_charges: selectedRegistrationCharges?.cost ? selectedRegistrationCharges?.cost : 0,
          registrationType: selectedRegistrationCharges?.name ? selectedRegistrationCharges?.name : "",
          insurance_type: selector.insurance_type,
          insurance_value: selectedInsurencePrice,
          add_on_covers: selectedAddOnsPrice,
          waranty_name: selector.waranty_name,
          waranty_value: selectedWarrentyPrice,
          handling_charges: priceInfomationData.handling_charges,
          essential_kit: priceInfomationData.essential_kit,
          tcs_amount: tcsAmount,
          paid_access: selectedPaidAccessoriesPrice,
          fast_tag: priceInfomationData.fast_tag,
          on_road_price: totalOnRoadPrice,

          cgstsgstTaxPercentage: "",
          cessTaxPercentage: "",
          cgstsgst_tax: 0,
          cess_tax: 0,

          insurance_addon_data: "",
          accessory_items: [...selectedPaidAccessoriesList],
          promotional_offers: selector.promotional_offer,
          special_scheme: selector.consumer_offer,
          exchange_offers: selector.exchange_offer,
          corporate_offer: selector.corporate_offer,
          cash_discount: selector.cash_discount,
          insurance_discount: selector.insurance_discount,
          accessories_discount: selector.accessories_discount,
          foc_accessories: selector.for_accessories,
          additional_offer1: selector.additional_offer_1,
          additional_offer2: selector.additional_offer_2

        }
      }
      dispatch(postProformaInvoiceDetails(data1));
    }
    else if (from ==="APPROVED"){
      proformaStatus = "APPROVED";
      const data1 = {
        vehicleId: selectedVehicleID,
        varientId: selectedVarientId,
        vehicleImageId: selectedvehicleImageId,
        performaUUID: proformaNo,

        crmUniversalId: universalId,
        id: selectedProformaID,
        performa_status: proformaStatus,
        performa_comments: "xyz",
        oth_performa_column: {

          ex_showroom_price: priceInfomationData.ex_showroom_price,
          lifeTaxPercentage: taxPercent,
          life_tax: lifeTaxAmount,
          registration_charges: selectedRegistrationCharges?.cost ? selectedRegistrationCharges?.cost : 0,
          registrationType: selectedRegistrationCharges?.name ? selectedRegistrationCharges?.name : "",
          insurance_type: selector.insurance_type,
          insurance_value: selectedInsurencePrice,
          add_on_covers: selectedAddOnsPrice,
          waranty_name: selector.waranty_name,
          waranty_value: selectedWarrentyPrice,
          handling_charges: priceInfomationData.handling_charges,
          essential_kit: priceInfomationData.essential_kit,
          tcs_amount: tcsAmount,
          paid_access: selectedPaidAccessoriesPrice,
          fast_tag: priceInfomationData.fast_tag,
          on_road_price: totalOnRoadPrice,

          cgstsgstTaxPercentage: "",
          cessTaxPercentage: "",
          cgstsgst_tax: 0,
          cess_tax: 0,

          insurance_addon_data: "",
          accessory_items: [...selectedPaidAccessoriesList],
          promotional_offers: selector.promotional_offer,
          special_scheme: selector.consumer_offer,
          exchange_offers: selector.exchange_offer,
          corporate_offer: selector.corporate_offer,
          cash_discount: selector.cash_discount,
          insurance_discount: selector.insurance_discount,
          accessories_discount: selector.accessories_discount,
          foc_accessories: selector.for_accessories,
          additional_offer1: selector.additional_offer_1,
          additional_offer2: selector.additional_offer_2

        }
      }
      dispatch(postProformaInvoiceDetails(data1));
    }

    else if (from === "REJECTED")
    {
      proformaStatus = "REJECTED";
      const data1 = {
        vehicleId: selectedVehicleID,
        varientId: selectedVarientId,
        vehicleImageId: selectedvehicleImageId,
        performaUUID: proformaNo,
        crmUniversalId: universalId,
        id: selectedProformaID,
        performa_status: proformaStatus,
        performa_comments: "xyz",
        oth_performa_column: {
          ex_showroom_price: priceInfomationData.ex_showroom_price,
          lifeTaxPercentage: taxPercent,
          life_tax: lifeTaxAmount,
          registration_charges: selectedRegistrationCharges?.cost ? selectedRegistrationCharges?.cost : 0,
          registrationType: selectedRegistrationCharges?.name ? selectedRegistrationCharges?.name : "",
          insurance_type: selector.insurance_type,
          insurance_value: selectedInsurencePrice,
          add_on_covers: selectedAddOnsPrice,
          waranty_name: selector.waranty_name,
          waranty_value: selectedWarrentyPrice,
          handling_charges: priceInfomationData.handling_charges,
          essential_kit: priceInfomationData.essential_kit,
          tcs_amount: tcsAmount,
          paid_access: selectedPaidAccessoriesPrice,
          fast_tag: priceInfomationData.fast_tag,
          on_road_price: totalOnRoadPrice,

          cgstsgstTaxPercentage: "",
          cessTaxPercentage: "",
          cgstsgst_tax: 0,
          cess_tax: 0,

          insurance_addon_data: "",
          accessory_items: [...selectedPaidAccessoriesList],
          promotional_offers: selector.promotional_offer,
          special_scheme: selector.consumer_offer,
          exchange_offers: selector.exchange_offer,
          corporate_offer: selector.corporate_offer,
          cash_discount: selector.cash_discount,
          insurance_discount: selector.insurance_discount,
          accessories_discount: selector.accessories_discount,
          foc_accessories: selector.for_accessories,
          additional_offer1: selector.additional_offer_1,
          additional_offer2: selector.additional_offer_2

        }
      }
      dispatch(postProformaInvoiceDetails(data1));
    }
    else {
      proformaStatus = "SENTFORAPPROVAL";
      // todo
     
      const data = {
        vehicleId:selectedVehicleID,
        varientId: selectedVarientId,
        vehicleImageId: selectedvehicleImageId,
        performaUUID: proformaNo ? proformaNo : "",

        crmUniversalId: universalId,
        id: selectedProformaID,
        performa_status: proformaStatus,
        performa_comments: "xyz",
        oth_performa_column: {
         
          ex_showroom_price: priceInfomationData.ex_showroom_price,
          lifeTaxPercentage: taxPercent,
          life_tax: lifeTaxAmount,
          registration_charges: selectedRegistrationCharges?.cost ? selectedRegistrationCharges?.cost : 0,
          registrationType: selectedRegistrationCharges?.name ? selectedRegistrationCharges?.name : "",
          insurance_type: selector.insurance_type,
          insurance_value: selectedInsurencePrice,
          add_on_covers: selectedAddOnsPrice,
          waranty_name: selector.waranty_name,
          waranty_value: selectedWarrentyPrice,
          handling_charges: priceInfomationData.handling_charges,
          essential_kit: priceInfomationData.essential_kit,
          tcs_amount: tcsAmount,
          paid_access: selectedPaidAccessoriesPrice,
          fast_tag: priceInfomationData.fast_tag,
          on_road_price: totalOnRoadPrice,

          cgstsgstTaxPercentage : "",
          cessTaxPercentage : "",
          cgstsgst_tax : 0,
          cess_tax : 0,
      
          insurance_addon_data:"",
          accessory_items: [...selectedPaidAccessoriesList],
          promotional_offers : selector.promotional_offer,
          special_scheme : selector.consumer_offer,
          exchange_offers : selector.exchange_offer,
          corporate_offer : selector.corporate_offer,
          cash_discount : selector.cash_discount,
          insurance_discount : selector.insurance_discount,
          accessories_discount : selector.accessories_discount,
          foc_accessories : selector.for_accessories,
          additional_offer1 : selector.additional_offer_1,
          additional_offer2 : selector.additional_offer_2

        },
      };
      dispatch(postProformaInvoiceDetails(data));
    }
  };
  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();

    switch (key) {
      case "PAYMENT_AT":
        setDataForDropDown([...Payment_At_Types]);
        break;
      case "PAYMENT_AT":
        setDataForDropDown([...Payment_At_Types]);
        break;
      case "BOOKING_PAYMENT_MODE":
        setDataForDropDown([...Booking_Payment_Types]);
        break;
      case "INSURANCE_TYPE":
        if (insurenceVarientTypes.length <= 0) {
          showToast("No Insurence Types Data Found");
          return;
        }
        setDataForDropDown([...insurenceVarientTypes]);
        break;
      case "WARRANTY":
        if (warrentyTypes.length <= 0) {
          showToast("No Warranty Data Found");
          return;
        }
        setDataForDropDown([...warrentyTypes]);

        break;
      case "INSURENCE_ADD_ONS":
        if (insurenceAddOnTypes.length <= 0) {
          showToast("No AddOns Insurence Data Found");
          return;
        }
        setDataForDropDown([...insurenceAddOnTypes]);
        setShowMultipleDropDownData(true);
        break;
      case "VEHICLE_TYPE":
        setDataForDropDown([...Vehicle_Types]);
        break;
      case "CUSTOMER_TYPE_CATEGORY":
        setDataForDropDown([...Customer_Category_Types]);
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
      case "SELECTPERFORMA":
        setDataForDropDown([...proformaDataForDropdown]);
        break;
      case "REGISTRATION_CHARGES":
        setDataForDropDown([...registrationChargesType]);
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };
  const getCarModelListFromServer = async (orgId) => {
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
          // updateVariantModelsData(modelDetails.model, orgId, modalList);

          //  alert("entry---------",JSON.stringify(selector.dmsLeadProducts))
        },
        (rejected) => {
        }
      )
      .finally(() => { });
  };
  const updateVariantModelsData = (selectedModelName, orgId, modalList) => {
   
    if (!selectedModelName || selectedModelName.length === 0) {
      return;
    }

    let arrTemp = modalList.filter(function (obj) {
      return obj.model === selectedModelName;
    });
    let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
    if (carModelObj !== undefined) {
      let newArray = [];
      let mArray = carModelObj.varients;
      GetPaidAccessoriesListFromServer(
        carModelObj.vehicleId,
        orgId,
        userToken
      );

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
        // updateColorsDataForSelectedVarient(
        //   carModelObj.variant,
        //   [...mArray],
        //   orgId
        // );
      }
    }
  };
  const updateColorsDataForSelectedVarient = (
    selectedVarientName,
    varientList,
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
      const varientId = carModelObj.id;
      setSelectedVarientId(varientId);
      if(mArray.length >0){
        mArray.map((item) => {
          newArray.push({
            id: item.id,
            name: item.color,
          });
        });

        setCarColorsData([...newArray]);
      }
      
      // alert("variant id")

      // alert("success" + orgId + " varientId" + varientId)
      dispatch(
        getOnRoadPriceAndInsurenceDetailsApi({ 
          varientId: varientId,
          orgId: orgId
        })
      );
    }
  };

  const GetPaidAccessoriesListFromServer = (vehicleId, orgId, token) => {
    // Paid Accessores List
    GetPaidAccessoriesList(vehicleId, orgId, token).then(
      (res) => {
        setPaidAccessoriesList([...res]);
      },
      (err) => {
        console.error("Paid Accossories List: ", err);
      }
    );
  };
  const calculateOnRoadPrice = (
    handleSelected,
    essentialSelected,
    fastTagSelected
  ) => {
    let totalPrice = 0;
    totalPrice += priceInfomationData.ex_showroom_price;
    // const lifeTax = getLifeTax();
    let lifeTax = taxPercent !== "" ? getLifeTaxNew(Number(taxPercent)) : 0;
    setLifeTaxAmount(lifeTax);
    totalPrice += lifeTax;
    totalPrice += priceInfomationData.registration_charges;
    totalPrice += selectedRegistrationCharges?.cost || 0;
    totalPrice += selectedInsurencePrice;
    if (selector.insurance_type !== "") {
      totalPrice += selectedAddOnsPrice;
    }
    totalPrice += selectedWarrentyPrice;
    if (handleSelected) {
      totalPrice += priceInfomationData.handling_charges;
    }
    if (essentialSelected) {
      totalPrice += priceInfomationData.essential_kit;
    }
    const tcsPrice = getTcsAmount();
    setTcsAmount(tcsPrice);
    totalPrice += tcsPrice;

    if (fastTagSelected) {
      totalPrice += priceInfomationData.fast_tag;
    }
    // setTotalOnRoadPriceAfterDiscount(totalPrice - selectedFOCAccessoriesPrice);
    totalPrice += selectedPaidAccessoriesPrice;
    setTotalOnRoadPrice(totalPrice);
    setInitialTotalAmt(totalPrice);
    // setTotalOnRoadPriceAfterDiscount(totalPrice);
  };

  const calculateOnRoadPriceAfterDiscount = () => {
    let totalPrice = totalOnRoadPrice;
    totalPrice -= Number(selector.consumer_offer);
    totalPrice -= Number(selector.exchange_offer);
    totalPrice -= Number(selector.corporate_offer);
    totalPrice -= Number(selector.promotional_offer);
    totalPrice -= Number(selector.cash_discount);
    totalPrice -= Number(selector.for_accessories);
    totalPrice -= Number(selector.insurance_discount);
    totalPrice -= Number(selector.accessories_discount);
    totalPrice -= Number(selector.additional_offer_1);
    totalPrice -= Number(selector.additional_offer_2);
    // if (accDiscount !== '') {
    //     totalPrice -= Number(accDiscount);
    // }
    // if (insuranceDiscount !== '') {
    //     totalPrice -= Number(insuranceDiscount);
    // }
    setTotalOnRoadPriceAfterDiscount(totalPrice);
  };
  const getLifeTaxNew = (val) => {
    return priceInfomationData.ex_showroom_price * (val / 100);
  };

  const getTcsAmount = () => {
    let amount = 0;
    if (priceInfomationData.ex_showroom_price > 1000000) {
      amount =
        priceInfomationData.ex_showroom_price *
        (priceInfomationData.tcs_percentage / 100);
    } else {
      amount = priceInfomationData.tcs_amount;
    }
    return amount;
  };

  const updateAccordian = (selectedIndex) => {
    Keyboard.dismiss();
    if (selectedIndex != openAccordian) {
      setOpenAccordian(selectedIndex);
    } else {
      setOpenAccordian(0);
    }
  };


  const updateProformaDataforSelectedValue = (id,
    selectedProformaName,
    proformaData
  ) => {
    if (!selectedProformaName || selectedProformaName.length === 0) {
      return;
    }

    let arrTemp = proformaData.filter(function (obj) {
      return obj.id === id;
    });
   
    let tempArrr = arrTemp.length > 0 ? arrTemp[0] : undefined;
    if (tempArrr !== undefined) {
      let newSelectedProforma = [];
      let mArray = selector.proforma_listingdata;
   
        
      if (mArray.length > 0) {
         newSelectedProforma = mArray.filter((item) => item.id === id);
         // todo
      
        if (newSelectedProforma[0].performa_status === "PENDING_APPROVAL" ||
          newSelectedProforma[0].performa_status === "SENTFORAPPROVAL") {
          setShowApproveRejectBtn(true);
          setshowSendForApprovBtn(false);
          setshowSaveBtn(false);
        }
        if (newSelectedProforma[0].performa_status === "APPROVED" || newSelectedProforma[0].performa_status === "APPROVE"){
          setisDownLoadVisible(true);
          
        }else{
          // setisDownLoadVisible(false);
        }
        if (newSelectedProforma[0].performa_status === "ENQUIRYCOMPLETED") {
            setshowSaveBtn(true);
            setshowSendForApprovBtn(true);
          }

        if (newSelectedProforma[0].performa_status === "REJECT" || newSelectedProforma[0].performa_status === "REJECTED") {
          setisDownLoadVisible(false);
          setshowSendForApprovBtn(true);
          setshowSaveBtn(true);
        } else {
          // setisDownLoadVisible();
        }
        setSelectedDate(moment(newSelectedProforma[0].created_date).format("DD/MM/YYYY"));
        setProformaNo(newSelectedProforma[0].performaUUID);
        setselectedVehicleID(newSelectedProforma[0].vehicleId);
        setSelectedVarientId(newSelectedProforma[0].varientId);
        setselectedvehicleImageId(newSelectedProforma[0].vehicleImageId);
        setselectedProformaID(newSelectedProforma[0].id);
       
        let oth_performa_column = JSON.parse(newSelectedProforma[0].oth_performa_column)
        
        
          dispatch(setOfferPriceDataForSelectedProforma(oth_performa_column))

          setSelectedWarrentyPrice(Number(oth_performa_column.waranty_value));
          dispatch(
            setDropDownData({ key: "WARRANTY", value: oth_performa_column.waranty_name, id: "" })
          );
        setTaxPercent(oth_performa_column.lifeTaxPercentage.toString());
        setLifeTaxAmount(getLifeTaxNew(Number(oth_performa_column.lifeTaxPercentage)));
       
        let tempRegistrationCharge = {
          cost: oth_performa_column.registration_charges,
          name: oth_performa_column.registrationType
        }
        setSelectedRegistrationCharges(tempRegistrationCharge);
        dispatch(
          setDropDownData({ key: "INSURANCE_TYPE", value: oth_performa_column.insurance_type, id: "" })
        );
        if (Number(oth_performa_column.insurance_value) > 0){
          setSelectedInsurencePrice(Number(oth_performa_column.insurance_value));
        }else{
          setSelectedInsurencePrice(0);
        }
        
        // let tempAddonData = {
        //   cost: oth_performa_column.add_on_covers,
        //   document_name: "Zero Dip",
        //   name: "Zero Dip",
        //   selected: true
        // }
        if (Number(oth_performa_column.add_on_covers) > 0 ){
          setSelectedAddOnsPrice(Number(oth_performa_column.add_on_covers));
        }else{
          setSelectedAddOnsPrice(0);
        }
       
        
        if (Number(oth_performa_column.handling_charges) > 0 ){
          setHandlingChargSlctd(true);
        }else{
          setHandlingChargSlctd(false);
        }
        if (Number(oth_performa_column.essential_kit) > 0){
          setEssentialKitSlctd(true);
        }else{
          setEssentialKitSlctd(false);
        }
     
        if (Number(oth_performa_column.paid_access) > 0){
          setSelectedPaidAccessoriesPrice(oth_performa_column.paid_access)
        }else{
          setSelectedPaidAccessoriesPrice(0)
        }

      
        if (oth_performa_column.accessory_items.length > 0){
          let tempAccessoryArr = [];
         
          oth_performa_column.accessory_items.forEach((item) => {
         
            tempAccessoryArr.push({
              "id": item.id,
              "vehicleId": "",
              "origanistionId": orgId,
              "category": "",
              "item": item.dmsAccessoriesType,
              "partName": item.accessoriesName,
              "cost": item.amount,
              "createdBy": "",
              "partNo": "",
              "imageUrl": "",
              "createdDate": "",
              "modifiedBy": "",
              "modifiedDate": null,
              "selected": true
            })
            
          })

          updatePaidAccessroies(tempAccessoryArr);
        }  
        
        if (Number(oth_performa_column.fast_tag) > 0){
          setFastTagSlctd(true);
        }else{
          setFastTagSlctd(false);
        }
        
        
        // todo need to figurout how to do auto fill for warranty etc 
        // setPriceInformationData({
        //   ex_showroom_price: oth_performa_column.ex_showroom_price,
        //   ex_showroom_price_csd: 0,
        //   registration_charges: oth_performa_column.registration_charges.toString(),
        //   handling_charges: oth_performa_column.handling_charges,
        //   tcs_percentage: oth_performa_column.tcs_percentage,
        //   tcs_amount: oth_performa_column.tcs_amount,
        //   essential_kit: oth_performa_column.essential_kit,
        //   fast_tag: oth_performa_column.fast_tag,
        //   vehicle_road_tax: 0,
        // });
      }
      setSelectedProfromaData(newSelectedProforma)
     
   
      let carmodalObj = [...carModelsData];
      
     // filter for selected proforma car details 
     let carModalNameTemp = "";
     let carModalVarientNameTemp = "";
     let carModalColorTemp = "";
      carmodalObj.filter((item) => {
        if (item.vehicleId === newSelectedProforma[0].vehicleId){
          [item].map((carModalName)=>{
           
            carModalNameTemp = carModalName.model;
            carModalName.varients.filter((variantItems)=>{
             
              if (variantItems.id === newSelectedProforma[0].varientId){
                
                carModalVarientNameTemp = variantItems.name;

                variantItems.vehicleImages.filter((carColor)=>{
              
                  if (carColor.vehicleImageId === newSelectedProforma[0].vehicleImageId){
                    carModalColorTemp = carColor.color;
                   
                  }
                })
              }
            })
          })
        }
      }
      )
      GetPaidAccessoriesListFromServer(
        newSelectedProforma[0].vehicleId,
        orgId,
        userToken
      );
     
      setCarModel(carModalNameTemp);
      setCarVariant(carModalVarientNameTemp);
   
      setCarColor(carModalColorTemp);
      
      dispatch(
        getOnRoadPriceAndInsurenceDetailsApi({
          varientId: newSelectedProforma[0].varientId,
          orgId: orgId
        })
      );

    }
  };

  const isInputsEditable = () => {
    let isInputEditFlag = true;
    // if (
    //   selector &&
    //   selector.pre_booking_details_response &&
    //   selector.pre_booking_details_response.dmsLeadDto
    // ) {
    //   const { leadStatus } = selector.pre_booking_details_response.dmsLeadDto;
    //   if (!userData.isManager || isLeadCreatedBySelf()) {
    //     if (leadStatus === "ENQUIRYCOMPLETED") {
    //       isInputEditFlag = true;
    //     } else if (!isEditButtonShow && leadStatus !== "SENTFORAPPROVAL") {
    //       isInputEditFlag = true;
    //     }
    //   }
    // }

    return isInputEditFlag;
  }

  const clearPriceConfirmationData = () => {
    setSelectedRegistrationCharges({});
    setRegistrationChargesType([]);
    setInsurenceAddOnTypes([]);
    setSelectedInsurencePrice(0);
    setPriceInformationData({
      ex_showroom_price: 0,
      ex_showroom_price_csd: 0,
      registration_charges: 0,
      handling_charges: 0,
      tcs_percentage: 0,
      tcs_amount: 0,
      essential_kit: 0,
      fast_tag: 0,
      vehicle_road_tax: 0,
    });
    setSelectedWarrentyPrice(0);
    setHandlingChargSlctd(false);
    setEssentialKitSlctd(false);
    setFastTagSlctd(false);
    calculateOnRoadPrice(false, false, false);
    setTaxPercent("");
    setLifeTaxAmount(0);
    setInsuranceDiscount("");
    setAccDiscount("");
    setPaidAccessoriesListNew([]);
    setSelectedPaidAccessoriesPrice(0);
    setTotalOnRoadPrice(0);
    setTcsAmount(0);
    setTotalOnRoadPriceAfterDiscount(0);
    // setHandlingChargSlctd(false);
    // setEssentialKitSlctd(false);
    // setSelectedPaidAccessoriesPrice(0)
    // setFastTagSlctd(false);
    setSelectedAddOnsPrice(0);
    // setSelectedInsurencePrice(0);

    dispatch(
      setDropDownData({ key: "INSURANCE_TYPE", value: "", id: "" })
    );
    dispatch(
      setDropDownData({ key: "WARRANTY", value: "", id: "" })
    );

  };

  // Check for lead created by manager
  const isLeadCreatedBySelf = () => {
   
    let isCreatedBy = false;
    if (
      userData &&
      selector &&
      selector.enquiry_details_response &&
      selector.enquiry_details_response.dmsLeadDto
    ) {
      
      if (
        userData.employeeName ==
        selector.enquiry_details_response.dmsLeadDto.createdBy
      ) {
        isCreatedBy = true;
      }
    }
    
    return isCreatedBy;
  }


  const goParentScreen = () => {
    dispatch(clearStateData());
    newProformaClick();
    navigation.goBack();
  };
  return (
    <View>
      <DropDownComponant
        visible={showDropDownModel}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        multiple={showMultipleDropDownData}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          setShowDropDownModel(false);
          setShowMultipleDropDownData(false);
          if (dropDownKey === "MODEL") {
            setCarModel(item.name)
            setCarVariant("")
            setCarColor("")
            setselectedVehicleID(item.id);
       
            updateVariantModelsData(item.name, orgId, carModelsData);
          } else if (dropDownKey === "VARIENT") {
            setCarVariant(item.name)
            setCarColor("")
            
            updateColorsDataForSelectedVarient(
              item.name,
              selectedCarVarientsData.varientList
            );
          }
          else if (dropDownKey === "COLOR") {
            setCarColor(item.name)
            setselectedvehicleImageId(item.id)
            // updateColor(item);
          }
          else if (dropDownKey === "SELECTPERFORMA") {
           
            setSelectedProfroma(item.name)
            updateProformaDataforSelectedValue(item.id, item.name, [...proformaDataForDropdown]);

          } else if (dropDownKey === "INSURANCE_TYPE") {
            
            setSelectedInsurencePrice(item.cost);
          } else if (dropDownKey === "WARRANTY") {
            setSelectedWarrentyPrice(Number(item.cost));
          } else if (dropDownKey === "DROP_REASON") {
            const payload = {
              bu: orgId,
              dropdownType: "PreBook_Lost_Com_Sub_Reas",
              parentId: item.id,
            };
            dispatch(getDropSubReasonDataApi(payload));
          } else if (dropDownKey === "INSURENCE_ADD_ONS") {
           
            let totalCost = 0;
            let names = "";
            let insurenceAddOns = [];
            if (item.length > 0) {
              item.forEach((obj, index) => {
                totalCost += Number(obj.cost);
                names += obj.name + (index + 1 < item.length ? ", " : "");
                insurenceAddOns.push({
                  insuranceAmount: obj.cost,
                  insuranceAddonName: obj.name,
                });
              });
            }
            setSelectedAddOnsPrice(totalCost);
            setSelectedInsurenceAddons([...insurenceAddOns]);
            dispatch(
              setDropDownData({ key: dropDownKey, value: names, id: "" })
            );
            return;
          }
          else if (dropDownKey === "REGISTRATION_CHARGES") {
            setSelectedRegistrationCharges(item);
          }
          dispatch(
            setDropDownData({
              key: dropDownKey,
              value: item.name,
              id: item.id,
            })
          );
        }}
      />
    
     

      <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: '2%' }}>
        <Button
          mode="contained"
          style={{ flex: 1, marginRight: 10 }}
          color={selectedProfroma !== "" ? Colors.WHITE :Colors.PINK}
          labelStyle={{ textTransform: "none" }}
          onPress={() => selectPerformaClick()}>
          {selectedProfroma !== "" ? selectedProfroma : "Select Proforma"}
        </Button>


        <Button
          mode="contained"
          style={{ flex: 1, }}
          color={Colors.PINK}
          labelStyle={{ textTransform: "none" }}
          onPress={() => newProformaClick()}>
          New Proforma
        </Button>
      </View>

      <View>
        {isnewProformaClicked ? <List.AccordionGroup
          expandedId={openAccordian}
          onAccordionPress={(expandedId) => updateAccordian(expandedId)}
        >
          <List.Accordion
            id={"5"}
            title={"Vehicle Selection"}
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
                marginTop: '2%'
              },
              styles.accordianBorder,
            ]}
          >
            <DropDownSelectionItem
              label={"Vehicle"}
              value={carModel}
              onPress={() =>
                showDropDownModelMethod("MODEL", "Select Vehicle")
              }
            />

            <DropDownSelectionItem
              label={"Variant"}
              value={carVariant}
              onPress={() => {
                if(carModel != "" ){
                  showDropDownModelMethod("VARIENT", "Select Variant")
                }else{
                  showToast("Please Select Vehicle")
                }
                
              }
              
              }
            />

            <DropDownSelectionItem
              label={"Color"}
              value={carColor}
              onPress={() =>{
                if (carModel != "" && carVariant != "") {
                  showDropDownModelMethod("COLOR", "Select Color")
                } else {
                  showToast("Please Select Variant")
                }
                
              }
               
              }
            />
          
          </List.Accordion>
        </List.AccordionGroup> : null}

      </View>

      {/* main view to manage visibility  */}
      <View>
        {selectedProfroma != "" || carModel != "" ?
          <>
            

            {/* Proforma Invoice section */}
            <View
              style={{
                margin: 10,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.BLACK,
                paddingBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.PINK,
                  textAlign: "center",
                  margin: 10,
                }}>
                Proforma Invoice
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  // padding: 5,
                }}>
                <Image
                  style={styles.ImageStyleS}
                  source={{ uri: selector.proforma_logo }}
                  resizeMode="stretch"
                />
                {/* <Text
                  style={{
                    fontSize: 18,
                    color: Colors.PINK,
                    textAlign: "center",
                    marginLeft: 10,
                  }}>
                  {selector.proforma_orgName}
                </Text> */}
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.BLACK,
                  textAlign: "center",
                  marginLeft: 10,
                  marginBottom: 10,
                  marginTop:10
                }}>
                {/* {selector.proforma_address} */}
                {selector.proforma_houseNo + ", " +selector.proforma_branch +
                  ", " +
                  selector.proforma_city +
                  ", " +
                  selector.proforma_state + ", " + selector.proforma_pincode}
              </Text>
              
              <TextAndAmountComp title={"LESSEE"} text={
                 
                formateLesseName()
                } />
              <TextAndAmountComp title={"LESSOR"} text={
              selector.proforma_orgName
              } />
              <TextAndAmountComp title={"GSTN"} text={
                selector.proforma_gstnNumber
              } />
              {/* <TextAndAmountComp title={"Name"} text={modelDetails?.model} /> */}
              <TextAndAmountComp
                title={"Date"}
                text={selectedDate}
              />
              {/* <TextAndAmountComp title={"Name"} text={modelDetails?.model} />
              <TextAndAmountComp title={"Model"} text={modelDetails?.variant} />
              <TextAndAmountComp title={"Color"} text={modelDetails?.color} /> */}
              {carModel != "" && <TextAndAmountComp title={"Name"} text={carModel} /> } 
              {carVariant != "" && <TextAndAmountComp title={"Model"} text={carVariant} />}  
              {carColor != "" && <TextAndAmountComp title={"Color"} text={carColor} />} 
              {proformaNo != "" && <TextAndAmountComp
                title={"PROFORMA NO:"}
                text={proformaNo}
              /> }
              {selector.pan_number != "" &&
               <TextAndAmountComp
                title={"PAN NO :"}
                text={selector.pan_number}
              /> }
              
              {/* <TextAndAmountComp
                title={"Amount"}
                text={totalOnRoadPrice.toFixed(2)}
              /> */}
            </View>

            <View
              style={{
                margin: 10,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.BLACK,
                paddingBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.PINK,
                  textAlign: "center",
                  margin: 10,
                }}>
                Description
              </Text>

              <TextAndAmountComp
                title={"Ex-Showroom Price:"}
                amount={priceInfomationData.ex_showroom_price.toFixed(2)}
              />

              {selector.vechicle_registration ? (
                <View>
                  <DropDownSelectionItem
                    label={"Vehicle Type"}
                    value={selector.vehicle_type}
                    onPress={() =>
                      showDropDownModelMethod("VEHICLE_TYPE", "Vehicle Type")
                    }
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.registration_number}
                    label={"Reg. No"}
                    maxLength={15}
                    autoCapitalize={"characters"}
                    onChangeText={(text) =>
                      dispatch(
                        setPriceConformationDetails({
                          key: "REGISTRATION_NUMBER",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                </View>
              ) : null}

              {/* <TextAndAmountComp
                                    title={"Life Tax:"}
                                    amount={lifeTaxAmount.toFixed(2)}
                                /> */}
              <View style={styles.textAndAmountView}>
                {/* <View style={{width: '60%', flexDirection: 'row'}}> */}
                <Text style={[styles.leftLabel]}>{"Life Tax:"}</Text>
                {/* </View> */}
                <View
                  style={{
                    width: 100,
                    // height: 30,
                    // justifyContent: 'center',
                    paddingHorizontal: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#d1d1d1",
                  }}>
                  <TextInput
                    value={taxPercent}
                    style={[{ fontSize: 14, fontWeight: "400",color:Colors.BLACK }]}
                    keyboardType={"number-pad"}
                    onChangeText={(text) => {
                    
                      setTaxPercent(text);
                      if (text !== "") {
                        setLifeTaxAmount(getLifeTaxNew(Number(text)));
                      } else {
                        setLifeTaxAmount(0);
                      }
                    }}
                  />
                </View>
                <Text style={{ fontSize: 14, fontWeight: "400" }}>
                  {rupeeSymbol + " " + lifeTaxAmount.toFixed(2)}
                </Text>
              </View>

              <Text style={GlobalStyle.underline}></Text>

              <View style={styles.symbolview}>
                <View style={{ width: "70%" }}>
                  <DropDownSelectionItem
                    disabled={!isInputsEditable()}
                    label={"Registration Charges:"}
                    value={selectedRegistrationCharges?.name}
                    onPress={() =>
                      showDropDownModelMethod(
                        "REGISTRATION_CHARGES",
                        "Registration Charges"
                      )
                    }
                  />
                </View>

                <Text style={styles.shadowText}>
                  {rupeeSymbol +
                    " " +
                    `${selectedRegistrationCharges?.cost
                      ? selectedRegistrationCharges?.cost
                      : "0.00"
                    }`}
                </Text>
              </View>
              {/* <TextAndAmountComp
                title={"Registration Charges:"}
                amount={priceInfomationData.registration_charges.toFixed(2)}
              /> */}
              <Text style={GlobalStyle.underline}></Text>

              <View style={styles.symbolview}>
                <View style={{ width: "70%" }}>
                  <DropDownSelectionItem
                    label={"Insurance Type"}
                    value={selector.insurance_type}
                    onPress={() =>
                      showDropDownModelMethod("INSURANCE_TYPE", "Insurance Type")
                    }
                  />
                </View>
                <Text style={styles.shadowText}>
                  {rupeeSymbol + " " + selectedInsurencePrice.toFixed(2)}
                </Text>
              </View>
              <View style={styles.symbolview}>
                <View style={{ width: "70%" }}>
                  <DropDownSelectionItem
                    label={"Add-on Insurance"}
                    value={
                      selector.insurance_type !== "" ? selector.add_on_insurance : ""
                    }
                    disabled={!selector.insurance_type}
                    onPress={() =>
                      showDropDownModelMethod("INSURENCE_ADD_ONS", "Add-on Insurance")
                    }
                  />
                </View>
                {selector.insurance_type !== "" ? (
                  <Text style={styles.shadowText}>
                    {rupeeSymbol + " " + selectedAddOnsPrice.toFixed(2)}
                  </Text>
                ) : (
                  <Text style={styles.shadowText}>{rupeeSymbol + " 0.00"}</Text>
                )}
              </View>
              <View style={styles.symbolview}>
                <View style={{ width: "70%" }}>
                  <DropDownSelectionItem
                    label={"Warranty"}
                    value={selector.warranty}
                    onPress={() => showDropDownModelMethod("WARRANTY", "Warranty")}
                  />
                </View>
                <Text style={styles.shadowText}>
                  {rupeeSymbol + " " + selectedWarrentyPrice.toFixed(2)}
                </Text>
              </View>
              <Text style={GlobalStyle.underline}></Text>

              <CheckboxTextAndAmountComp
                title={"Handling Charges:"}
                amount={
                  handlingChargSlctd
                    ? priceInfomationData.handling_charges.toFixed(2)
                    : 0
                }
                // amount={handlingChargSlctd ? priceInfomationData.handling_charges.toFixed(2) : "0.00"}
                isChecked={handlingChargSlctd}
                onPress={() => {
                  setHandlingChargSlctd(!handlingChargSlctd);
                  calculateOnRoadPrice(
                    !handlingChargSlctd,
                    essentialKitSlctd,
                    fastTagSlctd
                  );
                }}
              />
              <Text style={GlobalStyle.underline}></Text>

              <CheckboxTextAndAmountComp
                title={"Essential Kit:"}
                amount={
                  essentialKitSlctd ? priceInfomationData.essential_kit.toFixed(2) : 0
                }
                // amount={essentialKitSlctd ? priceInfomationData.essential_kit.toFixed(2) : "0.00"}
                isChecked={essentialKitSlctd}
                onPress={() => {
                  setEssentialKitSlctd(!essentialKitSlctd);
                  calculateOnRoadPrice(
                    handlingChargSlctd,
                    !essentialKitSlctd,
                    fastTagSlctd
                  );
                }}
              />
              <Text style={GlobalStyle.underline}></Text>

              <TextAndAmountComp
                title={"TCS(>=10Lakhs -> 1%):"}
                amount={tcsAmount.toFixed(2)}
              />
              <Text style={GlobalStyle.underline}></Text>

              <Pressable
                onPress={() =>
                  navigation.navigate(
                    AppNavigator.EmsStackIdentifiers.paidAccessories,
                    {
                      accessorylist: paidAccessoriesList,
                      selectedAccessoryList: selectedPaidAccessoriesList,
                      selectedFOCAccessoryList: selectedFOCAccessoriesList,
                      fromScreen: "PROFORMA"
                    }
                  )
                }>
                <PaidAccessoriesTextAndAmountComp
                  title={"Paid Accessories:"}
                  amount={selectedPaidAccessoriesPrice.toFixed(2)}
                />
              </Pressable>
              <Text style={GlobalStyle.underline}></Text>
              {paidAccessoriesListNew.length > 0 ? (
                <View
                  style={{
                    backgroundColor: Colors.WHITE,
                    paddingLeft: 12,
                    paddingTop: 5,
                  }}>
                  {paidAccessoriesListNew.map((item, index) => {
                    return (
                      <Text style={styles.accessoriText} key={"ACC" + index}>
                        {item.accessoriesName + " - " + item.amount}
                      </Text>
                    );
                  })}
                  <Text style={[GlobalStyle.underline, { marginTop: 5 }]}></Text>
                </View>
              ) : null}

              <CheckboxTextAndAmountComp
                title={"Fast Tag:"}
                amount={fastTagSlctd ? priceInfomationData?.fast_tag?.toFixed(2) : 0}
                // amount={fastTagSlctd ? priceInfomationData.fast_tag.toFixed(2) : "0.00"}
                isChecked={fastTagSlctd}
                onPress={() => {
                  setFastTagSlctd(!fastTagSlctd);
                  calculateOnRoadPrice(
                    handlingChargSlctd,
                    essentialKitSlctd,
                    !fastTagSlctd
                  );
                }}
              />
              {/* <TextAndAmountComp
                  title={"Fast Tag:"}
                  amount={priceInfomationData.fast_tag.toFixed(2)}
                /> */}
              <Text style={GlobalStyle.underline}></Text>

              <TextAndAmountComp
                title={"On Road Price:"}
                amount={totalOnRoadPrice.toFixed(2)}
                titleStyle={{ fontSize: 18, fontWeight: "800" }}
                amoutStyle={{ fontSize: 18, fontWeight: "800" }}
              />
              {/* <Text style={GlobalStyle.underline}></Text> */}


              {/* // 6.Offer Price */}
              {/* <List.Accordion
                id={"6"}
                title={"Offer Price"}
                description={
                  rupeeSymbol + " " + totalOnRoadPriceAfterDiscount.toFixed(2)
                }
                titleStyle={{
                  color: openAccordian === "6" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                descriptionStyle={{
                  color: openAccordian === "6" ? Colors.BLACK : Colors.BLACK,
                  paddingTop: 5,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "6" ? Colors.RED : Colors.WHITE,
                  },
                  styles.accordianBorder,
                ]}
              > */}
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Consumer Offer:"}
                  value={selector.consumer_offer}
                  showLeftAffixText={true}
                  leftAffixText={rupeeSymbol}
                  keyboardType="number-pad"
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "CONSUMER_OFFER",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Exchange Offer:"}
                  value={selector.exchange_offer}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "EXCHANGE_OFFER",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Corporate Offer:"}
                  value={selector.corporate_offer}
                  showLeftAffixText={true}
                  leftAffixText={rupeeSymbol}
                  keyboardType="number-pad"
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "CORPORATE_OFFER",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Promotional Offer:"}
                  value={selector.promotional_offer}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "PROMOTIONAL_OFFER",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Cash Discount:"}
                  value={selector.cash_discount}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "CASH_DISCOUNT",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Foc Accessories:"}
                  value={selector.for_accessories}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "FOR_ACCESSORIES",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Insurance Discount:"}
                  value={selector.insurance_discount}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "INSURANCE_DISCOUNT",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Accessories Discount:"}
                  value={selector.accessories_discount}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "ACCESSORIES_DISCOUNT",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>

                {/* <View style={styles.textAndAmountView}>
                                    <Text style={{ fontSize: 16, fontWeight: '400', color: Colors.GRAY }}>{"Insurance Discount:"}</Text>
                                    <View style={{ width: 80, height: 30, justifyContent: 'center', paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#d1d1d1' }}>
                                        <TextInput
                                            value={insuranceDiscount}
                                            style={[{ fontSize: 14, fontWeight: "400", }]}
                                            keyboardType={"number-pad"}
                                            onChangeText={(text) => {
                                                setInsuranceDiscount(text)
                                            }}
                                        />
                                    </View>
                                </View> */}
                {/* <View style={styles.textAndAmountView}>
                                    <Text style={{ fontSize: 16, fontWeight: '400', color: Colors.GRAY }}>{"Accessories Discount:"}</Text>
                                    <View style={{ width: 80, height: 30, justifyContent: 'center', paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#d1d1d1' }}>
                                        <TextInput
                                            value={accDiscount}
                                            style={[{ fontSize: 14, fontWeight: "400", }]}
                                            keyboardType={"number-pad"}
                                            onChangeText={(text) => {
                                                setAccDiscount(text)
                                            }}
                                        />
                                    </View>
                                </View> */}
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Additional Offer 1:"}
                  value={selector.additional_offer_1}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "ADDITIONAL_OFFER_1",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Additional Offer 2:"}
                  value={selector.additional_offer_2}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "ADDITIONAL_OFFER_2",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>

                <TextAndAmountComp
                  title={"On Road Price After Discount:"}
                  amount={totalOnRoadPriceAfterDiscount.toFixed(2)}
                  titleStyle={{ fontSize: 18, fontWeight: "800" }}
                  amoutStyle={{ fontSize: 18, fontWeight: "800" }}
                />
                {/* <Text style={GlobalStyle.underline}></Text> */}
              {/* </List.Accordion> */}
            </View>
            {/* {showApproveRejectBtn && */}
              <View
                style={{
                  flexDirection: "row", alignSelf: "flex-end"
                  
                }}>
              {showSaveBtn &&
                  <Button
                    mode="contained"
                    style={{ flex:1,marginRight: showSendForApprovBtn?  10: 0 }}
                    color={Colors.PINK}
                    labelStyle={{ textTransform: "none" }}
                    onPress={() => saveProformaDetails("save")}>
                    Save
                  </Button>
                  }

                {showSendForApprovBtn &&
                  <Button
                    mode="contained"
                    style={{ flex: 1 }}
                    color={Colors.PINK}
                    labelStyle={{ textTransform: "none" }}
                  onPress={() => saveProformaDetails("SENTFORAPPROVAL")}>
                    Send For Approval
                  </Button>}

              </View>
            {/* } */}
           

            {showApproveRejectBtn &&
              // !isLeadCreatedBySelf() &&
              userData.isPreBookingApprover &&
               (
                <View style={styles.actionBtnView}>
                  {!isRejectSelected && (
                    <Button
                      mode="contained"
                    style={{ flex: 1, marginRight: 10 }}
                      color={Colors.GREEN}
                      labelStyle={{ textTransform: "none" }}
                    onPress={() => saveProformaDetails("APPROVED")}
                    >
                      Approve
                    </Button>
                  )}
                {!isRejectSelected && <Button
                  mode="contained"
                  style={{ flex: 1, }}
                  color={Colors.RED}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() =>
                    isRejectSelected
                      ? saveProformaDetails("REJECTED")
                      : setIsRejectSelected(true)
                  }
                >
                  {isRejectSelected ? "Submit" : "Reject"}
                </Button>}
                </View>
              )}
            {isDownLoadVisible &&
              <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
                <Button
                  mode="contained"
                  style={{ flex: 1, marginRight: 10 }}
                  // style={{ width: '30%', marginRight: 10 }}
                  color={Colors.PINK}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() => downloadPdf2("downlaod")}>
                  Download
                </Button>
                <Button
                  mode="contained"
                  style={{ flex: 1, }}
                  // style={{ width: '30%', }}
                  color={Colors.PINK}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() => downloadPdf("email")}>
                  Email
                </Button>
              </View>}

            {/* {showApproveRejectBtn && userData.isSelfManager == "Y" ? (
              <View style={styles.actionBtnView}>
                {!isRejectSelected && (
                  <Button
                    mode="contained"
                    style={{ width: 120 }}
                    color={Colors.GREEN}
                    labelStyle={{ textTransform: "none" }}
                    onPress={() => approveOrRejectMethod("APPROVE")}
                  >
                    Approve
                  </Button>
                )}
                <Button
                  mode="contained"
                  color={Colors.RED}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() =>
                    isRejectSelected
                      ? approveOrRejectMethod("REJECT")
                      : setIsRejectSelected(true)
                  }
                >
                  {isRejectSelected ? "Submit" : "Reject"}
                </Button>
              </View>
            ) : null} */}


          </> : null}

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  textInputStyle: {
    height: 65,
    width: "100%",
  },
  textAndAmountView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    minHeight: 40,
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: Colors.WHITE,
  },
  offerPriceTextInput: {
    height: 55,
    width: "100%",
  },
  actionBtnView: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  symbolview: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingRight: 12,
    backgroundColor: Colors.WHITE,
  },
  shadowText: {
    width: "30%",
    backgroundColor: Colors.WHITE,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "400",
  },
  ImageStyleS: {
    width: 100,
    height: 100,
   
    alignSelf:"center"
  },
  accordianBorder: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "#7a7b7d",
  },
  leftLabel: {
    fontSize: 14,
    fontWeight: "400",
    maxWidth: "70%",
    color: Colors.GRAY,
  },
})
