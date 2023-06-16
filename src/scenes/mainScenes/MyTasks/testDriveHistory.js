import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import {
    clearState, getTestDriveHistoryDetails

} from "../../../redux/testDriveReducer";
import { Colors, GlobalStyle } from "../../../styles"
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
const TestDriveHistory = ({ route, navigation }) => {
    const { universalId } = route.params;
    const dispatch = useDispatch();
    const selector = useSelector((state) => state.testDriveReducer);
    const [historyList, setHistoryList] = useState("");
    useEffect(() => {

        if (universalId) {
            dispatch(getTestDriveHistoryDetails(universalId))
        }


    }, [])

    useEffect(() => {
        if (selector.test_drive_history_details_statu === "successs") {
            setHistoryList(selector.test_drive_history_details);
        }


    }, [selector.test_drive_history_details_statu])


    function TaskNameView(item) {

        return (
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "700",
                    marginBottom: 5,
                    width: "80%",
                    margin:5
                }}
            >
                
                {item.reTestdriveFlag == "ReTestDrive" ? "Re Test drive" : "Test drive"}
            </Text>
        );
    }

    const renderItem = ({ item, index }) => {
       
        const date = item.testDriveDatetime.split(" ");
        let topBcgColor = Colors.LIGHT_GRAY;
        let bottomBcgColor = Colors.LIGHT_GRAY;
        if (historyList[index - 1] !== undefined) {

            topBcgColor = Colors.GRAY;
        }

        if (historyList[index + 1] !== undefined) {

            bottomBcgColor = Colors.GRAY;
        }

        return <View
            style={styles.view4}
        >
            <View
                style={styles.view3}
            >
                <View
                    style={{
                        marginLeft: 8,
                        flex: 1,
                        width: 2,
                        backgroundColor: topBcgColor,
                    }}
                ></View>
                <View
                    style={{
                        marginLeft: 8,
                        flex: 1,
                        width: 2,
                        backgroundColor: bottomBcgColor,
                    }}
                ></View>

                <View
                    style={styles.view5}
                >
                    <View
                        style={styles.blankView}
                    ></View>
                    <View style={{ marginLeft: 5 }}>
                        <Text
                            style={styles.txt2}
                        >
                            {date[0]}

                        </Text>
                        <Text
                            style={styles.txt2}
                        >
                            {date[1]}

                        </Text>
                    </View>
                </View>
            </View>
            <View
                style={{
                    width: "75%",
                    padding: 5,
                }}
            >
                <View
                    style={[
                        { backgroundColor: Colors.WHITE },
                        GlobalStyle.shadow,
                    ]}
                >
                    <TouchableOpacity
                    disabled={true}
                        onPress={() => { }}
                    >
                        <View
                            style={[
                                styles.view1,
                            ]}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                {TaskNameView(item)}

                            </View>

                            <View style={{ flexDirection: "column" }}>
                                <View style={styles.view6}>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Model: "}
                                    </Text>
                                    <Text
                                        style={styles.txt3}
                                    >
                                        {item.model}
                                    </Text>
                                    
                                </View>  
                                <View style={styles.view6}>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Variant: "}
                                    </Text>
                                    <Text
                                        style={styles.txt3}
                                    >
                                        {item.varient}
                                    </Text>

                                </View>  
                                <View style={styles.view6}>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Fuel Type: "}
                                    </Text>
                                    <Text
                                        style={styles.txt3}
                                    >
                                        {item.fuelType}
                                    </Text>

                                </View>  
                                <View style={styles.view6}>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Transmission: "}
                                    </Text>
                                    <Text
                                        style={styles.txt3}
                                    >
                                        {item.transmissionType}
                                    </Text>

                                </View>  

                                <View style={styles.view6}>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Customer address: "}
                                    </Text>
                                    <Text
                                        // numberOfLines={3}
                                        style={styles.txt3}
                                    >
                                        {(item.location === "showroom" ? "showroom" : item.address)}
                                    </Text>

                                </View>  
                                <View style={styles.view6}>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Mobile No: "}
                                    </Text>
                                    <Text
                                        // numberOfLines={3}
                                        style={styles.txt3}
                                    >
                                        {(item.mobileNumber)}
                                    </Text>

                                </View>  
                                {item.reason !== null && item.reason !== "" && <View style={styles.view6}>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Reason: "}
                                    </Text>
                                    <Text
                                        // numberOfLines={3}
                                        style={styles.txt3}
                                    >
                                        {(item.reason)}
                                    </Text>

                                </View>}
                                {item.customerRemarks !== null && item.customerRemarks !== "" && <View style={styles.view6}>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Customer Remarks: "}
                                    </Text>
                                    <Text
                                        // numberOfLines={3}
                                        style={styles.txt3}
                                    >
                                        {(item.customerRemarks)}
                                    </Text>

                                </View>}
                                {item.employeeRemarks !== null && item.employeeRemarks !== "" && <View style={styles.view6}>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Employee remarks: "}
                                    </Text>
                                    <Text
                                        // numberOfLines={3}
                                        style={styles.txt3}
                                    >
                                        {(item.employeeRemarks)}
                                    </Text>

                                </View>} 
                                <View style={styles.view6}>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Status: "}
                                    </Text>
                                    <Text
                                        // numberOfLines={3}
                                        style={styles.txt3}
                                    >
                                        {(item.status)}
                                    </Text>

                                </View>  
                            </View>


                            {/* <View style={{ flexDirection: "row" }}>
                                <View style={{ flexDirection: "column", alignContent: "center", }}>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Model: "}
                                    </Text>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Variant: "}
                                    </Text>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Fuel Type: "}
                                    </Text>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Transmission: "}
                                    </Text>
                                    <Text
                                        style={styles.txt5}
                                    >
                                        {"Customer address: "}
                                    </Text>
                                </View>

                                <View style={styles.colView}>
                                    <Text
                                        style={styles.txt3}
                                    >
                                        {item.model}
                                    </Text>
                                    <Text
                                        style={styles.txt3}
                                    >
                                        {item.varient}
                                    </Text>
                                    <Text
                                        style={styles.txt3}
                                    >
                                        {item.fuel}
                                    </Text>
                                    <Text
                                        style={styles.txt3}
                                    >
                                        {item.transmission}
                                    </Text>
                                    <Text
                                        // numberOfLines={3}
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "400",
                                            // flexShrink: 1   
                                        }}
                                    >
                                        {(item.location === "showroom" ? "showroom" : item.address)}
                                    </Text>
                                </View>
                            </View> */}


                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={{ flex: 1 }}
                data={historyList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />


        </SafeAreaView>
    )
}

export default TestDriveHistory

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingBottom: 5,
        paddingHorizontal: 10,
        backgroundColor: Colors.LIGHT_GRAY,
    },
    sideTitle: {
        fontSize: 14,
        fontWeight: "400",
    },
    followUpText: {
        fontSize: 14,
        fontWeight: "400",
        marginVertical: 3,
    },

    dotContainer: {
        height: 45,
        width: 25,
    },
    view1: {
        paddingVertical: 5,
        paddingLeft: 10,
        backgroundColor: Colors.WHITE,
    },
    txt1: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 5,
        width: "75%"
    },
    btn1: {
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1d1d1",
        borderRadius: 5,
        marginTop: -5,
    },
    view2: {
        width: "100%",
        flexDirection: "row",
    },
    view3: {
        width: "25%",
        justifyContent: "center",
    },
    txt2: {
        fontSize: 12,
        fontWeight: "400",
    },
    txt3: {
        fontSize: 14,
        fontWeight: "400",
        color: Colors.BLACK,
        flex:1
    },
    txt5: {
        fontSize: 14,
        fontWeight: "400",
        color: Colors.GRAY,
        flex:1
    },
    view4: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    view5: {
        alignItems: "center",
        flexDirection: "row",
        position: "absolute",
    },
    btn2: {
        alignSelf: "flex-start",
        marginTop: -5,
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1d1d1",
        borderRadius: 5,
    },
    txt4: { fontSize: 18, fontWeight: "700", marginBottom: 5 },
    blankView: {
        height: 20,
        width: 20,
        borderRadius: 20,
        backgroundColor: Colors.GRAY,

    },
    colView: {
        flexDirection: "column", width: 0,
        flexGrow: 1,
        flex: 1,
    },
    view6: { flexDirection: "row", margin: 5 }
})