
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../styles';

const MyTasksScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.container}>

            <Text>{'HOME'}</Text>
        </SafeAreaView>
    )
}

export default MyTasksScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.WHITE
    },
})