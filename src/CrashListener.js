import { NativeModules, Platform } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';

function getStackTrace(error) {
  let stackTrace = '';
  if (error.stack) {
    stackTrace = error.stack;
  } else if (Platform.OS === 'android') {
    // Get the stack trace from the Android native module
    stackTrace = NativeModules.ExceptionsManagerModule.getStackTrace(error);
  }
  return stackTrace;
}

function logError(error, message) {
  console.log(message); // Log the error message to the console
  const stackTrace = getStackTrace(error); // Get the stack trace

  const crashlyticsError = new Error(message);
  crashlyticsError.name = error.name;
  crashlyticsError.stack = error.stack;
console.log("crashlyticsError", crashlyticsError);
  const metadata = { fileName: error.fileName, reason: error.message };
  crashlytics().recordError(crashlyticsError, stackTrace, metadata); // Report the error to Firebase Crashlytics
}

function registerCrashListener() {
  // Register a global error handler
  if (__DEV__) {
    // Only register the error handler in production
    const errorHandler = (error, isFatal) => {
        console.log(isFatal, __DEV__);
      if (isFatal) {
        logError(error, 'Fatal Error Occured');
      } else {
        logError(error, 'Non-Fatal Error Occured');
      }
    };
    ErrorUtils.setGlobalHandler(errorHandler);
  }
}

export { registerCrashListener };
