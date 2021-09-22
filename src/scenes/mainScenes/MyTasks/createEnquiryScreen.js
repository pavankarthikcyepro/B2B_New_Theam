import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, Keyboard } from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp } from "../../../components";
import { Button } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { showToastSucess } from "../../../utils/toast";
import * as AsyncStorage from "../../../asyncStore";
import { getEmployeesListApi } from '../../../redux/confirmedPreEnquiryReducer';


const CreateEnquiryScreen = ({ route, navigation }) => {

    const selector = useSelector(state => state.confirmedPreEnquiryReducer);
    const dispatch = useDispatch();
    const [employeeId, setEmployeeId] = useState("");

    useEffect(() => {
        getAsyncStorageData();
    }, [])

    const getAsyncStorageData = async () => {
        const empId = await AsyncStorage.getData(AsyncStorage.Keys.EMP_ID);
        if (empId) {
            setEmployeeId(empId);
        }
    }

    return (
        <SafeAreaView style={[styles.container]}>
            <View style={styles.view1}>
                <Button
                    mode="contained"
                    color={Colors.RED}
                    disabled={selector.is_loading_for_task_update}
                    labelStyle={{ textTransform: "none" }}
                    onPress={() => { }}
                >
                    Create Enquiry
                </Button>
            </View>
        </SafeAreaView>
    );
};

export default CreateEnquiryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInputStyle: {
        height: 65,
        width: "100%",
    },
    view1: {
        marginTop: 50,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
});
