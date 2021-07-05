
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../styles';
import { HOME_FILL, HOME_LINE } from '../../../assets/svg'; // import SVG

const HomeScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.container}>

            <Text>{'HOME'}</Text>
            {/* <HOME_FILL width={20} height={20} color={'green'} /> */}

        </SafeAreaView>
    )
}

export default HomeScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.WHITE
    },
})