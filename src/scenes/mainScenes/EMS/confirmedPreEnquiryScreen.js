import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { ButtonComp } from "../../../components/buttonComp";
import { Checkbox, Button, IconButton, Divider } from 'react-native-paper';
import { Colors, GlobalStyle } from '../../../styles';
import { TextinputComp } from '../../../components/textinputComp';
import { DropDownComponant } from '../../../components/dropDownComp';

const screenWidth = Dimensions.get('window').width;


const ConfirmedPreEnquiryScreen = () => {

    const [checked, setChecked] = useState(false);
    const [text, setText] = useState("");

    return (
        <SafeAreaView style={styles.container}>

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
                        value={"Ravinder Katta"}
                        label={'Customer Name'}
                        editable={false}
                        onChangeText={(text) => setText(text)}
                    />
                    <Text style={styles.devider}></Text>
                    <TextinputComp
                        style={{ height: 70 }}
                        value={"345678956"}
                        label={'Mobile Number'}
                        editable={false}
                        onChangeText={(text) => setText(text)}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={{ height: 70 }}
                        value={"09/08/2021"}
                        label={'Date Created'}
                        editable={false}
                        onChangeText={(text) => setText(text)}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={{ height: 70 }}
                        value={"Showroom"}
                        label={'Source of Pre-Enquiry'}
                        editable={false}
                        onChangeText={(text) => setText(text)}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={{ height: 70 }}
                        value={"Creta"}
                        label={'Modal'}
                        editable={false}
                        onChangeText={(text) => setText(text)}
                    />
                    <Text style={styles.devider}></Text>

                    <TextinputComp
                        style={{ height: 70 }}
                        value={"Pre-enquiry"}
                        label={'Status'}
                        editable={false}
                        onChangeText={(text) => setText(text)}
                    />
                    <Text style={styles.devider}></Text>

                    <View style={styles.view2}>
                        <Text style={[styles.text2, { color: Colors.GRAY }]}>{'Allocated DSE'}</Text>
                        <View style={styles.view3}>
                            <Button
                                mode="contained"
                                labelStyle={{ textTransform: 'none' }}
                                onPress={() => console.log('Pressed')}
                            >
                                Create Enuqiry
                            </Button>
                            <Button
                                mode="contained"
                                labelStyle={{ textTransform: 'none' }}
                                onPress={() => console.log('Pressed')}
                            >
                                No Thanks
                            </Button>
                        </View>
                    </View>

                </View>

            </ScrollView>
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