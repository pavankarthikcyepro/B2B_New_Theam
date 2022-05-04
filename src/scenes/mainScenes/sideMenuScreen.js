import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    FlatList,
    Pressable,
} from "react-native";
import { IconButton, Divider, List, Button } from "react-native-paper";
import { Colors, GlobalStyle } from "../../styles";
import VectorImage from "react-native-vector-image";
import { useSelector, useDispatch } from "react-redux";
import { AppNavigator } from "../../navigations";
import { AuthContext } from "../../utils/authContext";
import realm from "../../database/realm";
import * as AsyncStore from '../../asyncStore';
// import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const profileWidth = screenWidth / 4;
const profileBgWidth = profileWidth + 5;

const receptionMenu = ["Home", "Upcoming Deliveries", "Settings"];
const teleCollerMenu = ["Home", "Settings"];

const SideMenuScreen = ({ navigation }) => {

    const selector = useSelector((state) => state.sideMenuReducer);
    const homeSelector = useSelector((state) => state.loginReducer);
    // const isFocused = useIsFocused();

    const { signOut } = React.useContext(AuthContext);
    const [empName, setEmpName] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [role, setRole] = useState("");
    const [newTableData, setNewTableData] = useState([]);

    useEffect(() => {
        getLoginEmployeeData();
    }, [])

    useEffect(() => {

        if (homeSelector.login_employee_details) {
            const jsonObj = homeSelector.login_employee_details;
            updateUserData(jsonObj);
        }
    }, [homeSelector.login_employee_details])

    const getLoginEmployeeData = async () => {

        const jsonString = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (jsonString) {
            const jsonObj = JSON.parse(jsonString);
            updateUserData(jsonObj);
        }
    }

    updateUserData = (jsonObj) => {
        setEmpName(jsonObj.empName);
        setEmail(jsonObj.email);
        setRole(jsonObj.hrmsRole);
        setLocation(jsonObj.branchName);

        let newFilterData = [];
        if (jsonObj.hrmsRole === "Reception") {
            newFilterData = selector.tableData.filter(item => receptionMenu.includes(item.title))
        }
        else if (jsonObj.hrmsRole === "Tele Caller") {
            newFilterData = selector.tableData.filter(item => teleCollerMenu.includes(item.title))
        }
        else {
            newFilterData = selector.tableData;
        }
        setNewTableData([...newFilterData, {
            "icon": 52,
            "screen": 999,
            "title": "Monthly Target"
        }])
    }

    const itemSelected = (item) => {
        switch (item.screen) {
            case 99:
                // navigation.navigate(AppNavigator.DrawerStackIdentifiers.home);
                navigation.navigate(AppNavigator.TabStackIdentifiers.home);
                break;
            case 100:
                navigation.navigate(
                    AppNavigator.DrawerStackIdentifiers.upcomingDeliveries
                );
                break;
            case 101:
                navigation.navigate(AppNavigator.DrawerStackIdentifiers.complaint);
                break;
            case 102:
                navigation.navigate(AppNavigator.DrawerStackIdentifiers.settings);
                break;
            case 103:
                navigation.navigate(
                    AppNavigator.DrawerStackIdentifiers.eventManagement
                );
                break;
            case 104:
                navigation.navigate(AppNavigator.DrawerStackIdentifiers.preBooking);
                break;
            case 999:
                navigation.navigate("Target Settings");
                break;
        }
    };

    const signOutClicked = () => {

        AsyncStore.storeData(AsyncStore.Keys.USER_NAME, "");
        AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, "");
        AsyncStore.storeData(AsyncStore.Keys.EMP_ID, "");
        AsyncStore.storeData(AsyncStore.Keys.LOGIN_EMPLOYEE, "");
        AsyncStore.storeData(AsyncStore.Keys.SELECTED_BRANCH_ID, "");
        AsyncStore.storeData(AsyncStore.Keys.SELECTED_BRANCH_NAME, "");
        navigation.closeDrawer()
        //realm.close();
        signOut();
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topView}>
                <IconButton
                    icon={"chevron-left"}
                    size={30}
                    color={Colors.DARK_GRAY}
                    onPress={() => {
                        navigation.closeDrawer();
                    }}
                />
                <Text style={styles.nameStyle}>{"Welcome "}<Text style={[styles.nameStyle, { fontSize: 12 }]}>{empName + ","}</Text></Text>
            </View>
            <View style={styles.profileContainerView}>
                <View style={[styles.profileBgVw, GlobalStyle.shadow]}>
                    <Image
                        style={{
                            width: profileWidth,
                            height: profileWidth,
                            borderRadius: profileWidth / 2,
                        }}
                        source={require("../../assets/images/bently.png")}
                    />
                </View>
                <View style={{ marginTop: 15 }}>
                    <Text style={[styles.nameStyle, { textAlign: "center" }]}>
                        {empName}
                    </Text>
                    <Text style={styles.text1}>{role}</Text>
                </View>

                <View style={{ marginTop: 5 }}>
                    <Text style={styles.text2}>
                        {"Email: "}
                        <Text style={[styles.text2, { color: Colors.SKY_BLUE }]}>
                            {email}
                        </Text>
                    </Text>
                    <Text style={styles.text2}>
                        {"Office Location: " + location}
                    </Text>
                </View>
            </View>
            <Divider />
            <FlatList
                data={newTableData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable onPress={() => itemSelected(item)}>
                            <View style={{ paddingLeft: 10, height: 55, justifyContent: "center", }}>
                                {/* <List.Item
                  title={item.title}
                  titleStyle={{ fontSize: 16, fontWeight: "600" }}
                  left={(props) => <List.Icon {...props} icon="folder" style={{ margin: 0 }} />}
                /> */}
                                <View style={{ flexDirection: "row", height: 25, alignItems: "center", paddingLeft: 10, marginBottom: 10 }}>
                                    <VectorImage source={item.icon} width={20} height={20} />
                                    <Text style={{ fontSize: 16, fontWeight: "600", marginLeft: 15 }}>{item.title}</Text>
                                </View>
                                <Divider />
                            </View>
                        </Pressable>
                    );
                }}
            />
            <View style={styles.bottomVw}>
                <Button
                    icon="logout"
                    mode="contained"
                    style={{ marginHorizontal: 40 }}
                    contentStyle={{ backgroundColor: Colors.RED }}
                    labelStyle={{
                        fontSize: 14,
                        fontWeight: "600",
                        textTransform: "none",
                    }}
                    onPress={signOutClicked}
                >
                    Sign Out
        </Button>
            </View>
        </SafeAreaView>
    );
};

export default SideMenuScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    topView: {
        flexDirection: "row",
        height: 50,
        alignItems: "center",
        overflow: 'hidden'
    },
    nameStyle: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.BLACK,
    },
    profileContainerView: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 30,
    },
    text1: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: "200",
        textAlign: 'center',
        color: Colors.DARK_GRAY,
    },
    text2: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: "400",
        color: Colors.GRAY,
    },
    profileBgVw: {
        width: profileBgWidth,
        height: profileBgWidth,
        borderRadius: profileBgWidth / 2,
        backgroundColor: Colors.WHITE,
        justifyContent: "center",
        alignItems: "center",
    },
    bottomVw: {
        bottom: 0,
        paddingVertical: 20,
    },
});
