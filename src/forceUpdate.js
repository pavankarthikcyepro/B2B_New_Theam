import React, { useState, useEffect, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
} from "sp-react-native-in-app-updates";
import BackgroundService from "react-native-background-actions";
import { clearState, SetNewUpdateAvailable } from "./redux/homeReducer";
import * as AsyncStore from "./asyncStore";
import { myTaskClearState } from "./redux/mytaskReducer";
import { notificationClearState } from "./redux/notificationReducer";
import { clearEnqState } from "./redux/enquiryReducer";
import { clearLeadDropState } from "./redux/leaddropReducer";
import {
  saveFilterPayload,
  updateDealerFilterData,
  updateFilterSelectedData,
} from "./redux/targetSettingsReducer";

export const VersionName = "CPR30-17022023";
export const VersionCode = "30";
export const VersionString = VersionName + "(" + VersionCode + ")";

// const { signOut } = React.useContext(AuthContext);

// const signOutClicked = async () => {
//   AsyncStore.storeData(AsyncStore.Keys.USER_NAME, "");
//   AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, "");
//   AsyncStore.storeData(AsyncStore.Keys.EMP_ID, "");
//   AsyncStore.storeData(AsyncStore.Keys.LOGIN_EMPLOYEE, "");
//   AsyncStore.storeData(AsyncStore.Keys.EXTENSION_ID, "");
//   AsyncStore.storeData(AsyncStore.Keys.EXTENSSION_PWD, "");
//   AsyncStore.storeData(AsyncStore.Keys.IS_LOGIN, "false");
//   AsyncStore.storeJsonData(AsyncStore.Keys.TODAYSDATE, new Date().getDate());
//   AsyncStore.storeJsonData(AsyncStore.Keys.COORDINATES, []);
//   await BackgroundService.stop();
//   //realm.close();
//   dispatch(clearState());
//   dispatch(clearState());
//   dispatch(myTaskClearState());
//   dispatch(notificationClearState());
//   dispatch(clearEnqState());
//   dispatch(clearLeadDropState());
//   dispatch(saveFilterPayload({}));
//   dispatch(updateFilterSelectedData({}));
//   dispatch(updateDealerFilterData({}));
//   signOut();
// };

// export const checkAppUpdate = async () => {
//   const dispatch = useDispatch();

//   try {
//     // curVersion is optional if you don't provide it will automatically take from the app using rn-device-info
//     const inAppUpdates = new SpInAppUpdates(
//       false // isDebug
//     );
//     console.log("LLLL", VersionString);
//     await inAppUpdates
//       .checkNeedsUpdate({ curVersion: VersionString })
//       .then(async (result) => {
//         console.log("result", result);
//         try {
//           if (result.shouldUpdate) {
//             //add update options
//             let updateOptions: StartUpdateOptions = {};
//             if (Platform.OS === "android") {
//               updateOptions = {
//                 updateType: IAUUpdateKind.IMMEDIATE,
//               };
//             } else if (Platform.OS === "ios") {
//               var title = "New Version is Available";
//               updateOptions = {
//                 forceUpgrade: true,
//                 title: title,
//                 message: "Please Update to Latest Version",
//                 buttonUpgradeText: "Update",
//               };
//             }
//             const employeeData = await AsyncStore.getData(
//               AsyncStore.Keys.LOGIN_EMPLOYEE
//             );
//             if (employeeData) {
//               dispatch(SetNewUpdateAvailable(true));
//               signOutClicked();
//             } else {
//               dispatch(SetNewUpdateAvailable(true));
//             }
//             inAppUpdates.startUpdate(updateOptions);
//           } else {
//             dispatch(SetNewUpdateAvailable(false));
//           }
//         } catch (e) {}
//       })
//       .catch((error) => {
//         console.log("KOOOOOO", error);
//       });
//   } catch (e) {}
// };
