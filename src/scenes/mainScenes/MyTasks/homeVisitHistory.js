import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Colors, GlobalStyle } from '../../../styles';

const HomeVisitHistory = ({ route, navigation }) => {
  const [historyList, setHistoryList] = useState(["", "", ""]);

  const renderItem = ({ item, index }) => {
    let topBcgColor = Colors.LIGHT_GRAY;
    let bottomBcgColor = Colors.LIGHT_GRAY;
    if (historyList[index - 1] !== undefined) {
      topBcgColor = Colors.GRAY;
    }

    if (historyList[index + 1] !== undefined) {
      bottomBcgColor = Colors.GRAY;
    }

    return (
      <View style={styles.itemRow}>
        <View style={styles.dateColumn}>
          <View style={[styles.view1, { backgroundColor: topBcgColor }]} />
          <View style={[styles.view1, { backgroundColor: bottomBcgColor }]} />

          <View style={styles.dateContainer}>
            <View style={styles.blankView}></View>
            <View style={{ marginLeft: 5 }}>
              <Text style={styles.dateText}>{"01/01/2023"}</Text>
              <Text style={styles.dateText}>{"11:45 AM"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.dataContainer}>
          <View style={[{ backgroundColor: Colors.WHITE }, GlobalStyle.shadow]}>
            <TouchableOpacity disabled={true} onPress={() => {}}>
              <View style={[styles.nameContainer]}>
                <View style={styles.view6}>
                  <Text style={styles.txt5}>{"Model: "}</Text>
                  <Text style={styles.txt3}>{"Nothing"}</Text>
                </View>
                <View style={styles.view6}>
                  <Text style={styles.txt5}>{"Variant: "}</Text>
                  <Text style={styles.txt3}>{"Nothing"}</Text>
                </View>
                <View style={styles.view6}>
                  <Text style={styles.txt5}>{"Fuel Type: "}</Text>
                  <Text style={styles.txt3}>{"Nothing"}</Text>
                </View>
                <View style={styles.view6}>
                  <Text style={styles.txt5}>{"Transmission: "}</Text>
                  <Text style={styles.txt3}>{"Nothing"}</Text>
                </View>
                <View style={styles.view6}>
                  <Text style={styles.txt5}>{"Customer address: "}</Text>
                  <Text style={styles.txt3}>{"Nothing"}</Text>
                </View>
                <View style={styles.view6}>
                  <Text style={styles.txt5}>{"Mobile No: "}</Text>
                  <Text style={styles.txt3}>{"Nothing"}</Text>
                </View>
                <View style={styles.view6}>
                  <Text style={styles.txt5}>{"Reason: "}</Text>
                  <Text style={styles.txt3}>{"Nothing"}</Text>
                </View>
                <View style={styles.view6}>
                  <Text style={styles.txt5}>{"Customer Remarks: "}</Text>
                  <Text style={styles.txt3}>{"Nothing"}</Text>
                </View>
                <View style={styles.view6}>
                  <Text style={styles.txt5}>{"Employee Remarks: "}</Text>
                  <Text style={styles.txt3}>{"Nothing"}</Text>
                </View>
                <View style={styles.view6}>
                  <Text style={styles.txt5}>{"Status: "}</Text>
                  <Text style={styles.txt3}>{"Nothing"}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Text>Test</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={["", "", ""]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  itemRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  dateColumn: {
    width: "25%",
    justifyContent: "center",
  },
  view1: {
    marginLeft: 8,
    flex: 1,
    width: 2,
  },
  dateContainer: {
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
  },
  blankView: {
    height: 20,
    width: 20,
    borderRadius: 20,
    backgroundColor: Colors.GRAY,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "400",
  },
  dataContainer: {
    width: "75%",
    padding: 5,
  },
  nameContainer: {
    paddingVertical: 5,
    paddingLeft: 10,
    backgroundColor: Colors.WHITE,
  },
  view6: { flexDirection: "row", margin: 5 },
  txt3: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.BLACK,
    flex: 1,
  },
  txt5: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.GRAY,
    flex: 1,
  },
});

export default HomeVisitHistory;