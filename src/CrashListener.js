import { NativeModules, Platform } from "react-native";
import crashlytics from "@react-native-firebase/crashlytics";

function getStackTrace(error) {
  let stackTrace = "";
  if (error.stack) {
    stackTrace = error.stack;
  } else if (Platform.OS === "android") {
    stackTrace = NativeModules.ExceptionsManagerModule.getStackTrace(error);
  }
  return stackTrace;
}

function logError(error, message) {
  const stackTrace = getStackTrace(error); // Get the stack trace
  const crashlyticsError = new Error(message);
  crashlyticsError.name = error.name;
  crashlyticsError.stack = error.stack;
  const metadata = { fileName: error.fileName, reason: error.message };
  crashlytics().recordError(crashlyticsError, stackTrace, metadata); // Report the error to Firebase Crashlytics
}

function registerCrashListener() {
  if (!__DEV__) {
    const errorHandler = (error, isFatal) => {
      if (isFatal) {
        logError(error, "Fatal Error Occured");
      } else {
        logError(error, "Non-Fatal Error Occured");
      }
    };
    ErrorUtils.setGlobalHandler(errorHandler);
  }
}

const callLog = (response) => {
  crashlytics().log(
    "URL: - " +
      response.url +
      "\nStatus Code:- " +
      response.status.toString() +
      "\nStatus Text: - " +
      response.statusText
  );
};
export { registerCrashListener, callLog };
