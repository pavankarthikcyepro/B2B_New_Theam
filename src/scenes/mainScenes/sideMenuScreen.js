import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions, Image, FlatList } from 'react-native';
import { IconButton, Divider, List } from 'react-native-paper';
import { Colors } from '../../styles'
import VectorImage from 'react-native-vector-image';
import { SETTINGS, SCHEDULE_FILL } from '../../assets/svg';

const screenWidth = Dimensions.get('window').width;
const profileWidth = screenWidth / 4;
const testData = [
    {
        title: "Attendance",
        icon: SETTINGS,
    },
    {
        title: "Team Target Assignment",
        icon: SCHEDULE_FILL,
    },
    {
        title: "Pending booking tracker",
        icon: SETTINGS,
    },
    {
        title: "Event Management",
        icon: SCHEDULE_FILL,
    },
    {
        title: "Customer Relationship",
        icon: SETTINGS,
    },
    {
        title: "Document Wallet",
        icon: SCHEDULE_FILL,
    },
    {
        title: "Helpdesk",
        icon: SETTINGS,
    }
]


const SideMenuScreen = ({ navigation }) => {


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topView}>
                <IconButton
                    icon={'chevron-left'}
                    size={30}
                    color={Colors.DARK_GRAY}
                    onPress={() => { navigation.closeDrawer() }}
                />
                <Text style={styles.nameStyle}>{'Welcome Ravinder,'}</Text>
            </View>
            <View style={styles.profileContainerView}>
                <Image
                    style={{ width: profileWidth, height: profileWidth, borderRadius: profileWidth / 2 }}
                    source={require('../../assets/images/bently.png')}
                />
                <View style={{ marginTop: 15 }}>
                    <Text style={[styles.nameStyle, { textAlign: 'center' }]}>{'Ravinder Katta'}</Text>
                    <Text style={styles.text1}>{'Branch Manager, 40yrs'}</Text>
                </View>

                <View style={{ marginTop: 15 }}>
                    <Text style={styles.text2}>{'Email: '}<Text style={[styles.text2, { color: Colors.SKY_BLUE }]}>{'test@bharatgroupe.com'}</Text></Text>
                    <Text style={styles.text2}>{'Office Location: ' + 'Hyd-Jubli Hills'}</Text>
                </View>
            </View>
            <Divider />
            <FlatList
                data={testData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ paddingLeft: 10 }}>
                            <List.Item
                                title={item.title}
                                titleStyle={{ fontSize: 16, fontWeight: '600' }}
                                left={props => <List.Icon {...props} icon="folder" />}
                            />
                            {/* // <VectorImage source={item.icon} width={20} height={20} /> */}
                            <Divider />
                        </View>
                    )
                }}
            />
        </SafeAreaView>
    )
}

export default SideMenuScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    topView: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center'
    },
    nameStyle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.BLACK
    },
    profileContainerView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30
    },
    text1: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: '200',
        color: Colors.DARK_GRAY
    },
    text2: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '400',
        color: Colors.GRAY
    }
})