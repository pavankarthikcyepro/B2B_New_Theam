import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, BackHandler } from 'react-native';
import { ButtonComp } from "../../../components/buttonComp";
import { Checkbox, Button, IconButton, Divider } from 'react-native-paper';
import { Colors, GlobalStyle } from '../../../styles';
import { TextinputComp } from '../../../components/textinputComp';
import { DropDownComponant } from '../../../components/dropDownComp';
import { convertTimeStampToDateString } from '../../../utils/helperFunctions';

const screenWidth = Dimensions.get('window').width;


const ConfirmedPreEnquiryScreen = ({ route, navigation }) => {

    const { itemData, fromCreatePreEnquiry } = route.params;
    const [checked, setChecked] = useState(false);

    useEffect(() => {

        // Subscribe Listeners
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

        // UnSubscribe Listeners
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        }
    })

    const handleBackButtonClick = () => {
        console.log("back pressed")
        navigation.popToTop();
        return true;
    }

    return (
        <SafeAreaView style={styles.container}>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                enabled
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    automaticallyAdjustContentInsets={true}
                    bounces={true}
                    contentContainerStyle={{ padding: 10 }}
                    style={{ flex: 1 }}
                >
                    <View style={styles.view1}>
                        <Text style={styles.text1}>{'Pre-Enquiry'}</Text>

                        <IconButton
                            icon="square-edit-outline"
                            color={Colors.DARK_GRAY}
                            size={25}
                            onPress={() => console.log('Pressed')}
                        />
                    </View>

                    <View style={[{ borderRadius: 6, }]}>
                        <TextinputComp
                            style={{ height: 70 }}
                            value={itemData.firstName + " " + itemData.lastName}
                            label={'Customer Name'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>
                        <TextinputComp
                            style={{ height: 70 }}
                            value={itemData.phone}
                            label={'Mobile Number'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>

                        <TextinputComp
                            style={{ height: 70 }}
                            value={convertTimeStampToDateString(itemData.createdDate)}
                            label={'Date Created'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>

                        <TextinputComp
                            style={{ height: 70 }}
                            value={itemData.enquirySource}
                            label={'Source of Pre-Enquiry'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>

                        <TextinputComp
                            style={{ height: 70 }}
                            value={itemData.model}
                            label={'Modal'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>

                        <TextinputComp
                            style={{ height: 70 }}
                            value={itemData.leadStage}
                            label={'Status'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>

                        <View style={styles.view2}>
                            <Text style={[styles.text2, { color: Colors.GRAY }]}>{'Allocated DSE'}</Text>
                            <View style={styles.view3}>
                                <Button
                                    mode="contained"
                                    color={Colors.RED}
                                    labelStyle={{ textTransform: 'none', color: Colors.WHITE }}
                                    onPress={() => console.log('Pressed')}
                                >
                                    Create Enuqiry
                                </Button>
                                <Button
                                    mode="contained"
                                    color={Colors.BLACK}
                                    labelStyle={{ textTransform: 'none', color: Colors.WHITE }}
                                    onPress={() => navigation.popToTop()}
                                >
                                    No Thanks
                                </Button>
                            </View>
                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView >
    )
}

export default ConfirmedPreEnquiryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 10
    },
    text1: {
        fontSize: 16,
        fontWeight: '700',
        paddingLeft: 5
    },
    view1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
    },
    text2: {
        fontSize: 14,
        fontWeight: '600'
    },
    devider: {
        width: '100%', height: 0.5, backgroundColor: Colors.GRAY
    },
    view2: {
        backgroundColor: Colors.WHITE,
        padding: 10
    },
    view3: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})