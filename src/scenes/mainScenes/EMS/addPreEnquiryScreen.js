import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Dimensions, Pressable, Alert } from 'react-native';
import { ButtonComp } from "../../../components/buttonComp";
import { Checkbox, Button, IconButton } from 'react-native-paper';
import { Colors, GlobalStyle } from '../../../styles';
import { TextinputComp } from '../../../components/textinputComp';
import { DropDownComponant } from '../../../components/dropDownComp';
import { EmsStackIdentifiers } from '../../../navigations/appNavigator';
import {
    clearState,
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
    showSourceOfEnquirySelect,
    createPreEnquiry,
    setCustomerTypeList,
    setCarModalList
} from '../../../redux/addPreEnquiryReducer';
import { useDispatch, useSelector } from 'react-redux';
import { isMobileNumber, isEmail } from '../../../utils/helperFunctions';
import { sales_url } from '../../../networking/endpoints';
import realm from '../../../database/realm';
import { AppNavigator } from '../../../navigations';
import { DropDownSelectionItem } from '../../../pureComponents/dropDownSelectionItem';

const screenWidth = Dimensions.get('window').width;

const AddPreEnquiryScreen = ({ navigation }) => {

    const selector = useSelector(state => state.addPreEnquiryReducer);
    //const { vehicle_modal_list, customer_type_list } = useSelector(state => state.homeReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        getCustomerTypeListFromDB();
        getCarModalListFromDB();
    }, [])

    const getCustomerTypeListFromDB = () => {
        const data = realm.objects('CUSTOMER_TYPE_TABLE');
        dispatch(setCustomerTypeList(JSON.stringify(data)));
    }

    const getCarModalListFromDB = () => {
        const data = realm.objects('CAR_MODAL_LIST_TABLE');
        dispatch(setCarModalList(JSON.stringify(data)));
    }

    useEffect(() => {
        if (selector.status === "success") {
            dispatch(clearState());
            navigation.goBack();
        } else if (selector.errorMsg) {
            Alert.alert('', selector.errorMsg)
        }
    }, [selector.status, selector.errorMsg])

    const submitClicked = () => {

        navigation.navigate(AppNavigator.EmsStackIdentifiers.confirmedPreEnq)
        return;
        if (selector.firstName.length == 0 || selector.mobile.length == 0 || selector.enquiryType.length == 0 || selector.sourceOfEnquiry == 0) {
            Alert.alert('Please fill required fields');
            return
        }

        if (!isMobileNumber(selector.mobile)) {
            Alert.alert('Please enter valid mobile number');
            return
        }

        if (selector.email.length > 0 && !isEmail(selector.email)) {
            Alert.alert('Please enter valid email');
            return
        }

        const owerName = "Kandukuri Sudheer Goud";
        const eventName = "";

        const dmsContactDtoObj = {
            "branchId": "1",
            "createdBy": owerName,
            "customerType": selector.customerType,
            "firstName": selector.firstName,
            "lastName": selector.lastName,
            "modifiedBy": owerName,
            "orgId": "1",
            "phone": selector.mobile,
            "company": selector.companyName,
            "email": selector.email,
            "enquirySource": selector.sourceOfEnquiryId,
            "ownerName": owerName,
            "secondaryPhone": selector.alterMobile,
            "status": "PREENQUIRY"
        }

        const dmsLeadDtoObj = {
            "branchId": "1",
            "createdBy": owerName,
            "enquirySegment": selector.enquiryType,
            "firstName": selector.firstName,
            "lastName": selector.lastName,
            "email": selector.email,
            "leadStage": "PREENQUIRY",
            "organizationId": "1",
            "phone": selector.mobile,
            "model": selector.carModel,
            "sourceOfEnquiry": selector.sourceOfEnquiryId,
            "eventCode": eventName,
            "dmsAddresses": [
                {
                    "addressType": 'Communication',
                    "houseNo": '',
                    "street": '',
                    "city": '',
                    "district": '',
                    "pincode": selector.pincode,
                    "state": '',
                    "village": '',
                    "county": 'India',
                    "rural": false,
                    "urban": true,
                    "id": 0
                },
                {
                    "addressType": 'Permanent',
                    "houseNo": '',
                    "street": '',
                    "city": '',
                    "district": '',
                    "pincode": selector.pincode,
                    "state": '',
                    "village": '',
                    "county": 'India',
                    "rural": false,
                    "urban": true,
                    "id": 0
                }
            ]
        }

        let url = sales_url;
        let formData = {};
        if (selector.customerType === "Individual") {
            url = url + "/contact?allocateDse=" + selector.create_enquiry_checked;
            formData = {
                "dmsContactDto": dmsContactDtoObj,
                "dmsLeadDto": dmsLeadDtoObj
            }
        } else {
            url = url + "/account?allocateDse=" + selector.create_enquiry_checked;
            formData = {
                "dmsAccountDto": dmsContactDtoObj,
                "dmsLeadDto": dmsLeadDtoObj
            }
        }

        let dataObj = {
            url: url,
            body: formData
        }
        dispatch(createPreEnquiry(dataObj));
    }

    return (
        <SafeAreaView style={styles.container}>

            {/* // select modal */}
            <DropDownComponant
                visible={selector.show_model_drop_down}
                headerTitle={'Select Model'}
                data={selector.vehicle_modal_list}
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
                data={selector.customer_type_list}
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
                    dispatch(setSourceOfEnquiry(item))
                }}
            />

            <ScrollView
                automaticallyAdjustContentInsets={true}
                bounces={true}
                showsVerticalScrollIndicator={false}
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
                        style={styles.textInputComp}
                        value={selector.firstName}
                        label={'First Name*'}
                        onChangeText={(text) => dispatch(setFirstName(text))}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={styles.textInputComp}
                        value={selector.lastName}
                        label={'Last Name'}
                        onChangeText={(text) => dispatch(setLastName(text))}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={styles.textInputComp}
                        value={selector.mobile}
                        label={'Mobile Number*'}
                        keyboardType={'phone-pad'}
                        onChangeText={(text) => dispatch(setMobile(text))}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={styles.textInputComp}
                        value={selector.alterMobile}
                        label={'Alternate Mobile Number'}
                        keyboardType={'phone-pad'}
                        onChangeText={(text) => dispatch(setAlterMobile(text))}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={styles.textInputComp}
                        value={selector.email}
                        label={'Email-Id'}
                        keyboardType={'email-address'}
                        onChangeText={(text) => dispatch(setEmail(text))}
                    />
                    <Text style={styles.devider}></Text>


                    <DropDownSelectionItem
                        label={'Select Model*'}
                        value={selector.carModel}
                        onPress={() => dispatch(showModelSelect())}
                    />
                    <DropDownSelectionItem
                        label={'Select Enquiry Segment*'}
                        value={selector.enquiryType}
                        onPress={() => dispatch(showEnquirySegmentSelect())}
                    />
                    <DropDownSelectionItem
                        label={'Select Customer Type'}
                        value={selector.customerType}
                        onPress={() => dispatch(showCustomerTypeSelect())}
                    />

                    {selector.customerType === "Corporate" || selector.customerType === "Government" || selector.customerType === "Retired" || selector.customerType === "Fleet" || selector.customerType === "Institution" ? <View>
                        <TextinputComp
                            style={styles.textInputComp}
                            value={selector.companyName}
                            label={'Company Name'}
                            onChangeText={(text) => dispatch(setCompanyName(text))}
                        />
                        <Text style={styles.devider}></Text>
                    </View> : null}

                    {selector.customerType === "Other" ? <View>
                        <TextinputComp
                            style={styles.textInputComp}
                            value={selector.companyName}
                            label={'Other'}
                            onChangeText={(text) => dispatch(setCompanyName(text))}
                        />
                        <Text style={styles.devider}></Text>
                    </View> : null}

                    <DropDownSelectionItem
                        label={'Select Source of Pre-Enquiry*'}
                        value={selector.sourceOfEnquiry}
                        onPress={() => dispatch(showSourceOfEnquirySelect())}
                    />

                    <TextinputComp
                        style={styles.textInputComp}
                        value={selector.pincode}
                        label={'Pincode'}
                        keyboardType={'number-pad'}
                        onChangeText={(text) => dispatch(setPincode(text))}
                    />
                    <Text style={styles.devider}></Text>

                </View>

                <View style={styles.view2}>
                    <ButtonComp
                        disabled={selector.isLoading}
                        title={"SUBMIT"}
                        width={screenWidth - 40}
                        onPress={submitClicked}
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
    text2: {
        fontSize: 14,
        fontWeight: '600'
    },
    devider: {
        width: '100%', height: 0.5, backgroundColor: Colors.GRAY
    },
    textInputComp: {
        height: 65
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