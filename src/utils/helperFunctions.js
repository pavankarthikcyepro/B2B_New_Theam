import qs from "qs";
import { Linking, Alert, Platform } from "react-native";
import moment from "moment";
import URL from "../networking/endpoints";

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

export const isValidateAplhaNumeric = (text) => {
  // const regex = /^[a-zA-Z]+$/;/^[A-Za-z0-9]+$/
  const regex = /^[A-Za-z0-9]+$/;
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

sendWhatsApp = (phone) => {
  let msg = 'Say Something';
  let phoneWithCountryCode = '+91'+phone;

  let mobile = Platform.OS == 'ios' ? phoneWithCountryCode : '+' + phoneWithCountryCode;
  if (mobile) {
    if (msg) {
      let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;
      Linking.openURL(url).then((data) => {
        console.log('WhatsApp Opened');
      }).catch(() => {
        alert('Make sure WhatsApp installed on your device');
      });
    } else {
      alert('Please insert message to send');
    }
  } else {
    alert('Please insert mobile no');
  }
}

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
    console.log("finalEmi: ", finalEmi);
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
        // console.log("PINCODE:", JSON.stringify(res));
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

export const GetCarModelList = async (orgId, token = "") => {
  return await new Promise((resolve, reject) => {
    const url = URL.VEHICLE_MODELS(orgId);
    // console.log("url: ", url);
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": token,
      },
    })
      .then((json) => json.json())
      .then((res) => {
        // console.log("res: ", JSON.stringify(res))
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
    console.log("url: ", url);
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": token,
      },
    })
      .then((json) => json.json())
      .then((res) => {
        // console.log("res: ", JSON.stringify(res))
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
    const url = URL.GET_PAID_ACCESSORIES_LIST(vehicleId);
    //console.log("url: ", url);
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": token,
        orgId: orgId,
      },
    })
      .then((json) => json.json())
      .then((res) => {
        //console.log("res: ", JSON.stringify(res))
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

export const GetDropList = async ( orgId, token, type) => {
  return await new Promise((resolve, reject) => {
    const url = URL.GET_DROP_LIST(orgId, type);
    //console.log("url: ", url);
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": token
      },
    })
      .then((json) => json.json())
      .then((res) => {
        //console.log("res: ", JSON.stringify(res))
        if (res != undefined && res.length > 0) {
          const updatedData = [];
          res.forEach(obj => {
            const newObj = {...obj};
            if (newObj.status === "Active") {
              newObj.name = newObj.lostReason;
              updatedData.push(newObj)
            } 
          })
          resolve(updatedData);
        } else {
          resolve([]);
        }
      })
      .catch((err) => reject(err));
  });
};
