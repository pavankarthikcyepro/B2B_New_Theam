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
import { Provider, Checkbox, IconButton } from "react-native-paper";
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
        let newTableData = tabledata;
        let obj = newTableData[index];
        obj = !obj.isSelected;
        newTableData[index] = obj;
        setTabledata([...newTableData]);
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
                selectedImage={(data, keyId) => {
                    console.log('imageObj: ', data, keyId);
                }}
                onDismiss={() => dispatch(setImagePicker(""))}
            />

            {
                selector.showDatepicker && <DatePickerComponent
                    visible={selector.showDatepicker}
                    mode={'date'}
                    value={new Date(Date.now())}
                    onChange={(event, selectedDate) => {
                        console.log('date: ', selectedDate)
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

            <FlatList
                data={tabledata}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {

                    switch (index) {
                        case 0:
                            return (
                                <View style={[styles.accordianBckVw, GlobalStyle.shadow]}>
                                    <CustomerAccordianHeaderItem
                                        title={"Personal Intro"}
                                        leftIcon={"account-edit"}
                                        selected={item.isSelected ? true : false}
                                        onPress={() => updateAccordian(index)}
                                    />
                                    <View
                                        style={{
                                            width: "100%",
                                            height: openAccordian == 1 ? null : 0,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <View style={styles.drop_down_view_style}>
                                            <Dropdown
                                                label="Salutation"
                                                data={selector.dropDownData}
                                                required={true}
                                                floating={true}
                                                value={selector.salutaion}
                                                onChange={(value) => dispatch(setDropDownData({ key: "SALUTATION", value: value }))}
                                            />
                                        </View>

                                        <View style={styles.drop_down_view_style}>
                                            <Dropdown
                                                label="Gender"
                                                data={selector.dropDownData}
                                                required={true}
                                                floating={false}
                                                value={selector.gender}
                                                onChange={(value) => dispatch(setDropDownData({ key: "GENDER", value: value }))}
                                            />
                                        </View>

                                        <TextinputComp
                                            style={styles.textInputStyle}
                                            value={selector.firstName}
                                            label={"First Name*"}
                                            onChangeText={(text) =>
                                                dispatch(setPersonalIntro({ key: "FIRST_NAME", text: text }))
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
                                                onChange={(value) => dispatch(setDropDownData({ key: "RELATION", value: value }))}
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
                                    </View>
                                </View>
                            )
                            break;
                        case 1:
                            return (
                                <View style={[styles.accordianBckVw, GlobalStyle.shadow]}>
                                    <CustomerAccordianHeaderItem
                                        title={"Communicaton Address"}
                                        leftIcon={"account-edit"}
                                        selected={openAccordian == 2 ? true : false}
                                        onPress={() => updateAccordian(2)}
                                    />
                                    <View style={{ width: "100%", height: openAccordian == 2 ? null : 0, overflow: "hidden" }}>
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
                                                dispatch(setCommunicationAddress({ key: "CITY", text: text }))
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
                                                status={selector.permanent_address ? "checked" : "unchecked"}
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
                                    </View>
                                </View>
                            )
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                        case 4:
                            break;
                        case 5:
                            break;
                        case 6:
                            break;
                    }
                }}
            />


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
