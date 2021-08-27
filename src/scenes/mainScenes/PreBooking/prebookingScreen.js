import React from "react";
import { SafeAreaView, StyleSheet, View, FlatList } from "react-native";
import { PageControlItem } from "../../../pureComponents/pageControlItem";
import { IconButton } from "react-native-paper";
import { PreEnquiryItem } from "../../../pureComponents/preEnquiryItem";
import { useDispatch, useSelector } from "react-redux";
import { Colors, GlobalStyle } from "../../../styles";
import { AppNavigator } from '../../../navigations';
import * as AsyncStore from "../../../asyncStore";

const PreBookingScreen = ({ navigation }) => {

    const selector = useSelector((state) => state.enquiryReducer);
    const dispatch = useDispatch();
    const [employeeId, setEmployeeId] = useState("");

    const getPreBookingListFromServer = async () => {
        let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
        if (empId) {
            let endUrl = "?limit=10&offset=" + "0" + "&status=PREBOOKING&empId=" + empId;
            dispatch(getPreBookingData(endUrl));
            setEmployeeId(empId);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.view1}>
                <View style={styles.view2}>
                    <PageControlItem pageNumber={1} totalPages={7} />
                </View>
                <View style={[GlobalStyle.shadow, { backgroundColor: Colors.WHITE }]}>
                    <FlatList
                        data={selector.enquiry_list}
                        keyExtractor={(item, index) => index.toString()}
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
        marginBottom: 5,
        paddingHorizontal: 10,
    },
    view2: {
        flexDirection: "row",
    },
});
