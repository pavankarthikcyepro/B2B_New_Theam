
import React, {useEffect, useState} from "react";
import {SafeAreaView, View, Text, StyleSheet, FlatList} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import { getWorkFlow, getEnquiryDetails } from "../../../redux/taskThreeSixtyReducer";
import { Colors,GlobalStyle } from "../../../styles"

const TaskThreeSixtyScreen = ({route, navigaion}) => {

    const { universalId } = route.params;
    const dispatch = useDispatch();
    const selector = useSelector(state => state.taskThreeSixtyReducer);
    const [plannedTasks, setPlannedTasks] = useState([]);

    useEffect(() => {
        
        dispatch(getEnquiryDetails(universalId));
    }, [])

    // Handle enquiry Details response
    useEffect(() => {
        if (selector.enquiry_leadDto_response_status === "success") {
            dispatch(getWorkFlow(universalId));
        }
    }, [selector.enquiry_leadDto_response, selector.enquiry_leadDto_response_status])


    // Handle work flow response
    useEffect(() => {
        if (selector.wrokflow_response_status === "success") {
            const plannedData = [];
            const closedData = [];
            if (selector.wrokflow_response.length > 0) {
                selector.wrokflow_response.forEach(element => {
                    if ((element.taskStatus != 'CLOSED' && selector.enquiry_leadDto_response.leadStage === element.taskCategory.taskCategory) || (element.taskCategory.taskCategory === 'APPROVAL' && element.taskStatus === 'ASSIGNED')) {
                        plannedData.push(element);
                    }
                    else if (element.taskStatus == 'CLOSED') {
                        closedData.push(element);
                    } 
                });
            }
            // console.log("planned: ", )
            setPlannedTasks(plannedData)
        }
    }, [selector.wrokflow_response_status, selector.wrokflow_response])
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex:1}}>
                
                <FlatList 
                    data={plannedTasks}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => {
                        return(
                            <View style={[{ backgroundColor: Colors.WHITE }, GlobalStyle.shadow]}>
                                <View style={[{ paddingVertical: 5, paddingLeft: 10, backgroundColor: Colors.WHITE }, ]}>
                                    <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 5 }}>{item.taskName}</Text>
                                    <Text style={{ fontSize: 14, fontWeight: "400" }}>{"Assignee: " + item.assignee.empName}</Text>
                                    <Text style={{ fontSize: 14, fontWeight: "400" }}>{"Remarks: " + (item.employeeRemarks ? item.employeeRemarks : "")}</Text>
                                </View>
                            </View>
                        )
                    }}
                    ItemSeparatorComponent={() => {
                        return(
                            <View style={{height: 10}}></View>
                        )
                    }}
                />
            </View>
        </SafeAreaView>
    )
};

export default TaskThreeSixtyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 5,
        paddingHorizontal: 10,
        backgroundColor: Colors.LIGHT_GRAY
    },
})