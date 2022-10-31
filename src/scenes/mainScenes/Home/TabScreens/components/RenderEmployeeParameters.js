import React from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import {achievementPercentage} from "../../../../../utils/helperFunctions";
import {Colors} from "../../../../../styles";
import {AppNavigator} from "../../../../../navigations";
import {EmsTopTabNavigatorIdentifiers} from "../../../../../navigations/emsTopTabNavigator";

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

    const {params, item, color, displayType, navigation, moduleType} = parameter;
    const paramsData = params.map(({paramName}) => paramName);

    function navigateToEmsScreen(param) {
        const leads = ['enquiry', 'booking', 'invoice'];
        const isDropped = param.toLowerCase() === 'dropped';
        const isContact = param.toLowerCase() === 'preenquiry';
        const isLead = leads.includes(param.toLowerCase());
        if (isLead) {
            navigation.navigate(AppNavigator.TabStackIdentifiers.ems);
            setTimeout(() => {
                navigation.navigate("LEADS", {
                    param: param === "INVOICE" ? "Retail" : param,
                    employeeDetail: {
                        empName: item.empName,
                        empId: item.empId,
                        orgId: item.orgId,
                        branchId: item.branchId,
                    },
                    moduleType
                })
            }, 1000);
        } else if (isContact) {
            navigation.navigate(EmsTopTabNavigatorIdentifiers.preEnquiry, {
                moduleType: 'live-leads'
            });
        } else if (isDropped) {
            navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis);
        }
    }

    return (
        <>
            {
                paramsData.map((param, index) => {
                    const selectedParameter = item.targetAchievements.filter((x) => x.paramName === param)[0];
                    const enquiryParameter = item.targetAchievements.filter((item) => item.paramName === 'Enquiry')[0];

                    // const elementColor = getColor(Number(selectedParameter.achievment), Number(selectedParameter.target));
                    return (
                        <>
                            {moduleType !== 'live-leads' ?
                                <View key={param} style={[styles.itemBox, {width: param === "Accessories" ? 65 : 55}]}>
                                <View style={{justifyContent: 'center', alignItems: 'center', height: 23}}>
                                    <Text onPress={() => navigateToEmsScreen(param)} style={[styles.totalText1, {color: Colors.RED}]}>
                                        {selectedParameter ?
                                            displayType === 0 ? selectedParameter.achievment :
                                                selectedParameter.target > 0 ? achievementPercentage(selectedParameter.achievment, selectedParameter.target, param, enquiryParameter.achievment) :
                                                    selectedParameter.achievment
                                            : 0}
                                    </Text>
                                </View>
                                <Text style={[styles.totalText, {
                                    width: moduleType === 'live-leads' ? 66 : (param === "Accessories" ? 63 : 53),
                                    backgroundColor: 'lightgray'
                                }]}>
                                    {selectedParameter && selectedParameter.target ? Number(selectedParameter.target) : 0}
                                </Text>
                            </View> : <View key={param}
                                            style={[styles.itemBox, {width: 68}]}>
                                <View style={{justifyContent: 'center', alignItems: 'center', height: 23}}>
                                    <Text onPress={() => navigateToEmsScreen(param)}
                                          style={[styles.totalText1, {color: Colors.RED}]}>
                                        {selectedParameter ?
                                            displayType === 0 ? selectedParameter.achievment :
                                                selectedParameter.target > 0 ? achievementPercentage(selectedParameter.achievment, selectedParameter.target, param, enquiryParameter.achievment) :
                                                    selectedParameter.achievment
                                            : 0}
                                    </Text>
                                </View>
                            </View>
                            }
                        </>
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
    totalText: {textAlign: "center", fontSize: 12, height: 22},
    totalText1: {
        color: "black",
        fontSize: 14,
        width: '98%',
        textAlign: 'center',
        backgroundColor: 'rgba(223,228,231,0.67)'
    },
});
