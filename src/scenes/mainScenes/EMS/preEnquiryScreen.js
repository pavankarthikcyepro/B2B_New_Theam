import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, Pressable, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { PreEnquiryItem, PageControlItem, EmptyListView } from '../../../pureComponents';
import { Colors, GlobalStyle } from '../../../styles';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from 'react-native-paper';
import VectorImage from 'react-native-vector-image';
import { CREATE_NEW } from '../../../assets/svg';
import { AppNavigator } from '../../../navigations';
import { CallUserComponent, SortAndFilterComp, DateRangeComp, DatePickerComponent } from '../../../components';
import { callPressed, sortAndFilterPressed, getPreEnquiryData, setPreEnquiryList, getMorePreEnquiryData } from '../../../redux/preEnquiryReducer';
import * as AsyncStore from '../../../asyncStore';
import realm from '../../../database/realm';
import { callNumber } from '../../../utils/helperFunctions';
import moment from "moment";

const PreEnquiryScreen = ({ navigation }) => {

    const selector = useSelector(state => state.preEnquiryReducer);
    const dispatch = useDispatch();
    const [employeeId, setEmployeeId] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerId, setDatePickerId] = useState("");
    const [selectedFromDate, setSelectedFromDate] = useState("");
    const [selectedToDate, setSelectedToDate] = useState("");

    useEffect(() => {

        getPreEnquiryListFromServer();
        //getPreEnquiryListFromDB();

        // Get Data From Server
        const currentDate = moment().format("DD/MM/YYYY");
        setSelectedFromDate(currentDate);
        setSelectedToDate(currentDate);
    }, [])

    const getPreEnquiryListFromDB = () => {
        const data = realm.objects('PRE_ENQUIRY_TABLE');
        dispatch(setPreEnquiryList(JSON.stringify(data)));
    }

    const getPreEnquiryListFromServer = async () => {
        let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
        if (empId) {
            let endUrl = "?limit=10&offset=" + "0" + "&status=PREENQUIRY&empId=" + empId;
            dispatch(getPreEnquiryData(endUrl));
            setEmployeeId(empId);
        }
    }

    const getMorePreEnquiryListFromServer = async () => {
        if (employeeId && ((selector.pageNumber + 1) < selector.totalPages)) {
            let endUrl = "?limit=10&offset=" + (selector.pageNumber + 1) + "&status=PREENQUIRY&empId=" + employeeId;
            dispatch(getMorePreEnquiryData(endUrl))
        }
    }

    const showDatePickerMethod = (key) => {
        setShowDatePicker(true);
        setDatePickerId(key);
    }

    const updateSelectedDate = (date, key) => {

        const formatDate = moment(date).format("DD/MM/YYYY");
        const payloadDate = moment(date).format("YYYY-DD-MM");
        switch (key) {
            case "FROM_DATE":
                setSelectedFromDate(formatDate);
                const formatToDate = moment(selectedToDate, "DD/MM/YYYY").format("YYYY-MM-DD");
                console.log("format formatToDate: ", formatToDate)
                break;
            case "TO_DATE":
                setSelectedToDate(formatDate);
                const formatFromDate = moment(selectedFromDate, "DD/MM/YYYY").format("YYYY-MM-DD");
                break;
        }
    }

    const renderFooter = () => {
        if (!selector.isLoadingExtraData) { return null }
        return (
            <View style={styles.footer}>
                <Text style={styles.btnText}>Loading More...</Text>
                <ActivityIndicator color={Colors.GRAY} />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.conatiner}>

            <DatePickerComponent
                visible={showDatePicker}
                mode={"date"}
                value={new Date(Date.now())}
                onChange={(event, selectedDate) => {
                    console.log("date: ", selectedDate);
                    if (Platform.OS === "android") {
                        if (selectedDate) {
                            updateSelectedDate(selectedDate, datePickerId);
                        }
                    } else {
                        updateSelectedDate(selectedDate, datePickerId);
                    }
                    setShowDatePicker(false)
                }}
                onRequestClose={() => setShowDatePicker(false)}
            />

            {/* <CallUserComponent
                visible={selector.modelVisible}
                onRequestClose={() => dispatch(callPressed())}
            /> */}

            <SortAndFilterComp
                visible={selector.sortAndFilterVisible}
                onRequestClose={() => {
                    dispatch(sortAndFilterPressed());
                }}
            />

            <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 5 }}>

                <View style={styles.view1}>
                    <View style={{ width: "80%" }}>
                        <DateRangeComp
                            fromDate={selectedFromDate}
                            toDate={selectedToDate}
                            fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
                            toDateClicked={() => showDatePickerMethod("TO_DATE")}
                        />
                    </View>
                    <Pressable onPress={() => dispatch(sortAndFilterPressed())}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.text1}>{'Filter'}</Text>
                            <IconButton icon={'filter-outline'} size={20} color={Colors.RED} style={{ margin: 0, padding: 0 }} />
                        </View>
                    </Pressable>
                </View>
                {/* // filter */}

                {selector.pre_enquiry_list.length === 0 ? <EmptyListView title={'No Data Found'} isLoading={selector.isLoading} /> :
                    <View style={[GlobalStyle.shadow, { backgroundColor: 'white', flex: 1, marginBottom: 10 }]}>
                        <FlatList
                            data={selector.pre_enquiry_list}
                            extraData={selector.pre_enquiry_list}
                            keyExtractor={(item, index) => index.toString()}
                            refreshControl={(
                                <RefreshControl
                                    refreshing={selector.isLoading}
                                    onRefresh={getPreEnquiryListFromServer}
                                    progressViewOffset={200}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            onEndReachedThreshold={0}
                            onEndReached={getMorePreEnquiryListFromServer}
                            ListFooterComponent={renderFooter}
                            renderItem={({ item, index }) => {

                                let color = Colors.WHITE;
                                if (index % 2 != 0) {
                                    color = Colors.LIGHT_GRAY;
                                }

                                return (
                                    < PreEnquiryItem
                                        bgColor={color}
                                        name={item.firstName + " " + item.lastName}
                                        subName={item.enquirySource}
                                        date={item.createdDate}
                                        // type={item.type}
                                        modelName={item.model}
                                        onPress={() => navigation.navigate(AppNavigator.EmsStackIdentifiers.confirmedPreEnq, { itemData: item, fromCreatePreEnquiry: false })}
                                        onCallPress={() => callNumber(item.phone)}
                                    />
                                )
                            }}
                        />
                    </View>}

                <View style={[styles.addView, GlobalStyle.shadow]}>
                    <Pressable onPress={() => navigation.navigate(AppNavigator.EmsStackIdentifiers.addPreEnq)}>
                        {/* <View style={[GlobalStyle.shadow, { height: 60, width: 60, borderRadius: 30, shadowRadius: 5 }]}> */}
                        <VectorImage source={CREATE_NEW} width={60} height={60} />
                        {/* </View> */}
                    </Pressable>
                </View>

            </View>
        </SafeAreaView >
    )
}

export default PreEnquiryScreen;

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
    },
    view1: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY,
        backgroundColor: Colors.WHITE
    },
    text1: {
        fontSize: 16,
        fontWeight: '400',
        color: Colors.RED
    },
    addView: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'white'
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: Colors.GRAY,
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 5
    },
})