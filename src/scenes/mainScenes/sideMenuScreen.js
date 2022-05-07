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
    Alert,
    TouchableOpacity
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
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

// import { EVENT_MANAGEMENT, CUSTOMER_RELATIONSHIP, DOCUMENT_WALLET, HOME_LINE, BOOKING_TRACKER } from "../assets/svg";

import EVENT_MANAGEMENT from "../../assets/images/event_management.svg";
import CUSTOMER_RELATIONSHIP from "../../assets/images/customer_relationship.svg";
import DOCUMENT_WALLET from "../../assets/images/document_wallet.svg";
import HOME_LINE from "../../assets/images/home_line.svg";
import BOOKING_TRACKER from "../../assets/images/booking_tracker.svg";
import QR_CODE from "../../assets/images/qr-code.svg";
import { BOOKING_TRACKER_STR, CUSTOMER_RELATIONSHIP_STR, DOCUMENT_WALLET_STR, EVENT_MANAGEMENT_STR, HOME_LINE_STR, QR_CODE_STR } from "../../redux/sideMenuReducer";

const screenWidth = Dimensions.get("window").width;
const profileWidth = screenWidth / 4;
const profileBgWidth = profileWidth + 5;

const receptionMenu = [
    "Home",
    "Upcoming Deliveries",
    "Settings",
    "Digital Payment",
    "Monthly Target Planning",
    "Helpdesk",
    "Task Management",
    "Task Transfer",
];
const teleCollerMenu = [
    "Home",
    "Settings",
    "Digital Payment",
    "Monthly Target Planning",
    "Helpdesk",
    "Task Management",
    "Task Transfer",
];

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
    const [imageUri, setImageUri] = useState(null);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        getLoginEmployeeData();
        getProfilePic();
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

    const getProfilePic = () => {
        fetch(
            "http://automatestaging-724985329.ap-south-1.elb.amazonaws.com:8081/sales/employeeprofilepic/get/146/1/242"
        )
            .then((response) => response.json())
            .then((json) => setDataList(json))
            .catch((error) => console.error(error));
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
        setNewTableData([...newFilterData])
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
            case 105:
                navigation.navigate(AppNavigator.DrawerStackIdentifiers.digitalPayment);
                break;
            case 106:
                navigation.navigate(AppNavigator.DrawerStackIdentifiers.monthlyTarget);
                break;
            case 107:
                navigation.navigate(AppNavigator.DrawerStackIdentifiers.helpdesk);
                break;
            case 108:
                navigation.navigate(AppNavigator.DrawerStackIdentifiers.taskManagement);
                break;
            case 109:
                navigation.navigate(AppNavigator.DrawerStackIdentifiers.taskTransfer);
                break;
            // case 999:
            //   navigation.navigate("Target Settings");
            //   break;
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


    const selectImage = () => {
        let options = {
            title: "you can choose anyimage",
            maxWidth: 256,
            maxHeight: 256,
            storageOptions: {
                skipBack: true,
            },
        };

        launchImageLibrary(options, (Response) => {
            if (Response.didCancel) {
                Alert.alert("user cancelled");
            } else if (Response.errorMessage) {
                Alert.alert(Response.errorMessage);
            } else if (Response.assets) {
                let Object = Response.assets[0];
                const uriLink = Object.uri;
                // console.log('assets: ', uri);
                const uriObject = {
                    uri: uriLink,
                };
                setImageUri(uriObject);
            }
        });
    };

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
                <Text style={styles.nameStyle}>
                    {"Welcome "}
                    <Text style={[styles.nameStyle, { fontSize: 12 }]}>
                        {empName + ","}
                    </Text>
                </Text>
            </View>
            <View style={styles.profileContainerView}>
                <View style={[styles.profileBgVw, GlobalStyle.shadow]}>
                    <TouchableOpacity onPress={selectImage}>
                        <Image
                            style={{
                                width: profileWidth,
                                height: profileWidth,
                                borderRadius: profileWidth / 2,
                            }}
                            source={{
                                uri: "https://dms-automate-prod.s3.ap-south-1.amazonaws.com/146-1-242-a94edf7c-77b7-40ef-bd12-b66d9303c631/car.jpg",
                            }}
                        // source={imageUri}
                        //  source={require("../../assets/images/bently.png")}
                        />
                    </TouchableOpacity>
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
                    <Text style={styles.text2}>{"Office Location: " + location}</Text>
                </View>
            </View>
            <Divider />
            <FlatList
                data={newTableData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable onPress={() => itemSelected(item)}>
                            <View
                                style={{
                                    paddingLeft: 10,
                                    height: 40,
                                    justifyContent: "center",
                                }}
                            >
                                {/* <List.Item
                  title={item.title}
                  titleStyle={{ fontSize: 16, fontWeight: "600" }}
                  left={(props) => <List.Icon {...props} icon="folder" style={{ margin: 0 }} />}
                /> */}
                                <View style={{ flexDirection: "row", height: 25, alignItems: "center", paddingLeft: 10, marginBottom: 5 }}>
                                    {/* <VectorImage source={item.icon} width={20} height={20} /> */}
                                    {item.icon === EVENT_MANAGEMENT_STR && <EVENT_MANAGEMENT width={20} height={20} color={'black'} />}
                                    {item.icon === CUSTOMER_RELATIONSHIP_STR && <CUSTOMER_RELATIONSHIP width={20} height={20} color={'black'} />}
                                    {item.icon === DOCUMENT_WALLET_STR && <DOCUMENT_WALLET width={20} height={20} color={'black'} />}
                                    {item.icon === HOME_LINE_STR && <HOME_LINE width={20} height={20} color={'black'} />}
                                    {item.icon === BOOKING_TRACKER_STR && <BOOKING_TRACKER width={20} height={20} color={'black'} />}
                                    {item.icon === QR_CODE_STR && <QR_CODE width={20} height={20} color={'black'} />}
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
        height: 30,
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
