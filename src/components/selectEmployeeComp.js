import React, { useState, useEffect } from 'react';
import { Modal, SafeAreaView, View, Text, StyleSheet, FlatList, Pressable, Dimensions, Platform } from 'react-native';
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
]

const SelectEmployeeComponant = ({ visible = false, headerTitle = "Select Data", data = [], selectedEmployee, onRequestClose }) => {

    const [tabledata, setTabledata] = useState(data);

    useEffect(() => {
        setTabledata(data);
    }, [data]);

    let estimateTableHeight = data.length * 50;
    let faltListHeight = tableHeight;
    if (estimateTableHeight < tableHeight) {
        faltListHeight = null;
    }

    const selectedItem = (item, selectedIndex) => {

        let newTableData = [];
        tabledata.forEach((item, index) => {
            item.selected = index === selectedIndex;
            newTableData.push(item);
        })
        setTabledata([...newTableData]);
    }

    const saveClicked = () => {
        const filterData = tabledata.filter((item, index) => {
            return item.selected === true;
        })
        if (filterData.length > 0) {
            selectedEmployee(filterData[0]);
        }
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
                                <Text style={styles.text1}>{headerTitle}</Text>
                            </View>

                            <FlatList
                                style={{ height: faltListHeight }}
                                data={tabledata}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Pressable onPress={() => selectedItem(item, index)}>
                                            <View>
                                                <List.Item
                                                    titleStyle={{ fontSize: 16, fontWeight: '400' }}
                                                    title={item.name}
                                                    titleNumberOfLines={1}
                                                    descriptionEllipsizeMode={'tail'}
                                                    description={""}
                                                    left={props => <List.Icon {...props} icon={item.selected ? "radiobox-marked" : "radiobox-blank"} style={{ margin: 0 }} />}
                                                />
                                                <Divider />
                                            </View>
                                        </Pressable>
                                    )
                                }}
                            />
                            <View style={styles.view3}>
                                <Button
                                    mode="contained"
                                    style={{ width: 100 }}
                                    color={Colors.BLACK}
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
                                    Allocate
                                </Button>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        </Modal>
    )
}

export { SelectEmployeeComponant };

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
    }
})

