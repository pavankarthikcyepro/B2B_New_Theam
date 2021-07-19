import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { ButtonComp } from "../../../components/buttonComp";
import { Checkbox, Button, IconButton } from 'react-native-paper';
import { Colors, GlobalStyle } from '../../../styles';
import { TextinputComp } from '../../../components/textinputComp';
import { DropDownComponant } from '../../../components/dropDownComp';
import { EmsStackIdentifiers } from '../../../navigations/appNavigator';

const screenWidth = Dimensions.get('window').width;


const DropDownSelectionComponant = ({ label, value, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <View style={{ height: 70, backgroundColor: Colors.WHITE, justifyContent: 'flex-end' }}>
                <View style={styles.view3}>
                    <Text style={styles.text3}>{label}</Text>
                    <IconButton
                        icon="menu-down"
                        color={Colors.BLACK}
                        size={30}
                        onPress={() => { }}
                    />
                </View>
                <Text style={{ width: '100%', height: 0.5, backgroundColor: Colors.GRAY }}></Text>
            </View>
        </Pressable>
    )
}

const AddPreEnquiryScreen = ({ navigation }) => {

    const [checked, setChecked] = useState(false);
    const [text, setText] = useState("");
    const [dropdownVisible, setDropDownVisible] = useState(false);
    const [multiDropdownVisible, setMultiDropDownVisible] = useState(false)



    return (
        <SafeAreaView style={styles.container}>

            <DropDownComponant
                visible={dropdownVisible}
                multiple={false}
                selectedItems={(items) => {
                    console.log('selected: ', items);
                    setDropDownVisible(false);
                }}
            />

            <DropDownComponant
                visible={multiDropdownVisible}
                multiple={true}
                selectedItems={(items) => {
                    console.log('selected: ', items);
                    setMultiDropDownVisible(false);
                }}
            />

            <ScrollView
                automaticallyAdjustContentInsets={true}
                bounces={true}
                contentContainerStyle={{ padding: 10 }}
                style={{ flex: 1 }}
            >
                <Text style={styles.text1}>{'Create New Pre-Enquiry'}</Text>
                <View style={styles.view1}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox.Android
                            status={checked ? 'checked' : 'unchecked'}
                            uncheckedColor={Colors.DARK_GRAY}
                            color={Colors.RED}
                            onPress={() => {
                                setChecked(!checked);
                            }}
                        />
                        <Text style={styles.text2}>{'Create enquiry'}</Text>
                    </View>
                    <Button
                        labelStyle={{ fontSize: 12, fontWeight: '400', color: Colors.BLUE, textTransform: 'none' }}
                        onPress={() => { }}
                    >
                        Reset
                    </Button>
                </View>

                <View style={[{ borderRadius: 6, }]}>
                    <TextinputComp
                        style={{ height: 70 }}
                        value={text}
                        label={'First Name'}
                        onChangeText={(text) => setText(text)}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={{ height: 70 }}
                        value={text}
                        label={'Last Name'}
                        onChangeText={(text) => setText(text)}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={{ height: 70 }}
                        value={text}
                        label={'Mobile Number'}
                        onChangeText={(text) => setText(text)}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={{ height: 70 }}
                        value={text}
                        label={'Alternate Mobile Number'}
                        onChangeText={(text) => setText(text)}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={{ height: 70 }}
                        value={text}
                        label={'Email-Id'}
                        onChangeText={(text) => setText(text)}
                    />
                    <Text style={styles.devider}></Text>


                    <DropDownSelectionComponant
                        label={'Select Model'}
                        onPress={() => setDropDownVisible(true)}
                    />
                    <DropDownSelectionComponant
                        label={'Select Enquiry Segment'}
                        onPress={() => setMultiDropDownVisible(true)}
                    />
                    <DropDownSelectionComponant
                        label={'Select Customer Type'}
                        onPress={() => setDropDownVisible(true)}
                    />
                    <DropDownSelectionComponant
                        label={'Select Source of Pre-Enquiry'}
                        onPress={() => setMultiDropDownVisible(true)}
                    />

                    <TextinputComp
                        style={{ height: 70 }}
                        value={text}
                        label={'Pincode'}
                        onChangeText={(text) => setText(text)}
                    />
                    <Text style={styles.devider}></Text>

                </View>

                <View style={styles.view2}>
                    <ButtonComp
                        title={"SUBMIT"}
                        width={screenWidth - 40}
                        onPress={() => navigation.navigate(EmsStackIdentifiers.confirmedPreEnq)}
                    />
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

export default AddPreEnquiryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 10
    },
    text1: {
        fontSize: 16,
        fontWeight: '700',
        paddingLeft: 5
    },
    view1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
    },
    view2: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view3: {
        width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.WHITE
    },
    text2: {
        fontSize: 14,
        fontWeight: '600'
    },
    text3: {
        paddingLeft: 15,
        fontSize: 16,
        fontWeight: '400',
        color: Colors.GRAY
    },
    devider: {
        width: '100%', height: 0.5, backgroundColor: Colors.GRAY
    }
})