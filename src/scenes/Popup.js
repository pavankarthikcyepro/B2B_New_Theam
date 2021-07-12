import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";

const Popup = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("page has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Choose your preferred connection
            </Text>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
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
                }}
              >
                SIM 1
              </Text>
              <Text
                style={{
                  color: "grey",
                  fontSize: 14,
                }}
              >
                +91 9258765222
              </Text>
            </Pressable>
            <View style={{ padding: 10 }}></View>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
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
                }}
              >
                SIM 2
              </Text>
              <Text
                style={{
                  color: "grey",
                  fontSize: 14,
                }}
              >
                +91 9258765222
              </Text>
            </Pressable>
            <View style={{ padding: 10 }}></View>
            <CheckBox
              style={{
                marginRight: 100,
                Color: "red",
                marginLeft: -60,
              }}
              disabled={false}
              value={toggleCheckBox}
              onValueChange={(newValue) => setToggleCheckBox(newValue)}
            />
            <Text
              style={{
                marginTop: -25,
                fontSize: 13,
                marginLeft: 40,
                marginRight: -50,
                color: "red",
              }}
            >
              Make this my default selection
            </Text>
          </View>
        </View>
      </Modal>
      <Pressable onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Sort & Filter</Text>
        {/* <Image style={styles.ImageStyle1} source={{ uri: 'https://image.flaticon.com/icons/png/512/901/901120.png', }}/> */}
      </Pressable>
    </View>
  );
};

export default Popup;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 2,
    padding: 60,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  textStyle: {
    color: "red",
    textDecorationLine: "underline",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: 15,
    marginRight: -60,
    marginBottom: 40,
    marginLeft: -60,
    fontWeight: "bold",
  },
  ImageStyleS: {
    width: 40,
    height: 40,
    marginBottom: -30,
    marginStart: -60,
  },
  ImageStyles: {
    width: 40,
    height: 40,
    marginBottom: -30,
    marginStart: -60,
  },
});

// import React, { useState } from "react";
// import {
//   Alert,
//   Modal,
//   StyleSheet,
//   Text,
//   Pressable,
//   View,
//   Image,
//   Button,
// } from "react-native";

// const ModalScreen = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   return (
//     <View style={styles.centeredView}>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           Alert.alert("Modal has been closed.");
//           setModalVisible(!modalVisible);
//         }}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalText}>Welcome to AUTOMATE......</Text>
//             <Pressable
//               style={[styles.button, styles.buttonClose]}
//               onPress={() => setModalVisible(!modalVisible)}
//             >
//               <Text style={styles.textStyle}>Hi Nirosha</Text>
//             </Pressable>
//             <View style={{ padding: 10 }}></View>

//             <Image
//               style={{ width: 100, height: 50 }}
//               source={{
//                 uri: "https://i.pinimg.com/originals/2f/38/e9/2f38e9d88091a6274c469b2516718da4.jpg",
//               }}
//             />
//             <View style={{ padding: 5 }}></View>
//             <Text style={styles.textStyle}>IT-HUB</Text>

//             <View style={{ padding: 5 }}></View>

//             <View style={styles.fixToText}>
//               <Button
//                 title="KHAMMAM"
//                 onPress={() => Alert.alert("KHM button pressed")}
//               />
//               <View style={{ padding: 20 }}></View>
//               <Button
//                 title="HYDERABAD"
//                 onPress={() => Alert.alert("HYD button pressed")}
//               />
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Pressable
//         style={[styles.button, styles.buttonOpen]}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.textStyle}>Automate in Khammam</Text>
//       </Pressable>

//       <View style={{ padding: 20 }}></View>
//     </View>
//   );
// };

// export default ModalScreen;

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 12,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: "cyan",
//     borderRadius: 30,
//     padding: 45,
//     alignItems: "center",
//     shadowColor: "pink",
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   button: {
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//   },
//   buttonOpen: {
//     backgroundColor: "gray",
//     height: 100,
//     width: 200,
//     padding: 30,
//   },
//   buttonClose: {
//     backgroundColor: "white",
//   },

//   textStyle: {
//     color: "purple",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   modalText: {
//     marginBottom: 18,
//     textAlign: "center",
//   },
//   fixToText: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
// });