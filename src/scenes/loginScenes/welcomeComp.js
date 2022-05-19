
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Colors } from '../../styles';
import { ButtonComp } from '../../components/buttonComp';
import { AuthNavigator } from '../../navigations';

const ScreenWidth = Dimensions.get('window').width;

const WelcomeScreen = ({ navigation }) => {

    const loginButtonClicked = () => {
        navigation.navigate(AuthNavigator.AuthStackIdentifiers.LOGIN)
    }

    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            width: "100%",
            height: 300,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: "80%", height: 80 }}
            resizeMode={"center"}
            source={require("../../assets/images/logo.png")}
          />
        </View>
        {/* <Image
                style={{ width: '100%', height: 300 }}
                resizeMode={'center'}
                source={require('../../assets/images/welcome.png')}
            /> */}
        {/* source={require('../../assets/images/logo.png')}
            /> */}
        <ButtonComp
          title={"LOG IN"}
          width={ScreenWidth - 40}
          onPress={loginButtonClicked}
          color={ Colors.PINK}
        />

        <View style={styles.bottomViewStyle}>
          <Text style={styles.textOneStyle}>{"Important Notice"}</Text>
          <Text style={styles.textTwoStyle}>
            {
              "By using this app, you agree to the use of cookies and data processing technologies by us."
            }
          </Text>
        </View>
      </SafeAreaView>
    );
}

export default WelcomeScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.LIGHT_GRAY
    },
    bottomViewStyle: {
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: 30,
        paddingBottom: 30
    },
    textOneStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.BLACK
    },
    textTwoStyle: {
        marginTop: 20,
        fontSize: 14,
        fontWeight: '400',
        color: Colors.DARK_GRAY
    }
})