import React, { useState, useLayoutEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
  Index,
  Button,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { Dimensions } from "react-native";
import CheckBox from "@react-native-community/checkbox";
const windowWidth = Dimensions.get("window").width;

const datalist = [
  {
    id: 1,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    Date: "19 May 2020",
    vechicle: "Aura",
    type: "HOT",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
  {
    id: 2,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    Date: "19 May 2020",
    vechicle: "Creta",
    type: "WARM",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
  {
    id: 3,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    Date: "19 May 2020",
    vechicle: "Elentra",
    type: "COLD",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
  {
    id: 4,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    Date: "19 May 2020",
    vechicle: "Elite i20",
    type: "HOT",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
  {
    id: 5,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    Date: "19 May 2020",
    vechicle: "Grandi1NIOS",
    type: "HOT",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
  {
    id: 6,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    Date: "19 May 2020",
    vechicle: "Grand i10",
    type: "WARM",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
  {
    id: 7,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    Date: "19 May 2020",
    vechicle: "Santro",
    type: "COLD",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
  {
    id: 8,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    Date: "19 May 2020",
    vechicle: "KonaElectric",
    type: "HOT",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
  {
    id: 9,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    Date: "19 May 2020",
    vechicle: "Tucson",
    type: "COLD",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
  {
    id: 10,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    Date: "19 May 2020",
    vechicle: "Venue",
    type: "HOT",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
  {
    id: 11,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    Date: "19 May 2020",
    vechicle: "Verna",
    type: "COLD",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
];
const PreEnquiry = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const CallPopup = () => {
    // navigation.navigate("POPUP");
    setModalVisible(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Popup has bees closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View
            style={{
              width: 370,
              height: 300,
              backgroundColor: "#ffffff",
              paddingBottom: 10,
              borderColor: "black",
              borderRadius: 10,
            }}
          >
            <Text style={styles.modalText}>
              Choose your preferred connection
            </Text>
            <View style={{ padding: 10 }}></View>
            <View style={{ paddingLeft: 30 }}>
              <Image
                style={styles.ImageStyleS}
                source={{
                  uri: "https://image.flaticon.com/icons/png/512/4405/4405744.png",
                }}
              />
              <Text
                style={{
                  color: "black",
                  fontSize: 20,
                  marginLeft: 50,
                }}
              >
                SIM 1
              </Text>
              <Text
                style={{
                  color: "grey",
                  fontSize: 14,
                  marginLeft: 50,
                }}
              >
                +91 9258765222
              </Text>
              <View style={{ padding: 10 }}></View>
              <Image
                style={styles.ImageStyles}
                source={{
                  uri: "https://image.flaticon.com/icons/png/512/716/716424.png",
                }}
              />
              <Text
                style={{
                  color: "black",
                  fontSize: 20,
                  marginLeft: 50,
                }}
              >
                SIM 2
              </Text>
              <Text
                style={{
                  color: "grey",
                  fontSize: 14,
                  marginLeft: 50,
                }}
              >
                +91 9258765222
              </Text>
            </View>
            <View style={{ padding: 10 }}></View>
            <CheckBox
              style={{
                marginRight: 90,
                Color: "red",
                marginLeft: 70,
              }}
            />
            <Text
              style={{
                marginTop: -25,
                fontSize: 13,
                marginLeft: 110,
                marginRight: 30,
                color: "red",
              }}
            >
              Make this my default selection
            </Text>
          </View>
        </View>
      </Modal>

      <Text
        style={{
          color: "red",
          fontSize: 14,
          fontWeight: "bold",
          textDecorationLine: "underline",
          color: "red",
          marginLeft: 10,
        }}
      >
        Pre-Enquiry
      </Text>
      <View style={{ padding: 10 }}></View>
      <View style={{ padding: 8 }}>
        <View style={styles.num}>
          <Image
            style={styles.nexts}
            source={require("../../assets/images/next.png")}
          />
          <Image
            style={styles.nextS}
            source={require("../../assets/images/next.png")}
          />
          <Image
            style={styles.next0}
            source={require("../../assets/images/next.png")}
          />
          <Text style={{ marginTop: -20, marginLeft: 50 }}>1/254</Text>
          <Image
            style={styles.next1}
            source={require("../../assets/images/next1.png")}
          />
          <Image
            style={styles.nexts1}
            source={require("../../assets/images/next1.png")}
          />
          <Image
            style={styles.nextS1}
            source={require("../../assets/images/next1.png")}
          />
        </View>
        <View style={styles.menu}>
          <Text style={styles.sort}>Sort & Filter</Text>
          <Image
            style={styles.more}
            source={require("../../assets/images/more.png")}
          />
        </View>
      </View>

      <FlatList
        data={datalist}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          let color = "#eeeeee";
          if (index % 2 == 0) {
            color = "white";
          }

          let typeColor = "red";
          if (item.type == "WARM") {
            typeColor = "orange";
          } else if (item.type == "COLD") {
            typeColor = "green";
          }
          return (
            <View style={[styles.main, { backgroundColor: color }]}>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    height: 20,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "black",
                      fontFamily: "SFProDisplay",
                    }}
                  >
                    {item.name}
                  </Text>
                  <View style={{ padding: 2 }}></View>
                  <View
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: typeColor,
                      marginTop: 5,
                      marginLeft: 2,
                    }}
                  >
                    <Text
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "white",
                      }}
                    ></Text>
                  </View>

                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "400",
                      color: "white",
                      paddingLeft: 3,
                      color: typeColor,
                      paddingTop: 3,
                    }}
                  >
                    {item.type}
                  </Text>
                </View>
                <View style={{ padding: 3 }}></View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    color: "black",
                    fontFamily: "SFProDisplay",
                  }}
                >
                  {item.role}
                </Text>
                <View style={{ padding: 3 }}></View>
                <Text
                  style={{
                    color: "grey",
                    fontWeight: "400",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {item.Date}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignContent: "flex-end",
                  flex: 1,
                  marginEnd: -3,
                }}
              >
                <View style={styles.vechicleView}>
                  <Text style={styles.vechileView1}>{item.vechicle}</Text>
                </View>
                <View style={{ padding: 3 }}></View>
                <View>
                  <Pressable onPress={CallPopup}>
                    <Image
                      style={styles.ImageStyle}
                      source={{
                        uri: "https://image.flaticon.com/icons/png/512/901/901120.png",
                      }}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />
      <View style={{ height: 45, backgroundColor: "white" }}>
        <Pressable
          title="click me"
          onPress={() => Alert.alert(" Add Customer Details: ")}
        >
          <Image
            style={styles.ImageStyle1}
            source={{
              uri: "https://image.flaticon.com/icons/png/512/992/992482.png",
            }}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default PreEnquiry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,
  },

  main: {
    width: "100%",
    height: 100,
    marginLeft: 10,
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
  },
  item: {
    backgroundColor: "white",
    fontSize: 15,
    marginTop: 10,
  },
  vechileView1: {
    color: "white",
    fontSize: 14,
    fontFamily: "SegoeUI",
  },
  ImageStyle: {
    height: 15,
    width: 15,
    marginTop: 60,
    marginEnd: 15,
    marginRight: 22,
  },
  vechicleView: {
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 10,
    fontFamily: "SegoeUI",
    backgroundColor: "red",
    height: 40,
    padding: 15,
    paddingTop: 5,
    marginRight: -20,
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  ImageStyle1: {
    height: 50,
    width: 50,
    marginLeft: 320,
    marginTop: 5,
  },
  sort: {
    color: "red",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 265,
    marginBottom: -18,
  },
  more: {
    marginLeft: 355,
    marginBottom: 5,
    padding: 2,
  },
  next1: {
    marginTop: -17,
    marginLeft: 130,
    width: 8,
  },
  nexts1: {
    marginTop: -14,
    marginLeft: 145,
    width: 8,
  },
  nextS1: {
    marginTop: -14,
    marginLeft: 150,
    width: 8,
  },
  nexts: {
    marginBottom: -14,
    width: 10,
    marginLeft: 10,
  },
  nextS: {
    marginBottom: -9,
    width: 10,
    marginLeft: 16,
  },
  next0: {
    marginTop: -5,
    width: 10,
    marginLeft: 30,
  },
  menu: {
    marginBottom: 6,
    marginTop: -15,
  },
  modalText: {
    fontSize: 15,
    marginRight: -20,
    marginTop: 20,
    marginLeft: 30,
    fontWeight: "bold",
  },
  ImageStyleS: {
    width: 40,
    height: 40,
    marginBottom: -35,
  },
  ImageStyles: {
    width: 40,
    height: 40,
    marginBottom: -30,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 225,
    padding: 10,
  },
});
