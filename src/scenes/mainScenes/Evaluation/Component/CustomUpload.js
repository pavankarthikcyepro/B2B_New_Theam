import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Colors } from "../../../../styles";
import { IconButton } from "react-native-paper";

const CustomUpload = (props) => {
  const {
    label,
    buttonText,
    onPress,
    mandatory = false,
    value,
    onShowImage,
    onDeleteImage,
  } = props;

  const DisplaySelectedImage = ({ fileName, from }) => {
    return (
      <View style={styles.selectedImageBckVw}>
        <Text style={styles.selectedImageTextStyle} numberOfLines={1}>
          {fileName}
        </Text>
        <IconButton
          icon="close-circle-outline"
          color={Colors.RED}
          style={{ padding: 0, margin: 0 }}
          size={15}
          onPress={onDeleteImage}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        <Text style={styles.mandatory}>{mandatory ? " *" : ""}</Text>
      </Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
        <AntDesign size={17} name="upload" color={Colors.RED} />
      </TouchableOpacity>
      <View style={{ flexDirection: "row", marginTop: 5 }}>
        <TouchableOpacity style={styles.preViewBtn} onPress={onShowImage}>
          <Text style={styles.previewTxt}>Preview</Text>
        </TouchableOpacity>
        <View style={{ width: "80%" }}>
          <DisplaySelectedImage fileName={label} from={"PAN"} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 7,
  },
  label: {
    color: "#5A5A5A",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 5,
    marginBottom: 3,
  },
  button: {
    backgroundColor: "#D3D3D3",
    width: "100%",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  buttonText: {
    color: "#000",
    fontWeight: "500",
    fontSize: 14,
  },
  placeHolderButtonText: {
    color: "#D3D3D3",
    fontWeight: "500",
    fontSize: 14,
  },
  mandatory: {
    color: Colors.RED,
  },
  selectedImageBckVw: {
    paddingLeft: 12,
    paddingRight: 10,
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
  },
  selectedImageTextStyle: {
    fontSize: 12,
    fontWeight: "400",
    width: "80%",
    color: Colors.DARK_GRAY,
  },
  preViewBtn: {
    width: "20%",
    height: 30,
    backgroundColor: Colors.SKY_BLUE,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  previewTxt: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default CustomUpload;
