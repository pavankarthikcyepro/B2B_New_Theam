
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../styles';
import { PreEnquiryItem } from '../../../pureComponents/preEnquiryItem';
import { EMSTopTabNavigator } from '../../../navigations/emsTopTabNavigator';

const EmsScreen = ({ navigation }) => {

    return (
        <EMSTopTabNavigator />
    )
}

export default EmsScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.WHITE
    },
})

//     < PreEnquiryItem
// name = { 'Ravinder katta'}
// subName = { 'Something name'}
// date = { '09-674-2632'}
// modelName = { 'Creta'}
//     />
//     <PreEnquiryItem
//         name={'Ravinder2 katta'}
//         subName={'Something name'}
//         date={'09-674-2632'}
//         modelName={'Verna new'}
//     />