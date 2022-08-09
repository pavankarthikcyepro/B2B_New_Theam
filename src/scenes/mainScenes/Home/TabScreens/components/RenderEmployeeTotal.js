import React from "react";
import {Alert, StyleSheet, Text, View} from "react-native";
import {Colors} from "../../../../../styles";

export const RenderEmployeeTotal = (parameter) => {
    const getTotalAchievementByParam = (allData, paramName) => {
        let total = 0;
        total += Number(allData.targetAchievements.filter((item) => item.paramName === paramName)[0].achievment);
        if (allData.employeeTargetAchievements.length > 0) {
            for (let i = 0; i < allData.employeeTargetAchievements.length; i++) {
                total += Number(allData.employeeTargetAchievements[i].targetAchievements.filter((item) => item.paramName === paramName)[0].achievment);
                if (allData.employeeTargetAchievements[i].employeeTargetAchievements.length > 0) {
                    for (let j = 0; j < allData.employeeTargetAchievements[i].employeeTargetAchievements.length; j++) {
                        total += Number(allData.employeeTargetAchievements[i].employeeTargetAchievements[j].targetAchievements.filter((item) => item.paramName === paramName)[0].achievment);
                    }
                }
            }
        }
        return total;
    }

    const getTotalTargetByParam = (allData, paramName) => {
        let total = 0;
        total += Number(allData.targetAchievements.filter((item) => item.paramName === paramName)[0].target);
        if (allData.employeeTargetAchievements.length > 0) {
            for (let i = 0; i < allData.employeeTargetAchievements.length; i++) {
                total += Number(allData.employeeTargetAchievements[i].targetAchievements.filter((item) => item.paramName === paramName)[0].target);
                if (allData.employeeTargetAchievements[i].employeeTargetAchievements.length > 0) {
                    for (let j = 0; j < allData.employeeTargetAchievements[i].employeeTargetAchievements.length; j++) {
                        total += Number(allData.employeeTargetAchievements[i].employeeTargetAchievements[j].targetAchievements.filter((item) => item.paramName === paramName)[0].target);
                    }
                }
            }
        }
        return total;
    }

    const {parameterType, item} = parameter;

    return (
        <View style={[styles.itemBox, {width: parameterType === 'Accessories' ? 60 : 50}]}>
            <Text style={[styles.totalText]}>{getTotalAchievementByParam(item, parameterType)}</Text>
            <View style={{height: 1, backgroundColor: Colors.BLACK, alignSelf: 'stretch'}} />
            <Text style={[styles.totalText, {width: parameterType === 'Accessories' ? 80 : 50}]}>{getTotalTargetByParam(item, parameterType)}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    itemBox: { width: 50, height: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 2},
    totalText: {color: '#000000', textAlign: "center" },
})
