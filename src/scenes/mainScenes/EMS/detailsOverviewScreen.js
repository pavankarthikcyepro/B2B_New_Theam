import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import { Colors, GlobalStyle } from '../../../styles';
import VectorImage from "react-native-vector-image";
import { MODEL_SELECTION, COMMUNICATION_DETAILS, CUSTOMER_PROFILE } from "../../../assets/svg";
import { TextinputComp } from '../../../components';
import { DropDownComponant } from '../../../components';
import { DropDownSelectionItem } from '../../../pureComponents/dropDownSelectionItem';

const DetailsOverviewScreen = () => {

    const [expanded, setExpanded] = React.useState(true);
    const [text, setText] = React.useState("");

    const handlePress = () => {
        setExpanded(!expanded)
    };

    return (
        <SafeAreaView style={[styles.container, { flexDirection: 'column' }]}>

            {/* // select modal */}
            <DropDownComponant
                visible={false}
                headerTitle={'Select Model'}
                data={[]}
                selectedItems={(item) => {
                    console.log('selected: ', item);
                }}
            />

            <ScrollView
                automaticallyAdjustContentInsets={true}
                bounces={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 10 }}
                style={{ flex: 1 }}
            >

                <View style={styles.baseVw}>




                    <View style={[{ marginVertical: 10, borderRadius: 10, }]}>
                        <List.Accordion
                            title="Modal Selection"
                            titleStyle={{ fontSize: 18, fontWeight: '600', color: Colors.BLACK }}
                            style={{ backgroundColor: expanded == true ? Colors.RED : Colors.WHITE }}
                            // left={props => <VectorImage height={25} width={25} source={COMMUNICATION_DETAILS} />}
                            expanded={expanded}
                            onPress={handlePress}>

                            <View style={{ width: '100%' }}>
                                <DropDownSelectionItem
                                    label={'Salutation*'}
                                    value={"Test"}
                                    onPress={() => { }}
                                />
                                <TextinputComp
                                    style={{ height: 65, width: '100%' }}
                                    value={text}
                                    label={'First Name*'}
                                    onChangeText={(text) => setText(text)}
                                />
                                <Text style={GlobalStyle.underline}></Text>
                                <TextinputComp
                                    style={{ height: 65, width: '100%' }}
                                    value={text}
                                    label={'Last Name*'}
                                    onChangeText={(text) => setText(text)}
                                />
                                <Text style={GlobalStyle.underline}></Text>
                                <TextinputComp
                                    style={{ height: 65, width: '100%' }}
                                    value={text}
                                    label={'Mobile Number*'}
                                    onChangeText={(text) => setText(text)}
                                />
                                <Text style={GlobalStyle.underline}></Text>
                                <TextinputComp
                                    style={{ height: 65, width: '100%' }}
                                    value={text}
                                    label={'Alter Mobile Number*'}
                                    onChangeText={(text) => setText(text)}
                                />
                                <Text style={GlobalStyle.underline}></Text>
                                <TextinputComp
                                    style={{ height: 65, width: '100%' }}
                                    value={text}
                                    label={'Email ID*'}
                                    onChangeText={(text) => setText(text)}
                                />
                                <Text style={GlobalStyle.underline}></Text>
                                <DropDownSelectionItem
                                    label={'Gender*'}
                                    value={"Test"}
                                    onPress={() => { }}
                                />
                                <DropDownSelectionItem
                                    label={'Relation*'}
                                    value={"Test"}
                                    onPress={() => { }}
                                />
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ width: '50%' }}>
                                        <TextinputComp
                                            style={{ height: 65, width: '100%' }}
                                            value={'09/08/9908'}
                                            label={'Date Of Birth'}
                                            onChangeText={(text) => setText(text)}
                                            showRightIcon={true}
                                            rightIconObj={{ name: 'calendar-range', color: Colors.GRAY }}
                                        />
                                        <Text style={GlobalStyle.underline}></Text>
                                    </View>

                                    <View style={{ width: '50%' }}>
                                        <TextinputComp
                                            style={{ height: 65, width: '100%' }}
                                            value={text}
                                            label={'Anniversary Date'}
                                            onChangeText={(text) => setText(text)}
                                            showRightIcon={true}
                                            rightIconObj={{ name: 'calendar-range', color: Colors.GRAY }}
                                        />
                                        <Text style={GlobalStyle.underline}></Text>
                                    </View>

                                </View>
                            </View>


                        </List.Accordion>
                    </View>




                    {/* <View style={[{ marginVertical: 10, borderRadius: 10, }, styles.shadow]}>
                    <List.Accordion
                        title="Modal Selection"
                        titleStyle={{ fontSize: 18, fontWeight: '600', color: Colors.BLACK }}
                        style={{ backgroundColor: expanded == true ? Colors.RED : Colors.WHITE }}
                        left={props => <VectorImage height={20} width={50} source={MODEL_SELECTION} />}
                        // left={props => <List.Icon {...props} icon="folder" style={{ margin: 0 }} />}
                        expanded={expanded}
                        onPress={handlePress}>
                        <View style={{ width: '100%', height: 50, backgroundColor: 'green' }}></View>
                        <View style={{ width: '100%', height: 50, backgroundColor: 'gray' }}></View>

                        <View style={{ width: '100%', height: 50, backgroundColor: 'cyan' }}></View>

                    </List.Accordion>
                </View> */}

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DetailsOverviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    baseVw: {
        paddingHorizontal: 10
    },
    shadow: {
        shadowColor: Colors.DARK_GRAY,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.5,
        elevation: 3,
    }
})