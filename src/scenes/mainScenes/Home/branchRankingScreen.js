import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, LogBox } from 'react-native';
import * as AsyncStore from '../../../asyncStore';
import { useDispatch, useSelector } from 'react-redux';
import { getBranchRanksList } from "../../../redux/homeReducer";
import { LoaderComponent } from '../../../components';
import moment from 'moment';
import { Colors } from '../../../styles';

export default function branchRankingScreen() {
    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [branchList, setBranchList] = useState([]);
    const [loggedInEmpId, setLoggedInEmpId] = useState(0);

    const getBranchRankListFromServer = async () => {
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        const jsonObj = await JSON.parse(employeeData);
         if (jsonObj && jsonObj.empId) {
           setLoggedInEmpId(jsonObj.empId);
         }
        const branchId = await AsyncStore.getData(
            AsyncStore.Keys.SELECTED_BRANCH_ID
        );
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let payload = {
            "endDate": moment.utc(lastDay).format('YYYY-MM-DD'),
            "levelSelected": null,
            "loggedInEmpId": jsonObj.empId,
            "pageNo": 1,
            "size": 50,
            "startDate": moment.utc(firstDay).format('YYYY-MM-DD'),
            //not for payload, just to add in params
            "orgId":jsonObj.orgId,
            "branchId":jsonObj.branchId

        };
        dispatch(getBranchRanksList(payload));
    }

    useEffect(async () => {
      LogBox.ignoreAllLogs();
      getBranchRankListFromServer();
      setTimeout(() => {
        setBranchList(selector.branchrank_list);
      }, 2000);
    }, []);

    useEffect(() => {
      if (selector.branchrank_list && selector.branchrank_list.length > 0) {
        setTimeout(() => {
          setBranchList(selector.branchrank_list);
        }, 2000);
      }
    }, [selector.branchrank_list]);

    const getEmpName = (value) => {
      let name = value;
      name = name.split(" ");
      return name[0];
    };

    const getBranchName = (value) => {
      let branch = value;
      branch = branch.split("-");
      return branch[0].trim();
    };

    const renderItemLeaderTopList = (item, index) => {
      let isActive = item.empId == loggedInEmpId && !selector.isRankHide;
      return (
        <View style={isActive ? styles.activeSubRow :styles.tableSubRow}>
          <View style={styles.itemRow}>
            <Text style={isActive ? styles.activeItemRowText : styles.itemRowText}>{item.rank}</Text>
            <Text style={isActive ? styles.activeItemRowText : styles.itemRowText}>{getEmpName(item.empName)}</Text>
            <Text style={isActive ? styles.activeItemRowText : styles.itemRowText}>
              {getBranchName(item.branchCode)}
            </Text>
            <Text style={isActive ? styles.activeItemRowText : styles.itemRowText}>{item.achivementPerc}</Text>
            <Text style={isActive ? styles.activeItemRowText : styles.itemRowText}>{item.targetAchivements}</Text>
          </View>
        </View>
      );
    };

    const renderTableTopRow = () => {
      return (
        <View style={styles.tableTitleRow}>
          <Text style={styles.tableTitleText}>Rank</Text>
          <Text style={styles.tableTitleText}>Name</Text>
          <Text style={styles.tableTitleText}>Branch</Text>
          <Text style={styles.tableTitleText}>Ret T/A%</Text>
          <Text style={styles.tableTitleText}>Retail</Text>
        </View>
      );
    };

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.rankBox}>
          <View style={styles.listView}>
            <View
              style={{
                width: "98%",
                height: "98%",
              }}
            >
              {branchList.length ? null : (
                <LoaderComponent
                  visible={selector.isLoading}
                  onRequestClose={() => {}}
                />
              )}

              {renderTableTopRow()}
              <FlatList
                data={branchList}
                nestedScrollEnabled={true}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                  renderItemLeaderTopList(item, index)
                }
                showsVerticalScrollIndicator={false}
                extraData={branchList}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  tableTitleRow: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: Colors.BLACK,
    backgroundColor: Colors.WHITE,
  },
  tableTitleText: {
    flex: 1,
    fontWeight: "600",
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
  activeItemRowText: {
    color: Colors.BLACK,
    textAlign: "center",
    flex: 1,
    fontWeight: "bold",
  },
  listView: {
    height: "95%",
    width: "95%",
    backgroundColor: "white",
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
    margin: 5,
    alignSelf: "center",
  },
  rankBox: {
    paddingTop: 5,
    paddingBottom: 10,
  },
});
