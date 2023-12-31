
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Image, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 100) / 2;
const dateFormat = "YYYY-MM-DD";


const callRecordComp = ({ navigation }) => {

    useEffect(() => {
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <WebView
                source={{
                    uri: 'https://ardemoiipl.s3.ap-south-1.amazonaws.com/call/webphone/click2call.html'
                }}
                style={{ marginTop: 20 }}
                allowsInlineMediaPlayback
                originWhitelist={['*']}
                allowFileAccess
                allowUniversalAccessFromFileURLs
                javaScriptEnabled
                domStorageEnabled
                cacheEnabled={false}
                mediaPlaybackRequiresUserAction={false}
            />

        </SafeAreaView>
    )
};

export default callRecordComp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#000000',
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