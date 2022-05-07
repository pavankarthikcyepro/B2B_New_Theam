import React from "react";
import { StyleSheet, Text, View, SafeAreaView, SectionList, StatusBar } from "react-native";
import { Colors, GlobalStyle } from "../../styles";
import { useDispatch, useSelector } from 'react-redux';
import { NotificationItem } from '../../pureComponents/notificationItem';
import { Button } from 'react-native-paper';

const PriceScreen = () => {

    const selector = useSelector(state => state.notificationReducer);

    return (
        <SafeAreaView style={styles.container}>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 10,
        backgroundColor: Colors.LIGHT_GRAY
    },
    header: {
        fontSize: 20,
        marginLeft: 10,
        fontWeight: "bold",
        backgroundColor: Colors.gray,
    },
    sectionHeaderVw: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.LIGHT_GRAY
    }
});

export default PriceScreen;
