import React, {useEffect, useState} from 'react';
import {FlatList, Modal, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button, Checkbox} from "react-native-paper";
import {Colors} from "../styles";

const LeadsFilterComp = ({visible, modelList, onRequestClose, submitCallback, cancelClicked}) => {
    const [localModelList, setLocalModelList] = useState([]);
    useEffect(() => {
        setLocalModelList([...modelList])
    }, []);
    useEffect(() => {
        setLocalModelList([...modelList])
    }, [visible]);

    const itemSelected = (selectedItem, itemIndex) => {
        let modelList = [...localModelList];
        let selectedObject = {...modelList[itemIndex]};
        selectedObject.checked = !selectedObject.checked;
        modelList[itemIndex] = selectedObject;
        setLocalModelList([...modelList]);
    }

    return (
        <View>
            <Modal
                animationType={Platform.OS === "ios" ? "slide" : "fade"}
                transparent={true}
                visible={visible}
                onRequestClose={onRequestClose}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View>
                            <Text style={styles.modalText}>Select lead type</Text>
                            <View style={{height: 0.5, backgroundColor: 'gray', marginBottom: 16}}></View>
                            <FlatList
                                key={"CATEGORY_LIST"}
                                data={localModelList}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item, index}) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => itemSelected(item, index)}
                                        >
                                            <View style={styles.radiobuttonVw}>
                                                <Checkbox.Android
                                                    color={Colors.RED}
                                                    status={
                                                        item.checked ? "checked" : "unchecked"
                                                    }
                                                />
                                                <Text style={[styles.radioText, {color: Colors.BLACK}]}>
                                                    {item.title}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '85%'
                        }}>
                            <Button
                                mode="text"
                                color={Colors.RED}
                                labelStyle={{
                                    textTransform: "none",
                                    fontSize: 14,
                                    fontWeight: "600",
                                }}
                                onPress={() => {
                                    cancelClicked()
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                mode="contained"
                                color={Colors.RED}
                                labelStyle={{
                                    textTransform: "none",
                                    fontSize: 14,
                                    fontWeight: "600",
                                }}
                                onPress={() => submitCallback([...localModelList])}
                            >
                                Apply
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export {LeadsFilterComp};

const styles = StyleSheet.create({

    // modal view
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '60%',
        height: 225,
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    radiobuttonVw: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    radioText: {
        fontSize: 14,
        fontWeight: '400'
    },
})
