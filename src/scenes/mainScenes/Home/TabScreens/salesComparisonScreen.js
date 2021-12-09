import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions, Text } from "react-native";
import { Colors } from "../../../../styles";
import { TargetListComp } from "../../../../components";
import { ChartNameList, EmptyListView } from "../../../../pureComponents";
import { targetStyle } from "../../../../components/targetListComp";
import { useDispatch, useSelector } from 'react-redux';
import { LineGraphComp } from "../../../../components";
import { rgbaColor } from "../../../../utils/helperFunctions";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 100) / 4;

const NameComp = ({ label, labelStyle = {}, showColon = false }) => {

    return (
        <View style={{ height: 20, flexDirection: 'row', justifyContent: "center", alignItems: "center", }}>
            <Text style={[targetStyle.textStyle, labelStyle]} numberOfLines={1}>{label}</Text>
        </View>
    )
}

export const SalesComparisonScreen = () => {

    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [namesData, setNamesData] = useState([]);
    const [tableDataObject, setTableDataObject] = useState({});
    const [chartNamesData, setChartNames] = useState([]);
    const [chartValuesData, setChartValues] = useState([]);

    useEffect(() => {
        if (selector.sales_comparison_data) {
            const namesDataLocal = [];
            const chartNamesLocal = [];
            const chartValuesLocal = [];
            const tableDataLocal = [];

            selector.sales_comparison_data.forEach((object, index) => {
                let keyStr = "";
                let value = 0;
                for (const key in object) {
                    keyStr = key;
                    value = object[key];
                }

                var x = Math.floor(Math.random() * 256);
                var y = Math.floor(Math.random() * 256);
                var z = Math.floor(Math.random() * 256);
                const rgbValue = `rgba(${x}, ${y}, ${z}, 1)`;
                namesDataLocal.push({ name: value + "-" + keyStr, color: rgbValue })
                chartNamesLocal.push(keyStr)
                chartValuesLocal.push(value);
                tableDataLocal.push({ name: keyStr, value: value });
            })
            console.log("data: ", JSON.stringify(tableDataLocal))
            setNamesData(namesDataLocal);
            setChartNames(chartNamesLocal);
            setChartData([
                {
                    data: chartValuesLocal,
                    color: () => rgbaColor(), // optional
                    strokeWidth: 2
                }
            ]);
            setTableData(tableDataLocal);
        } else {
            setTableData([]);
        }
    }, [selector.sales_comparison_data])

    return (
        <View style={[styles.container, { paddingTop: 10 }]}>

            <View style={{ width: "100%", marginTop: 5 }}>
                <View style={{ width: "23%", paddingLeft: 5 }}>
                    <View style={{ flexDirection: "row", padding: 3 }}>
                        <Text style={[targetStyle.textStyle, { width: 100, fontWeight: "600" }]}>{"Model"}</Text>
                        <Text style={[targetStyle.textStyle, { fontWeight: "600" }]}>{"Sales"}</Text>
                    </View>
                </View>
                <View style={{ width: "78%", padding: 3 }}>
                    <FlatList
                        data={tableData}
                        keyExtractor={(item, index) => "Sales_Comp" + index.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {

                            return (
                                <View style={{ flexDirection: "row", padding: 3 }}>
                                    <Text style={[targetStyle.textStyle, { width: 100 }]}>{item.name}</Text>
                                    <Text style={[targetStyle.textStyle]}>{item.value}</Text>
                                </View>
                            )
                        }}
                    />
                </View>
            </View>

            <View style={{ backgroundColor: Colors.WHITE, }}>
                {/* <View style={{ paddingLeft: 5, paddingTop: 20, paddingBottom: 10 }}>
                    <ChartNameList
                        data={namesData}
                        itemWidth={itemWidth}
                    />
                </View> */}
                {(chartData.length > 0 && chartNamesData.length > 0) && (
                    <View style={{ alignItems: 'center', overflow: 'hidden' }}>
                        <LineGraphComp chartTitles={chartNamesData} chartData={chartData} width={screenWidth - 40} />
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.WHITE,
    },

    text1: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.WHITE,
    },
    barVw: {
        backgroundColor: Colors.WHITE,
        width: 40,
        height: "70%",
        justifyContent: "center",
    },
    text2: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },
    text3: {
        fontSize: 18,
        fontWeight: "800",
    },
    dateVw: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.WHITE,
        marginBottom: 5,
        paddingLeft: 5,
        height: 50,
    },
    boxView: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.WHITE,
        paddingVertical: 5
    },
});
