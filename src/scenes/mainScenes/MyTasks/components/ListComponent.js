import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { GlobalStyle, Colors } from "../../../../styles";
import PieChart from 'react-native-pie-chart';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useSelector } from "react-redux";
import { MyTasksStackIdentifiers } from "../../../../navigations/appNavigator";


const screenWidth = Dimensions.get("window").width;
const item1Width = screenWidth - 10;
const item2Width = (item1Width - 10);
const baseItemWidth = item2Width / 3;
const itemWidth = baseItemWidth - 10;

const series = [50, 50]
const sliceColor = ['#EEEEEE', '#5BBD66']

const NoDataFound = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "600", textAlign: "center" }}>{"No Data Found"}</Text>
        </View>
    )
}

const ListComponent = ({ route, navigation }) => {
    const [index, setIndex] = useState(0);
    const [myTasksData, setMyTasksData] = useState([]);
    const selector = useSelector((state) => state.mytaskReducer);

    useEffect(() => {
        console.log('data: ', selector.mytasksLisResponse);
        if (selector.myTasksListResponseStatus === "success") {
            if (route.params.from === "TODAY") {
                const todaysData = selector.mytasksLisResponse.todaysData[0];
                setMyTasksData(todaysData.tasksList || []);
            }
            else if (route.params.from === "UPCOMING") {
                const todaysData = selector.mytasksLisResponse.upcomingData[0];
                setMyTasksData(todaysData.tasksList || []);
            }
            else if (route.params.from === "PENDING") {
                const todaysData = selector.mytasksLisResponse.pendingData[0];
                setMyTasksData(todaysData.tasksList || []);
            }
        }
    }, [selector.myTasksListResponseStatus, selector.mytasksLisResponse])

    const itemClicked = (item) => {
        navigation.navigate(MyTasksStackIdentifiers.tasksListScreen, { data: item.myTaskList })
    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.LIGHT_GRAY, padding: 5, }}>
            <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 15, paddingBottom: 25 }}>
                <View style={{ width: "75%" }}>
                    <SegmentedControl
                        values={['My Tasks', 'Team Tasks']}
                        enabled={true}
                        backgroundColor={Colors.WHITE}
                        fontStyle={{ color: Colors.BLACK, fontSize: 16, fontWeight: "700" }}
                        activeFontStyle={{ color: Colors.WHITE, fontSize: 16, fontWeight: "700" }}
                        style={{ backgroundColor: "white", height: 50, borderColor: "red", borderWidth: 1, borderRadius: 4 }}
                        tabStyle={{ borderRadius: 1 }}
                        tintColor={Colors.RED}
                        selectedIndex={index}
                        onChange={(event) => {
                            setIndex(event.nativeEvent.selectedSegmentIndex);
                        }}
                    />
                </View>
            </View>
            {(index === 0 && myTasksData.length > 0) && (
                <FlatList
                    data={myTasksData}
                    style={{ flex: 1 }}
                    // horizontal={true}
                    numColumns={3}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        const chartHeight = (itemWidth - 20);
                        const overlayViewHeight = chartHeight - 10;
                        return (
                            <View style={[{ height: 185, width: baseItemWidth, paddingBottom: 5, backgroundColor: Colors.LIGHT_GRAY, justifyContent: "center", alignItems: "center" }, GlobalStyle.shadow]}>
                                <TouchableOpacity onPress={() => itemClicked(item)}>
                                    <View style={[{ height: 180, width: itemWidth, backgroundColor: Colors.WHITE, flexDirection: "column", alignItems: "center", paddingBottom: 10 },]}>
                                        {/* // pie chart */}
                                        <View style={{ width: itemWidth - 10, height: 120, justifyContent: "center", alignItems: "center" }}>

                                            <PieChart
                                                widthAndHeight={chartHeight}
                                                series={series}
                                                sliceColor={sliceColor}
                                            />
                                            {/* <PIEICON width={chartHeight} height={chartHeight} /> */}
                                            {/* // Overlay View */}
                                            <View style={{ position: "absolute", width: overlayViewHeight, height: overlayViewHeight, borderRadius: overlayViewHeight / 2, backgroundColor: Colors.WHITE, alignItems: "center", justifyContent: "center" }}>
                                                <Text style={{ fontSize: 20, fontWeight: "700", textAlign: "center" }}>{item.taskCnt}</Text>
                                                <Text style={{ fontSize: 12, fontWeight: "400", textAlign: "center" }}>{"follow up"}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                                            <View style={{ width: "75%", backgroundColor: Colors.DARK_GRAY, height: 2, marginBottom: 5 }}></View>
                                            <Text style={{ fontSize: 14, fontWeight: "700", textAlign: "center" }} numberOfLines={2}>{item.taskName}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        )
                    }}
                />
            )}
            {(index === 0 && myTasksData.length == 0) && (
                <NoDataFound />
            )}
            {index === 1 && (
                <NoDataFound />
            )}
        </View>
    )
};

export default ListComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 5,
        backgroundColor: Colors.LIGHT_GRAY
    }
})