import qs from "qs";
import { Linking, Alert, Platform, PermissionsAndroid, Dimensions } from "react-native";
import moment from "moment";
import URL from "../networking/endpoints";
import { showToastRedAlert } from "../utils/toast";
import { client } from "../networking/client";
import store from "../redux/reduxStore";
import * as AsyncStore from "../asyncStore";
import {
  updateSelectedBranchId,
  updateSelectedBranchName,
} from "../redux/targetSettingsReducer";

export const isMobileNumber = (mobile) => {
  // var regex = /^[1-9]{1}[0-9]{9}$/; // /^\d{10}$/
  var regex = /^[0-9]{10}$/;
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

export const isPincode = (pincode) => {
  var patterns = /^[0-9]*$/;
  if (patterns.test(pincode)) {
    return true;
  }
  return false;
};

export const isValidate = (text) => {
  // const regex = /^[a-zA-Z]+$/;
  const regex = /^[a-zA-Z ]|([\w-]+(?:\.[\w-]+)*)*$/;
  if (regex.test(text)) {
    return true;
  }
  return false;
};

export const isValidateAlphabetics = (text) => {
  // const regex = /^[a-zA-Z]+$/;
  const regex = /^[a-zA-Z ]*$/;
  if (regex.test(text)) {
    return true;
  }
  return false;
};

export const isCheckPanOrAadhaar = (type, text) => {
  let error = false;
  if (type === "pan") {
    if (text.length > 0) {
      if (text.length != 10) {
        error = true;
      } else if (!isValidateAplhaNumeric(text)) {
        error = true;
      }
    }
  } else {
    if (text.length > 0) {
      if (text.length != 12) {
        error = true;
      } else if (!isPincode(text)) {
        error = true;
      }
    }
  }

  return error;
};

export const isValidateAplhaNumeric = (text) => {
  // const regex = /^[a-zA-Z]+$/;/^[A-Za-z0-9]+$/
  const regex = /^[A-Za-z0-9]+$/;
  if (regex.test(text)) {
    return true;
  }
  return false;
};
export const navigatetoCallWebView = async () => {
  const requestMicroPhonePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Record Permission",
            message: "App needs record audio permission",
          }
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };
  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camers Permission",
            message: "App needs camera permission",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        return false;
      }
    } else return true;
  };
  //return requestCameraPermission()
  var granted = await requestCameraPermission();
  var granted2 = await requestMicroPhonePermission();
  if (granted && granted2) return true;
  else return false;

  // (granted)
  //  navigation.navigate(AuthNavigator.AuthStackIdentifiers.WebComp)
};

export const callNumber = (phone) => {
  let phoneNumber = phone;
  if (Platform.OS !== "android") {
    phoneNumber = `telprompt:${phone}`;
  } else {
    phoneNumber = `tel:${phone}`;
  }
  Linking.canOpenURL(phoneNumber)
    .then((supported) => {
      if (!supported) {
        // Alert.alert("Phone number is not available");
        showToastRedAlert("Phone number is not available");
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch((err) => {});
};

export const sendWhatsApp = (phone) => {
  let msg = "Say Something";
  let phoneWithCountryCode = "+91" + phone;

  let mobile =
    Platform.OS == "ios" ? phoneWithCountryCode : "+" + phoneWithCountryCode;
  if (mobile) {
    if (msg) {
      let url = "whatsapp://send?text=" + msg + "&phone=" + mobile;
      Linking.openURL(url)
        .then((data) => {})
        .catch(() => {
          // alert('Make sure WhatsApp installed on your device');
          showToastRedAlert("Make sure WhatsApp is installed on your device");
        });
    } else {
      alert("Please insert message to send");
    }
  } else {
    alert("Please insert mobile no");
  }
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

  const date = moment(Number(timeStamp)).format(format);

  return date;
};

export const convertTimeStringToDate = (timeStamp, format) => {
  if (!timeStamp || timeStamp.length === 0) return "";
  format = format ? format : "DD/MM/YYYY";
  const date = moment(timeStamp).format(format);
  return date;
};

export const convertDateStringToMilliseconds = (dateString) => {
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
    case "hex":
      return "#" + ("00000" + rint.toString(16)).slice(-6).toUpperCase();
    case "hexa":
      return "#" + ("0000000" + rint.toString(16)).slice(-8).toUpperCase();
    case "rgb":
      return (
        "rgb(" +
        (rint & 255) +
        "," +
        ((rint >> 8) & 255) +
        "," +
        ((rint >> 16) & 255) +
        ")"
      );
    case "rgba":
      return (
        "rgba(" +
        (rint & 255) +
        "," +
        ((rint >> 8) & 255) +
        "," +
        ((rint >> 16) & 255) +
        "," +
        ((rint >> 24) & 255) / 255 +
        ")"
      );
    default:
      return rint;
  }
};

export const rgbaColor = () => {
  var x = Math.floor(Math.random() * 256);
  var y = Math.floor(Math.random() * 256);
  var z = Math.floor(Math.random() * 256);
  const rgbValue = `rgba(${x}, ${y}, ${z}, 1)`;
  return rgbValue;
};

export const emiCalculator = (principle, tenureInMonths, interestRate) => {
  if (principle !== "" && tenureInMonths !== "" && interestRate !== "") {
    const amount = Number(principle);
    const months = Number(tenureInMonths);
    const interest = Number(interestRate) / 1200;

    const step1 = Math.pow(1 / (1 + interest), months);
    const emi = Math.round(((amount * interest) / (1 - step1)) * 100) / 100;
    const finalEmi = Math.round(emi).toString();
    return finalEmi;
  }
  return "";
};

export const PincodeDetails = async (pincode) => {
  return await new Promise((resolve, reject) => {
    fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      method: "GET",
    })
      .then((json) => json.json())
      .then((res) => {
        if (res != undefined && res.length > 0) {
          if (res[0].PostOffice != null && res[0].PostOffice.length > 0) {
            resolve({ ...res[0].PostOffice[0] });
          } else {
            reject({});
          }
        } else {
          reject({});
        }
      })
      .catch((err) => reject(err));
  });
};

export const PincodeDetailsNew = async (pincode) => {
  return await new Promise((resolve, reject) => {
    fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      method: "GET",
    })
      .then((json) => json.json())
      .then((res) => {
        if (res != undefined && res.length > 0) {
          resolve(res[0].PostOffice);
        } else {
          reject({});
        }
      })
      .catch((err) => reject(err));
  });
};

export const GetCarModelList = async (orgId, token = "") => {
  return await new Promise((resolve, reject) => {
    const url = URL.VEHICLE_MODELS(orgId);
    client
      .get(url)
      // fetch(url, {
      //   method: "GET",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //     "auth-token": token,
      //   },
      // })
      .then((json) => json.json())
      .then((res) => {
        if (res != undefined && res.length > 0) {
          resolve(res);
        } else {
          reject([]);
        }
      })
      .catch((err) => reject([]));
  });
};

export const GetEnquiryCarModelList = async (orgId, token = "") => {
  return await new Promise((resolve, reject) => {
    const url = URL.ENQUIRY_VEHICLE_MODELS(orgId);
    client
      .get(url)
      // fetch(url, {
      //   method: "GET",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //     "auth-token": token,
      //   },
      // })
      .then((json) => json.json())
      .then((res) => {
        if (res != undefined && res.length > 0) {
          resolve(res);
        } else {
          reject([]);
        }
      })
      .catch((err) => reject([]));
  });
};

export const GetFinanceBanksList = async (orgId, token) => {
  return await new Promise((resolve, reject) => {
    const url = URL.GET_BANK_DETAILS(orgId);
    client
      .get(url)
      // fetch(url, {
      //   method: "GET",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //     "auth-token": token,
      //   },
      // })
      .then((json) => json.json())
      .then((res) => {
        if (res != undefined && res.length > 0) {
          resolve(res);
        } else {
          reject([]);
        }
      })
      .catch((err) => reject(err));
  });
};

export const GetPaidAccessoriesList = async (vehicleId, orgId, token) => {
  return await new Promise((resolve, reject) => {
    // const url = URL.GET_PAID_ACCESSORIES_LIST(vehicleId);
    const url = URL.GET_PAID_ACCESSORIES_LIST2(vehicleId, orgId);
    client
      .get(url)
      // fetch(url, {
      //   method: "GET",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //     "auth-token": token,
      //     // orgId: orgId,
      //   },
      // })
      .then((json) => json.json())
      .then((res) => {
        if (res != undefined) {
          if (res != undefined && res.length > 0) {
            resolve(res);
          } else {
            resolve([]);
          }
        } else {
          reject("Get Paid Acceossories List failed");
        }
      })
      .catch((err) => reject(err));
  });
};

export const GetPaidAccessoriesList2 = async (vehicleId, orgId, token) => {
  return await new Promise((resolve, reject) => {
    const url = URL.GET_PAID_ACCESSORIES_LIST(vehicleId);
    client
      .get(url)
      // fetch(url, {
      //   method: "GET",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //     "auth-token": token,
      //     orgId: orgId,
      //   },
      // })
      .then((json) => json.json())
      .then((res) => {
        if (res.success == true) {
          if (res.accessorylist != undefined && res.accessorylist.length > 0) {
            resolve(res.accessorylist);
          } else {
            resolve([]);
          }
        } else {
          reject("Get Paid Acceossories List failed");
        }
      })
      .catch((err) => reject(err));
  });
};

export const GetDropList = async (orgId, token, type) => {
  return await new Promise((resolve, reject) => {
    const url = URL.GET_DROP_LIST(orgId, type);
    client
      .get(url)
      // fetch(url, {
      //   method: "GET",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //     "Authorization": token
      //   },
      // })
      .then((json) => json.json())
      .then((res) => {
        if (res != undefined && res.length > 0) {
          const updatedData = [];
          res.forEach((obj) => {
            const newObj = { ...obj };
            if (newObj.status === "Active") {
              newObj.name = newObj.lostReason;
              newObj.sublostreasons.forEach((subObj) => {
                subObj.name = subObj.subReason;
              });
              updatedData.push(newObj);
            }
          });
          resolve(updatedData);
        } else {
          resolve([]);
        }
      })
      .catch((err) => reject(err));
  });
};

export const achievementPercentage = (
  achievement,
  tgt,
  paramName,
  enq = {},
  ret = {},
  acc = {}
) => {
  const enqCal = ["Enquiry", "PreEnquiry"];
  const retCal = ["Exchange", "Finance", "Insurance", "EXTENDEDWARRANTY"];
  const accCal = ["Accessories"];

  let target = tgt;
  if (achievement) {
    achievement = Number(achievement);
  } else {
    achievement = 0;
  }

  if (paramName && retCal.includes(paramName)) {
    target = ret.achievment;
  } else if (paramName && accCal.includes(paramName)) {
    target = acc.target;
  } else if (paramName && !enqCal.includes(paramName)) {
    target = enq.achievment;
  } else {
    if (target) {
      target = Number(target);
    } else {
      target = 0;
    }
  }

  return target > 0 ? Math.round((achievement / target) * 100) : achievement;
};

export const sourceModelPercentage = (achievement, target) => {
  if (achievement) {
    achievement = Number(achievement);
  } else {
    achievement = 0;
  }

  if (target) {
    target = Number(target);
  } else {
    target = 0;
  }

  return target > 0 ? Math.round((achievement / target) * 100) : achievement;
};

// export const achievementPercentage = (achievement, tgt, paramName, enquiryAchievement) => {
//   const paramsToCalculateDirectTotal = ['Enquiry', 'Accessories', 'PreEnquiry'];
//   let target = tgt;
//   if (paramName && !paramsToCalculateDirectTotal.includes(paramName)) {
//     target = enquiryAchievement;
//   }
//   if (achievement) {
//     achievement = Number(achievement);
//   } else {
//     achievement = 0;
//   }
//   if (target) {
//     target = Number(target);
//   } else {
//     target = 0;
//   }
//   return target > 0 ? Math.round((achievement / target) * 100) : achievement; // if denominator is > 0, display percentage, else no change, display achievement
// }

export const setBranchId = async (value) => {
  let data = value.toString();
  store.dispatch(updateSelectedBranchId(data));
  await AsyncStore.storeData(AsyncStore.Keys.SELECTED_BRANCH_ID, data);
};

export const setBranchName = async (value) => {
  store.dispatch(updateSelectedBranchName(value));
  await AsyncStore.storeData(AsyncStore.Keys.SELECTED_BRANCH_NAME, value);
};

export const detectIsOrientationLock = (navigation) => {
  const state = navigation.dangerouslyGetState();
  let innerState = state?.routes?.length ? state?.routes[0]?.state : {};
  let screen = innerState?.routes[innerState?.index];
  let screenName = screen?.name || 'HOME_SCREEN' ;
  if (screen?.state?.routes?.length) {
    let innerState2 = screen?.state;
    let screen2 = innerState2?.routes[innerState2?.index];
    screenName = screen2?.name;
    if (screen2?.state?.routes?.length) {
      let innerState3 = screen2?.state;
      let screen3 = innerState3?.routes[innerState3?.index];
      screenName = screen3?.name;
    }
  }
  if (
    screenName !== "Home" &&
    screenName !== "HOME_SCREEN" &&
    screenName !== "LIVE_LEADS" &&
    screenName !== "MONTHLY_TARGET_SCREEN" &&
    screenName !== "MONTHLY_TARGET" &&
    screenName !== "EVENT_DASHBOARD" &&
    screenName !== "DIGITAL_DASHBOARD"
  ) {
    return true;
  }
  return false;
};

export const getWidth = (percentage = 0) => {
  if (Dimensions.get('window').width > Dimensions.get('window').height) {
    return (Dimensions.get('window').height * percentage) / 100;
  }
  return (Dimensions.get('window').width * percentage) / 100;
};

export const getHeight = (percentage = 0) => {
  if (Dimensions.get('window').width > Dimensions.get('window').height) {
    return (Dimensions.get('window').width * percentage) / 100;
  }
  return (Dimensions.get('window').height * percentage) / 100;
};