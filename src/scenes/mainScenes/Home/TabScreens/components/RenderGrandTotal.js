import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Colors} from "../../../../../styles";
import {achievementPercentage} from "../../../../../utils/helperFunctions";

export const RenderGrandTotal = (parameter) => {
    // const paramsData = ['Enquiry', 'Test Drive', 'Home Visit', 'Booking', 'INVOICE', 'Finance', 'Insurance', 'Exchange', 'EXTENDEDWARRANTY', 'Accessories'];
    const {params, totalParams, displayType} = parameter;
    console.log('PARAMS in Grand Total: ', params.length);
    console.log('PARAMS in Grand Total: ', totalParams);
    const paramsData = params.map(({paramName}) => paramName);
    return (
        <>
            {
                paramsData.map((param) => {
                    const selectedParameter = totalParams.filter((item) => item.paramName === param)[0];
                    const enquiryParameter = totalParams.filter((item) => item.paramName === 'Enquiry')[0];
                    return (
                        <View style={[styles.itemBox, {width: param === 'Accessories' ? 80 : 60, backgroundColor: Colors.LIGHT_GRAY, borderColor: Colors.BORDER_COLOR, borderWidth: 1}]}>
                            <Text
                                style={[styles.totalText1, {marginBottom: 0, color: Colors.BLACK}]}>{displayType === 0 ? Number(selectedParameter.achievment) :
                                achievementPercentage(selectedParameter.achievment, selectedParameter.target, param, enquiryParameter.achievment)}
                            </Text>
                            <View style={{height: 1, backgroundColor: Colors.WHITE}}/>
                            <Text
                                style={[styles.totalText, {width: param === 'Accessories' ? 80 : 60, color: Colors.BLACK, backgroundColor: Colors.BORDER_COLOR}]}>{Number(selectedParameter.target)}</Text>
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
        textAlign: "center",
    },
    totalText1: {
        color: "#fff",
        fontWeight: "400",
        fontSize: 12,
        textAlign: "center"
    },
});
