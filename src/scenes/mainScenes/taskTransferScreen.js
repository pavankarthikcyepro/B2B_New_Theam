import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image
} from "react-native";
import { Colors } from "../../styles";
import { SettingsScreenItem } from "../../pureComponents/settingScreenItem";
const screenWidth = Dimensions.get("window").width;
import { Dropdown } from 'react-native-element-dropdown';

const datalist = [
    {
        name: "Task Transfer",
    },
];

const dropdownData = [
        { label: 'Item 1', value: '1' },
        { label: 'Item 2', value: '2' },
        { label: 'Item 3', value: '3' },
        { label: 'Item 4', value: '4' },
        { label: 'Item 5', value: '5' },
        { label: 'Item 6', value: '6' },
        { label: 'Item 7', value: '7' },
        { label: 'Item 8', value: '8' },
    ];

const TaskTranferScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={styles.view2}>
                <FlatList
                    data={datalist}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={() => {
                        return <View style={styles.view1}></View>;
                    }}
                    renderItem={({ item, index }) => {
                        return <SettingsScreenItem name={item.name} />;
                    }}
                />
            </View> */}
            <View style={{width: '100%', paddingHorizontal: 15, height: 60, justifyContent: 'center'}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}} >Select Employee to Transfer Tasks</Text>
            </View>
            <View style={{ width: '100%', paddingHorizontal: 15, justifyContent: 'center'}}>
                <View style={styles.dropWrap}>
                    <View style={styles.dropHeadTextWrap}>
                        <Text style={styles.dropHeadText}>Branch</Text>
                    </View>
                    <Dropdown
                        style={[styles.dropdownContainer,]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={dropdownData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={'Select Branch'}
                        searchPlaceholder="Search..."
                        renderRightIcon={() => (
                            <Image style={{height: 5, width: 10}} source={require('../../assets/images/Polygon.png')} />
                        )}
                        // value={value}
                        // onFocus={() => setIsFocus(true)}
                        // onBlur={() => setIsFocus(false)}
                        onChange={async (item) => {
                            console.log("£££", item);
                        }}
                    />
                </View>
                <View style={styles.dropWrap}>
                    <View style={styles.dropHeadTextWrap}>
                        <Text style={styles.dropHeadText}>Department</Text>
                    </View>
                    <Dropdown
                        style={[styles.dropdownContainer,]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={dropdownData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={'Select Department'}
                        searchPlaceholder="Search..."
                        renderRightIcon={() => (
                            <Image style={{ height: 5, width: 10 }} source={require('../../assets/images/Polygon.png')} />
                        )}
                        // value={value}
                        // onFocus={() => setIsFocus(true)}
                        // onBlur={() => setIsFocus(false)}
                        onChange={async (item) => {
                            console.log("£££", item);
                        }}
                    />
                </View>

                <View style={styles.dropWrap}>
                    <View style={styles.dropHeadTextWrap}>
                        <Text style={styles.dropHeadText}>Designation</Text>
                    </View>
                    <Dropdown
                        style={[styles.dropdownContainer,]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={dropdownData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={'Select Designation'}
                        searchPlaceholder="Search..."
                        renderRightIcon={() => (
                            <Image style={{ height: 5, width: 10 }} source={require('../../assets/images/Polygon.png')} />
                        )}
                        // value={value}
                        // onFocus={() => setIsFocus(true)}
                        // onBlur={() => setIsFocus(false)}
                        onChange={async (item) => {
                            console.log("£££", item);
                        }}
                    />
                </View>

                <View style={styles.dropWrap}>
                    <View style={styles.dropHeadTextWrap}>
                        <Text style={styles.dropHeadText}>Employee</Text>
                    </View>
                    <Dropdown
                        style={[styles.dropdownContainer,]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={dropdownData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={'Select Employee'}
                        searchPlaceholder="Search..."
                        renderRightIcon={() => (
                            <Image style={{ height: 5, width: 10 }} source={require('../../assets/images/Polygon.png')} />
                        )}
                        // value={value}
                        // onFocus={() => setIsFocus(true)}
                        // onBlur={() => setIsFocus(false)}
                        onChange={async (item) => {
                            console.log("£££", item);
                        }}
                    />
                </View>
                
            </View>
            <View style={styles.nextBtnWrap}>
                <View style={styles.nextBtn}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }}>Next</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default TaskTranferScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.LIGHT_GRAY,
        paddingTop: 10,
    },
    view2: {
        flex: 1,
        padding: 10,
    },
    list: {
        padding: 20,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
    },
    view1: {
        height: 10,
        backgroundColor: Colors.LIGHT_GRAY,
    },
    dropdownContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderWidth: 1,
        borderColor: '#000000',
        width: '100%',
        height: 57,
        borderRadius: 5
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    dropHeadTextWrap: { height: 30, paddingHorizontal: 8, position: 'absolute', top: -8, left: 10, backgroundColor: '#fff', zIndex: 9 },
    dropHeadText: { color: '#B8B8B8', fontSize: 12 },
    dropWrap: { position: 'relative', marginBottom: 20 },
    nextBtnWrap: { width: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
    nextBtn: { height: 50, width: 200, backgroundColor: '#FC291C', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }
});
