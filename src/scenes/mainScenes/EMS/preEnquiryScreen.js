import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, Pressable, Alert, ActivityIndicator } from 'react-native';
import { PreEnquiryItem } from '../../../pureComponents/preEnquiryItem';
import { PageControlItem } from '../../../pureComponents/pageControlItem';
import { Colors, GlobalStyle } from '../../../styles';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from 'react-native-paper';
import VectorImage from 'react-native-vector-image';
import { CREATE_NEW } from '../../../assets/svg';
import { AppNavigator } from '../../../navigations';
import { CallUserComponent, SortAndFilterComp } from '../../../components';
import { callPressed, sortAndFilterPressed, getPreEnquiryData } from '../../../redux/preEnquirySlice';
import * as AsyncStore from '../../../asyncStore';

const PreEnquiryScreen = ({ navigation }) => {

    const selector = useSelector(state => state.preEnquiryReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        getPreEnquiryListFromServer();
    }, [])

    const getPreEnquiryListFromServer = async () => {
        let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
        if (empId) {
            let endUrl = "?limit=10&offset=" + selector.pageNumber + "&status=PREENQUIRY&empId=" + empId;
            dispatch(getPreEnquiryData(endUrl))
        }
    }

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

                {selector.pre_enquiry_list.length > 0 ? <View style={GlobalStyle.shadow}>
                    <FlatList
                        data={selector.pre_enquiry_list}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {

                            let color = Colors.WHITE;
                            if (index % 2 != 0) {
                                color = Colors.LIGHT_GRAY;
                            }

                            return (
                                < PreEnquiryItem
                                    bgColor={color}
                                    name={item.firstName + " " + item.lastName}
                                    subName={item.enquirySource}
                                    date={item.createdDate}
                                    // type={item.type}
                                    modelName={item.model}
                                    onPress={() => { }}
                                    onCallPress={() => dispatch(callPressed())}
                                />
                            )
                        }}
                    />
                </View> : <View style={styles.emptyListVw}>
                    {selector.isLoading ? <ActivityIndicator animating={selector.isLoading} size="small" color={Colors.RED} />
                        : <Text>{'No Data Found'}</Text>}
                </View>}

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
    },
    emptyListVw: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})