import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Text, FlatList, Pressable } from "react-native";
import { EmptyListView } from "../../../../pureComponents";
import { GlobalStyle, Colors } from "../../../../styles";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ChildComp from "./childComp";
import { Button, IconButton } from "react-native-paper";
import * as AsyncStorage from "../../../../asyncStore";
import { AppNavigator } from "../../../../navigations";
export const AccessoriesContext = React.createContext();

const TopTab = createMaterialTopTabNavigator();

const tabBarOptions = {
    activeTintColor: Colors.RED,
    inactiveTintColor: Colors.DARK_GRAY,
    indicatorStyle: {
        backgroundColor: Colors.RED,
    },
    labelStyle: {
        fontSize: 14,
        fontWeight: "600",
    },
}

const rupeeSymbol = "\u20B9";

const TopTabNavigator = ({ titles, data }) => {

    return (
        <TopTab.Navigator
            initialRouteName={titles[0]}
            tabBarOptions={tabBarOptions}
        >
            {titles.map((title, index) => {
                console.log("titles: ", title)
                return (
                    <TopTab.Screen
                        name={title}
                        key={"PAID" + index}
                        component={ChildComp}
                        initialParams={{ accessorylist: data[title], key: title.toUpperCase() }}
                        options={{ title: title }}
                    />
                )
            })}

        </TopTab.Navigator>
    );
};

const PaidAccessoriesScreen = ({ route, navigation }) => {

    const { accessorylist, selectedAccessoryList } = route.params;
    const [accessoriesData, setAccessoriesData] = useState({ names: [], data: {} });
    const [defaultContext, setDefaultContext] = useState({});

    useEffect(() => {
        console.log("accessorylist: ", accessorylist.length)
        const titleNames = [];
        const dataObj = {};
        accessorylist.forEach((item) => {
            const newItem = { ...item, selected: false };
            if (titleNames.includes(item.item)) {
                const oldData = dataObj[item.item];
                const newData = [...oldData, newItem];
                dataObj[item.item] = newData;
            } else {
                titleNames.push(item.item.toUpperCase());
                dataObj[item.item] = [newItem];
            }
        })
        setAccessoriesData({ names: titleNames, data: dataObj });
        removeExistingKeysFromAsync(titleNames);
    }, [])

    const removeExistingKeysFromAsync = async (keys) => {
        await AsyncStorage.multiRemove(keys);
    }

    const addSelected = async () => {

        const data = await AsyncStorage.multiGetData(accessoriesData.names);
        // console.log("data: ", data)
        let allData = [];
        accessoriesData.names.forEach((item, index) => {
            const selectedData = data[index][1];
            console.log("selectedData: ", selectedData)
            if (selectedData) {
                allData = allData.concat(JSON.parse(selectedData));
            }
        })
        console.log("allData: ", allData)

        navigation.navigate({
            name: AppNavigator.EmsStackIdentifiers.preBookingForm,
            params: { accessoriesList: allData },
            merge: true,
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            {accessoriesData.names.length === 0 ? <EmptyListView title={"No Data Found"} /> : <View style={{ flex: 1 }}>
                <TopTabNavigator titles={accessoriesData.names} data={accessoriesData.data} />
            </View>}
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