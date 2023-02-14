import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors, GlobalStyle } from '../../../styles'
import Entypo from "react-native-vector-icons/FontAwesome";
import { ComplainTrackerIdentifires } from '../../../navigations/appNavigator';
const data = [
    {
        id: 0,
        name: "Active"
    },
    {
        id: 1,
        name: "Closed"
    }
]
const ComplaintTrackerMain = ({ route, navigation }) => {

    const renderItem = (item, index) => {
       
        return (
            <View style={{
                width: '100%',
                padding: 10,
                borderColor: index === 0 ? Colors.PURPLE : Colors.BLUE_V2,
                borderWidth: 1,
                borderRadius: 10,
                justifyContent: "center",
                marginVertical:10

            }}>
                <View style={styles.scondView}>
                    <Text style={{
                        fontSize: 16,
                        color: index === 0 ? Colors.CORAL : Colors.GREEN_V2,
                        fontWeight: "700",
                        paddingVertical: 10
                    }}>{item.name}</Text>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate(ComplainTrackerIdentifires.complainTrackerList);
                    }}>
                        <Text style={styles.txt1}>{30}</Text>
                    </TouchableOpacity>
                </View>
            </View>)
    }

    return (
        <SafeAreaView style={styles.conatiner}>
            <View style={{ padding: 10, }}>
                <FlatList
                    data={data}

                    renderItem={({ item, index }) => renderItem(item, index)}
                //   contentContainerStyle={styles.titleRow}
                //   bounces={false}
                />
            </View>

            <TouchableOpacity
                onPress={() => {
                    // navigation.navigate(AppNavigator.EmsStackIdentifiers.newEnquiry);
                }}
                style={[GlobalStyle.shadow, styles.floatingBtn]}
            >
                <Entypo size={25} name="plus" color={Colors.WHITE} />
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default ComplaintTrackerMain

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,

        backgroundColor: Colors.WHITE,
    },
    scondView: {
        flexDirection: "column",
        margin: 10,
    },
    txt1: {
        fontSize: 16,
        color: Colors.BLACK,
        fontWeight: "600",
        textDecorationLine: 'underline'
    },
    floatingBtn: {
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        position: "absolute",
        bottom: 40,
        right: 10,
        height: 50,
        backgroundColor: "rgba(255,21,107,6)",
        borderRadius: 100,
    },

})