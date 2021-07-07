import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

const SideMenuScreen = () => {


    return (
        <SafeAreaView style={styles.container}>
            <Text>{'TEST'}</Text>
        </SafeAreaView>
    )
}

export default SideMenuScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    }
})