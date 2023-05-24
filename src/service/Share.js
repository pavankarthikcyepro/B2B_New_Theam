import RNFetchBlob from "rn-fetch-blob";
import Share from "react-native-share";
import {
  Alert,
  Platform,
} from "react-native";

const _shareImage = async (pics) => {
  try {
    let Pictures = pics.map((item) =>
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch("GET", item)
        .then((resp) => {
          let base64s = RNFetchBlob.fs
            .readFile(resp.data, "base64")
            .then((data) => "data:image/jpeg;base64," + data);
          return base64s;
        })
    );
    Promise.all(Pictures).then((completed) => {
      const options = {
        title: "Share via",
        urls: completed,
      };
      Share.open(options);
    });
  } catch (err) {
    Alert.alert("Error, Permission denied", err);
  }
};
export default _shareImage;

export const saveTempPDF = async (pdfUrl) => {
  const { dirs } = RNFetchBlob.fs;
  console.log(dirs.DocumentDir);
  const response = await RNFetchBlob.config({
    path: `${dirs.DocumentDir}/brochures.pdf`,
  }).fetch("GET", pdfUrl);
  const localFilePath = response.path();
  console.log("Local file path:", localFilePath);
  return localFilePath;
};

export const sharePDF = async (url) => {
  const uri = await saveTempPDF(url);
  const shareOptions = {
    title: "Share PDF",
    url: uri,
    failOnCancel: false,
    activityItemSources: Platform.OS === "ios" && [
      {
        item: {
          defaultContentType: "public.jpeg",
          filename: "sample.pdf",
          type: "com.adobe.pdf",
          url: uri,
        },
        thumbnailImage: "file:///some/image.png",
        subject: "Sample PDF",
      },
    ],
  };

  Share.open(shareOptions)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};
