import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { EmsStackIdentifiers } from '../../../navigations/appNavigator';
import { getTaskThreeSixtyHistory ,clearState} from '../../../redux/taskThreeSixtyReducer';
import { Colors, GlobalStyle } from '../../../styles';

const TaskThreeSixtyHistory = (props) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.taskThreeSixtyReducer);

  const [activeIndex, setActiveIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyFiltered, setHistoryFiltered] = useState([]);

  // useEffect(() => {
  //   getAllHistory();
  //   return dispatch(clearState())
  // }, []);
  useEffect(() => {
    props.navigation.addListener("focus", () => {
      setHistory([])
      // dispatch(clearState())
      props.rout
      getAllHistory();
    });

    props.navigation.setOptions({
      headerTitle: checkForTaskNames(props.route.params.title)
    });
 
  }, [props.navigation]);

  const getAllHistory = () => {
    // dispatch(
    //   getTaskThreeSixtyHistory("18-286-e9d92b0e-09d8-4da7-946f-c2c6470a3f0b")
    // );
    dispatch(getTaskThreeSixtyHistory(props.route.params.universalId));
  };

  
  
  useEffect(() => {
  
    if (selector.taskThreeSixtyHistory.length) {
      if (activeIndex == 0) checkThisWeek();
      if (activeIndex == 1) checkCurrentMonth();
      if (activeIndex == 2) checkCurrentYear();
      if (activeIndex == 3) allHistory();
    }
  }, [activeIndex, selector.taskThreeSixtyHistory]);

  const checkThisWeek = () => {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDay = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );
    setHistoryData(firstDay, lastDay);
  };
  
  const checkCurrentMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setHistoryData(firstDay, lastDay);
  };

  const checkCurrentYear = () => {
    const currentYear = new Date().getFullYear();
    const firstDay = new Date(currentYear, 0, 1);
    const lastDay = new Date(currentYear, 11, 31);
    setHistoryData(firstDay, lastDay);
  };
  
  const allHistory = () => {
   
    const temp = selector.taskThreeSixtyHistory.filter(item => {
     
      return item.taskName === props.route.params.title
    })
    setHistoryFiltered(temp)
   
    setHistory(Object.assign(temp));
  };

  const setHistoryData = (firstDate, lastDate) => {
    // let tmpArray = [];
    // for (let i = 0; i < selector.taskThreeSixtyHistory.length; i++) {
    //   if (
    //     selector.taskThreeSixtyHistory[i].taskUpdatedTime > firstDate &&
    //     selector.taskThreeSixtyHistory[i].taskUpdatedTime < lastDate
    //   ) {
    //     tmpArray.push(selector.taskThreeSixtyHistory[i]);
    //   }
    // }
     // setHistory(Object.assign(tmpArray));


    const temp = selector.taskThreeSixtyHistory.filter(item => {
    
      return item.taskName === props.route.params.title
    })
    setHistoryFiltered(temp)
   
      let tmpArray = [];
    for (let i = 0; i < temp.length; i++) {
      if (
        temp[i].taskUpdatedTime > firstDate &&
        temp[i].taskUpdatedTime < lastDate
      ) {
        tmpArray.push(temp[i]);
      }
    }
    setHistory(Object.assign(tmpArray));
   
  };

  const renderTitles = ({ item, index }) => {
    let isActive = index == activeIndex;
    return (
      <TouchableOpacity
        style={[
          styles.titleContainer,
          isActive ? styles.activeTitleContainer : null,
        ]}
        activeOpacity={1}
        onPress={() => setActiveIndex(index)}
      >
        <Text
          style={[styles.titleText, isActive ? styles.activeTitleText : null]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const checkForTaskNames = (taskName) => {
    if (taskName.includes("Pre Enquiry")) {
      taskName = taskName.replace("Pre Enquiry", "Contacts");
    } else if (taskName.includes("Pre Booking")) {
      taskName = taskName.replace("Pre Booking", "Booking Approval");
    }
    return taskName;
  };

  const renderList = ({ item, index }) => {
    const taskNameView = (taskName) => {
      const name = checkForTaskNames(taskName);
      return (
        // <Text style={styles.taskNameText} numberOfLines={2}>
        //   {`${name} ${
        //     item?.taskUpdatedBy?.designationName
        //       ? `- ${item?.taskUpdatedBy?.designationName}`
        //       : ""
        //   } `}
        // </Text>
        <Text style={styles.taskNameText} numberOfLines={2}>
          {`${
            item?.taskUpdatedBy?.hrmsRole
            ? `${item?.taskUpdatedBy?.hrmsRole}`
              : ""
          } `}
        </Text>
      );
    };

    const date = moment(item.taskUpdatedTime)
      .format("DD/MM/YY h:mm a")
      .split(" ");

    let topBcgColor = Colors.LIGHT_GRAY;
    let bottomBcgColor = Colors.LIGHT_GRAY;
    const temp = selector.taskThreeSixtyHistory.filter(item => {
      
      return item.taskName === props.route.params.title
    })
    if (temp[index - 1] !== undefined) {
      topBcgColor = Colors.GRAY;
    }

    if (temp[index + 1] !== undefined) {
      bottomBcgColor = Colors.GRAY;
    }

    return (
      <View style={styles.listBoxContainer}>
        <View style={styles.dateTimeContainer}>
          <View
            style={[
              styles.progressLine,
              {
                backgroundColor: topBcgColor,
              },
            ]}
          />
          <View
            style={[
              styles.progressLine,
              {
                backgroundColor: bottomBcgColor,
              },
            ]}
          />
          <View style={styles.dateTimeProgressContainer}>
            <View style={styles.squareBox} />
            <Text
              style={styles.dateTimeText}
            >{`${date[0]}\n${date[1]} ${date[2]}`}</Text>
          </View>
        </View>

        <View style={styles.taskMainContainer}>
          <View style={styles.taskContainer}>
            {taskNameView(item?.taskName)}

            <View style={{ flexDirection: "column" }}>
              <View style={styles.view6}>
                <Text
                  style={styles.txt5}
                >
                  {"Reason: "}
                </Text>
                <Text
                  style={styles.txt3}
                >
                  {item?.reason ?? ""}
                </Text>

              </View>
              <View style={styles.view6}>
                <Text
                  style={styles.txt5}
                >
                  {"Customer Remarks: "}
                </Text>
                <Text
                  style={styles.txt3}
                >
                  {item?.customerRemarks ?? ""}
                </Text>

              </View>
              <View style={styles.view6}>
                <Text
                  style={styles.txt5}
                >
                  {"Employee Remarks: "}
                </Text>
                <Text
                  style={styles.txt3}
                >
                  {item?.employeeRemarks ?? ""}
                </Text>

              </View>
             
            

            </View>
            
            
            {/* {item?.taskUpdatedBy?.empName ? (
              <Text style={styles.followUpText}>
                Follow-up by: {item.taskUpdatedBy.empName}
              </Text>
            ) : null}
            <Text style={styles.remarksText}>
              {"Remarks: " + (item?.employeeRemarks ?? "")}
            </Text> */}
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyList = () => {
    return (
      <View style={styles.emptyContainer}>
        {selector.isLoading ? (
          <ActivityIndicator
            animating={true}
            color={Colors.GRAY}
            size={"small"}
          />
        ) : (
          <Text style={styles.noDataText}>No History Found</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTitleRow}>
        <FlatList
          data={["This Week", "Current Month", "Current Year", "History"]}
          horizontal={true}
          renderItem={renderTitles}
          contentContainerStyle={styles.titleRow}
          bounces={false}
        />
        {/* <IconButton
          icon="filter-outline"
          style={{ padding: 0, margin: 0 }}
          color={Colors.BLACK}
          size={20}
          onPress={() => {
            props.navigation.navigate(EmsStackIdentifiers.task360HistoryFilter, {
              isFromLogin: false,
              fromScreen: "TASK360_HISTORY",
            });
          }}
        /> */}
      </View>

      <FlatList
        data={history}
        renderItem={renderList}
        ListEmptyComponent={renderEmptyList()}
        refreshControl={
          <RefreshControl
            refreshing={selector.isLoading}
            tintColor={[Colors.GRAY]}
            colors={[Colors.GRAY]}
            onRefresh={() => getAllHistory()}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  boxContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    marginHorizontal: 10,
    marginVertical: 15,
    marginTop: 20,
  },
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "2%",
    paddingVertical: 8,
    borderBottomColor: Colors.RETAIL_BORDER_COLOR,
    borderBottomWidth: 2,
  },
  titleRow: {
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 30,
    width: "95%",
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
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
    fontSize: 10,
    paddingHorizontal: "2%",
    fontWeight: "600",
  },
  activeTitleText: {
    color: Colors.WHITE,
    fontSize: 11,
  },

  listBoxContainer: {
    flexDirection: "row",
    marginHorizontal: 4,
    marginLeft: 10,
  },
  dateTimeContainer: {
    width: "25%",
    justifyContent: "center",
  },
  progressLine: {
    marginLeft: 8,
    flex: 1,
    width: 2,
  },
  dateTimeProgressContainer: {
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
  },
  squareBox: {
    height: 20,
    width: 20,
    backgroundColor: Colors.GRAY,
  },
  dateTimeText: {
    color: Colors.GRAY,
    fontSize: 12,
    marginLeft: 5,
  },

  taskMainContainer: { padding: 5, width: "75%" },
  taskContainer: {
    paddingVertical: 5,
    paddingLeft: 10,
    justifyContent: "center",
    ...GlobalStyle.shadow,
    backgroundColor: Colors.WHITE,
  },
  taskNameText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
    margin: 5
  },
  sideTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  assigneeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 5,
    // flex: 1
  },
  assigneeTextV2: {
    fontSize: 14,
    fontWeight: "400",
    color:Colors.GRAY_LIGHT,
    // marginVertical:5  ,
    flex:1
  },
  followUpText: {
    fontSize: 14,
    fontWeight: "400",
    marginVertical: 3,
  },
  remarksText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.GRAY,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: Dimensions.get("window").height/2
  },
  noDataText: {
    fontWeight: "600",
    fontSize: 14,
  },
  txt5: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.GRAY,
    flex: 1
  },
  view4: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  view5: {
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
  },
  view2: {
    width: "100%",
    flexDirection: "row",
  },
  view3: {
    width: "25%",
    justifyContent: "center",
  },
  txt2: {
    fontSize: 12,
    fontWeight: "400",
  },
  txt3: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.BLACK,
    flex: 1
  },
  view6: { flexDirection: "row", margin: 5 }
});

export default TaskThreeSixtyHistory;