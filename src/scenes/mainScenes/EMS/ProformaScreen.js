
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Image, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '../../../styles';

const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 100) / 2;
const dateFormat = "YYYY-MM-DD";
import { ProformaComp } from "./components/ProformComp";


const ProformaScreen = ({ route, navigation }) => {

    useEffect(() => {
    }, [])

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView
                automaticallyAdjustContentInsets={true}
                bounces={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingVertical: 10,
                    paddingHorizontal: 5,
                }}
                keyboardShouldPersistTaps={"handled"}
                style={{ flex: 1 }}
            >
            <ProformaComp
               modelDetails={route.params.modelDetails}
               branchId={route.params.branchId}
                universalId={route.params.universalId}
                route={route}
            />
            </ScrollView>
        </SafeAreaView>
    )
};

export default ProformaScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.LIGHT_GRAY,
        marginHorizontal:'2%'
    },
    view3: {
        width: "100%",
        position: "absolute",
        bottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    submitBtnBckVw: {
        width: "100%",
        height: 70,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    }
});