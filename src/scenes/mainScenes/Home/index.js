
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Image } from 'react-native';
import { Colors } from '../../../styles';
import { Searchbar } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import VectorImage from 'react-native-vector-image';
import { FILTER } from '../../../assets/svg'

const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 30) / 2;
const data = [1, 2]

const HomeScreen = ({ navigation }) => {

    const [searchQuery, setSearchQuery] = React.useState('');


    const onChangeSearch = query => setSearchQuery(query);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 15, }}>
                <View style={{ flexDirection: 'row', height: 60, alignItems: 'center', justifyContent: 'space-between' }}>
                    <Searchbar
                        style={{ width: '90%' }}
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />
                    <VectorImage
                        width={25}
                        height={25}
                        source={FILTER}
                        style={{ tintColor: Colors.DARK_GRAY }}
                    />
                </View>

                <FlatList
                    data={data}
                    numColumns={2}
                    horizontal={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ flex: 1, width: itemWidth, padding: 5 }}>
                                <View style={[styles.shadow, { backgroundColor: index == 0 ? Colors.YELLOW : Colors.GREEN }]}>
                                    <View style={{ overflow: 'hidden' }}>
                                        <Image
                                            style={{ width: '100%', height: 150, overflow: "hidden" }}
                                            resizeMode={'cover'}
                                            source={require('../../../assets/images/bently.png')}
                                        />
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: Colors.LIGHT_GRAY
    },
    shadow: {
        //   overflow: 'hidden',
        borderRadius: 4,
        width: '100%',
        height: 250,
        shadowColor: Colors.DARK_GRAY,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.5,
        elevation: 3,
        position: 'relative'
    }
})