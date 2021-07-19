import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, Pressable, Alert, Platform } from 'react-native';
import { PreEnquiryItem } from '../../../pureComponents/preEnquiryItem';
import { PageControlItem } from '../../../pureComponents/pageControlItem';
import { Colors, GlobalStyle } from '../../../styles';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from 'react-native-paper';
import VectorImage from 'react-native-vector-image';
import { CREATE_NEW } from '../../../assets/svg';
import { AppNavigator } from '../../../navigations';
import { CallUserComponent, SortAndFilterComp } from '../../../components';
import { callPressed, sortAndFilterPressed } from '../../../redux/preEnquirySlice'

const PreEnquiryScreen = ({ navigation }) => {

    const selector = useSelector(state => state.preEnquiryReducer);
    const dispatch = useDispatch();

    return (
        <SafeAreaView style={styles.conatiner}>

            <CallUserComponent visible={selector.modelVisible} onRequestClose={() => dispatch(callPressed())} />

            <SortAndFilterComp
                visible={selector.sortAndFilterVisible}
                onRequestClose={() => {
                    dispatch(sortAndFilterPressed());
                }}
            />

            {/* {selector.modelVisible && <DatePickerComponent
                visible={selector.modelVisible}
                mode={'date'}
                value={new Date(Date.now())}
                onChange={(event, selectedDate) => {
                    console.log('date: ', selectedDate)
                    if (Platform.OS === "android") {
                        dispatch(callPressed());
                    }
                }}
                onRequestClose={() => {
                    console.log('closed');
                    dispatch(callPressed())
                }}
            />} */}


            <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 10 }}>

                <View style={styles.view1}>
                    <PageControlItem
                        pageNumber={1}
                        totalPages={10}
                    />
                    <Pressable onPress={() => dispatch(sortAndFilterPressed())}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.text1}>{'Sort & Filter'}</Text>
                            <IconButton icon={'dots-vertical'} size={20} color={Colors.RED} style={{ margin: 0 }} />
                        </View>
                    </Pressable>
                </View>

                <View style={GlobalStyle.shadow}>
                    <FlatList
                        data={selector.sampleDataAry}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {

                            let color = Colors.WHITE;
                            if (index % 2 != 0) {
                                color = Colors.LIGHT_GRAY;
                            }

                            return (
                                < PreEnquiryItem
                                    bgColor={color}
                                    name={item.name}
                                    subName={item.role}
                                    date={item.date}
                                    type={item.type}
                                    modelName={item.vehicle}
                                    onPress={() => { }}
                                    onCallPress={() => dispatch(callPressed())}
                                />
                            )
                        }}
                    />
                </View>

                <View style={[styles.addView, GlobalStyle.shadow]}>
                    <Pressable onPress={() => navigation.navigate(AppNavigator.EmsStackIdentifiers.addPreEnq)}>
                        <VectorImage source={CREATE_NEW} width={60} height={60} />
                    </Pressable>
                </View>

            </View>
        </SafeAreaView >
    )
}

export default PreEnquiryScreen;

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
    },
    view1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    text1: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.RED
    },
    addView: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    }
})