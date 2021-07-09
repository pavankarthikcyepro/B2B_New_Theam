import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

const NotificationScreen = () => {

    return (
        <SafeAreaView style={styles.container}>
            <Text>{'Notification'}</Text>
        </SafeAreaView>
    )
}

export default NotificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
})