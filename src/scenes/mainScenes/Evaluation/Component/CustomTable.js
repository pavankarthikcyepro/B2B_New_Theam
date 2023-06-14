import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { RadioTextItem2 } from "../../../../pureComponents";
import { Colors } from "../../../../styles";

const Table = (props) => {
  const { label, data, onPress, onChangeText } = props;
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.labelText}>{label}</Text>
        {/* <Text style={styles.labelText}>{"Variable(Yes/No)"}</Text> */}
        <Text style={styles.labelText}>{"Cost"}</Text>
      </View>
      {data.map((item, index) => {
        return (
          <View style={styles.row}>
            <Text style={styles.column}>{item.items}</Text>
            {/* <View style={{ flexDirection: "row", paddingHorizontal: 5 }}>
              <RadioTextItem2
                label={"Yes"}
                value={"yes"}
                status={item.status === "Active" ? true : false}
                onPress={() => onPress({ id: item.id, status: true })}
              />
              <RadioTextItem2
                label={"No"}
                value={"no"}
                status={item.status !== "Active" ? true : false}
                onPress={() => onPress({ id: item.id, status: false })}
              />
            </View> */}
            <TextInput
              value={item.cost}
              keyboardType={"number-pad"}
              style={[styles.column, styles.input]}
              onChangeText={(text) => {
                onChangeText({
                  id: item.id,
                  text: text.trim() === "" ? "0" : text,
                });
              }}
            />
          </View>
        );
      })}

      {/* <View style={styles.row}>
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
      </View> */}
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
    borderColor: Colors.GRAY,
    height: 35,
    borderRadius: 10,
  },
  labelText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.DARK_GRAY,
    flex: 1,
    padding: 5,
    borderWidth: 0,
  },
});

export default Table;
