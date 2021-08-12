import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomerDetails } from '../../../redux/preBookingFormReducer';

const PreBookingFormScreen = () => {

    const selector = useSelector(state => state.preBookingFormReducer);
    const dispatch = useDispatch();

    return (
        <SafeAreaView style={styles.container}>
            <Text>{'Test'}</Text>
        </SafeAreaView>
    )
}

export default PreBookingFormScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})