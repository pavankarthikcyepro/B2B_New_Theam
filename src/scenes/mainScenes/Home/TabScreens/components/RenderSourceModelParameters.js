import React from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import {achievementPercentage} from "../../../../../utils/helperFunctions";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 100) / 5;

export const RenderSourceModelParameters = (parameter) => {
    const paramsData = ['Enquiry', 'Test Drive', 'Home Visit', 'Booking', 'INVOICE', 'Exchange', 'Finance', 'Insurance', 'EXTENDEDWARRANTY', 'Accessories'];

    const getColor = (ach, tar) => {
        if (ach > 0 && tar === 0) {
            return '#1C95A6'
        } else if (ach === 0 || tar === 0) {
            return '#FA03B9'
        } else {
            if ((ach / tar * 100) === 50) {
                return '#EC3466'
            } else if ((ach / tar * 100) > 50) {
                return '#1C95A6'
            } else if ((ach / tar * 100) < 50) {
                return '#FA03B9'
            }
        }
    }

    const {params, item, color, displayType} = parameter;
    // const paramsData = params.map(({paramName}) => paramName);
    return (
        <>
            {
                paramsData.map((param) => {
                    const selectedParameter = item.targetAchievements.filter((x) => x.paramName === param)[0];
                    const enquiryParameter = item.targetAchievements.filter((item) => item.paramName === 'Enquiry')[0];

                    if (selectedParameter) {
                        const elementColor = getColor(Number(selectedParameter.achievment), Number(selectedParameter.target));
                        return (
                            <View key={param} style={[styles.itemBox, {width: param === "Accessories" ? 80 : 60}]}>
                                <Text style={[styles.totalText1, {color: elementColor}]}>
                                    {selectedParameter ?
                                        displayType === 0 ? selectedParameter.achievment :
                                            selectedParameter.target > 0 ? achievementPercentage(selectedParameter.achievment, selectedParameter.target, param, enquiryParameter.achievment) :
                                                selectedParameter.achievment
                                        : 0}
                                </Text>
                            </View>
                        );
                    }
                })
            }
        </>
    )

}


const styles = StyleSheet.create({
    itemBox: {
        height: 25,
        marginVertical: 6
    },
    totalText: {textAlign: "center", fontSize: 14, height: 20, textAlignVertical: 'center',},
    totalText1: {
        color: "black",
        height: 25,
        fontSize: 14,
        width: '98%',
        paddingTop: 6,
        textAlign: 'center',
        textAlignVertical: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(223,228,231,0.67)'
    },
});
