import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { ButtonComp } from "../../../components/buttonComp";
import { Checkbox, Button, IconButton } from 'react-native-paper';
import { Colors, GlobalStyle } from '../../../styles';
import { TextinputComp } from '../../../components/textinputComp';
import { DropDownComponant } from '../../../components/dropDownComp';
import { EmsStackIdentifiers } from '../../../navigations/appNavigator';
import {
    setCreateEnquiryCheckbox,
    setFirstName,
    setLastName,
    setMobile,
    setAlterMobile,
    setEmail,
    setPincode,
    setCarModel,
    setEnquiryType,
    setCustomerType,
    setSourceOfEnquiry,
    setCompanyName,
    showModelSelect,
    showCustomerTypeSelect,
    showEnquirySegmentSelect,
    showSourceOfEnquirySelect
} from '../../../redux/addPreEnquirySlice';
import { useDispatch, useSelector } from 'react-redux';


const screenWidth = Dimensions.get('window').width;


const DropDownSelectionComponant = ({ label, value, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <View style={{ height: 70, backgroundColor: Colors.WHITE, justifyContent: 'flex-end' }}>
                {/* <Text style={{ fontSize: 12, fontWeight: '400', color: Colors.GRAY }}>{label}</Text> */}
                <View style={styles.view3}>
                    <Text style={[styles.text3, { color: value ? Colors.BLACK : Colors.GRAY }]}>{value ? value : label}</Text>
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

    const selector = useSelector(state => state.addPreEnquiryReducer);
    const { vehicle_modal_list, customer_type_list } = useSelector(state => state.homeReducer);
    const dispatch = useDispatch();


    return (
        <SafeAreaView style={styles.container}>

            {/* // select modal */}
            <DropDownComponant
                visible={selector.show_model_drop_down}
                headerTitle={'Select Model'}
                data={vehicle_modal_list}
                selectedItems={(item) => {
                    console.log('selected: ', item);
                    dispatch(setCarModel(item.name))
                }}
            />

            {/* // select enquiry segment */}
            <DropDownComponant
                visible={selector.show_enquiry_segment_drop_down}
                headerTitle={'Select Enquiry Segment'}
                data={selector.enquiry_type_list}
                selectedItems={(item) => {
                    console.log('selected: ', item);
                    dispatch(setEnquiryType(item.name))
                }}
            />

            {/* // customer type */}
            <DropDownComponant
                visible={selector.show_customer_type_drop_down}
                headerTitle={'Select Customer Type'}
                data={customer_type_list}
                selectedItems={(item) => {
                    console.log('selected: ', item);
                    dispatch(setCustomerType(item.name))
                }}
            />

            {/* // source of pre-enquiry */}
            <DropDownComponant
                visible={selector.show_source_type_drop_down}
                headerTitle={'Select Source of Pre-Enquiry'}
                data={selector.source_of_enquiry_type_list}
                selectedItems={(item) => {
                    console.log('selected: ', item);
                    dispatch(setSourceOfEnquiry(item.name))
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
                            status={selector.create_enquiry_checked ? 'checked' : 'unchecked'}
                            uncheckedColor={Colors.DARK_GRAY}
                            color={Colors.RED}
                            onPress={() => dispatch(setCreateEnquiryCheckbox())}
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
                        value={selector.firstName}
                        label={'First Name*'}
                        onChangeText={(text) => dispatch(setFirstName(text))}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={{ height: 70 }}
                        value={selector.lastName}
                        label={'Last Name'}
                        onChangeText={(text) => dispatch(setLastName(text))}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={{ height: 70 }}
                        value={selector.mobile}
                        label={'Mobile Number*'}
                        keyboardType={'phone-pad'}
                        onChangeText={(text) => dispatch(setMobile(text))}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={{ height: 70 }}
                        value={selector.alterMobile}
                        label={'Alternate Mobile Number'}
                        keyboardType={'phone-pad'}
                        onChangeText={(text) => dispatch(setAlterMobile(text))}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={{ height: 70 }}
                        value={selector.email}
                        label={'Email-Id'}
                        keyboardType={'email-address'}
                        onChangeText={(text) => dispatch(setEmail(text))}
                    />
                    <Text style={styles.devider}></Text>


                    <DropDownSelectionComponant
                        label={'Select Model*'}
                        value={selector.carModel}
                        onPress={() => dispatch(showModelSelect())}
                    />
                    <DropDownSelectionComponant
                        label={'Select Enquiry Segment*'}
                        value={selector.enquiryType}
                        onPress={() => dispatch(showEnquirySegmentSelect())}
                    />
                    <DropDownSelectionComponant
                        label={'Select Customer Type'}
                        value={selector.customerType}
                        onPress={() => dispatch(showCustomerTypeSelect())}
                    />

                    {selector.customerType === "Corporate" || selector.customerType === "Government" || selector.customerType === "Retired" || selector.customerType === "Fleet" || selector.customerType === "Institution" ? <View>
                        <TextinputComp
                            style={{ height: 70 }}
                            value={selector.companyName}
                            label={'Company Name'}
                            onChangeText={(text) => dispatch(setCompanyName(text))}
                        />
                        <Text style={styles.devider}></Text>
                    </View> : null}

                    {selector.customerType === "Other" ? <View>
                        <TextinputComp
                            style={{ height: 70 }}
                            value={selector.companyName}
                            label={'Other'}
                            onChangeText={(text) => dispatch(setCompanyName(text))}
                        />
                        <Text style={styles.devider}></Text>
                    </View> : null}

                    <DropDownSelectionComponant
                        label={'Select Source of Pre-Enquiry*'}
                        value={selector.sourceOfEnquiry}
                        onPress={() => dispatch(showSourceOfEnquirySelect())}
                    />

                    <TextinputComp
                        style={{ height: 70 }}
                        value={selector.pincode}
                        label={'Pincode'}
                        keyboardType={'number-pad'}
                        onChangeText={(text) => dispatch(setPincode(text))}
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

{/* <DropDownComponant
                visible={multiDropdownVisible}
                multiple={true}
                selectedItems={(items) => {
                    console.log('selected: ', items);
                    setMultiDropDownVisible(false);
                }}
            /> */}