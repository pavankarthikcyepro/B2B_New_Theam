import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { LoaderComponent } from "../../../components";
import { Colors } from "../../../styles";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import { IconButton } from "react-native-paper";
import RNFetchBlob from "rn-fetch-blob";
import _ from "lodash";
import { RadioTextItem2 } from "../../../pureComponents";
import _shareImage, { sharePDF } from "../../../service/Share";
import {
  checkValidUrl,
  shareFileDoc,
  shareFileVideo,
  shareFileXlx,
} from "../../../service/ShareDoc";
import * as AsyncStore from "../../../asyncStore";

const OPTIONS = ["Images", "Brochures", "Video", "Compare Doc"];

const KnowledgeCenterScreen = ({ route, navigation }) => {
  // const navigation = useNavigation();
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [selectedOption, setSelectedOption] = useState("Images");
  const [mainList, setMainList] = useState([]);
  const [carList, setCarList] = useState([]);
  const [errorView, setErrorView] = useState(false);

  useEffect(() => {
    navigation.addListener("focus", () => {
      getData();
    });
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const response = await client.get(URL.KNOWLEGDE_CENTER(jsonObj.orgId));
        const json = await response.json();
        if (json.length > 0) {
          setMainList(json);
          onChangeOption("Images", json);
          setErrorView(false);
        } else {
          setErrorView(true);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setErrorView(true);
    }
  };

  function getSelectedItemsWithImages(data) {
    const selectedItems = [];

    data.forEach((item) => {
      const hasInteriorImage = item.gallery.some(
        (image) => image.type === "interior_image"
      );
      const hasExteriorImage = item.gallery.some(
        (image) => image.type === "exterior_image"
      );

      if (hasInteriorImage || hasExteriorImage) {
        selectedItems.push(item);
      }
    });

    return selectedItems;
  }

  function getSelectedItemsWithVideo(data) {
    const selectedItems = [];

    data.forEach((item) => {
      const hasVideo = item.gallery.some((image) => image.type === "video");
      if (hasVideo) {
        selectedItems.push(item);
      }
    });

    return selectedItems;
  }

  function getSelectedItems(data, type) {
    const selectedItems = [];

    data.forEach((item) => {
      if (item.vehicleEdocuments) {
        const edocuments = item.vehicleEdocuments[0]?.edocument || [];
        const hasEdocument = edocuments.some(
          (edocument) => edocument.document_name === type
        );

        if (hasEdocument) {
          selectedItems.push(item);
        }
      }
    });

    return selectedItems;
  }

  function getInteriorAndExteriorGalleryImages(jsonArray) {
    const filteredArray = jsonArray.gallery.filter(
      (item) => item.type === "interior_image" || item.type === "exterior_image"
    );
    const galleryImagesArray = filteredArray.map((item) => item.path);
    return galleryImagesArray;
  }

  function getVideo(jsonArray) {
    const filteredArray = jsonArray.gallery.filter(
      (item) => item.type === "video"
    );
    const galleryImagesArray = filteredArray.map((item) => item.path);
    return galleryImagesArray;
  }

  function onChangeOption(params, DATA) {
    switch (params) {
      case "Images":
        const data = getSelectedItemsWithImages(DATA);
        setCarList(data);
        break;
      case "Brochures":
        const data2 = getSelectedItems(DATA, "Vehicle_Sepcifications");
        setCarList(data2);
        break;
      case "Video":
        const data3 = getSelectedItemsWithVideo(DATA);
        setCarList(data3);
        break;
      case "Compare Doc":
        const data4 = getSelectedItems(DATA, "Comparison");
        setCarList(data4);
        break;
      default:
        break;
    }
    setSelectedOption(params);
  }

  function getDocument(vehicle, type) {
    const doc = vehicle.vehicleEdocuments[0].edocument.find(
      (image) => image.document_name === type
    )?.url;
    return { doc };
  }

  function onDownload(params) {
    switch (selectedOption) {
      case "Images":
        const galleryImages = getInteriorAndExteriorGalleryImages(params);
        navigationToList(galleryImages);
        break;
      case "Brochures":
        const data2 = getDocument(params, "Vehicle_Sepcifications");
        checkPlatform(data2.doc);
        break;
      case "Video":
        const data3 = getVideo(params);
        navigationToList(data3, true);
        break;
      case "Compare Doc":
        const data4 = getDocument(params, "Comparison");
        checkPlatform(data4.doc);
        break;
      default:
        break;
    }
  }

  function onShare(params) {
    switch (selectedOption) {
      case "Images":
        const galleryImages = getInteriorAndExteriorGalleryImages(params);
        _shareImage(galleryImages);
        break;
      case "Brochures":
        const data2 = getDocument(params, "Vehicle_Sepcifications");
        if (checkValidUrl(data2.doc)) {
          _shareImage([data2.doc]);
        } else {
          if (Platform.OS === "ios") {
            sharePDF(data2.doc);
          } else {
            shareFileDoc(data2.doc);
          }
        }
        break;
      case "Video":
        const data3 = getVideo(params);
        shareFileVideo(data3[0]);
        break;
      case "Compare Doc":
        const data4 = getDocument(params, "Comparison");
        if (Platform.OS === "ios") {
          downloadInLocal(data4.doc);
        } else {
          shareFileDoc(data4.doc);
        }
        break;
      default:
        break;
    }
  }

  function navigationToList(params, video = false) {
    if (Platform.OS === "ios") {
      if (video) {
        downloadInLocal(params[0]);
      } else {
        navigation.navigate("LIST", {
          list: params,
          video: video,
        });
      }
    } else {
      if (video) {
        setLoading(true);
        downloadInLocal(params[0]);
        setLoading(false);
      } else {
        multipleDownload(params);
      }
    }
  }

  function checkPlatform(params) {
    if (Platform.OS === "ios") {
      downloadInLocal(params);
    } else {
      multipleDownload([params]);
    }
  }

  function multipleDownload(params) {
    setLoading(true);
    for (let i = 0; i < params.length; i++) {
      const element = params[i];
      downloadInLocal(element);
    }
    setLoading(false);
  }

  const getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const downloadInLocal = async (url) => {
    // setLoading(true);
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
            "/file" +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            file_ext, // this is the path where your downloaded file will live in
          description: "Downloading image.",
        },
      };
      config(options)
        .fetch("GET", url)
        .then((res) => {
          // setLoading(false);
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
          "/File" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        mime: "application/xlsx",
        // appendExt: 'xlsx',
        //path: filePath,
        //appendExt: fileExt,
        notification: true,
      };
      config(options)
        .fetch("GET", url)
        .then((res) => {
          // setLoading(false);
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

  const downloadFiles = async (urls) => {
    // Loop through the URLs and download each file
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      // Get the file name from the URL
      const fileName = url.substring(url.lastIndexOf("/") + 1);
      // Set the download path for the file
      const downloadPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;
      try {
        // Download the file using RNFetchBlob
        await RNFetchBlob.config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            title: fileName,
            description: "Downloading file...",
          },
        })
          .fetch("GET", url, {})
          .catch((e) => {
            console.log(e);
          });
        console.log(`File ${fileName} downloaded successfully`);
      } catch (error) {
        console.log(`Error downloading file ${fileName}: ${error}`);
      }
    }
  };

  const ListItem = ({ item, index }) => {
    const [isImageAvailable, setIsImageAvailable] = useState(true);

    let isGalleryAvailable = false;
    switch (selectedOption) {
      case "Images":
        const galleryImages = getInteriorAndExteriorGalleryImages(item);
        if (galleryImages.length > 0) {
          isGalleryAvailable = true;
        }
        break;
      case "Brochures":
        const data2 = getDocument(item, "Vehicle_Sepcifications");
        if (Object.keys(data2).length > 0) {
          isGalleryAvailable = true;
        }
        break;
      case "Video":
        const data3 = getVideo(item);
        if (data3.length > 0) {
          isGalleryAvailable = true;
        }
        break;
      case "Compare Doc":
        const data4 = getDocument(item, "Comparison");
        if (Object.keys(data4).length > 0) {
          isGalleryAvailable = true;
        }
        break;
      default:
        isGalleryAvailable = false;
        break;
    }

    return (
      <View style={styles.ElementView}>
        <View style={{ flex: 1 }}>
          {item.imageUrl && isImageAvailable ? (
            <Image
              source={{ uri: item.imageUrl }}
              resizeMode="contain"
              style={{ width: 100, height: 80 }}
              onError={(err) => setIsImageAvailable(false)}
            />
          ) : (
            <Image
              source={require("../../../assets/images/loginCar.jpg")}
              resizeMode="contain"
              style={{ width: 100, height: 80 }}
            />
          )}
        </View>
        <View
          style={{
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text>{item.model}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              onDownload(item);
            }}
            disabled={!isGalleryAvailable}
            style={{ marginHorizontal: 10 }}
            >
            <IconButton
              icon={"download"}
              size={24}
              color={Colors.RED}
              style={{ margin: 0, padding: 0 }}
              disabled={!isGalleryAvailable}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onShare(item);
            }}
            disabled={!isGalleryAvailable}
          >
            <IconButton
              icon={"share"}
              size={24}
              color={Colors.RED}
              style={{ margin: 0, padding: 0 }}
              disabled={!isGalleryAvailable}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topOptionsRow}>
        {OPTIONS.map((item) => (
          <RadioTextItem2
            label={item}
            value={item}
            disabled={false}
            status={selectedOption === item ? true : false}
            onPress={() => {
              onChangeOption(item, mainList);
            }}
          />
        ))}
      </View>
      {!errorView && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {carList.map((item, index) => (
            <ListItem item={item} index={index} />
          ))}
        </ScrollView>
      )}
      {errorView && (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={styles.txt}>{"No Data Found"}</Text>
        </View>
      )}
      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default KnowledgeCenterScreen;

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
  txt: {
    color: Colors.RED,
    fontSize: 22,
    fontWeight: "600",
  },
  topOptionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 5,
    marginHorizontal: 5,
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: Colors.WHITE,
  },
});
