import { Pressable, SafeAreaView, StyleSheet, Text, View, RefreshControl, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DatePickerComponent, DateRangeComp } from '../../../components';
import moment from 'moment';
import { IconButton } from 'react-native-paper';
import { Colors } from '../../../styles';
import { MyTaskNewItem } from '../MyTasks/components/MyTasksNewItem';
import { ComplintLidtItem } from './ComplintLidtItem';


const dateFormat = "YYYY-MM-DD";
const currentDate = moment().add(0, "day").format(dateFormat)
const data = [{
        id:0,
        name:"manthan",
        factoryType:"car servvice",
        consultant:"churan",
        mobileNo:"9978948079",
        model:"Jeep compas"
}]

const ComplaintList = (props) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerId, setDatePickerId] = useState("");
    const [selectedFromDate, setSelectedFromDate] = useState("");
    const [selectedToDate, setSelectedToDate] = useState("");

    const fromDateRef = React.useRef(selectedFromDate);
    const toDateRef = React.useRef(selectedToDate);
    const [userData, setUserData] = useState({
        orgId: "",
        employeeId: "",
        employeeName: "",
        isManager: false,
        editEnable: false,
        isPreBookingApprover: false,
        isSelfManager: "",
        isCRM: false,
        isCRE: false,
    });
    useEffect(() => {
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().add(0, "day").format(dateFormat)
        const CurrentMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        const currentMonthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
        setFromDateState(CurrentMonthFirstDate);
        setToDateState(currentMonthLastDate);

    }, [])

    const setFromDateState = date => {
        fromDateRef.current = date;
        setSelectedFromDate(date);
    }

    const setToDateState = date => {
        toDateRef.current = date;
        setSelectedToDate(date);
    }

    const showDatePickerMethod = (key) => {
        setShowDatePicker(true);
        setDatePickerId(key);
    }



    const updateSelectedDate = (date, key) => {

        const formatDate = moment(date).format(dateFormat);
        switch (key) {
            case "FROM_DATE":
                setFromDateState(formatDate);
                break;
            case "TO_DATE":
                setToDateState(formatDate);
                break;
        }
    }
    const getFirstLetterUpperCase = (name) => {
        return name?.charAt(0).toUpperCase() + name?.slice(1);
    };

    const getUserData = async () => {
        try {
            const employeeData = await AsyncStore.getData(
                AsyncStore.Keys.LOGIN_EMPLOYEE
            );

            if (employeeData) {
                const jsonObj = JSON.parse(employeeData);

                let isManager = false,
                    editEnable = false, isCRE, isCRM;
                let isPreBookingApprover = false;
                if (
                    jsonObj.hrmsRole === "MD" ||
                    jsonObj.hrmsRole === "General Manager" ||
                    jsonObj.hrmsRole === "Manager" ||
                    jsonObj.hrmsRole === "Sales Manager" ||
                    jsonObj.hrmsRole === "branch manager"
                ) {
                    isManager = true;
                }
                if (jsonObj.roles.includes("PreBooking Approver")) {

                    editEnable = true;
                    isPreBookingApprover = true;
                }

                if (
                    jsonObj.hrmsRole === "CRE"

                ) {
                    isCRE = true;
                }

                if (
                    jsonObj.hrmsRole === "CRM"

                ) {
                    isCRM = true;
                }


                setUserData({
                    orgId: jsonObj.orgId,
                    employeeId: jsonObj.empId,
                    employeeName: jsonObj.empName,
                    isManager: isManager,
                    editEnable: editEnable,
                    isPreBookingApprover: isPreBookingApprover,
                    isSelfManager: jsonObj.isSelfManager,
                    isCRM: isCRM,
                    isCRE: isCRE,
                });
                let payload = {
                    empId: jsonObj.empId
                }

               
            }
        } catch (error) {
            alert(error);
        }
    };



    const renderItem = ({ item, index }) => {
        return (
            <>
                <View>
                    <ComplintLidtItem
                        tdflage={item?.tdflage ? item.tdflage : ""}
                        from={item.leadStage}
                        name={
                            getFirstLetterUpperCase(item.firstName) +
                            " " +
                            getFirstLetterUpperCase(item.lastName)
                        }
                        navigator={props.navigation}
                        uniqueId={item.leadId}
                        type={
                            item.leadStage === "ENQUIRY"
                                ? "Enq"
                                : item.leadStage === "BOOKING"
                                    ? "Book"
                                    : "PreBook"
                        }
                        status={""}
                        created={item.modifiedDate}
                        dmsLead={item.salesConsultant}
                        phone={item.phone}
                        source={item.enquirySource}
                        model={item.model}
                        leadStatus={item.leadStatus}
                        leadStage={item.leadStage}
                        needStatus={"YES"}
                        // stageAccess={stageAccess}
                        onlylead={true}
                        userData={userData.hrmsRole}
                        EmployeesRoles={""}
                        enqCat={item.enquiryCategory}
                        onItemPress={() => {
                            props.navigation.navigate(AppNavigator.EmsStackIdentifiers.task360, {
                                universalId: item.universalId,
                                mobileNo: item.phone,
                                leadStatus: item.leadStatus,
                            });
                        }}
                        onDocPress={() => {
                            let user = userData.hrmsRole.toLowerCase();
                            if (EmployeesRoles.includes(user)) {
                                if (stageAccess[0]?.viewStage?.includes(item.leadStage)) {
                                    let route = AppNavigator.EmsStackIdentifiers.detailsOverview;
                                    switch (item.leadStage) {
                                        case "BOOKING":
                                            route = AppNavigator.EmsStackIdentifiers.bookingForm;
                                            break;
                                        case "PRE_BOOKING":
                                        case "PREBOOKING":
                                            route = AppNavigator.EmsStackIdentifiers.preBookingForm;
                                            break;
                                    }
                                    props.navigation.navigate(route, {
                                        universalId: item.universalId,
                                        enqDetails: item,
                                        leadStatus: item.leadStatus,
                                        leadStage: item.leadStage,
                                    });
                                } else {
                                    alert("No Access");
                                }
                            } else {
                                let route = AppNavigator.EmsStackIdentifiers.detailsOverview;
                                switch (item.leadStage) {
                                    case "BOOKING":
                                        route = AppNavigator.EmsStackIdentifiers.bookingForm;
                                        break;
                                    case "PRE_BOOKING":
                                    case "PREBOOKING":
                                        route = AppNavigator.EmsStackIdentifiers.preBookingForm;
                                        break;
                                }
                                props.navigation.navigate(route, {
                                    universalId: item.universalId,
                                    enqDetails: item,
                                    leadStatus: item.leadStatus,
                                    leadStage: item.leadStage,
                                });
                            }
                        }}
                    />
                </View>
            </>
        );
    };


  return (
    <SafeAreaView>
          <DatePickerComponent
              visible={showDatePicker}
              mode={"date"}
              maximumDate={new Date(currentDate.toString())}
              value={new Date()}
              onChange={(event, selectedDate) => {

                  setShowDatePicker(false);
                  if (Platform.OS === "android") {
                      if (selectedDate) {
                          updateSelectedDate(selectedDate, datePickerId);
                      }
                  } else {
                      updateSelectedDate(selectedDate, datePickerId);
                  }
              }}
              onRequestClose={() => setShowDatePicker(false)}
          />

          {/* <View style={{ width: "100%" }}>
              <DateRangeComp
                  fromDate={selectedFromDate}
                  toDate={selectedToDate}
                  fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
                  toDateClicked={() => showDatePickerMethod("TO_DATE")}
              />
          </View> */}

          <View style={styles.view1}>
              <View style={{ width: "80%" }}>
                  <DateRangeComp
                      fromDate={selectedFromDate}
                      toDate={selectedToDate}
                      fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
                      toDateClicked={() => showDatePickerMethod("TO_DATE")}
                  />
              </View>
              <Pressable onPress={() => {}}>
                  <View style={styles.filterView}>
                      <Text style={styles.text1}>{"Filter"}</Text>
                      <IconButton
                          icon={"filter-outline"}
                          size={16}
                          color={Colors.RED}
                          style={{ margin: 0, padding: 0 }}
                      />
                  </View>
              </Pressable>
          </View>

          <View style={[styles.flatlistView]}>
              <FlatList
                  initialNumToRender={data?.length}
                  data={data}
                  extraData={data}
                  keyExtractor={(item, index) => index.toString()}
                  refreshControl={
                      <RefreshControl
                        //   refreshing={selector.isLoading}
                          // onRefresh={() => getEnquiryListFromServer(employeeId, selectedFromDate, selectedToDate)}
                          progressViewOffset={200}
                      />
                  }
                  showsVerticalScrollIndicator={false}
                  onEndReachedThreshold={0}
                  onEndReached={() => {
                    //   if (searchQuery === "") {
                    //       getMoreEnquiryListFromServer();
                    //   }
                  }}
                //   ListFooterComponent={renderFooter}
                  renderItem={renderItem}
              />
          </View>
 
      </SafeAreaView>
  )
}

export default ComplaintList

const styles = StyleSheet.create({
    view1: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY,
        backgroundColor: Colors.WHITE,
    },
    filterView: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: Colors.BORDER_COLOR,
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: Colors.WHITE,
        paddingLeft: 8,
        height: 50,
        justifyContent: "center",
    },
     txt1: {
        width: "80%",
        paddingHorizontal: 5,
        paddingVertical: 2,
        fontSize: 12,
        fontWeight: "600",
    },
    text1: {
        fontSize: 16,
        fontWeight: "400",
        color: Colors.RED,
    },
    flatlistView: {
        backgroundColor: Colors.LIGHT_GRAY,
        flex: 1,
        marginBottom: 10,
    },
})