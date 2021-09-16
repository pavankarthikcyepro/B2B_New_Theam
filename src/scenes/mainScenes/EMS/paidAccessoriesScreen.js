import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Text, FlatList, Pressable } from "react-native";
import { EmptyListView } from "../../../pureComponents";
import { GlobalStyle, Colors } from "../../../styles";
import { Button, IconButton } from "react-native-paper"

const rupeeSymbol = "\u20B9";

const PaidAccessoriesScreen = ({ route, navigation }) => {

    const [tableData, setTableData] = useState([]);
    const { accessorylist } = route.params;

    useEffect(() => {
        let newFormatTableData = [];
        accessorylist.forEach((item) => {
            newFormatTableData.push({
                ...item,
                selected: false
            })
        })
        setTableData([...newFormatTableData]);
    }, [])

    const updatedItem = (index) => {

        const data = [...tableData];
        const selectedItem = data[index];
        selectedItem.selected = !selectedItem.selected;
        data[index] = selectedItem;
        setTableData([...data]);
    }

    const addSelected = () => {
        let totalPrice = 0;
        tableData.forEach((item) => {
            if (item.selected) {
                totalPrice += item.cost;
            }
        })
        route.params.callback(totalPrice);
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, padding: 10 }}>
                {tableData.length === 0 ? <EmptyListView title={"No Data Found"} /> : <View style={{ flex: 1 }}>
                    <FlatList
                        data={tableData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ padding: 10, paddingBottom: 0 }}>
                                    <Pressable onPress={() => updatedItem(index)}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ maxWidth: "70%" }}>
                                                <Text style={styles.text1}>{item.partName}</Text>
                                                <Text style={styles.text1}>{item.item}</Text>
                                                <Text style={styles.text1}>{item.partNo}</Text>
                                            </View>
                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={styles.text1}>{rupeeSymbol + " " + item.cost.toFixed(2) + "/-"}</Text>
                                                <IconButton
                                                    icon={item.selected ? "checkbox-marked" : "checkbox-blank-outline"}
                                                    color={item.selected ? Colors.RED : Colors.GRAY}
                                                    size={20}
                                                />
                                            </View>
                                        </View>
                                    </Pressable>
                                    <Text style={GlobalStyle.underline}></Text>
                                </View>
                            )
                        }}
                    />
                    <View style={styles.bottomTextVw}>
                        <Text style={[styles.text3, { fontWeight: '600' }]}>{"Note: "}</Text>
                        <Text style={styles.text3}>{"All Prices are inclusive of all Taxes"}</Text>
                    </View>
                    <View style={styles.actionBtnView}>
                        <Button
                            mode="contained"
                            style={{ width: 120 }}
                            color={Colors.GRAY}
                            labelStyle={{ textTransform: "none" }}
                            onPress={() => navigation.goBack()}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            color={Colors.RED}
                            labelStyle={{ textTransform: "none" }}
                            onPress={addSelected}
                        >
                            Add Selected
                        </Button>
                    </View>
                </View>}
            </View>
        </SafeAreaView>
    )
}

export default PaidAccessoriesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    baseVw: {

    },
    actionBtnView: {
        paddingTop: 20,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    text1: {
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 5
    },
    text2: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 5
    },
    bottomTextVw: {
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 5
    },
    text3: {
        fontSize: 12,
        fontWeight: '400',
        color: Colors.RED
    }
})