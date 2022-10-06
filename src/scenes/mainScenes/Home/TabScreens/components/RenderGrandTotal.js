import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Colors} from "../../../../../styles";
import {achievementPercentage} from "../../../../../utils/helperFunctions";

export const RenderGrandTotal = (parameter) => {
    // const paramsData = ['Enquiry', 'Test Drive', 'Home Visit', 'Booking', 'INVOICE', 'Finance', 'Insurance', 'Exchange', 'EXTENDEDWARRANTY', 'Accessories'];
    const {params, totalParams, displayType} = parameter;
    const paramsData = params.map(({paramName}) => paramName);
    return (
        <>
            {
                paramsData.map((param) => {
                    const selectedParameter = totalParams.filter((item) => item.paramName === param)[0];
                    const enquiryParameter = totalParams.filter((item) => item.paramName === 'Enquiry')[0];
                    return (
                        <View key={param} style={[styles.itemBox, {width: param === 'Accessories' ? 65 : 56, backgroundColor: Colors.RED}]}>
                            <Text
                                style={[styles.totalText1, {marginBottom: 0, color: Colors.WHITE}]}>{displayType === 0 ? Number(selectedParameter.achievment) :
                                achievementPercentage(selectedParameter.achievment, selectedParameter.target, param, enquiryParameter.achievment)}
                            </Text>
                            <Text
                                style={[styles.totalText, {width: param === 'Accessories' ? 65 : 56, color: Colors.WHITE, backgroundColor: Colors.MAROON}]}>{Number(selectedParameter.target)}</Text>
                        </View>
                    )
                })
            }
        </>
    )
}


const styles = StyleSheet.create({
    itemBox: {
        width: 100,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 2,
    },
    totalText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
        height: 20,
        textAlign: "center",
    },
    totalText1: {
        color: "#fff",
        fontWeight: "400",
        fontSize: 12,
        height: 20,
        textAlign: "center"
    },
});
