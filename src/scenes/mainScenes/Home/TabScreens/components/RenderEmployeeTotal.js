import React, {useEffect, useState} from "react";
import {Alert, StyleSheet, Text, View} from "react-native";
import {client} from "../../../../../networking/client";
import URL from "../../../../../networking/endpoints";
import {Colors} from "../../../../../styles";
import moment from "moment";
import * as AsyncStore from "../../../../../asyncStore";

export const RenderEmployeeTotal = (userData) => {
    const paramsData = ['INVOICE', 'Enquiry', 'Test Drive', 'Home Visit', 'Booking', 'Finance', 'Insurance', 'Exchange', 'EXTENDEDWARRANTY', 'Accessories'];
    const {empId, branchId, level} = userData;
    const [empParams, setEmpParams] = useState([]);
    const [branches, setBranches] = useState([]);
    useEffect(async () => {

        try {
            const branchData = await AsyncStore.getData("BRANCHES_DATA");
            if (branchData) {
                const branchesList = JSON.parse(branchData);
                setBranches([...branchesList]);
                console.log('------~~~~~~======: ', branches.length, branchData)
            }
        } catch (e) {
            Alert.alert('Error occurred - Employee total', `${JSON.stringify(e)}`);
        }
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().format(dateFormat)
        const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);

        const payload = {
            "endDate": monthLastDate,
            "loggedInEmpId": empId,
            "empId": empId,
            "startDate": monthFirstDate,
            "levelSelected": null,
            "pageNo": 0,
            "size": 3
        };
        const response = await client.post(URL.GET_TARGET_PARAMS(), payload);
        const json = await response.json()

        if (!response.ok) {
            Alert.alert('Error occurred', `${response}`);
        }
        setEmpParams(json);
    }, [empId]);
    return (
        <View style={{flexDirection: 'row'}}>
            { level === 0 &&
                <View style={{width: '8%', minHeight: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    {
                        <View style={{marginTop: 7, marginBottom: 7,}}>
                            <Text style={{fontSize: 14, color: '#000', fontWeight: '600'}}>Total</Text>
                            <Text style={{
                                fontSize: 8,
                                color: '#000',
                            }}>{branches.length > 0 && (branches.find(x => +x.branchId === +branchId).branchName.split(' - ')[0])}</Text>
                        </View>
                    }
                </View>
            }
            <View style={[{width: '92%', minHeight: 40, flexDirection: 'column', paddingHorizontal: 5,}]}>
                <View style={{width: '94%', minHeight: 40, flexDirection: 'row', backgroundColor: level === 0 ? '#ECF0F1' : Colors.WHITE}}>
                    {paramsData.map((param) => {
                        const selectedParameter = empParams && empParams.filter((item) => item.paramName === param)[0];
                        return (
                            <TotalView item={selectedParameter} parameterType={param}/>
                        )
                    })}
                </View>
            </View>
        </View>
    )
}

export const TotalView = (parameter) => {
    const {item, parameterType} = parameter;
    return (
        <View style={[styles.itemBox, {width: parameterType === 'Accessories' ? 65 : 50}]}>
            <Text
                style={[styles.totalText]}>{item ? Number(item.achievment) : 0}</Text>
            <View style={{height: 1, backgroundColor: Colors.BLACK, alignSelf: 'stretch'}}/>
            <Text
                style={[styles.totalText, {width: parameterType === 'Accessories' ? 80 : 50}]}>{item ? Number(item.target) : 0}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    itemBox: {width: 50, height: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 2},
    totalText: {color: '#000000', textAlign: "center"},
})
