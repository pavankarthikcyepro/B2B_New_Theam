import React, { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { Colors, GlobalStyle } from "../../../../styles";
import { List, Divider, Button, IconButton } from "react-native-paper";

const screenHeight = Dimensions.get("window").height;
const tableHeight = screenHeight / 2;

const multipleTestData = [
  {
    id: "1",
    name: "First",
    selected: false,
  },
  {
    id: "2",
    name: "Second",
    selected: false,
  },
  {
    id: "3",
    name: "Third",
    selected: false,
  },
  {
    id: "4",
    name: "Fourth",
    selected: false,
  },
];

const DropDown = ({
  visible = false,
  multiple = false,
  headerTitle = "Select Data",
  data = [],
  selectedItems,
  keyId = "",
  onRequestClose,
}) => {
  const [multipleData, setMultipleData] = useState([]);

  useEffect(() => {
    setMultipleData([...data]);
  }, [data]);

  const itemSelected = (index) => {
    let updatedMultipleData = [...multipleData];
    const obj = { ...updatedMultipleData[index] };
    if (obj.selected != undefined) {
      obj.selected = !obj.selected;
    } else {
      obj.selected = true;
    }
    updatedMultipleData[index] = obj;
    setMultipleData(updatedMultipleData);
  };

  const closeModalWithSelectedItem = (item) => {
    if (multiple) {
      // let itemsSelected = [];
      // multipleData.forEach((value, index) => {
      //     if (value.selected) {
      //         itemsSelected.push(value);
      //     }
      // })
      selectedItems(multipleData, keyId);
    } else {
      selectedItems(item, keyId);
    }
  };

  let estimateTableHeight = data.length * 50;
  let faltListHeight = tableHeight;
  if (estimateTableHeight < tableHeight) {
    faltListHeight = null;
  }

  return (
    <Modal
      animationType={Platform.OS === "ios" ? "slide" : "fade"}
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.conatiner}>
        <View style={{ backgroundColor: Colors.WHITE }}>
          <SafeAreaView>
            <View style={styles.view1}>
              <View style={styles.view2}>
                <Text style={styles.text1}>{headerTitle}</Text>
                {multiple ? (
                  <Button
                    labelStyle={{
                      fontSize: 14,
                      fontWeight: "400",
                      color: Colors.RED,
                      textTransform: "none",
                    }}
                    onPress={() => closeModalWithSelectedItem({})}
                  >
                    Done
                  </Button>
                ) : (
                  <IconButton
                    icon="close-circle-outline"
                    color={Colors.WHITE}
                    size={25}
                    onPress={onRequestClose}
                  />
                )}
              </View>

              {multiple ? (
                <FlatList
                  data={multipleData}
                  style={{ height: faltListHeight }}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => {
                    return (
                      <Pressable onPress={() => itemSelected(index)}>
                        <View>
                          <List.Item
                            titleStyle={{
                              fontSize: 14,
                              fontWeight: "400",
                            }}
                            title={item.name}
                            style={{ height: 40 }}
                            description={""}
                            titleNumberOfLines={1}
                            descriptionEllipsizeMode={"tail"}
                            left={(props) => (
                              <List.Icon
                                {...props}
                                icon={
                                  item.selected
                                    ? "checkbox-marked"
                                    : "checkbox-blank-outline"
                                }
                                color={item.selected ? Colors.RED : Colors.GRAY}
                                style={{ margin: 0 }}
                              />
                            )}
                          />
                          {/* <Divider /> */}
                        </View>
                      </Pressable>
                    );
                  }}
                />
              ) : data.length > 0 ? (
                <FlatList
                  style={{ height: faltListHeight }}
                  data={data}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => {
                    return (
                      <Pressable
                        onPress={() => closeModalWithSelectedItem(item)}
                      >
                        <View>
                          <List.Item
                            titleStyle={{ fontSize: 16, fontWeight: "400" }}
                            title={item.name}
                            titleNumberOfLines={1}
                            descriptionEllipsizeMode={"tail"}
                            description={""}
                          />
                          <View style={GlobalStyle.underline}></View>
                        </View>
                      </Pressable>
                    );
                  }}
                />
              ) : (
                <View style={{ marginTop: 10, marginLeft: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: "400" }}>
                    No data found
                  </Text>
                </View>
              )}
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

export { DropDown };

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  view1: {
    backgroundColor: Colors.WHITE,
    paddingBottom: 20,
  },
  view2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.DARK_GRAY,
    height: 50,
    width: "100%",
    paddingLeft: 15,
  },
  text1: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: "600",
  },
});
