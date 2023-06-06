import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { RadioTextItem2 } from "../../../../pureComponents";

const TableView = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.row, { borderBottomWidth: 1 }]}>
        <Text style={styles.columnHeader}>Checklist</Text>
        <Text style={styles.columnHeader}>Remarks</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cell}>Item 1</Text>
        <TextInput style={[styles.column, styles.input]} />
      </View>
      <View style={styles.row}>
        <Text style={styles.cell}>Item 2</Text>
        <TextInput style={[styles.column, styles.input]} />
      </View>
      <View style={styles.row}>
        <Text style={styles.cell}>Item 3</Text>
        <TextInput style={[styles.column, styles.input]} />
      </View>
      <View style={styles.row}>
        <Text style={styles.cell}>Item 4</Text>
        <TextInput style={[styles.column, styles.input]} />
      </View>
      <View style={styles.row}>
        <View style={{ justifyContent: "center" }}>
          <View>
            <Text style={styles.cell}>Item 5</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioTextItem2
            label={"Option 1"}
            value={"75"}
            status={true}
            onPress={() => {}}
          />
          <RadioTextItem2
            label={"Option 2"}
            value={"50"}
            status={false}
            onPress={() => {}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  columnHeader: {
    fontWeight: "bold",
    flex: 1,
  },
  cell: {
    flex: 1,
  },
  column: {
    flex: 1,
    padding: 5,
    borderWidth: 0, // Remove outline
  },
  input: {
    borderWidth: 1, // Remove outline
  },
});

export default TableView;
