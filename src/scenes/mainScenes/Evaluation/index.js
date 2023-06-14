import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  Checkbox,
  DataTable,
  List,
  Button,
  IconButton,
} from "react-native-paper";
import { Colors } from "../../../styles";
import { StyleSheet } from "react-native";
import {
  ButtonComp,
  DatePickerComponent,
  DropDownComponant,
  ImagePickerComponent,
  TextinputComp,
} from "../../../components";
import { Dropdown } from "react-native-element-dropdown";
import { DateSelectItem, RadioTextItem } from "../../../pureComponents";
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";
import CustomTextInput from "./Component/CustomTextInput";
import Entypo from "react-native-vector-icons/Entypo";
import CustomEvaluationDropDown from "./Component/CustomEvaluationDropDown";
import CustomDatePicker from "./Component/CustomDatePicker";
import CustomRadioButton from "./Component/RadioComponent";
import CustomSelection from "./Component/CustomSelection";
import CustomUpload from "./Component/CustomUpload";
import Table from "./Component/CustomTable";
import { Modal } from "react-native";
import { Image } from "react-native";
import { MyTasksStackIdentifiers } from "../../../navigations/appNavigator";
import URL from "../../../networking/endpoints";
import { client } from "../../../networking/client";
import * as AsyncStore from "../../../asyncStore";
import { PincodeDetailsNew } from "../../../utils/helperFunctions";
import {
  Fuel_Types,
  Gender_Types,
  Insurence_Types,
  Salutation_Types,
} from "../../../jsonData/enquiryFormScreenJsonData";
import { showAlertMessage, showToastRedAlert } from "../../../utils/toast";
import moment from "moment";
import _ from "lodash";
import CustomImageUpload from "./Component/CustomImageUpload";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const LocalButtonComp = ({ title, onPress, disabled, color }) => {
  return (
    <Button
      style={{
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        paddingVertical: 5,
      }}
      mode="contained"
      color={color ? color : Colors.RED}
      disabled={disabled}
      labelStyle={{ textTransform: "none", color: Colors.WHITE }}
      onPress={onPress}
    >
      {title}
    </Button>
  );
};
const months = [
  { name: "January", id: 1, index: "01" },
  { name: "February", id: 2, index: "02" },
  { name: "March", id: 3, index: "03" },
  { name: "April", id: 4, index: "04" },
  { name: "May", id: 5, index: "05" },
  { name: "June", id: 6, index: "06" },
  { name: "July", id: 7, index: "07" },
  { name: "August", id: 8, index: "08" },
  { name: "September", id: 9, index: "09" },
  { name: "October", id: 10, index: "10" },
  { name: "November", id: 11, index: "11" },
  { name: "December", id: 12, index: "12" },
];
export const Vehicle_Types = [
  {
    id: "1",
    name: "Personal",
  },
  {
    id: "2",
    name: "Taxi",
  },
];

export const TypeOf_body_Types = [
  {
    id: "1",
    name: "SUV",
  },
  {
    id: "2",
    name: "Sedan",
  },
  {
    id: "2",
    name: "HatchBack",
  },
];

const incomming = {
  dmsAccountDto: {
    id: 22808,
    age: 0,
    branchId: 286,
    company: "",
    country: "India",
    createdBy: "Rohith N P",
    createdDate: 1685625888667,
    customerType: "Business",
    email: "",
    enquiryDate: 1685557800000,
    enquirySource: 192,
    firstName: "lead",
    gender: "FEMALE",
    lastName: "Test",
    modifiedBy: "Rohith N P",
    modifiedDate: 1685625935440,
    orgId: 18,
    ownerName: "Rohith N P",
    phone: "8798247987",
    secondaryPhone: "",
    status: "PREENQUIRY",
    subSource: "318",
    active: true,
  },
  dmsLeadDto: {
    id: 59614,
    firstName: "lead",
    phone: "8798247987",
    lastName: "Test",
    email: "",
    allocated: "Yes",
    branchId: 286,
    buyerType: "Exchange Buyer",
    createdBy: "Rohith N P",
    createddatetime: 1685625935000,
    crmUniversalId: "18-286-dd7fdf70-b940-4b6a-98c0-dbe000d6ee1f",
    dateOfEnquiry: 1685625934581,
    dmsExpectedDeliveryDate: 1685625938000,
    enquiryCategory: "Hot",
    isVip: "N",
    isHni: "N",
    enquirySegment: "Personal",
    leadStage: "ENQUIRY",
    model: "NEW JEEP COMPASS",
    organizationId: 18,
    salesConsultant: "Rohith N P",
    sourceOfEnquiry: 192,
    dmsaccountid: 22808,
    dmscontactid: 0,
    enquirySource: "Tele-In",
    subSource: "Advertisement",
    maritalStatus: "",
    documentType: "",
    customerCategoryType: "",
    referencenumber: "JP Nagar - IC0700043 - ENQ2023001489",
    dmsAddresses: [
      {
        addressType: "Communication",
        houseNo: "",
        street: "",
        city: "Yellandu",
        district: "Khammam",
        pincode: "507123",
        state: "Telangana",
        village: "B N Thanda",
        county: "India",
        rural: false,
        urban: true,
        id: 120733,
      },
      {
        addressType: "Permanent",
        houseNo: "",
        street: "",
        city: "Yellandu",
        district: "Khammam",
        pincode: "507123",
        state: "Telangana",
        village: "B N Thanda",
        county: "India",
        rural: false,
        urban: true,
        id: 120734,
      },
    ],
    dmsLeadProducts: [
      {
        model: "NEW JEEP COMPASS",
        variant: "TRAILHAWK 4x4(O2) 2.0D AT",
        color: "Bright White+Black Roof",
        fuel: "Diesel",
        transimmisionType: "Automatic",
        id: "",
        isPrimary: "Y",
        selected: true,
      },
    ],
    dmsfinancedetails: [
      {
        financeType: "In House",
        financeCategory: "",
        downPayment: "",
        loanAmount: "",
        financeCompany: "",
        annualIncome: "",
        location: "",
        rateOfInterest: "",
        emi: "",
        id: 0,
      },
    ],
    dmsLeadScoreCards: [
      {
        lookingForAnyOtherBrand: "",
        brand: "",
        otherMake: "",
        model: "",
        otherModel: "",
        variant: "",
        color: "",
        fuel: "",
        transmissionType: "",
        dealershipName: "",
        dealershipLocation: "",
        priceRange: "",
        decisionPendingReason: "",
        onRoadPriceanyDifference: "",
        customerFrom: "",
        village: "",
        hamlet: "",
        mandal: "",
        mandalHq: "",
        town: "",
        dist: "",
        distHq: "",
        voiceofCustomerRemarks: "",
        id: 0,
      },
    ],
    dmsAttachments: [],
    dmsExchagedetails: [
      {
        buyerType: "Exchange Buyer",
        varient: "",
        fuelType: "",
        regNo: "sd667s87",
        kiloMeters: "",
        hypothication: "",
        color: "",
        transmission: "",
        yearofManufacture: "",
        hypothicationBranch: "",
        hypothicationRequirement: "",
        expectedPrice: "",
        registrationDate: "",
        registrationValidityDate: "",
        insuranceAvailable: "",
        insuranceDocumentAvailable: "",
        insuranceType: "",
        insuranceFromDate: "",
        insuranceToDate: "",
        insuranceCompanyName: "",
        insuranceDocumentKey: "",
        regDocumentKey: "",
        id: 0,
      },
    ],
    dmsAccessories: [],
    dmsOrgTagConfigurationDto: [],
    customerType: "Business",
  },
  previewControls: {
    previewregistrationNumber: "",
    previewnameonRC: "",
    previewmodel: "",
    previewvariant: "",
    previewregDate: "",
    previewmake: "",
    previewfuelType: "",
    previewtransmission: "",
    role: "",
    previewVehicleServiceCost: "",
    previewvehicleServiceCost: "",
    previewengineNumber: "",
    previewpincode: "",
    previewchallanPending: "",
    previewminorAccidentRemarks: "",
    previewminorAccident: "",
    previewmajorAccidentRemarks: "",
    previewmajorAccident: "",
    previewcolour: "",
    previewevalutorId: "",
    previewcustExpectedPrice: "",
    previewemission: "",
    previewevaluatorOfferPrice: "",
    previewoilChanges: "",
    previewpowerbrakefluidchange: "",
    previewcoolantFilterChange: "",
    previewremovalStainMarksStickers: "",
    previewcarpetCleaning: "",
    previewengineRoom: "",
    previewengineRoomCost: "",
    previewvehicleTransfer: "",
    previewnocClearanceExpense: "",
    previewchallanAmount: "",
    previewccClearanceExpense: "",
    previewfrontWheelLeft: "",
    previewfrontWheelRight: "",
    previewhypothecatedBranch: "",
    previewhypothecatedCompletedDate: "",
    previewhypothecation: "",
    previewimageDocuments: "",
    previewinsFromDate: "",
    previewinsToDate: "",
    previewinsurance: "",
    previewinsuranceCompanyName: "",
    previewinsuranceType: "",
    previewkmDriven: "",
    previewloanAmountDue: "",
    previewnoOfOwners: "",
    previewpolicyNumber: "",
    previewpollutionCertificate: "",
    previewmobileNum: "",
    previewname: "",
    previewcost: "",
    previewotherDocName: "",
    previewotherDocFile: "",
    previewrearWheelLeft: "",
    previewrearWheelRight: "",
    previewregCity: "",
    previewregDistrict: "",
    regDocument: "",
    previewregState: "",
    previewregValidity: "",
    previewrubbingPolishing: "",
    previewspareAlliWheel: "",
    previewspareDiskWheel: "",
    previewspareKey: "",
    previewtypeOfBody: "",
    previewvehicleType: "",
    previewyearMonthOfManufacturing: "",
    previewchassisNum: "",
    previewperiodicService: "",
    previewoldCarNocImg: "",
    previewoldCarNocName: "",
    previewnumberPlateImg: "",
    previewnumberPlateName: "",
    previewbreaksDmgImg: "",
    previewbreaksDmgName: "",
    previewfunctionsImg: "",
    previewfunctionsName: "",
    previewdentImg: "",
    previewdentName: "",
    previewscratchImg: "",
    previewscratchName: "",
    previewextraFitmentImg: "",
    previewextraFitmentName: "",
    previewinvoiceImg: "",
    previewinvoiceName: "",
    previewinsuranceImg: "",
    previewinsuranceName: "",
    previewrcBackImg: "",
    previewrcBackName: "",
    previewrcFrontImg: "",
    previewrcFrontName: "",
    previewinteriorBackImg: "",
    previewinteriorBackName: "",
    previewinteriorFrontImg: "",
    previewinteriorFrontName: "",
    previewchassisImg: "",
    previewchassisImgName: "",
    previewspeedoMeterImg: "",
    previewspeedoMeterImgName: "",
    previewcarRightImg: "",
    previewcarLeftImg: "",
    previewcarLeftImgName: "",
    previewcarBackImg: "",
    previewcarBackImgName: "",
    previewcarFrontImg: "",
    previewcarFrontImgName: "",
    previewcarRightImgName: "",
    otherImagesDoc: [],
    otherfieldsDoc: [],
    refurbishmentItems: [],
    refurbishmentAdditionalItems: [],
  },
  profileControls: {
    registrationNumber: "6tyu8765rgcvvcc",
    variant: "",
    fuelType: "",
    transmission: "",
    chassisNumber: "",
    engineNumber: "",
    yearOfManufacturing: "",
    dateOfRegistration: "",
    registrationValidity: "",
    pincode: "",
    belt: true,
    airconditioning: "",
    remarks1: "",
    bodyrust: "",
    registrationState: "",
    registrationDistrict: "",
    registrationCity: "",
    emission: "",
    Interior: "",
    Trunk: "",
    Exterior: "",
    role: "",
    managerId: "",
    Engineroomcleaning: "no",
    evaluatorId: "",
    UnderneathVehicle: "",
    InTheDiversseat: "",
    cruisecontrol: "",
    DrivingYourTestDrive: "",
    vehicletype: "",
    typeofbody: "",
    distanceDriven: "",
    NoOfOwners: "",
    floorcovering: "",
    challanPending: "",
    exhaustpipe: "",
    VehicleExterior: "",
    bumper: "",
    vehicleServiceCost: "",
    managerid: "",
    frontright: "",
    frontleft: "",
    rearright: "",
    rearleft: "",
    sparediskwheel: "",
    sparealliwheel: "",
    majorAccident: "",
    majorAccidentRemarks: "",
    minorAccident: "",
    minorAccidentRemarks: "",
    hypothetication: "",
    hypotheticatedBranch: "",
    loanDue: "",
    insuranceType: "",
    generalappearence: "",
    Engine: "",
    engine: "",
    colour: "",
    remarks: "",
    insuranceCompanyName: "",
    policyNumber: "",
    insuranceFrom: "",
    insuranceTo: "",
    carFrontImgName: "",
    carFrontImg: "",
    dashboard: "",
    carBackImgName: "",
    carBackImg: "",
    carLeftImgName: "",
    carLeftImg: "",
    carRightImgName: "",
    carRightImg: "",
    speedoMeterImgName: "",
    speedoMeterImg: "",
    chassisImgName: "",
    chassisImg: "",
    VehicleServiceCost: "",
    interiorImg: "",
    Pollutioncertificate: "no",
    vinPlateImg: "",
    rcFrontName: "",
    rcFrontImg: "",
    Drycleaning: "no",
    RubbingPolishingCost: "no",
    CCClearances: "no",
    SpareKeysCost: "no",
    Challenamount: "no",
    otherCharges: "",
    otherImages: "",
    Engineandtransmission: "no",
    RegistrationCost: "no",
    Vehicletransfercharges: "no",
    Removalstains: "no",
    Nocclearance: "no",
    Coolantandfilter: "no",
    Steeringandfluid: "no",
    rcBackName: "",
    rcBackImg: "",
    insuranceName: "",
    insuranceImg: "",
    InsuranceCost: "no",
    interiorFrontName: "",
    interiorFrontImg: "",
    interiorBackName: "",
    interiorBackImg: "",
    invoiceName: "",
    invoiceImg: "",
    extraFitmentName: "",
    extraFitmentImg: "",
    functionsName: "",
    functionsImg: "",
    getcardetails: "",
    scratchName: "",
    scratchImg: "",
    dentName: "",
    dentImg: "",
    breaksDmgName: "",
    breaksDmgImg: "",
    numberPlateName: "",
    numberPlateImg: "",
    oldCarNocName: "",
    oldCarNocImg: "",
    periodicServiceValue: "",
    insuranceValue: "",
    spareKeysValue: "",
    registrationValue: "",
    rubbingPolishingValue: "",
    mobileNum: "8798247987",
    otherDocfieldName: "",
    periodicService: "no",
    interiorCleaningValue: "",
    interiorCleaningCost: "",
    pollutionCertificateValue: "",
    pollutionCertificateCost: "",
    entertextfield: "",
    priceGap: "",
    acceptCost: "",
    rejectCost: "",
    evaluatorofferedprice: "",
    otherImagesDoc: [],
    otherfieldsDoc: [],
    refurbishmentItems: [],
    refurbishmentAdditionalItems: [],
  },
};

const Payload = {
  id: 0,
  nameOnRC: "susmitha one",
  registrationNumber: "AAAAAA1234",
  mobileNum: "7675656640",
  customerId: "18-286-ca9d9470-478b-43df-9ffa-4a57b6644470",
  regValidity: "2023-06-08",
  regDistrict: "Khammam",
  regCity: "khammam",
  pincode: "507001",
  regState: "Telangana",
  imageDocuments: [
    {
      documentName: "frontside",
      url: "https://dms-automate-prod.s3.ap-south-1.amazonaws.com/18-286-ca9d9470-478b-43df-9ffa-4a57b6644470/ETVBRL_1684420826675.xlsxEBR .png",
    },
    {
      documentName: "backside",
      url: "https://dms-automate-prod.s3.ap-south-1.amazonaws.com/18-286-ca9d9470-478b-43df-9ffa-4a57b6644470/ETVBRL_1684420826675.xlsxFact sheet.png",
    },
    {
      documentName: "leftside",
      url: "https://dms-automate-prod.s3.ap-south-1.amazonaws.com/18-286-ca9d9470-478b-43df-9ffa-4a57b6644470/ETVBRL_1684420826675.xlsxSupport.png",
    },
    {
      documentName: "rightside",
      url: "https://dms-automate-prod.s3.ap-south-1.amazonaws.com/18-286-ca9d9470-478b-43df-9ffa-4a57b6644470/ETVBRL_1685554496096.xlsxETBR.png",
    },
    {
      documentName: "speedometer",
      url: "https://dms-automate-prod.s3.ap-south-1.amazonaws.com/18-286-ca9d9470-478b-43df-9ffa-4a57b6644470/ETVBRL_1685554496096.xlsxSupport Group Lvl.png",
    },
    {
      documentName: "chassis",
      url: "https://dms-automate-prod.s3.ap-south-1.amazonaws.com/18-286-ca9d9470-478b-43df-9ffa-4a57b6644470/ETVBRL_1685554496096.xlsxSupport Team Lvl.png",
    },
    {
      documentName: "interiorfront",
    },
    {
      documentName: "interiorback",
    },
    {
      documentName: "rc front",
      url: "https://dms-automate-prod.s3.ap-south-1.amazonaws.com/18-286-ca9d9470-478b-43df-9ffa-4a57b6644470/ETVBRL_1684420826675.xlsxFact sheet.png",
    },
    {
      documentName: "rc back",
      url: "https://dms-automate-prod.s3.ap-south-1.amazonaws.com/18-286-ca9d9470-478b-43df-9ffa-4a57b6644470/ETVBRL_1684420826675.xlsxSupport.png",
    },
    {
      documentName: "insurance",
    },
    {
      documentName: "invoice",
    },
    {
      documentName: "extra fitment",
    },
    {
      documentName: "scrach damage",
    },
    {
      documentName: "dent damage",
    },
    {
      documentName: "functions",
    },
    {
      documentName: "break damage",
    },
    {
      documentName: "number plate",
    },
    {
      documentName: "bank finance old car/noc",
    },
  ],
  otherImages: [],
  model: "Grand i10",
  varient: "i10 grand",
  yearMonthOfManufacturing: "05-2022",
  vehicleType: "Personal",
  typeOfBody: "Sedan",
  kmDriven: "56",
  frontWheelRight: "75",
  frontWheelLeft: "75",
  rearWheelRight: "75",
  rearWheelLeft: "75",
  spareDiskWheel: "75",
  spareAlliWheel: "75",
  anyMajorAccident: "No",
  anyMajorAccidentRemark: "",
  anyMinorAccident: "No",
  anyMinorAccidentRemark: "",
  updatedDate: "",
  make: "Hyundai",
  fuelType: "Petrol",
  chassisNum: "78hb",
  noOfOwners: "1",
  colour: "pink",
  transmission: "DR5",
  data: [],
  role: "Evaluator",
  totalRefurbishmentCost: null,
  evalutionStatus: "EvalutionSubmitted",
  evalutorId: 955,
  VehicleExterior: "",
  DrivingYourTestDrive: "",
  InTheDiversseat: "",
  UnderneathVehicle: "",
  Trunk: "",
  Engine: "",
  Exterior: "",
  Interior: "",
  engineNumber: "9877",
  nocclearance: null,
  challenamount: null,
  oilChangesCost: null,
  regDate: "2023-06-06T18:30:00.000Z",
  emission: "free",
  challanPending: "0",
  hypothecation: "freehyp",
  hypothecatedBranch: "hyd",
  hypothecatedCompletedDate: "2023-06-01",
  insuranceType: "Nil dip",
  loanAmountDue: "7000000",
  insuranceCompanyName: "sbi",
  policyNumber: "hgh7576gfgf6r6r",
  insFromDate: "2023-06-01",
  insToDate: "2023-06-08",
  periodicService: "no",
  periodicServiceCost: null,
  EngineandtransmissionCost: null,
  spareKey: "no",
  spareKeyCost: null,
  rubbingPolishing: "no",
  rubbingPolishingCost: null,
  insurance: "no",
  insuranceCost: null,
  regDocument: "no",
  regDocumentCharges: null,
  pollutionCertificate: "no",
  pollutionCertificateCost: null,
  oilChanges: "no",
  powerbrakefluidchange: "no",
  powerBrakeFluidChangeCost: null,
  coolantFilterChange: "no",
  coolantFilterChangeCost: null,
  removalStainMarksStickers: "no",
  removalStainMarksStickersCost: null,
  carpetCleaning: "no",
  carpetCleaningCost: null,
  engineRoom: "no",
  engineRoomCost: null,
  vehicleTransfer: "no",
  vehicleTransferCharges: null,
  nocClearanceExpense: "no",
  nocClearanceExpenseCost: null,
  challanAmount: "no",
  challanAmountCost: null,
  ccClearanceExpense: "no",
  ccClearanceExpenseCost: null,
  otherCharges: [],
  custExpectedPrice: 500000,
  evaluatorOfferPrice: 400000,
  managerId: 942,
  carExchangeEvalutionCosts: [],
};
const EvaluationForm = ({ route, navigation }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [dropDownTitle, setDropDownTitle] = useState("");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imageTitle, setImageTitle] = useState("");
  const [datePickerTitle, setDatePickerTitle] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [errors, setErrors] = useState({});
  const [addAnotherInsuranceImage, setAddAnotherInsuranceImage] = useState([]);
  const [enterInsurance, setEnterInsurance] = useState(true);
  const [enterHypothication, setEnterHypothication] = useState(true);

  const [cost, setCost] = useState("0");
  const [costName, setCostName] = useState("");
  const [addOtherCost, setAddOtherCost] = useState(false);

  const [salutation, setSalutation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [relationName, setRelationName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState("");
  const [anniversaryDate, setAnniversaryDate] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [alternateMobileNumber, setAlternateMobileNumber] = useState("");
  const [email, setEmail] = useState("");

  const [salutationError, setSalutationError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");

  const [rcNumber, setRcNumber] = useState("");
  const [nameOnRc, setNameOnRc] = useState("");
  const [mobileNumber2, setMobileNumber2] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [make, setMake] = useState("");
  const [variant, setVariant] = useState("");
  const [colour, setColour] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [vinNumber, setVinNumber] = useState("");
  const [engineNumber, setEngineNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [yearMonthOfManufacturing, setYearMonthOfManufacturing] = useState("");
  const [dateOfRegistration, setDateOfRegistration] = useState("");
  const [regnValidUpto, setRegnValidUpto] = useState("");
  const [pincode, setPincode] = useState("");
  const [registrationState, setRegistrationState] = useState("");
  const [registrationDistrict, setRegistrationDistrict] = useState("");
  const [registrationCity, setRegistrationCity] = useState("");
  const [emission, setEmission] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [typeOfBody, setTypeOfBody] = useState("");
  const [kmsDriven, setKmsDriven] = useState("");
  const [cubicCapacity, setCubicCapacity] = useState("");
  const [noOwners, setNoOwners] = useState("");
  const [noOfChallanPending, setNoOfChallanPending] = useState("");

  const [frontRightSelected, setFrontRightSelected] = useState("75");
  const [frontLeftSelected, setFrontLeftSelected] = useState("75");
  const [rearRightSelected, setRearRightSelected] = useState("75");
  const [rearLeftSelected, setRearLeftSelected] = useState("75");
  const [spareDiskWheelSelected, setSpareDiskWheelSelected] = useState("75");
  const [spareAlliWheelSelected, setSpareAlliWheelSelected] = useState("75");
  const [anyMinorAccidentSelected, setAnyMinorAccidentSelected] =
    useState("yes");
  const [anyMajorAccidentSelected, setAnyMajorAccidentSelected] =
    useState("No");

  const [ImageDocuments, setImageDocuments] = useState([
    {
      documentName: "frontside",
      url: "https://dms-automate-prod.s3.ap-south-1.amazonaws.com/18-286-ca9d9470-478b-43df-9ffa-4a57b6644470/ETVBRL_1684420826675.xlsxEBR .png",
    },
    {
      documentName: "backside",
      url: "https://dms-automate-prod.s3.ap-south-1.amazonaws.com/18-286-ca9d9470-478b-43df-9ffa-4a57b6644470/ETVBRL_1684420826675.xlsxFact sheet.png",
    },
    {
      documentName: "leftside",
      url: "https://dms-automate-prod.s3.ap-south-1.amazonaws.com/18-286-ca9d9470-478b-43df-9ffa-4a57b6644470/ETVBRL_1684420826675.xlsxSupport.png",
    },
    {
      documentName: "rightside",
      url: "https://dms-automate-prod.s3.ap-south-1.amazonaws.com/18-286-ca9d9470-478b-43df-9ffa-4a57b6644470/ETVBRL_1685554496096.xlsxETBR.png",
    },
    {
      documentName: "speedometer",
      url: "https://dms-automate-prod.s3.ap-south-1.amazonaws.com/18-286-ca9d9470-478b-43df-9ffa-4a57b6644470/ETVBRL_1685554496096.xlsxSupport Group Lvl.png",
    },
    {
      documentName: "chassis",
    },
    {
      documentName: "interiorfront",
    },
    {
      documentName: "interiorback",
    },
    {
      documentName: "rc front",
    },
    {
      documentName: "rc back",
    },
    {
      documentName: "insurance",
    },
    {
      documentName: "invoice",
    },
    {
      documentName: "extra fitment",
    },
    {
      documentName: "scrach damage",
    },
    {
      documentName: "dent damage",
    },
    {
      documentName: "functions",
    },
    {
      documentName: "break damage",
    },
    {
      documentName: "number plate",
    },
    {
      documentName: "bank finance old car/noc",
    },
  ]);

  const [customerExpectedPrice, setCustomerExpectedPrice] = useState("");
  const [evaluatorOfferedPrice, setEvaluatorOfferedPrice] = useState(0);
  const [managerApprovedPrice, setManagerApprovedPrice] = useState("");
  const [priceGap, setPriceGap] = useState("");
  const [approvalExpiryDate, setApprovalExpiryDate] = useState("");

  const [insuranceType, setInsuranceType] = useState("");
  const [insuranceCompanyName, setInsuranceCompanyName] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [insuranceFromDate, setInsuranceFromDate] = useState("");
  const [insuranceToDate, setInsuranceToDate] = useState("");

  const [hypothecatedTo, setHypothecatedTo] = useState("");
  const [hypothecatedBranch, setHypothecatedBranch] = useState("");
  const [loanAmountDue, setLoanAmountDue] = useState("");
  const [hypothicationCompletedDate, setHypothicationCompletedDate] =
    useState("");

  const [frontSideImage, setFrontSideImage] = useState(null);
  const [backSideImage, setBackSideImage] = useState(null);
  const [leftSideImage, setLeftSideImage] = useState(null);
  const [rightSideImage, setRightSideImage] = useState(null);
  const [speedometerImage, setSpeedometerImage] = useState(null);
  const [chassisImage, setChassisImage] = useState(null);
  const [interiorFrontImage, setInteriorFrontImage] = useState(null);
  const [interiorBackImage, setInteriorBackImage] = useState(null);
  const [extraFitmentImage, setExtraFitmentImage] = useState(null);
  const [scratchDamageImage, setScratchDamageImage] = useState(null);
  const [dentDamageImage, setDentDamageImage] = useState(null);
  const [functionsImage, setFunctionsImage] = useState(null);
  const [breakDamageImage, setBreakDamageImage] = useState(null);
  const [numberPlateImage, setNumberPlateImage] = useState(null);

  const [rcFrontImage, setRcFrontImage] = useState(null);
  const [rcBackImage, setRcBackImage] = useState(null);
  const [insuranceCopyImage, setInsuranceCopyImage] = useState(null);
  const [invoiceImage, setInvoiceImage] = useState(null);
  const [hypothicationDocumentImage, setHypothicationDocumentImage] =
    useState(null);
  const [oldCarNOCImage, setOldCarNOCImage] = useState(null);
  const [ccImage, setCcImage] = useState(null);
  const [pollutionImage, setPollutionImage] = useState(null);
  const [idProofImage, setIdProofImage] = useState(null);
  const [panCardImage, setPanCardImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);

  const [openAccordian, setOpenAccordian] = useState("1");
  const [openAccordian2, setOpenAccordian2] = useState("1");
  const [openAccordianError, setOpenAccordianError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePickerError, setShowDatePickerError] = useState(null);
  const [permanentAddress, setPermanentAddress] = useState({
    pincode: "",
    isUrban: "",
    isRural: null,
    houseNo: "",
    street: "",
    village: "",
    city: "",
    district: "",
    state: "",
    mandal: "",
    country: null,
  });
  const [communicationAddress, setCommunication] = useState({
    pincode: "",
    isUrban: "",
    isRural: null,
    houseNo: "",
    street: "",
    village: "",
    city: "",
    district: "",
    state: "",
    mandal: "",
    country: null,
  });
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [addressData, setAddressData] = useState([]);
  const [addressData2, setAddressData2] = useState([]);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  // const [Refurbishment, setRefurbishment] = useState({
  //   Items: [],
  //   AdditionalExpenses: [],
  // });
  const [Refurbishment, setRefurbishment] = useState({
    Items: [
      {
        id: 16,
        type: "Items",
        items: "Testing Items",
        status: "Active",
        orgId: "18",
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        cost: 0,
      },
      {
        id: 19,
        type: "Items",
        items: "TTTT",
        status: "Active",
        orgId: "18",
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        cost: 0,
      },
    ],
    AdditionalExpenses: [
      {
        id: 15,
        type: "Additional Expenses",
        items: "Testing",
        status: "Active",
        orgId: "18",
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        cost: 0,
      },
      {
        id: 18,
        type: "Additional Expenses",
        items: "Testing Items Evaluation Parameters ",
        status: "Active",
        orgId: "18",
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        cost: 0,
      },
      {
        id: 20,
        type: "Additional Expenses",
        items: "hI",
        status: "Active",
        orgId: "18",
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        cost: 0,
      },
    ],
  });
  const [brandDropDown, setBrandDropDown] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState({});
  const [modalDropdown, setModalDropdown] = useState([]);
  const [maxDate, setMaxDate] = useState(new Date());
  const [miniDate, setMiniDate] = useState(null);
  const [budget, setBudget] = useState("");
  const [submitButtonPressed, setSubmitButtonPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [userData, setUserData] = useState(null);

  let scrollRef = useRef(null);

  useEffect(() => {
    getCurrentEvaluation();
    getOptions();
    getCheckList();
    getModalList();
  }, []);

  useEffect(() => {
    console.log("Input ", route.params);
    if (route.params) {
      getCurrentEvaluation(route.params.universalId);
    }
  }, [route.params]);

  // Set Address
  useEffect(() => {
    const tempCAddress = incomming.dmsLeadDto.dmsAddresses;
    const getCAddress = tempCAddress.filter(
      (item) => item.addressType === "Communication"
    )[0];
    setCommunication({
      pincode: getCAddress.pincode,
      isUrban: getCAddress.urban,
      isRural: getCAddress.rural,
      houseNo: getCAddress.houseNo,
      street: getCAddress.street,
      village: getCAddress.village,
      city: getCAddress.city,
      district: getCAddress.district,
      state: getCAddress.state,
      mandal: "",
      country: getCAddress.county,
    });
    const getPAddress = tempCAddress.filter(
      (item) => item.addressType === "Permanent"
    )[0];
    setPermanentAddress({
      pincode: getPAddress.pincode,
      isUrban: getPAddress.urban,
      isRural: getPAddress.rural,
      houseNo: getPAddress.houseNo,
      street: getPAddress.street,
      village: getPAddress.village,
      city: getPAddress.city,
      district: getPAddress.district,
      state: getPAddress.state,
      mandal: "",
      country: getPAddress.county,
    });
  }, []);

  useEffect(() => {
    if (initialData) {
      const temp = initialData.dmsAccountDto;
      setFirstName(temp.firstName);
      setLastName(temp.lastName);
      setAlternateMobileNumber(temp.secondaryPhone);
      setMobileNumber(temp.phone);
      setEmail(temp.email);
      setGender(temp.gender.charAt(0).toUpperCase() + temp.gender.slice(1));

      const evaluationTemp = initialData.profileControls;
      setRcNumber(evaluationTemp.registrationNumber);
      setVariant(evaluationTemp.variant);
      setFuelType(evaluationTemp.fuelType);
      setTransmission(evaluationTemp.transmission);
      setEngineNumber(evaluationTemp.engineNumber);
      setPincode(evaluationTemp.pincode);
      setRegistrationCity(evaluationTemp.registrationCity);
      setRegistrationDistrict(evaluationTemp.registrationDistrict);
      setRegistrationState(evaluationTemp.registrationState);
      setEmission(evaluationTemp.emission);
      setDateOfRegistration(evaluationTemp.dateOfRegistration);
      setRegnValidUpto(evaluationTemp.registrationValidity);
      setVehicleType(evaluationTemp.vehicletype);
      setTypeOfBody(evaluationTemp.typeofbody);
      setKmsDriven(evaluationTemp.distanceDriven);
      setNoOfChallanPending(evaluationTemp.challanPending);
      setNoOwners(evaluationTemp.NoOfOwners);
      setFrontRightSelected(evaluationTemp.frontright);
      setRearLeftSelected(evaluationTemp.rearleft);
      setRearRightSelected(evaluationTemp.rearright);
      setSpareDiskWheelSelected(evaluationTemp.sparediskwheel);
      setSpareAlliWheelSelected(evaluationTemp.sparealliwheel);
      setAnyMinorAccidentSelected(evaluationTemp.minorAccident);
      setAnyMajorAccidentSelected(evaluationTemp.majorAccident);
      setHypothecatedTo(evaluationTemp.hypothetication);
      setHypothecatedBranch(evaluationTemp.hypotheticatedBranch);
      setLoanAmountDue(evaluationTemp.loanDue);
      setInsuranceType(evaluationTemp.insuranceType);
      setInsuranceCompanyName(evaluationTemp.insuranceCompanyName);
      setPolicyNumber(evaluationTemp.policyNumber);
      setInsuranceFromDate(evaluationTemp.insuranceFrom);
      setInsuranceToDate(evaluationTemp.insuranceTo);

      setFrontSideImage({
        name: evaluationTemp.carFrontImgName,
        url: evaluationTemp.carFrontImg,
      });
      setBackSideImage({
        name: evaluationTemp.carBackImgName,
        url: evaluationTemp.carBackImg,
      });
      setLeftSideImage({
        name: evaluationTemp.carLeftImgName,
        url: evaluationTemp.carLeftImg,
      });
      setRightSideImage({
        name: evaluationTemp.carRightImgName,
        url: evaluationTemp.carRightImg,
      });
      setSpeedometerImage({
        name: evaluationTemp.chassisImgName,
        url: evaluationTemp.chassisImg,
      });
      setInteriorFrontImage({
        name: evaluationTemp.interiorFrontName,
        url: evaluationTemp.interiorFrontImg,
      });
      setInteriorBackImage({
        name: evaluationTemp.interiorBackName,
        url: evaluationTemp.interiorBackImg,
      });
      setExtraFitmentImage({
        name: evaluationTemp.extraFitmentName,
        url: evaluationTemp.extraFitmentImg,
      });

      setScratchDamageImage({
        name: evaluationTemp.scratchName,
        url: evaluationTemp.scratchImg,
      });
      setDentDamageImage({
        name: evaluationTemp.dentName,
        url: evaluationTemp.dentImg,
      });
      setFunctionsImage({
        name: evaluationTemp.functionsName,
        url: evaluationTemp.functionsImg,
      });
      setBreakDamageImage({
        name: evaluationTemp.breaksDmgName,
        url: evaluationTemp.breaksDmgImg,
      });
      setNumberPlateImage({
        name: evaluationTemp.numberPlateName,
        url: evaluationTemp.numberPlateImg,
      });

      setRcFrontImage({
        name: evaluationTemp.rcFrontName,
        url: evaluationTemp.rcFrontImg,
      });
      setRcBackImage({
        name: evaluationTemp.rcBackName,
        url: evaluationTemp.rcBackImg,
      });
      setInsuranceCopyImage({
        name: evaluationTemp.insuranceName,
        url: evaluationTemp.insuranceImg,
      });
      setInvoiceImage({
        name: evaluationTemp.invoiceName,
        url: evaluationTemp.invoiceImg,
      });
      setOldCarNOCImage({
        name: evaluationTemp.oldCarNocName,
        url: evaluationTemp.oldCarNocImg,
      });
      setCcImage({
        name: "",
        url: "",
      });
      setPollutionImage({
        name: "",
        url: "",
      });
      setIdProofImage({
        name: "",
        url: "",
      });
      setPanCardImage({
        name: "",
        url: "",
      });
      setMobileNumber2(evaluationTemp.mobileNum);
      setPriceGap(evaluationTemp.priceGap);
      setEvaluatorOfferedPrice(evaluationTemp.evaluatorofferedprice);
    }
  }, [initialData]);

  const getOptions = async () => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        setUserData(jsonObj);
        const response = await client.get(
          URL.GET_ALL_EVALUATION(jsonObj.orgId)
        );
        const json = await response.json();
        if (response.ok) {
          // setRefurbishment(json);
        }
      }
    } catch (error) {
      // setRefurbishment({ Items: [], AdditionalExpenses: [] });
    }
  };

  const getCurrentEvaluation = async (universalId) => {
    try {
      const response = await client.get(URL.GET_EVALUATION(universalId));
      const json = await response.json();
      if (response.ok) {
        setInitialData(json);
      }
    } catch (error) {}
  };

  const getCheckList = async () => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const response = await client.get(
          URL.MAKE_LIST_EVALATION(jsonObj.orgId)
        );
        const json = await response.json();
        if (response.ok) {
          const newArr = json.map(addIsActive);
          setBrandDropDown(newArr);
        }
      }
    } catch (error) {}
  };

  function addIsActive(v) {
    return { ...v, isSelected: false, name: v.otherMaker };
  }
  function addIsActive2(v) {
    return { ...v, isSelected: false, name: v.otherModel };
  }

  function isValidInput(input) {
    var regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(input);
  }

  const getModalList = async () => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const response = await client.get(URL.GET_CHECKLIST(1));
        const json = await response.json();
      }
    } catch (error) {}
  };

  const updateAddressDetails = (pincode, Label) => {
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
              tempAddr.push({
                label: res[i].Name,
                value: res[i],
                isSelected: false,
              });
              if (i === res.length - 1) {
                if (Label == "Permanent") {
                  setAddressData2([...tempAddr]);
                } else {
                  setAddressData([...tempAddr]);
                }
              }
            }
          }
        }
        // dispatch(updateAddressByPincode(resolve));
      },
      (rejected) => {}
    );
  };

  const handleSave = (item) => {
    // handle form submit here
    // Keyboard.dismiss();
    setModalVisible(false);
  };

  const scrollToPos = (itemIndex) => {
    scrollRef.current.scrollTo({ y: itemIndex * 70 });
  };

  const handleLogin = () => {
    // Handle login logic here
  };

  const handleSubmit = () => {
    // if (!validation()) {
    // }
    // handle form submission logic
    scrollToPos(0);
    setOpenAccordian("2");
  };

  function formatRefurbishmentData(data) {
    const formattedItems = data.Items.map((item) => {
      return { item: item.items, cost: item.cost };
    });

    const formattedExpenses = data.AdditionalExpenses.map((expense) => {
      return { item: expense.items, cost: expense.cost };
    });

    return [...formattedItems, ...formattedExpenses];
  }

  const handleValidation = () => {
    const newErrors = {};
    let isValid = true;
    console.log(
      "Refurbishment",
      JSON.stringify(formatRefurbishmentData(Refurbishment))
    );

    // Validate First Name
    // if (firstName.trim() === "") {
    //   newErrors.firstName = "First Name is required";
    //   isValid = false;
    // }

    // // Validate Last Name
    // if (lastName.trim() === "") {
    //   newErrors.lastName = "Last Name is required";
    //   isValid = false;
    // }

    // Validate Date of Birth
    // if (dateOfBirth.trim() === "") {
    //   newErrors.dateOfBirth = "Date of Birth is required";
    //   isValid = false;
    // } else {
    //   // Add additional validation logic for date format or range if needed
    // }

    // Validate Mobile Number
    // if (mobileNumber.trim() === "") {
    //   newErrors.mobileNumber = "Mobile Number is required";
    //   isValid = false;
    // } else {
    //   if (mobileNumber.trim().length === 10) {
    //     newErrors.mobileNumber = "Length of Mobile Number must be 10";
    //     isValid = false;
    //   }
    //   // Add additional validation logic for mobile number format if needed
    // }

    // if (communicationAddress.pincode.trim() === "") {
    //   newErrors.cpincode = "Pincode is required";
    //   isValid = false;
    // }

    if (pincode.trim() === "") {
      newErrors.ppincode = "Pincode is required";
      isValid = false;
    }

    // Validate RC Number
    if (rcNumber.trim() === "") {
      newErrors.rcNumber = "RC Number is required";
      isValid = false;
    }

    // Validate Name On RC
    if (nameOnRc.trim() === "") {
      newErrors.nameOnRc = "Name On RC is required";
      isValid = false;
    }

    // Validate Mobile Number
    if (mobileNumber2.trim() === "") {
      newErrors.mobileNumber2 = "Mobile Number is required";
      isValid = false;
    }

    // Validate Variant
    if (variant.trim() === "") {
      newErrors.variant = "Variant is required";
      isValid = false;
    }

    // Validate Colour
    if (colour.trim() === "") {
      newErrors.colour = "Colour is required";
      isValid = false;
    }

    // Validate Transmission
    if (transmission.trim() === "") {
      newErrors.transmission = "Transmission is required";
      isValid = false;
    }

    // Validate Vin Number
    if (vinNumber.trim() === "") {
      newErrors.vinNumber = "Vin Number is required";
      isValid = false;
    }

    // Validate Engine Number
    if (engineNumber.trim() === "") {
      newErrors.engineNumber = "Engine Number is required";
      isValid = false;
    }

    // // Validate Month
    // if (month.trim() === "") {
    //   newErrors.month = "Month is required";
    // }

    // // Validate Year
    // if (year.trim() === "") {
    //   newErrors.year = "Year is required";
    // }

    // Validate Pincode
    if (pincode.trim() === "") {
      newErrors.pincode = "Pincode is required";
    }

    // Validate Registration State
    if (registrationState.trim() === "") {
      newErrors.registrationState = "Registration State is required";
    }

    // Validate Registration District
    if (registrationDistrict.trim() === "") {
      newErrors.registrationDistrict = "Registration District is required";
    }

    // Validate Registration City
    if (registrationCity.trim() === "") {
      newErrors.registrationCity = "Registration City is required";
    }

    // Validate Emission
    if (emission.trim() === "") {
      newErrors.emission = "Emission is required";
    }

    // // Validate Vehicle Type
    // if (vehicleType.trim() === "") {
    //   newErrors.vehicleType = "Vehicle Type is required";
    // }

    // // Validate Type of Body
    // if (typeOfBody.trim() === "") {
    //   newErrors.typeOfBody = "Type of Body is required";
    // }

    // Validate KM's driven
    if (kmsDriven.trim() === "") {
      newErrors.kmsDriven = "KM's driven is required";
    }

    // Validate Cubic Capacity
    if (cubicCapacity.trim() === "") {
      newErrors.cubicCapacity = "Cubic Capacity is required";
    }

    // Validate No Owners
    if (noOwners.trim() === "") {
      newErrors.noOwners = "No Owners is required";
    }

    // Validate No. of Challan Pending
    if (noOfChallanPending.trim() === "") {
      newErrors.noOfChallanPending = "No. of Challan Pending is required";
    }

    if (enterHypothication && hypothecatedTo.trim() === "") {
      newErrors.hypothecatedTo = "Hypothecated To is required";
    }

    // Validate Hypothecated Branch
    if (enterHypothication && hypothecatedBranch.trim() === "") {
      newErrors.hypothecatedBranch = "Hypothecated Branch is required";
    }

    // Validate Loan amount due
    if (enterHypothication && loanAmountDue.trim() === "") {
      newErrors.loanAmountDue = "Loan amount due is required";
    }

    // // Validate Hypothication Completed Date
    // if (hypothicationCompletedDate.trim() === "") {
    //   newErrors.hypothicationCompletedDate =
    //     "Hypothication Completed Date is required";
    // }

    // Validate Customer Expected Price
    if (customerExpectedPrice.trim() === "") {
      newErrors.customerExpectedPrice = "Customer Expected Price is required";
    }

    // Validate Evaluator Offered Price
    console.log(evaluatorOfferedPrice);
    if (evaluatorOfferedPrice === 0) {
      newErrors.evaluatorOfferedPrice = "Evaluator Offered Price is required";
    }

    // Validate Manager Approved Price
    if (managerApprovedPrice.trim() === "") {
      newErrors.managerApprovedPrice = "Manager Approved Price is required";
    }

    // Validate Approval Expiry Date
    if (approvalExpiryDate.trim() === "") {
      newErrors.approvalExpiryDate = "Approval Expiry Date is required";
    }

    if (insuranceCompanyName.trim() === "") {
      newErrors.insuranceCompanyName = "Insurance Company Name is required";
    }

    if (policyNumber.trim() === "") {
      newErrors.policyNumber = "Policy Number is required";
    }

    if (!/^[A-Za-z0-9]{13}$/.test(rcNumber)) {
      newErrors.rcNumber = "Registration number must be 13 characters long.";
    }

    if (new Date(dateOfRegistration) > new Date()) {
      newErrors.dateOfRegistration = "Future dates are not allowed.";
    }

    if (new Date(regnValidUpto) < new Date()) {
      newErrors.regnValidUpto = "Only future dates are allowed.";
    }
    if (!/^[A-Za-z0-9IVX]{4}$/.test(emission)) {
      newErrors.emission =
        "Emission must be 4 characters long and can contain alphabets, numerics, or Roman numerals.";
    }
    if (frontRightSelected.trim() === "") {
      newErrors.frontRightSelected = "frontRightSelected is required";
    }
    if (frontLeftSelected.trim() === "") {
      newErrors.frontLeftSelected = "frontLeftSelected is required";
    }
    if (rearRightSelected.trim() === "") {
      newErrors.rearRightSelected = "rearRightSelected is required";
    }
    if (rearLeftSelected.trim() === "") {
      newErrors.rearLeftSelected = "rearLeftSelected is required";
    }
    if (spareDiskWheelSelected.trim() === "") {
      newErrors.spareDiskWheelSelected = "spareDiskWheelSelected is required";
    }
    if (spareAlliWheelSelected.trim() === "") {
      newErrors.spareAlliWheelSelected = "spareAlliWheelSelected is required";
    }
    if (anyMinorAccidentSelected.trim() === "") {
      newErrors.anyMinorAccidentSelected =
        "anyMinorAccidentSelected is required";
    }
    if (anyMajorAccidentSelected.trim() === "") {
      newErrors.spareAlliWheelSelected = "anyMajorAccidentSelected is required";
    }
    // Update the errors state
    console.log("SSsss", newErrors);
    setErrors(newErrors);
    if (!_.isEmpty(newErrors)) {
      showAlertMessage("Provide the required fields");
      setSubmitButtonPressed(true);
    } else {
      update();
    }
  };

  const updateAccordian = (selectedIndex) => {
    // Keyboard.dismiss();
    if (selectedIndex != openAccordian) {
      setOpenAccordian(selectedIndex);
    } else {
      setOpenAccordian(0);
    }
  };

  const updateSecondAccordian = (selectedIndex) => {
    // Keyboard.dismiss();
    if (selectedIndex != openAccordian2) {
      setOpenAccordian2(selectedIndex);
    } else {
      setOpenAccordian2(0);
    }
  };

  const showDropDownModelMethod = (item) => {
    switch (item) {
      case "Salutation":
        setDataForDropDown([...Salutation_Types]);
        break;
      case "Gender":
        setDataForDropDown([...Gender_Types]);
        break;
      case "Village/Town":
        break;
      case "PerVillage/Town":
        break;
      case "Brand":
        setDataForDropDown([...brandDropDown]);
        break;
      case "Model":
        setDataForDropDown([...modalDropdown]);
        break;
      case "Fuel Type":
        setDataForDropDown([...Fuel_Types]);
        break;
      case "Month":
        setDataForDropDown([...months]);
        break;
      case "Year":
        const d = new Date().getFullYear();
        setDataForDropDown([
          ..._.reverse(createYearObjects(1850, parseInt(d))),
        ]);
        break;
      case "Vehicle Type":
        setDataForDropDown([...Vehicle_Types]);
        break;
      case "Type of Body":
        setDataForDropDown([...TypeOf_body_Types]);
        break;
      case "Insurance Type":
        setDataForDropDown([...Insurence_Types]);
        break;
      default:
        break;
    }
    setDropDownTitle(item);
    setShowDropDown(true);
  };

  function createYearObjects(startYear, endYear) {
    const yearObjects = [];
    let id = 0;
    for (let year = startYear; year <= endYear; year++) {
      yearObjects.push({ name: year, id: id + 1 });
      id = id + 1;
    }
    return yearObjects;
  }

  const storeDropDown = (item) => {
    switch (dropDownTitle) {
      case "Salutation":
        setSalutation(item.name);
        break;
      case "Gender":
        setGender(item.name);
        break;
      case "Village/Town":
        break;
      case "PerVillage/Town":
        break;
      case "Brand":
        setBrand(item.name);
        const newArr = item.othermodels.map(addIsActive2);
        setModalDropdown(newArr);
        break;
      case "Model":
        setModel(item.name);
        break;
      case "Fuel Type":
        setFuelType(item.name);
        break;
      case "Month":
        setMonth(item.name);
        break;
      case "Year":
        setYear(item.name);
        break;
      case "Vehicle Type":
        setVehicleType(item.name);
        break;
      case "Type of Body":
        setTypeOfBody(item.name);
        break;
      case "Insurance Type":
        setInsuranceType(item.name);
        break;
      default:
        break;
    }
    setDropDownTitle("");
    setShowDropDown(false);
  };

  const showImagePickerMethod = (item) => {
    switch (item) {
      case "Front Side":
        break;
      case "Back Side":
        break;
      case "Left Side":
        break;
      case "Right Side":
        break;
      case "Speedo meter":
        break;
      case "Chassis":
        break;
      case "Interior Front":
        break;
      case "Interior Back":
        break;
      case "Extra Fitment":
        break;
      case "Scratch Damage":
        break;
      case "Dent Damage":
        break;
      case "Functions":
        break;
      case "Break Damage":
        break;
      case "Number Plate":
        break;
      case "Rc Front":
        break;
      case "Rc Back":
        break;
      case "Insurance Copy":
        break;
      case "Hypothication Document":
        break;
      case "Bank/Finance - old car NOC":
        break;
      case "CC":
        break;
      case "Pollution":
        break;
      case "ID Proof":
        break;
      case "PAN Card":
        break;
      default:
        break;
    }
    setImageTitle(item);
    setShowImagePicker(true);
  };

  const ShowDatePickerFunction = (item) => {
    setDatePickerTitle(item);
    switch (datePickerTitle) {
      case "Approval Expiry Date":
        setMaxDate(new Date());
        setMiniDate(new Date("01/01/1700"));
        break;
      case "Insurance To Date":
        setMaxDate(null);
        setMiniDate(null);
        break;
      case "Insurance From Date":
        setMaxDate(new Date());
        setMiniDate(new Date("01/01/1700"));
        break;
      case "Hypothication Completed Date":
        setMaxDate(new Date());
        setMiniDate(new Date("01/01/1700"));
        break;
      case "Regn. Valid Upto":
        setMaxDate(null);
        setMiniDate(new Date());
        break;
      case "Date of Registration":
        setMaxDate(new Date());
        setMiniDate(new Date("01/01/1700"));
        break;
      case "Date of Birth":
        setMaxDate(new Date());
        setMiniDate(new Date("01/01/1700"));
        break;
      case "Anniversary Date":
        setMaxDate(new Date());
        setMiniDate(new Date("01/01/1700"));
        break;
      default:
        break;
    }
    setTimeout(() => {
      setShowDatePicker(true);
    }, 1000);
  };

  const saveDate = (item) => {
    switch (datePickerTitle) {
      case "Approval Expiry Date":
        setApprovalExpiryDate(item);
        break;
      case "Insurance To Date":
        setInsuranceToDate(item);
        break;
      case "Insurance From Date":
        setInsuranceToDate(item);
        break;
      case "Hypothication Completed Date":
        setHypothicationCompletedDate(item);
        break;
      case "Regn. Valid Upto":
        setRegnValidUpto(item);
        break;
      case "Date of Registration":
        setDateOfRegistration(item);
        break;
      case "Date of Birth":
        setDateOfBirth(item);
        break;
      case "Anniversary Date":
        setAnniversaryDate(item);
        break;
      default:
        break;
    }
    setShowDatePicker(false);
    setDatePickerTitle("");
  };

  const saveImages = (payload) => {
    if (imageTitle.includes("Add Image")) {
      const number = imageTitle.split(" ").pop();
      const temp = otherImages;
      temp[parseInt(number) - 1].url = payload.url;
      temp[parseInt(number) - 1].name = payload.name;
      setOtherImages(temp);
    }
    if (imageTitle.includes("Add New Image")) {
      const number = imageTitle.split(" ").pop();
      const temp = addAnotherInsuranceImage;
      temp[parseInt(number) - 1].url = payload.url;
      temp[parseInt(number) - 1].name = payload.name;
      setAddAnotherInsuranceImage(temp);
    }
    switch (imageTitle) {
      case "Front Side":
        setFrontSideImage(payload);
        break;
      case "Back Side":
        setBackSideImage(payload);
        break;
      case "Left Side":
        setLeftSideImage(payload);
        break;
      case "Right Side":
        setRightSideImage(payload);
        break;
      case "Speedo meter":
        setSpeedometerImage(payload);
        break;
      case "Chassis":
        setChassisImage(payload);
        break;
      case "Interior Front":
        setInteriorFrontImage(payload);
        break;
      case "Interior Back":
        setInteriorBackImage(payload);
        break;
      case "Extra Fitment":
        setExtraFitmentImage(payload);
        break;
      case "Scratch Damage":
        setScratchDamageImage(payload);
        break;
      case "Dent Damage":
        setDentDamageImage(payload);
        break;
      case "Functions":
        setFunctionsImage(payload);
        break;
      case "Break Damage":
        setBreakDamageImage(payload);
        break;
      case "Number Plate":
        setNumberPlateImage(payload);
        break;
      case "Rc Front":
        setRcFrontImage(payload);
        break;
      case "Rc Back":
        setRcBackImage(payload);
        break;
      case "Insurance Copy":
        setInsuranceCopyImage(payload);
        break;
      case "Invoice":
        setInvoiceImage(payload);
        break;
      case "Hypothication Document":
        setHypothicationDocumentImage(payload);
        break;
      case "Bank/Finance - old car NOC":
        setOldCarNOCImage(payload);
        break;
      case "CC":
        setCcImage(payload);
        break;
      case "Pollution":
        setPollutionImage(payload);
        break;
      case "ID Proof":
        setIdProofImage(payload);
        break;
      case "PAN Card":
        setPanCardImage(payload);
        break;
      default:
        break;
    }
  };

  const deleteImages = (payload) => {
    if (payload.includes("Add Image")) {
      const number = imageTitle.split(" ").pop();
      const temp = otherImages;
      temp[parseInt(number) - 1].url = "";
      temp[parseInt(number) - 1].name = "";
      setOtherImages(temp);
    }
    if (payload.includes("Add New Image")) {
      const number = imageTitle.split(" ").pop();
      const temp = addAnotherInsuranceImage;
      temp[parseInt(number) - 1].url = "";
      temp[parseInt(number) - 1].name = "";
      setAddAnotherInsuranceImage(temp);
    }
    switch (payload) {
      case "Front Side":
        setFrontSideImage(null);
        break;
      case "Back Side":
        setBackSideImage(null);
        break;
      case "Left Side":
        setLeftSideImage(null);
        break;
      case "Right Side":
        setRightSideImage(null);
        break;
      case "Speedo meter":
        setSpeedometerImage(null);
        break;
      case "Chassis":
        setChassisImage(null);
        break;
      case "Interior Front":
        setInteriorFrontImage(null);
        break;
      case "Interior Back":
        setInteriorBackImage(null);
        break;
      case "Extra Fitment":
        setExtraFitmentImage(null);
        break;
      case "Scratch Damage":
        setScratchDamageImage(null);
        break;
      case "Dent Damage":
        setDentDamageImage(null);
        break;
      case "Functions":
        setFunctionsImage(null);
        break;
      case "Break Damage":
        setBreakDamageImage(null);
        break;
      case "Number Plate":
        setNumberPlateImage(null);
        break;
      case "Rc Front":
        setRcFrontImage(null);
        break;
      case "Rc Back":
        setRcBackImage(null);
        break;
      case "Insurance Copy":
        setInsuranceCopyImage(null);
        break;
      case "Invoice":
        setInvoiceImage(null);
        break;
      case "Hypothication Document":
        setHypothicationDocumentImage(null);
        break;
      case "Bank/Finance - old car NOC":
        setOldCarNOCImage(null);
        break;
      case "CC":
        setCcImage(null);
        break;
      case "Pollution":
        setPollutionImage(null);
        break;
      case "ID Proof":
        setIdProofImage(null);
        break;
      case "PAN Card":
        setPanCardImage(null);
        break;
      default:
        break;
    }
  };

  function convertData(data) {
    return data.map((item) => {
      const { title, url } = item;
      return {
        document: title,
        url: url,
      };
    });
  }
  const update = async () => {
    const tempImages = otherImages.length > 0 ? convertData(otherImages) : [];
    const selectedMonth = months.filter((i) => i.name === month)[0];
    const refurbishmentData = formatRefurbishmentData(Refurbishment);
    const Payload = {
      id: 0,
      nameOnRC: nameOnRc,
      registrationNumber: rcNumber,
      mobileNum: mobileNumber,
      customerId: route.params.universalId,
      regValidity: regnValidUpto,
      regDistrict: registrationDistrict,
      regCity: registrationCity,
      pincode: pincode,
      regState: registrationState,
      imageDocuments: [
        {
          documentName: "frontside",
          url: frontSideImage.url,
        },
        {
          documentName: "backside",
          url: backSideImage.url,
        },
        {
          documentName: "leftside",
          url: leftSideImage.url,
        },
        {
          documentName: "rightside",
          url: rightSideImage.url,
        },
        {
          documentName: "speedometer",
          url: speedometerImage.url,
        },
        {
          documentName: "chassis",
          url: chassisImage.url,
        },
        {
          documentName: "interiorfront",
          url: interiorFrontImage.url,
        },
        {
          documentName: "interiorback",
          url: interiorBackImage.url,
        },
        {
          documentName: "rc front",
          url: rcFrontImage.url,
        },
        {
          documentName: "rc back",
          url: rcBackImage.url,
        },
        {
          documentName: "insurance",
          url: insuranceCopyImage.url,
        },
        {
          documentName: "invoice",
          url: invoiceImage.url,
        },
        {
          documentName: "extra fitment",
          url: extraFitmentImage.url,
        },
        {
          documentName: "scrach damage",
          url: scratchDamageImage.url,
        },
        {
          documentName: "dent damage",
          url: dentDamageImage.url,
        },
        {
          documentName: "functions",
          url: functionsImage.url,
        },
        {
          documentName: "break damage",
          url: breakDamageImage.url,
        },
        {
          documentName: "number plate",
          url: numberPlateImage.url,
        },
        {
          documentName: "bank finance old car/noc",
          url: oldCarNOCImage.url,
        },
      ],
      otherImages: tempImages,
      model: model,
      varient: variant,
      yearMonthOfManufacturing: month ? selectedMonth?.index + "-" + year : "",
      vehicleType: vehicleType,
      typeOfBody: typeOfBody,
      kmDriven: kmsDriven,
      frontWheelRight: frontRightSelected,
      frontWheelLeft: frontLeftSelected,
      rearWheelRight: rearRightSelected,
      rearWheelLeft: rearLeftSelected,
      spareDiskWheel: spareDiskWheelSelected,
      spareAlliWheel: spareAlliWheelSelected,
      anyMajorAccident: anyMajorAccidentSelected,
      anyMajorAccidentRemark: "",
      anyMinorAccident: anyMinorAccidentSelected,
      anyMinorAccidentRemark: "",
      updatedDate: "",
      make: make,
      fuelType: fuelType,
      chassisNum: "",
      noOfOwners: noOwners,
      colour: colour,
      transmission: transmission,
      data: [],
      role: "Evaluator",
      totalRefurbishmentCost: null,
      evalutionStatus: "EvalutionSubmitted",
      evalutorId: userData.empId,
      VehicleExterior: "",
      DrivingYourTestDrive: "",
      InTheDiversseat: "",
      UnderneathVehicle: "",
      Trunk: "",
      Engine: "",
      Exterior: "",
      Interior: "",
      engineNumber: engineNumber,
      nocclearance: null,
      challenamount: null,
      oilChangesCost: null,
      regDate: dateOfRegistration,
      emission: emission,
      challanPending: noOfChallanPending,
      hypothecation: enterHypothication ? hypothecatedTo : "",
      hypothecatedBranch: enterHypothication ? hypothecatedBranch : "",
      hypothecatedCompletedDate: enterHypothication
        ? hypothicationCompletedDate
        : "",
      insuranceType: enterInsurance ? insuranceType : "",
      loanAmountDue: enterHypothication ? loanAmountDue : "",
      insuranceCompanyName: enterInsurance ? insuranceCompanyName : "",
      policyNumber: enterInsurance ? policyNumber : "",
      insFromDate: enterInsurance ? insuranceFromDate : "",
      insToDate: enterInsurance ? insuranceToDate : "",
      periodicService: "no",
      periodicServiceCost: null,
      EngineandtransmissionCost: null,
      spareKey: "no",
      spareKeyCost: null,
      rubbingPolishing: "no",
      rubbingPolishingCost: null,
      insurance: "no",
      insuranceCost: null,
      regDocument: "no",
      regDocumentCharges: null,
      pollutionCertificate: "no",
      pollutionCertificateCost: null,
      oilChanges: "no",
      powerbrakefluidchange: "no",
      powerBrakeFluidChangeCost: null,
      coolantFilterChange: "no",
      coolantFilterChangeCost: null,
      removalStainMarksStickers: "no",
      removalStainMarksStickersCost: null,
      carpetCleaning: "no",
      carpetCleaningCost: null,
      engineRoom: "no",
      engineRoomCost: null,
      vehicleTransfer: "no",
      vehicleTransferCharges: null,
      nocClearanceExpense: "no",
      nocClearanceExpenseCost: null,
      challanAmount: "no",
      challanAmountCost: null,
      ccClearanceExpense: "no",
      ccClearanceExpenseCost: null,
      otherCharges: refurbishmentData ? refurbishmentData : [],
      custExpectedPrice: customerExpectedPrice,
      evaluatorOfferPrice: evaluatorOfferedPrice,
      managerId: userData.approverId,
      carExchangeEvalutionCosts: [],
    };
    const response = await client.post(URL.SAVE_EVALUATION(), Payload);
    const json = await response.json();
    if (response.ok) {
      alert("DONE");
    }
  };

  const getTotalCost = (data) => {
    let totalCost = 0;

    data.Items.forEach((item) => {
      totalCost += parseFloat(item.cost);
    });

    data.AdditionalExpenses.forEach((expense) => {
      totalCost += parseFloat(expense.cost);
    });
    if (addOtherCost) totalCost += cost.trim() === "" ? 0 : parseInt(cost);
    return totalCost;
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
    });
    formData.append(
      "universalId",
      "18-286-04109cec-776e-4e4f-986f-9d5b1246a0b0"
    );
    switch (imageTitle) {
      case "Front Side":
        formData.append("documentType", "pan");

        break;
      case "Back Side":
        formData.append("documentType", "pan");

        break;
      case "Left Side":
        formData.append("documentType", "pan");

        break;
      case "Right Side":
        formData.append("documentType", "pan");

        break;
      case "Speedo meter":
        formData.append("documentType", "pan");

        break;
      case "Chassis":
        formData.append("documentType", "pan");

        break;
      case "Interior Front":
        formData.append("documentType", "pan");

        break;
      case "Interior Back":
        formData.append("documentType", "pan");

        break;
      case "Extra Fitment":
        formData.append("documentType", "pan");

        break;
      case "Scratch Damage":
        formData.append("documentType", "pan");

        break;
      case "Dent Damage":
        formData.append("documentType", "pan");

        break;
      case "Functions":
        formData.append("documentType", "pan");

        break;
      case "Break Damage":
        formData.append("documentType", "pan");

        break;
      case "Number Plate":
        formData.append("documentType", "pan");

        break;
      case "Rc Front":
        formData.append("documentType", "pan");

        break;
      case "Rc Back":
        formData.append("documentType", "pan");

        break;
      case "Insurance Copy":
        formData.append("documentType", "pan");

        break;
      case "Hypothication Document":
        formData.append("documentType", "pan");

        break;
      case "Bank/Finance - old car NOC":
        formData.append("documentType", "pan");

        break;
      case "CC":
        formData.append("documentType", "pan");

        break;
      case "Pollution":
        formData.append("documentType", "pan");

        break;
      case "ID Proof":
        formData.append("documentType", "pan");

        break;
      case "PAN Card":
        formData.append("documentType", "pan");

        break;
      default:
        break;
    }

    let tempToken1 = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
    await fetch(URL.UPLOAD_DOCUMENT(), {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + tempToken1,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          const payload = {
            url: response.documentPath,
            name: response.fileName,
          };
          saveImages(payload);
        }
      })
      .catch((error) => {
        showToastRedAlert(
          error.message ? error.message : "Something went wrong"
        );
      });
  };

  const uploadSelectedImageAttachment = async (selectedPhoto, keyId) => {
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

    formData.append("uploadFiles", {
      name: `${fileName}-.${fileType}`,
      type: `image/${fileType}`,
      uri: Platform.OS === "ios" ? photoUri.replace("file://", "") : photoUri,
    });

    let tempToken1 = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
    await fetch(URL.UPLOAD_ATTACHMENTS(), {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + tempToken1,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          const payload = {
            url: response.documentPath,
            name: response.fileName,
          };
          saveImages(payload);
        }
      })
      .catch((error) => {
        showToastRedAlert(
          error.message ? error.message : "Something went wrong"
        );
      });
  };

  const autoSaveData = async () => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      const selectedMonth = months.filter((i) => i.name === month)[0];

      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        let evaluationTemp = initialData;
        const savedData = {
          registrationNumber: rcNumber,
          nameonRC: nameOnRc,
          variant: variant,
          fuelType: fuelType,
          transmission: transmission,
          chassisNumber: "",
          engineNumber: engineNumber,
          yearOfManufacturing: month ? selectedMonth?.index + "-" + year : "",
          dateOfRegistration: dateOfRegistration,
          registrationValidity: regnValidUpto,
          pincode: pincode,
          belt: true,
          airconditioning: "",
          remarks1: "",
          bodyrust: "",
          registrationState: registrationDistrict,
          registrationDistrict: registrationDistrict,
          registrationCity: registrationCity,
          emission: emission,
          Interior: "",
          Trunk: "",
          Exterior: "",
          role: "",
          managerId: "",
          Engineroomcleaning: "no",
          evaluatorId: "",
          UnderneathVehicle: "",
          InTheDiversseat: "",
          cruisecontrol: "",
          DrivingYourTestDrive: "",
          vehicletype: vehicleType,
          typeofbody: typeOfBody,
          distanceDriven: kmsDriven,
          NoOfOwners: noOwners,
          floorcovering: "",
          challanPending: noOfChallanPending,
          exhaustpipe: "",
          VehicleExterior: "",
          bumper: "",
          vehicleServiceCost: "",
          EngineandtransmissionCost: null,
          oilChangesCost: null,
          steeringandfluid: null,
          coolantandfilter: null,
          removalstains: null,
          drycleaning: null,
          engineroomcleaning: null,
          challenamount: null,
          CCClearance: null,
          pollutioncertificate: null,
          managerid: "",
          frontright: frontRightSelected,
          frontleft: frontLeftSelected,
          rearright: rearRightSelected,
          rearleft: rearLeftSelected,
          sparediskwheel: spareDiskWheelSelected,
          sparealliwheel: spareAlliWheelSelected,
          majorAccident: anyMajorAccidentSelected,
          majorAccidentRemarks: "",
          minorAccident: anyMinorAccidentSelected,
          minorAccidentRemarks: "",
          hypothetication: hypothecatedTo,
          hypotheticatedBranch: hypothecatedBranch,
          insuranceType: insuranceType,
          generalappearence: "",
          Engine: "",
          engine: "",
          colour: colour,
          remarks: "",
          insuranceCompanyName: insuranceCompanyName,
          policyNumber: policyNumber,
          insuranceFrom: insuranceFromDate,
          insuranceTo: insuranceToDate, //Left
          carFrontImgName: frontSideImage.name,
          carFrontImg: frontSideImage.url,
          dashboard: "",
          carBackImgName: backSideImage.name,
          carBackImg: backSideImage.url,
          carLeftImgName: leftSideImage.name,
          carLeftImg: leftSideImage.url,
          carRightImgName: rightSideImage.name,
          carRightImg: rightSideImage.url,
          speedoMeterImgName: speedometerImage.name,
          speedoMeterImg: speedometerImage.url,
          chassisImgName: chassisImage.name,
          chassisImg: chassisImage.url,
          VehicleServiceCost: "",
          interiorImg: "",
          Pollutioncertificate: "no",
          vinPlateImg: "",
          rcFrontName: rcFrontImage.name,
          rcFrontImg: rcFrontImage.url,
          Drycleaning: "no",
          RubbingPolishingCost: "no",
          CCClearances: "no",
          SpareKeysCost: "no",
          Challenamount: "no",
          otherCharges: "",
          otherImages: "",
          Engineandtransmission: "no",
          RegistrationCost: "no",
          Vehicletransfercharges: "no",
          Removalstains: "no",
          Nocclearance: "no",
          Coolantandfilter: "no",
          Steeringandfluid: "no",
          rcBackName: rcBackImage.name,
          rcBackImg: rcBackImage.url,
          insuranceName: insuranceCopyImage.name,
          insuranceImg: insuranceCopyImage.url,
          InsuranceCost: "no",
          interiorFrontName: interiorFrontImage.name,
          interiorFrontImg: interiorFrontImage.url,
          interiorBackName: interiorBackImage.name,
          interiorBackImg: interiorBackImage.url,
          invoiceName: invoiceImage.name,
          invoiceImg: invoiceImage.url,
          extraFitmentName: extraFitmentImage.name,
          extraFitmentImg: extraFitmentImage.url,
          functionsName: functionsImage.name,
          functionsImg: functionsImage.url,
          getcardetails: "",
          scratchName: scratchDamageImage.name,
          scratchImg: scratchDamageImage.url,
          dentName: dentDamageImage.name,
          dentImg: dentDamageImage.url,
          breaksDmgName: breakDamageImage.name,
          breaksDmgImg: breakDamageImage.url,
          numberPlateName: numberPlateImage.name,
          numberPlateImg: numberPlateImage.url,
          oldCarNocName: oldCarNOCImage.name,
          oldCarNocImg: oldCarNOCImage.url,
          periodicServiceValue: "",
          insuranceValue: "",
          spareKeysValue: "",
          registrationValue: "",
          rubbingPolishingValue: "",
          mobileNum: mobileNumber2,
          otherDocfieldName: "",
          periodicService: "no",
          interiorCleaningValue: "",
          interiorCleaningCost: "",
          pollutionCertificateValue: "",
          pollutionCertificateCost: "",
          entertextfield: "",
          priceGap: priceGap,
          acceptCost: "",
          rejectCost: "",
          evaluatorofferedprice: "",
          otherImagesDoc: [],
          otherfieldsDoc: [],
          refurbishmentItems: [],
          refurbishmentAdditionalItems: [],
        };
        evaluationTemp.profileControls = savedData;
        const payload = {
          data: evaluationTemp,
          status: "Active",
          universalId: route.params.universalId,
        };
        const response = await client.post(URL.EVALUATION_AUTOSAVE(), payload);
        const json = await response.json();
        if (response.ok) {
        }
      }
    } catch (error) {}
  };

  // const autoSaveData = async () => {
  //   try {
  //     let employeeData = await AsyncStore.getData(
  //       AsyncStore.Keys.LOGIN_EMPLOYEE
  //     );
  //     if (employeeData) {
  //       const jsonObj = JSON.parse(employeeData);
  //       const response = await client.post(URL.EVALUATION_AUTOSAVE());
  //       const json = await response.json();
  //       if (response.ok) {
  //       }
  //     }
  //   } catch (error) {}
  // };

  return (
    <View style={[{ flex: 1 }]}>
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
      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        value={new Date(Date.now())}
        maximumDate={showDatePicker === "Regn. Valid Upto" ? null : maxDate}
        minimumDate={
          showDatePicker === "Regn. Valid Upto" ? new Date() : miniDate
        }
        onChange={(event, selectedDate) => {
          saveDate(moment(selectedDate).format(dateFormat));
        }}
        onRequestClose={() => setShowDatePicker(false)}
      />
      <DropDownComponant
        visible={showDropDown}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        onRequestClose={() => setShowDropDown(false)}
        selectedItems={(item) => {
          storeDropDown(item);
        }}
      />
      <ImagePickerComponent
        visible={showImagePicker}
        selectedImage={(data, keyId) => {
          if (keyId == "UPLOAD_ATTACHMENTS") {
            uploadSelectedImageAttachment(data, keyId);
          } else {
            uploadSelectedImage(data, keyId);
          }
        }}
        onDismiss={() => {
          setShowImagePicker(false);
        }}
      />
      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
        }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
      >
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 10,
            paddingHorizontal: 5,
          }}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          ref={scrollRef}
        >
          <View style={{ marginHorizontal: 10 }}>
            <List.AccordionGroup
              expandedId={openAccordian}
              onAccordionPress={(expandedId) => updateAccordian(expandedId)}
            >
              <List.Accordion
                id={"1"}
                key={"1"}
                title={"Customer Information"}
                titleStyle={{
                  color: openAccordian === "1" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "1" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View>
                  <CustomEvaluationDropDown
                    label="Salutation"
                    buttonText="Select Salutation"
                    value={salutation}
                    disabled={true}
                    onPress={() => {
                      showDropDownModelMethod("Salutation");
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter First Name"
                    label="First Name"
                    mandatory={true}
                    disabled={true}
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Last Name"
                    label="Last Name"
                    mandatory={true}
                    disabled={true}
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                    }}
                  />
                  <CustomEvaluationDropDown
                    label="Gender"
                    buttonText="Select Gender"
                    value={gender}
                    disabled={true}
                    onPress={() => {
                      showDropDownModelMethod("Gender");
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Relation Name"
                    label="Relation Name"
                    value={relationName}
                    disabled={true}
                    onChangeText={(text) => {
                      setRelationName(text);
                    }}
                  />
                  <CustomDatePicker
                    label="Date of Birth"
                    value={dateOfBirth}
                    disabled={true}
                    onPress={ShowDatePickerFunction}
                  />
                  <CustomTextInput
                    placeholder="Enter Age"
                    label="Age"
                    value={age}
                    disabled={true}
                    keyboardType={"number-pad"}
                    onChangeText={(text) => {
                      setAge(text);
                    }}
                  />
                  <CustomDatePicker
                    label="Anniversary Date"
                    value={anniversaryDate}
                    disabled={true}
                    onPress={ShowDatePickerFunction}
                  />
                  <CustomTextInput
                    placeholder="Enter Mobile Number"
                    label="Mobile Number"
                    mandatory={true}
                    disabled={true}
                    value={mobileNumber}
                    keyboardType={"number-pad"}
                    onChangeText={(text) => {
                      setMobileNumber(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Alternate Mobile Number"
                    label="Alternate Mobile Number"
                    value={alternateMobileNumber}
                    disabled={true}
                    keyboardType={"number-pad"}
                    onChangeText={(text) => {
                      setAlternateMobileNumber(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Email ID"
                    label="Email ID"
                    value={email}
                    disabled={true}
                    keyboardType={"email-address"}
                    onChangeText={(text) => {
                      setEmail(text);
                    }}
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"2"}
                key={"2"}
                title={"Customer Address"}
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
                <View>
                  <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <Entypo size={17} name="home" color={Colors.RED} />
                    <Text style={{ fontSize: 17, fontWeight: "600" }}>
                      {" Communication Address"}
                    </Text>
                  </View>
                  <CustomTextInput
                    placeholder="Enter Pincode"
                    label="Pincode"
                    mandatory={true}
                    disabled={true}
                    keyboardType={"number-pad"}
                    value={communicationAddress.pincode}
                    onChangeText={(text) => {
                      setCommunication({
                        ...communicationAddress,
                        ...(communicationAddress.pincode = text),
                      });
                      sameAsPermanent &&
                        setPermanentAddress({
                          ...permanentAddress,
                          ...(permanentAddress.pincode = text),
                        });
                      if (text.length === 6) {
                        updateAddressDetails(text, "Communication");
                      }
                    }}
                  />
                  <View style={{ flexDirection: "row" }}>
                    <RadioTextItem
                      label={"Urban"}
                      value={"urban"}
                      disabled={true}
                      status={communicationAddress.isUrban ? true : false}
                      onPress={() => {
                        setCommunication({
                          ...communicationAddress,
                          ...((communicationAddress.isUrban = true),
                          (communicationAddress.isRural = false)),
                        });
                        sameAsPermanent &&
                          setPermanentAddress({
                            ...permanentAddress,
                            ...((permanentAddress.isRural = false),
                            (permanentAddress.isUrban = true)),
                          });
                      }}
                    />
                    <RadioTextItem
                      label={"Rural"}
                      value={"rural"}
                      disabled={true}
                      status={communicationAddress.isRural ? true : false}
                      onPress={() => {
                        setCommunication({
                          ...communicationAddress,
                          ...((communicationAddress.isRural = true),
                          (communicationAddress.isUrban = false)),
                        });
                        sameAsPermanent &&
                          setPermanentAddress({
                            ...permanentAddress,
                            ...((permanentAddress.isRural = true),
                            (permanentAddress.isUrban = false)),
                          });
                      }}
                    />
                  </View>
                  <CustomTextInput
                    placeholder="Enter H-No"
                    label="H-No"
                    disabled={true}
                    value={communicationAddress.houseNo}
                    onChangeText={(text) => {
                      setCommunication({
                        ...communicationAddress,
                        ...(communicationAddress.houseNo = text),
                      });
                      sameAsPermanent &&
                        setPermanentAddress({
                          ...permanentAddress,
                          ...(permanentAddress.houseNo = text),
                        });
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Street"
                    label="Street"
                    disabled={true}
                    value={communicationAddress.street}
                    onChangeText={(text) => {
                      setCommunication({
                        ...communicationAddress,
                        ...(communicationAddress.street = text),
                      });
                      sameAsPermanent &&
                        setPermanentAddress({
                          ...permanentAddress,
                          ...(permanentAddress.street = text),
                        });
                    }}
                  />
                  <CustomTextInput
                    label="Village/Town"
                    placeholder="Enter Village/Town"
                    disabled={true}
                    value={communicationAddress.village}
                    onChangeText={(text) => {
                      setCommunication({
                        ...communicationAddress,
                        ...(communicationAddress.village = text),
                      });
                      sameAsPermanent &&
                        setPermanentAddress({
                          ...permanentAddress,
                          ...(permanentAddress.village = text),
                        });
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Mandal/Tahsil"
                    label="Mandal/Tahsil"
                    disabled={true}
                    value={communicationAddress.mandal}
                    onChangeText={(text) => {
                      setCommunication({
                        ...communicationAddress,
                        ...(communicationAddress.mandal = text),
                      });
                      sameAsPermanent &&
                        setPermanentAddress({
                          ...permanentAddress,
                          ...(permanentAddress.mandal = text),
                        });
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter City"
                    label="City"
                    disabled={true}
                    value={communicationAddress.city}
                    onChangeText={(text) => {
                      setCommunication({
                        ...communicationAddress,
                        ...(communicationAddress.city = text),
                      });
                      sameAsPermanent &&
                        setPermanentAddress({
                          ...permanentAddress,
                          ...(permanentAddress.city = text),
                        });
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter District"
                    label="District"
                    disabled={true}
                    value={communicationAddress.district}
                    onChangeText={(text) => {
                      setCommunication({
                        ...communicationAddress,
                        ...(communicationAddress.district = text),
                      });
                      sameAsPermanent &&
                        setPermanentAddress({
                          ...permanentAddress,
                          ...(permanentAddress.district = text),
                        });
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter State"
                    label="State"
                    disabled={true}
                    value={communicationAddress.state}
                    onChangeText={(text) => {
                      setCommunication({
                        ...communicationAddress,
                        ...(communicationAddress.state = text),
                      });
                      sameAsPermanent &&
                        setPermanentAddress({
                          ...permanentAddress,
                          ...(permanentAddress.state = text),
                        });
                    }}
                  />
                  <View style={{ flexDirection: "row", marginTop: 15 }}>
                    <Entypo size={17} name="home" color={Colors.RED} />
                    <Text style={{ fontSize: 17, fontWeight: "600" }}>
                      {" Permanent Address"}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{ fontSize: 15, fontWeight: "600", marginTop: 10 }}
                    >
                      {"Permanent Address Same as Communication Address"}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <RadioTextItem
                      label={"Yes"}
                      value={"yes"}
                      disabled={true}
                      status={sameAsPermanent}
                      onPress={() => {
                        setSameAsPermanent(true);
                        setPermanentAddress(communicationAddress);
                      }}
                    />
                    <RadioTextItem
                      label={"No"}
                      value={"no"}
                      disabled={true}
                      status={!sameAsPermanent}
                      onPress={() => {
                        setSameAsPermanent(false);
                        setPermanentAddress({
                          pincode: "",
                          isUrban: "",
                          isRural: null,
                          houseNo: "",
                          street: "",
                          village: "",
                          city: "",
                          district: "",
                          state: "",
                          mandal: "",
                          country: null,
                        });
                      }}
                    />
                  </View>
                  <CustomTextInput
                    placeholder="Enter Pincode"
                    label="Pincode"
                    mandatory={true}
                    disabled={true}
                    keyboardType={"number-pad"}
                    value={permanentAddress.pincode}
                    onChangeText={(text) => {
                      setPermanentAddress({
                        ...permanentAddress,
                        ...(permanentAddress.pincode = text),
                      });
                      if (text.length === 6) {
                        updateAddressDetails(text, "Permanent");
                      }
                    }}
                  />
                  <View style={{ flexDirection: "row" }}>
                    <RadioTextItem
                      label={"Urban"}
                      value={"urban"}
                      disabled={true}
                      status={permanentAddress.isUrban ? true : false}
                      onPress={() =>
                        setPermanentAddress({
                          ...permanentAddress,
                          ...((permanentAddress.isUrban = true),
                          (permanentAddress.isRural = false)),
                        })
                      }
                    />
                    <RadioTextItem
                      label={"Rural"}
                      value={"rural"}
                      disabled={true}
                      status={permanentAddress.isRural ? true : false}
                      onPress={() =>
                        setPermanentAddress({
                          ...permanentAddress,
                          ...((permanentAddress.isUrban = false),
                          (permanentAddress.isRural = true)),
                        })
                      }
                    />
                  </View>
                  <CustomTextInput
                    placeholder="Enter H-No"
                    label="H-No"
                    disabled={true}
                    value={permanentAddress.houseNo}
                    onChangeText={(text) => {
                      setPermanentAddress({
                        ...permanentAddress,
                        ...(permanentAddress.houseNo = text),
                      });
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Street"
                    label="Street"
                    disabled={true}
                    value={permanentAddress.street}
                    onChangeText={(text) => {
                      setPermanentAddress({
                        ...permanentAddress,
                        ...(permanentAddress.street = text),
                      });
                    }}
                  />
                  <CustomTextInput
                    label="Village/Town"
                    placeholder="Enter Village/Town"
                    disabled={true}
                    value={permanentAddress.village}
                    onChangeText={(text) => {
                      setPermanentAddress({
                        ...permanentAddress,
                        ...(permanentAddress.village = text),
                      });
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Mandal/Tahsil"
                    label="Mandal/Tahsil"
                    disabled={true}
                    value={permanentAddress.mandal}
                    onChangeText={(text) => {
                      setPermanentAddress({
                        ...permanentAddress,
                        ...(permanentAddress.mandal = text),
                      });
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter City"
                    label="City"
                    disabled={true}
                    value={permanentAddress.city}
                    onChangeText={(text) => {
                      setPermanentAddress({
                        ...permanentAddress,
                        ...(permanentAddress.city = text),
                      });
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter District"
                    label="District"
                    disabled={true}
                    value={permanentAddress.district}
                    onChangeText={(text) => {
                      setPermanentAddress({
                        ...permanentAddress,
                        ...(permanentAddress.district = text),
                      });
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter State"
                    label="State"
                    disabled={true}
                    value={permanentAddress.state}
                    onChangeText={(text) => {
                      setPermanentAddress({
                        ...permanentAddress,
                        ...(permanentAddress.state = text),
                      });
                    }}
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"3"}
                key={"3"}
                title={"Vehicle Information"}
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
                <View>
                  <CustomTextInput
                    placeholder="Enter RC Number"
                    label="RC Number"
                    mandatory={true}
                    value={rcNumber}
                    maxLength={13}
                    onChangeText={(text) => {
                      setRcNumber(text);
                      setErrors({
                        ...errors,
                        ...(errors.rcNumber = ""),
                      });
                    }}
                    errorMessage={errors.rcNumber}
                  />
                  <CustomTextInput
                    placeholder="Enter Name On RC"
                    label="Name On RC"
                    mandatory={true}
                    value={nameOnRc}
                    onChangeText={(text) => {
                      setNameOnRc(text);
                      setErrors({
                        ...errors,
                        ...(errors.nameOnRc = ""),
                      });
                    }}
                    errorMessage={errors.nameOnRc}
                  />
                  <CustomTextInput
                    placeholder="Enter Mobile Number"
                    label="Mobile Number"
                    mandatory={true}
                    keyboardType={"number-pad"}
                    value={mobileNumber2}
                    onChangeText={(text) => {
                      setMobileNumber2(text);
                      setErrors({
                        ...errors,
                        ...(errors.mobileNumber2 = ""),
                      });
                    }}
                    errorMessage={errors.mobileNumber2}
                  />
                  <CustomEvaluationDropDown
                    label="Brand"
                    buttonText="Select Brand"
                    onPress={() => {
                      showDropDownModelMethod("Brand");
                    }}
                    value={brand}
                  />
                  <CustomEvaluationDropDown
                    label="Model"
                    buttonText="Select Model"
                    value={model}
                    onPress={() => {
                      showDropDownModelMethod("Model");
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Variant"
                    label="Variant"
                    mandatory={true}
                    value={variant}
                    onChangeText={(text) => {
                      setVariant(text);
                      setErrors({
                        ...errors,
                        ...(errors.variant = ""),
                      });
                    }}
                    errorMessage={errors.variant}
                  />
                  <CustomTextInput
                    placeholder="Enter Colour"
                    label="Colour"
                    mandatory={true}
                    value={colour}
                    onChangeText={(text) => {
                      setColour(text);
                      setErrors({
                        ...errors,
                        ...(errors.colour = ""),
                      });
                    }}
                    errorMessage={errors.colour}
                  />
                  <CustomEvaluationDropDown
                    label="Fuel Type"
                    buttonText="Select Fuel Type"
                    value={fuelType}
                    onPress={() => {
                      showDropDownModelMethod("Fuel Type");
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Transmission"
                    label="Transmission"
                    mandatory={true}
                    value={transmission}
                    onChangeText={(text) => {
                      setTransmission(text);
                      setErrors({
                        ...errors,
                        ...(errors.transmission = ""),
                      });
                    }}
                    errorMessage={errors.transmission}
                  />
                  <CustomTextInput
                    placeholder="Enter Vin Number"
                    label="Vin Number"
                    mandatory={true}
                    value={vinNumber}
                    maxLength={17}
                    onChangeText={(text) => {
                      setVinNumber(text);
                      setErrors({
                        ...errors,
                        ...(errors.vinNumber = ""),
                      });
                    }}
                    errorMessage={errors.vinNumber}
                  />
                  <CustomTextInput
                    placeholder="Enter Engine Number"
                    label="Engine Number"
                    mandatory={true}
                    value={engineNumber}
                    maxLength={20}
                    onChangeText={(text) => {
                      setEngineNumber(text);
                      setErrors({
                        ...errors,
                        ...(errors.engineNumber = ""),
                      });
                    }}
                    errorMessage={errors.engineNumber}
                  />
                  <CustomEvaluationDropDown
                    label="Month"
                    buttonText="Select Month"
                    value={month}
                    onPress={() => {
                      showDropDownModelMethod("Month");
                    }}
                  />
                  <CustomEvaluationDropDown
                    label="Year"
                    buttonText="Select Year"
                    value={year}
                    onPress={() => {
                      showDropDownModelMethod("Year");
                    }}
                  />
                  <CustomDatePicker
                    label="Date of Registration"
                    value={dateOfRegistration}
                    onPress={ShowDatePickerFunction}
                  />
                  <CustomDatePicker
                    label="Regn. Valid Upto"
                    value={regnValidUpto}
                    onPress={ShowDatePickerFunction}
                  />
                  <CustomTextInput
                    placeholder="Enter Pincode"
                    label="Pincode"
                    mandatory={true}
                    keyboardType={"number-pad"}
                    value={pincode}
                    onChangeText={(text) => {
                      setPincode(text);
                      setErrors({
                        ...errors,
                        ...(errors.pincode = ""),
                      });
                    }}
                    errorMessage={errors.pincode}
                  />
                  <CustomTextInput
                    placeholder="Enter Registration State"
                    label="Registration State"
                    mandatory={true}
                    value={registrationState}
                    onChangeText={(text) => {
                      setRegistrationState(text);
                      setErrors({
                        ...errors,
                        ...(errors.registrationState = ""),
                      });
                    }}
                    errorMessage={errors.registrationState}
                  />
                  <CustomTextInput
                    placeholder="Enter Registration District"
                    label="Registration District"
                    mandatory={true}
                    value={registrationDistrict}
                    onChangeText={(text) => {
                      setRegistrationDistrict(text);
                      setErrors({
                        ...errors,
                        ...(errors.registrationDistrict = ""),
                      });
                    }}
                    errorMessage={errors.registrationDistrict}
                  />
                  <CustomTextInput
                    placeholder="Enter Registration City"
                    label="Registration City"
                    mandatory={true}
                    value={registrationCity}
                    onChangeText={(text) => {
                      setRegistrationCity(text);
                      setErrors({
                        ...errors,
                        ...(errors.registrationCity = ""),
                      });
                    }}
                    errorMessage={errors.registrationCity}
                  />
                  <CustomTextInput
                    placeholder="Enter Emission"
                    label="Emission"
                    mandatory={true}
                    value={emission}
                    maxLength={4}
                    onChangeText={(text) => {
                      setEmission(text);
                      setErrors({
                        ...errors,
                        ...(errors.emission = ""),
                      });
                    }}
                    errorMessage={errors.emission}
                  />
                  <CustomEvaluationDropDown
                    label="Vehicle Type"
                    buttonText="Select Vehicle Type"
                    value={vehicleType}
                    onPress={() => {
                      showDropDownModelMethod("Vehicle Type");
                    }}
                  />
                  <CustomEvaluationDropDown
                    label="Type of Body"
                    buttonText="Select Type of Body"
                    value={typeOfBody}
                    onPress={() => {
                      showDropDownModelMethod("Type of Body");
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter KM's driven"
                    label="KM's driven"
                    mandatory={true}
                    value={kmsDriven}
                    keyboardType={"number-pad"}
                    maxLength={7}
                    onChangeText={(text) => {
                      setKmsDriven(text);
                      setErrors({
                        ...errors,
                        ...(errors.kmsDriven = ""),
                      });
                    }}
                    errorMessage={errors.kmsDriven}
                  />
                  <CustomTextInput
                    placeholder="Enter Cubic Capacity"
                    label="Cubic Capacity"
                    mandatory={true}
                    value={cubicCapacity}
                    onChangeText={(text) => {
                      setCubicCapacity(text);
                      setErrors({
                        ...errors,
                        ...(errors.cubicCapacity = ""),
                      });
                    }}
                    errorMessage={errors.cubicCapacity}
                  />
                  <CustomTextInput
                    placeholder="Enter No Owners"
                    label="No Owners"
                    mandatory={true}
                    value={noOwners}
                    maxLength={2}
                    keyboardType={"number-pad"}
                    onChangeText={(text) => {
                      setNoOwners(text);
                      setErrors({
                        ...errors,
                        ...(errors.noOwners = ""),
                      });
                    }}
                    errorMessage={errors.noOwners}
                  />
                  <CustomTextInput
                    placeholder="Enter No. of Challan Pending"
                    label="No. of Challan Pending"
                    mandatory={true}
                    maxLength={2}
                    keyboardType={"number-pad"}
                    value={noOfChallanPending}
                    onChangeText={(text) => {
                      setNoOfChallanPending(text);
                      setErrors({
                        ...errors,
                        ...(errors.noOfChallanPending = ""),
                      });
                    }}
                    errorMessage={errors.noOfChallanPending}
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"4"}
                key={"4"}
                title={"Tyre Conditions"}
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
                <View>
                  <CustomRadioButton
                    label="Front right"
                    value={frontRightSelected}
                    onPress={setFrontRightSelected}
                    mandatory={true}
                    status={submitButtonPressed}
                  />
                  <CustomRadioButton
                    label="Front left"
                    value={frontLeftSelected}
                    onPress={setFrontLeftSelected}
                    mandatory={true}
                    status={submitButtonPressed}
                  />
                  <CustomRadioButton
                    label="Rear right"
                    value={rearRightSelected}
                    onPress={setRearRightSelected}
                    mandatory={true}
                    status={submitButtonPressed}
                  />
                  <CustomRadioButton
                    label="Rear left"
                    value={rearLeftSelected}
                    onPress={setRearLeftSelected}
                    mandatory={true}
                    status={submitButtonPressed}
                  />
                  <CustomRadioButton
                    label="Spare Disk Wheel"
                    value={spareDiskWheelSelected}
                    onPress={setSpareDiskWheelSelected}
                    mandatory={true}
                    status={submitButtonPressed}
                  />
                  <CustomRadioButton
                    label="Spare Alli Wheel"
                    value={spareAlliWheelSelected}
                    onPress={setSpareAlliWheelSelected}
                    mandatory={true}
                    status={submitButtonPressed}
                  />
                  <CustomSelection
                    label="Any Minor Accident"
                    value={anyMinorAccidentSelected}
                    onPress={setAnyMinorAccidentSelected}
                    mandatory={true}
                    status={submitButtonPressed}
                  />
                  <CustomSelection
                    label="Any Major Accident"
                    value={anyMajorAccidentSelected}
                    onPress={setAnyMajorAccidentSelected}
                    mandatory={true}
                    status={submitButtonPressed}
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"5"}
                key={"5"}
                title={"Hypothication"}
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
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Checkbox.Android
                      status={enterHypothication ? "checked" : "unchecked"}
                      color={Colors.RED}
                      onPress={() => {
                        setEnterHypothication(!enterHypothication);
                      }}
                    />
                    <Text>{"* Agree to enter Hypothication details"}</Text>
                  </View>
                  {enterHypothication && (
                    <>
                      <CustomTextInput
                        placeholder="Enter Hypothecated To"
                        label="Hypothecated To"
                        mandatory={true}
                        maxLength={50}
                        value={hypothecatedTo}
                        onChangeText={(text) => {
                          setHypothecatedTo(text);
                          setErrors({
                            ...errors,
                            ...(errors.hypothecatedTo = ""),
                          });
                        }}
                        errorMessage={errors.hypothecatedTo}
                      />
                      <CustomTextInput
                        placeholder="Enter Hypothecated Branch"
                        label="Hypothecated Branch"
                        mandatory={true}
                        maxLength={30}
                        value={hypothecatedBranch}
                        onChangeText={(text) => {
                          if (text.trim() !== "" && isValidInput(text)) {
                            setHypothecatedBranch(text);
                          }
                          if (text.trim() === "") {
                            setHypothecatedBranch(text);
                          }
                          setErrors({
                            ...errors,
                            ...(errors.hypothecatedBranch = ""),
                          });
                        }}
                        errorMessage={errors.hypothecatedBranch}
                      />
                      <CustomTextInput
                        placeholder="Enter Loan amount due"
                        label="Loan amount due"
                        mandatory={true}
                        value={loanAmountDue}
                        keyboardType={"number-pad"}
                        maxLength={7}
                        onChangeText={(text) => {
                          setLoanAmountDue(text);
                          setErrors({
                            ...errors,
                            ...(errors.loanAmountDue = ""),
                          });
                        }}
                        errorMessage={errors.loanAmountDue}
                      />
                      <CustomDatePicker
                        label="Hypothication Completed Date"
                        value={hypothicationCompletedDate}
                        onPress={ShowDatePickerFunction}
                      />
                    </>
                  )}
                </View>
              </List.Accordion>
              <List.Accordion
                id={"6"}
                key={"6"}
                title={"Insurance"}
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
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Checkbox.Android
                      status={enterInsurance ? "checked" : "unchecked"}
                      color={Colors.RED}
                      onPress={() => {
                        setEnterInsurance(!enterInsurance);
                      }}
                    />
                    <Text>{"* Agree to enter Insurance details"}</Text>
                  </View>
                  {enterInsurance && (
                    <>
                      <CustomEvaluationDropDown
                        label="Insurance Type"
                        buttonText="Choose your Insurance Type"
                        value={insuranceType}
                        onPress={() => {
                          showDropDownModelMethod("Insurance Type");
                        }}
                      />
                      <CustomTextInput
                        placeholder="Enter Insurance Company Name"
                        label="Insurance Company Name"
                        mandatory={true}
                        value={insuranceCompanyName}
                        onChangeText={(text) => {
                          setInsuranceCompanyName(text);
                          setErrors({
                            ...errors,
                            ...(errors.insuranceCompanyName = ""),
                          });
                        }}
                        errorMessage={errors.insuranceCompanyName}
                      />
                      <CustomTextInput
                        placeholder="Enter Policy Number"
                        label="Policy Number"
                        mandatory={true}
                        value={policyNumber}
                        onChangeText={(text) => {
                          setPolicyNumber(text);
                          setErrors({
                            ...errors,
                            ...(errors.policyNumber = ""),
                          });
                        }}
                        errorMessage={errors.policyNumber}
                      />
                      <CustomDatePicker
                        label="Insurance From Date"
                        value={insuranceFromDate}
                        onPress={ShowDatePickerFunction}
                      />
                      <CustomDatePicker
                        label="Insurance To Date"
                        value={insuranceToDate}
                        onPress={ShowDatePickerFunction}
                      />
                    </>
                  )}
                </View>
              </List.Accordion>
              <List.Accordion
                id={"7"}
                key={"7"}
                title={"Upload Images of Car - Evaluation Time"}
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
                <View>
                  <CustomUpload
                    label="Front Side"
                    buttonText="Upload Front Side Image"
                    mandatory={true}
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={frontSideImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Back Side"
                    buttonText="Upload Back Side Image"
                    mandatory={true}
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={backSideImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Left Side"
                    buttonText="Upload Left Side Image"
                    mandatory={true}
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={leftSideImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Right Side"
                    buttonText="Upload Right Side Image"
                    mandatory={true}
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={rightSideImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Speedo meter"
                    buttonText="Upload Speedo meter Image"
                    mandatory={true}
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={speedometerImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Chassis"
                    buttonText="Upload Chassis Image"
                    mandatory={true}
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={chassisImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Interior Front"
                    buttonText="Upload Interior Front Image"
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={interiorFrontImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Interior Back"
                    buttonText="Upload Interior Back Image"
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={interiorBackImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Extra Fitment"
                    buttonText="Upload Extra Fitment Image"
                    mandatory={true}
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={extraFitmentImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Scratch Damage"
                    buttonText="Upload Scratch Damage Image"
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={scratchDamageImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Dent Damage"
                    buttonText="Upload Dent Damage Image"
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={dentDamageImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Functions"
                    buttonText="Upload Functions Image"
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={functionsImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Break Damage"
                    buttonText="Upload Break Damage Image"
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={breakDamageImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Number Plate"
                    buttonText="Upload Number Plate Image"
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={numberPlateImage}
                    submitPressed={submitButtonPressed}
                  />
                  {/* {addAnotherInsuranceImage.length > 0 &&
                    addAnotherInsuranceImage.map((item, index) => {
                      return (
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ width: "90%" }}>
                            <CustomImageUpload
                              label={"Add New Image " + (index + 1)}
                              buttonText="Upload Image"
                              onPress={showImagePickerMethod}
                              onShowImage={setImagePath}
                              onDeleteImage={deleteImages}
                              onChangeText={(text) => {
                                const temp = addAnotherInsuranceImage;
                                temp[index].title = text;
                                setAddAnotherInsuranceImage(temp);
                              }}
                              value={item}
                            />
                          </View>
                          <View style={{ justifyContent: "center" }}>
                            <IconButton
                              icon="close-circle-outline"
                              color={Colors.RED}
                              // style={{ padding: 0, margin: 0 }}
                              size={25}
                              onPress={() => {
                                const updatedArray =
                                  addAnotherInsuranceImage.filter(
                                    (_, i) => i !== index
                                  );
                                setAddAnotherInsuranceImage(updatedArray);
                              }}
                            />
                          </View>
                        </View>
                      );
                    })} */}
                  {/* <LocalButtonComp
                    title={"Add Other Image"}
                    onPress={() => {
                      setAddAnotherInsuranceImage([
                        ...addAnotherInsuranceImage,
                        { title: "", name: "", url: "" },
                      ]);
                    }}
                    disabled={false}
                  /> */}
                </View>
              </List.Accordion>
              <List.Accordion
                id={"8"}
                key={"8"}
                title={"Upload Images of Documents - Evaluation Time"}
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
                <View>
                  <CustomUpload
                    label="Rc Front"
                    buttonText="Upload Rc Front Image"
                    mandatory={true}
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={rcFrontImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Rc Back"
                    buttonText="Upload Rc Back Image"
                    mandatory={true}
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={rcBackImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Insurance Copy"
                    buttonText="Upload Insurance Copy Image"
                    mandatory={true}
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={insuranceCopyImage}
                    submitPressed={submitButtonPressed}
                  />
                  <CustomUpload
                    label="Invoice"
                    buttonText="Upload Invoice Image"
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={invoiceImage}
                  />
                  <CustomUpload
                    label="Hypothication Document"
                    buttonText="Upload Hypothication Document Image"
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={hypothicationDocumentImage}
                  />
                  <CustomUpload
                    label="Bank/Finance - old car NOC"
                    buttonText="Upload Bank/Finance - old car NOC Image"
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={oldCarNOCImage}
                  />
                  <CustomUpload
                    label="CC"
                    buttonText="Upload CC Image"
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={ccImage}
                  />
                  <CustomUpload
                    label="Pollution"
                    buttonText="Upload Pollution Image"
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={pollutionImage}
                  />
                  <CustomUpload
                    label="ID Proof"
                    buttonText="Upload Id Proof Image"
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={idProofImage}
                  />
                  <CustomUpload
                    label="PAN Card"
                    buttonText="Upload PAN Card Image"
                    onPress={showImagePickerMethod}
                    onShowImage={setImagePath}
                    onDeleteImage={deleteImages}
                    value={panCardImage}
                    submitPressed={submitButtonPressed}
                  />
                  {otherImages.length > 0 &&
                    otherImages.map((item, index) => {
                      return (
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ width: "90%" }}>
                            <CustomImageUpload
                              label={"Add Image " + (index + 1)}
                              buttonText="Upload Image"
                              onPress={showImagePickerMethod}
                              onShowImage={setImagePath}
                              onDeleteImage={deleteImages}
                              onChangeText={(text) => {
                                const temp = otherImages;
                                temp[index].title = text;
                                setOtherImages(temp);
                              }}
                              value={item}
                            />
                          </View>
                          <View style={{ justifyContent: "center" }}>
                            <IconButton
                              icon="close-circle-outline"
                              color={Colors.RED}
                              // style={{ padding: 0, margin: 0 }}
                              size={25}
                              onPress={() => {
                                const updatedArray = otherImages.filter(
                                  (_, i) => i !== index
                                );
                                setOtherImages(updatedArray);
                              }}
                            />
                          </View>
                        </View>
                      );
                    })}
                  <LocalButtonComp
                    title={"Add Other Image"}
                    onPress={() => {
                      setOtherImages([
                        ...otherImages,
                        { title: "", name: "", url: "" },
                      ]);
                    }}
                    disabled={false}
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"9"}
                key={"9"}
                title={"Check List"}
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
                <View
                  style={{
                    marginHorizontal: 15,
                  }}
                >
                  <LocalButtonComp
                    title={"Edit Checklist"}
                    onPress={() => {
                      navigation.navigate(MyTasksStackIdentifiers.checkList);
                    }}
                    disabled={false}
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"10"}
                key={"10"}
                title={"Refurbishment Cost"}
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
                <View>
                  <Table
                    label={"Items"}
                    data={Refurbishment.Items}
                    onPress={(item) => {
                      const RefurbishmentTemp = Refurbishment.Items;
                      for (let i = 0; i < RefurbishmentTemp.length; i++) {
                        const element = RefurbishmentTemp[i];
                        if (element.id === item.id) {
                          element.status = item.status ? "Active" : "Deactive";
                        }
                      }
                      setRefurbishment({
                        Items: RefurbishmentTemp,
                        AdditionalExpenses: Refurbishment.AdditionalExpenses,
                      });
                    }}
                    onChangeText={(item) => {
                      const RefurbishmentTemp = Refurbishment.Items;
                      for (let i = 0; i < RefurbishmentTemp.length; i++) {
                        const element = RefurbishmentTemp[i];
                        if (element.id === item.id) {
                          element.cost = item.text;
                        }
                      }
                      setRefurbishment({
                        Items: RefurbishmentTemp,
                        AdditionalExpenses: Refurbishment.AdditionalExpenses,
                      });
                    }}
                  />
                  <View style={{ height: 25 }} />
                  <Table
                    label={"Additional Expenses"}
                    data={Refurbishment.AdditionalExpenses}
                    onPress={(item) => {
                      const RefurbishmentTemp =
                        Refurbishment.AdditionalExpenses;
                      for (let i = 0; i < RefurbishmentTemp.length; i++) {
                        const element = RefurbishmentTemp[i];
                        if (element.id === item.id) {
                          element.status = item.status ? "Active" : "Deactive";
                        }
                      }
                      setRefurbishment({
                        Items: Refurbishment.Items,
                        AdditionalExpenses: RefurbishmentTemp,
                      });
                    }}
                    onChangeText={(item) => {
                      const RefurbishmentTemp =
                        Refurbishment.AdditionalExpenses;
                      for (let i = 0; i < RefurbishmentTemp.length; i++) {
                        const element = RefurbishmentTemp[i];
                        if (element.id === item.id) {
                          element.cost = item.text;
                        }
                      }
                      setRefurbishment({
                        Items: Refurbishment.Items,
                        AdditionalExpenses: RefurbishmentTemp,
                      });
                    }}
                  />
                  <Text
                    style={{ fontSize: 14, color: "#000", fontWeight: "500" }}
                  >
                    {"Total Refurbishment Cost: " + getTotalCost(Refurbishment)}
                  </Text>
                  {addOtherCost && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View style={{ width: "90%" }}>
                        <CustomTextInput
                          placeholder="Enter Name"
                          label="Name"
                          value={costName}
                          onChangeText={(text) => {
                            setCostName(text);
                          }}
                        />
                        <CustomTextInput
                          placeholder="Enter Cost"
                          label="Cost"
                          value={cost}
                          keyboardType={"number-pad"}
                          onChangeText={(text) => {
                            setCost(text);
                          }}
                        />
                      </View>

                      <View style={{ justifyContent: "flex-end" }}>
                        <IconButton
                          icon="close-circle-outline"
                          color={Colors.RED}
                          style={{ padding: 0, margin: 0 }}
                          size={25}
                          onPress={() => {
                            setAddOtherCost(false);
                          }}
                        />
                      </View>
                    </View>
                  )}
                  <LocalButtonComp
                    title={"Add Other Cost"}
                    onPress={() => {
                      setAddOtherCost(true);
                    }}
                    disabled={false}
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"11"}
                key={"11"}
                title={"Price Declaration"}
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
                <View>
                  <CustomTextInput
                    placeholder="Enter Customer Expected Price"
                    label="Customer Expected Price"
                    mandatory={true}
                    value={customerExpectedPrice}
                    maxLength={7}
                    keyboardType={"number-pad"}
                    onChangeText={(text) => {
                      setCustomerExpectedPrice(text);
                      setErrors({
                        ...errors,
                        ...(errors.customerExpectedPrice = ""),
                      });
                    }}
                    errorMessage={errors.customerExpectedPrice}
                  />
                  <CustomTextInput
                    placeholder="Enter Evaluator Offered Price"
                    label="Evaluator Offered Price"
                    mandatory={true}
                    value={evaluatorOfferedPrice}
                    onChangeText={(text) => {
                      setEvaluatorOfferedPrice(text);
                      setErrors({
                        ...errors,
                        ...(errors.evaluatorOfferedPrice = ""),
                      });
                    }}
                    errorMessage={errors.evaluatorOfferedPrice}
                  />
                  <CustomTextInput
                    placeholder="Enter Manager Approved Price"
                    label="Manager Approved Price"
                    mandatory={true}
                    value={managerApprovedPrice}
                    onChangeText={(text) => {
                      setManagerApprovedPrice(text);
                      setErrors({
                        ...errors,
                        ...(errors.managerApprovedPrice = ""),
                      });
                    }}
                    errorMessage={errors.managerApprovedPrice}
                  />
                  <CustomTextInput
                    placeholder="Enter Price Gap"
                    label="Price Gap"
                    mandatory={true}
                    value={priceGap}
                    onChangeText={(text) => {
                      setPriceGap(text);
                    }}
                  />
                  <CustomDatePicker
                    label="Approval Expiry Date"
                    value={approvalExpiryDate}
                    onPress={ShowDatePickerFunction}
                  />
                </View>
              </List.Accordion>
            </List.AccordionGroup>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <LocalButtonComp
                title={"Save as Draft"}
                onPress={() => {}}
                disabled={false}
                color={Colors.GRAY}
              />
              <LocalButtonComp
                title={"Submit"}
                onPress={() => {
                  handleValidation();
                }}
                disabled={false}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EvaluationForm;

const styles = StyleSheet.create({
  accordianBorder: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "#7a7b7d",
    justifyContent: "center",
    marginVertical: 3,
  },
  accordianBorder2: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "#7a7b7d",
    justifyContent: "center",
    marginVertical: 3,
  },
  textInputStyle: {
    height: 50,
    width: "100%",
    marginVertical: 2,
    paddingLeft: 10,
    paddingRight: 10,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    padding: 16,
    // borderWidth: 1,
    width: "100%",
    height: 50,
    borderRadius: 5,
    paddingLeft: 25,
    paddingRight: 25,
    marginVertical: 10,
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
  table: {
    width: "100%",
    marginTop: 20,
  },
  column: {
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    marginHorizontal: 5,
  },
});
