
import React, { useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions, Pressable, Animated } from 'react-native';
import { Colors } from '../../styles';
import { TextinputComp } from '../../components/textinputComp';
import { ButtonComp } from '../../components/buttonComp';
import { useSelector, useDispatch } from 'react-redux';
import { updateEmployeeId, updatePassword } from '../../redux/loginSlice';
import { AuthNavigator } from '../../navigations';
import { IconButton } from 'react-native-paper';

const ScreenWidth = Dimensions.get('window').width;

const LoginScreen = ({ navigation }) => {

    const selector = useSelector(state => state.loginReducer);
    const dispatch = useDispatch();
    const fadeAnima = useRef(new Animated.Value(0)).current;

    useEffect(() => {

        Animated.timing(fadeAnima, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true
        }).start();
    }, [])

    const loginClicked = () => {
        console.log('name: ', selector.employeeId);
        console.log('name: ', selector.password);

        // if () {

        // }
    }

    const forgotClicked = () => {
        navigation.navigate(AuthNavigator.AuthStackIdentifiers.FORGOT)
    }

    const closeBottomView = () => {
        console.log('clicked')
        Animated.timing(fadeAnima, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true
        }).start();
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
                <Text style={styles.welcomeStyle}>{'Wlecome To Automate'}</Text>
                <TextinputComp
                    value={selector.employeeId}
                    label={'Employee ID'}
                    mode={'outlined'}
                    onChangeText={(text) => dispatch(updateEmployeeId(text))}
                />
                <View style={{ height: 20 }}></View>
                <TextinputComp
                    value={selector.password}
                    label={'Password'}
                    mode={'outlined'}
                    isSecure={true}
                    onChangeText={(text) => dispatch(updatePassword(text))}
                />
                <View style={styles.forgotView}>
                    <Pressable onPress={forgotClicked}>
                        <Text style={styles.forgotText}>{'Forgot Password?'}</Text>
                    </Pressable>
                </View>
                <View style={{ height: 40 }}></View>
                <ButtonComp title={'LOG IN'} width={ScreenWidth - 40} onPress={loginClicked} />
            </View>

            {/* Bottom Popup */}
            <Animated.View style={[styles.bottomView, { opacity: fadeAnima }]}>
                <View style={styles.bottomVwSubVw}>
                    <Text style={styles.text1}>{'User’s Profile'}</Text>
                    <Text style={styles.text2}>{'Thanks to user’s profile your vehicles, service books and massages will be stored safely in a cloud, so you do not have to worry about that anymore.'}</Text>
                </View>
                <IconButton
                    style={styles.closeStyle}
                    icon="close"
                    color={Colors.DARK_GRAY}
                    size={20}
                    onPress={closeBottomView}
                />
            </Animated.View>
        </SafeAreaView>
    )
}

export default LoginScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.WHITE
    },
    welcomeStyle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.RED,
        textAlign: 'center',
        marginBottom: 30
    },
    forgotView: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    forgotText: {
        paddingTop: 5,
        fontSize: 12,
        fontWeight: '400',
        color: Colors.DARK_GRAY,
        textAlign: 'right',
    },
    bottomView: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: Colors.LIGHT_GRAY,
        paddingVertical: 20
    },
    bottomVwSubVw: {
        paddingHorizontal: 30
    },
    text1: {
        fontSize: 14,
        fontWeight: '800',
        marginBottom: 15
    },
    text2: {
        fontSize: 12,
        fontWeight: '400',
        color: Colors.DARK_GRAY
    },
    closeStyle: {
        position: 'absolute',
        marginTop: 10,
        right: 20
    }
})