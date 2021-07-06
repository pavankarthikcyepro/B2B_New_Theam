import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
} from 'react-native'
import { Colors } from '../../styles'
import { TextinputComp } from '../../components/textinputComp'
import { ButtonComp } from '../../components/buttonComp'
import { AuthNavigator } from '../../navigations'

const ScreenWidth = Dimensions.get('window').width

const LoginScreen = ({ navigation }) => {
  const loginButtonClicked = () => {
    navigation.navigate(AuthNavigator.AuthStackIdentifiers.PREENQUIRY)
  }
  const [value, setValue] = React.useState('')
  const [password, setPassword] = React.useState('')

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 15, marginTop: -60 }}>
        <Image
          style={{ width: '100%', height: 600 }}
          resizeMode={'stretch'}
          source={require('../../assets/images/Rectangle.png')}
        />
        <View style={{ height: 70 }}></View>
        <Text
          style={{
            color: 'red',
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 30,
            marginLeft: 50,
            marginTop: -370,
          }}
        >
          Welcome To Automate.
        </Text>
        <View style={{ height: 30 }}></View>
        <TextinputComp
          value={value}
          label={'Employee ID'}
          mode={'outlined'}
          onChangeText={(text) => setValue(text)}
        />
        <View style={{ height: 30 }}></View>
        <TextinputComp
          value={password}
          label={'Password'}
          mode={'outlined'}
          isSecure={true}
          onChangeText={(text) => setPassword(text)}
        />
        <Text
          style={{
            marginLeft: 240,
            marginTop: 10,
            color: 'gray',
            fontSize: 12,
          }}
        >
          Forgot Password?
        </Text>
        <View style={{ height: 50 }}></View>
        <ButtonComp
          title={'LOGIN'}
          width={ScreenWidth - 0}
          onPress={loginButtonClicked}
        />
        <View style={{ height: 35 }}></View>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginLeft: 30 }}>
          User's Profile
        </Text>
        <View style={{ height: 10 }}></View>
        <Text
          style={{
            color: 'gray',
            fontSize: 10,
            marginLeft: 30,
            marginRight: 15,
          }}
        >
          Thanks to user's profile your vehicles,service books and massages will
          be stored safely in a cloud,so you do not have to worry about that
          anyone
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // alignContent:'center',
    backgroundColor: Colors.WHITE,
  },
})
