import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Checkbox, DataTable, List, Button } from "react-native-paper";
import { Colors } from "../../../styles";
import { StyleSheet } from "react-native";
import {
  ButtonComp,
  DatePickerComponent,
  DropDownComponant,
  ImagePickerComponent,
  TextinputComp,
} from "../../../components";
import { Dropdown } from "react-native-element-dropdown";
import { DateSelectItem, RadioTextItem } from "../../../pureComponents";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTextInput from "./Component/CustomTextInput";
import Entypo from "react-native-vector-icons/Entypo";
import CustomEvaluationDropDown from "./Component/CustomEvaluationDropDown";
import CustomDatePicker from "./Component/CustomDatePicker";
import CustomRadioButton from "./Component/RadioComponent";
import CustomSelection from "./Component/CustomSelection";
import CustomUpload from "./Component/CustomUpload";
import Table from "./Component/CustomTable";
import TableView from "./Component/CustomTableView";
import { MyTasksStackIdentifiers } from "../../../navigations/appNavigator";

const LocalButtonComp = ({ title, onPress, disabled, color }) => {
  return (
    <Button
      style={{
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        paddingVertical: 5,
      }}
      mode="contained"
      color={color ? color : Colors.RED}
      disabled={disabled}
      labelStyle={{ textTransform: "none", color: Colors.WHITE }}
      onPress={onPress}
    >
      {title}
    </Button>
  );
};
const SAMPLELIST = [
  {
    Name: "Product A",
    "Office Allocated": "Office 1",
    Remarks: "Lorem ipsum dolor sit amet",
    Quantity: 10,
    Cost: 50,
    Price: 70,
  },
  {
    Name: "Product B",
    "Office Allocated": "Office 2",
    Remarks: "Consectetur adipiscing elit",
    Quantity: 5,
    Cost: 20,
    Price: 30,
  },
  {
    Name: "Product C",
    "Office Allocated": "Office 1",
    Remarks: "Sed do eiusmod tempor incididunt",
    Quantity: 15,
    Cost: 30,
    Price: 40,
  },
];

const CheckListScreen = ({route,navigation}) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [dropDownTitle, setDropDownTitle] = useState("");
  const [showImagePicker, setShowImagePicker] = useState(false);

  const [evaluatorError, setEvaluatorError] = useState(null);
  const [openAccordian, setOpenAccordian] = useState("1");
  const [openAccordian2, setOpenAccordian2] = useState("1");
  const [openAccordianError, setOpenAccordianError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePickerError, setShowDatePickerError] = useState(null);

  const [budget, setBudget] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const [ItemList, setItemList] = useState(SAMPLELIST);
  let scrollRef = useRef(null);

  const handleSave = (item) => {
    // handle form submit here
    // Keyboard.dismiss();
    setItemList([...ItemList, item]);
    setModalVisible(false);
  };

  const scrollToPos = (itemIndex) => {
    scrollRef.current.scrollTo({ y: itemIndex * 70 });
  };

  const handleLogin = () => {
    // Handle login logic here
  };

  const handleSubmit = () => {
    // handle form submission logic
    scrollToPos(0);
    setOpenAccordian("2");
  };

  const updateAccordian = (selectedIndex) => {
    // Keyboard.dismiss();
    if (selectedIndex != openAccordian) {
      setOpenAccordian(selectedIndex);
    } else {
      setOpenAccordian(0);
    }
  };

  const updateSecondAccordian = (selectedIndex) => {
    // Keyboard.dismiss();
    if (selectedIndex != openAccordian2) {
      setOpenAccordian2(selectedIndex);
    } else {
      setOpenAccordian2(0);
    }
  };

  const data = [
    {
      id: 1,
      categoryName: "General Appearance",
      organizationId: 1,
      status: "Active",
      subCategory: [
        {
          id: 3,
          categoryid: 1,
          subcategoryName: "Interior",
          status: "Active",
          questions: [
            {
              id: 15,
              subCategoryId: 3,
              question: "Gas-brake-clutch pedals",
              status: "Active",
            },
            {
              id: 20,
              subCategoryId: 3,
              question: "Odometer mileage",
              status: "Active",
            },
            {
              id: 22,
              subCategoryId: 3,
              question: "Operation of windows",
              status: "Active",
            },
            {
              id: 24,
              subCategoryId: 3,
              question: "Seat belts",
              status: "Active",
            },
            {
              id: 14,
              subCategoryId: 3,
              question: "Emergency brake",
              status: "Active",
            },
            {
              id: 26,
              subCategoryId: 3,
              question: "Sun roof",
              status: "Active",
            },
            {
              id: 19,
              subCategoryId: 3,
              question: "Mirrors",
              status: "Active",
            },
            {
              id: 18,
              subCategoryId: 3,
              question: "Hood release (if applicable)",
              status: "Active",
            },
            {
              id: 16,
              subCategoryId: 3,
              question: "Gauges",
              status: "Active",
            },
            {
              id: 13,
              subCategoryId: 3,
              question: "Dash board",
              status: "Active",
            },
            {
              id: 25,
              subCategoryId: 3,
              question: "Seats",
              status: "Active",
            },
            {
              id: 17,
              subCategoryId: 3,
              question: "Head liner",
              status: "Active",
            },
            {
              id: 21,
              subCategoryId: 3,
              question: "Operation of doors",
              status: "Active",
            },
            {
              id: 23,
              subCategoryId: 3,
              question: "Rugs and mats",
              status: "Active",
            },
            {
              id: 27,
              subCategoryId: 3,
              question: "Sun visors",
              status: "Active",
            },
          ],
          category_id: 1,
        },
        {
          id: 1,
          categoryid: 1,
          subcategoryName: "Engine",
          status: "Active",
          questions: [
            {
              id: 3,
              subCategoryId: 1,
              question: "Emissions test",
              status: "Active",
            },
            {
              id: 4,
              subCategoryId: 1,
              question: "Hoses",
              status: "Active",
            },
            {
              id: 6,
              subCategoryId: 1,
              question: "Radiator coolant",
              status: "Active",
            },
            {
              id: 5,
              subCategoryId: 1,
              question: "Oil",
              status: "Active",
            },
            {
              id: 1,
              subCategoryId: 1,
              question: "Belts",
              status: "Active",
            },
            {
              id: 2,
              subCategoryId: 1,
              question: "Cleanliness",
              status: "Active",
            },
            {
              id: 7,
              subCategoryId: 1,
              question: "Transmission fluid",
              status: "Active",
            },
          ],
          category_id: 1,
        },
        {
          id: 5,
          categoryid: 1,
          subcategoryName: "Underneath Vehicle",
          status: "Active",
          questions: [
            {
              id: 31,
              subCategoryId: 5,
              question: "Exhaust pipe",
              status: "Active",
            },
            {
              id: 34,
              subCategoryId: 5,
              question: "Tire tread",
              status: "Active",
            },
            {
              id: 33,
              subCategoryId: 5,
              question: "Shock absorbers/struts",
              status: "Active",
            },
            {
              id: 32,
              subCategoryId: 5,
              question: "Floor boards",
              status: "Active",
            },
          ],
          category_id: 1,
        },
        {
          id: 4,
          categoryid: 1,
          subcategoryName: "Trunk",
          status: "Active",
          questions: [
            {
              id: 28,
              subCategoryId: 4,
              question: "Floor covering",
              status: "Active",
            },
            {
              id: 29,
              subCategoryId: 4,
              question: "Rust/holes",
              status: "Active",
            },
            {
              id: 30,
              subCategoryId: 4,
              question: "Spare tire",
              status: "Active",
            },
          ],
          category_id: 1,
        },
        {
          id: 2,
          categoryid: 1,
          subcategoryName: "Exterior",
          status: "Active",
          questions: [
            {
              id: 8,
              subCategoryId: 2,
              question: "Body rust",
              status: "Active",
            },
            {
              id: 12,
              subCategoryId: 2,
              question: "Scrapes",
              status: "Active",
            },
            {
              id: 9,
              subCategoryId: 2,
              question: "Condition of paint",
              status: "Active",
            },
            {
              id: 11,
              subCategoryId: 2,
              question: "Missing or broken parts",
              status: "Active",
            },
            {
              id: 10,
              subCategoryId: 2,
              question: "Dents",
              status: "Active",
            },
          ],
          category_id: 1,
        },
      ],
    },
    {
      id: 2,
      categoryName: "In the Drivers Seat",
      organizationId: 1,
      status: "Active",
      subCategory: [
        {
          id: 6,
          categoryid: 2,
          subcategoryName: "NA",
          status: "Active",
          questions: [
            {
              id: 35,
              subCategoryId: 6,
              question: "Air conditioning",
              status: "Active",
            },
            {
              id: 36,
              subCategoryId: 6,
              question: "Brakes",
              status: "Active",
            },
            {
              id: 45,
              subCategoryId: 6,
              question: "Motor idle",
              status: "Active",
            },
            {
              id: 49,
              subCategoryId: 6,
              question: "Seat movement control",
              status: "Active",
            },
            {
              id: 37,
              subCategoryId: 6,
              question: "Front and rear defrost",
              status: "Active",
            },
            {
              id: 43,
              subCategoryId: 6,
              question: "Head lights",
              status: "Active",
            },
            {
              id: 38,
              subCategoryId: 6,
              question: "Gauges/warning lights",
              status: "Active",
            },
            {
              id: 53,
              subCategoryId: 6,
              question: "Turn signals",
              status: "Active",
            },
            {
              id: 40,
              subCategoryId: 6,
              question: "Fuel",
              status: "Active",
            },
            {
              id: 41,
              subCategoryId: 6,
              question: "Oil pressure",
              status: "Active",
            },
            {
              id: 46,
              subCategoryId: 6,
              question: "Power windows/mirrors",
              status: "Active",
            },
            {
              id: 44,
              subCategoryId: 6,
              question: "Heater and heater fan",
              status: "Active",
            },
            {
              id: 52,
              subCategoryId: 6,
              question: "Tachometer",
              status: "Active",
            },
            {
              id: 39,
              subCategoryId: 6,
              question: "Battery",
              status: "Active",
            },
            {
              id: 48,
              subCategoryId: 6,
              question: "Seat belts",
              status: "Active",
            },
            {
              id: 51,
              subCategoryId: 6,
              question: "Steering wheel tilt",
              status: "Active",
            },
            {
              id: 50,
              subCategoryId: 6,
              question: "Speedometer",
              status: "Active",
            },
            {
              id: 47,
              subCategoryId: 6,
              question: "Radio/cassette/CD",
              status: "Active",
            },
            {
              id: 42,
              subCategoryId: 6,
              question: "Temperature",
              status: "Active",
            },
          ],
          category_id: 2,
        },
      ],
    },
    {
      id: 3,
      categoryName: "During Your Test Drive",
      organizationId: 1,
      status: "Active",
      subCategory: [
        {
          id: 7,
          categoryid: 3,
          subcategoryName: "NA",
          status: "Active",
          questions: [
            {
              id: 59,
              subCategoryId: 7,
              question: "Tire noises",
              status: "Active",
            },
            {
              id: 60,
              subCategoryId: 7,
              question: "Wheel alignment",
              status: "Active",
            },
            {
              id: 54,
              subCategoryId: 7,
              question: "Cruise control",
              status: "Active",
            },
            {
              id: 56,
              subCategoryId: 7,
              question: "Smoothness of acceleration",
              status: "Active",
            },
            {
              id: 57,
              subCategoryId: 7,
              question: "Tachometer operation",
              status: "Active",
            },
            {
              id: 55,
              subCategoryId: 7,
              question: "Odometer/speedometer",
              status: "Active",
            },
            {
              id: 58,
              subCategoryId: 7,
              question: "Temperature gauge/light",
              status: "Active",
            },
          ],
          category_id: 3,
        },
      ],
    },
    {
      id: 4,
      categoryName: "Vehicle Exterior",
      organizationId: 1,
      status: "Active",
      subCategory: [
        {
          id: 8,
          categoryid: 4,
          subcategoryName: "NA",
          status: "Active",
          questions: [
            {
              id: 67,
              subCategoryId: 8,
              question: "Running board",
              status: "Active",
            },
            {
              id: 68,
              subCategoryId: 8,
              question: "Rear Pannel",
              status: "Active",
            },
            {
              id: 63,
              subCategoryId: 8,
              question: "Fender",
              status: "Active",
            },
            {
              id: 70,
              subCategoryId: 8,
              question: "Tyre grove",
              status: "Active",
            },
            {
              id: 66,
              subCategoryId: 8,
              question: "Rear Door",
              status: "Active",
            },
            {
              id: 61,
              subCategoryId: 8,
              question: "Bumper",
              status: "Active",
            },
            {
              id: 69,
              subCategoryId: 8,
              question: "Roof pannel",
              status: "Active",
            },
            {
              id: 64,
              subCategoryId: 8,
              question: "Door",
              status: "Active",
            },
            {
              id: 62,
              subCategoryId: 8,
              question: "Hood pannel",
              status: "Active",
            },
            {
              id: 65,
              subCategoryId: 8,
              question: "Pailar",
              status: "Active",
            },
          ],
          category_id: 4,
        },
      ],
    },
  ];
  const [sampleData, setSampleData] = useState([]);

  useEffect(() => {
    if (route.params) {
      console.log("route.params", route.params);
      setSampleData(route.params.list);
    }
  }, [route.params]);
  
  const editCheckList = (index, innerIndex, editIndex, text) => {
    const temp = sampleData;
    temp[index].subCategory[innerIndex].questions[editIndex].value = text;
    setSampleData(temp);
  };

  return (
    <View style={[{ flex: 1 }]}>
      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        value={new Date(Date.now())}
        onChange={(event, selectedDate) => {}}
        onRequestClose={() => setShowDatePicker(false)}
      />
      <DropDownComponant
        visible={showDropDown}
        headerTitle={dropDownTitle}
        data={[]}
        onRequestClose={() => setShowDropDown(false)}
        selectedItems={(item) => {}}
      />
      <ImagePickerComponent
        visible={showImagePicker}
        selectedImage={(data, keyId) => {}}
        onDismiss={() => {
          setShowImagePicker(false);
        }}
      />
      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
        }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
      >
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 10,
            paddingHorizontal: 5,
          }}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          ref={scrollRef}
        >
          <View style={{ marginHorizontal: 10 }}>
            <List.AccordionGroup
              expandedId={openAccordian}
              onAccordionPress={(expandedId) => updateAccordian(expandedId)}
            >
              {sampleData.map((item, index) => {
                return (
                  <List.Accordion
                    id={item.id.toString()}
                    key={item.id.toString()}
                    title={item.categoryName}
                    titleStyle={{
                      color:
                        openAccordian === item.id.toString()
                          ? Colors.BLACK
                          : Colors.BLACK,
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                    style={[
                      {
                        backgroundColor:
                          openAccordian === item.id.toString()
                            ? Colors.RED
                            : Colors.WHITE,
                        height: 60,
                      },
                      styles.accordianBorder,
                    ]}
                  >
                    <View
                      style={{
                        marginHorizontal: 10,
                      }}
                    >
                      <List.AccordionGroup
                        expandedId={openAccordian2}
                        onAccordionPress={(expandedId) =>
                          updateSecondAccordian(expandedId)
                        }
                      >
                        {item.subCategory.map((innerItem, innerIndex) => {
                          return (
                            <List.Accordion
                              id={innerItem.id.toString()}
                              key={innerItem.id.toString()}
                              title={innerItem.subcategoryName}
                              titleStyle={{
                                color:
                                  openAccordian2 === innerItem.id.toString()
                                    ? Colors.BLACK
                                    : Colors.BLACK,
                                fontSize: 15,
                                fontWeight: "500",
                              }}
                              style={[
                                {
                                  backgroundColor:
                                    openAccordian2 === innerItem.id.toString()
                                      ? Colors.RED
                                      : Colors.WHITE,
                                  height: 60,
                                },
                                styles.accordianBorder2,
                              ]}
                            >
                              <View>
                                <TableView
                                  data={innerItem}
                                  onChangeText={(editItem) => {
                                    editCheckList(
                                      index,
                                      innerIndex,
                                      editItem.index,
                                      editItem.text
                                    );
                                  }}
                                />
                              </View>
                            </List.Accordion>
                          );
                        })}
                      </List.AccordionGroup>
                    </View>
                  </List.Accordion>
                );
              })}
            </List.AccordionGroup>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <LocalButtonComp
                title={"Save as Draft"}
                onPress={() => { navigation.navigate(MyTasksStackIdentifiers.evaluation, {
                 checkListData: sampleData
                });}}
                disabled={false}
                color={Colors.GRAY}
              />
              {/* <LocalButtonComp
                title={"Submit"}
                onPress={() => {
                  console.log(JSON.stringify(sampleData));
                }}
                disabled={false}
              /> */}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CheckListScreen;

const styles = StyleSheet.create({
  accordianBorder: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "#7a7b7d",
    justifyContent: "center",
    marginVertical: 3,
  },
  accordianBorder2: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "#7a7b7d",
    justifyContent: "center",
    marginVertical: 3,
  },
  textInputStyle: {
    height: 50,
    width: "100%",
    marginVertical: 2,
    paddingLeft: 10,
    paddingRight: 10,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    padding: 16,
    // borderWidth: 1,
    width: "100%",
    height: 50,
    borderRadius: 5,
    paddingLeft: 25,
    paddingRight: 25,
    marginVertical: 10,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  table: {
    width: "100%",
    marginTop: 20,
  },
  column: {
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    marginHorizontal: 5,
  },
});
