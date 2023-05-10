import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, LogBox } from 'react-native'
import { Colors } from '../../../styles';
import * as AsyncStore from '../../../asyncStore';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import ArrowIcon from "react-native-vector-icons/FontAwesome";
import { getLeaderBoardList, getLeaderBoardListWithoutFilter } from "../../../redux/homeReducer";
import { DropDownComponant, LoaderComponent } from '../../../components';
import moment from 'moment';
import { showToast } from '../../../utils/toast';
import { DropDownSelectionItem, DropDownSelectionItemV3 } from '../../../pureComponents';
import { IconButton, Searchbar } from "react-native-paper";
import { HomeStackIdentifiers } from '../../../navigations/appNavigator';
import _ from 'lodash';

const dropdownData = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

const dropdownDataV2 = [
  { name: 'Top 5', id: 1 },
  { name: 'Top 10', id: 2 },
  { name: 'Top 15', id: 3 },
  { name: 'Top 20', id: 4 },
  { name: 'View all', id: 5 },


];

export default function leaderBoardScreen(props) {
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [showTop5View, setShowTop5View] = useState(false);
  const [showBottom5View, setShowBottom5View] = useState(false);
  const [groupDealerRank, setGroupDealerRank] = useState(null);
  const [groupDealerCount, setGroupDealerCount] = useState(null);
  const [top5RankList, setTop5RankList] = useState([]);
  const [topRankList, setTopRankList] = useState([]);
  const [bottom5RankList, setBottom5RankList] = useState([]);
  const [loggedInEmpId, setLoggedInEmpId] = useState(0);
  const [reversebottomRankList, setReverseBottomRankList] = useState([]);
  const [selectedRankTop, setselectedRankTop] = useState({
    name: "Top",
    id: 1,
  });
  const [selectedRankLow, setselectedRankLow] = useState({
    name: "Low",
    id: 1,
  });
  const [showDropDownModel, setShowDropDownModel] = useState(false);

  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [userData, setUserData] = useState({
    orgId: "",
    employeeId: "",
    employeeName: "",
    isManager: false,
    editEnable: false,
    isPreBookingApprover: false,
    isSelfManager: ""
  });

  useEffect(() => {
   

      getUserData();
  }, [])

  useEffect(() => {
    // props.navigation.addListener("focus", () => {
    // if(props?.route?.params){
    
    //   let selectedid = props.route.params.params.selectedID
    //   let deladerID = props.route.params.params.dealeid
    //   getLeaderboardListFromServer(selectedid, deladerID)
    // }
      
      if (!_.isEmpty(selector.filter_leadership_selectedDesignation_name)){
        let selectedid = selector.filter_leadership_selectedDesignation_name.selectedID;
        let deladerID = selector.filter_leadership_selectedDesignation_name.dealeid;
        getLeaderboardListFromServer(selectedid, deladerID)
      }else{
        getLeaderboardListFromServerWithoutFilter();
      }
    // })

  }, [selector.filter_leadership_selectedDesignation_name])

  const getUserData = async () => {
    try {
      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
    

      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);

        let isManager = false,
          editEnable = false;
        let isPreBookingApprover = false;
        // if (
        //   jsonObj.hrmsRole === "MD" ||
        //   jsonObj.hrmsRole === "General Manager" ||
        //   jsonObj.hrmsRole === "Manager" ||
        //   jsonObj.hrmsRole === "Sales Manager" ||
        //   jsonObj.hrmsRole === "branch manager"
        // ) {
        //   isManager = true;
        // }
        if (jsonObj?.isTeam.toLowerCase().includes("y")) {
          isManager = true;
        } 
        if (jsonObj.roles.includes("PreBooking Approver")) {

          editEnable = true;
          isPreBookingApprover = true;
        }
        setUserData({
          orgId: jsonObj.orgId,
          employeeId: jsonObj.empId,
          employeeName: jsonObj.empName,
          isManager: isManager,
          editEnable: editEnable,
          isPreBookingApprover: isPreBookingApprover,
          isSelfManager: jsonObj.isSelfManager
        });
      

        if(isManager){
          props.navigation.setOptions(
            {
              headerTitleStyle: {
                fontSize: 16,
                fontWeight: "600",
              },
              headerStyle: {
                backgroundColor: Colors.DARK_GRAY,
              },
              headerTintColor: Colors.WHITE,
              headerBackTitleVisible: false,
              headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* <SearchIcon /> */}
                  <MyTaskFilter navigation={props.navigation} />

                </View>
              ),
            });
        }else{
          props.navigation.setOptions(
            {
              headerTitleStyle: {
                fontSize: 16,
                fontWeight: "600",
              },
              headerStyle: {
                backgroundColor: Colors.DARK_GRAY,
              },
              headerTintColor: Colors.WHITE,
              headerBackTitleVisible: false,
              
             
            });
        }
       
      }
    } catch (error) {
      alert(error);
    }
  };


  const MyTaskFilter = ({ navigation }) => {
    const screen = useSelector((state) => state.mytaskReducer.currentScreen);
    if (screen === "TODAY") return <React.Fragment></React.Fragment>;
    return (
      <IconButton
        icon="filter-outline"
        style={{ paddingHorizontal: 0, marginHorizontal: 0 }}
        color={Colors.WHITE}
        size={25}
        onPress={() => {
          navigation.navigate(HomeStackIdentifiers.laderfilterScreen_new, {
            isFromLogin: false,
            fromScreen: "DEALER_RANK",
          });
        }
        }
      />
    );
  };

  useEffect(async () => {
    LogBox.ignoreAllLogs();
    let employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (jsonObj && jsonObj.empId) {
        setLoggedInEmpId(jsonObj.empId);
      }
      if (selector.allGroupDealerData.length > 0) {
        let tempArr = [],
          allArray = selector.allGroupDealerData;
        setGroupDealerCount(selector.allGroupDealerData.length);
        tempArr = allArray.filter((item) => {
          return item.empId === jsonObj.empId;
        });
        if (tempArr.length > 0) {
          setGroupDealerRank(tempArr[0].rank);
        } else {
        }
      }
    }
  }, []);

  useEffect(() => {

    if (selector.leaderboard_list && selector.leaderboard_list.length > 0) {
      let top = selector.leaderboard_list;
      let bottom = [];
      bottom = selector.leaderboard_list;
      setTimeout(() => {
        setTopRankList(top);
        setTop5RankList(top.slice(0, 5));
      }, 500);

      setTimeout(() => {
        setBottom5RankList([...bottom].reverse().slice(0, 5));
        setReverseBottomRankList([...bottom].reverse());
      }, 500);
    }


  }, [selector.leaderboard_list])


  const getLeaderboardListFromServerWithoutFilter = async () => {

    var date = new Date();
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    const jsonObj = await JSON.parse(employeeData);
    // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
    // let branName = "";
    // await AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_NAME).then((branchName) => {
    //   if (branchName) {

    //     branName = branchName;
    //   }
    // });
    let payload = {
      "endDate": endOfMonth,
      "levelSelected": null,
      "loggedInEmpId":jsonObj.empId,
      "pageNo": 0,
      "size": 50,
      "startDate": startOfMonth,
      "orgId": jsonObj.orgId,
      // "branchId": deladerID ? deladerID[0] : branName
    };
    // alert(JSON.stringify(payload))
    dispatch(getLeaderBoardListWithoutFilter(payload));
  }

  const getLeaderboardListFromServer = async (loogedInid, deladerID) => {
   
    var date = new Date();
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    const jsonObj = await JSON.parse(employeeData);
    // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
    let branName= "";
    await AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_NAME).then((branchName) => {
      if (branchName) {
       
        branName = branchName;
      }
    });
    let payload = {
      "endDate": endOfMonth,
      "levelSelected": null,
      // "loggedInEmpId": loogedInid ? loogedInid :jsonObj.empId,
      "loggedInEmpId":  jsonObj.empId,
      "pageNo": 0,
      "size": 50,
      "startDate": startOfMonth,
      "orgId": jsonObj.orgId,
      "branchIds": deladerID ? deladerID : branName,
      "designationNames": loogedInid ? loogedInid: []
    };
    // alert(JSON.stringify(payload))
    dispatch(getLeaderBoardList(payload));
  }

  useEffect(async () => {
    LogBox.ignoreAllLogs();
    // alert(JSON.stringify(topRankList))
    // if(topRankList && topRankList.length > 1)
    // getLeaderboardListFromServer();
    // getLeaderboardListFromServerWithoutFilter();

    let top = selector.leaderboard_list;
    let bottom = [];
    bottom = selector.leaderboard_list;
    setTimeout(() => {
      setTopRankList(top);
      setTop5RankList(top.slice(0, 5));
    }, 500);

    setTimeout(() => {
      setBottom5RankList([...bottom].reverse().slice(0, 5));
      setReverseBottomRankList([...bottom].reverse());
    }, 500);
  }, []);

  const renderTableTopRow = () => {
    return (
      <View style={styles.tableTitleRow}>
        <Text style={styles.tableTitleText}>Rank</Text>
        <Text style={styles.tableTitleText}>Branch</Text>
        <Text style={styles.tableTitleText}>Name</Text>
     
        
        <Text style={styles.tableTitleText}>Retail</Text>
        <Text style={styles.tableTitleText}>Ret T/A%</Text>
      </View>
    );
  };

  const renderViewAll = (type) => {
    return (
      <TouchableOpacity
        style={styles.viewAllContainer}
        onPress={() => {
          if (type == "top") {
            setShowTop5View(!showTop5View);
          } else {
            setShowBottom5View(!showBottom5View);
          }
        }}
      >
        <Text style={styles.viewAllText}>
          {type == "top"
            ? showTop5View
              ? "View Less"
              : "View All"
            : showBottom5View
              ? "View Less"
              : "View All"}
        </Text>
      </TouchableOpacity>
    );
  }

  const renderListItem = (item, extraIndex) => {
   
    let isActive = item.empId == loggedInEmpId && !selector.isRankHide;
    return (
      <View style={isActive ? styles.activeSubRow : styles.tableSubRow}>
        <View style={styles.itemRow}>
          <Text style={isActive ? styles.activeItemRowText : styles.itemRowText}>{item.rank}</Text>
          <Text style={isActive ? styles.activeItemRowText : styles.itemRowText}>
            {getBranchName(item.branchCode)}
          </Text>
          <Text style={isActive ? styles.activeItemRowText : styles.itemRowText}>{getEmpName(item.empName)}</Text>
          <Text style={isActive ? styles.activeItemRowText : styles.itemRowText}>{item.targetAchivements}</Text>
          <Text style={isActive ? styles.activeItemRowText : styles.itemRowText}>{item.achivementPerc}</Text>
        </View>
      </View>
    );
  };

  const getEmpName = (value) => {
    let name = value;
    // name = name.split(" ");
    // return name[0];
    return name;
  };

  const getBranchName = (value) => {
    let branch = value;
    branch = branch.split("-");
    return branch[0].trim();
  };


  const showDropDownModelMethod = (key, headerText) => {
    // Keyboard.dismiss();
    let dropdownDataV3 = [

    ];
    switch (key) {
      case "TOP_DATA":
        if (selector.leaderboard_list.length <= 5) {

          let tmp = {
            name: "Top 5",
            id: 1
          }
          dropdownDataV3.push(tmp);

          setDataForDropDown([...dropdownDataV3]);
        } else if (selector.leaderboard_list.length >= 6 && selector.leaderboard_list.length <= 10) {
          let tmp = [{
            name: "Top 5",
            id: 1
          }, {
            name: "Top 10",
            id: 2
          },
          ]
          for (let i = 0; i < tmp.length; i++) {
            dropdownDataV3.push(tmp[i]);
          }
          // dropdownDataV3.push(tmp);

          setDataForDropDown([...dropdownDataV3]);
        } else if (selector.leaderboard_list.length >= 11 && selector.leaderboard_list.length <= 15) {
          let tmp = [{
            name: "Top 5",
            id: 1
          }, {
            name: "Top 10",
            id: 2
          }, {
            name: "Top 15",
            id: 3
          }
          ]

          for (let i = 0; i < tmp.length; i++) {
            dropdownDataV3.push(tmp[i]);
          }
          // let tmp = {
          //   name: "Top 15",
          //   id: 3
          // }
          // dropdownDataV3.push(tmp);

          setDataForDropDown([...dropdownDataV3]);
        } else if (selector.leaderboard_list.length >= 16 && selector.leaderboard_list.length <= 20) {

          let tmp = [{
            name: "Top 5",
            id: 1
          }, {
            name: "Top 10",
            id: 2
          }, {
            name: "Top 15",
            id: 3
          }, {
            name: "Top 20",
            id: 4
          }
          ]

          for (let i = 0; i < tmp.length; i++) {
            dropdownDataV3.push(tmp[i]);
          }
          // let tmp = {
          //   name: "Top 20",
          //   id: 4
          // }
          // dropdownDataV3.push(tmp);

          setDataForDropDown([...dropdownDataV3]);
        } else if (selector.leaderboard_list.length >= 21) {

          let tmp = [{
            name: "Top 5",
            id: 1
          }, {
            name: "Top 10",
            id: 2
          }, {
            name: "Top 15",
            id: 3
          }, {
            name: "Top 20",
            id: 4
          },
          {
            name: "View all",
            id: 5
          }
          ]

          for (let i = 0; i < tmp.length; i++) {
            dropdownDataV3.push(tmp[i]);
          }

          // let tmp = {
          //   name: "View all",
          //   id: 5
          // }
          // dropdownDataV3.push(tmp);

          setDataForDropDown([...dropdownDataV3]);
        }
        
        // setDataForDropDown([...dropdownDataV3]);
        break;
      case "LOW_DATA":

        if (selector.leaderboard_list.length <= 5) {

          let tmp = {
            name: "Low 5",
            id: 1
          }
          dropdownDataV3.push(tmp);

          setDataForDropDown([...dropdownDataV3]);
        } else if (selector.leaderboard_list.length >= 6 && selector.leaderboard_list.length <= 10) {
          // let tmp = {
          //   name: "Low 10",
          //   id: 2
          // }
          // dropdownDataV3.push(tmp);
          let tmp = [{
            name: "Low 5",
            id: 1
          }, {
            name: "Low 10",
            id: 2
          },
          ]
          for (let i = 0; i < tmp.length; i++) {
            dropdownDataV3.push(tmp[i]);
          }
          setDataForDropDown([...dropdownDataV3]);
        } else if (selector.leaderboard_list.length >= 11 && selector.leaderboard_list.length <= 15) {
          // let tmp = {
          //   name: "Low 15",
          //   id: 3
          // }
          // dropdownDataV3.push(tmp);
          let tmp = [{
            name: "Low 5",
            id: 1
          }, {
            name: "Low 10",
            id: 2
          },
          {
            name: "Low 15",
            id: 3
          }
          ]
          for (let i = 0; i < tmp.length; i++) {
            dropdownDataV3.push(tmp[i]);
          }
          setDataForDropDown([...dropdownDataV3]);
        } else if (selector.leaderboard_list.length >= 16 && selector.leaderboard_list.length <= 20) {
          // let tmp = {
          //   name: "Low 20",
          //   id: 4
          // }
          // dropdownDataV3.push(tmp);


          let tmp = [{
            name: "Low 5",
            id: 1
          }, {
            name: "Low 10",
            id: 2
          },
          {
            name: "Low 15",
            id: 3
          },
          {
            name: "Low 20",
            id: 4
          }
          ]
          for (let i = 0; i < tmp.length; i++) {
            dropdownDataV3.push(tmp[i]);
          }
          setDataForDropDown([...dropdownDataV3]);
        } else if (selector.leaderboard_list.length >= 21) {
          // let tmp = {
          //   name: "View all",
          //   id: 5
          // }
          // dropdownDataV3.push(tmp);

          let tmp = [{
            name: "Low 5",
            id: 1
          }, {
            name: "Low 10",
            id: 2
          },
          {
            name: "Low 15",
            id: 3
          },
          {
            name: "Low 20",
            id: 4
          },
          {
            name: "View all",
            id: 5
          }
          ]
          for (let i = 0; i < tmp.length; i++) {
            dropdownDataV3.push(tmp[i]);
          }


          setDataForDropDown([...dropdownDataV3]);
        }

        // setDataForDropDown([...dropdownDataV3]);
        break;

    }
    setDropDownKey(key);
    // setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  const setDataOnSelection = (from, selection) => {
    
    let top = selector.leaderboard_list;
    let bottom = [];
    bottom = selector.leaderboard_list;
    if (from === "TOP") {
      if (selection.id === 1) {
        setTimeout(() => {
          setTopRankList(top);
          setTop5RankList(top.slice(0, 5));
        }, 100);
      } else if (selection.id === 2) {
        setTimeout(() => {
          setTopRankList(top);
          setTop5RankList(top.slice(0, 10));
        }, 100);
      } else if (selection.id === 3) {
        setTimeout(() => {
          setTopRankList(top);
          setTop5RankList(top.slice(0, 15));
        }, 100);
      } else if (selection.id === 4) {
        setTimeout(() => {
          setTopRankList(top);
          setTop5RankList(top.slice(0, 20));
        }, 100);
      } else if (selection.id === 5) {
        setTimeout(() => {
          setTopRankList(top);
          setTop5RankList(top);
        }, 100);
      }
    } else {
      if (selection.id === 1) {
        setTimeout(() => {
          setBottom5RankList([...bottom].reverse().slice(0, 5));
          setReverseBottomRankList([...bottom].reverse());
        }, 100);
      } else if (selection.id === 2) {
        setTimeout(() => {

          setBottom5RankList([...bottom].reverse().slice(0, 10));
          setReverseBottomRankList([...bottom].reverse());
        }, 100);
      } else if (selection.id === 3) {
        setTimeout(() => {

          setBottom5RankList([...bottom].reverse().slice(0, 15));
          setReverseBottomRankList([...bottom].reverse());
        }, 100);
      } else if (selection.id === 4) {
        setTimeout(() => {

          setBottom5RankList([...bottom].reverse().slice(0, 20));
          setReverseBottomRankList([...bottom].reverse());
        }, 100);
      } else if (selection.id === 5) {
        setTimeout(() => {
          setBottom5RankList([...bottom].reverse());
          setReverseBottomRankList([...bottom].reverse());
        }, 100);
      }

    }

  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.rankBox}>

        <DropDownComponant
          visible={showDropDownModel}
          multiple={false}
          headerTitle={"Select"}
          data={dataForDropDown}
          onRequestClose={() => setShowDropDownModel(false)}
          selectedItems={(item) => {
            let newdata = { name: item.name, id: item.id };
            switch (dropDownKey) {
              case "TOP_DATA":
              
                setselectedRankTop(newdata)
                setDataOnSelection("TOP", newdata)
                // setselectedRank(newdata);
                break;
              case "LOW_DATA":
             
                setselectedRankLow(newdata)
                setDataOnSelection("LOW", newdata)
                // setselectedRank(newdata);
                break;

              default:
                break;
            }
            setShowDropDownModel(false);
          }}
        />

        {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <View style={styles.rankIconBox}>
              <Image
                style={styles.rankIcon}
                source={require("../../../assets/images/perform_rank.png")}
              />
            </View>
            <View
              style={{
                marginTop: 5,
                marginLeft: 3,
              }}
            >
              <Text style={styles.rankHeadingText}>Dealer Ranking</Text>
              {!selector.isRankHide && groupDealerRank !== null && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.rankText}>{groupDealerRank}</Text>
                  <Text style={styles.rankText}>
                    /
                  </Text>
                  <Text style={styles.rankText}>
                    {groupDealerCount}
                  </Text>
                </View>
              )}
            </View>
          </View> */}

        {/*} <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, justifyContent: 'space-around', width: '100%', padding: 10 }}>
                    <View style={styles.dropWrap} pointerEvents="none">
                        <Dropdown
                            style={[styles.dropdownContainer,]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={dropdownData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={'All Branches'}
                            searchPlaceholder="Search..."
                            renderRightIcon={() => (
                                <Image style={{ height: 5, width: 10 }} source={require('../../../assets/images/Polygon.png')} />
                            )}
                            onChange={async (item) => {}}
                        />
                    </View>

                    <View style={styles.dropWrap} pointerEvents="none">
                        <Dropdown
                            style={[styles.dropdownContainer,]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={dropdownData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={'Target Title'}
                            searchPlaceholder="Search..."
                            renderRightIcon={() => (
                                <Image style={{ height: 5, width: 10 }} source={require('../../../assets/images/Polygon.png')} />
                            )}
                            onChange={async (item) => {}}
                        />
                    </View>
                </View>
            */}
        {!selector.isLoading ? null : (
          <LoaderComponent
            visible={selector.isLoading}
            onRequestClose={() => { }}
          />
        )}
        {/* top 5 view */}
        <View>
          <View style={styles.titleContainer}>
            <View style={styles.titleIconContainer}>
              <View style={styles.topIconView}>
                <ArrowIcon name="long-arrow-up" color={"#447E56"} size={20} />
              </View>
            </View>
            {/* <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: "400" }}>
                Top 5 Ranks
              </Text> */}
            <View style={{ width: "30%", marginLeft: 15 }}>
              <DropDownSelectionItemV3
                // disabled={!isInputsEditable()}
                // label={"Top 5 Ranks"}
                value={selectedRankTop.name}
                onPress={() =>
                  showDropDownModelMethod(
                    "TOP_DATA",
                    ""
                  )
                }
              />
            </View>
          </View>

          <View
            style={[
              styles.tableContainer,
              { height: showTop5View ? 480 : 280 },
            ]}
          >
            {renderTableTopRow()}
            <FlatList
              data={showTop5View ? topRankList : top5RankList}
              nestedScrollEnabled={true}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => renderListItem(item, index)}
              showsVerticalScrollIndicator={false}
              maxToRenderPerBatch={5}
            />
            {renderViewAll("top")}
          </View>
        </View>

        {/* Low 5 view */}
        <View>
          <View style={styles.titleContainer}>
            <View
              style={[
                styles.titleIconContainer,
                { backgroundColor: "#FC827D" },
              ]}
            >
              <View style={styles.topIconView}>
                <ArrowIcon
                  name="long-arrow-down"
                  color={"#E40603"}
                  size={20}
                />
              </View>
            </View>
            {/* <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: "400" }}>
                Low 5 Ranks
              </Text> */}
            <View style={{ width: "30%", marginLeft: 15 }}>
              <DropDownSelectionItemV3
                // disabled={!isInputsEditable()}
                // label={"Top 5 Ranks"}
                value={selectedRankLow.name}
                onPress={() =>
                  showDropDownModelMethod(
                    "LOW_DATA",
                    ""
                  )
                }
              />
            </View>
          </View>

          <View
            style={[
              styles.tableContainer,
              { height: showBottom5View ? 480 : 280 },
            ]}
          >
            {renderTableTopRow()}
            <FlatList
              data={showBottom5View ? reversebottomRankList : bottom5RankList}
              nestedScrollEnabled={true}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => renderListItem(item, index)}
              showsVerticalScrollIndicator={false}
              maxToRenderPerBatch={5}
            />
            {renderViewAll("bottom")}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
  },
  titleIconContainer: {
    transform: [{ rotate: "45deg" }],
    width: 35,
    height: 35,
    borderRadius: 5,
    backgroundColor: "#BCE0BE",
    alignItems: "center",
    justifyContent: "center",
  },
  topIconView: { transform: [{ rotate: "315deg" }] },

  // table
  tableContainer: {
    width: "95%",
    borderWidth: 1,
    borderColor: "#d2d2d2",
    borderRadius: 7,
    overflow: "hidden",
    alignSelf: "center",
    backgroundColor: Colors.WHITE,
  },
  tableTitleRow: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: Colors.BLACK,
    backgroundColor: Colors.WHITE,
  },
  tableTitleText: {
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  tableSubRow: {
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderBottomWidth: 3,
    borderColor: "#F2F2F2",
    marginBottom: 3,
  },
  activeSubRow: {
    padding: 10,
    borderRadius: 4,
    marginBottom: 3,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderColor: Colors.PINK,
    backgroundColor: Colors.WHITE,
  },
  itemRow: { flexDirection: "row", width: "100%" },
  itemRowText: { color: "black", textAlign: "center", flex: 1 },
  activeItemRowText: { color: Colors.BLACK, textAlign: "center", flex: 1, fontWeight: "bold" },
  viewAllContainer: { alignSelf: "flex-end" },
  viewAllText: {
    color: "red",
    alignSelf: "flex-end",
    margin: 12,
    fontWeight: "600",
  },

  rankIconBox: {
    height: 50,
    width: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#d2d2d2",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  rankHeadingText: {
    fontSize: 17,
    fontWeight: "500",
  },
  rankText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.PINK
  },
  rankBox: {
    paddingTop: 5,
    paddingBottom: 10,
  },
  rankIcon: { width: 35, height: 35 },
  dropdownContainer: {
    backgroundColor: "white",
    padding: 16,
    borderWidth: 1,
    borderColor: "#000000",
    width: "100%",
    height: 50,
    borderRadius: 5,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
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
  dropWrap: { position: "relative", marginBottom: 20, width: "45%" },
});
