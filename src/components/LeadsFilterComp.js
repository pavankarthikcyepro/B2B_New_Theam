import React, { useEffect, useState } from "react";
import {
    FlatList,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { Colors } from "../styles";

const LeadsFilterComp = ({
    visible,
    modelList,
    onRequestClose,
    submitCallback,
    cancelClicked,
    onChange,
}) => {
    const [localModelList, setLocalModelList] = useState([]);
    useEffect(() => {
        setLocalModelList([...modelList]);
    }, []);
    useEffect(() => {
        setLocalModelList([...modelList]);
    }, [visible]);

    const itemSelected = (selectedItem, itemIndex) => {
        let modelList = [...localModelList];
        let selectedObject = { ...modelList[itemIndex] };
        selectedObject.checked = !selectedObject.checked;
        modelList[itemIndex] = selectedObject;
        onChange([...modelList]);
        setLocalModelList([...modelList]);
    };

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
                        <View style={{ width: "85%" }}>
                            <Text style={styles.modalText}>{"STATUS"}</Text>
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "gray",
                                    marginBottom: 16,
                                }}
                            />
                            <FlatList
                                key={"CATEGORY_LIST"}
                                data={localModelList.sort((a, b) => a?.id - b?.id)}
                                keyExtractor={(item, index) => item?.id}
                                ListEmptyComponent={() => {
                                    return (<View style={{ alignItems: 'center' }}><Text>{"Data Not Available"}</Text></View>)
                                }}
                                style={{
                                    width: "100%",
                                    height: "70%",
                                    paddingHorizontal: 5,
                                }}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                // onChange(item);
                                                itemSelected(item, index);
                                            }}
                                        >
                                            <View style={styles.radiobuttonVw}>
                                                <Checkbox.Android
                                                    color={Colors.RED}
                                                    status={item.checked ? "checked" : "unchecked"}
                                                />
                                                <Text
                                                    style={[styles.radioText, { color: Colors.BLACK }]}
                                                >
                                                    {item?.subMenu}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "85%",
                                backgroundColor: 'white',
                                paddingVertical: 5
                            }}
                        >
                            <Button
                                mode="text"
                                color={Colors.RED}
                                labelStyle={{
                                    textTransform: "none",
                                    fontSize: 14,
                                    fontWeight: "600",
                                }}
                                onPress={() => {
                                    cancelClicked();
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
};

export { LeadsFilterComp };

const styles = StyleSheet.create({
    // modal view
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
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
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        // width: '60%',
        height: "40%",
        display: "flex",
        justifyContent: "space-evenly",
        width: "85%",
    },
    modalText: {
        textAlign: "center",
        fontSize: 14,
        fontWeight: "700",
        paddingVertical: 15
    },
    radiobuttonVw: {
        flexDirection: "row",
        alignItems: "center",
    },
    radioText: {
        fontSize: 14,
        fontWeight: "400",
    },
});
