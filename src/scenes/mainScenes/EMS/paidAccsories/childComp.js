import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View, StyleSheet, Text, FlatList, Pressable } from "react-native";
import { EmptyListView } from "../../../../pureComponents";
import { GlobalStyle, Colors } from "../../../../styles";
import { Button, IconButton } from "react-native-paper";
import * as AsyncStorage from "../../../../asyncStore";
import { AccessoriesContext } from ".";

const rupeeSymbol = "\u20B9";

const ChildComp = ({ route, navigation, }) => {

    const [tableData, setTableData] = useState([]);
    const { accessorylist, key } = route.params;
    const myContext = useContext(AccessoriesContext);

    useEffect(() => {
        console.log("accessorylist: ", accessorylist.length)
        setTableData([...accessorylist]);
    }, [])

    const updatedItem = (index) => {

        const data = [...tableData];
        const selectedItem = data[index];
        const isSelected = selectedItem.selected;
        if (isSelected) {
            removeItemInAsyncStorage(key, selectedItem)
        } else {
            addItemInAsyncStorage(key, selectedItem)
        }
        selectedItem.selected = !isSelected;
        data[index] = selectedItem;
        setTableData([...data]);
    }

    const addItemInAsyncStorage = async (key, item) => {

        const existingData = await AsyncStorage.getData(key);
        console.log("exis: ", existingData);
        let data = [];
        if (!existingData) {
            data = [item];
        } else {
            data = [...JSON.parse(existingData), item];
        }
        await AsyncStorage.storeData(key, JSON.stringify(data))
    }

    const removeItemInAsyncStorage = async (key, item) => {

        const existingData = await AsyncStorage.getData(key);
        console.log("exis1: ", existingData);
        if (!existingData) { return }
        const parsedData = JSON.parse(existingData);
        let newData = [];
        parsedData.forEach((obj) => {
            if (obj.id !== item.id) {
                newData.push(obj)
            }
        })
        await AsyncStorage.storeData(key, JSON.stringify(newData))
    }

    return (
        <View style={{ flex: 1, padding: 5, }}>
            {tableData.length === 0 ? <EmptyListView title={"No Data Found"} /> : <View style={{ flex: 1 }}>
                <FlatList
                    data={tableData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ padding: 10, paddingBottom: 0, backgroundColor: Colors.WHITE }}>
                                <Pressable onPress={() => updatedItem(index)}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 2 }}>
                                        <View style={{ maxWidth: "70%" }}>
                                            <Text style={styles.text2}>{item.partName}</Text>
                                            <Text style={styles.text1}>{item.item}</Text>
                                            <Text style={styles.text1}>{item.partNo}</Text>
                                        </View>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={styles.price()}>{rupeeSymbol + " " + item.cost.toFixed(2) + "/-"}</Text>
                                            <IconButton
                                                icon={item.selected ? "checkbox-marked" : "checkbox-blank-outline"}
                                                color={item.selected ? Colors.RED : Colors.GRAY}
                                                size={20}
                                            />
                                        </View>
                                    </View>
                                </Pressable>
                                <View style={GlobalStyle.underline}></View>
                            </View>
                        )
                    }}
                />
            </View>}
        </View>
    )
}

export default ChildComp;

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
        fontSize: 12,
        fontWeight: '400',
        marginBottom: 3,
        color: Colors.GRAY
    },
    text2: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 5
    },
    price: () => {
        return {
            ...styles.text1,
            marginBottom: 5
        }
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