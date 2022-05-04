import React, { useState, useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Pressable, Alert, TouchableOpacity, ScrollView, Keyboard, TextInput } from 'react-native';
import { Colors, GlobalStyle } from '../../../../styles';
import { IconButton, Card, Button } from 'react-native-paper';
import VectorImage from 'react-native-vector-image';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER, SPEED } from '../../../assets/svg';
import { DateItem } from '../../../pureComponents/dateItem';
import { AppNavigator } from '../../../navigations';

const MainParamScreen = ({ route, navigation }) => {
    const selector = useSelector((state) => state.homeReducer);

    const [retailData, setRetailData] = useState(null);
    const [bookingData, setBookingData] = useState(null);
    const [enqData, setEnqData] = useState(null);
    const [visitData, setVisitData] = useState(null);
    const [TDData, setTDData] = useState(null);
    const [dateDiff, setDateDiff] = useState(null);
    const [isTeamPresent, setIsTeamPresent] = useState(false);
    const [isTeam, setIsTeam] = useState(false);

    return (
        <View style={{flexDirection: 'row'}}>
            <View style={{width: '20%',}}>
                <View style={{ height: 50, }}></View>
                <View style={{ marginHorizontal: 10, justifyContent: 'center' }}>
                    <Text style={[styles.text, { color: 'blue'}]}>Retail</Text>
                </View>
            </View>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ flexDirection: 'column' }} showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false} horizontal={true}>
                <View style={styles.nameWrap}>
                    <View style={styles.nameBox}>
                        <Text style={styles.text}>Team Total</Text>
                    </View>
                    <View style={styles.nameBox}>
                        <Text style={styles.text}>Shiva</Text>
                    </View>
                    <View style={styles.nameBox}>
                        <Text style={styles.text}>Ganesh</Text>
                    </View>
                    <View style={styles.nameBox}>
                        <Text style={styles.text}>Ganesh</Text>
                    </View>
                    <View style={styles.nameBox}>
                        <Text style={styles.text}>Ganesh</Text>
                    </View>
                </View>

                <View style={styles.textBoxWrap}>
                   <View style={styles.textBox}>
                       <TextInput 
                            style={styles.textInput}
                       />
                   </View>

                    <View style={styles.textBox}>
                        <TextInput
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.textBox}>
                        <TextInput
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.textBox}>
                        <TextInput
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.textBox}>
                        <TextInput
                            style={styles.textInput}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default MainParamScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: Colors.LIGHT_GRAY,
    },
    text: { fontSize: 14, fontWeight: '500' },
    nameWrap: { width: '100%', flexDirection: 'row', marginBottom: 10, marginLeft: 10, marginTop: 10 },
    nameBox: { width: 80, justifyContent: 'center', alignItems: 'center' },
    textBox: { width: 80, height: 40, borderWidth: 1, borderRadius: 5, borderColor: 'blue', marginRight: 5 },
    textInput: {
        fontSize: 14,
        height: 40
    },
    textBoxWrap: { width: '100%', flexDirection: 'row', marginLeft: 10 }
});
