import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
} from "sp-react-native-in-app-updates";
const VersionName = "CPR30-17022023";
const VersionCode = "30"; 
const VersionString = VersionName + "(" + VersionCode + ")";

export const checkAppUpdate = async () => {
  try {
    // curVersion is optional if you don't provide it will automatically take from the app using rn-device-info
    const inAppUpdates = new SpInAppUpdates(
      false // isDebug
    );
    console.log("LLLL", VersionString);
    await inAppUpdates
      .checkNeedsUpdate({ curVersion: VersionString })
      .then((result) => {
        console.log("result", result);
        try {
          if (result.shouldUpdate) {
            //add update options
            let updateOptions: StartUpdateOptions = {};
            if (Platform.OS === "android") {
              updateOptions = {
                updateType: IAUUpdateKind.IMMEDIATE,
              };
            } else if (Platform.OS === "ios") {
              var title = "New Version is Available";
              updateOptions = {
                forceUpgrade: true,
                title: title,
                message: "Please Update to Latest Version",
                buttonUpgradeText: "Update",
              };
            }
            inAppUpdates.startUpdate(updateOptions);
          } else {
          }
        } catch (e) {}
      })
      .catch((error) => {
        console.log("KOOOOOO", error);
      });
  } catch (e) {}
};
