import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from "react-native";
import { Colors } from '../../../../styles';
import { useDispatch, useSelector } from 'react-redux';
import { DropDownServices } from '../../../../pureComponents/dropDownServices';
import { ENQ_DEPT_LIST } from '../../../../jsonData/servicesJsonData';
import { DropDownComponant, LoaderComponent } from '../../../../components';
import { clearStateData, closeQuery, createQuery, setDropDownData, setInputInfo, updateQuery } from '../../../../redux/queryCrudReducer';
import { PURPOSE_ENQ_LIST } from '../../../../jsonData/servicesJsonData';
import { TextInputServices } from '../../../../components/textInputServices';
import { showToast, showToastRedAlert } from '../../../../utils/toast';

const CreateQuery = ({ navigation, route }) => {
  const {
    vehicleRegNumber,
    isRefreshList,
    customerDetail,
    currentUserData,
    fromType,
    existingQueryData,
  } = route.params;
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.queryCrudReducer);
  let scrollRef = useRef(null);

  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [isSubmitPress, setIsSubmitPress] = useState(false);

  useEffect(() => {
    if (fromType == "editQuery") {
      setExistingData();
    }
    return () => {
      dispatch(clearStateData());
      clearLocalData();
    };
  }, []);

  const setExistingData = () => {
    dispatch(
      setDropDownData({
        key: "ENQ_DEPT",
        value: existingQueryData.customerQueryEnquiryDepartment,
      })
    );
    dispatch(
      setDropDownData({
        key: "PURPOSE_OF_ENQ",
        value: existingQueryData.customerQueryEnquiryPurpose,
      })
    );
    dispatch(
      setInputInfo({ key: "CUSTOMER_REMARKS", text: existingQueryData.query })
    );
    dispatch(
      setInputInfo({ key: "CRM_REMARKS", text: existingQueryData.creRemarks })
    );
  };

  useEffect(() => {
    if (selector.enqDept && PURPOSE_ENQ_LIST.length > 0) {
      let tmpArr = [];
      for (let i = 0; i < PURPOSE_ENQ_LIST.length; i++) {
        if (PURPOSE_ENQ_LIST[i].parent == selector.enqDept) {
          tmpArr.push(PURPOSE_ENQ_LIST[i]);
        }
      }
      dispatch(
        setDropDownData({
          key: "PURPOSE_ENQ_LIST",
          value: tmpArr,
        })
      );
    }
  }, [selector.enqDept])
  

  const clearLocalData = () => {
    setDataForDropDown([]);
    setDropDownKey("");
    setDropDownTitle("Select Data");
    setShowDropDownModel(false);
    setIsSubmitPress(false);
  };

  useEffect(() => {
    if (selector.createQueryResponseStatus == "success") {
      showToastRedAlert("Query Created Successfully");
      isRefreshList();
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    }
  }, [selector.createQueryResponseStatus]);
  
  useEffect(() => {
    if (selector.updateQueryResponseStatus == "success") {
      showToastRedAlert("Query Updated Successfully");
      isRefreshList();
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    }
  }, [selector.createQueryResponseStatus]);
  
  useEffect(() => {
    if (selector.closeQueryResponseStatus == "success") {
      showToastRedAlert("Query Closed Successfully");
      isRefreshList();
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    }
  }, [selector.createQueryResponseStatus]);

  const onDropDownClear = (key) => {
    if (key) {
      dispatch(setDropDownData({ key: key, value: "", id: "" }));
    }
  };

  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();
    switch (key) {
      case "ENQ_DEPT":
        setDataForDropDown([...ENQ_DEPT_LIST]);
        break;
      case "PURPOSE_OF_ENQ":
        setDataForDropDown([...selector.purposeOfEnqResponse]);
        break;
      default:
        setDataForDropDown([]);
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  const submit = (type = "create") => {
    setIsSubmitPress(true);
    if (!selector.enqDept) {
      showToast("Please Select Enquiry Dept");
      return;
    }

    if (!selector.purposeOfEnq) {
      showToast("Please Select Purpose Of Enquiry");
      return;
    }

    if (!selector.customerRemarks) {
      showToast("Please Select Customer Remarks");
      return;
    }

    if (!selector.crmRemarks) {
      showToast("Please Select CRM Remarks");
      return;
    }

    let payload = {
      tenantId: currentUserData?.branchId,
      queryData: {
        assignedTo: currentUserData?.empId,
        createdBy: currentUserData?.empId,
        customerId: customerDetail?.id,
        modifiedBy: currentUserData?.empId,
        enquiryDepartment: selector.enqDept,
        purpose: selector.purposeOfEnq,
        query: selector.customerRemarks,
        crmRemarks: selector.crmRemarks,
        vehicleRegNumber: vehicleRegNumber,
      },
    };
    if (type == "update") {
      payload.queryId = existingQueryData.id;
      payload.queryData.status = "OPEN";
      dispatch(updateQuery(payload));
    } else if (type == "close") {
      payload.queryId = existingQueryData.id;
      payload.queryData.status = "CLOSED";
      dispatch(closeQuery(payload));
    } else {
      dispatch(createQuery(payload));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          keyboardShouldPersistTaps={"handled"}
          style={{ flex: 1 }}
          ref={scrollRef}
        >
          <DropDownComponant
            visible={showDropDownModel}
            headerTitle={dropDownTitle}
            data={dataForDropDown}
            onRequestClose={() => setShowDropDownModel(false)}
            selectedItems={(item) => {
              setShowDropDownModel(false);
              dispatch(
                setDropDownData({
                  key: dropDownKey,
                  value: item.name,
                })
              );
            }}
          />

          <DropDownServices
            label={"Enquiry Dept*"}
            value={selector.enqDept}
            onPress={() =>
              showDropDownModelMethod("ENQ_DEPT", "Select Enquiry Dept")
            }
            clearOption={true}
            clearKey={"ENQ_DEPT"}
            onClear={onDropDownClear}
            error={isSubmitPress && selector.enqDept === ""}
          />
          <DropDownServices
            label={"Purpose Of Enquiry*"}
            value={selector.purposeOfEnq}
            onPress={() =>
              showDropDownModelMethod(
                "PURPOSE_OF_ENQ",
                "Select Purpose Of Enquiry"
              )
            }
            clearOption={true}
            clearKey={"PURPOSE_OF_ENQ"}
            onClear={onDropDownClear}
            error={isSubmitPress && selector.purposeOfEnq === ""}
          />
          <TextInputServices
            value={selector.customerRemarks}
            label={"Customer Remarks*"}
            autoCapitalize="words"
            onChangeText={(text) =>
              dispatch(
                setInputInfo({
                  key: "CUSTOMER_REMARKS",
                  text: text,
                })
              )
            }
            error={isSubmitPress && selector.customerRemarks.trim() === ""}
          />
          <TextInputServices
            value={selector.crmRemarks}
            label={"CRM Remarks*"}
            autoCapitalize="words"
            onChangeText={(text) =>
              dispatch(
                setInputInfo({
                  key: "CRM_REMARKS",
                  text: text,
                })
              )
            }
            error={isSubmitPress && selector.crmRemarks.trim() === ""}
          />

          {fromType == "createQuery" && (
            <View style={styles.buttonListRow}>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.btnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={() => submit("create")}
              >
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}

          {fromType == "editQuery" &&
            existingQueryData?.customerQueryEnquiryStatus == "OPEN" && (
              <View style={styles.buttonListRow}>
                <TouchableOpacity
                  style={styles.btnContainer}
                  onPress={() => submit("close")}
                >
                  <Text style={styles.btnText}>Close Query</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnContainer}
                  onPress={() => submit("update")}
                >
                  <Text style={styles.btnText}>Update</Text>
                </TouchableOpacity>
              </View>
            )}
        </ScrollView>
      </KeyboardAvoidingView>
      <LoaderComponent visible={selector.isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.WHITE,
  },
  buttonListRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 10,
  },
  btnContainer: {
    width: "40%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: Colors.PINK,
    height: 45,
  },
  btnText: {
    color: Colors.WHITE,
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default CreateQuery;