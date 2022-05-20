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
import Entypo from "react-native-vector-icons/FontAwesome";
import { client } from "../../networking/client";
import URL from "../../networking/endpoints";

// import { EVENT_MANAGEMENT, CUSTOMER_RELATIONSHIP, DOCUMENT_WALLET, HOME_LINE, BOOKING_TRACKER } from "../assets/svg";

import EVENT_MANAGEMENT from "../../assets/images/event_management.svg";
import CUSTOMER_RELATIONSHIP from "../../assets/images/customer_relationship.svg";
import DOCUMENT_WALLET from "../../assets/images/document_wallet.svg";
import HOME_LINE from "../../assets/images/home_line.svg";
import BOOKING_TRACKER from "../../assets/images/booking_tracker.svg";
import QR_CODE from "../../assets/images/qr-code.svg";
import GROUP from "../../assets/images/Group.svg";
import TRANSFER from "../../assets/images/Transfer.svg";
import HOME from "../../assets/images/Home_icon.svg";
import UPCOMING_DELIVERIES from "../../assets/images/Upcoming_delivery_icon.svg";
import LOGOUT_NEW from "../../assets/images/Signout_icon.svg";
import { BOOKING_TRACKER_STR, CUSTOMER_RELATIONSHIP_STR, DOCUMENT_WALLET_STR, EVENT_MANAGEMENT_STR, HOME_LINE_STR, QR_CODE_STR, GROUP_STR, TRANSFER_STR, HOME_STR, UPCOMING_DELIVERIES_STR, LOGOUT_NEW_STR } from "../../redux/sideMenuReducer";

const screenWidth = Dimensions.get("window").width;
const profileWidth = screenWidth / 6;
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
    const [userData, setUserData] = useState({});


    useEffect(() => {
        getLoginEmployeeData();
        // getProfilePic();
    }, [])

    // useEffect(() => {
    //     if(userData){
    //         getProfilePic();
    //     }
    // }, [userData])

    useEffect(() => {

        if (homeSelector.login_employee_details) {
            const jsonObj = homeSelector.login_employee_details;
            updateUserData(jsonObj);
            getProfilePic(jsonObj);
        }
    }, [homeSelector.login_employee_details])

    const getLoginEmployeeData = async () => {

        const jsonString = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (jsonString) {
            const jsonObj = JSON.parse(jsonString);
            updateUserData(jsonObj);
            getProfilePic(jsonObj);

        }
    }


    const getProfilePic = (userData) => {
        // console.log(`http://automatestaging-724985329.ap-south-1.elb.amazonaws.com:8081/sales/employeeprofilepic/get/${userData.empId}/${userData.orgId}/${userData.branchId}`);
        fetch(
            `http://automatestaging-724985329.ap-south-1.elb.amazonaws.com:8081/sales/employeeprofilepic/get/${userData.empId}/${userData.orgId}/${userData.branchId}`
        )
            .then((response) => response.json())
            .then((json) => {
                setDataList(json);
                // console.log({json})
                if (json.length > 0) {
                    setImageUri(json[json.length - 1].documentPath);
                } else {
                    setImageUri("https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg")
                }
            })
            .catch((error) => console.error(error));
    }

    const updateUserData = (jsonObj) => {
        setEmpName(jsonObj.empName);
        setEmail(jsonObj.email);
        setRole(jsonObj.hrmsRole);
        setLocation(jsonObj.branchName);
        setUserData(jsonObj)
        // setUserData(jsonObj)
        getProfilePic(jsonObj);


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
                navigation.navigate(AppNavigator.DrawerStackIdentifiers.home);
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
                navigation.navigate(AppNavigator.MyTaskStackNavigator.mytasks);
                break;
            case 109:
                navigation.navigate(AppNavigator.DrawerStackIdentifiers.taskTransfer);
                break;
            case 111:
                navigation.navigate(AppNavigator.DrawerStackIdentifiers.evtbrlReport);
                break;
            case 112:
                signOutClicked();
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
                // setImageUri(uriObject);
                console.log({uriObject})
                uploadProfile(uriObject);
            }
        });
    };

    const uploadProfile = (uri) => {
        const formdata = new FormData();
        formdata.append('documentType', 'profilePic')
        formdata.append('file', {type: 'image/jpg', uri: uri.uri, name: "image.jpg"})

        fetch(
            URL.UPLOAD_PROFILE(userData.empId, userData.orgId, userData.branchId),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formdata
            }
        )
            .then((response) => response.json())
            .then(async (json) => {
                const inputData = {
                    ownerId: userData.empId,
                    branchId: userData.branchId,
                    orgId: userData.orgId,
                    fileName: json.fileName,
                    documentPath: json.documentPath,
                    universalid: json.universalId
                }
                const response = await client.post(URL.SAVE_PROFILE(), inputData);
                const saveProfile = await response.json();
                console.log("save json", saveProfile.dmsEntity.employeeProfileDtos[0].documentPath);
                if (saveProfile.success) {
                    setImageUri(saveProfile.dmsEntity.employeeProfileDtos[0].documentPath || "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg");
                }
                // setDataList(json);
            })
            .catch((error) => console.error(error));
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={styles.topView}>
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
            </View> */}
            <View style={styles.profileContainerView}>
                <View style={styles.profileBgVw}>
                    <TouchableOpacity onPress={selectImage}>
                        <View style={styles.editButton}>
                            <Entypo size={12} name="pencil" color={Colors.WHITE} />
                        </View>
                        <Image
                            style={{
                                width: profileWidth,
                                height: profileWidth,
                                borderRadius: profileWidth / 2,
                            }}
                            source={{
                                uri: imageUri,
                            }}
                        // source={imageUri}
                        //  source={require("../../assets/images/bently.png")}
                        />
                    </TouchableOpacity>
                    <View style={styles.profilDetailes}>
                        <Text style={styles.nameStyle}>{empName}</Text>
                        <Text style={styles.text1}>{role}</Text>
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={styles.text2}>
                        {"Email:  "}
                        <Text style={[styles.text2, { color: Colors.GRAY, fontWeight: "bold" }]}>
                            {email}
                        </Text>
                    </Text>
                    {/* <Text style={styles.text2}>{"Office Location: " + location}</Text> */}
                    <Text style={styles.text2}>{"Office Location:  "}
                        <Text style={{ color: Colors.GRAY, fontWeight: "bold" }}>{location || "No Location Set"}</Text>
                    </Text>
                </View>
            </View>
            <Divider />
            <FlatList
                data={newTableData}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable onPress={() => itemSelected(item)}>
                            <View
                                style={{
                                    paddingLeft: 10,
                                    height: 55,
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
                                    {item.icon === EVENT_MANAGEMENT_STR && <EVENT_MANAGEMENT width={20} height={20} color='green' />}
                                    {item.icon === CUSTOMER_RELATIONSHIP_STR && <CUSTOMER_RELATIONSHIP width={20} height={20} color={'black'} />}
                                    {item.icon === DOCUMENT_WALLET_STR && <DOCUMENT_WALLET width={20} height={20} color={'black'} />}
                                    {item.icon === HOME_LINE_STR && <HOME_LINE width={20} height={20} color={'black'} />}
                                    {item.icon === BOOKING_TRACKER_STR && <BOOKING_TRACKER width={20} height={20} color={'black'} />}
                                    {item.icon === QR_CODE_STR && <QR_CODE width={20} height={20} color={'black'} />}
                                    {item.icon === GROUP_STR && <GROUP width={20} height={20} color={'black'} />}
                                    {item.icon === TRANSFER_STR && <TRANSFER width={20} height={20} color={'black'} />}

                                    {item.icon === HOME_STR && <HOME width={20} height={20} color={'black'} />}
                                    {item.icon === UPCOMING_DELIVERIES_STR && <UPCOMING_DELIVERIES width={20} height={20} color={'blue'} />}
                                    {item.icon === LOGOUT_NEW_STR && <LOGOUT_NEW width={20} height={20} color={'black'} />}
                                    <Text style={{ fontSize: 15, fontWeight: "bold", marginLeft: 25, color: "gray" }}>{item.title}</Text>
                                </View>
                                {/* <Divider /> */}
                            </View>
                        </Pressable>
                    );
                }}
            />
            {/* <View style={styles.bottomVw}>
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
            </View> */}
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
    profilDetailes: {
        marginLeft: 15
    },
    nameStyle: {
        fontSize: 17,
        fontWeight: "bold",
        color: Colors.BLACK,
    },
    text1: {
        marginTop: 3,
        fontSize: 14,
        fontWeight: "200",
        textAlign: 'center',
        color: Colors.DARK_GRAY,
    },
    profileContainerView: {
        flexDirection: "column",
        // justifyContent: "center",
        // alignItems: "center",
        marginVertical: 30,
        paddingHorizontal: 20
    },
    text2: {
        marginTop: 5,
        fontSize: 14,
        // fontWeight: "400",
        color: Colors.GRAY,
    },
    profileBgVw: {
        // width: profileBgWidth,
        // height: profileBgWidth,
        // borderRadius: profileBgWidth / 2,
        backgroundColor: Colors.WHITE,
        // justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    bottomVw: {
        bottom: 0,
        paddingVertical: 20,
    },
    editButton: {
        position: "absolute",
        top: -1,
        right: 0,
        zIndex: 2,
        backgroundColor: "#f81567e3",
        borderRadius: 30,
        padding: 4
    }
});
