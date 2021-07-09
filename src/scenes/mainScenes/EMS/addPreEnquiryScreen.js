import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

const AddPreEnquiryScreen = () => {

    return (
        <SafeAreaView style={styles.container}>
            <Text>{'Add PreEnquiry Screen'}</Text>
        </SafeAreaView>
    )
}

export default AddPreEnquiryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
})