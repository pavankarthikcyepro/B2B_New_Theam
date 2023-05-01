import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Animated,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from "react-native";
import { TextinputComp } from "../../../../components";

export const FloatingModal = ({
  modalVisible,
  setModalVisible,
  handleSave,
}) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [officeAllocated, setOfficeAllocated] = useState("");
  const [officeAllocatedError, setOfficeAllocatedError] = useState("");
  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [cost, setCost] = useState("");
  const [costError, setCostError] = useState("");
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [modalHeight, setModalHeight] = useState(0);
  const modalAnimation = new Animated.Value(0);

  useEffect(() => {
    if (modalVisible) {
      handleModalOpen();
    } else {
      handleModalClose();
    }
  }, [modalVisible]);

  const handleSavePress = () => {
    // Validate inputs here
    if (!name) {
      setNameError("Name is required");
      return;
    }

    if (!officeAllocated) {
      setOfficeAllocatedError("Office Allocated is required");
      return;
    }

    if (!quantity) {
      setQuantityError("Quantity is required");
      return;
    }

    if (!cost) {
      setCostError("Cost is required");
      return;
    }

    if (!price) {
      setPriceError("Price is required");
      return;
    }

    // All inputs are valid, call the handleSave function
    const format = {
      Name: name,
      "Office Allocated": officeAllocated,
      Remarks: remarks,
      Quantity: quantity,
      Cost: cost,
      Price: price,
    };
    handleSave(format);
  };

  const handleModalOpen = () => {
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleModalClose = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const keyboardVerticalOffset = modalHeight
    ? Platform.OS === "ios"
      ? Dimensions.get("window").height - modalHeight - 80
      : 0
    : 0;

  return (
    <Modal visible={modalVisible} transparent animationType="none">
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={styles.modalContainer}>
          <Animated.View
            // onLayout={handleOnLayout}
            style={[
              styles.modalContent,
              //   {
              //     transform: [
              //       {
              //         translateY: modalAnimation.interpolate({
              //           inputRange: [0, 1],
              //           outputRange: [500, 0],
              //         }),
              //       },
              //     ],
              //   },
            ]}
          >
            <TextinputComp
              style={styles.textInputStyle}
              label="Name"
              value={name}
              onChangeText={(value) => {
                setName(value);
                setNameError("");
              }}
              error={!!nameError}
              errorMsg={nameError}
            />
            <TextinputComp
              style={styles.textInputStyle}
              label="Office Allocated"
              value={officeAllocated}
              onChangeText={(value) => {
                setOfficeAllocated(value);
                setOfficeAllocatedError("");
              }}
              error={!!officeAllocatedError}
              errorMsg={officeAllocatedError}
            />
            <TextinputComp
              style={styles.textInputStyle}
              label="Remarks"
              value={remarks}
              onChangeText={(value) => {
                setRemarks(value);
                setRemarksError("");
              }}
              error={!!remarksError}
              errorMsg={remarksError}
            />
            <TextinputComp
              style={styles.textInputStyle}
              label="Quantity"
              value={quantity}
              onChangeText={(value) => {
                setQuantity(value);
                setQuantityError("");
              }}
              error={!!quantityError}
              errorMsg={quantityError}
              keyboardType="numeric"
            />
            <TextinputComp
              style={styles.textInputStyle}
              label="Cost"
              value={cost}
              onChangeText={(value) => {
                setCost(value);
                setCostError("");
              }}
              error={!!costError}
              errorMsg={costError}
              keyboardType="numeric"
            />
            <TextinputComp
              style={styles.textInputStyle}
              label="Price"
              value={price}
              onChangeText={(value) => {
                setPrice(value);
                setPriceError("");
              }}
              error={!!priceError}
              errorMsg={priceError}
              keyboardType="numeric"
            />
            <View style={{ flexDirection: "row" }}>
              <Button title={"Save"} onPress={handleSavePress} />
              <Button
                title={"Cancel"}
                onPress={() => {
                  handleModalClose();
                }}
              />
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  textInputStyle: {
    height: 50,
    width: "100%",
    // marginVertical: 2,
    paddingLeft: 10,
    paddingRight: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  error: {
    color: "red",
    marginBottom: 5,
    fontSize: 12,
    paddingLeft: 10,
  },
});
