import React from 'react';
import { FlatList, Modal, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import { Colors, GlobalStyle } from '../../../../styles';
import { ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';

const BookedSlotsListModel = ({ bookedSlotsModal, onRequestClose }) => {
  const listTop = () => {
    return (
      <View>
        <Text style={GlobalStyle.underline} />
        <View style={styles.tableRow}>
          <Text numberOfLines={1} style={styles.titleText}>
            Vehicle Reg.No
          </Text>
          <Text numberOfLines={1} style={styles.titleText}>
            Booking ID
          </Text>
          <Text numberOfLines={1} style={styles.titleText}>
            Service Type
          </Text>
          <Text numberOfLines={1} style={styles.titleText}>
            Sub Service Type
          </Text>
          <Text numberOfLines={1} style={styles.titleText}>
            Service Date
          </Text>
          <Text numberOfLines={1} style={[styles.titleText, { width: 150 }]}>
            Slot Selected
          </Text>
          <Text numberOfLines={1} style={styles.titleText}>
            Status
          </Text>
        </View>
        <Text style={[GlobalStyle.underline, { marginTop: 5 }]} />
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={styles.tableRow}>
        <Text numberOfLines={1} style={styles.rowText}>
          TS656767GG
        </Text>
        <Text numberOfLines={1} style={styles.rowText}>
          BKG-877879
        </Text>
        <Text numberOfLines={1} style={styles.rowText}>
          Free Service
        </Text>
        <Text numberOfLines={1} style={styles.rowText}>
          1st Free Service
        </Text>
        <Text numberOfLines={1} style={styles.rowText}>
          12-12-2023
        </Text>
        <Text numberOfLines={1} style={[styles.rowText, { width: 150 }]}>
          08:00:00-12:00:00
        </Text>
        <Text numberOfLines={1} style={styles.rowText}>
          BOOKED
        </Text>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      visible={bookedSlotsModal}
      onRequestClose={() => {}}
      transparent={true}
    >
      <View style={styles.modelContainer}>
        <View style={styles.modelView}>
          <View style={styles.titleRow}>
            <Text style={styles.modalTitleText}>Booked Slots</Text>
            <IconButton
              icon="close-circle-outline"
              color={Colors.GRAY}
              size={25}
              onPress={onRequestClose}
              style={{ margin: 0 }}
            />
          </View>
          <ScrollView
            style={{ width: "100%" }}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
          >
            <View style={{ flexDirection: "column" }}>
              <FlatList
                ListHeaderComponent={listTop}
                data={[
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                ]}
                renderItem={renderItem}
              />
            </View>
          </ScrollView>
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  modalTitleText: {
    color: Colors.BLACK,
    fontSize: 16,
    fontWeight: "700",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    width: "100%",
    marginTop: 5,
  },
  rowText: {
    fontSize: 12,
    color: Colors.BLACK,
    marginEnd: 10,
    width: 100,
    textAlign: "center",
  },
  titleText: {
    fontSize: 13,
    color: Colors.BLACK,
    marginEnd: 10,
    width: 100,
    textAlign: "center",
    fontWeight: "600"
  },
});

export default BookedSlotsListModel;