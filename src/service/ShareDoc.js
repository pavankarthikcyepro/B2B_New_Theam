import RNFS from "react-native-fs";
import Share from "react-native-share";
import RNFetchBlob from "rn-fetch-blob";

export const shareFileDoc = async (url) => {
  try {
    RNFetchBlob.fetch("GET", url)
      .then((response) => {
        const base64Data = response.base64();
        const base64String = `data:application/pdf;base64,${base64Data}`;
        const options = {
          title: "Share via",
          url: base64String,
        };
        Share.open(options);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
  }
};

export const shareFileXlx = async (url) => {
  try {
    RNFetchBlob.fetch("GET", url)
      .then((response) => {
        const base64Data = response.base64();
        const base64String = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Data}`;
        const options = {
          title: "Share via",
          url: base64String,
        };
        Share.open(options);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
  }
};

export const shareFileVideo = async (url) => {
  try {
    RNFetchBlob.fetch("GET", url)
      .then((response) => {
        const base64Data = response.base64();
        const fileExtension = response.respInfo.redirects[0].split(".").pop();
        const base64String = `data:video/${fileExtension};base64,${base64Data}`;
        const options = {
          title: "Share via",
          url: base64String,
        };
        Share.open(options);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
  }
};

export const checkValidUrl = (url) => {
  var types = ["jpg", "jpeg", "tiff", "png", "gif", "bmp"];
  var parts = url.split(".");
  var extension = parts[parts.length - 1];
  if (types.indexOf(extension) !== -1) {
    return true;
  }
};