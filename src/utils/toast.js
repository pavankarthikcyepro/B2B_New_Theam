
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-simple-toast';
import { Platform, Linking, Alert } from 'react-native';
import { Colors } from '../styles';

export const showToast = (title) => {
    let msg = title.charAt(0).toUpperCase() + title.slice(1)
    if (Platform.OS === 'ios') {
        Snackbar.show({
            text: msg,
            textColor: Colors.WHITE,
            backgroundColor: Colors.GRAY,
            duration: Snackbar.LENGTH_LONG,

        });
    } else {
        Toast.show(msg, 6000);
    }
}

// ----------------------------------------

export const showToastSucess = (title) => {
    let msg = title.charAt(0).toUpperCase() + title.slice(1)
    if (Platform.OS === 'ios') {
        Snackbar.show({
            text: msg,
            textColor: Colors.WHITE,
            backgroundColor: Colors.BLUE,
            duration: Snackbar.LENGTH_LONG,
        });
    } else {
        Toast.show(msg, 6000);
    }
}

// ----------------------------------------

export const showToastRedAlert = (title) => {
    let msg = '';
    try {
        msg = title.charAt(0).toUpperCase() + title.slice(1)
    } catch (e) {
        Alert.alert('Error occurred: ');
    }
    if (Platform.OS === 'ios') {
        Snackbar.show({
            text: msg,
            textColor: Colors.WHITE,
            backgroundColor: Colors.RED,
            duration: Snackbar.LENGTH_LONG,
        });
    } else {
        Toast.show(msg, 6000);
    }
}

export const showAlertMessage = (title = "", message = "") => {
    let msg = message.charAt(0).toUpperCase() + message.slice(1)
    let ttl = title.charAt(0).toUpperCase() + title.slice(1)
    Alert.alert(
        ttl,
        msg,
        [
            {
                text: "Ok",
                onPress: () => console.log("ok Pressed"),
                style: "cancel"
            },
        ]
    )
}
