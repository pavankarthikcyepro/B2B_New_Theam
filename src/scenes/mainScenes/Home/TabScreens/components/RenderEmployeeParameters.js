import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { achievementPercentage } from "../../../../../utils/helperFunctions";
import { Colors } from "../../../../../styles";
import { AppNavigator } from "../../../../../navigations";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 100) / 5;

export const RenderEmployeeParameters = (parameter) => {
    // const paramsData = ['Enquiry', 'Test Drive', 'Home Visit', 'Booking', 'INVOICE', 'Finance', 'Insurance', 'Exchange', 'EXTENDEDWARRANTY', 'Accessories'];

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

    const { params, item, color, displayType, navigation, moduleType } = parameter;
    const paramsData = params.map(({ paramName }) => paramName);
    return (
        <>
            {
                paramsData.map((param, index) => {
                    const selectedParameter = item.targetAchievements.filter((x) => x.paramName === param)[0];
                    const enquiryParameter = item.targetAchievements.filter((item) => item.paramName === 'Enquiry')[0];

                    // const elementColor = getColor(Number(selectedParameter.achievment), Number(selectedParameter.target));
                    return (
                        <View key={param} style={[styles.itemBox, { width: moduleType === 'live-leads' ? 68 : (param === "Accessories" ? 65 : 55) }]}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', height: 23 }}>
                                <Text onPress={() => {
                                    if (param == "Enquiry" || param == "Booking" || param == "INVOICE") {
                                        navigation.navigate(AppNavigator.TabStackIdentifiers.ems);
                                        setTimeout(() => {
                                            navigation.navigate("LEADS", {
                                                param: param == "INVOICE" ? "Retail" : param,
                                                employeeDetail: {
                                                    empName: parameter.item.empName,
                                                    empId: parameter.item.empId,
                                                    orgId: parameter.item.orgId,
                                                    branchId: parameter.item.branchId,
                                                    moduleType
                                                }
                                            })
                                        }, 10);
                                    }
                                }} style={[styles.totalText1, { color: Colors.RED }]}>
                                    {selectedParameter ?
                                        displayType === 0 ? selectedParameter.achievment :
                                            selectedParameter.target > 0 ? achievementPercentage(selectedParameter.achievment, selectedParameter.target, param, enquiryParameter.achievment) :
                                                selectedParameter.achievment
                                        : 0}
                                </Text>
                            </View>
                            {/*<View style={{height: 1, backgroundColor: 'black'}}/>*/}
                            <Text style={[styles.totalText, {
                                width: moduleType === 'live-leads' ? 66 : (param === "Accessories" ? 63 : 53),
                                backgroundColor: 'lightgray'
                            }]}>
                                {selectedParameter && selectedParameter.target ? Number(selectedParameter.target) : 0}
                            </Text>
                        </View>
                    );
                })
            }
        </>
    )

}


const styles = StyleSheet.create({
    itemBox: {
        borderLeftWidth: 1,
        borderLeftColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center'
    },
    totalText: { textAlign: "center", fontSize: 12, height: 22 },
    totalText1: {
        color: "black",
        fontSize: 14,
        width: '98%',
        textAlign: 'center',
        backgroundColor: 'rgba(223,228,231,0.67)'
    },
});
