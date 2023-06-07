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
import { Checkbox, DataTable, List, Button } from "react-native-paper";
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
  Gender_Types,
  Salutation_Types,
} from "../../../jsonData/enquiryFormScreenJsonData";

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

const SAMPLELIST = [
  {
    Name: "Product A",
    "Office Allocated": "Office 1",
    Remarks: "Lorem ipsum dolor sit amet",
    Quantity: 10,
    Cost: 50,
    Price: 70,
  },
  {
    Name: "Product B",
    "Office Allocated": "Office 2",
    Remarks: "Consectetur adipiscing elit",
    Quantity: 5,
    Cost: 20,
    Price: 30,
  },
  {
    Name: "Product C",
    "Office Allocated": "Office 1",
    Remarks: "Sed do eiusmod tempor incididunt",
    Quantity: 15,
    Cost: 30,
    Price: 40,
  },
];

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
  const [imagePath, setImagePath] = useState("");
  const [errors, setErrors] = useState({});
  const [salutation, setSalutation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [relationName, setRelationName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("17/05/1995");
  const [age, setAge] = useState("");
  const [anniversaryDate, setAnniversaryDate] = useState("17/05/1995");
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
  //  const [mobileNumber, setMobileNumber] = useState("");
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
  const [evaluatorOfferedPrice, setEvaluatorOfferedPrice] = useState("");
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

  const [budget, setBudget] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const [ItemList, setItemList] = useState(SAMPLELIST);
  let scrollRef = useRef(null);

  useEffect(() => {}, []);
  const getOptions = async () => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const response = await client.get(
          URL.GET_ALL_EVALUATION(jsonObj.orgId)
        );
        const json = await response.json();
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
      }
    } catch (error) {}
  };

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
    setItemList([...ItemList, item]);
    setModalVisible(false);
  };

  const scrollToPos = (itemIndex) => {
    scrollRef.current.scrollTo({ y: itemIndex * 70 });
  };

  const handleLogin = () => {
    // Handle login logic here
  };

  // const validation = () => {
  //   let isValid = true;
  //   if (!eventNumber || isNaN(eventNumber)) {
  //     setEventNumberError("Please enter a valid event number.");
  //     isValid = false;
  //   }
  //   if (!eventName || eventName.length < 3) {
  //     setEventNameError(
  //       "Please enter a valid event name (at least 3 characters)."
  //     );
  //     isValid = false;
  //   }
  //   if (!eventOrganiser || eventOrganiser.length < 3) {
  //     setEventOrganiserError(
  //       "Please enter a valid event organiser (at least 3 characters)."
  //     );
  //     isValid = false;
  //   }
  //   if (!eventPlannerLocation) {
  //     setEventPlannerLocationError("Please select an event planner location.");
  //     isValid = false;
  //   }
  //   if (!eventPlannerCode) {
  //     setEventPlannerDealerCodeError(
  //       "Please select an event planner dealer code."
  //     );
  //     isValid = false;
  //   }
  //   if (!pinCode || pinCode.length !== 6) {
  //     setPincodeError("Please enter a valid pincode (6 digits).");
  //     isValid = false;
  //   }
  //   if (!eventType) {
  //     setEventTypeError("Please select an event type.");
  //     isValid = false;
  //   }
  //   if (!eventCategory) {
  //     setEventCategoryError("Please select an event category.");
  //     isValid = false;
  //   }
  //   if (!eventArea) {
  //     setEventAreaError("Please enter an event area.");
  //     isValid = false;
  //   }
  //   if (!eventLocation) {
  //     setEventLocationError("Please enter an event location.");
  //     isValid = false;
  //   }
  //   if (!district) {
  //     setDistrictError("Please enter a district.");
  //     isValid = false;
  //   }
  //   if (!state) {
  //     setStateError("Please enter a state.");
  //     isValid = false;
  //   }
  //   if (!eventStartDate) {
  //     setEventStartDateError("Please select a start date.");
  //     isValid = false;
  //   }
  //   if (!eventEndDate) {
  //     setEventEndDateError("Please select an end date.");
  //     isValid = false;
  //   }

  //   if (!rcNumber || rcNumber.length !== 12) {
  //     setRcNumberError("Please enter a valid RC number (12 characters).");
  //     isValid = false;
  //   }
  //   if (!model || model.length < 2) {
  //     setModelError("Please enter a valid model name (at least 2 characters).");
  //     isValid = false;
  //   }
  //   if (!variant || variant.length < 2) {
  //     setVariantError(
  //       "Please enter a valid variant name (at least 2 characters)."
  //     );
  //     isValid = false;
  //   }
  //   if (!color || color.length < 2) {
  //     setColorError("Please enter a valid color name (at least 2 characters).");
  //     isValid = false;
  //   }
  //   if (!fuelType || fuelType.length < 2) {
  //     setFuelTypeError(
  //       "Please enter a valid fuel type (at least 2 characters)."
  //     );
  //     isValid = false;
  //   }

  //   if (!manager || manager.length < 2) {
  //     setManagerError(
  //       "Please enter a valid manager name (at least 2 characters)."
  //     );
  //     isValid = false;
  //   }
  //   if (!tl || tl.length < 2) {
  //     setTlError(
  //       "Please enter a valid team leader name (at least 2 characters)."
  //     );
  //     isValid = false;
  //   }
  //   if (!consultant || consultant.length < 2) {
  //     setConsultantError(
  //       "Please enter a valid consultant name (at least 2 characters)."
  //     );
  //     isValid = false;
  //   }
  //   if (!driver || driver.length < 2) {
  //     setDriverError(
  //       "Please enter a valid driver name (at least 2 characters)."
  //     );
  //     isValid = false;
  //   }
  //   if (!financeExecutive || financeExecutive.length < 2) {
  //     setFinanceExecutiveError(
  //       "Please enter a valid finance executive name (at least 2 characters)."
  //     );
  //     isValid = false;
  //   }
  //   if (!evaluator || evaluator.length < 2) {
  //     setEvaluatorError(
  //       "Please enter a valid evaluator name (at least 2 characters)."
  //     );
  //     isValid = false;
  //   }

  //   if (!openAccordian) {
  //     setOpenAccordianError("Please select an accordion panel.");
  //     isValid = false;
  //   }

  //   if (!showDatePicker) {
  //     setShowDatePickerError("Please select a date.");
  //     isValid = false;
  //   }

  //   return isValid;
  // };

  const handleSubmit = () => {
    // if (!validation()) {
    // }
    // handle form submission logic
    scrollToPos(0);
    setOpenAccordian("2");
  };

  const handleValidation = () => {
    const newErrors = {};

    // Validate First Name
    if (firstName.trim() === "") {
      newErrors.firstName = "First Name is required";
    }

    // Validate Last Name
    if (lastName.trim() === "") {
      newErrors.lastName = "Last Name is required";
    }

    // Validate Date of Birth
    if (dateOfBirth.trim() === "") {
      newErrors.dateOfBirth = "Date of Birth is required";
    } else {
      // Add additional validation logic for date format or range if needed
    }

    // Validate Mobile Number
    if (mobileNumber.trim() === "") {
      newErrors.mobileNumber = "Mobile Number is required";
    } else {
      if (mobileNumber.trim().length === 10) {
        newErrors.mobileNumber = "Length of Mobile Number must be 10";
      }
      // Add additional validation logic for mobile number format if needed
    }
    // Validate RC Number
    // if (rcNumber.trim() === "") {
    //   newErrors.rcNumber = "RC Number is required";
    // }

    // // Validate Name On RC
    // if (nameOnRC.trim() === "") {
    //   newErrors.nameOnRC = "Name On RC is required";
    // }

    // // Validate Mobile Number
    // if (mobileNumber.trim() === "") {
    //   newErrors.mobileNumber = "Mobile Number is required";
    // }

    // Validate Variant
    // if (variant.trim() === "") {
    //   newErrors.variant = "Variant is required";
    // }

    // // Validate Colour
    // if (colour.trim() === "") {
    //   newErrors.colour = "Colour is required";
    // }

    // // Validate Transmission
    // if (transmission.trim() === "") {
    //   newErrors.transmission = "Transmission is required";
    // }

    // // Validate Vin Number
    // if (vinNumber.trim() === "") {
    //   newErrors.vinNumber = "Vin Number is required";
    // }

    // // Validate Engine Number
    // if (engineNumber.trim() === "") {
    //   newErrors.engineNumber = "Engine Number is required";
    // }

    // // Validate Month
    // if (month.trim() === "") {
    //   newErrors.month = "Month is required";
    // }

    // // Validate Year
    // if (year.trim() === "") {
    //   newErrors.year = "Year is required";
    // }

    // // Validate Pincode
    // if (pincode.trim() === "") {
    //   newErrors.pincode = "Pincode is required";
    // }

    // // Validate Registration State
    // if (registrationState.trim() === "") {
    //   newErrors.registrationState = "Registration State is required";
    // }

    // // Validate Registration District
    // if (registrationDistrict.trim() === "") {
    //   newErrors.registrationDistrict = "Registration District is required";
    // }

    // // Validate Registration City
    // if (registrationCity.trim() === "") {
    //   newErrors.registrationCity = "Registration City is required";
    // }

    // // Validate Emission
    // if (emission.trim() === "") {
    //   newErrors.emission = "Emission is required";
    // }

    // // Validate Vehicle Type
    // if (vehicleType.trim() === "") {
    //   newErrors.vehicleType = "Vehicle Type is required";
    // }

    // // Validate Type of Body
    // if (typeOfBody.trim() === "") {
    //   newErrors.typeOfBody = "Type of Body is required";
    // }

    // // Validate KM's driven
    // if (kmsDriven.trim() === "") {
    //   newErrors.kmsDriven = "KM's driven is required";
    // }

    // // Validate Cubic Capacity
    // if (cubicCapacity.trim() === "") {
    //   newErrors.cubicCapacity = "Cubic Capacity is required";
    // }

    // // Validate No Owners
    // if (noOwners.trim() === "") {
    //   newErrors.noOwners = "No Owners is required";
    // }

    // // Validate No. of Challan Pending
    // if (challanPending.trim() === "") {
    //   newErrors.challanPending = "No. of Challan Pending is required";
    // }

    // if (hypothecatedTo.trim() === "") {
    //   newErrors.hypothecatedTo = "Hypothecated To is required";
    // }

    // // Validate Hypothecated Branch
    // if (hypothecatedBranch.trim() === "") {
    //   newErrors.hypothecatedBranch = "Hypothecated Branch is required";
    // }

    // // Validate Loan amount due
    // if (loanAmountDue.trim() === "") {
    //   newErrors.loanAmountDue = "Loan amount due is required";
    // }

    // // Validate Hypothication Completed Date
    // if (hypothicationCompletedDate.trim() === "") {
    //   newErrors.hypothicationCompletedDate =
    //     "Hypothication Completed Date is required";
    // }

    // Update the errors state
    // setErrors(newErrors);
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

  const data = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
  ];

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
        break;
      case "Model":
        break;
      case "Fuel Type":
        break;
      case "Month":
        break;
      case "Year":
        break;
      case "Vehicle Type":
        break;
      case "YearType of Body":
        break;
      case "Insurance Type":
        break;
      default:
        break;
    }
    setDropDownTitle(item);
    setShowDropDown(true);
  };

  const update = () => {
    const Payload = {
      id: 0,
      nameOnRC: nameOnRc,
      registrationNumber: "AAAAAA1234",
      mobileNum: mobileNumber,
      customerId: "18-286-ca9d9470-478b-43df-9ffa-4a57b6644470",
      regValidity: regnValidUpto,
      regDistrict: registrationDistrict,
      regCity: registrationCity,
      pincode: pincode,
      regState: registrationState,
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
      model: model,
      varient: variant,
      yearMonthOfManufacturing: yearMonthOfManufacturing,
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
      chassisNum: "78hb",
      noOfOwners: noOwners,
      colour: colour,
      transmission: transmission,
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
      engineNumber: engineNumber,
      nocclearance: null,
      challenamount: null,
      oilChangesCost: null,
      regDate: dateOfRegistration,
      emission: emission,
      challanPending: noOfChallanPending,
      hypothecation: hypothecatedTo,
      hypothecatedBranch: hypothecatedBranch,
      hypothecatedCompletedDate: hypothicationCompletedDate,
      insuranceType: insuranceType,
      loanAmountDue: loanAmountDue,
      insuranceCompanyName: insuranceCompanyName,
      policyNumber: policyNumber,
      insFromDate: insuranceFromDate,
      insToDate: insuranceToDate,
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
      custExpectedPrice: customerExpectedPrice,
      evaluatorOfferPrice: evaluatorOfferedPrice,
      managerId: 942,
      carExchangeEvalutionCosts: [],
    };
  };
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
        onChange={(event, selectedDate) => {}}
        onRequestClose={() => setShowDatePicker(false)}
      />
      <DropDownComponant
        visible={showDropDown}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        onRequestClose={() => setShowDropDown(false)}
        selectedItems={(item) => {}}
      />
      <ImagePickerComponent
        visible={showImagePicker}
        selectedImage={(data, keyId) => {}}
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
                    onPress={() => {
                      showDropDownModelMethod("Salutation");
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter First Name"
                    label="First Name"
                    mandatory={true}
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Last Name"
                    label="Last Name"
                    mandatory={true}
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                    }}
                  />
                  <CustomEvaluationDropDown
                    label="Gender"
                    buttonText="Select Gender"
                    onPress={() => {
                      showDropDownModelMethod("Gender");
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Relation Name"
                    label="Relation Name"
                    value={relationName}
                    onChangeText={(text) => {
                      setRelationName(text);
                    }}
                  />
                  <CustomDatePicker
                    label="Date of Birth"
                    value={dateOfBirth}
                    onPress={() => {
                      setShowDatePicker(true);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Age"
                    label="Age"
                    value={age}
                    keyboardType={"number-pad"}
                    onChangeText={(text) => {
                      setAge(text);
                    }}
                  />
                  <CustomDatePicker
                    label="Anniversary Date"
                    value={anniversaryDate}
                    onPress={() => {}}
                  />
                  <CustomTextInput
                    placeholder="Enter Mobile Number"
                    label="Mobile Number"
                    mandatory={true}
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
                    keyboardType={"number-pad"}
                    onChangeText={(text) => {
                      setAlternateMobileNumber(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Email ID"
                    label="Email ID"
                    value={email}
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
                      status={true}
                      onPress={() => {}}
                    />
                    <RadioTextItem
                      label={"Rural"}
                      value={"rural"}
                      status={false}
                      onPress={() => {}}
                    />
                  </View>
                  <CustomTextInput
                    placeholder="Enter H-No"
                    label="H-No"
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
                  <CustomEvaluationDropDown
                    label="Village/Town"
                    buttonText="Select Village/Town"
                    onPress={() => {
                      showDropDownModelMethod("Village/Town");
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Mandal/Tahsil"
                    label="Mandal/Tahsil"
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
                      status={sameAsPermanent}
                      onPress={() => {
                        setSameAsPermanent(true);
                        setPermanentAddress(communicationAddress);
                      }}
                    />
                    <RadioTextItem
                      label={"No"}
                      value={"no"}
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
                      status={true}
                      onPress={() => {}}
                    />
                    <RadioTextItem
                      label={"Rural"}
                      value={"rural"}
                      status={false}
                      onPress={() => {}}
                    />
                  </View>
                  <CustomTextInput
                    placeholder="Enter H-No"
                    label="H-No"
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
                    value={permanentAddress.street}
                    onChangeText={(text) => {
                      setPermanentAddress({
                        ...permanentAddress,
                        ...(permanentAddress.street = text),
                      });
                    }}
                  />
                  <CustomEvaluationDropDown
                    label="Village/Town"
                    buttonText="Select Village/Town"
                    onPress={() => {
                      showDropDownModelMethod("PerVillage/Town");
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Mandal/Tahsil"
                    label="Mandal/Tahsil"
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
                    onChangeText={(text) => {
                      setRcNumber(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Name On RC"
                    label="Name On RC"
                    mandatory={true}
                    value={nameOnRc}
                    onChangeText={(text) => {
                      setNameOnRc(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Mobile Number"
                    label="Mobile Number"
                    mandatory={true}
                    value={mobileNumber}
                    onChangeText={(text) => {
                      setMobileNumber(text);
                    }}
                  />
                  <CustomEvaluationDropDown
                    label="Brand"
                    buttonText="Select Brand"
                    onPress={() => {
                      showDropDownModelMethod("Brand");
                    }}
                    value={brand}
                    onChangeText={(text) => {
                      setBrand(text);
                    }}
                  />
                  <CustomEvaluationDropDown
                    label="Model"
                    buttonText="Select Model"
                    onPress={() => {
                      showDropDownModelMethod("Model");
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Variant"
                    label="Variant"
                    mandatory={true}
                    value={insuranceCompanyName}
                    onChangeText={(text) => {
                      setInsuranceCompanyName(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Colour"
                    label="Colour"
                    mandatory={true}
                    value={insuranceCompanyName}
                    onChangeText={(text) => {
                      setInsuranceCompanyName(text);
                    }}
                  />
                  <CustomEvaluationDropDown
                    label="Fuel Type"
                    buttonText="Select Fuel Type"
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
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Vin Number"
                    label="Vin Number"
                    mandatory={true}
                    value={vinNumber}
                    onChangeText={(text) => {
                      setVinNumber(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Engine Number"
                    label="Engine Number"
                    mandatory={true}
                    value={engineNumber}
                    onChangeText={(text) => {
                      setEngineNumber(text);
                    }}
                  />
                  <CustomEvaluationDropDown
                    label="Month"
                    buttonText="Select Month"
                    onPress={() => {
                      showDropDownModelMethod("Month");
                    }}
                  />
                  <CustomEvaluationDropDown
                    label="Year"
                    buttonText="Select Year"
                    onPress={() => {
                      showDropDownModelMethod("Year");
                    }}
                  />
                  <CustomDatePicker
                    label="Date of Registration"
                    value={dateOfRegistration}
                    onPress={() => {}}
                  />
                  <CustomDatePicker
                    label="Regn. Valid Upto"
                    value={regnValidUpto}
                    onPress={() => {}}
                  />
                  <CustomTextInput
                    placeholder="Enter Pincode"
                    label="Pincode"
                    mandatory={true}
                    keyboardType={"number-pad"}
                    value={pincode}
                    onChangeText={(text) => {
                      setPincode(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Registration State"
                    label="Registration State"
                    mandatory={true}
                    value={registrationState}
                    onChangeText={(text) => {
                      setRegistrationState(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Registration District"
                    label="Registration District"
                    mandatory={true}
                    value={registrationDistrict}
                    onChangeText={(text) => {
                      setRegistrationDistrict(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Registration City"
                    label="Registration City"
                    mandatory={true}
                    value={registrationCity}
                    onChangeText={(text) => {
                      setRegistrationCity(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Emission"
                    label="Emission"
                    mandatory={true}
                    value={emission}
                    onChangeText={(text) => {
                      setEmission(text);
                    }}
                  />
                  <CustomEvaluationDropDown
                    label="Vehicle Type"
                    buttonText="Select Vehicle Type"
                    onPress={() => {
                      showDropDownModelMethod("Vehicle Type");
                    }}
                  />
                  <CustomEvaluationDropDown
                    label="Type of Body"
                    buttonText="Select Type of Body"
                    onPress={() => {
                      showDropDownModelMethod("Type of Body");
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter KM's driven"
                    label="KM's driven"
                    mandatory={true}
                    value={kmsDriven}
                    onChangeText={(text) => {
                      setKmsDriven(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Cubic Capacity"
                    label="Cubic Capacity"
                    mandatory={true}
                    value={cubicCapacity}
                    onChangeText={(text) => {
                      setCubicCapacity(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter No Owners"
                    label="No Owners"
                    mandatory={true}
                    value={noOwners}
                    onChangeText={(text) => {
                      setNoOwners(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter No. of Challan Pending"
                    label="No. of Challan Pending"
                    mandatory={true}
                    value={noOfChallanPending}
                    onChangeText={(text) => {
                      setNoOfChallanPending(text);
                    }}
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
                  />
                  <CustomRadioButton
                    label="Front left"
                    value={frontLeftSelected}
                    onPress={setFrontLeftSelected}
                    mandatory={true}
                  />
                  <CustomRadioButton
                    label="Rear right"
                    value={rearRightSelected}
                    onPress={setRearRightSelected}
                    mandatory={true}
                  />
                  <CustomRadioButton
                    label="Rear left"
                    value={rearLeftSelected}
                    onPress={setRearLeftSelected}
                    mandatory={true}
                  />
                  <CustomRadioButton
                    label="Spare Disk Wheel"
                    value={spareDiskWheelSelected}
                    onPress={setSpareDiskWheelSelected}
                    mandatory={true}
                  />
                  <CustomRadioButton
                    label="Spare Alli Wheel"
                    value={spareAlliWheelSelected}
                    onPress={setSpareAlliWheelSelected}
                    mandatory={true}
                  />
                  <CustomSelection
                    label="Any Minor Accident"
                    value={anyMinorAccidentSelected}
                    onPress={setAnyMinorAccidentSelected}
                    mandatory={true}
                  />
                  <CustomSelection
                    label="Any Major Accident"
                    value={anyMajorAccidentSelected}
                    onPress={setAnyMajorAccidentSelected}
                    mandatory={true}
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
                      status={true ? "checked" : "unchecked"}
                      color={Colors.RED}
                      onPress={() => {}}
                    />
                    <Text>{"* Agree to enter Hypothication details"}</Text>
                  </View>
                  <CustomTextInput
                    placeholder="Enter Hypothecated To"
                    label="Hypothecated To"
                    mandatory={true}
                    value={hypothecatedTo}
                    onChangeText={(text) => {
                      setHypothecatedTo(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Hypothecated Branch"
                    label="Hypothecated Branch"
                    mandatory={true}
                    value={hypothecatedBranch}
                    onChangeText={(text) => {
                      setHypothecatedBranch(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Loan amount due"
                    label="Loan amount due"
                    mandatory={true}
                    value={loanAmountDue}
                    onChangeText={(text) => {
                      setLoanAmountDue(text);
                    }}
                  />
                  <CustomDatePicker
                    label="Hypothication Completed Date"
                    value={hypothicationCompletedDate}
                    onPress={() => {}}
                  />
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
                      status={true ? "checked" : "unchecked"}
                      color={Colors.RED}
                      onPress={() => {}}
                    />
                    <Text>{"* Agree to enter Insurance details"}</Text>
                  </View>
                  <CustomEvaluationDropDown
                    label="Insurance Type"
                    buttonText="Choose your Insurance Type"
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
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Policy Number"
                    label="Policy Number"
                    mandatory={true}
                    value={policyNumber}
                    onChangeText={(text) => {
                      setPolicyNumber(text);
                    }}
                  />
                  <CustomDatePicker
                    label="Insurance From Date"
                    value={insuranceFromDate}
                    onPress={() => {}}
                  />
                  <CustomDatePicker
                    label="Insurance To Date"
                    value={insuranceToDate}
                    onPress={() => {}}
                  />
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
                    onPress={() => {}}
                    onShowImage={() => {}}
                    onDeleteImage={() => {}}
                  />
                  <CustomUpload
                    label="Back Side"
                    buttonText="Upload Back Side Image"
                    mandatory={true}
                    onPress={() => {}}
                    onShowImage={() => {}}
                    onDeleteImage={() => {}}
                  />
                  <CustomUpload
                    label="Left Side"
                    buttonText="Upload Left Side Image"
                    mandatory={true}
                    onPress={() => {}}
                    onShowImage={() => {}}
                    onDeleteImage={() => {}}
                  />
                  <CustomUpload
                    label="Right Side"
                    buttonText="Upload Right Side Image"
                    mandatory={true}
                    onPress={() => {}}
                    onShowImage={() => {}}
                    onDeleteImage={() => {}}
                  />
                  <CustomUpload
                    label="Speedo meter"
                    buttonText="Upload Speedo meter Image"
                    mandatory={true}
                    onPress={() => {}}
                    onShowImage={() => {}}
                    onDeleteImage={() => {}}
                  />
                  <CustomUpload
                    label="Front Side"
                    buttonText="Upload Front Side Image"
                    mandatory={true}
                    onPress={() => {}}
                    onShowImage={() => {}}
                    onDeleteImage={() => {}}
                  />
                  <CustomUpload
                    label="Chassis"
                    buttonText="Upload Chassis Image"
                    mandatory={true}
                    onPress={() => {}}
                    onShowImage={() => {}}
                    onDeleteImage={() => {}}
                  />
                  <CustomUpload
                    label="Interior Front"
                    buttonText="Upload Interior Front Image"
                    onPress={() => {}}
                    onShowImage={() => {}}
                    onDeleteImage={() => {}}
                  />
                  <CustomUpload
                    label="Interior Back"
                    buttonText="Upload Interior Back Image"
                    onPress={() => {}}
                    onShowImage={() => {}}
                    onDeleteImage={() => {}}
                  />
                  <CustomUpload
                    label="Extra Fitment"
                    buttonText="Upload Extra Fitment Image"
                    mandatory={true}
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Scratch Damage"
                    buttonText="Upload Scratch Damage Image"
                    onPress={() => {}}
                    onShowImage={() => {}}
                    onDeleteImage={() => {}}
                  />
                  <CustomUpload
                    label="Dent Damage"
                    buttonText="Upload Dent Damage Image"
                    onPress={() => {}}
                    onShowImage={() => {}}
                    onDeleteImage={() => {}}
                  />
                  <CustomUpload
                    label="Functions"
                    buttonText="Upload Functions Image"
                    onPress={() => {}}
                    onShowImage={() => {}}
                    onDeleteImage={() => {}}
                  />
                  <CustomUpload
                    label="Break Damage"
                    buttonText="Upload Break Damage Image"
                    onPress={() => {}}
                    onShowImage={() => {}}
                    onDeleteImage={() => {}}
                  />
                  <CustomUpload
                    label="Number Plate"
                    buttonText="Upload Number Plate Image"
                    onPress={() => {}}
                    onShowImage={() => {}}
                    onDeleteImage={() => {}}
                  />
                  <LocalButtonComp
                    title={"Add Other Image"}
                    onPress={() => {}}
                    disabled={false}
                  />
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
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Rc Back"
                    buttonText="Upload Rc Back Image"
                    mandatory={true}
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Insurance Copy"
                    buttonText="Upload Insurance Copy Image"
                    mandatory={true}
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Invoice"
                    buttonText="Upload Invoice Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Hypothication Document"
                    buttonText="Upload Hypothication Document Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Bank/Finance - old car NOC"
                    buttonText="Upload Bank/Finance - old car NOC Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="CC"
                    buttonText="Upload CC Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Pollution"
                    buttonText="Upload Pollution Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="ID Proof"
                    buttonText="Upload Id Proof Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="PAN Card"
                    buttonText="Upload PAN Card Image"
                    onPress={() => {}}
                  />
                  <LocalButtonComp
                    title={"Add Other Image"}
                    onPress={() => {}}
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
                  <Button
                    onPress={() =>
                      navigation.navigate(MyTasksStackIdentifiers.checkList)
                    }
                  >
                    {"NAV"}
                  </Button>
                  <List.AccordionGroup
                    expandedId={openAccordian2}
                    onAccordionPress={(expandedId) =>
                      updateSecondAccordian(expandedId)
                    }
                  >
                    <List.Accordion
                      id={"1"}
                      key={"1"}
                      title={"General Appearance"}
                      titleStyle={{
                        color:
                          openAccordian2 === "1" ? Colors.BLACK : Colors.BLACK,
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                      style={[
                        {
                          backgroundColor:
                            openAccordian2 === "1" ? Colors.RED : Colors.WHITE,
                          height: 60,
                        },
                        styles.accordianBorder2,
                      ]}
                    >
                      <View></View>
                    </List.Accordion>
                  </List.AccordionGroup>
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
                  <Table label={"Items"} />
                  <View style={{ height: 25 }} />
                  <Table label={"Additional Expenses"} />
                  <Text
                    style={{ fontSize: 14, color: "#000", fontWeight: "500" }}
                  >
                    {"Total Refurbishment Cost: 0"}
                  </Text>
                  <LocalButtonComp
                    title={"Add Other Cost"}
                    onPress={() => {}}
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
                    onChangeText={(text) => {
                      setCustomerExpectedPrice(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Evaluator Offered Price"
                    label="Evaluator Offered Price"
                    mandatory={true}
                    value={evaluatorOfferedPrice}
                    onChangeText={(text) => {
                      setEvaluatorOfferedPrice(text);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter Manager Approved Price"
                    label="Manager Approved Price"
                    mandatory={true}
                    value={managerApprovedPrice}
                    onChangeText={(text) => {
                      setManagerApprovedPrice(text);
                    }}
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
                    onPress={() => {}}
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
                onPress={() => {}}
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
