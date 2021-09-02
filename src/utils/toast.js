
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-simple-toast';
import { Platform, Linking } from 'react-native';
import { Colors } from '../styles';

export const showToast = (title) => {
    if (Platform.OS === 'ios') {
        Snackbar.show({
            text: title,
            textColor: Colors.WHITE,
            backgroundColor: Colors.GRAY,
            duration: Snackbar.LENGTH_LONG,

        });
    } else {
        Toast.show(title, 3000);
    }
}

// ----------------------------------------

export const showToastSucess = (title) => {
    if (Platform.OS === 'ios') {
        Snackbar.show({
            text: title,
            textColor: Colors.WHITE,
            backgroundColor: Colors.BLUE,
            duration: Snackbar.LENGTH_LONG,
        });
    } else {
        Toast.show(title, 4000);
    }
}

// ----------------------------------------

export const showToastRedAlert = (title) => {
    if (Platform.OS === 'ios') {
        Snackbar.show({
            text: title,
            textColor: Colors.WHITE,
            backgroundColor: Colors.RED,
            duration: Snackbar.LENGTH_LONG,
        });
    } else {
        Toast.show(title, 3000);
    }
}
