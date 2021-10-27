import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, FlatList, RefreshControl, Text, ActivityIndicator, Pressable } from "react-native";
import { IconButton } from "react-native-paper";
import { PreEnquiryItem, EmptyListView } from "../../../pureComponents";
import { DateRangeComp, DatePickerComponent, SortAndFilterComp } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { Colors, GlobalStyle } from "../../../styles";
import { AppNavigator } from '../../../navigations';
import * as AsyncStore from "../../../asyncStore";
import { getPreBookingData, getMorePreBookingData } from "../../../redux/preBookingReducer";
import { callNumber } from "../../../utils/helperFunctions";
import moment from "moment";

const PreBookingScreen = ({ navigation }) => {

    const selector = useSelector((state) => state.preBookingReducer);
    const { vehicle_model_list_for_filters, source_of_enquiry_list } = useSelector(state => state.homeReducer);
    const dispatch = useDispatch();
    const [vehicleModelList, setVehicleModelList] = useState(vehicle_model_list_for_filters);
    const [sourceList, setSourceList] = useState(source_of_enquiry_list);
    const [employeeId, setEmployeeId] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerId, setDatePickerId] = useState("");
    const [selectedFromDate, setSelectedFromDate] = useState("");
    const [selectedToDate, setSelectedToDate] = useState("");
    const [sortAndFilterVisible, setSortAndFilterVisible] = useState(false);

    useEffect(() => {
        getPreBookingListFromServer();
        // Get Current Date
        const currentDate = moment().format("DD/MM/YYYY");
        setSelectedFromDate(currentDate);
        setSelectedToDate(currentDate);
    }, [])

    const getPreBookingListFromServer = async () => {
        let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
        if (empId) {
            let endUrl = "?limit=10&offset=" + "0" + "&status=PREBOOKING&empId=" + empId;
            dispatch(getPreBookingData(endUrl));
            setEmployeeId(empId);
        }
    }

    const getMorePreBookingListFromServer = async () => {
        if (employeeId && ((selector.pageNumber + 1) < selector.totalPages)) {
            let endUrl = "?limit=10&offset=" + (selector.pageNumber + 1) + "&status=PREBOOKING&empId=" + employeeId;
            dispatch(getMorePreBookingData(endUrl));
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
        <SafeAreaView style={styles.container}>

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

            <SortAndFilterComp
                visible={sortAndFilterVisible}
                modelList={vehicleModelList}
                sourceList={sourceList}
                submitCallback={(payload) => {
                    // console.log("payload: ", payload);
                    setVehicleModelList([...payload.model]);
                    setSourceList([...payload.source]);
                    setSortAndFilterVisible(false);
                }}
                onRequestClose={() => {
                    setSortAndFilterVisible(false);
                }}
            />

            <View style={styles.view1}>
                <View style={{ width: "80%" }}>
                    <DateRangeComp
                        fromDate={selectedFromDate}
                        toDate={selectedToDate}
                        fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
                        toDateClicked={() => showDatePickerMethod("TO_DATE")}
                    />
                </View>
                <Pressable onPress={() => setSortAndFilterVisible(true)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.text1}>{'Filter'}</Text>
                        <IconButton icon={'filter-outline'} size={20} color={Colors.RED} style={{ margin: 0, padding: 0 }} />
                    </View>
                </Pressable>
            </View>

            {selector.pre_booking_list.length === 0 ? <EmptyListView title={"No Data Found"} isLoading={selector.isLoading} /> :
                <View style={[GlobalStyle.shadow, { backgroundColor: 'white', flex: 1, marginBottom: 10 }]}>
                    <FlatList
                        data={selector.pre_booking_list}
                        extraData={selector.pre_booking_list}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={(
                            <RefreshControl
                                refreshing={selector.isLoading}
                                onRefresh={getPreBookingListFromServer}
                                progressViewOffset={200}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        onEndReachedThreshold={0}
                        onEndReached={getMorePreBookingListFromServer}
                        ListFooterComponent={renderFooter}
                        renderItem={({ item, index }) => {

                            let color = Colors.WHITE;
                            if (index % 2 != 0) {
                                color = Colors.LIGHT_GRAY;
                            }

                            return (
                                <PreEnquiryItem
                                    bgColor={color}
                                    name={item.firstName + " " + item.lastName}
                                    subName={item.enquirySource}
                                    date={item.createdDate}
                                    modelName={item.model}
                                    onPress={() => navigation.navigate(AppNavigator.PreBookingStackIdentifiers.preBookingForm, { universalId: item.universalId })}
                                    onCallPress={() => callNumber(item.phone)}
                                />
                            );
                        }}
                    />
                </View>
            }
        </SafeAreaView>
    );
};

export default PreBookingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view1: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5,
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
    view2: {
        flexDirection: "row",
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
});
