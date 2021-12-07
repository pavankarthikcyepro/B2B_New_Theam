import qs from "qs";
import { Linking, Alert, Platform } from "react-native";
import moment from "moment";

export const isMobileNumber = (mobile) => {
  var regex = /^[1-9]{1}[0-9]{9}$/; // /^\d{10}$/
  if (regex.test(mobile)) {
    return true;
  }
  return false;
};

export const isEmail = (email) => {
  var pattern = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
  );
  if (pattern.test(email)) {
    return true;
  }
  return false;
};

export const isValidateAlphabetics = (text) => {
  // const regex = /^[a-zA-Z]+$/;
  const regex = /^[a-zA-Z ]*$/
  if (regex.test(text)) {
    return true;
  }
  return false;
};

export const callNumber = (phone) => {
  console.log("callNumber ----> ", phone);
  let phoneNumber = phone;
  if (Platform.OS !== "android") {
    phoneNumber = `telprompt:${phone}`;
  } else {
    phoneNumber = `tel:${phone}`;
  }
  Linking.canOpenURL(phoneNumber)
    .then((supported) => {
      if (!supported) {
        Alert.alert("Phone number is not available");
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch((err) => console.log(err));
};

export async function sendEmail(to, subject, body, options = {}) {
  const { cc, bcc } = options;

  let url = `mailto:${to}`;

  // Create email link query
  const query = qs.stringify({
    subject: subject,
    body: body,
    cc: cc,
    bcc: bcc,
  });

  if (query.length) {
    url += `?${query}`;
  }

  // check if we can use this link
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error("Provided URL can not be handled");
  }

  return Linking.openURL(url);
}

export const convertToTime = (isoDate) => {
  const date = moment(isoDate).format("HH:mm");
  return date;
};

export const convertToDate = (isoDate, format = "DD/MM/YYYY") => {
  const date = moment(isoDate).format(format);
  return date;
};

export const convertTimeStampToDateString = (timeStamp, format) => {
  if (!timeStamp || timeStamp.length === 0) return "";
  format = format ? format : "DD/MM/YYYY h:mm a";
  const date = moment(timeStamp).format(format);
  return date;
};

export const convertDateStringToMilliseconds = (dateString) => {
  console.log("dateString: ", dateString);
  if (!dateString) {
    return null;
  }
  const milliseconds = Date.parse(dateString);
  return milliseconds;
};

export const convertDateStringToMillisecondsUsingMoment = (
  date,
  format = "DD/MM/YYYY"
) => {
  if (!date) return "";
  const result = moment(date, format).valueOf();
  return result;
};

export const random_color = (format) => {
  var rint = Math.floor(0x100000000 * Math.random());
  switch (format) {
    case 'hex':
      return '#' + ('00000' + rint.toString(16)).slice(-6).toUpperCase();
    case 'hexa':
      return '#' + ('0000000' + rint.toString(16)).slice(-8).toUpperCase();
    case 'rgb':
      return 'rgb(' + (rint & 255) + ',' + (rint >> 8 & 255) + ',' + (rint >> 16 & 255) + ')';
    case 'rgba':
      return 'rgba(' + (rint & 255) + ',' + (rint >> 8 & 255) + ',' + (rint >> 16 & 255) + ',' + (rint >> 24 & 255) / 255 + ')';
    default:
      return rint;
  }
}

export const rgbaColor = () => {
  var x = Math.floor(Math.random() * 256);
  var y = Math.floor(Math.random() * 256);
  var z = Math.floor(Math.random() * 256);
  const rgbValue = `rgba(${x}, ${y}, ${z}, 1)`;
  return rgbValue;
}