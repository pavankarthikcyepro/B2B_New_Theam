import * as AsyncStore from "../asyncStore";
import { EventRegister } from "react-native-event-listeners";
import URL from "./endpoints";
import { Alert } from "react-native";
import RNRestart from "react-native-restart";
let isdiloadopen = false;
let isNetworkDialogopen = false;
import NetInfo from "@react-native-community/netinfo";
import Snackbar from "react-native-snackbar";
import { Colors } from "../styles";
import { showToast } from "../utils/toast";
import { callLog } from "../CrashListener";

export const client = async (
  authToken,
  url,
  methodType,
  body,
  customConfig,
  isValidate
) => {
  NetInfo.fetch().then((netState) => {
    // console.log("Is connected?", netState.isConnected);
    if (netState.isConnected !== true) {
      if (!isNetworkDialogopen) {
        isNetworkDialogopen = true;
        return Alert.alert("Network Error", "Please try again later", [
          {
            text: "OK",
            onPress: () => {
              isNetworkDialogopen = false;
            },
          },
        ]);
      }
    } else {
      // console.log("Connection type", netState.details);
      if (netState.type == "cellular") {
        // console.log("Connection type 22", netState.details.cellularGeneration);
        if (netState.details.cellularGeneration === "2g") {
          EventRegister.emit("poorNetwork", true);
          //   return  Snackbar.show({
          //         text: "Poor network Please check your internet connection",
          //         textColor: Colors.WHITE,
          //         backgroundColor: Colors.GRAY,
          //         duration: Snackbar.LENGTH_LONG,

          //     });
        }
      }
    }
  });

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // if (authToken) {
  //     headers['auth-token'] = authToken;
  // }
  if (authToken) {
    headers["Authorization"] = "Bearer " + authToken;
  }

  const config = {
    method: methodType,
    headers: {
      ...headers,
      ...customConfig,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await window.fetch(url, config);

    if (response.status >= 400) {
      callLog(response);
    }
    if (response.status == 401 && isValidate === true) {
      let Refresh_token = await AsyncStore.getData(
        AsyncStore.Keys.REFRESH_TOKEN
      );

      // call refresh Token API
      let refreshApiUrl = URL.REFRESHTOKEN();

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const config = {
        method: "POST",
        headers: {
          ...headers,
        },
      };
      if (Refresh_token) {
        let payload = {
          refreshToken: Refresh_token,
        };
        config.body = JSON.stringify(payload);
      }

      // APi call for refresh token
      const responseForRefreshApi = await window.fetch(refreshApiUrl, config);

      let tempRes = await responseForRefreshApi.clone().json();
      if (responseForRefreshApi.status == 200) {
        await AsyncStore.storeData(
          AsyncStore.Keys.ACCESS_TOKEN,
          tempRes.accessToken
        ).then(() => {});
        await AsyncStore.storeData(
          AsyncStore.Keys.REFRESH_TOKEN,
          tempRes.refreshToken
        ).then(() => {});
        await AsyncStore.storeData(
          AsyncStore.Keys.USER_TOKEN,
          tempRes.accessToken
        ).then(() => {});
      }
      if (
        responseForRefreshApi.status == 401 ||
        responseForRefreshApi.status == 403
      ) {
        // handle  force logout in cash of refresh token expired
        EventRegister.emit("ForceLogout", true);
        return;
      }

      if (!isdiloadopen) {
        isdiloadopen = true;
        return Toast();
        // return Alert.alert(
        //     "Authentication failed",
        //     "need to re-start app",
        //     [
        //         { text: "OK", onPress: () => {
        //             isdiloadopen = false;
        //             // BackHandler.exitApp();
        //             RNRestart.Restart();
        //         } }
        //     ]
        // );
      }
    }
    // for login api fals credentials
    if (response.status == 401 && !isValidate) {
      let errdata = await response.clone().json();
      return Alert.alert(errdata.error, errdata.message, [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }

    return response;
  } catch (err) {
    console.error("err: ", err, url);
    return Promise.reject(err.message ? err.message : "something wrong");
  }
};

const Toast = () => {
  showToast("Your session is Expired");
  RNRestart.Restart();
};

client.get = async function (endpoint, customConfig = {}, isValidate = true) {
  let token = await AsyncStore.getData(AsyncStore.Keys.ACCESS_TOKEN);
  return client(token, endpoint, "GET", null, customConfig, isValidate);
};

client.post = async function (
  endpoint,
  body,
  customConfig = {},
  isValidate = true
) {
  let token = await AsyncStore.getData(AsyncStore.Keys.ACCESS_TOKEN);
  return client(token, endpoint, "POST", body, customConfig, isValidate);
};

client.put = async function (
  endpoint,
  body,
  customConfig = {},
  isValidate = true
) {
  let token = await AsyncStore.getData(AsyncStore.Keys.ACCESS_TOKEN);
  return client(token, endpoint, "PUT", body, customConfig, isValidate);
};

export const parseAPIResponse = (response) => {
  return new Promise((resolve) => resolve(response.text()))
    .catch((err) =>
      // eslint-disable-next-line prefer-promise-reject-errors
      Promise.reject({
        type: "NetworkError",
        status: response.status,
        message: err,
      })
    )
    .then((responseBody) => {
      // Attempt to parse JSON
      try {
        const parsedJSON = JSON.parse(responseBody);
        if (response.ok) return parsedJSON;
        if (response.status >= 500) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject({
            type: "ServerError",
            status: response.status,
            body: parsedJSON,
          });
        }
        if (response.status <= 501) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject({
            type: "ApplicationError",
            status: response.status,
            body: parsedJSON,
          });
        }
      } catch (e) {
        // We should never get these unless response is mangled
        // Or API is not properly implemented
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({
          type: "InvalidJSON",
          status: response.status,
          body: responseBody,
        });
      }
    });
};
