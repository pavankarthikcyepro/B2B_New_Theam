import React, { useState } from 'react';
import { Modal, SafeAreaView, StyleSheet, View, Dimensions, Text, TouchableOpacity, FlatList, Pressable } from 'react-native';
import { Colors, GlobalStyle } from '../styles';
import { IconButton, Checkbox, Button, RadioButton } from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;

const dummyData = [
    {
        title: "Sort By",
        subtitle: "Category, Hot"
    },
    {
        title: "Model",
        subtitle: ""
    },
    {
        title: "Source of enquiry",
        subtitle: ""
    },
    {
        title: "Due date",
        subtitle: ""
    },
    {
        title: "Status of enquiry",
        subtitle: ""
    }
]

const radioDummyData = [
    {
        id: '1',
        name: 'Date Created'
    },
    {
        id: '2',
        name: 'A to Z'
    },
    {
        id: '3',
        name: 'Category'
    },
    {
        id: '4',
        name: 'Recently Updated'
    }
]

const SortAndFilterComp = ({ visible = false, onRequestClose }) => {

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedRadioIndex, setSelectedRadioIndex] = useState("1");

    return (
        <Modal
            animationType={'slide'}
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}
        >
            <View style={styles.container}>
                <View style={{ backgroundColor: Colors.WHITE }}>
                    <SafeAreaView >
                        <View style={{ backgroundColor: Colors.WHITE }}>
                            <View style={styles.view1}>
                                <Text style={styles.text1}>{'Sort and Filter'}</Text>
                                <IconButton
                                    icon={'close'}
                                    color={Colors.DARK_GRAY}
                                    size={20}
                                    onPress={onRequestClose}
                                />
                            </View>
                            <Text style={GlobalStyle.underline}></Text>
                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                {/* // Left Menu */}
                                <View style={{ width: '35%', backgroundColor: Colors.LIGHT_GRAY }}>
                                    <FlatList
                                        data={dummyData}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <Pressable onPress={() => setSelectedIndex(index)}>
                                                    <View style={[styles.itemView, { backgroundColor: selectedIndex === index ? Colors.WHITE : Colors.LIGHT_GRAY }]}>
                                                        <Text style={styles.text2}>{item.title}</Text>
                                                        {item.subtitle ? <Text style={styles.text3}>{item.subtitle}</Text> : null}
                                                    </View>
                                                </Pressable>
                                            )
                                        }}
                                    />
                                </View>
                                {/* // Right Content */}
                                <View style={{ width: '65%', backgroundColor: Colors.WHITE }}>
                                    <RadioButton.Group onValueChange={newValue => setSelectedRadioIndex(newValue)} value={selectedRadioIndex}>
                                        {radioDummyData.map((radioItem, index) => {
                                            return (
                                                <View key={index} style={styles.radiobuttonVw}>
                                                    <RadioButton.Android value={radioItem.id} color={Colors.RED} uncheckedColor={Colors.GRAY} />
                                                    <Text style={[styles.radioText, { color: selectedRadioIndex == radioItem.id ? Colors.DARK_GRAY : Colors.GRAY }]}>{radioItem.name}</Text>
                                                </View>
                                            )
                                        })}
                                    </RadioButton.Group>
                                </View>
                            </View>
                            <Text style={GlobalStyle.underline}></Text>
                            <View style={styles.view2}>
                                <Button
                                    mode="text"
                                    color={Colors.RED}
                                    contentStyle={{ paddingHorizontal: 20 }}
                                    labelStyle={{ textTransform: 'none', fontSize: 16, fontWeight: '600' }}
                                    onPress={() => console.log('Pressed')}
                                >
                                    Clear All
                                </Button>
                                <Button
                                    mode="contained"
                                    color={Colors.RED}
                                    contentStyle={{ paddingHorizontal: 20 }}
                                    labelStyle={{ textTransform: 'none', fontSize: 14, fontWeight: '600' }}
                                    onPress={() => console.log('Pressed')}
                                >
                                    Apply
                                </Button>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        </Modal>
    )
}

export { SortAndFilterComp };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'column-reverse'
    },
    view1: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 20
    },
    text1: {
        fontSize: 16,
        fontWeight: '600'
    },
    view2: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 50,
        marginTop: 10,
        marginBottom: 25
    },
    itemView: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        justifyContent: 'center'
    },
    text2: {
        fontSize: 14,
        fontWeight: '600'
    },
    text3: {
        textAlign: 'left',
        fontSize: 12,
        fontWeight: '400',
        color: Colors.RED
    },
    radiobuttonVw: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    radioText: {
        fontSize: 14,
        fontWeight: '400'
    }
})