import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
import { Colors } from '../../../../styles';
import { convertTimeStampToDateString, callNumber, navigatetoCallWebView } from '../../../../utils/helperFunctions';
import { Checkbox, IconButton } from "react-native-paper";
import moment from "moment";
import { AppNavigator, AuthNavigator } from "../../../../navigations";
import * as AsyncStore from '../../../../asyncStore';
import { CHECKBOX_SELECTED } from '../../../../assets/svg';




const statusBgColors = {
    CANCELLED: {
        color: Colors.RED,
        title: "Cancelled"
    },
    ASSIGNED: {
        color: Colors.GREEN,
        title: "Assigned"
    },
    SENT_FOR_APPROVAL: {
        color: Colors.YELLOW,
        title: "Sent For Approval"
    },
    RESCHEDULED: {
        color: Colors.BLUE,
        title: "Rescheduled"
    },
}

const IconComp = ({ iconName, onPress,bgColor }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            width: 35,
            height: 35,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: bgColor,
            borderRadius: 5,
          }}
        >
          <IconButton icon={iconName} color={bgColor} size={20} />
        </View>
      </TouchableOpacity>
    );
}




export const DropAnalysisItem = ({ from = "MY_TASKS", onItemSelected, leadDropId, uniqueId, enqCat, leadStage, name, status, created, dmsLead, lostReason, isManager = false, dropStatus = '', mobileNo, isCheckboxVisible, isRefresh = false, navigation }) => {
  const [isItemSelected, setisItemSelected] = useState("unchecked")
 
   
  useEffect(() => {
  
    if(isRefresh){
      setisItemSelected('unchecked')
    }  
  
  }, [isRefresh])
  
  
    const checkboxSelected = async () => {
        try
        {
            if (isItemSelected === 'unchecked')
            {
                onItemSelected(uniqueId, leadDropId,'multi','add')
                await setisItemSelected('checked')

            } else
            {
                onItemSelected(uniqueId, leadDropId, 'multi', 'delete')
               await setisItemSelected('unchecked')
            }
        }catch(error){
            alert(error)
        }


    }

    let date = "";
    if (from == "MY_TASKS") {
        date = moment(created, "YYYY-MM-DD hh-mm-s").format("DD/MM/YYYY h:mm a");
    } else {
        date = convertTimeStampToDateString(created);
    }

    let bgColor = Colors.BLUE;
    let statusName = status;
    if (status === "CANCELLED" || status === "ASSIGNED" || status === "SENT_FOR_APPROVAL" || status === "RESCHEDULED") {
        bgColor = statusBgColors[status].color;
        statusName = statusBgColors[status].title;
    }

    function checkForStageName(taskName) {
        if (taskName?.toLowerCase() === 'preenquiry') {
            taskName = 'CONTACTS';
        } else if (taskName?.toLowerCase() === 'prebooking') {
            taskName = 'Booking Approval';
        }
        // else if (taskName.includes('Booking')) {
        //     taskName = taskName.replace('Booking', 'Booking View');
        // }
        return taskName
    }

    return (
    <View style={{flexDirection:"row",alignItems:"center"}}>
        <TouchableOpacity style={styles.section} >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
            }}
          >
            {true && (
              <View
                style={styles.btn3}

              >
                <Text style={styles.txt7}>3</Text>
              </View>
            )}
            <View style={{ width: "60%" }}>

              {isManager && isCheckboxVisible &&
                <Checkbox.Android
                  onPress={() => {
                    checkboxSelected()
                  }}
                  status={isItemSelected}
                  color={Colors.YELLOW}
                  uncheckedColor={Colors.YELLOW} />}

              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <View style={{ maxWidth: "73%" }}>

                  <Text style={styles.text1}>{name}</Text>
                </View>
                <Text style={styles.catText}>{enqCat}</Text>
              </View>
              <Text style={styles.text2}>{lostReason + " - " + dmsLead}</Text>
              <Text style={styles.text2}>{mobileNo}</Text>
              <Text style={styles.text3}>{date}</Text>
              {/* {needStatus === "YES" &&
                        <View style={{ height: 15, width: 15, borderRadius: 10, backgroundColor: leadStatus === 'PREENQUIRYCOMPLETED' || (leadStatus === 'ENQUIRYCOMPLETED' && leadStage === 'ENQUIRY') || (leadStatus === 'PREBOOKINGCOMPLETED' && leadStage === 'PREBOOKING') || leadStatus === 'BOOKINGCOMPLETED' ? '#18a835' : '#f29a22', position: 'absolute', top: 0, right: 0 }}></View>
                    } */}
            </View>
            <View style={{ width: "30%", alignItems: "center" }}>
              <View style={styles.modal}>
                <Text style={styles.text4}>{checkForStageName(leadStage)}</Text>
              </View>
              {/* <View style={{ height: 8 }}></View> */}
              {/* {isManager && dropStatus === "DROPPED" && (
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                  <IconComp
                    iconName={"window-close"}
                    onPress={() =>
                      onItemSelected(uniqueId, leadDropId, "single", "reject")
                    }
                    bgColor={Colors.RED}
                  />
                  <Text style={{ color: Colors.RED, fontSize: 11, margin: 2 }}>
                    Deny
                  </Text>
                </View>
                <View style={{ flexDirection: "column", alignItems: "center", marginLeft: 7 }}>
                  <IconComp
                    iconName={"check"}
                    onPress={() =>
                      onItemSelected(uniqueId, leadDropId, "single", "approve")
                    }
                    bgColor="#008000"
                  />
                  <Text style={{ color: "#008000", fontSize: 11, margin: 2 }}>
                    Approve
                  </Text>
                </View>
              </View>
            )} */}

              {/*{(!isManager || (isManager && dropStatus === 'REJECTED')) &&*/}
              {/*    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-evenly" }}>*/}
              {/*    <Text style={{ color: dropStatus === 'DROPPED' ? '#18a835' : '#f29a22', fontSize: 16, fontWeight: 'bold'}}>{dropStatus}</Text>*/}
              {/*    </View>*/}
              {/*}*/}
              {/* {!isManager && ( */}
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-evenly",
                }}
              >
                <Text
                  style={{
                    color: dropStatus === "DROPPED" ? "#18a835" : Colors.YELLOW,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  {dropStatus}
                </Text>
              </View>
              {/* )} */}
            </View>
          </View>
        </TouchableOpacity>
        {true ? (
          <TouchableOpacity
          style={{flex:1}}
            onPress={() =>
              navigation.navigate(
                "DROP_ANALYSIS_HISTORY",
                {
                  
                  title: dropStatus,
                  universalId:uniqueId,
                }
              )
            }
          >
            <Image
              source={require("./../../../../assets/images/dots.png")}
              resizeMode="contain"
              style={styles.dotContainer}
            />
          </TouchableOpacity>
        ) : null}
    </View>
    );
}

const styles = StyleSheet.create({
    text1: {
        color: Colors.BLACK,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 5
    },
    text2: {
        color: Colors.BLACK,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        marginLeft: 10
    },
    text3: {
        color: Colors.DARK_GRAY,
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 10
    },
    text4: {
        color: Colors.WHITE,
        fontSize: 9,
        fontWeight: "bold",
        // textAlign: "center",
        // paddingHorizontal: 5
    },
    section: {
        // flex: 1,
        // padding: 5,
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 8,
        elevation: 3,
        marginHorizontal: 5,
        marginVertical: 6,
        width:'90%'
    },
    modal: {
        backgroundColor: Colors.RED,
        borderRadius: 4,
        width: "100%",
        height: 22,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10
    },
    catText: {
        color: "#7b79f6",
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 5,
        marginLeft: 5,
        textTransform: 'uppercase'
    },
  txt7: { fontSize: 16, fontWeight: "500", color: Colors.RED },
  btn3: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 5,
    // backgroundColor:Colors.PINK,  
    alignSelf: "flex-end",
    alignSelf:"flex-start",
    marginBottom: -5
    // marginEnd:10

  },
  dotContainer: {
    height: 45,
    width: 25,
  },
})
