import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, FlatList, RefreshControl, Text, ActivityIndicator } from "react-native";
import { IconButton } from "react-native-paper";
import { PreEnquiryItem, EmptyListView } from "../../../pureComponents";
import { useDispatch, useSelector } from "react-redux";
import { Colors, GlobalStyle } from "../../../styles";
import { AppNavigator } from '../../../navigations';
import * as AsyncStore from "../../../asyncStore";
import { getPreBookingData, getMorePreBookingData } from "../../../redux/preBookingReducer";
import { callNumber } from "../../../utils/helperFunctions";

const PreBookingScreen = ({ navigation }) => {

    const selector = useSelector((state) => state.preBookingReducer);
    const dispatch = useDispatch();
    const [employeeId, setEmployeeId] = useState("");

    useEffect(() => {
        getPreBookingListFromServer();
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

    const renderFooter = () => {
        if (!selector.isLoadingExtraData) { return null }
        return (
            <View style={styles.footer}>
                <Text style={styles.btnText}>Loading More...</Text>
                <ActivityIndicator color={Colors.GRAY} />
            </View>
        );
    };

    if (selector.pre_booking_list.length === 0) {
        return (
            <EmptyListView title={"No Data Found"} />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.view1}>
                <View style={[GlobalStyle.shadow, { backgroundColor: Colors.WHITE }]}>
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
                                    onPress={() => navigation.navigate(AppNavigator.PreBookingStackIdentifiers.preBookingForm)}
                                    onCallPress={() => callNumber(item.phone)}
                                />
                            );
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default PreBookingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view1: {
        padding: 10,
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
