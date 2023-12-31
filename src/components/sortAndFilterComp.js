import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, StyleSheet, View, Dimensions, Text, TouchableOpacity, FlatList, Pressable, Platform } from 'react-native';
import { Colors, GlobalStyle } from '../styles';
import { IconButton, Checkbox, Button, RadioButton } from 'react-native-paper';
import SegmentedControl from "@react-native-segmented-control/segmented-control";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const tableHeight = screenHeight / 2;

const dummyData = [
    {
        id: 1,
        title: "Category Type",
        subtitle: ""
    },
    {
        id: 2,
        title: "Model",
        subtitle: ""
    },
    {
        id: 3,
        title: "Source of Enquiry",
        subtitle: ""
    },

]

const listSideMenu = [
  {
    id: 1,
    title: "Model",
    subtitle: ""
  },
  {
    id: 2,
    title: "Source of Enquiry",
    subtitle: ""
  },

]

const radioDummyData = [
    {
        id: '1',
        name: 'Hot',
        isChecked: false
    },
    {
        id: '2',
        name: 'Warm',
        isChecked: false
    },
    {
        id: '3',
        name: 'Cold',
        isChecked: false
    }
]

const SortAndFilterComp = ({ visible = false, categoryList = [], modelList = [], sourceList = [],firstName = [],lastName = [], mobileNumber = [], onRequestClose, submitCallback }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedRadioIndex, setSelectedRadioIndex] = useState("0");
    const [localModelList, setLocalModelList] = useState(modelList);
    const [localSourceOfEnquiryList, setLocalSourceOfEnquiryList] = useState(sourceList);
    const [localCategoryList, setLocalCategoryList] = useState(categoryList);
    const [segmentedControlData, setSegmentedControlData] = useState(dummyData);

    useEffect(() => {
        if (!!visible) {
            const data = [...dummyData];
            dummyData.forEach(a => {
                if (a.title === 'Category Type' && localCategoryList.length < 1) {
                    data.splice(0, 1);
                    setSegmentedControlData(x => data);
                } else {
                    setSegmentedControlData(x => data);
                }
            })
        }
    }, [visible])

    const itemSelected = (selectedItem, itemIndex) => {
        if (selectedIndex === 0) {
            if (localCategoryList.length < 1) {
                let models = [...localModelList];
                let selectedObject = { ...models[itemIndex] };
                selectedObject.isChecked = !selectedObject.isChecked;
                models[itemIndex] = selectedObject;
                setLocalModelList([...models]);
                return;
            }
          let categoryList = [...localCategoryList];
          let selectedObject = { ...categoryList[itemIndex] };
          selectedObject.isChecked = !selectedObject.isChecked;
          categoryList[itemIndex] = selectedObject;
          setLocalCategoryList([...categoryList]);
        } else if (selectedIndex === 1) {
            if (localCategoryList.length < 1) {
                let sources = [...localSourceOfEnquiryList];
                let selectedObject = { ...sources[itemIndex] };
                selectedObject.isChecked = !selectedObject.isChecked;
                sources[itemIndex] = selectedObject;
                setLocalSourceOfEnquiryList([...sources]);
                return;
            }
          let models = [...localModelList];
          let selectedObject = { ...models[itemIndex] };
          selectedObject.isChecked = !selectedObject.isChecked;
          models[itemIndex] = selectedObject;
          setLocalModelList([...models]);
        } else if (selectedIndex === 2) {
          let sources = [...localSourceOfEnquiryList];
          let selectedObject = { ...sources[itemIndex] };
          selectedObject.isChecked = !selectedObject.isChecked;
          sources[itemIndex] = selectedObject;
          setLocalSourceOfEnquiryList([...sources]);
        }
    }

    const clearAllClicked = () => {

        const updatedCategoryList = localCategoryList.map((item, index) => {
            let newObj = { ...item };
            newObj.isChecked = false;
            return newObj;
        })
        setLocalCategoryList([...updatedCategoryList]);

        const updatedModelList = localModelList.map((item, index) => {
            let newObj = { ...item };
            newObj.isChecked = false;
            return newObj;
        })
        setLocalModelList([...updatedModelList]);

        const updatedSourceList = localSourceOfEnquiryList.map(
          (item, index) => {
            let newObj = { ...item };
            newObj.isChecked = false;
            return newObj;
          }
        );
        setLocalSourceOfEnquiryList([...updatedSourceList]);

          // const updatedFirstName = localFirstNameList.map(
          //   (item, index) => {
          //     let newObj = { ...item };
          //     newObj.isChecked = false;
          //     return newObj;
          //   }
          // );

    }

    const applyButtonClicked = () => {

        const payload = {
            category: localCategoryList,
            source: localSourceOfEnquiryList,
            model: localModelList,

        }
        submitCallback(payload);
    }

    let viewHeight = 150;
    let estimateModelTableHeight = localModelList.length * 50; // 250 default
    let estimateSourceTableHeight = localModelList.length * 50; // 250 default
    if (estimateModelTableHeight > 250 || estimateSourceTableHeight > 250) {
        viewHeight = viewHeight + tableHeight;
    } else {
        viewHeight = viewHeight + 250;
    }

    const renderTitles = ({ item, index }) => {
      let isActive = index == selectedIndex;
      return (
        <TouchableOpacity
          style={[
            styles.titleContainer,
            isActive ? styles.activeTitleContainer : null,
          ]}
          activeOpacity={1}
          onPress={() => setSelectedIndex(index)}
        >
          <Text
            style={[
              styles.titleText,
              index == 1 ? { paddingHorizontal: "10%" } : null,
              isActive ? styles.activeTitleText : null,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <Modal
        animationType={Platform.OS === "ios" ? "slide" : "fade"}
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}
      >
        <View style={styles.container}>
          <View style={{ backgroundColor: Colors.WHITE }}>
            <SafeAreaView>
              <View
                style={{ backgroundColor: Colors.WHITE, height: viewHeight }}
              >
                <View style={styles.view1}>
                  {/*<Text style={styles.text1}>{"Sort and Filter"}</Text>*/}
                  <View></View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.text1}>{"Filter"}</Text>
                    <IconButton
                      icon={"filter-outline"}
                      size={20}
                      color={Colors.RED}
                      style={{ margin: 0, padding: 0 }}
                    />
                  </View>
                  <IconButton
                    icon={"close"}
                    color={Colors.RED}
                    size={20}
                    onPress={onRequestClose}
                  />
                </View>
                <Text style={GlobalStyle.underline}></Text>
                <View
                  style={{
                    width: "100%",
                    height: viewHeight - 150,
                  }}
                >
                  {/* // Left Menu */}
                  <View style={{ backgroundColor: Colors.LIGHT_GRAY, alignItems: "center" }}>
                    <FlatList
                      data={segmentedControlData.map((x) => x.title)}
                      horizontal={true}
                      renderItem={renderTitles}
                      contentContainerStyle={styles.titleRow}
                      bounces={false}
                    />
                    {/* <SegmentedControl
                      style={{
                        marginHorizontal: 4,
                        justifyContent: "center",
                        alignSelf: "center",
                        height: 28,
                        marginVertical: 8,
                        width: "90%",
                      }}
                      values={segmentedControlData.map((x) => x.title)}
                      selectedIndex={selectedIndex}
                      tintColor={Colors.RED}
                      fontStyle={{ color: Colors.BLACK }}
                      activeFontStyle={{ color: Colors.WHITE, fontSize: 12 }}
                      onChange={(event) => {
                        const index = event.nativeEvent.selectedSegmentIndex;
                        setSelectedIndex(index);
                      }}
                    /> */}
                  </View>
                  {/* // Right Content */}
                  <View
                    style={{
                      paddingLeft: 10,
                      height: "85%",
                      backgroundColor: Colors.WHITE,
                    }}
                  >
                    {selectedIndex === 0 && (
                      <View>
                        <FlatList
                          key={"CATEGORY_LIST"}
                          data={
                            localCategoryList.length < 1
                              ? localModelList
                              : localCategoryList
                          }
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity
                                onPress={() => itemSelected(item, index)}
                              >
                                <View style={styles.radiobuttonVw}>
                                  <Checkbox.Android
                                    color={Colors.RED}
                                    status={
                                      item.isChecked ? "checked" : "unchecked"
                                    }
                                  />
                                  <Text
                                    style={[
                                      styles.radioText,
                                      { color: Colors.BLACK },
                                    ]}
                                  >
                                    {localCategoryList.length < 1
                                      ? item.value
                                      : item.name}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            );
                          }}
                        />
                      </View>
                    )}
                    {selectedIndex === 1 && (
                      <View>
                        <FlatList
                          key={"MODEL_LIST"}
                          data={
                            localCategoryList.length < 1
                              ? localSourceOfEnquiryList
                              : localModelList
                          }
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity
                                onPress={() => itemSelected(item, index)}
                              >
                                <View style={styles.radiobuttonVw}>
                                  <Checkbox.Android
                                    color={Colors.RED}
                                    status={
                                      item.isChecked ? "checked" : "unchecked"
                                    }
                                  />
                                  <Text
                                    style={[
                                      styles.radioText,
                                      { color: Colors.BLACK },
                                    ]}
                                  >
                                    {localCategoryList.length < 1
                                      ? item.name
                                      : item.value}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            );
                          }}
                        />
                      </View>
                    )}
                    {selectedIndex === 2 && (
                      <View>
                        <FlatList
                          key={"SOURCE_LIST"}
                          data={localSourceOfEnquiryList}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity
                                onPress={() => itemSelected(item, index)}
                              >
                                <View style={styles.radiobuttonVw}>
                                  <Checkbox.Android
                                    color={Colors.RED}
                                    status={
                                      item.isChecked ? "checked" : "unchecked"
                                    }
                                  />
                                  <Text
                                    style={[
                                      styles.radioText,
                                      { color: Colors.BLACK },
                                    ]}
                                  >
                                    {item.name}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            );
                          }}
                        />
                      </View>
                    )}
                  </View>
                </View>
                <Text style={GlobalStyle.underline}></Text>
                <View style={styles.view2}>
                  <Button
                    mode="text"
                    color={Colors.RED}
                    contentStyle={{ paddingHorizontal: 20 }}
                    labelStyle={{
                      textTransform: "none",
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                    onPress={clearAllClicked}
                  >
                    Clear All
                  </Button>
                  <Button
                    mode="contained"
                    color={Colors.RED}
                    contentStyle={{ paddingHorizontal: 20 }}
                    labelStyle={{
                      textTransform: "none",
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                    onPress={applyButtonClicked}
                  >
                    Apply
                  </Button>
                </View>
              </View>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    );
}

export { SortAndFilterComp };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flexDirection: "column-reverse",
  },
  view1: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 20,
  },
  text1: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.RED,
  },
  view2: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 50,
    marginTop: 10,
    marginBottom: 25,
    backgroundColor: Colors.WHITE,
  },
  itemView: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  text2: {
    fontSize: 14,
    fontWeight: "600",
  },
  text3: {
    textAlign: "left",
    fontSize: 12,
    fontWeight: "400",
    color: Colors.RED,
  },
  radiobuttonVw: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioText: {
    fontSize: 14,
    fontWeight: "400",
  },

  titleRow: {
    justifyContent: "space-between",
    alignItems: "center",
    height: 30,
    width: "92%",
    backgroundColor: "#dddadd",
    borderRadius: 5,
    alignSelf: "center",
    marginVertical: 8,
  },
  titleContainer: {
    borderRadius: 7,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTitleContainer: {
    backgroundColor: Colors.RED,
  },
  titleText: {
    color: Colors.BLACK,
    fontSize: 13,
    paddingHorizontal: "2%",
  },
  activeTitleText: {
    color: Colors.WHITE,
    fontSize: 12,
  },
});
