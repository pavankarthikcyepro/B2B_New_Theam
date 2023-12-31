import React, { useState, useEffect, useLayoutEffect } from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    Pressable,
    TouchableOpacity,
    KeyboardAvoidingView,
    FlatList
} from "react-native";
import { Provider, Checkbox, IconButton, List } from "react-native-paper";
import { Colors, GlobalStyle } from "../../../styles";
import VectorImage from "react-native-vector-image";
import { useDispatch, useSelector } from "react-redux";
import {
    TextinputComp,
    DropDownComponant,
    DatePickerComponent,
} from "../../../components";
import { DropDownSelectionItem } from "../../../pureComponents/dropDownSelectionItem";
import {
    setEditable,
    setDatePicker,
    setPersonalIntro,
    setCommunicationAddress,
    setCustomerProfile,
    updateSelectedDate,
    setFinancialDetails,
    setCustomerNeedAnalysis,
    setImagePicker,
    setUploadDocuments,
    setDropDownData
} from '../../../redux/enquiryFormReducer';
import { RadioTextItem, CustomerAccordianHeaderItem, ImageSelectItem, DateSelectItem } from '../../../pureComponents';
import { ImagePickerComponent } from "../../../components";
import { Dropdown } from 'sharingan-rn-modal-dropdown';

const DATA = [
    {
        id: '1',
        title: 'First Item',
        isSelected: false
    },
    {
        id: '2',
        title: 'Second Item',
        isSelected: false
    },
    {
        id: '3',
        title: 'Third Item',
        isSelected: false
    },
    {
        id: '4',
        title: 'First Item',
        isSelected: false
    },
    {
        id: '5',
        title: 'Second Item',
        isSelected: false
    },
    {
        id: '6',
        title: 'Third Item',
        isSelected: false
    },
];

const Item = ({ title }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

const TestEnquiryFormScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const selector = useSelector((state) => state.enquiryFormReducer);
    const [openAccordian, setOpenAccordian] = useState(0);
    const [tabledata, setTabledata] = useState(DATA);
    const [renderdata, setRenderdata] = useState(false);

    useEffect(() => {
        setRenderdata(true);
    }, [])

    const updateAccordian = (index) => {
        if (index != openAccordian) {
            setOpenAccordian(index);
        } else {
            setOpenAccordian(0);
        }
    };


    const renderItem = ({ item }) => (
        <Item title={item.title} />
    );

    if (!renderdata) {
        return null;
    }

    return (

        <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>

            <ImagePickerComponent
                visible={selector.showImagePicker}
                keyId={selector.imagePickerKeyId}
                selectedImage={(data, keyId) => {}}
                onDismiss={() => dispatch(setImagePicker(""))}
            />

            {
                selector.showDatepicker && <DatePickerComponent
                    visible={selector.showDatepicker}
                    mode={'date'}
                    value={new Date(Date.now())}
                    onChange={(event, selectedDate) => {
                        if (Platform.OS === "android") {
                            if (!selectedDate) {
                                dispatch(updateSelectedDate({ key: "NONE", text: selectedDate }));
                            } else {
                                dispatch(updateSelectedDate({ key: "", text: selectedDate }));
                            }
                        } else {
                            dispatch(updateSelectedDate({ key: "", text: selectedDate }));
                        }
                    }}
                    onRequestClose={() => dispatch(setDatePicker())}
                />
            }

            <View style={styles.view1}>
                <Text style={styles.titleText}>{"Details Overview"}</Text>
                <IconButton
                    icon={selector.enableEdit ? "account-edit" : "account-edit-outline"}
                    color={Colors.DARK_GRAY}
                    size={30}
                    style={{ paddingRight: 0 }}
                    onPress={() => dispatch(setEditable())}
                />
            </View>

            <KeyboardAvoidingView
                style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center",
                }}
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                enabled
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    automaticallyAdjustContentInsets={true}
                    bounces={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 10 }}
                    keyboardShouldPersistTaps={"handled"}
                    style={{ flex: 1 }}
                >
                    <View style={styles.baseVw}>

                        <List.Accordion
                            title="First"
                            left={props => <List.Icon {...props} icon="account-edit" style={{ margin: 0, padding: 0 }} />}
                            expanded={openAccordian == 1 ? true : false}
                            onPress={() => updateAccordian(1)}
                        >
                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Salutation"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.salutaion}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "SALUTATION", value: value })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Gender"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    // paperTheme={theme}
                                    value={selector.gender}
                                    onChange={(value) =>
                                        dispatch(setDropDownData({ key: "GENDER", value: value }))
                                    }
                                />
                            </View>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.firstName}
                                label={"First Name*"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setPersonalIntro({ key: "FIRST_NAME", text: text })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.lastName}
                                label={"Last Name*"}
                                onChangeText={(text) =>
                                    dispatch(setPersonalIntro({ key: "LAST_NAME", text: text }))
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Relation"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.relation}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "RELATION", value: value })
                                        )
                                    }
                                />
                            </View>

                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.relationName}
                                label={"Relation Name*"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setPersonalIntro({ key: "RELATION_NAME", text: text })
                                    )
                                }
                            />
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.mobile}
                                label={"Mobile Number*"}
                                onChangeText={(text) =>
                                    dispatch(setPersonalIntro({ key: "MOBILE", text: text }))
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.alterMobile}
                                label={"Alternate Mobile Number*"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setPersonalIntro({ key: "ALTER_MOBILE", text: text })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.email}
                                label={"Email ID*"}
                                onChangeText={(text) =>
                                    dispatch(setPersonalIntro({ key: "EMAIL", text: text }))
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <DateSelectItem
                                label={"Date Of Birth"}
                                value={selector.dateOfBirth}
                                onPress={() => dispatch(setDatePicker("DATE_OF_BIRTH"))}
                            />
                            <DateSelectItem
                                label={"Anniversary Date"}
                                value={selector.anniversaryDate}
                                onPress={() => dispatch(setDatePicker("ANNIVERSARY_DATE"))}
                            />
                        </List.Accordion>
                        <View style={styles.space}></View>

                        <List.Accordion
                            title="First 2"
                            expanded={openAccordian == 2 ? true : false}
                            onPress={() => updateAccordian(2)}
                        >
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.pincode}
                                label={"Pincode*"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCommunicationAddress({ key: "PINCODE", text: text })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <View style={styles.radioGroupBcVw}>
                                <RadioTextItem
                                    label={"Urban"}
                                    value={"urban"}
                                    status={selector.urban_or_rural === 1 ? true : false}
                                    onPress={() =>
                                        dispatch(
                                            setCommunicationAddress({
                                                key: "RURAL_URBAN",
                                                text: "1",
                                            })
                                        )
                                    }
                                />
                                <RadioTextItem
                                    label={"Rural"}
                                    value={"rural"}
                                    status={selector.urban_or_rural === 2 ? true : false}
                                    onPress={() =>
                                        dispatch(
                                            setCommunicationAddress({
                                                key: "RURAL_URBAN",
                                                text: "2",
                                            })
                                        )
                                    }
                                />
                            </View>
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.houseNum}
                                label={"H.No*"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCommunicationAddress({ key: "HOUSE_NO", text: text })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.streetName}
                                label={"Street Name*"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCommunicationAddress({
                                            key: "STREET_NAME",
                                            text: text,
                                        })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.village}
                                label={"Village*"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCommunicationAddress({ key: "VILLAGE", text: text })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.city}
                                label={"City*"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCommunicationAddress({ key: "CITY", text: text })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.district}
                                label={"District*"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCommunicationAddress({ key: "DISTRICT", text: text })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.state}
                                label={"State*"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCommunicationAddress({ key: "STATE", text: text })
                                    )
                                }
                            />

                            {/* // Permanent Addresss */}
                            <View style={styles.radioGroupBcVw}>
                                <Text style={styles.permanentAddText}>
                                    {"Permanent Address"}
                                </Text>
                                <Checkbox.Android
                                    uncheckedColor={Colors.GRAY}
                                    color={Colors.RED}
                                    status={
                                        selector.permanent_address ? "checked" : "unchecked"
                                    }
                                    onPress={() =>
                                        dispatch(
                                            setCommunicationAddress({
                                                key: "PERMANENT_ADDRESS",
                                                text: "",
                                            })
                                        )
                                    }
                                />
                            </View>
                            {selector.permanent_address && (
                                <View>
                                    <TextinputComp
                                        style={styles.textInputStyle}
                                        value={selector.p_pincode}
                                        label={"Pincode*"}
                                        onChangeText={(text) =>
                                            dispatch(
                                                setCommunicationAddress({
                                                    key: "P_PINCODE",
                                                    text: text,
                                                })
                                            )
                                        }
                                    />
                                    <Text style={GlobalStyle.underline}></Text>

                                    <View style={styles.radioGroupBcVw}>
                                        <RadioTextItem
                                            label={"Urban"}
                                            value={"urban"}
                                            status={selector.p_urban_or_rural === 1 ? true : false}
                                            onPress={() =>
                                                dispatch(
                                                    setCommunicationAddress({
                                                        key: "P_RURAL_URBAN",
                                                        text: "1",
                                                    })
                                                )
                                            }
                                        />
                                        <RadioTextItem
                                            label={"Rural"}
                                            value={"rural"}
                                            status={selector.p_urban_or_rural === 2 ? true : false}
                                            onPress={() =>
                                                dispatch(
                                                    setCommunicationAddress({
                                                        key: "P_RURAL_URBAN",
                                                        text: "2",
                                                    })
                                                )
                                            }
                                        />
                                    </View>
                                    <Text style={GlobalStyle.underline}></Text>

                                    <TextinputComp
                                        style={styles.textInputStyle}
                                        label={"H.No*"}
                                        value={selector.p_houseNum}
                                        onChangeText={(text) =>
                                            dispatch(
                                                setCommunicationAddress({
                                                    key: "P_HOUSE_NO",
                                                    text: text,
                                                })
                                            )
                                        }
                                    />
                                    <Text style={GlobalStyle.underline}></Text>
                                    <TextinputComp
                                        style={styles.textInputStyle}
                                        label={"Street Name*"}
                                        value={selector.p_streetName}
                                        onChangeText={(text) =>
                                            dispatch(
                                                setCommunicationAddress({
                                                    key: "P_STREET_NAME",
                                                    text: text,
                                                })
                                            )
                                        }
                                    />
                                    <Text style={GlobalStyle.underline}></Text>
                                    <TextinputComp
                                        style={styles.textInputStyle}
                                        value={selector.p_village}
                                        label={"Village*"}
                                        onChangeText={(text) =>
                                            dispatch(
                                                setCommunicationAddress({
                                                    key: "P_VILLAGE",
                                                    text: text,
                                                })
                                            )
                                        }
                                    />
                                    <Text style={GlobalStyle.underline}></Text>
                                    <TextinputComp
                                        style={styles.textInputStyle}
                                        value={selector.p_city}
                                        label={"City*"}
                                        onChangeText={(text) =>
                                            dispatch(
                                                setCommunicationAddress({ key: "P_CITY", text: text })
                                            )
                                        }
                                    />
                                    <Text style={GlobalStyle.underline}></Text>
                                    <TextinputComp
                                        style={styles.textInputStyle}
                                        value={selector.p_district}
                                        label={"District*"}
                                        onChangeText={(text) =>
                                            dispatch(
                                                setCommunicationAddress({
                                                    key: "P_DISTRICT",
                                                    text: text,
                                                })
                                            )
                                        }
                                    />
                                    <Text style={GlobalStyle.underline}></Text>
                                    <TextinputComp
                                        style={styles.textInputStyle}
                                        value={selector.p_state}
                                        label={"State*"}
                                        onChangeText={(text) =>
                                            dispatch(
                                                setCommunicationAddress({
                                                    key: "P_STATE",
                                                    text: text,
                                                })
                                            )
                                        }
                                    />
                                    <Text style={GlobalStyle.underline}></Text>
                                </View>
                            )}
                        </List.Accordion>
                        <View style={styles.space}></View>

                        <List.Accordion
                            title="First 3"
                            expanded={openAccordian == 3 ? true : false}
                            onPress={() => updateAccordian(3)}
                        >
                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Model"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.model}
                                    onChange={(value) =>
                                        dispatch(setDropDownData({ key: "MODEL", value: value }))
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Varient"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.varient}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "VARIENT", value: value })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Color"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.color}
                                    onChange={(value) =>
                                        dispatch(setDropDownData({ key: "COLOR", value: value }))
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Fuel Type"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.fuel_type}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "FUEL_TYPE", value: value })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Transmission Type"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.transmission_type}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({
                                                key: "TRANSMISSION_TYPE",
                                                value: value,
                                            })
                                        )
                                    }
                                />
                            </View>
                        </List.Accordion>
                        <View style={styles.space}></View>


                        <List.Accordion
                            title="First 4"
                            expanded={openAccordian == 4 ? true : false}
                            onPress={() => updateAccordian(4)}
                        >
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.occupation}
                                label={"Occupation*"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCustomerProfile({ key: "OCCUPATION", text: text })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.designation}
                                label={"Designation*"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCustomerProfile({ key: "DESIGNATION", text: text })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Enquiry Segment"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.enquiry_segment}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({
                                                key: "ENQUIRY_SEGMENT",
                                                value: value,
                                            })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Customer Type"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.customer_type}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "CUSTOMER_TYPE", value: value })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Source Of Enquiry"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.source_of_enquiry}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({
                                                key: "SOURCE_OF_ENQUIRY",
                                                value: value,
                                            })
                                        )
                                    }
                                />
                            </View>

                            <DateSelectItem
                                label={"Expected Date"}
                                value={selector.expected_date}
                                onPress={() => dispatch(setDatePicker("EXPECTED_DATE"))}
                            />

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Enquiry Category"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.enquiry_category}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({
                                                key: "ENQUIRY_CATEGORY",
                                                value: value,
                                            })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Buyer Type"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.buyer_type}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "BUYER_TYPE", value: value })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="KMs Travelled in Month"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.kms_travelled_month}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "KMS_TRAVELLED", value: value })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Who Drives"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.who_drives}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "WHO_DRIVES", value: value })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Members"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.members}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "MEMBERS", value: value })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="What is prime expectation from the car"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.prime_expectation_from_car}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({
                                                key: "PRIME_EXPECTATION_CAR",
                                                value: value,
                                            })
                                        )
                                    }
                                />
                            </View>
                        </List.Accordion>
                        <View style={styles.space}></View>

                        {/* // 5.Financial Details */}
                        <List.Accordion
                            title="First 5"
                            expanded={openAccordian == 5 ? true : false}
                            onPress={() => updateAccordian(5)}
                        >
                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Retail Finance"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.retail_finance}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "RETAIL_FINANCE", value: value })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Finance Category"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.finance_category}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({
                                                key: "FINANCE_CATEGORY",
                                                value: value,
                                            })
                                        )
                                    }
                                />
                            </View>

                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                label={"Down Payment*"}
                                value={selector.down_payment}
                                onChangeText={(text) =>
                                    dispatch(
                                        setFinancialDetails({ key: "DOWN_PAYMENT", text: text })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                label={"Loan Amount*"}
                                value={selector.loan_amount}
                                onChangeText={(text) =>
                                    dispatch(
                                        setFinancialDetails({ key: "LOAN_AMOUNT", text: text })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Bank/Financer"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.bank_or_finance}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "BANK_FINANCE", value: value })
                                        )
                                    }
                                />
                            </View>

                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                label={"Rate of Interest*"}
                                value={selector.rate_of_interest}
                                onChangeText={(text) =>
                                    dispatch(
                                        setFinancialDetails({
                                            key: "RATE_OF_INTEREST",
                                            text: text,
                                        })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Loan of Tenure(Months)"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.loan_of_tenure}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "LOAN_OF_TENURE", value: value })
                                        )
                                    }
                                />
                            </View>

                            <TextinputComp
                                style={{ height: 65, width: "100%" }}
                                label={"EMI*"}
                                value={selector.emi}
                                onChangeText={(text) =>
                                    dispatch(setFinancialDetails({ key: "EMI", text: text }))
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Approx Annual Income"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.approx_annual_income}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({
                                                key: "APPROX_ANNUAL_INCOME",
                                                value: value,
                                            })
                                        )
                                    }
                                />
                            </View>
                        </List.Accordion>
                        <View style={styles.space}></View>

                        {/* // 6.Upload Documents */}

                        <List.Accordion
                            title="First 6"
                            expanded={openAccordian == 6 ? true : false}
                            onPress={() => updateAccordian(6)}
                        >
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.pan_number}
                                label={"Pan Number*"}
                                maxLength={10}
                                onChangeText={(text) =>
                                    dispatch(setUploadDocuments({ key: "PAN", text: text }))
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <View style={styles.select_image_bck_vw}>
                                <ImageSelectItem
                                    name={"Upload Pan"}
                                    onPress={() => dispatch(setImagePicker("UPLOAD_PAN"))}
                                />
                            </View>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.adhaar_number}
                                label={"Aadhaar Number*"}
                                onChangeText={(text) =>
                                    dispatch(setUploadDocuments({ key: "ADHAR", text: text }))
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <View style={styles.select_image_bck_vw}>
                                <ImageSelectItem
                                    name={"Upload Aadhaar"}
                                    onPress={() => dispatch(setImagePicker("UPLOAD_ADHAR"))}
                                />
                            </View>
                        </List.Accordion>
                        <View style={styles.space}></View>

                        <List.Accordion
                            title="First 7"
                            expanded={openAccordian == 7 ? true : false}
                            onPress={() => updateAccordian(7)}
                        >
                            <View style={styles.view2}>
                                <Text style={styles.looking_any_text}>
                                    {"Looking for any other brand"}
                                </Text>
                                <Checkbox.Android
                                    status={
                                        selector.c_looking_for_any_other_brand
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    uncheckedColor={Colors.DARK_GRAY}
                                    color={Colors.RED}
                                    onPress={() =>
                                        dispatch(
                                            setCustomerNeedAnalysis({ key: "CHECK_BOX", text: "" })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Make"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.make}
                                    onChange={(value) =>
                                        dispatch(setDropDownData({ key: "C_MAKE", value: value }))
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Model"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.model}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "C_MODEL", value: value })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Variant"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.variant}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "C_VARIANT", value: value })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Color"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.color}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "C_COLOR", value: value })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Fuel Type"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.fuel_type}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({ key: "C_FUEL_TYPE", value: value })
                                        )
                                    }
                                />
                            </View>

                            <View style={styles.drop_down_view_style}>
                                <Dropdown
                                    label="Transmission Type"
                                    data={selector.dropDownData}
                                    required={true}
                                    floating={false}
                                    value={selector.transmission_type}
                                    onChange={(value) =>
                                        dispatch(
                                            setDropDownData({
                                                key: "C_TRANSMISSION_TYPE",
                                                value: value,
                                            })
                                        )
                                    }
                                />
                            </View>

                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.price_range}
                                label={"Price Range"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCustomerNeedAnalysis({
                                            key: "PRICE_RANGE",
                                            text: text,
                                        })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.on_road_price}
                                label={"On Road Price"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCustomerNeedAnalysis({
                                            key: "ON_ROAD_PRICE",
                                            text: text,
                                        })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.dealership_name}
                                label={"DealerShip Name"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCustomerNeedAnalysis({
                                            key: "DEALERSHIP_NAME",
                                            text: text,
                                        })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.dealership_location}
                                label={"DealerShip Location"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCustomerNeedAnalysis({
                                            key: "DEALERSHIP_LOCATION",
                                            text: text,
                                        })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.dealership_pending_reason}
                                label={"Dealership Pending Reason"}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCustomerNeedAnalysis({
                                            key: "DEALERSHIP_PENDING_REASON",
                                            text: text,
                                        })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                            <TextinputComp
                                style={styles.textInputStyle}
                                value={selector.voice_of_customer_remarks}
                                label={"Voice of Customer Remarks "}
                                onChangeText={(text) =>
                                    dispatch(
                                        setCustomerNeedAnalysis({
                                            key: "VOICE_OF_CUSTOMER_REMARKS",
                                            text: text,
                                        })
                                    )
                                }
                            />
                            <Text style={GlobalStyle.underline}></Text>
                        </List.Accordion>


                        {/* // 7.Customer Need Analysis */}
                        {/* <View style={[styles.accordianBckVw, GlobalStyle.shadow, { backgroundColor: "white" }]}>
              <CustomerAccordianHeaderItem
                title={"Customer Need Analysis"}
                leftIcon={"account-edit"}
                selected={openAccordian == 7 ? true : false}
                onPress={() => updateAccordian(7)}
              />
              <View
                style={{
                  width: "100%",
                  height: openAccordian == 7 ? null : 0,
                  overflow: "hidden",
                }}
              >
                
              </View>
            </View> */}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>


        </SafeAreaView >
    );
};

export default TestEnquiryFormScreen;

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
    textInputStyle: {
        height: 65,
        width: "100%"
    },
    space: {
        height: 10
    },
    drop_down_view_style: {
        paddingTop: 5,
        flex: 1,
        backgroundColor: Colors.WHITE
    },
    view1: {
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 20,
        marginRight: 5,
    },
    titleText: {
        fontSize: 22,
        fontWeight: "600",
    },
    accordianBckVw: {
        // marginVertical: 5,
        // borderRadius: 10,
        backgroundColor: Colors.WHITE,
    },
    radioGroupBcVw: {
        flexDirection: "row",
        alignItems: "center",
        height: 65,
        paddingLeft: 12,
        backgroundColor: Colors.WHITE,
    },
    permanentAddText: {
        fontSize: 16,
        fontWeight: "600",
    },
    view2: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
        paddingTop: 20,
        paddingLeft: 12
    },
    looking_any_text: {
        fontSize: 16,
        fontWeight: '500'
    },
    select_image_bck_vw: {
        minHeight: 50, paddingLeft: 12, backgroundColor: Colors.WHITE
    },
    item: {
        backgroundColor: "#f9c2ff",
        padding: 20,
        marginVertical: 8
    },
    header: {
        fontSize: 32,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 24
    }
});

// left={(props) => (
//   <VectorImage height={25} width={25} source={PERSONAL_DETAILS} />
// )}
