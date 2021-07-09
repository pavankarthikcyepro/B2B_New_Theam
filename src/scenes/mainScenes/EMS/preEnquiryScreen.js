import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList } from 'react-native';
import { PreEnquiryItem } from '../../../pureComponents/preEnquiryItem';
import { Colors, GlobalStyle } from '../../../styles';
import { useSelector, useDispatch } from 'react-redux';

const PreEnquiryScreen = () => {

    const selector = useSelector(state => state.preEnquiryReducer);

    return (
        <SafeAreaView style={styles.conatiner}>
            <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 10 }}>
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
                                    onPress={() => { console.log('onpress') }}
                                    onCallPress={() => { console.log('icon pressed') }}
                                />
                            )
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default PreEnquiryScreen;

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})