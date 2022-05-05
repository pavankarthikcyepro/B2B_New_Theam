import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../../../styles';
import { convertTimeStampToDateString, callNumber } from '../../../../utils/helperFunctions';
import { IconButton } from "react-native-paper";
import moment from "moment";


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

const IconComp = ({ iconName, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#002C5F", borderRadius: 3 }}>
                <IconButton
                    icon={iconName}
                    color={Colors.GREEN}
                    size={20}
                />
            </View>
        </TouchableOpacity>
    )
}

export const MyTaskNewItem = ({ name, status, created, dmsLead, phone, source, model, onItemPress, onDocPress }) => {

    const date = moment(created, "YYYY-MM-DD hh-mm-s").format("DD/MM/YYYY h:mm a");
    let bgColor = Colors.BLUE;
    let statusName = status;
    if (status === "CANCELLED" || status === "ASSIGNED" || status === "SENT_FOR_APPROVAL" || status === "RESCHEDULED") {
        bgColor = statusBgColors[status].color;
        statusName = statusBgColors[status].title;
    }

    return (
        <TouchableOpacity onPress={onItemPress}>
            <View style={{ flex: 1, paddingHorizontal: 5, justifyContent: "space-between", flexDirection: "row" }}>
                <View style={{ width: "70%" }}>
                    <Text style={styles.text1}>{name}</Text>
                    <Text style={styles.text2}>{source + " - " + dmsLead}</Text>
                    <Text style={styles.text3}>{date}</Text>
                </View>
                <View style={{ width: "30%", alignItems: "center" }}>
                    <Text style={styles.text4}>{model}</Text>
                    <View style={{ height: 8 }}></View>
                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-evenly" }}>
                        <IconComp
                            iconName={'format-list-bulleted-square'}
                            onPress={onDocPress}
                        />
                        <IconComp
                            iconName={'phone-outline'}
                            onPress={() => callNumber(phone)}
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
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
        backgroundColor: Colors.RED,
        color: Colors.WHITE,
        fontSize: 12,
        fontWeight: "700",
        borderRadius: 4,
        width: "75%",
        height: 20,
        textAlign: "center",
        paddingHorizontal: 5
    }
})