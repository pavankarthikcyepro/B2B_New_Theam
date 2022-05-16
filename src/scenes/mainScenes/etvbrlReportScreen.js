import React, { useState, useEffect } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { DatePickerComponent, DropDownComponant, LoaderComponent } from '../../components';
import { Colors } from '../../styles';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import * as AsyncStore from '../../asyncStore';
import { client } from "../../networking/client";
import URL from "../../networking/endpoints";
import RNFetchBlob from 'rn-fetch-blob'

const dateFormat = "YYYY-MM-DD"

const etvbrlReportScreen = () => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedFromDate, setSelectedFromDate] = useState("");
    const [selectedToDate, setSelectedToDate] = useState("");
    const [datePickerId, setDatePickerId] = useState("");
    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [dataForDropDown, setDataForDropDown] = useState([]);
    const [dropDownTitle, setDropDownTitle] = useState("Select Data");
    const [orgId, setOrgId] = useState("");
    const [locationList, setLocationList] = useState([]);
    const [dealerList, setDealerList] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({name: "Location", id: null});
    const [selectedDealer, setSelectedDealer] = useState([]);
    const [dropdownMultiple, setDropdownMultiple] = useState(false);
    const [dropdownKey, setDropdownKey] = useState("");
    const [dealerName, setDealerName] = useState("Dealer Code");
    const [locationError, setLocationError] = useState("");
    const [loading, setLoading] = useState(false); 


    useEffect(() => {
        // Get Data From Server
        getUserData();
        const currentDate = moment().format(dateFormat)
        const lastMonthFirstDate = moment(currentDate, dateFormat).subtract(1, 'months').startOf('month').format(dateFormat);
        setSelectedFromDate(lastMonthFirstDate);
        setSelectedToDate(currentDate);
    }, []);

    const getUserData = async () => {
        let orgId = await AsyncStore.getData(AsyncStore.Keys.ORG_ID);
        setOrgId(orgId);
        getLocationListFromServer(orgId);
        getDealerListFromServer(orgId);
    }

    const getLocationListFromServer = async (orgId) => {
        const location = await client.get(URL.LOCATION_LIST(orgId));
        const locationList = await location.json();
        setLocationList(locationList);
    }

    const getDealerListFromServer = async (orgId) => {
        const dealer = await client.get(URL.DEALER_CODE_LIST(orgId));
        const dealerCode = await dealer.json();
        setDealerList(dealerCode);
    }


    const updateSelectedDate = (date, key) => {
        const formatDate = moment(date).format(dateFormat);
        switch (key) {
            case "FROM_DATE":
                setSelectedFromDate(formatDate);
                break;
            case "TO_DATE":
                setSelectedToDate(formatDate);
                break;
        }
    }


    const showDatePickerMethod = (key) => {
        setShowDatePicker(true);
        setDatePickerId(key);
    }

    const showDropDownMethod = (key, headerText) => {
        switch (key) {
            case "LOCATION":
                setDataForDropDown([...locationList]);
                setDropdownKey("LOCATION");
                break;
            case "DEALER_CODE":
                const dealerCode = dealerList.filter(item => { return item.parentId == selectedLocation.id});
                setDropdownKey("DEALER_CODE");
                setDropdownMultiple(true);
                setDataForDropDown([...dealerCode]);
                break;
        }
        setShowDropDownModel(true);
        setDatePickerId(key);
        setDropDownTitle(headerText);
    }


    const downloadReport = async () => {
        if (selectedLocation.id == null) {
            console.log("error");
            setLocationError("Please Select Location");
            return;
        }
        console.log("first")
        setLoading(true);
        const payload = {
            branchIdList: selectedDealer,
            fromDate: selectedFromDate,
            orgId: orgId,
            toDate: selectedToDate
        }
        console.log("downloadReport payload", payload)
        console.log("download Url", URL.DOWNLOAD_REPORT())
        const response = await client.post(URL.DOWNLOAD_REPORT(), payload);
        const report = await response.json();
        const { config, fs } = RNFetchBlob;
        let downloadDir = Platform.select({ ios: fs.dirs.DocumentDir, android: fs.dirs.DownloadDir });
        let date = new Date();
        let file_ext = getFileExtention(report.downloadUrl);
        file_ext = '.' + file_ext[0];
        console.log({file_ext})
        let options = {}
        if (Platform.OS === 'android') {
            options = {
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
                    notification: true,
                    path: downloadDir + "/ETVBRL_" + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext, // this is the path where your downloaded file will live in
                    description: 'Downloading image.'
                }
            }
            config(options)
                .fetch('GET', report.downloadUrl)
                .then((res) => {
                    console.log(JSON.stringify(res), "sucess");
                    setLoading(false);
                    RNFetchBlob.android.actionViewIntent(res.path());
                    // do some magic here
                }).catch((err) => {
                    console.error(err);
                    setLoading(false)
                })
        }
        if (Platform.OS === 'ios') {
            options = {
                fileCache: true,
                path: downloadDir + "/ETVBRL_" + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext,
                // mime: 'application/xlsx',
                // appendExt: 'xlsx',
                //path: filePath,
                //appendExt: fileExt,
                notification: true,
            }

            config(options)
                .fetch('GET', report.downloadUrl)
                .then(res => {
                    setLoading(false);
                    setTimeout(() => {
                        // RNFetchBlob.ios.previewDocument('file://' + res.path());   //<---Property to display iOS option to save file
                        RNFetchBlob.ios.openDocument(res.data);                    
                    }, 300);

                })
                .catch(errorMessage => {
                    setLoading(false);
                });
        }
    }

    const getFileExtention = fileUrl => {
        // To get the file extension
        return /[.]/.exec(fileUrl) ?
            /[^.]+$/.exec(fileUrl) : undefined;
    };

    return (
        <View style={styles.container}>
            <DropDownComponant
                visible={showDropDownModel}
                headerTitle={dropDownTitle}
                data={dataForDropDown}
                multiple={dropdownMultiple}
                onRequestClose={() => setShowDropDownModel(false)}
                selectedItems={(item) => {
                    setLocationError("")
                    let dealerCodes = [];
                    let names = "";
                    if (dropdownKey === "DEALER_CODE") {
                        if (item.length > 0) {
                            item.forEach((obj, index) => {
                                if (obj.selected) {
                                    names += obj.name + (index + 1 < item.length ? ", " : "");
                                    dealerCodes.push(obj.id)
                                } 

                            })
                            setSelectedDealer([...dealerCodes]);
                            setDealerName(names);
                        }
                        console.log({ dealerCodes })
                    } else {
                     setSelectedLocation({name: item.name, id:item.id})
                    }
                    setShowDropDownModel(false);
                    setDropdownMultiple(false);
                }}
            />

            <DatePickerComponent
                visible={showDatePicker}
                mode={"date"}
                value={new Date(Date.now())}
                onChange={(event, selectedDate) => {
                    console.log("date: ", selectedDate);
                    if (Platform.OS === "android") {
                        if (selectedDate) {
                            updateSelectedDate(selectedDate, datePickerId)
                        }
                    } else {
                        updateSelectedDate(selectedDate, datePickerId)
                    }
                    setShowDatePicker(false);
                }}
                onRequestClose={() => setShowDatePicker(false)}
            />

            <Text style={styles.label}>Date From<Text style={styles.important}>*</Text></Text>
            <Pressable 
                style={styles.inputDate}
                onPress={() => showDatePickerMethod("FROM_DATE")}
            >
                <Text style={styles.placeholder}>{selectedFromDate}</Text>
                <MaterialCommunityIcons name="calendar" color={Colors.GRAY} size={22}/>
            </Pressable>

            {/* Space */}
            <View style={styles.space}></View>

            <Text style={styles.label}>Date To<Text style={styles.important}>*</Text></Text>
            <Pressable 
                style={styles.inputDate}
                onPress={() => showDatePickerMethod("TO_DATE")}
            >
                <Text style={styles.placeholder}>{selectedToDate}</Text>
                <MaterialCommunityIcons name="calendar" color={Colors.GRAY} size={22} />
            </Pressable>

            {/* Space */}
            <View style={styles.space}></View>

            <Text style={styles.label}>Location<Text style={styles.important}>*</Text></Text>
            <Pressable 
                style={styles.dropdownContainer}
                onPress={() => showDropDownMethod("LOCATION", "Select Location")}
            >
                <Text style={styles.placeholder}>{selectedLocation.name}</Text>
                <MaterialCommunityIcons name="menu-down" color={Colors.GRAY} size={25} />
            </Pressable>
            {locationError.length > 0 && <Text style={styles.errorText}>{locationError}</Text>}

            {/* Space */}
            <View style={styles.space}></View>

            <Text style={styles.label}>Dealer Code<Text style={styles.important}>*</Text></Text>
            <Pressable 
                style={styles.dropdownContainer}
                onPress={() => showDropDownMethod("DEALER_CODE", "Select Dealer")}
            >   
                <Text style={[styles.placeholder]} numberOfLines={1}>{dealerName.length > 1 ? dealerName : "Dealer Code"}</Text>
                <MaterialCommunityIcons name="menu-down" color={Colors.GRAY} size={25} />
            </Pressable>

            <Pressable
                style={styles.button}
                onPress={() => downloadReport()}
            >
                <Text style={styles.buttonText}>Download Report</Text>
            </Pressable>
            <LoaderComponent visible={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 20,
        padding: 20,
        borderRadius: 8,
        backgroundColor: Colors.WHITE
    },
    inputDate: {
        borderWidth: 1,
        borderColor: Colors.GRAY,
        marginTop: 8,
        borderRadius: 6,
        padding: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    important: {
        color: "red"
    },
    label: {
        color: Colors.BLACK,
        fontWeight: "bold",
    },
    space: {
        marginTop: 15
    },
    dropdownContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.GRAY,
        marginTop: 8,
        borderRadius: 6,    
        padding: 11,
    },
    button: {
        backgroundColor: "#f81567",
        height: 50,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        elevation: 3,
        marginTop: 30
    },
    buttonText: {
        fontWeight: "bold",
        color: Colors.WHITE
    },
    placeholder: {
        // fontWeight: "bold", 
        color: Colors.BLACK
    },
    errorText: {
        fontSize: 11,
        color: Colors.RED,
        marginTop: 4,
    }
});

export default etvbrlReportScreen;