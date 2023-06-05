import React from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  View,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Button, Checkbox, IconButton } from 'react-native-paper';
import { Colors } from '../styles';
import { useState } from 'react';
import { useEffect } from 'react';

const OrgTagsFilter = ({
  visible,
  onRequestClose,
  onApplyTags,
  selectedTags,
}) => {
  const [tagData, setTagData] = useState([]);

  useEffect(() => {
    setTagData([...selectedTags]);
  }, [selectedTags]);
  
  const itemSelected = (item, i) => {
    let tmpData = tagData;
    tmpData[i].checked = !tmpData[i].checked;
    setTagData([...tmpData]);
  };

  const removeAll = () => {
    setTagData([
      { name: "VIP", checked: false },
      { name: "HNI", checked: false },
      { name: "SPL", checked: false },
    ]);
    onRequestClose();
    onApplyTags([]);
  };

  const applyTags = () => {
    onApplyTags(tagData);
    onRequestClose();
  };

  return (
    <Modal
      animationType={Platform.OS === "ios" ? "slide" : "fade"}
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            <Text style={styles.modalText}>{"CUSTOMER CATEGORY"}</Text>
            <View style={styles.titleLine} />
            <View style={styles.closeContainer}>
              <IconButton
                icon={"close"}
                size={20}
                color={Colors.RED}
                style={{ margin: 0, padding: 0 }}
                onPress={onRequestClose}
              />
            </View>
          </View>
          <FlatList
            data={tagData}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => itemSelected(item, index)}
                  style={styles.itemContainer}
                  key={index}
                >
                  <View
                    style={{
                      ...styles.radioButtonView,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Checkbox.Android
                      color={Colors.RED}
                      status={item.checked ? "checked" : "unchecked"}
                    />
                    <Text style={[styles.radioText, { color: Colors.BLACK }]}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          <View style={styles.btnRow}>
            <Button
              mode="text"
              color={Colors.RED}
              labelStyle={styles.btnLabel}
              onPress={() => removeAll()}
            >
              Remove All
            </Button>
            <Button
              mode="text"
              color={Colors.RED}
              labelStyle={styles.btnLabel}
              onPress={() => applyTags()}
            >
              Apply
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    display: "flex",
    justifyContent: "space-evenly",
    width: "85%",
  },
  modalText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    marginVertical: 15,
  },
  closeContainer: {
    position: "absolute",
    alignSelf: "flex-end",
    top: 7,
    right: 15,
  },
  titleLine: {
    height: 0.5,
    backgroundColor: "gray",
    marginBottom: 16,
    width: "85%",
    alignSelf: "center",
  },
  itemContainer: {
    flex: 1,
    marginVertical: 2,
    width: "85%",
    alignSelf: "center",
  },
  radioButtonView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  radioText: {
    fontSize: 14,
    fontWeight: "400",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "85%",
    alignSelf: "center",
    marginTop: 5,
  },
  btnLabel: {
    textTransform: "none",
    fontSize: 14,
    fontWeight: "600",
  },
});

export { OrgTagsFilter };