import React, { useState, useEffect } from "react";
import { View, StyleSheet, Keyboard, Text, Pressable, Image, Alert, Platform, TouchableOpacity, FlatList } from "react-native";
import { DropDownSelectionItem } from "../../../../pureComponents";
import { DropDownSelectionItemV2 } from "../../../../pureComponents";
import { TextinputComp, DropDownComponant } from "../../../../components";
import { GlobalStyle, Colors } from "../../../../styles";
import { showToast } from "../../../../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, List, Button, IconButton, Switch, TextInput } from "react-native-paper";
import moment from "moment";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Mailer from 'react-native-mail';
var RNFS = require('react-native-fs');

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as AsyncStore from "../../../../asyncStore";
import {
  getLogoNameApi, getOnRoadPriceAndInsurenceDetailsApi, setDropDownData,
  postProformaInvoiceDetails, getProformaListingDetailsApi, setOfferPriceDetails,
  setOfferPriceDataForSelectedProforma, clearOfferPriceData, clearStateData, getTermsAndConditionsOrgwise
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
          color={Colors.PINK}
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

      {text && text != '' ? <Text style={[{ fontSize: 16, fontWeight: "400", width: '50%' }, amoutStyle]}>
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
  const [selectedDate, setSelectedDate] = useState(moment().format("DD-MMM-YYYY"));

  const [selectedCarVarientsData, setSelectedCarVarientsData] = useState({
    varientList: [],
    varientListForDropDown: [],
  });
  const [carColorsData, setCarColorsData] = useState([]);
  const [isDownLoadVisible, setisDownLoadVisible] = useState(false);
  const [termNconditionData, settermsNConditionData] = useState([]);
  const [addNewInput, setAddNewInput] = useState([]);
  const [otherPriceErrorNameIndex, setOtherPriceErrorNameIndex] = useState(null);
  const [otherPriceErrorAmountIndexInput, setOtherPriceErrorAmountIndex] = useState(null);
  const [otherPrices, setOtherPrices] = useState(0);

  useEffect(() => {
    getUserData();
    dispatch(getProformaListingDetailsApi(universalId));


  }, []);

  useEffect(() => {
    if (selector.proforma_listingdata) {
      const proformaList =
        selector.proforma_listingdata || [];
      if (proformaList.length > 0) {
        let newProformaList = [];
        proformaList.forEach((item) => {


          newProformaList.push({
            id: item.id,
            name: moment(item.created_date).format("DD/MM/YYYY h:mm")
          });

        });
        setproformaDataForDropdown([...newProformaList])

      }
    }


  }, [selector.proforma_listingdata])

  const formateLesseName = () => {
    if (!selector.enquiry_details_response) {
      return;
    }

    let tempDmsdata = "";
    const dmsEntity = selector.enquiry_details_response;
    if (dmsEntity.hasOwnProperty("dmsContactDto"))
      tempDmsdata = selector.enquiry_details_response.dmsContactDto;
    else if (dmsEntity.hasOwnProperty("dmsAccountDto")) {
      tempDmsdata = selector.enquiry_details_response.dmsAccountDto;
    }


    let salutationTemp =
      tempDmsdata.salutation ?
        tempDmsdata.salutation + " " : "";


    let firstNameTemp =
      tempDmsdata.firstName ?
        tempDmsdata.firstName + " " : "";


    let lastNametemp =
      tempDmsdata.lastName ?
        tempDmsdata.lastName : "";

    return salutationTemp + firstNameTemp + lastNametemp
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

        dispatch(getTermsAndConditionsOrgwise(jsonObj.orgId))
        dispatch(getLogoNameApi(data));
        getCarModelListFromServer(jsonObj.orgId);
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (selector.getTermsNConditions_res_status === "success") {


      settermsNConditionData(selector.getTermsNConditions_res.configData.split(/\r?\n/))


    }


  }, [selector.getTermsNConditions_res_status])


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
    if (selector.proforma_API_response === "fullfilled") {
      // goParentScreen();
    }
    var key = selector.proforma_API_response;
    var response = selector.proforma_API_respData
    switch (key) {

      case "ENQUIRYCOMPLETED":
        setshowSendForApprovBtn(true);
        setselectedProformaID(response.id)
        setProformaNo(response.performaUUID)
        break;
      case "SENTFORAPPROVAL":
        setselectedProformaID(response.id)
        setProformaNo(response.performaUUID)
        setshowSaveBtn(false);
        setshowSendForApprovBtn(false);
        setShowApproveRejectBtn(true);
        break;
      case "APPROVED":
        setisDownLoadVisible(true)
        setselectedProformaID(response.id)
        setShowApproveRejectBtn(false)
        setProformaNo(response.performaUUID)
        break;
      case "REJECTED":
        setshowSaveBtn(true)
        setselectedProformaID(response.id)
        setShowApproveRejectBtn(false);
        setProformaNo(response.performaUUID)
        break;
      // default:
    }


  }, [selector.proforma_API_response])

  useEffect(() => {
    if (addNewInput.length > 0) {
      var totalprice = 0;
      for (let data of addNewInput) {
        totalprice = totalprice + Number(data.amount);
        setOtherPrices(totalprice);
      }
    }
  }, [addNewInput]);

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
          text: selector.foc_accessoriesFromServer.toString() ? selector.foc_accessoriesFromServer.toString() : "",
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
    setSelectedDate(moment().format("DD-MMM-YYYY"));
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
        (await '<div  >') +
        '<div>' +
        '<div    id="proforma" style="margin: 0px; width: 1100px; height: 100%;">' +

        '<table  class="ttable" style=" border: 1px solid black;width:100%;  color: black; font - size: 12px; " >' +
        " <tr>" +
        '<td   class="tCenter" colspan="4" style="background: #7e7b7b; text-align: center; border: 1px solid black; border - collapse: collapse;">' +
        '<strong>PROFORMA INVOICE</strong>' +
        "</td>" +
        "</tr>" +

        "<tr >" +
        // '<td   colspan="2" rowspan="5">' +
        // '<div   class="row align-items-center">' +
        //   '<div   class="col-md-2 col-2">' +
        '<td style="border: 1px solid black; border - collapse: collapse; padding-left: 20px; ">' + '<img   style="width: 100px; height: auto" src=' +
        selector.proforma_logo +
        ">" +
        '</td>' +

        // '</div>' +
        '<td style="border: 1px solid black; border - collapse: collapse; padding:10px;">' +
        '<div   class="col-md-8 orgname" style="font-size: 12px; font - weight: bold; margin - left: 30px; border - left: 1px solid black; ">' +
        '<p  style="color:#00165c; ">' +
        selector.proforma_orgName +
        '</p>' +
        '<p   class="orgname-pad" style=" margin-top: -10px; color:#00165c; "> GSTN: ' +
        selector.proforma_gstnNumber + '</p>' +
        '<p style="color:#00165c; " >' + selector.proforma_houseNo + '</p>' +
        '<p   class="orgaddr-pad" style=" margin-top: -10px; color:#00165c; ">' + selector.profprma_street + '</p> ' +
        '<p   class="orgaddr-pad" style=" margin-top: -10px; color:#00165c; ">' + selector.proforma_branch + '</p> ' +
        '<p   class="orgaddr-pad" style=" margin-top: -10px; color:#00165c; ">' + selector.proforma_city + selector.proforma_pincode + '</p> ' +
        '<p   class="orgaddr-pad" style=" margin-top: -10px; color:#00165c; ">' + selector.proforma_state + '</p> ' +
        '</div>' +

        '</td>' +
        '<td  style="border: 1px solid black; border - collapse: collapse;  ">' +
        '<table   style="border: 1px solid black; border - collapse: collapse; width:100%;";>' +
        '<tr  " >' +
        '<td   style=" color:#00165c; border: 1px solid black; border - collapse: collapse; width:50%;" >PROFORMA NO :</td>' +
        '<td   style=" color:#00165c; border: 1px solid black; border - collapse: collapse; text-align: right; width:50%;"  "> ' + proformaNo + ' </td>' +
        '</tr>' +
        '</table>' +
        '<table  style="border: 1px solid black; border - collapse: collapse; width:100%;">' +
        '<tr   >' +
        '<td style=" color:#00165c; border: 1px solid black; border - collapse: collapse; width:50%;"  >DATE :</td>' +
        '<td  style=" color:#00165c; border: 1px solid black; border - collapse: collapse; text-align: right; width:50%;" >' + selectedDate + '</td>' +
        '</tr>' +
        '</table>' +
        '<table  style="border: 1px solid black; border - collapse: collapse; width:100%;">' +
        '<tr   >' +
        '<td  style=" color:#00165c;border: 1px solid black; border - collapse: collapse; width:50%;" >PAN NO :</td>' +
        '<td    style="text-transform: uppercase; color:#00165c; text-align: right; border: 1px solid black; border - collapse: collapse; width:50%;"> ' + selector.pan_number + ' </td>' +
        '</tr>' +
        '</table>' +
        '<table  style="border: 1px solid black; border - collapse: collapse; width:100%;">' +
        '<tr   >' +
        '<td  style=" color:#00165c; border: 1px solid black; border - collapse: collapse; width:50%;" >GST NO :</td>' +
        '<td    style="text-transform: uppercase; color:#00165c; text-align: right; border: 1px solid black; border - collapse: collapse; width:50%;"> ' + selector.proforma_gstnNumber + ' </td>' +
        '</tr>' +
        '</table>' +
        '</td>' +


        // '</div>'+
        // '</td>'+
        "</tr>" +







        '<tr      class="tCenter" >  ' +
        '<td      colspan="4" style="border: 1px solid black; border - collapse: collapse; color:#00165c; text-align: center;"> <strong     >' + carModel + " " + "Model" + " " + carVariant + '</strong></td>' +
        '</tr>' +
        '<tr      class="tCenter">  ' +
        '<td     style="border: 1px solid black; border - collapse: collapse; color:#00165c; text-align: center; " colspan="4"><strong    >' + carColor + '</strong></td>' +
        '</tr>' +
        '<tr >' +
        '<td    style="border: 1px solid black; border - collapse: collapse; "><strong   >PARTICULARS</strong></td>' +
        '<td      style="text-align: right; border: 1px solid black; border - collapse: collapse;" width="25%"><strong     >AMOUNT</strong></td>' +
        '<td      style="border: 1px solid black; border - collapse: collapse; " > <strong     >DISCOUNT</strong></td>' +
        '<td      style="text-align: right; border: 1px solid black; border - collapse: collapse;" width="25%"><strong     >AMOUNT</strong></td>' +
        '</tr>' +


        '<tr>' +
        '<td       style="border: 1px solid black; border - collapse: collapse; ">Ex-Showroom Price</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;" width="25%"> ' + priceInfomationData.ex_showroom_price.toString() + '</td>' +
        '<td       style="border: 1px solid black; border - collapse: collapse; ">Consumer Offer</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;" width="25%"> ' + selector.consumer_offer.toString() + ' </td>' +
        '</tr>' +
        '<tr >' +
        '<td      style="border: 1px solid black; border - collapse: collapse; ">Life Tax</td>' +
        '<td      class="talign" width="25%" style="text-align: right; border: 1px solid black; border - collapse: collapse;"> ' + lifeTaxAmount.toString() + ' </td>' +
        '<td      style="border: 1px solid black; border - collapse: collapse; ">Exchange Offer</td>' +
        '<td      class="talign" width="25%" style="text-align: right; border: 1px solid black; border - collapse: collapse;" > ' + selector.exchange_offer.toString() + ' </td>' +
        '</tr>' +
        '<tr>' +
        '<td   style="border: 1px solid black; border - collapse: collapse; "  >Registration Charges</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;"> ' + `${selectedRegistrationCharges?.cost ? selectedRegistrationCharges?.cost : "0.00"}`
        + ' </td>' +
        '<td     style="border: 1px solid black; border - collapse: collapse; ">Corporate Offer</td>' +
        '<td      class="talign" width="25%" style="text-align: right; border: 1px solid black; border - collapse: collapse;"> ' + selector.corporate_offer.toString() + ' </td>' +
        '</tr>' +
        '<tr>' +
        '<td   style="border: 1px solid black; border - collapse: collapse; "  >Insurance ()</td>' +
        '<td      class="talign"style="text-align: right; border: 1px solid black; border - collapse: collapse;">' + selectedInsurencePrice.toString() + '</td>' +
        '<td   style="border: 1px solid black; border - collapse: collapse; "  >Promotional Offers</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;"> ' + selector.promotional_offer.toString() + ' </td>' +
        '</tr>' +
        '<tr >' +
        '<td   style="border: 1px solid black; border - collapse: collapse; "  >Add-on Insurance</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;">' + selectedAddOnsPrice.toString() + '</td>' +
        '<td   style="border: 1px solid black; border - collapse: collapse; "  >Cash Discount</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;"> ' + selector.cash_discount.toString() + ' </td>' +
        '</tr>' +
        '<tr     >' +
        '<td  style="border: 1px solid black; border - collapse: collapse; "   >Warranty ()</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;"> ' + selectedWarrentyPrice.toString() + ' </td>' +
        '<td  style="border: 1px solid black; border - collapse: collapse; "   >FOC Accessories</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;"> ' + selector.for_accessories.toString() + ' </td>' +
        '</tr>' +
        '<tr     >' +
        '<td  style="border: 1px solid black; border - collapse: collapse; "   >Handling Charges:</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;"> ' + `${handlingChargSlctd ? priceInfomationData.handling_charges.toFixed(2) : 0}` + ' </td>' +
        '<td   style="border: 1px solid black; border - collapse: collapse; "  >Insurance Discount</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;">' + selector.insurance_discount.toString() + ' </td>' +
        '</tr>' +
        '<tr     >' +
        '<td style="border: 1px solid black; border - collapse: collapse; "    >Essential Kit:</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;">' + `${essentialKitSlctd ? priceInfomationData.essential_kit.toFixed(2) : 0}` + '</td>' +
        '<td   style="border: 1px solid black; border - collapse: collapse; "  >Accessories Discount</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;"> ' + selector.accessories_discount.toString() + ' </td>' +
        '</tr>' +
        '<tr >' +
        '<td   style="border: 1px solid black; border - collapse: collapse; "  >TCS(&gt;10Lakhs -&gt; 1%):</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;">' + tcsAmount.toString() + '</td>' +
        '<td   style="border: 1px solid black; border - collapse: collapse; "  >Additional Offer 1</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;"> ' + selector.additional_offer_1.toString() + ' </td>' +
        '</tr>' +
        '<tr     >' +
        '<td  style="border: 1px solid black; border - collapse: collapse; "   >Paid Accessories:</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;"> ' + selectedPaidAccessoriesPrice.toString() + ' </td>' +
        '<td  style="border: 1px solid black; border - collapse: collapse; "   >Additional Offer 2</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;">' + selector.additional_offer_2.toString() + '</td>' +
        '</tr>' +
        '<tr     >' +
        '<td   style="border: 1px solid black; border - collapse: collapse; "  >Fast Tag</td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;"> ' + `${fastTagSlctd ? priceInfomationData?.fast_tag?.toFixed(2) : 0}` + ' </td>' +
        '<td   style="border: 1px solid black; border - collapse: collapse; "  > </td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;"></td>' +
        '</tr>' +

        addNewInput.map((item) => {
          return '<tr     >' +
            '<td    style="border: 1px solid black; border - collapse: collapse; "  >' + item.name + '</td>' +
            '<td      class="taligns" style="text-align: right; border: 1px solid black; border - collapse: collapse;">' + item.amount + '</td>' +
            '<td  style="border: 1px solid black; border - collapse: collapse; "    ></td>' +
            '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;"></td>' +
            '</tr > '
        }).join(' ') +

        '<tr     >' +
        '<td    style="border: 1px solid black; border - collapse: collapse; "  ></td>' +
        '<td      class="taligns" style="text-align: right; border: 1px solid black; border - collapse: collapse;"></td>' +
        '<td  style="border: 1px solid black; border - collapse: collapse; "    ></td>' +
        '<td      class="talign" style="text-align: right; border: 1px solid black; border - collapse: collapse;"></td>' +
        '</tr > ' +



        '<tr      >' +
        '<td       class="tCenter" style="background-color: rgb(228, 212, 190); text-align: center; border: 1px solid black; border - collapse: collapse;"><strong      >NET ON ROAD PRICE</strong></td>' +
        '<td       class="talign" style="background-color: rgb(228, 212, 190); text-align: right; border: 1px solid black; border - collapse: collapse;"><strong      >' + totalOnRoadPrice.toString() + '</strong></td>' +
        '<td       class="tCenter" style="background-color: rgb(228, 212, 190); text-align: center; border: 1px solid black; border - collapse: collapse;"><strong      >NET ON ROAD PRICE AFTER DISCOUNT</strong></td>' +
        '<td       class="talign" style="background-color: rgb(228, 212, 190); text-align: right; border: 1px solid black; border - collapse: collapse;"><strong      >' + totalOnRoadPriceAfterDiscount.toString() + '</strong></td>' +
        '</tr>' +


        '<tr      >' +
        '<td       colspan="4">' +
        '<p       style="text-decoration: underline">TERMS AND CONDITIONS</p>' +

        '<div       class="ng-star-inserted">' + termNconditionData.map((item, index) => {

          return '<div style="padding:4px">' + `${index + 1}` + " ) " + `${item}` + '</div>'

        }).join(' ') + '</div>' +

        '</td>' +
        '</tr>' +

        '<tr      >' +
        '<td    style="border: 1px solid black; border - collapse: collapse;"   colspan="4">' +
        '<div       class="row">' +
        '<div       class="col-md-12"><span       class="pull-right" style="float: right;"><b      >For,' + selector.proforma_orgName + '</b></span></div>' +
        '</div>' +
        '<div       class="row" style="margin-top: 20px">' +
        '<div       class="col-md-12"><span       class="pull-right" style="float: right;"><b      >Authorised Signatory</b></span></div>' +
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
        fileName: 'ProformaInvoice' + `${selectedProformaID}`,
        directory: directoryPath,
      };
      let file = await RNHTMLtoPDF.convert(options);
      var PdfData = await RNFS.readFile(file.filePath, "base64").then();

      // RNFS.copyFile(file.filePath + "/ProformaInvoice.pdf", RNFS.DocumentDirectoryPath + "/ProformaInvoice2.pdf")


      // downloadInLocal(file.filePath);
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

  // const downloadPdf = async (from) => {
  //   try {
  //     let siteTypeName =
  //       (await "<div >") +
  //       '<div style="border: 1px solid black;color: black;font-weight: bold;" id="invoice">' +
  //       '<div class="row align-items-center">' +
  //       '<div class="col-md-1">' +
  //       '<img style="background: #fff;width: 120px;" src=' +
  //       selector.proforma_logo +
  //       ">" +
  //       "</div>" +
  //       '<div class="col-md-8 orgname" style="font-size: 18px; font-weight: bold;  margin-left: 30px; border-left: 1px solid black;">' +
  //       "<p >" +
  //       selector.proforma_orgName +
  //       "</p>" +
  //       // '<p class="orgname-pad">(Authorised Dealer for HYUNDAI MOTOR INDIA LTD.)</p>' +
  //       // '<p class="orgname-pad">GSTN: 36AAFCB6312A1ZA</p>' +
  //       "</div>" +
  //       '<div class="col-md-3" class="orgaddr">' +
  //       '<P style="margin-top: -10px;">' +
  //       selector.proforma_branch +
  //       "</P>" +
  //       '<P style="margin-top: -10px;">' +
  //       selector.proforma_city +
  //       "</P>" +
  //       '<P style="margin-top: -10px;">' +
  //       selector.proforma_state +
  //       "</P>" +
  //       "</div>" +
  //       "</div>" +
  //       '<div class="col-md-12">' +
  //       '<table class="ttable">' +
  //       "<colgroup>" +
  //       '<col style="width:10%;">' +
  //       '<col style="width:60%;">' +
  //       '<col style="width:5%;">' +
  //       '<col style="width:25%;">' +
  //       "</colgroup>" +
  //       "<tr>" +
  //       '<td style="background-color:rgb(185, 200, 241);" colspan="4" ><strong>PROFORMA INVOICE</strong></td>' +
  //       "</tr>" +
  //       '<tr class="tCenter">' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;" >NAME :</td>' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;">' +
  //       modelDetails.model +
  //       "</td>" +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;" >DATE</td>' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;">' +
  //       moment().format("DD/MM/YYYY") +
  //       "</td>" +
  //       "</tr>" +
  //       '<tr class="tCenter">' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="2" rowspan="4"></td>' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;">MODEL</td>' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;">' +
  //       carModel +
  //       "</td>" +
  //       "</tr>" +
  //       '<tr class="tCenter">' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;" >VARIANT</td>' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;">' +
  //       carVariant +
  //       "</td>" +
  //       " </tr > " +
  //       '< tr class="tCenter" > ' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;">COLOUR</td>' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;">' +
  //      carColor +
  //       "</td>" +
  //       "</tr>" +
  //       "< tr > " +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;"   colspan="2" class="tCenter">AMOUNT</td>' +
  //       "</tr > " +
  //       "< tr > " +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="4" style="text-align:center"><strong> DESCRIPTION</strong></td>' +
  //       "</tr>" +
  //       "<tr>" +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="2">EX SHOWROOM</td>' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2" class="talign">' +
  //       priceInfomationData.ex_showroom_price +
  //       "</td>" +
  //       "</tr>" +
  //       "<tr>" +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="2">LIFE TAX @ 14%</td>' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="2"class="talign">' +
  //       lifeTaxAmount +
  //       "</td>" +
  //       "</tr>" +
  //       "<tr>" +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2">INSURANCE</td>' +
  //       ' <td style=" border: 1px solid black; border-collapse: collapse;" colspan="2"class="talign">' +
  //       selectedInsurencePrice +
  //       "</td>" +
  //       "</tr>" +
  //       "<tr>" +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2">ESSENTIAL KIT</td>' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2"class="talign">' +
  //       priceInfomationData.essential_kit +
  //       "</td>" +
  //       "</tr > " +
  //       "<tr>" +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2">WARRANTY</td>' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2" class="talign">' +
  //       selectedWarrentyPrice +
  //       "</td>" +
  //       "</tr > " +
  //       "<tr>" +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="2">TR CHARGES</td>' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2"class="talign">' +
  //       tcsAmount +
  //       "</td>" +
  //       "</tr>" +
  //       "<tr>" +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="2">FASTAG</td>' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2"class="talign">' +
  //       priceInfomationData.fast_tag +
  //       "</td>" +
  //       "</tr>" +
  //       "<tr>" +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;" colspan="2" class="tCenter"style="background-color:rgb(228, 212, 190)"><strong>NET ON ROAD PRICE</strong> </td>' +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="2"class="talign" style="background-color:rgb(228, 212, 190)"><strong>' +
  //       totalOnRoadPrice +
  //       "</strong> </td>" +
  //       "</tr > " +
  //       "<tr>" +
  //       '<td style=" border: 1px solid black; border-collapse: collapse;"colspan="4"><p style="text-decoration:underline">TERMS AND CONDITIONS</p>' +
  //       "" +
  //       "</td > " +
  //       "</tr > " +
  //       "</table > " +
  //       '<div class="row">' +
  //       '<div class="col-md-10">' +
  //       "</div>" +
  //       '<div class="col-md-2">' +
  //       '<p style="float: right; margin-bottom: 50px;"><b>for BHARAT HYUNDAI</b></p><br>' +
  //       '<p style="float: right;"><b>Authorised Signatory</b></p>' +
  //       "</div>" +
  //       "</div > " +
  //       '<div  style="padding-bottom: 10px; padding-left: 0px;padding-top: 10px;float: right;" data-html2canvas-ignore="true">' +
  //       '<ul style="list-style-type: none;display:flex">' +
  //       //'<li style="margin-right:10px"> <button class="btn btn-primary" (click)="submit()">back</button></li>' +
  //       //'<li><button class="btn btn-primary" (click)="download()">Download</button></li>' +
  //       "</ul>" +
  //       "</div>" +
  //       "</div>" +
  //       "</div>" +
  //       "</div >";
  //     let bottomPitch =
  //       (await '<div style="padding-top:10px;" >') +
  //       "<p>" +
  //       "Thank you for using our LED Savings Calculator. Energy Lighting Services is based in Nashville, Tennessee, and has been retrofitting commercial buildings all over North America with LED lighting systems since 2010. We would be honored to help you with your project needs.Please reach out to us if you have any questions.www.energylightingservices.com  855.270.3300  info@elsco.org" +
  //       "<p>" +
  //       "</div>";
  //     let finalHtmlText = await siteTypeName;
  //     let directoryPath = "";
  //     if (Platform.OS === "android") {
  //       directoryPath = "Download";
  //     }
  //     else {
  //       directoryPath = "Documents";
  //     }
  //     let options = {
  //       html: finalHtmlText,
  //       fileName: "ProformaInvoice",
  //       directory: directoryPath,
  //     };
  //     let file = await RNHTMLtoPDF.convert(options);
  //     var PdfData = await RNFS.readFile(file.filePath, "base64").then();

  //     // RNFS.copyFile(file.filePath + "/ProformaInvoice.pdf", RNFS.DocumentDirectoryPath + "/ProformaInvoice2.pdf")


  //     // downloadInLocal(file.filePath);
  //     if (from === "email") {
  //       await Mailer.mail(
  //         {
  //           subject: "Invoice",
  //           //  recipients: ['radhadevi8958@gmail.com'],
  //           body: "",
  //           attachments: [
  //             {
  //               path: file.filePath, // The absolute path of the file from which to read data.
  //               type: "pdf", // Mime Type: jpg, png, doc, ppt, html, pdf
  //               name: "ProformaInvoice.pdf", // Optional: Custom filename for attachment
  //             },
  //           ],
  //         },
  //         (error, event) => {
  //           if (error) {
  //             AlertIOS.alert(
  //               "Error",
  //               "Could not send mail. Please send a mail to support@example.com"
  //             );
  //           }
  //         }
  //       );
  //     }

  //     // alert(file.filePath);
  //     Alert.alert(
  //       'File Downloaded to following location',
  //       `${file.filePath}`, // <- this part is optional, you can pass an empty string
  //       [
  //         { text: 'OK', onPress: () => console.log('OK Pressed') },
  //       ],
  //       { cancelable: false },
  //     );
  //   } catch (error) {
  //     alert(error);
  //   }
  // };
  const saveProformaDetails = async (from) => {
    var proformaStatus = "";

    if (from === "save") {
      proformaStatus = "ENQUIRYCOMPLETED";
      const data1 = {
        vehicleId: selectedVehicleID,
        varientId: selectedVarientId,
        vehicleImageId: selectedvehicleImageId,
        performaUUID: proformaNo ? proformaNo : "",

        crmUniversalId: universalId,
        id: selectedProformaID ? selectedProformaID : "",
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
          handling_charges: `${handlingChargSlctd ? priceInfomationData.handling_charges.toFixed(2) : 0}`,
          essential_kit: `${essentialKitSlctd ? priceInfomationData.essential_kit.toFixed(2) : 0}`,
          tcs_amount: tcsAmount,
          paid_access: selectedPaidAccessoriesPrice,
          fast_tag: `${fastTagSlctd ? priceInfomationData?.fast_tag?.toFixed(2) : 0}`,
          on_road_price: totalOnRoadPrice,
          otherPricesData: addNewInput,

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
    else if (from === "APPROVED") {
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
          handling_charges: `${handlingChargSlctd ? priceInfomationData.handling_charges.toFixed(2) : 0}`,
          essential_kit: `${essentialKitSlctd ? priceInfomationData.essential_kit.toFixed(2) : 0}`,
          tcs_amount: tcsAmount,
          paid_access: selectedPaidAccessoriesPrice,
          fast_tag: `${fastTagSlctd ? priceInfomationData?.fast_tag?.toFixed(2) : 0}`,
          on_road_price: totalOnRoadPrice,
          otherPricesData: addNewInput,

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

    else if (from === "REJECTED") {
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
          handling_charges: `${handlingChargSlctd ? priceInfomationData.handling_charges.toFixed(2) : 0}`,
          essential_kit: `${essentialKitSlctd ? priceInfomationData.essential_kit.toFixed(2) : 0}`,
          tcs_amount: tcsAmount,
          paid_access: selectedPaidAccessoriesPrice,
          fast_tag: `${fastTagSlctd ? priceInfomationData?.fast_tag?.toFixed(2) : 0}`,
          on_road_price: totalOnRoadPrice,
          otherPricesData: addNewInput,

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
        vehicleId: selectedVehicleID,
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
          handling_charges: `${handlingChargSlctd ? priceInfomationData.handling_charges.toFixed(2) : 0}`,
          essential_kit: `${essentialKitSlctd ? priceInfomationData.essential_kit.toFixed(2) : 0}`,
          tcs_amount: tcsAmount,
          paid_access: selectedPaidAccessoriesPrice,
          fast_tag: `${fastTagSlctd ? priceInfomationData?.fast_tag?.toFixed(2) : 0}`,
          on_road_price: totalOnRoadPrice,
          otherPricesData: addNewInput,

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
      if (mArray.length > 0) {
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
    // todo
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
        if (newSelectedProforma[0].performa_status === "APPROVED" || newSelectedProforma[0].performa_status === "APPROVE") {
          setisDownLoadVisible(true);

        } else {
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
        setSelectedDate(moment(newSelectedProforma[0].created_date).format("DD-MMM-YYYY"));
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
        if (Number(oth_performa_column.insurance_value) > 0) {
          setSelectedInsurencePrice(Number(oth_performa_column.insurance_value));
        } else {
          setSelectedInsurencePrice(0);
        }

        // let tempAddonData = {
        //   cost: oth_performa_column.add_on_covers,
        //   document_name: "Zero Dip",
        //   name: "Zero Dip",
        //   selected: true
        // }
        if (Number(oth_performa_column.add_on_covers) > 0) {
          setSelectedAddOnsPrice(Number(oth_performa_column.add_on_covers));
        } else {
          setSelectedAddOnsPrice(0);
        }


        if (Number(oth_performa_column.handling_charges) > 0) {
          setHandlingChargSlctd(true);
        } else {
          setHandlingChargSlctd(false);
        }
        if (Number(oth_performa_column.essential_kit) > 0) {
          setEssentialKitSlctd(true);
        } else {
          setEssentialKitSlctd(false);
        }

        if (Number(oth_performa_column.paid_access) > 0) {
          setSelectedPaidAccessoriesPrice(oth_performa_column.paid_access)
        } else {
          setSelectedPaidAccessoriesPrice(0)
        }


        if (oth_performa_column.accessory_items.length > 0) {
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

        if (Number(oth_performa_column.fast_tag) > 0) {
          setFastTagSlctd(true);
        } else {
          setFastTagSlctd(false);
        }


        // other price data 
        if (oth_performa_column.otherPricesData?.length > 0) {
          let newArr = [];
          oth_performa_column.otherPricesData.forEach((item, i) => {
            newArr.push({
              name: item.name,
              amount: item.amount,
            });
          });
          if (newArr.length > 0) {
            var totalprice = 0;
            for (let data of newArr) {
              totalprice = totalprice + Number(data.amount);
              setOtherPrices(totalprice);
            }
          }
          setAddNewInput(Object.assign([], newArr));
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
        if (item.vehicleId === newSelectedProforma[0].vehicleId) {
          [item].map((carModalName) => {

            carModalNameTemp = carModalName.model;
            carModalName.varients.filter((variantItems) => {

              if (variantItems.id === newSelectedProforma[0].varientId) {

                carModalVarientNameTemp = variantItems.name;

                variantItems.vehicleImages.filter((carColor) => {

                  if (carColor.vehicleImageId === newSelectedProforma[0].vehicleImageId) {
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
    setOtherPrices(0)
    setOtherPriceErrorNameIndex(null);
    setOtherPriceErrorAmountIndex(null);
    setAddNewInput([]);
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


  const addHandler = () => {
    let isEmpty = false;
    let toast = "please enter name";
    if (addNewInput.length > 0) {
      for (let i = 0; i < addNewInput.length; i++) {
        if (addNewInput[i].name == "") {
          setOtherPriceErrorAmountIndex(null);
          setOtherPriceErrorNameIndex(i);
          isEmpty = true;
          break;
        } else if (addNewInput[i].amount == "") {
          setOtherPriceErrorNameIndex(null);
          setOtherPriceErrorAmountIndex(i);
          toast = "please enter amount";
          isEmpty = true;
          break;
        }
      }
    }

    if (isEmpty) {
      showToast(toast);
      return;
    }
    setOtherPriceErrorAmountIndex(null);
    setOtherPriceErrorNameIndex(null);
    setAddNewInput([...addNewInput, { name: "", amount: "" }]);
  };

  const deleteHandler = (index) => {
    let newArr = Object.assign([], addNewInput);
    if (newArr[index]?.amount) {
      var amt = newArr[index].amount;
      setOtherPrices(otherPrices - Number(amt));
    }
    newArr.splice(index, 1);
    setAddNewInput(Object.assign([], newArr));
  };

  const inputHandlerName = (value, index) => {
    let newArr = Object.assign([], addNewInput);
    newArr[index].name = value;
    setAddNewInput(Object.assign([], newArr));
  };

  const inputHandlerPrice = (value, index) => {
    let newArr = Object.assign([], addNewInput);
    newArr[index].amount = value;
    setAddNewInput(Object.assign([], newArr));
  };

  const checkIsError = (type, index) => {
    let isError = false;
    if (type == "amount") {
      if (
        otherPriceErrorAmountIndexInput != null &&
        otherPriceErrorAmountIndexInput == index
      ) {
        isError = true;
      }
    } else {
      if (otherPriceErrorNameIndex != null && otherPriceErrorNameIndex == index) {
        isError = true;
      }
    }
    return isError;
  };

  const getActualPrice = () => {
    let amount = Number(totalOnRoadPrice) + Number(otherPrices);
    return amount;
  };

  const getActualPriceAfterDiscount = () => {
    let amount = Number(totalOnRoadPriceAfterDiscount) + Number(otherPrices);
    return amount;
  };

  return (
    <View style={{}}>
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



      {/* <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: '2%' }}>
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
      </View> */}
      <View style={{
        flexDirection: "column", alignSelf: "flex-end", marginTop: '2%',
        width: '100%',
      }}>

        <View style={{}}>
          {selectedProfroma == "" && !isnewProformaClicked ?
            <><Text style={{
              color: Colors.BLACK,
              fontSize: 16,
              fontWeight: "700"

            }}>Select Invoice</Text>
              <FlatList
                key={"PROFORMA_LIST"}
                data={proformaDataForDropdown}
                ListEmptyComponent={() => {
                  return (<View style={{ alignItems: 'center' }}><Text>{"Data Not Available"}</Text></View>)
                }}
                keyExtractor={(item, index) => index.toString()}
                style={{
                  // height:'70%'
                }}
                showsVerticalScrollIndicator
                renderItem={({ item, index }) => {

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedProfroma(item.name)
                        updateProformaDataforSelectedValue(item.id, item.name, [...proformaDataForDropdown]);
                      }}
                      style={styles.proforMlistTochable}
                    >
                      <Text style={styles.proformList}>{item.name}</Text>
                      <MaterialIcons name="chevron-right" size={30} color={Colors.BLACK} />
                    </TouchableOpacity>
                  );

                }}
              />
            </>
            : <></>}



        </View>

        <Button
          mode="contained"
          style={{ width: '80%', borderRadius: 5, alignSelf: "center", marginTop: '2%' }}
          color={Colors.PINK}
          labelStyle={{ textTransform: "none", fontSize: 16 }}
          onPress={() => newProformaClick()}>
          New Proforma
        </Button>
      </View>

      <View>
        {/* {isnewProformaClicked ? 
        <List.AccordionGroup
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
                if (carModel != "") {
                  showDropDownModelMethod("VARIENT", "Select Variant")
                } else {
                  showToast("Please Select Vehicle")
                }

              }

              }
            />

            <DropDownSelectionItem
              label={"Color"}
              value={carColor}
              onPress={() => {
                if (carModel != "" && carVariant != "") {
                  showDropDownModelMethod("COLOR", "Select Color")
                } else {
                  showToast("Please Select Variant")
                }

              }

              }
            />

          </List.Accordion>
        </List.AccordionGroup> : null} */}


        {isnewProformaClicked ?
          <>
            <Text style={{
              color: Colors.BLACK,
              fontSize: 16,
              fontWeight: "700",
              marginVertical: 10

            }}>New Proforma Invoice</Text>
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
                if (carModel != "") {
                  showDropDownModelMethod("VARIENT", "Select Variant")
                } else {
                  showToast("Please Select Vehicle")
                }

              }

              }
            />

            <DropDownSelectionItem
              label={"Color"}
              value={carColor}
              onPress={() => {
                if (carModel != "" && carVariant != "") {
                  showDropDownModelMethod("COLOR", "Select Color")
                } else {
                  showToast("Please Select Variant")
                }

              }

              }
            />
          </>
          : null}
      </View>

      {/* main view to manage visibility  */}
      <View>
        {selectedProfroma != "" || carModel != "" ?
          <>


            {/* Proforma Invoice section */}
            <View
              style={{
                backgroundColor: Colors.WHITE,
                marginVertical: 10,
              }}>
              <View style={{

                backgroundColor: Colors.PINK, padding: 5
              }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.WHITE,
                    textAlign: "center",
                    fontWeight: '700'
                  }}>
                  PROFORMA INVOICE
                </Text>

              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Colors.LIGHT_GRAY,
                  margin: 10,
                  padding: 5,
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
              <TextAndAmountComp title={"Bldg no. :"} text={

                selector.proforma_houseNo
              } />
              {/* <Text
                style={{
                  fontSize: 14,
                  color: Colors.BLACK,
                  textAlign: "center",
                  marginLeft: 10,
                  marginBottom: 10,
                  marginTop: 10
                }}>
               
                {selector.proforma_houseNo + ", " + selector.proforma_branch +
                  ", " +
                  selector.proforma_city +
                  ", " +
                  selector.proforma_state + ", " + selector.proforma_pincode}
              </Text> */}
              <TextAndAmountComp title={"Location :"} text={

                selector.profprma_street +
                ", " +
                selector.proforma_branch +
                ", " +
                selector.proforma_state + ", " + selector.proforma_pincode
              }
                titleStyle={{
                  alignSelf: 'flex-start'
                }}
              />
              <TextAndAmountComp title={"Lessee :"} text={

                formateLesseName()
              } />
              <TextAndAmountComp title={"Lessor :"} text={
                selector.proforma_orgName
              } />
              {selector.proforma_gstnNumber && <TextAndAmountComp title={"GSTN :"} text={
                selector.proforma_gstnNumber
              } />}

              {/* <TextAndAmountComp title={"Name"} text={modelDetails?.model} /> */}
              <TextAndAmountComp
                title={"Date"}
                text={selectedDate}
              />
              {/* <TextAndAmountComp title={"Name"} text={modelDetails?.model} />
              <TextAndAmountComp title={"Model"} text={modelDetails?.variant} />
              <TextAndAmountComp title={"Color"} text={modelDetails?.color} /> */}
              {carModel != "" && <TextAndAmountComp title={"Name :"} text={carModel} />}
              {carVariant != "" && <TextAndAmountComp title={"Model :"} text={carVariant} />}
              {carColor != "" && <TextAndAmountComp title={"Color:"} text={carColor} />}
              {proformaNo != "" && <TextAndAmountComp
                title={"Proforma no:"}
                text={proformaNo}
              />}
              {selector.pan_number != "" &&
                <TextAndAmountComp
                  title={"PAN NO :"}
                  text={selector.pan_number}
                />}

              {/* <TextAndAmountComp
                title={"Amount"}
                text={totalOnRoadPrice.toFixed(2)}
              /> */}
            </View>

            <View
              style={{

                borderColor: Colors.PINK,
                paddingBottom: 10,
                backgroundColor: Colors.LIGHT_GRAY
              }}>
              <View style={{

                backgroundColor: Colors.DARK_GRAY, padding: 5
              }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.WHITE,
                    textAlign: "center",
                    fontWeight:'700'

                  }}>
                  PRICE CONFIRMATION
                </Text>

              </View>


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
              <View style={[{
                flexDirection: "column",
                justifyContent: "space-between",
                paddingHorizontal: 12,
                minHeight: 40,
                paddingVertical: 5,
                alignItems: "flex-start",
                backgroundColor: Colors.WHITE,
              }]}>

                <Text style={[styles.leftLabel, { textAlign: "left" }]}>{"Life Tax:"}</Text>

                <View
                  style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    flexDirection: "row",
                    alignItems: "center"
                  }}>
                  <TextInput
                    value={taxPercent}
                    style={[{
                      fontSize: 14,
                      fontWeight: "400",
                      borderBottomWidth: 1,
                      borderBottomColor: "#d1d1d1",
                      width: '50%',
                      backgroundColor: Colors.WHITE,
                      paddingHorizontal: 0
                    }]}
                    keyboardType={"number-pad"}
                    onChangeText={(text) => {

                      setTaxPercent(text);
                      if (text !== "") {
                        setLifeTaxAmount(getLifeTaxNew(Number(text)));
                      } else {
                        setLifeTaxAmount(0);
                      }
                    }}
                    label={"Enter"}
                    selectionColor={Colors.BLACK}
                    underlineColorAndroid={Colors.TEXT_INPUT_BORDER_COLOR}
                    underlineColor={Colors.LIGHT_GRAY}
                    outlineColor={Colors.BLACK}
                    theme={{ colors: { primary: Colors.BLACK, underlineColor: 'transparent' } }}
                  />


                  <Text style={{ fontSize: 14, fontWeight: "400" }}>
                    {rupeeSymbol + " " + lifeTaxAmount.toFixed(2)}
                  </Text>
                </View>

              </View>

              {/* <Text style={GlobalStyle.underline}></Text> */}

              <View style={styles.symbolview}>
                <View style={{ width: "70%",marginVertical:10 }}>
                  <DropDownSelectionItemV2
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
              {/* <Text style={GlobalStyle.underline}></Text> */}

              <View style={styles.symbolview}>
                <View style={{ width: "70%" }}>
                  <DropDownSelectionItemV2
                    label={"Insurance Type:"}
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
                  <DropDownSelectionItemV2
                    label={"Add-on Insurance:"}
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
                  <DropDownSelectionItemV2
                    label={"Warranty:"}
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

              {/* for other price  */}
              <View style={styles.otherPriceTitleRow}>
                <Text style={styles.otherPriceTextStyle}>
                  Add Other Prices
                </Text>

                <TouchableOpacity
                  style={[
                    styles.addIcon,
                    {
                      backgroundColor: isInputsEditable()
                        ? Colors.RED
                        : Colors.GRAY,
                    },
                  ]}
                  disabled={!isInputsEditable()}
                  onPress={() => addHandler()}
                >
                  <Text
                    style={{
                      color: Colors.WHITE,
                      fontSize: 13,
                    }}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  backgroundColor: Colors.WHITE,
                  paddingTop: 5,
                }}
              >
                <FlatList
                  data={addNewInput}
                  extraData={[
                    addNewInput,
                    otherPriceErrorAmountIndexInput,
                    otherPriceErrorNameIndex,
                  ]}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingHorizontal: 10,
                        }}
                      >
                        <TextInput
                          editable={isInputsEditable()}
                          style={[
                            styles.otherPriceInput,
                            {
                              borderColor: checkIsError("name", index)
                                ? Colors.RED
                                : null,
                            },
                          ]}
                          placeholder={"Name"}
                          onChangeText={(name) =>
                            inputHandlerName(name, index)
                          }
                          value={item.name}
                        />
                        <TextInput
                          editable={isInputsEditable()}
                          style={[
                            styles.otherPriceInput,
                            {
                              marginLeft: 20,
                              borderColor: checkIsError("amount", index)
                                ? Colors.RED
                                : null,
                            },
                          ]}
                          placeholder={"Amount"}
                          keyboardType={"decimal-pad"}
                          onChangeText={(value) =>
                            inputHandlerPrice(value, index)
                          }
                          value={`${item.amount}`}
                        />
                        <TouchableOpacity
                          disabled={!isInputsEditable()}
                          onPress={() => deleteHandler(index)}
                          style={{ marginLeft: 10 }}
                        >
                          <IconButton
                            icon="trash-can-outline"
                            color={Colors.PINK}
                            size={25}
                            disabled={!isInputsEditable()}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>

              <TextAndAmountComp
                title={"On Road Price:"}
                // amount={totalOnRoadPrice.toFixed(2)}
                amount={getActualPrice().toFixed(2)}
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
                // amount={totalOnRoadPriceAfterDiscount.toFixed(2)}
                amount={getActualPriceAfterDiscount().toFixed(2)}
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
                  style={{ flex: 1, marginRight: showSendForApprovBtn ? 10 : 0 }}
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
                  onPress={() => downloadPdf2("email")}>
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

    alignSelf: "center"
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
  otherPriceInput: {
    backgroundColor: Colors.LIGHT_GRAY,
    width: "33%",
    height: 40,
    borderBottomWidth: 1,
  },
  otherPriceTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    paddingTop: 7
  },
  addIcon: {
    backgroundColor: Colors.RED,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 20,
  },
  otherPriceTextStyle: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.GRAY,
    paddingLeft: 12,
  },
  proformList: {
    fontSize: 14, color: Colors.BLACK, fontWeight: '700'
  },
  proforMlistTochable: {
    marginVertical: 5,
    width: "100%",
    backgroundColor: Colors.WHITE,
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: "row",

    alignItems: "center"
  }
})
