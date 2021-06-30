
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../styles';
import { TextinputComp } from '../../components/textinputComp';
import { ButtonComp } from '../../components/buttonComp';

const ScreenWidth = Dimensions.get('window').width;

const LoginScreen = () => {

    const [value, setValue] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <SafeAreaView style={styles.container}>

            <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
                <TextinputComp
                    value={value}
                    label={'Employee ID'}
                    mode={'outlined'}
                    onChangeText={(text) => setValue(text)}
                />
                <View style={{ height: 20 }}></View>
                <TextinputComp
                    value={password}
                    label={'Password'}
                    mode={'outlined'}
                    isSecure={true}
                    onChangeText={(text) => setPassword(text)}
                />
                <View style={{ height: 20 }}></View>
                <ButtonComp title={'LOG IN'} width={ScreenWidth - 40} onPress={() => { }} />

            </View>
        </SafeAreaView>
    )
}

export default LoginScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.WHITE
    }
})