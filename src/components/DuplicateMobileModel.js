import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../styles';
import { Button, IconButton } from 'react-native-paper';

const DuplicateMobileModel = ({
  duplicateMobileModelVisible = false,
  onRequestClose,
  duplicateMobileErrorData,
}) => {
  const { enqNumber, mobileNumber, createdBy, createdDate } =
    duplicateMobileErrorData;
  return (
    <Modal
      animationType="fade"
      visible={duplicateMobileModelVisible}
      onRequestClose={() => {}}
      transparent={true}
    >
      <View style={styles.modalMainContainer}>
        <View style={styles.modelView}>
          <View style={styles.titleRow}>
            <Text style={styles.modalTitle}>Duplicate Error</Text>
            <IconButton
              icon={"close"}
              color={Colors.RED}
              size={20}
              onPress={onRequestClose}
            />
          </View>
          <View style={styles.descriptionView}>
            <Text style={styles.descriptionText}>
              {`Mobile Number already exists\n\nMobile Number: ${mobileNumber}\nStage ID: ${enqNumber}`}
            </Text>
            <Text
              style={styles.highlightedText}
            >{`Created by: ${createdBy}\nCreated date: ${createdDate}`}</Text>
          </View>
          <View style={styles.okContainer}>
            <Button
              labelStyle={{
                color: Colors.WHITE,
                textTransform: "none",
              }}
              contentStyle={{ backgroundColor: Colors.PINK }}
              mode="contained"
              onPress={onRequestClose}
            >
              Ok
            </Button>

            {/* <TouchableOpacity activeOpacity={0.9} onPress={onRequestClose}>
              <Text style={styles.okText}>Ok</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalMainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modelView: {
    width: "90%",
    backgroundColor: Colors.WHITE,
    borderRadius: 5,
    overflow: "hidden",
  },
  modalTitle: {
    color: Colors.BLACK,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "left",
    margin: 5,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_COLOR,
    paddingHorizontal: 5,
  },
  descriptionView: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_COLOR,
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.BLACK,
  },
  highlightedText: {
    fontSize: 13,
    color: Colors.PINK,
    fontWeight: "500",
    marginTop: 10,
  },
  okContainer: {
    padding: 10,
    paddingRight: 20,
    alignItems: "center"
  },
  okText: {
    fontSize: 15,
    color: Colors.PINK,
    fontWeight: "500",
  },
});

export default DuplicateMobileModel;