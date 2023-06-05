import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { RadioTextItem2 } from "../../../../pureComponents";
import { Colors } from "../../../../styles";

const Table = (props) => {
      const { label, } = props;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.labelText}>{label}</Text>
        <Text style={styles.labelText}>{"Variable(Yes/No)"}</Text>
        <Text style={styles.labelText}>{"Cost"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.column}>Item 1</Text>
        <View style={{ flexDirection: "row", paddingHorizontal: 5 }}>
          <RadioTextItem2
            label={"Yes"}
            value={"yes"}
            status={true}
            onPress={() => {}}
          />
          <RadioTextItem2
            label={"No"}
            value={"no"}
            status={false}
            onPress={() => {}}
          />
        </View>
        <TextInput style={[styles.column, styles.input]} />
      </View>
      <View style={styles.row}>
        <Text style={styles.column}>Item 2</Text>
        <View style={{ flexDirection: "row", paddingHorizontal: 5 }}>
          <RadioTextItem2
            label={"Yes"}
            value={"yes"}
            status={true}
            onPress={() => {}}
          />
          <RadioTextItem2
            label={"No"}
            value={"no"}
            status={false}
            onPress={() => {}}
          />
        </View>
        <TextInput style={[styles.column, styles.input]} />
      </View>
      <View style={styles.row}>
        <Text style={styles.column}>Item 3</Text>
        <View style={{ flexDirection: "row", paddingHorizontal: 5 }}>
          <RadioTextItem2
            label={"Yes"}
            value={"yes"}
            status={true}
            onPress={() => {}}
          />
          <RadioTextItem2
            label={"No"}
            value={"no"}
            status={false}
            onPress={() => {}}
          />
        </View>
        <TextInput style={[styles.column, styles.input]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    flex: 1,
    padding: 5,
    borderWidth: 0, // Remove outline
  },
  input: {
    borderWidth: 1, // Remove outline
  },
  labelText:{
    fontSize:15,
    fontWeight:'600',
    color: Colors.DARK_GRAY,
    flex: 1,
    padding: 5,
    borderWidth: 0, 
  }
});

export default Table;
