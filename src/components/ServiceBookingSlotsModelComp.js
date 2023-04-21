import React, { useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, GlobalStyle } from '../styles';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Fontisto from "react-native-vector-icons/Fontisto";

const ServiceBookingSlotsModelComp = ({ visible, closeSlotsModel, selectedDate = "" }) => {
  const selector = useSelector((state) => state.serviceBookingReducer);
  
  const [selectedIndex, setSelectedIndex] = useState(null);

  const listTitle = () => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.radioView} />
        <Text style={styles.titleTimeText}>Time</Text>
        <Text style={styles.titleSlotBookText}>Slots Booked</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }) => {
    console.log("item -> ", item);
    return (
      <TouchableOpacity
        onPress={() => setSelectedIndex(index)}
        key={index}
        style={styles.itemContainer}
      >
        <Fontisto
          name={
            selectedIndex == index ? "radio-btn-active" : "radio-btn-passive"
          }
          size={12}
          color={Colors.RED}
          style={{ marginEnd: 10 }}
        />
        <Text style={styles.timeText}>
          {item.fromTime} - {item.toTime}
        </Text>
        <Text style={styles.slotBookText}>
          {item.booked}
        </Text>
      </TouchableOpacity>
    );
  };

  const noData = () => {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No Slots Found !</Text>
      </View>
    );
  };

  return (
    <Modal
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}}
      transparent={true}
    >
      <View style={styles.modelContainer}>
        <View style={styles.modelView}>
          <Text
            style={styles.selectTitle}
          >{`Select time slot for ${selectedDate}`}</Text>

          <FlatList
            data={selector.bookingTimeSlotsList}
            ListEmptyComponent={noData}
            renderItem={renderItem}
            ListHeaderComponent={listTitle}
          />

          <View style={styles.btnRow}>
            <Button
              mode="contained"
              style={{ flex: 1, marginRight: 10 }}
              color={Colors.GRAY}
              labelStyle={{ textTransform: "none" }}
              onPress={() => {
                setSelectedIndex(null);
                closeSlotsModel();
              }}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              style={{ flex: 1 }}
              color={Colors.PINK}
              labelStyle={{ textTransform: "none" }}
              onPress={() => {
                setSelectedIndex(null);
                closeSlotsModel();
              }}
              disabled={selectedIndex == null}
            >
              Done
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modelContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modelView: {
    width: "90%",
    backgroundColor: Colors.WHITE,
    padding: 10,
    flexDirection: "column",
    maxHeight: "40%",
    borderRadius: 5,
  },
  selectTitle: {
    color: Colors.BLACK,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "left",
    margin: 5,
  },
  radioView: {
    height: 12,
    width: 12,
    marginRight: 10,
  },
  titleTimeText: {
    fontWeight: "600",
    width: "55%",
  },
  titleSlotBookText: {
    fontWeight: "600",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_COLOR,
    marginBottom: 5,
    padding: 5,
  },
  timeText: {
    width: "70%",
  },
  slotBookText: {
    color: Colors.GRAY
  },

  btnRow: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginTop: 10,
  },
  noDataContainer: {},
  noDataText: {
    marginVertical: 25,
    fontSize: 18,
    color: Colors.BLACK,
    alignSelf: "center",
    fontWeight: "bold",
  },
});

export { ServiceBookingSlotsModelComp };