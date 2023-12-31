import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, View, Text, StyleSheet, FlatList, Pressable, Dimensions, Platform } from 'react-native';
import { Colors, GlobalStyle } from '../styles';
import { List, Divider, Button, IconButton } from 'react-native-paper';

const screenHeight = Dimensions.get('window').height;
const tableHeight = screenHeight / 2;

const multipleTestData = [
    {
        id: "1",
        name: 'First',
        selected: false,
    },
    {
        id: "2",
        name: 'Second',
        selected: false,
    },
    {
        id: "3",
        name: 'Third',
        selected: false,
    },
    {
        id: "4",
        name: 'Fourth',
        selected: false,
    }
]


const DropDownComponant = ({
  visible = false,
  multiple = false,
  headerTitle = "Select Data",
  data = [],
  selectedItems,
  keyId = "",
  onRequestClose,
  disabledData = [],
  allOption = false,
}) => {
  const [multipleData, setMultipleData] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      let tmpArr = data;
      if (allOption) {
        let index = tmpArr.findIndex((item) => item.selected == false);
        tmpArr = [{ name: "All", selected: index < 0 ? true : false }, ...data];
      }
      setMultipleData([...tmpArr]);
    }
  }, [data]);

  const itemSelected = (index, item) => {
    let updatedMultipleData = [...multipleData];

    if (
      allOption &&
      item?.name == "All" &&
      updatedMultipleData[index].selected == false
    ) {
      updatedMultipleData.forEach((item, index) => {
        updatedMultipleData[index].selected = true;
      });
    } else if (allOption && item?.name == "All") {
      updatedMultipleData.forEach((item, index) => {
        updatedMultipleData[index].selected = false;
      });
    } else {
      const obj = { ...updatedMultipleData[index] };

      if (allOption) {
        if (!obj.selected) {
          updatedMultipleData[0].selected = false;
        } 
      }

      if (obj.selected != undefined) {
        obj.selected = !obj.selected;
      } else {
        obj.selected = true;
      }
      updatedMultipleData[index] = obj;
    }

    if (allOption) {
      let flag = 0;
      for (let i = 0; i < updatedMultipleData.length; i++) {
        if (i != 0) {
          if (!updatedMultipleData[i].selected) {
            flag = 1;
            break;
          }
        }
      }

      if (flag == 1) {
        updatedMultipleData[0].selected = false;
      } else {
        updatedMultipleData[0].selected = true;
      }
    }

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
      let tmpArr = multipleData;
      if (allOption) {
        tmpArr.splice(0, 1);
      }
      selectedItems(tmpArr, keyId);
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
                      <Pressable onPress={() => itemSelected(index, item)}>
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
                    let disabledItem = false;
                    if (disabledData.length > 0) {
                      disabledData.forEach((element) => {
                        if (element.name == item.name) {
                          disabledItem = true;
                        }
                      });
                    }
                    return (
                      <Pressable
                        disabled={disabledItem}
                        onPress={() => closeModalWithSelectedItem(item)}
                      >
                        <View>
                          <List.Item
                            titleStyle={{
                              fontSize: 16,
                              fontWeight: "400",
                              color: disabledItem
                                ? Colors.TARGET_GRAY
                                : Colors.BLACK,
                            }}
                            title={item.name}
                            titleNumberOfLines={1}
                            descriptionEllipsizeMode={"tail"}
                            description={""}
                            disabled={disabledItem}
                            style={
                              disabledItem
                                ? { backgroundColor: Colors.LIGHT_GRAY }
                                : null
                            }
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

export { DropDownComponant };

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    view1: {
        backgroundColor: Colors.WHITE,
        paddingBottom: 20
    },
    view2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.DARK_GRAY,
        height: 50,
        width: '100%',
        paddingLeft: 15
    },
    text1: {
        color: Colors.WHITE,
        fontSize: 18,
        fontWeight: '600',
    }
})

