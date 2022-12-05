import React, { useState, useEffect } from "react";
import { View, StyleSheet, Keyboard, Text, TextInput, Pressable, Image } from "react-native";
import { DropDownSelectionItem } from "../../../../pureComponents";
import { TextinputComp, DropDownComponant } from "../../../../components";
import { GlobalStyle, Colors } from "../../../../styles";
import { showToast } from "../../../../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, List, Button, IconButton } from "react-native-paper";
import moment from "moment";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Mailer from 'react-native-mail';
var RNFS = require('react-native-fs');


import * as AsyncStore from "../../../../asyncStore";
import {
  getLogoNameApi, getOnRoadPriceAndInsurenceDetailsApi, setDropDownData,
   postProformaInvoiceDetails, getProformaListingDetailsApi, setOfferPriceDetails,
  setOfferPriceDataForSelectedProforma, clearOfferPriceData
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
  userData,
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


  const [selectedCarVarientsData, setSelectedCarVarientsData] = useState({
    varientList: [],
    varientListForDropDown: [],
  });
  const [carColorsData, setCarColorsData] = useState([]);
  // const [carModalData, setcarModalData] = useState([]);

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
    let salutationTemp = selector.enquiry_details_response.dmsAccountDto.salutation ? 
        selector.enquiry_details_response.dmsAccountDto.salutation+" " : "";
    let firstNameTemp = selector.enquiry_details_response.dmsAccountDto.firstName ? 
      selector.enquiry_details_response.dmsAccountDto.firstName + " " : "";
    let lastNametemp = selector.enquiry_details_response.dmsAccountDto.lastName?
      selector.enquiry_details_response.dmsAccountDto.lastName : "";

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
  }
  const selectPerformaClick = () => {
    setisSelectPerformaClick(true)
    setisnewProformaClicked(false)
    showDropDownModelMethod("SELECTPERFORMA", "Select Proforma")
  }

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
        '<td style=" border: 1px solid black; border-collapse: collapse;" >NAME :</td>' +
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
        modelDetails.model +
        "</td>" +
        "</tr>" +
        '<tr class="tCenter">' +
        '<td style=" border: 1px solid black; border-collapse: collapse;" >VARIANT</td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;">' +
        modelDetails.variant +
        "</td>" +
        " </tr > " +
        '< tr class="tCenter" > ' +
        '<td style=" border: 1px solid black; border-collapse: collapse;">COLOUR</td>' +
        '<td style=" border: 1px solid black; border-collapse: collapse;">' +
        modelDetails.color +
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

      let options = {
        html: finalHtmlText,
        fileName: "ProformaInvoice",
        directory: "B2B",
      };
      let file = await RNHTMLtoPDF.convert(options);
      var PdfData = await RNFS.readFile(file.filePath, "base64").then();
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

      alert(file.filePath);
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
        performaUUID: proformaNo,



        crmUniversalId: universalId,
        id: "",
        performa_status: proformaStatus,
        performa_comments: "xyz",
        oth_performa_column: {
          // ex_showroom_price: priceInfomationData.ex_showroom_price,
          // lifeTaxPercentage: taxPercent,
          // life_tax: lifeTaxAmount,
          // registration_charges: priceInfomationData.registration_charges,
          // insurance_type: selector.insurance_type,
          // insurance_value: selectedInsurencePrice,
          // add_on_covers: selectedAddOnsPrice,
          // waranty_name: selector.waranty_name,
          // waranty_value: selectedWarrentyPrice,
          // handling_charges: priceInfomationData.handling_charges,
          // essential_kit: priceInfomationData.essential_kit,
          // tcs_amount: tcsAmount,
          // paid_access: selectedPaidAccessoriesPrice,
          // fast_tag: priceInfomationData.fast_tag,
          // on_road_price: totalOnRoadPrice,


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
    } else {
      proformaStatus = "SENTFORAPPROVAL";
      // todo
     
      const data = {
        vehicleId:selectedVehicleID,
        varientId: selectedVarientId,
        vehicleImageId: selectedvehicleImageId,
        performaUUID:proformaNo,



        crmUniversalId: universalId,
        id: selectedProformaID,
        performa_status: proformaStatus,
        performa_comments: "xyz",
        oth_performa_column: {
          // ex_showroom_price: priceInfomationData.ex_showroom_price,
          // lifeTaxPercentage: taxPercent,
          // life_tax: lifeTaxAmount,
          // registration_charges: priceInfomationData.registration_charges,
          // insurance_type: selector.insurance_type,
          // insurance_value: selectedInsurencePrice,
          // add_on_covers: selectedAddOnsPrice,
          // waranty_name: selector.waranty_name,
          // waranty_value: selectedWarrentyPrice,
          // handling_charges: priceInfomationData.handling_charges,
          // essential_kit: priceInfomationData.essential_kit,
          // tcs_amount: tcsAmount,
          // paid_access: selectedPaidAccessoriesPrice,
          // fast_tag: priceInfomationData.fast_tag,
          // on_road_price: totalOnRoadPrice,


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
          updateVariantModelsData(modelDetails.model, orgId, modalList);

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
        setSelectedInsurencePrice(oth_performa_column.insurance_value);
        // let tempAddonData = {
        //   cost: oth_performa_column.add_on_covers,
        //   document_name: "Zero Dip",
        //   name: "Zero Dip",
        //   selected: true
        // }
        setSelectedAddOnsPrice(Number(oth_performa_column.add_on_covers))
        
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
      <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
        <Button
          mode="contained"
          style={{ width: '30%', marginRight: 10 }}
          color={Colors.PINK}
          labelStyle={{ textTransform: "none" }}
          onPress={() => downloadPdf("downlaod")}>
          Download
        </Button>
        <Button
          mode="contained"
          style={{ width: '30%', }}
          color={Colors.PINK}
          labelStyle={{ textTransform: "none" }}
          onPress={() => downloadPdf("email")}>
          Email
        </Button>
      </View>

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
                text={moment().format("DD/MM/YYYY")}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 15,
              }}>
              <Button
                mode="contained"
                style={{ width: 120 }}
                color={Colors.PINK}
                labelStyle={{ textTransform: "none" }}
                onPress={() => saveProformaDetails("save")}>
                Save
              </Button>
              <Button
                mode="contained"
                style={{ width: 160 }}
                color={Colors.PINK}
                labelStyle={{ textTransform: "none" }}
                onPress={() => saveProformaDetails("approval")}>
                Sent For Approval
              </Button>
            </View>
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
    paddingTop: 20,
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
  }
})
