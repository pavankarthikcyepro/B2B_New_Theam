import { Linking, Alert, Platform } from 'react-native';
import moment from 'moment';

export const isMobileNumber = (mobile) => {

    var regex = /^[1-9]{1}[0-9]{9}$/; // /^\d{10}$/
    if (regex.test(mobile)) {
        return true;
    }
    return false;
}

export const isEmail = (email) => {

    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if (pattern.test(email)) {
        return true;
    }
    return false;
}

export const callNumber = phone => {
    console.log('callNumber ----> ', phone);
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${phone}`;
    }
    else {
        phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
        .then(supported => {
            if (!supported) {
                Alert.alert('Phone number is not available');
            } else {
                return Linking.openURL(phoneNumber);
            }
        })
        .catch(err => console.log(err));
}

export const convertTimeStampToDateString = (timeStamp, format) => {
    if (!timeStamp) return "";
    format = format ? format : "DD/MM/YYYY h:mm a";
    const date = moment(timeStamp).format(format);
    return date;
}