import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions, Image, FlatList, Pressable } from 'react-native';
import { IconButton, Divider, List } from 'react-native-paper';
import { Colors } from '../../styles'
import VectorImage from 'react-native-vector-image';
import { useSelector, useDispatch } from 'react-redux';
import { AppNavigator } from '../../navigations';

const screenWidth = Dimensions.get('window').width;
const profileWidth = screenWidth / 4;

const SideMenuScreen = ({ navigation }) => {

    const selector = useSelector(state => state.sideMenuReducer);

    const itemSelected = (item) => {
        switch (item.screen) {
            case 100:
                navigation.navigate(AppNavigator.CommonStackIdentifiers.upcomingDeliveries)
                break
            case 101:
                navigation.navigate(AppNavigator.CommonStackIdentifiers.complaint)
                break
            case 102:
                navigation.navigate(AppNavigator.CommonStackIdentifiers.settings)
                break
        }
    }

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
                data={selector.tableData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable onPress={() => itemSelected(item)}>
                            <View style={{ paddingLeft: 10 }}>
                                <List.Item
                                    title={item.title}
                                    titleStyle={{ fontSize: 16, fontWeight: '600' }}
                                    left={props => <List.Icon {...props} icon="folder" />}
                                />
                                {/* // <VectorImage source={item.icon} width={20} height={20} /> */}
                                <Divider />
                            </View>
                        </Pressable>
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