import React from 'react';
import { Modal, StyleSheet, View, Dimensions, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../styles';
import { IconButton, Checkbox } from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;

const LoaderComponent = ({ visible = false, onRequestClose }) => {

    return (
        <Modal
            animationType={'slide'}
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}
        >
            <View style={styles.container}>
                <View style={styles.view1}>
                    <ActivityIndicator size="large" color={Colors.RED} />
                    <Text style={styles.text1}>{'We are fetching data from server, please wait until the process completed.'}</Text>
                </View>
            </View>
        </Modal>
    )
}

export default LoaderComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    view1: {
        width: screenWidth - 100,
        height: 200,
        backgroundColor: Colors.WHITE,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    text1: {
        marginTop: 20,
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center'
    }
})