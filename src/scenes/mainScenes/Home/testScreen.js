
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Image, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '../../../styles';
import { WebView } from 'react-native-webview';

const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 100) / 2;
const dateFormat = "YYYY-MM-DD";


const TestScreen = ({ navigation }) => {

    useEffect(() => {
    }, [])

    return(
        <SafeAreaView style={styles.container}>
            <WebView
                source={{
                    uri: 'https://ardemoiipl.s3.ap-south-1.amazonaws.com/react-test.html'
                }}
                style={{ marginTop: 20 }}
            />
        </SafeAreaView>
    )
};

export default TestScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.LIGHT_GRAY,
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