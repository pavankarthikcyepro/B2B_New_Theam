import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import WebView from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { clearState, getWebCallUri } from '../../../redux/webCallReducer';
import { Colors } from '../../../styles';
import CallDetectorManager from "react-native-call-detection";

let callDetector = "";

const WebCallScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  let webViewRef = useRef(null);
  const selector = useSelector((state) => state.webCallReducer);

  const [callUri, setCallUri] = useState("");

  useEffect(() => {
    const { phone, uniqueId } = route.params;
    let payload = { recordId: uniqueId, mobileNo: phone };
    if (Platform.OS == "android") {
      askPermission();
    } else {
      startListenerTapped();
    }
    dispatch(getWebCallUri(payload));
    return () => {
      dispatch(clearState());
      stopListenerTapped();
    };
  }, []);

  const askPermission = async () => {
    try {
      const permissions = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
      );
      if (permissions == "granted") {
        startListenerTapped();
      }
    } catch (err) {
    }
  };

  useEffect(() => {
    if (selector.webCallUriResponse == "success") {
      setCallUri(selector.webCallUri);
    }
  }, [selector.webCallUriResponse]);

  const startListenerTapped = () => {
    callDetector = new CallDetectorManager(
      (event, phoneNumber) => {
        if (event === "Disconnected") {
        } else if (event === "Connected") {
          sendDataToWebView();
        } else if (event === "Missed") {
        }
      },
      false,
      () => {},
      {
        title: "Phone State Permission",
        message:
          "This app needs access to your phone state in order to react and/or to adapt to incoming calls.",
      }
    );
  };

  const stopListenerTapped = () => {
    callDetector && callDetector.dispose();
  };

  const onMessage = (m) => {
    const messageData = JSON.parse(m);
    if (messageData.close) {
      navigation.goBack();
    }
  };

  const sendDataToWebView = () => {
    webViewRef.current.postMessage("ENDCALL");
  };

  return (
    <View style={styles.container}>
      {callUri ? (
        <WebView
          ref={webViewRef}
          source={{
            uri: `https://call-recording-kpcgomzs6q-uc.a.run.app/calrecord.html?token=${callUri}`,
          }}
          onMessage={(m) => onMessage(m.nativeEvent.data)}
          cacheEnabled={false}
          originWhitelist={["*"]}
          javaScriptEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <ActivityIndicator
              animating={true}
              color={Colors.PINK}
              style={styles.indicatorStyle}
            />
          )}
        />
      ) : null}
    </View>
  );
};

export default WebCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicatorStyle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
