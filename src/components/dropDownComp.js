import React, { useState } from 'react';
import { Modal, SafeAreaView, View, Text, StyleSheet, FlatList, Pressable, Dimensions } from 'react-native';
import { Colors } from '../styles';
import { List, Divider, Button } from 'react-native-paper';

const screenHeight = Dimensions.get('window').height;
const tableHeight = screenHeight / 2;

const multipleTestData = [
    {
        id: "1",
        name: 'First',
        selected: false,
    },
    {
        id: "2",
        name: 'Second',
        selected: false,
    },
    {
        id: "3",
        name: 'Third',
        selected: false,
    },
    {
        id: "4",
        name: 'Fourth',
        selected: false,
    }
]


const DropDownComponant = ({ visible = false, multiple = false, headerTitle = "Select Data", data = [], selectedItems }) => {

    const [multipleData, setMultipleData] = useState(multipleTestData);

    const itemSelected = (index) => {
        let updatedMultipleData = [...multipleData];
        let obj = updatedMultipleData[index];
        obj.selected = !obj.selected;
        updatedMultipleData[index] = obj;
        setMultipleData(updatedMultipleData);
    }

    const closeModalWithSelectedItem = (item) => {

        if (multiple) {
            let itemsSelected = [];
            multipleData.forEach((value, index) => {
                if (value.selected) {
                    itemsSelected.push(value);
                }
            })
            selectedItems(itemsSelected)
        } else {
            selectedItems(item)
        }
    }

    let estimateTableHeight = data.length * 50;
    let faltListHeight = tableHeight;
    if (estimateTableHeight < tableHeight) {
        faltListHeight = null;
    }

    return (
        <Modal
            animationType={'slide'}
            transparent={true}
            visible={visible}
            onRequestClose={() => { }}
        >
            <View style={styles.conatiner}>
                <View style={{ backgroundColor: Colors.WHITE }}>
                    <SafeAreaView >
                        <View style={styles.view1}>
                            <View style={styles.view2}>
                                <Text style={styles.text1}>{headerTitle}</Text>
                                {multiple ? <Button
                                    labelStyle={{ fontSize: 14, fontWeight: '400', color: Colors.RED, textTransform: 'none' }}
                                    onPress={() => closeModalWithSelectedItem({})}
                                >
                                    Done
                                </Button> : null}

                            </View>

                            {multiple ? <FlatList
                                data={multipleData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Pressable onPress={() => itemSelected(index)}>
                                            <View>
                                                <List.Item
                                                    titleStyle={{ fontSize: 16, fontWeight: '400' }}
                                                    title={item.name}
                                                    description={""}
                                                    titleNumberOfLines={1}
                                                    descriptionEllipsizeMode={'tail'}
                                                    left={props => <List.Icon {...props} icon={item.selected ? "checkbox-marked" : "checkbox-blank-outline"} color={item.selected ? Colors.RED : Colors.GRAY} style={{ margin: 0 }} />}
                                                />
                                                <Divider />
                                            </View>
                                        </Pressable>
                                    )
                                }}
                            /> : <FlatList
                                style={{ height: faltListHeight }}
                                data={data}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Pressable onPress={() => closeModalWithSelectedItem(item)}>
                                            <View>
                                                <List.Item
                                                    titleStyle={{ fontSize: 16, fontWeight: '400' }}
                                                    title={item.name}
                                                    titleNumberOfLines={1}
                                                    descriptionEllipsizeMode={'tail'}
                                                    description={""}
                                                />
                                                <Divider />
                                            </View>
                                        </Pressable>
                                    )
                                }}
                            />}
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        </Modal>
    )
}

export { DropDownComponant };

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    view1: {
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
    }
})

