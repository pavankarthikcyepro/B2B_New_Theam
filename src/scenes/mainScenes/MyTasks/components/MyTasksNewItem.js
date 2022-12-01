import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../../../styles';
import { convertTimeStampToDateString, callNumber, navigatetoCallWebView } from '../../../../utils/helperFunctions';
import { IconButton } from "react-native-paper";
import moment from "moment";
import { AppNavigator, AuthNavigator } from "../../../../navigations";
import * as AsyncStore from '../../../../asyncStore';
import {showToastRedAlert} from "../../../../utils/toast";


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

const IconComp = ({ iconName, onPress, opacity = 1 }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ width: 32, height: 32, justifyContent: "center", alignItems: "center", borderWidth: 1,
                borderColor: "#002C5F", borderRadius: 5, opacity }}>
                <IconButton
                    icon={iconName}
                    color={Colors.GREEN}
                    size={17}
                />
            </View>
        </TouchableOpacity>
    )
}

const callWebViewRecord = async ({ navigator, phone, uniqueId, type }) => {
    try {
        let extensionId = await AsyncStore.getData(AsyncStore.Keys.EXTENSION_ID);
        var password = await AsyncStore.getData(AsyncStore.Keys.EXTENSSION_PWD);
        password = await encodeURIComponent(password)
        var uri = 'https://ardemoiipl.s3.ap-south-1.amazonaws.com/call/webphone/click2call.html?u=' + extensionId + '&p=' + password + '&c=' + phone + '&type=' + type + '&uniqueId=' + uniqueId

        // await alert("phone" + phone + "  type" + type + "  uniqueId" + uniqueId + "  userName" + extensionId + "  pwd " + password)
        //alert(uri)
        if (extensionId && extensionId != null && extensionId != '') {
            var granted = await navigatetoCallWebView();

            if (granted) {
                navigator.navigate(AppNavigator.EmsStackIdentifiers.webViewComp, {
                    phone: phone,
                    type: type,
                    uniqueId: uniqueId,
                    userName: extensionId,
                    password: password,
                    url: uri
                })
            }


        }
        else callNumber(phone)
        // alert(phone + uniqueId + "/" + type + "/" + password)

    } catch (error) {
    }


}

export const MyTaskNewItem = ({ from = "MY_TASKS", navigator, type, uniqueId, name, status, created, dmsLead, phone, source, model, leadStatus = '', leadStage = '', needStatus = '', enqCat = '', onItemPress, onDocPress }) => {
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

    function getStageColor(leadStage, leadStatus) {
             return leadStatus === "PREENQUIRYCOMPLETED" ||
               (leadStatus === "ENQUIRYCOMPLETED" && leadStage === "ENQUIRY") ||
               (leadStatus === "PREBOOKINGCOMPLETED" &&
                 leadStage === "PREBOOKING") ||
               (leadStatus === "PREDELIVERYCOMPLETED" &&
                 leadStage === "PREDELIVERY") ||
               (leadStatus === "INVOICECOMPLETED" && leadStage === "INVOICE") ||
               (leadStatus === "DELIVERYCOMPLETED" && leadStage === "DELIVERY") ||
               (leadStatus === "BOOKINGCOMPLETED" && leadStage === "BOOKING")
               ? "#18a835"
               : "#f29a22";
    }
    function getCategoryTextColor(cat) {
        let color = '#7b79f6';
        if (!cat) {
            return color;
        }
        switch (cat.toLowerCase()) {
            case 'hot':
                color = Colors.RED;
                break;
            case 'warm':
                color = '#7b79f6';
                break;
            case 'cold':
                color = Colors.LIGHT_GRAY2;
                break;
        }
        return color;
    }

    const cannotEditLead = () => {
        const leadStages = ['INVOICE', 'DELIVERY', 'PREDELIVERY'];
        return leadStages.includes(leadStage);
    }

    return (
        <TouchableOpacity onPress={onItemPress} style={styles.section}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative"
                }}
            >
                <View style={{ width: "65%" }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ maxWidth: "73%" }}>
                            <Text style={styles.text1}>{name}</Text>
                        </View>
                        {/*<Text style={styles.catText}>{enqCat}</Text>*/}
                    </View>
                    <Text style={styles.text2}>{date}</Text>
                    <Text style={styles.text2}>{source + " - " + dmsLead}</Text>
                    <Text style={styles.text2}>{phone}</Text>
                    <>
                        {from !== 'PRE_ENQUIRY' &&
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <>
                                    {leadStage == 'ENQUIRY' &&
                                        (enqCat !== '' && enqCat?.length > 0 &&
                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={[styles.text3, { color: getCategoryTextColor(enqCat) }]}>{enqCat}</Text>
                                                <Text style={{ fontWeight: '600', color: Colors.BLACK }}> | </Text>
                                            </View>)

                                    }
                                </>
                                <Text style={[styles.text3, { color: getStageColor(leadStage, leadStatus) }]}>{leadStage === 'PREBOOKING' ? 'BOOKING APPROVAL' : leadStage}</Text>
                            </View>
                        }
                    </>
                </View>
                <View style={{ width: "35%", alignItems: "center" }}>
                    <View style={styles.modal}>
                        <Text style={styles.text4}>{model}</Text>
                        {/* <Text style={styles.text4}>{"Jeep Compact SUV"}</Text> */}
                    </View>
                    {/* <View style={{ height: 8 }}></View> */}
                    <View
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <IconComp
                            iconName={"format-list-bulleted-square"}
                            disabled={true}
                            opacity={cannotEditLead() ? 0.5 : 1}
                            onPress={() => {
                                cannotEditLead() ?
                                showToastRedAlert("You don't have Permission"):
                                onDocPress() }}
                        />
                        <View style={{ padding: 5 }} />
                        <IconComp
                            iconName={"phone-outline"}
                            onPress={() =>
                                // cannotEditLead() ?
                                //     showToastRedAlert("You don't have Permission") :
                                    callWebViewRecord({
                                        navigator,
                                        phone,
                                        uniqueId,
                                        type,
                                    })
                            }
                        />
                        <View style={{ padding: 5 }} />
                        <IconComp
                            iconName={"whatsapp"}
                            onPress={() => 
                            // cannotEditLead() ? showToastRedAlert("You don't have Permission") : 
                            sendWhatsApp(phone)}
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
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
        marginBottom: 5
    },
    text3: {
        color: Colors.DARK_GRAY,
        fontSize: 12,
        fontWeight: '600',
    },
    text4: {
        color: Colors.WHITE,
        fontSize: 11,
        fontWeight: "bold",
        textAlign: "center",
        paddingHorizontal: 2
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
        marginVertical: 6
    },
    modal: {
        backgroundColor: Colors.RED,
        borderRadius: 4,
        width: "100%",
        minHeight: 21,
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
})
