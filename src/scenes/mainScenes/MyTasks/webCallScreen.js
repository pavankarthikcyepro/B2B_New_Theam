import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { clearState, getWebCallUri } from '../../../redux/webCallReducer';
import { Colors } from '../../../styles';

const WebCallScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  let webViewRef = useRef(null);
  const selector = useSelector((state) => state.webCallReducer);

  const [callUri, setCallUri] = useState("");

  useEffect(() => {
    const { phone, uniqueId } = route.params;
    let payload = { recordId: uniqueId, mobileNo: phone };
    dispatch(getWebCallUri(payload));
    return () => {
      dispatch(clearState());
    }
  }, []);
  
  useEffect(() => {
    if (selector.webCallUriResponse == "success") {
      setCallUri(selector.webCallUri);
    }
  }, [selector.webCallUriResponse]);

  const onMessage = (m) => {
    const messageData = JSON.parse(m);
    console.log(messageData);
    console.log(messageData.msg);
    if (messageData.close) {
      navigation.goBack();
    }
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
