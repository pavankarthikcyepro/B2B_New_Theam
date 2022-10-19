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

const SingleLeadSelectComp = ({
    visible,
    modelList,
    onRequestClose,
    submitCallback,
    cancelClicked,
    selectAll,
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
        for (let i = 0; i < modelList.length; i++) {
            if (itemIndex === i) {
                modelList[i].checked = true;
            } else {
                modelList[i].checked = false;
            }
        }
        setLocalModelList([...modelList]);
        submitCallback([...modelList]);
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
                            <Text style={styles.modalText}>{"STAGE"}</Text>
                            <View
                                style={{
                                    height: 0.5,
                                    backgroundColor: "gray",
                                    marginBottom: 16,
                                }}
                            />
                            <FlatList
                                key={"CATEGORY_LIST"}
                                data={localModelList}
                                ListEmptyComponent={() => {
                                    return (<View style={{ alignItems: 'center' }}><Text>{"Data Not Available"}</Text></View>)
                                }}
                                keyExtractor={(item, index) => index.toString()}
                                style={{
                                    width: "100%",
                                    height: "70%",
                                    paddingHorizontal: 5,
                                }}
                                renderItem={({ item, index }) => {
                                    if (item?.menu !== "Contact" && item?.status === "Active" && true) {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => itemSelected(item, index)}
                                                style={{ flex: 1, marginVertical: 2, width: "100%" }}
                                            >
                                                <View
                                                    style={{
                                                        ...styles.radiobuttonVw,
                                                        justifyContent: "flex-start",
                                                    }}
                                                >
                                                    <Checkbox.Android
                                                        color={Colors.RED}
                                                        status={item.checked ? "checked" : "unchecked"}
                                                    />
                                                    <Text
                                                        style={[styles.radioText, { color: Colors.BLACK }]}
                                                    >
                                                        {item?.menu}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    }
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
                                marginHorizontal: 5
                            }}
                        >
                            <Button
                                mode="text"
                                color={Colors.RED}
                                labelStyle={{
                                    textTransform: "none",
                                    fontSize: 14,
                                    fontWeight: "600",
                                    alignSelf: "flex-end",
                                }}
                                onPress={() => {
                                    selectAll();
                                    cancelClicked();
                                }}
                            >
                                Remove Filter
                            </Button>
                            <Button
                                mode="text"
                                color={Colors.RED}
                                labelStyle={{
                                    textTransform: "none",
                                    fontSize: 14,
                                    fontWeight: "600",
                                    alignSelf: "flex-end",
                                }}
                                onPress={() => {
                                    cancelClicked();
                                }}
                            >
                                Cancel
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export { SingleLeadSelectComp };

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
        // height: 225,
        display: "flex",
        justifyContent: "space-evenly",
        width: "85%",
        height: "40%",
    },
    modalText: {
        // marginBottom: 15,
        textAlign: "center",
        fontSize: 14,
        fontWeight: "700",
        marginVertical: 15
    },
    radiobuttonVw: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    radioText: {
        fontSize: 14,
        fontWeight: "400",
    },
});
