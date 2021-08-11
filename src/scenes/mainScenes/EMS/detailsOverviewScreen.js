import React, { useState, useEffect, useLayoutEffect } from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    Pressable
} from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import { Colors, GlobalStyle } from "../../../styles";
import VectorImage from "react-native-vector-image";
import {
    MODEL_SELECTION,
    COMMUNICATION_DETAILS,
    CUSTOMER_PROFILE,
    FINANCE_DETAILS,
    DOCUMENT_UPLOAD,
    CUSTOMER_NEED_ANALYSIS,
    PERSONAL_DETAILS,
} from "../../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import { TextinputComp, DropDownComponant, DatePickerComponent } from "../../../components";
import { DropDownSelectionItem } from "../../../pureComponents/dropDownSelectionItem";
import {
    setEditable,
    setDatePicker,
    setDropDown,
    setPersonalIntro,
    setCommunicationAddress,
    setCustomerProfile,
    updateSelectedDropDownData,
    updateSelectedDate,
    setModelDropDown
} from '../../../redux/enquiryDetailsOverViewSlice';
import { RadioTextItem } from '../../../pureComponents';

const CustomerAccordianHeaderView = ({ leftIcon, title, isSelected, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 50, backgroundColor: isSelected ? Colors.RED : Colors.WHITE }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton
                        icon={leftIcon}
                        color={isSelected ? Colors.WHITE : Colors.RED}
                        size={20}
                        style={{ paddingRight: 0 }}
                    />
                    <Text style={[styles.accordianTitleStyle, { color: isSelected ? Colors.WHITE : Colors.DARK_GRAY }]}>{title}</Text>
                </View>
                <IconButton
                    icon={"menu-down"}
                    color={isSelected ? Colors.WHITE : Colors.BLACK}
                    size={25}
                    style={{ marginLeft: 10 }}
                />
            </View>
        </Pressable>
    )
}

const DetailsOverviewScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const selector = useSelector(state => state.enquiryDetailsOverViewReducer);
    const [text, setText] = React.useState("");
    const [openAccordian, setOpenAccordian] = useState(0);
    const [value, setValue] = React.useState('first');


    const updateAccordian = (index) => {
        if (index != openAccordian) {
            setOpenAccordian(index);
        } else {
            setOpenAccordian(0);
        }
    }

    return (
        <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>

            {selector.showDropDownpicker && <DropDownComponant
                visible={selector.showDropDownpicker}
                headerTitle={selector.dropDownTitle}
                data={selector.dropDownData}
                keyId={selector.dropDownKeyId}
                selectedItems={(item, keyId) => {
                    console.log("selected: ", item, keyId);
                    dispatch(updateSelectedDropDownData({ id: item.id, name: item.name, keyId: keyId }))
                }}
            />}

            {selector.showDatepicker && <DatePickerComponent
                visible={selector.showDatepicker}
                mode={'date'}
                value={new Date(Date.now())}
                onChange={(event, selectedDate) => {
                    console.log('date: ', selectedDate)
                    if (Platform.OS === "android") {
                        // setDatePickerVisible(false)
                    }
                    dispatch(updateSelectedDate({ key: "", text: selectedDate }));
                }}
                onRequestClose={() => dispatch(setDatePicker())}
            />}

            <View style={styles.view1}>
                <Text style={styles.titleText}>{'Details Overview'}</Text>
                <IconButton
                    icon={selector.enableEdit ? "account-edit" : "account-edit-outline"}
                    color={Colors.DARK_GRAY}
                    size={30}
                    style={{ paddingRight: 0 }}
                    onPress={() => dispatch(setEditable())}
                />
            </View>


            {/* // 1. Personal Intro */}
            <ScrollView
                automaticallyAdjustContentInsets={true}
                bounces={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 10 }}
                style={{ flex: 1 }}
            >
                <View style={styles.baseVw}>
                    <View style={[styles.accordianBckVw, { marginTop: 0 }]}>
                        <CustomerAccordianHeaderView
                            title={'Personal Intro'}
                            leftIcon={"account-edit"}
                            isSelected={openAccordian == 1 ? true : false}
                            onPress={() => updateAccordian(1)}
                        />
                        <View style={{ width: "100%", height: openAccordian == 1 ? null : 0, overflow: 'hidden' }}>
                            <DropDownSelectionItem
                                label={"Salutation*"}
                                value={selector.salutaion}
                                onPress={() => dispatch(setDropDown("SALUTATION"))}
                            />
                            <DropDownSelectionItem
                                label={"Gender*"}
                                value={selector.gender}
                                onPress={() => dispatch(setDropDown("GENDER"))}
                            />
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.firstName}
                                label={"First Name*"}
                                onChangeText={(text) => dispatch(setPersonalIntro({ key: "FIRST_NAME", text: text }))}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.lastName}
                                label={"Last Name*"}
                                onChangeText={(text) => dispatch(setPersonalIntro({ key: "LAST_NAME", text: text }))}
                            />
                            <Text style={GlobalStyle.underline}></Text>

                            <DropDownSelectionItem
                                label={"Relation*"}
                                value={selector.relation}
                                onPress={() => dispatch(setDropDown("RELATION"))}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.relationName}
                                label={"Relation Name*"}
                                onChangeText={(text) => dispatch(setPersonalIntro({ key: "RELATION_NAME", text: text }))}
                            />
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.mobile}
                                label={"Mobile Number*"}
                                onChangeText={(text) => dispatch(setPersonalIntro({ key: "MOBILE", text: text }))}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.alterMobile}
                                label={"Alternate Mobile Number*"}
                                onChangeText={(text) => dispatch(setPersonalIntro({ key: "ALTER_MOBILE", text: text }))}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.email}
                                label={"Email ID*"}
                                onChangeText={(text) => dispatch(setPersonalIntro({ key: "EMAIL", text: text }))}
                            />
                            <Text style={GlobalStyle.underline}></Text>

                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.dateOfBirth}
                                label={"Date Of Birth"}
                                disabled={true}
                                onPressIn={() => dispatch(setDatePicker("DATE_OF_BIRTH"))}
                                showRightIcon={true}
                                rightIconObj={{
                                    name: "calendar-range",
                                    color: Colors.GRAY,
                                }}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.anniversaryDate}
                                label={"Anniversary Date"}
                                disabled={true}
                                onPressIn={() => dispatch(setDatePicker("ANNIVERSARY_DATE"))}
                                showRightIcon={true}
                                rightIconObj={{
                                    name: "calendar-range",
                                    color: Colors.GRAY,
                                }}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                        </View>
                    </View>

                    {/* // 2.Communication Address */}
                    <View style={[styles.accordianBckVw]}>
                        <CustomerAccordianHeaderView
                            title={'Communicaton Address'}
                            leftIcon={"account-edit"}
                            isSelected={openAccordian == 2 ? true : false}
                            onPress={() => updateAccordian(2)}
                        />
                        <View style={{ width: "100%", height: openAccordian == 2 ? null : 0, overflow: 'hidden' }}>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.pincode}
                                label={"Pincode*"}
                                onChangeText={(text) => dispatch(setCommunicationAddress({ key: "PINCODE", text: text }))}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <View style={styles.radioGroupBcVw}>
                                <RadioTextItem
                                    label={'Urban'}
                                    value={'urban'}
                                    status={selector.urban_or_rural === 1 ? true : false}
                                    onPress={() => dispatch(setCommunicationAddress({ key: "RURAL_URBAN", text: "1" }))}
                                />
                                <RadioTextItem
                                    label={'Rural'}
                                    value={'rural'}
                                    status={selector.urban_or_rural === 2 ? true : false}
                                    onPress={() => dispatch(setCommunicationAddress({ key: "RURAL_URBAN", text: "2" }))}
                                />
                            </View>
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.houseNum}
                                label={"H.No*"}
                                onChangeText={(text) => dispatch(setCommunicationAddress({ key: "HOUSE_NO", text: text }))}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.streetName}
                                label={"Street Name*"}
                                onChangeText={(text) => dispatch(setCommunicationAddress({ key: "STREET_NAME", text: text }))}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.village}
                                label={"Village*"}
                                onChangeText={(text) => dispatch(setCommunicationAddress({ key: "VILLAGE", text: text }))}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.city}
                                label={"City*"}
                                onChangeText={(text) => dispatch(setCommunicationAddress({ key: "CITY", text: text }))}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.district}
                                label={"District*"}
                                onChangeText={(text) => dispatch(setCommunicationAddress({ key: "DISTRICT", text: text }))}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.state}
                                label={"State*"}
                                onChangeText={(text) => dispatch(setCommunicationAddress({ key: "STATE", text: text }))}
                            />

                            {/* // Permanent Addresss */}
                            <View style={styles.radioGroupBcVw}>
                                <Text style={styles.permanentAddText}>{'Permanent Address'}</Text>
                                <Checkbox.Android
                                    uncheckedColor={Colors.GRAY}
                                    color={Colors.RED}
                                    status={selector.permanent_address ? 'checked' : 'unchecked'}
                                    onPress={() => dispatch(setCommunicationAddress({ key: "PERMANENT_ADDRESS", text: "" }))}
                                />
                            </View>

                            {selector.permanent_address && <View>
                                <TextinputComp
                                    style={{ height: 65, width: "100%" }}
                                    value={selector.p_pincode}
                                    label={"Pincode*"}
                                    onChangeText={(text) => dispatch(setCommunicationAddress({ key: "P_PINCODE", text: text }))}
                                />
                                <Text style={GlobalStyle.underline}></Text>

                                <View style={styles.radioGroupBcVw}>
                                    <RadioTextItem
                                        label={'Urban'}
                                        value={'urban'}
                                        status={selector.p_urban_or_rural === 1 ? true : false}
                                        onPress={() => dispatch(setCommunicationAddress({ key: "P_RURAL_URBAN", text: "1" }))}
                                    />
                                    <RadioTextItem
                                        label={'Rural'}
                                        value={'rural'}
                                        status={selector.p_urban_or_rural === 2 ? true : false}
                                        onPress={() => dispatch(setCommunicationAddress({ key: "P_RURAL_URBAN", text: "2" }))}
                                    />
                                </View>
                                <Text style={GlobalStyle.underline}></Text>

                                <TextinputComp
                                    style={{ height: 65, width: "100%" }}
                                    label={"H.No*"}
                                    value={selector.p_houseNum}
                                    onChangeText={(text) => dispatch(setCommunicationAddress({ key: "P_HOUSE_NO", text: text }))}
                                />
                                <Text style={GlobalStyle.underline}></Text>
                                <TextinputComp
                                    style={{ height: 65, width: "100%" }}
                                    label={"Street Name*"}
                                    value={selector.p_streetName}
                                    onChangeText={(text) => dispatch(setCommunicationAddress({ key: "P_STREET_NAME", text: text }))}
                                />
                                <Text style={GlobalStyle.underline}></Text>
                                <TextinputComp
                                    style={{ height: 65, width: "100%" }}
                                    value={selector.p_village}
                                    label={"Village*"}
                                    onChangeText={(text) => dispatch(setCommunicationAddress({ key: "P_VILLAGE", text: text }))}
                                />
                                <Text style={GlobalStyle.underline}></Text>
                                <TextinputComp
                                    style={{ height: 65, width: "100%" }}
                                    value={selector.p_city}
                                    label={"City*"}
                                    onChangeText={(text) => dispatch(setCommunicationAddress({ key: "P_CITY", text: text }))}
                                />
                                <Text style={GlobalStyle.underline}></Text>
                                <TextinputComp
                                    style={{ height: 65, width: "100%" }}
                                    value={selector.p_district}
                                    label={"District*"}
                                    onChangeText={(text) => dispatch(setCommunicationAddress({ key: "P_DISTRICT", text: text }))}
                                />
                                <Text style={GlobalStyle.underline}></Text>
                                <TextinputComp
                                    style={{ height: 65, width: "100%" }}
                                    value={selector.p_state}
                                    label={"State*"}
                                    onChangeText={(text) => dispatch(setCommunicationAddress({ key: "P_STATE", text: text }))}
                                />
                                <Text style={GlobalStyle.underline}></Text>
                            </View>}
                        </View>
                    </View>

                    {/* // 3.Modal Selction */}
                    <View style={[styles.accordianBckVw]}>
                        <CustomerAccordianHeaderView
                            title={'Modal Selection'}
                            leftIcon={"account-edit"}
                            isSelected={openAccordian == 3 ? true : false}
                            onPress={() => updateAccordian(3)}
                        />
                        <View style={{ width: "100%", height: openAccordian == 3 ? null : 0, overflow: 'hidden' }}>
                            <DropDownSelectionItem
                                label={"Model*"}
                                value={selector.model}
                                onPress={() => dispatch(setModelDropDown("MODEL"))}
                            />
                            <DropDownSelectionItem
                                label={"Varient*"}
                                value={selector.varient}
                                onPress={() => dispatch(setModelDropDown("VARIENT"))}
                            />
                            <DropDownSelectionItem
                                label={"Color*"}
                                value={selector.color}
                                onPress={() => dispatch(setModelDropDown("COLOR"))}
                            />
                            <DropDownSelectionItem
                                label={"Fuel Type*"}
                                value={selector.fuel_type}
                                onPress={() => dispatch(setModelDropDown("FUEL_TYPE"))}
                            />
                            <DropDownSelectionItem
                                label={"Transmission Type*"}
                                value={selector.transmission_type}
                                onPress={() => dispatch(setModelDropDown("TRANSMISSION_TYPE"))}
                            />
                        </View>
                    </View>

                    {/* // 4.Customer Profile */}
                    <View style={[styles.accordianBckVw]}>
                        <CustomerAccordianHeaderView
                            title={'Customer Profile'}
                            leftIcon={"account-edit"}
                            isSelected={openAccordian == 4 ? true : false}
                            onPress={() => updateAccordian(4)}
                        />
                        <View style={{ width: "100%", height: openAccordian == 4 ? null : 0, overflow: 'hidden' }}>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.occupation}
                                label={"Occupation*"}
                                onChangeText={(text) => dispatch(setCustomerProfile({ key: "OCCUPATION", text: text }))}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={selector.designation}
                                label={"Designation*"}
                                onChangeText={(text) => dispatch(setCustomerProfile({ key: "DESIGNATION", text: text }))}
                            />
                            <Text style={GlobalStyle.underline}></Text>

                            <DropDownSelectionItem
                                label={"Enquiry Segment*"}
                                value={selector.enquiry_segment}
                                onPress={() => dispatch(setDropDown("ENQUIRY_SEGMENT"))}
                            />
                            <DropDownSelectionItem
                                label={"Customer Type*"}
                                value={selector.customer_type}
                                onPress={() => dispatch(setDropDown("CUSTOMER_TYPE"))}
                            />
                            <DropDownSelectionItem
                                label={"Source Of Enquiry*"}
                                value={selector.source_of_enquiry}
                                onPress={() => dispatch(setDropDown("SOURCE_OF_ENQUIRY"))}
                            />
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                label={"Expected Date"}
                                value={selector.expected_date}
                                disabled={true}
                                onPressIn={() => dispatch(setDatePicker("EXPECTED_DATE"))}
                                showRightIcon={true}
                                rightIconObj={{
                                    name: "calendar-range",
                                    color: Colors.GRAY,
                                }}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <DropDownSelectionItem
                                label={"Enquiry Category*"}
                                value={selector.enquiry_category}
                                onPress={() => dispatch(setDropDown("ENQUIRY_CATEGORY"))}
                            />
                            <DropDownSelectionItem
                                label={"Buyer Type*"}
                                value={selector.buyer_type}
                                onPress={() => dispatch(setDropDown("BUYER_TYPE"))}
                            />
                            <DropDownSelectionItem
                                label={"KMs Travelled in Month*"}
                                value={selector.kms_travelled_month}
                                onPress={() => dispatch(setDropDown("KMS_TRAVELLED"))}
                            />
                            <DropDownSelectionItem
                                label={"Who Drives*"}
                                value={selector.who_drives}
                                onPress={() => dispatch(setDropDown("WHO_DRIVES"))}
                            />
                            <DropDownSelectionItem
                                label={"Members*"}
                                value={selector.members}
                                onPress={() => dispatch(setDropDown("MEMBERS"))}
                            />
                            <DropDownSelectionItem
                                label={"What is prime expectation from the car*"}
                                value={selector.prime_expectation_from_car}
                                onPress={() => dispatch(setDropDown("PRIME_EXPECTATION_CAR"))}
                            />
                        </View>
                    </View>

                    {/* // 5.Financial Details */}
                    <View style={[styles.accordianBckVw]}>
                        <CustomerAccordianHeaderView
                            title={'Financial Details'}
                            leftIcon={"account-edit"}
                            isSelected={openAccordian == 5 ? true : false}
                            onPress={() => updateAccordian(5)}
                        />
                        <View style={{ width: "100%", height: openAccordian == 5 ? null : 0, overflow: 'hidden' }}>
                            <DropDownSelectionItem
                                label={"Retail Finance*"}
                                value={"Cash"}
                                onPress={() => { }}
                            />
                        </View>
                    </View>

                    {/* // 6.Upload Documents */}
                    <View style={[styles.accordianBckVw]}>
                        <CustomerAccordianHeaderView
                            title={'Upload Documents'}
                            leftIcon={"account-edit"}
                            isSelected={openAccordian == 6 ? true : false}
                            onPress={() => updateAccordian(6)}
                        />
                        <View style={{ width: "100%", height: openAccordian == 6 ? null : 0, overflow: 'hidden' }}>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={text}
                                label={"Pan*"}
                                onChangeText={(text) => setText(text)}
                            />
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={text}
                                label={"Pan Number*"}
                                onChangeText={(text) => setText(text)}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={text}
                                label={"Aadhaar*"}
                                onChangeText={(text) => setText(text)}
                            />
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={text}
                                label={"Aadhaar Number*"}
                                onChangeText={(text) => setText(text)}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                        </View>
                    </View>

                    {/* // 7.Customer Need Analysis */}
                    <View style={[styles.accordianBckVw, {}]}>
                        <CustomerAccordianHeaderView
                            title={'Customer Need Analysis'}
                            leftIcon={"account-edit"}
                            isSelected={openAccordian == 7 ? true : false}
                            onPress={() => updateAccordian(7)}
                        />
                        <View style={{ width: "100%", height: openAccordian == 7 ? null : 0, overflow: 'hidden' }}>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={text}
                                label={"Looking for any other Brand*"}
                                onChangeText={(text) => setText(text)}
                            />
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={text}
                                label={"Voice of customer remarks*"}
                                onChangeText={(text) => setText(text)}
                            />
                            <Text style={GlobalStyle.underline}></Text>

                            <DropDownSelectionItem
                                label={""}
                                value={"Make"}
                                onPress={() => { }}
                            />
                            <DropDownSelectionItem
                                label={""}
                                value={"Model"}
                                onPress={() => { }}
                            />
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={"Variant"}
                                label={""}
                                onChangeText={(text) => setText(text)}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={"Color"}
                                label={""}
                                onChangeText={(text) => setText(text)}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <DropDownSelectionItem
                                label={"Fuel Type"}
                                value={""}
                                onPress={() => { }}
                            />
                            <DropDownSelectionItem
                                label={"Transmission Type"}
                                value={""}
                                onPress={() => { }}
                            />
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={"Price Range "}
                                label={""}
                                onChangeText={(text) => setText(text)}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={"On Road Price  "}
                                label={""}
                                onChangeText={(text) => setText(text)}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={"Dealer ship Name "}
                                label={""}
                                onChangeText={(text) => setText(text)}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={"Dealer ship location "}
                                label={""}
                                onChangeText={(text) => setText(text)}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={"Dealership Pending Reason "}
                                label={""}
                                onChangeText={(text) => setText(text)}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                value={"Voice of Customer Remarks "}
                                label={""}
                                onChangeText={(text) => setText(text)}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DetailsOverviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    baseVw: {
        paddingHorizontal: 10,
    },
    shadow: {
        shadowColor: Colors.DARK_GRAY,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 2,
        shadowOpacity: 0.5,
        elevation: 3,
    },
    view1: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 5
    },
    titleText: {
        fontSize: 22,
        fontWeight: '600',
    },
    accordianBckVw: {
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: Colors.LIGHT_GRAY
    },
    accordianTitleStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.BLACK,
    },
    radioGroupBcVw: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 65,
        paddingLeft: 12,
        backgroundColor: Colors.WHITE
    },
    permanentAddText: {
        fontSize: 16,
        fontWeight: '600'
    }
});


// left={(props) => (
                            //   <VectorImage height={25} width={25} source={PERSONAL_DETAILS} />
                            // )}