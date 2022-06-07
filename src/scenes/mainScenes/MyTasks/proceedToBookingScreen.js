import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp, DropDownComponant } from "../../../components";
import { DropDownSelectionItem } from "../../../pureComponents";
import { Button, IconButton } from "react-native-paper";
import * as AsyncStore from "../../../asyncStore";
import { useDispatch, useSelector } from "react-redux";
import {
  clearState,
  getEnquiryDetailsApi,
  updateEnquiryDetailsApi,
  dropEnquiryApi,
  getTaskDetailsApi,
  updateTaskApi,
  changeEnquiryStatusApi,
  getDropDataApi,
  getDropSubReasonDataApi,
} from "../../../redux/proceedToBookingReducer";
import {
  updateStatus
} from "../../../redux/preBookingFormReducer";
import {
  showToast,
  showToastRedAlert,
  showToastSucess,
} from "../../../utils/toast";
import {
  getCurrentTasksListApi,
  getPendingTasksListApi,
} from "../../../redux/mytaskReducer";
import URL from "../../../networking/endpoints";
import { EmsTopTabNavigatorIdentifiers } from "../../../navigations/emsTopTabNavigator";
import Geolocation from '@react-native-community/geolocation';

const FirstDependencyArray = [
  "Lost To Competition",
  "Lost To Used Car",
  "Lost to Used Cars from Co-Dealer",
];
const SecondDependencyArray = [
  "Lost to Competitor",
  "Lost To Co-Dealer",
  "Lost To Competition",
  "Lost To Used Car",
];

const ProceedToBookingScreen = ({ route, navigation }) => {
  const { taskId, identifier, universalId, taskStatus } = route.params;
  const selector = useSelector((state) => state.proceedToBookingReducer);
  const dispatch = useDispatch();
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [dropReason, setDropReason] = useState("");
  const [dropSubReason, setDropSubReason] = useState("");
  const [dropRemarks, setDropRemarks] = useState("");
  const [brandName, setBrandName] = useState("");
  const [dealerName, setDealerName] = useState("");
  const [location, setLocation] = useState("");
  const [model, setModel] = useState("");
  const [isDropSelected, setIsDropSelected] = useState(false);
  const [userData, setUserData] = useState({
    branchId: "",
    orgId: "",
    employeeId: "",
    employeeName: "",
  });
  const [typeOfActionDispatched, setTypeOfActionDispatched] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);

  useLayoutEffect(() => {
    let title = "Pre Booking Task";
    switch (identifier) {
      case "PROCEED_TO_PRE_BOOKING":
        title = "Pre Booking Task";
        break;
      case "PROCEED_TO_BOOKING":
        title = "Booking Task";
        break;
    }

    navigation.setOptions({
      title: title,
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

  const goParentScreen = () => {
    navigation.popToTop();
    dispatch(clearState());
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      getCurrentLocation()
      console.log("@@@@@@@@@@@@@@@@@@@@@@");
      dispatch(getTaskDetailsApi(taskId));
      getAuthToken();
      getAsyncstoreData();
      
      getPreBookingDetailsFromServer();
    })
    navigation.addListener('blur', () => {
      dispatch(updateStatus())
    })
  }, [navigation]);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(info => {
      console.log(info)
      setCurrentLocation({
        lat: info.coords.latitude,
        long: info.coords.longitude
      })
    });
  }

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
      });

      const payload = {
        bu: jsonObj.orgId,
        dropdownType:
          identifier === "PROCEED_TO_BOOKING"
            ? "PreBookDropReas"
            : "PreEnqDropReas",
        parentId: 0,
      };
      dispatch(getDropDataApi(payload));
    }
  };

  const getAuthToken = async () => {
    const token = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
    if (token) {
      setAuthToken(token);
    }
  };

  const getPreBookingDetailsFromServer = () => {
    if (universalId) {
      dispatch(getEnquiryDetailsApi(universalId));
    }
  };

  const getMyTasksListFromServer = () => {
    if (userData.employeeId) {
      const endUrl = `empid=${userData.employeeId}&limit=10&offset=${0}`;
      dispatch(getCurrentTasksListApi(endUrl));
      dispatch(getPendingTasksListApi(endUrl));
    }
  };

  const proceedToCancellation = () => {
    if (identifier === "PROCEED_TO_BOOKING") {
      return;
    }

    setTypeOfActionDispatched("DROP_ENQUIRY");

    if (dropReason.length === 0 || dropRemarks.length === 0) {
      showToastRedAlert("Please enter details for drop");
      return;
    }

    if (dropReason === "Lost To Co-Dealer") {
      if (
        dealerName.length === 0 ||
        location.length === 0 ||
        model.length === 0
      ) {
        showToast("please enter details");
        return;
      }
    }

    if (
      dropReason === "Lost To Competition" ||
      dropReason === "Lost To Used Car"
    ) {
      if (
        brandName.length === 0 ||
        dealerName.length === 0 ||
        location.length === 0 ||
        model.length === 0
      ) {
        showToast("please enter details");
        return;
      }
    }

    if (!selector.enquiry_details_response) {
      return;
    }

    let leadId = selector.enquiry_details_response.dmsLeadDto.id;
    if (!leadId) {
      showToast("lead id not found");
      return;
    }

    const payload = {
      dmsLeadDropInfo: {
        additionalRemarks: dropRemarks,
        branchId: userData.branchId,
        brandName: brandName,
        dealerName: dealerName,
        leadId: leadId,
        crmUniversalId: universalId,
        lostReason: dropReason,
        organizationId: userData.orgId,
        otherReason: "",
        droppedBy: userData.employeeId,
        location: location,
        model: model,
        stage: "PREBOOKING",
        status: "PREBOOKING",
      },
    };

    dispatch(dropEnquiryApi(payload));
  };

  // Handle Drop Enquiry
  useEffect(() => {
    if (selector.enquiry_drop_response_status === "success") {
      updateEnuiquiryDetails();
    } else if (selector.enquiry_drop_response_status === "failed") {
      showToastRedAlert("something went wrong");
    }
  }, [selector.enquiry_drop_response_status]);

  const proceedToPreBookingClicked = () => {
    setTypeOfActionDispatched("PROCEED_TO_PREBOOKING");
    console.log("DTLS:", selector.task_details_response?.taskId, taskId);
    if (selector.task_details_response?.taskId !== taskId) {
      return;
    }

    const newTaskObj = { ...selector.task_details_response };
    newTaskObj.taskStatus = "CLOSED";
    newTaskObj.lat = currentLocation ? currentLocation.lat.toString() : null;
    newTaskObj.lon = currentLocation ? currentLocation.long.toString() : null;
    dispatch(updateTaskApi(newTaskObj));
  };

  // Handle Update Current Task Response
  useEffect(() => {
    if (selector.update_task_response_status === "success") {
      if (identifier === "PROCEED_TO_PRE_BOOKING") {
        const endUrl = `${universalId}` + "?" + "stage=PREBOOKING";
        dispatch(changeEnquiryStatusApi(endUrl));
      } else if (identifier === "PROCEED_TO_BOOKING") {
        const endUrl = `${universalId}` + "?" + "stage=BOOKING";
        dispatch(changeEnquiryStatusApi(endUrl));
      }
    } else if (selector.update_task_response_status === "failed") {
      showToastRedAlert("something went wrong");
    }
  }, [selector.update_task_response_status]);

  // Handle Change Enquiry Status response
  useEffect(() => {
    if (selector.change_enquiry_status === "success") {
      callCustomerLeadReferenceApi();
    } else if (selector.change_enquiry_status === "failed") {
      showToastRedAlert("something went wrong");
    }
  }, [selector.change_enquiry_status]);

  const callCustomerLeadReferenceApi = async () => {
    const payload = {
      branchid: userData.branchId,
      leadstage:
        identifier === "PROCEED_TO_PRE_BOOKING" ? "PREBOOKING" : "BOOKING",
      orgid: userData.orgId,
    };
    const url = URL.CUSTOMER_LEAD_REFERENCE();

    await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken,
      },
      method: "POST",
      body: JSON.stringify(payload),
    })
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

  const updateEnuiquiryDetails = (refNumber) => {
    if (!selector.enquiry_details_response) {
      return;
    }

    let enquiryDetailsObj = { ...selector.enquiry_details_response };
    let dmsLeadDto = { ...enquiryDetailsObj.dmsLeadDto };
    if (typeOfActionDispatched === "DROP_ENQUIRY") {
      dmsLeadDto.leadStage = "DROPPED";
    } else if (
      typeOfActionDispatched === "PROCEED_TO_PREBOOKING" &&
      identifier === "PROCEED_TO_PRE_BOOKING"
    ) {
      dmsLeadDto.leadStatus = "ENQUIRYCOMPLETED";
      dmsLeadDto.leadStage = "PREBOOKING";
      dmsLeadDto.referencenumber = refNumber;
    } else if (
      typeOfActionDispatched === "PROCEED_TO_PREBOOKING" &&
      identifier === "PROCEED_TO_BOOKING"
    ) {
      dmsLeadDto.leadStage = "BOOKING";
      dmsLeadDto.referencenumber = refNumber;
    }
    enquiryDetailsObj.dmsLeadDto = dmsLeadDto;
    dispatch(updateEnquiryDetailsApi(enquiryDetailsObj));
  };

  // Handle Enquiry Update response
  useEffect(() => {
    if (
      selector.update_enquiry_details_response_status === "success" &&
      selector.update_enquiry_details_response
    ) {
      if (typeOfActionDispatched === "DROP_ENQUIRY") {
        showToastSucess("Successfully Enquiry Dropped");
        goToParentScreen();
      } else if (
        typeOfActionDispatched === "PROCEED_TO_PREBOOKING" &&
        identifier === "PROCEED_TO_PRE_BOOKING"
      ) {
        displayCreateEnquiryAlert();
      } else if (
        typeOfActionDispatched === "PROCEED_TO_PREBOOKING" &&
        identifier === "PROCEED_TO_BOOKING"
      ) {
        displayCreateEnquiryAlert();
      }
    } else if (selector.update_enquiry_details_response_status === "failed") {
      showToastRedAlert("something went wrong");
    }
  }, [
    selector.update_enquiry_details_response_status,
    selector.update_enquiry_details_response,
  ]);

  displayCreateEnquiryAlert = () => {
    let refNumber = "";
    if (
      selector.update_enquiry_details_response &&
      identifier != "PROCEED_TO_BOOKING"
    ) {
      refNumber =
        selector.update_enquiry_details_response.dmsLeadDto.referencenumber;
    }
    let title =
      identifier === "PROCEED_TO_BOOKING"
        ? "Booking Created Successfully"
        : "Pre Booking Created Successfully";

    Alert.alert(
      title,
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
    if (identifier === "PROCEED_TO_PRE_BOOKING") {
      getMyTasksListFromServer();
    }
    else if (identifier === "PROCEED_TO_BOOKING") {
      console.log("INSIDE ", identifier);
      navigation.navigate(EmsTopTabNavigatorIdentifiers.booking)
    }
    else{
      navigation.popToTop();
    }
    dispatch(clearState());
  };

  const showDropDownMethod = (key, title) => {
    switch (key) {
      case "DROP_REASON":
        setDataForDropDown([...selector.drop_reasons_list]);
        break;
      case "DROP_SUB_REASON":
        setDataForDropDown([...selector.drop_sub_reasons_list]);
        break;
      default:
        break;
    }

    setDropDownKey(key);
    setDropDownTitle(title);
    setShowDropDownModel(true);
  };

  if (taskStatus === "CANCELLED") {
    return (
      <SafeAreaView style={[styles.cancelContainer]}>
        <Text style={styles.cancelText}>{"This task has been cancelled"}</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        flexDirection: "column",
      }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      enabled
      keyboardVerticalOffset={100}
    >
      <SafeAreaView style={[styles.container]}>
        <DropDownComponant
          visible={showDropDownModel}
          headerTitle={dropDownTitle}
          data={dataForDropDown}
          onRequestClose={() => setShowDropDownModel(false)}
          selectedItems={(item) => {
            setShowDropDownModel(false);
            if (dropDownKey === "DROP_REASON") {
              const payload = {
                bu: userData.orgId,
                dropdownType:
                  identifier == "PROCEED_TO_BOOKING"
                    ? "PreBook_Lost_Com_Sub_Reas"
                    : "PreEnq_Lost_Com_Sub_Reas",
                parentId: item.id,
              };
              dispatch(getDropSubReasonDataApi(payload));
              setDropReason(item.name);
            }
            if (dropDownKey === "DROP_SUB_REASON") {
              setDropSubReason(item.name);
            }
          }}
        />

        <View style={{ padding: 15 }}>
          {isDropSelected && (
            <View
              style={[GlobalStyle.shadow, { backgroundColor: Colors.WHITE }]}
            >
              <DropDownSelectionItem
                label={"Drop Reason"}
                value={dropReason}
                onPress={() =>
                  showDropDownMethod("DROP_REASON", "Select Drop Reason")
                }
              />

              <DropDownSelectionItem
                label={"Drop Sub Reason"}
                value={dropSubReason}
                onPress={() =>
                  showDropDownMethod(
                    "DROP_SUB_REASON",
                    "Select Drop Sub Reason"
                  )
                }
              />

              {FirstDependencyArray.includes(dropReason) && (
                <View>
                  <TextinputComp
                    style={styles.textInputStyle}
                    label={"Brand Name"}
                    value={brandName}
                    onChangeText={(text) => setBrandName(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                </View>
              )}

              {SecondDependencyArray.includes(dropReason) && (
                <View>
                  <TextinputComp
                    style={styles.textInputStyle}
                    label={"Dealer Name"}
                    value={dealerName}
                    onChangeText={(text) => setDealerName(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={styles.textInputStyle}
                    label={"Location"}
                    value={location}
                    onChangeText={(text) => setLocation(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                </View>
              )}

              {FirstDependencyArray.includes(dropReason) && (
                <View>
                  <TextinputComp
                    style={styles.textInputStyle}
                    label={"Model"}
                    value={model}
                    onChangeText={(text) => setModel(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                </View>
              )}

              <TextinputComp
                style={styles.textInputStyle}
                label={"Remarks"}
                keyboardType={"default"}
                value={dropRemarks}
                onChangeText={(text) => setDropRemarks(text)}
              />
              <Text style={GlobalStyle.underline}></Text>
            </View>
          )}
        </View>

        {!isDropSelected && (
          <View style={styles.view1}>
            <Button
              mode="contained"
              color={Colors.RED}
              labelStyle={{ textTransform: "none" }}
              // disabled={selector.isLoading}
              onPress={() => setIsDropSelected(true)}
            >
              Drop
            </Button>
            <Button
              mode="contained"
              color={Colors.RED}
              labelStyle={{ textTransform: "none" }}
              // disabled={selector.isLoading}
              onPress={proceedToPreBookingClicked}
            >
              {identifier === "PROCEED_TO_BOOKING"
                ? "Proceed To Booking"
                : "Proceed To PreBooking"}
            </Button>
          </View>
        )}
        {isDropSelected && (
          <View style={styles.view1}>
            <Button
              mode="contained"
              color={Colors.RED}
              labelStyle={{ textTransform: "none" }}
              // disabled={selector.isLoading}
              onPress={proceedToCancellation}
            >
              Proceed To Cancellation
            </Button>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ProceedToBookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputStyle: {
    height: 65,
    width: "100%",
  },
  view1: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  cancelContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.RED,
  },
});
