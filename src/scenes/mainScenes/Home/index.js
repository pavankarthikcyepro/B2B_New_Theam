
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
            <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 15 }}>
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
                            <View style={{ width: itemWidth, height: 200, padding: 5 }}>
                                <View style={styles.shadow}>
                                    <Image
                                        style={{ width: '100%', height: 100 }}
                                        source={require('../../../assets/images/bently.png')}
                                    />
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
        overflow: 'hidden',
        borderRadius: 4,
        width: '90%',
        height: '100%',
        shadowColor: Colors.DARK_GRAY,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        backgroundColor: 'red'
    }
})