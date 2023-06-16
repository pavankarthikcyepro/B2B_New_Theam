import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Share from "react-native-share";

import { LoaderComponent } from "../../../components";
import { Colors } from "../../../styles";
import { IconButton } from "react-native-paper";
import RNFetchBlob from "rn-fetch-blob";
import _ from "lodash";

const ListScreen = ({ route, navigation }) => {
  // const navigation = useNavigation();
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [video, setVideo] = useState(false);
  const [carList, setCarList] = useState([]);

  useEffect(() => {
    if (route.params) {
      setCarList(route.params.list);
      setVideo(route.params.video);
    }
  }, [route.params]);

  const getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const shareFiles = async (files) => {
    try {
      const options = {
        title: "Share Files",
        urls: files,
        type: "*/*",
      };
      await Share.open(options);
    } catch (error) {
      console.log("Error sharing files: ", error);
    }
  };

  const downloadInLocal = async (url) => {
    const { config, fs } = RNFetchBlob;
    let downloadDir = Platform.select({
      ios: fs.dirs.DocumentDir,
      android: fs.dirs.DownloadDir,
    });
    let date = new Date();
    let file_ext = getFileExtention(url);
    file_ext = "." + file_ext[0];
    let options = {};
    if (Platform.OS === "android") {
      options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
          notification: true,
          path:
            downloadDir +
            "file" +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            file_ext, // this is the path where your downloaded file will live in
          description: "Downloading image.",
        },
      };
      config(options)
        .fetch("GET", url, {})
        .then((res) => {
          setLoading(false);
          RNFetchBlob.android.actionViewIntent(res.path());
          // do some magic here
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
    if (Platform.OS === "ios") {
      options = {
        fileCache: true,
        path:
          downloadDir +
          "File" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        // mime: "application/xlsx",
        // appendExt: 'xlsx',
        //path: filePath,
        //appendExt: fileExt,
        notification: true,
      };
      config(options)
        .fetch("GET", url, {})
        .then((res) => {
          setLoading(false);
          setTimeout(() => {
            // RNFetchBlob.ios.previewDocument('file://' + res.path());   //<---Property to display iOS option to save file
            RNFetchBlob.ios.openDocument(res.data); //<---Property to display downloaded file on documaent viewer
            // Alert.alert(CONSTANTS.APP_NAME,'File download successfully');
          }, 300);
        })
        .catch((errorMessage) => {
          setLoading(false);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {carList &&
          carList.map((item) => {
            return (
              <View style={styles.ElementView}>
                <View style={{ flex: 1 }}>
                  {video ? (
                    <Image
                      source={require("../../../assets/images/loginCar.jpg")}
                      resizeMode="contain"
                      style={{ width: 100, height: 80 }}
                    />
                  ) : (
                    <Image
                      source={{ uri: item }}
                      resizeMode="contain"
                      style={{ width: 100, height: 80 }}
                    />
                  )}
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => {
                      downloadInLocal(item);
                    }}
                    style={{ marginHorizontal: 10 }}
                  >
                    <IconButton
                      icon={"download"}
                      size={24}
                      color={Colors.RED}
                      style={{ margin: 0, padding: 0 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => shareFiles([item])}>
                    <IconButton
                      icon={"share"}
                      size={24}
                      color={Colors.RED}
                      style={{ margin: 0, padding: 0 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
      </ScrollView>
      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  ElementView: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#FFF",
    padding: 10,
    justifyContent: "space-between",
  },
});
