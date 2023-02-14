import { ScrollView, StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { Checkbox, List, Button, IconButton, } from "react-native-paper";
import { Colors, GlobalStyle } from '../../../styles';
import { DatePickerComponent, DropDownComponant, TextinputComp } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerDetails, updateSelectedDate,clearState,setDatePicker,} from '../../../redux/complaintTrackerReducer';
import { DateSelectItem, DropDownSelectionItem } from '../../../pureComponents';
import { UserState } from 'realm';
import moment from 'moment';

const dateFormat = "DD/MM/YYYY";
const currentDate = moment().add(0, "day").format(dateFormat)
const AddEditComplaint = () => {
    const [openAccordian, setOpenAccordian] = useState(0);
    const selector = useSelector((state) => state.complaintTrackerReducer);
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [complaintDate,  setcomplaintDate] = useState("")
    const [dataForDropDown, setDataForDropDown] = useState([]);
    const [dropDownKey, setDropDownKey] = useState("");
    const [showDropDownModel, setShowDropDownModel] = useState(false);
 
    const [dropDownTitle, setDropDownTitle] = useState("Select Data");
    const updateAccordian = (selectedIndex) => {
        if (selectedIndex != openAccordian) {
            setOpenAccordian(selectedIndex);
        } else {
            setOpenAccordian(0);
        }
    };

    const updateSelectedDate = (date, key) => {

        const formatDate = moment(date).format(dateFormat);
        switch (key) {
            case "COMPLAINT_DATE":
                setcomplaintDate(formatDate);
                break;
           
        }
    }
    const showDropDownModelMethod = (key, headerText, oid) => {
        Keyboard.dismiss();
        switch (key) {
            case "CAR_MODEL":
                setDataForDropDown([...dataForCarModels]);
                break;
           
        }
        setDropDownKey(key);
        setDropDownTitle(headerText);
        setShowDropDownModel(true);
    };


  return (
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
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
              paddingVertical: 10,
              paddingHorizontal: 15,
          }}
          keyboardShouldPersistTaps={"handled"}
          style={{ flex: 1 ,}}
          
    >

          <DropDownComponant
              visible={showDropDownModel}
              headerTitle={dropDownTitle}
              data={dataForDropDown}
              onRequestClose={() => setShowDropDownModel(false)}
              selectedItems={(item) => {
                  if (dropDownKey === "SOURCE_OF_ENQUIRY") {
                      setSelectedEventData([]);
                      if (item.name === "Events") {
                          const startOfMonth = moment()
                              .startOf("month")
                              .format("YYYY-MM-DD");
                          const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
                          getEventConfigListFromServer(startOfMonth, endOfMonth);
                          // setisEventListModalVisible(true);
                      }
                      if (item.name === "Event") {
                          getEventListFromServer();
                      }
                      updateSubSourceData(item);
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
              }}
          />

          <DatePickerComponent
              visible={showDatePicker}
              mode={"date"}
            //   maximumDate={new Date(currentDate.toString())}
              value={new Date()}
              onChange={(event, selectedDate) => {

                  setShowDatePicker(false);
                  if (Platform.OS === "android") {
                      if (selectedDate) {
                          updateSelectedDate(selectedDate, "COMPLAINT_DATE");
                      }
                  } else {
                      updateSelectedDate(selectedDate, "COMPLAINT_DATE");
                  }
              }}
              onRequestClose={() => setShowDatePicker(false)}
          />
          <View style={{backgroundColor:Colors.WHITE}}>

          
          <List.AccordionGroup
              expandedId={openAccordian}
              onAccordionPress={(expandedId) => updateAccordian(expandedId)}
          >
              {/* // 1.Customer Details */}
              <List.Accordion
                  id={"1"}
                  title={"Register a Complaint"}
                  titleStyle={{
                      color: openAccordian === "1" ? Colors.BLACK : Colors.BLACK,
                      fontSize: 16,
                      fontWeight: "600",
                  }}
                  style={[
                      {
                          backgroundColor:
                              openAccordian === "1" ? Colors.RED : Colors.WHITE,
                      },
                      styles.accordianBorder,
                  ]}
              >
                  <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.mobile}
                      keyboardType={"number-pad"}
                      // editable={false}
                      disabled={false}
                      label={"Mobile Number*"}
                      onChangeText={(text) =>
                          dispatch(
                              setCustomerDetails({ key: "MOBILE", text: text.replace(/[^0-9]/g, ''), })
                          )
                      }
                      showRightIcon={true}
                      rightIconObj={{ name:"magnify" , color: Colors.GRAY }}
                      onRightIconPressed={()=>{
                        // todo API call here for phone APi
                      }}
                    />
                  <Text style={GlobalStyle.underline}></Text>
                <View style={{ flexDirection:"row",width:'100%',justifyContent:"space-between"}}>
                    <View style={{width: '40%'}}>
                          <DateSelectItem
                              label={"Complaint Date"}
                              value={complaintDate}
                              disabled={false}
                              onPress={() => {
                                  setShowDatePicker(true)
                              }}
                          />
                    </View>
                      
                      <View style={{ width: '40%' }}>

                              <TextinputComp
                                  style={styles.textInputStyle}
                                  value={selector.location}
                                //   keyboardType={}
                                  // editable={false}
                                  disabled={false}
                                  label={"Location"}
                                  onChangeText={(text) =>
                                      dispatch(
                                          setCustomerDetails({ key: "LOCATION", text: text })
                                      )
                                  }
                                  showRightIcon={false}
                                  
                              />
                              {/* <DropDownSelectionItem
                                  label={"Model*"}
                                  value={selector.carModel}
                                  onPress={() =>
                                      showDropDownModelMethod("CAR_MODEL", "Select Model")
                                  }
                              /> */}
                      </View>

                </View>

                      <View style={{ flexDirection: "row", width: '100%', justifyContent: "space-between" }}>
                          <View style={{ width: '40%' }}>
                              <TextinputComp
                                  style={styles.textInputStyle}
                                  value={selector.branch}
                                  //   keyboardType={"number-pad"}
                                  // editable={false}
                                  disabled={false}
                                  label={"Branch"}
                                  onChangeText={(text) =>
                                      dispatch(
                                          setCustomerDetails({ key: "BRANCH", text: text })
                                      )
                                  }
                                  showRightIcon={false}
                              />
                          </View>
                          <View style={{ width: '40%' }}>
                              <TextinputComp
                                  style={styles.textInputStyle}
                                  value={selector.model}
                                  //   keyboardType={"number-pad"}
                                  // editable={false}
                                  disabled={false}
                                  label={"Model"}
                                  onChangeText={(text) =>
                                      dispatch(
                                          setCustomerDetails({ key: "MODEL", text: text })
                                      )
                                  }
                                  showRightIcon={false}
                              />
                          </View>
                      </View>

                      <TextinputComp
                          style={styles.textInputStyle}
                          value={selector.customerName}
                          //   keyboardType={"number-pad"}
                          // editable={false}
                          disabled={false}
                          label={"Customer Name"}
                          onChangeText={(text) =>
                              dispatch(
                                  setCustomerDetails({ key: "COUSTOMER_NAME", text: text })
                              )
                          }
                          showRightIcon={false}

                      />

                      <TextinputComp
                          style={styles.textInputStyle}
                          value={selector.email}
                          //   keyboardType={"number-pad"}
                          // editable={false}
                          disabled={false}
                          label={"Email"}
                          onChangeText={(text) =>
                              dispatch(
                                  setCustomerDetails({ key: "EMAIL", text: text })
                              )
                          }
                          showRightIcon={false}

                      />

                      <View style={{ flexDirection: "row", width: '100%', justifyContent: "space-between" }}>
                          <View style={{ width: '50%' }}>
                              <TextinputComp
                                  style={styles.textInputStyle}
                                  value={selector.stage}
                                  //   keyboardType={"number-pad"}
                                  // editable={false}
                                  disabled={false}
                                  label={"Stage"}
                                  onChangeText={(text) =>
                                      dispatch(
                                          setCustomerDetails({ key: "STAGE", text: text })
                                      )
                                  }
                                  showRightIcon={false}
                              />
                          </View>
                          <View style={{ width: '50%' }}>
                              <TextinputComp
                                  style={styles.textInputStyle}
                                  value={selector.stage_id}
                                  //   keyboardType={"number-pad"}
                                  // editable={false}
                                  disabled={false}
                                  label={"Stage ID"}
                                  onChangeText={(text) =>
                                      dispatch(
                                          setCustomerDetails({ key: "STAGE_ID", text: text })
                                      )
                                  }
                                  showRightIcon={false}
                              />
                          </View>
                      </View>

                      <View style={{ flexDirection: "row", width: '100%', justifyContent: "space-between" }}>
                          <View style={{ width: '50%' }}>
                              <TextinputComp
                                  style={styles.textInputStyle}
                                  value={selector.consultant}
                                  //   keyboardType={"number-pad"}
                                  // editable={false}
                                  disabled={false}
                                  label={"Consultant*"}
                                  onChangeText={(text) =>
                                      dispatch(
                                          setCustomerDetails({ key: "CONSULTANT", text: text })
                                      )
                                  }
                                  showRightIcon={false}
                              />
                          </View>
                          <View style={{ width: '50%' }}>
                              <TextinputComp
                                  style={styles.textInputStyle}
                                  value={selector.reporting_manager}
                                  //   keyboardType={"number-pad"}
                                  // editable={false}
                                  disabled={false}
                                  label={"Reporting Manager"}
                                  onChangeText={(text) =>
                                      dispatch(
                                          setCustomerDetails({ key: "REPORTING_MANAGER", text: text })
                                      )
                                  }
                                  showRightIcon={false}
                              />
                          </View>
                      </View>
                      
              </List.Accordion>
              </List.AccordionGroup>

              
          </View>
    </ScrollView>
      </KeyboardAvoidingView>
  )
}

export default AddEditComplaint

const styles = StyleSheet.create({
    textInputStyle: {
        height: 50,
        width: "100%",
    },
})