import React, { useState, useEffect } from 'react';
import { Modal, SafeAreaView, View, Text, StyleSheet, FlatList, Pressable, Dimensions, Platform } from 'react-native';
import { Colors, GlobalStyle } from '../styles';
import { List, Divider, Button } from 'react-native-paper';
import { TextinputComp } from './textinputComp';
import { Dropdown } from "sharingan-rn-modal-dropdown";
import { showToast } from '../utils/toast';

const screenHeight = Dimensions.get('window').height;
const tableHeight = screenHeight / 2;

const data = [
    {
        value: '2 Wheeler',
        label: '2 Wheeler',
    },
    {
        value: '3 Wheeler',
        label: '3 Wheeler',
    },
    {
        value: '4 Wheeler',
        label: '4 Wheeler',
    },
    {
        value: 'Other',
        label: 'Other',
    },
];

const SelectOtherVehicleComponant = ({ visible = false, onRequestClose, saveCallback }) => {

    const [vehicleType, setVehicleType] = useState('');
    const [regNumber, setRegNumber] = useState("");

    const onChangeSS = (value) => {
        setVehicleType(value);
    };

    const saveClicked = () => {
        if (vehicleType.length === 0) {
            showToast("Please select vehicle type");
            return
        }
        if (regNumber.length === 0) {
            showToast("Please enter registration number");
            return
        }
        saveCallback(vehicleType, regNumber);
    }

    return (
        <Modal
            animationType={'fade'}
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}
        >
            <View style={styles.conatiner}>
                <View style={{ backgroundColor: Colors.WHITE }}>
                    <SafeAreaView >
                        <View style={styles.view1}>
                            <View style={styles.view2}>
                                <Text style={styles.text1}>{"Other Vehicle Details"}</Text>
                            </View>

                            <View style={{ paddingVertical: 20 }}>
                                <View style={{ height: 60 }}>
                                    <Dropdown
                                        label="Select Vehicle Type"
                                        data={data}
                                        value={vehicleType}
                                        onChange={onChangeSS}
                                    />
                                </View>
                                <TextinputComp
                                    style={{ height: 65, width: "100%" }}
                                    value={regNumber}
                                    label={"Reg. No."}
                                    onChangeText={(text) => setRegNumber(text)}
                                />
                                <Text style={GlobalStyle.underline}></Text>
                            </View>

                            <View style={styles.view3}>
                                <Button
                                    mode="contained"
                                    style={{ width: 100 }}
                                    color={Colors.GRAY}
                                    labelStyle={{ textTransform: 'none', color: Colors.WHITE }}
                                    onPress={onRequestClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    mode="contained"
                                    color={Colors.RED}
                                    style={{ width: 100 }}
                                    labelStyle={{ textTransform: 'none', color: Colors.WHITE }}
                                    onPress={saveClicked}
                                >
                                    SAVE
                                </Button>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        </Modal>
    )
}

export { SelectOtherVehicleComponant };

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    view1: {
        borderRadius: 10,
        // overflow: 'hidden',
        backgroundColor: Colors.WHITE
    },
    view2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.LIGHT_GRAY,
        height: 50,
        width: '100%',
        paddingLeft: 15
    },
    text1: {
        fontSize: 18,
        fontWeight: '600',
    },
    view3: {
        paddingTop: 25,
        paddingBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    dropdownContainer: {
        height: 60,
    },
})

