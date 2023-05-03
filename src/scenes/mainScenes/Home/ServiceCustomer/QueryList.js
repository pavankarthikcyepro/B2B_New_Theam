import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearStateData, getQueryList } from '../../../../redux/queryListReducer';
import * as AsyncStore from "../../../../asyncStore";
import { Colors, GlobalStyle } from '../../../../styles';
import moment from 'moment';
import CREATE_NEW from "../../../../assets/images/create_new.svg";
import { HomeStackIdentifiers } from '../../../../navigations/appNavigator';
import { EmptyListView } from '../../../../pureComponents';

const QueryList = ({ navigation, route }) => {
  const { currentUserData, vehicleRegNumber, customerDetail } = route.params;
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.queryListReducer);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    getListing();
    return () => {
      dispatch(clearStateData());
    };
  }, []);

  const getListing = () => {
    if (currentUserData?.branchId || userData?.branchId) {
      initialCall(currentUserData);
    } else {
      getCurrentUser();
    }
  };

  const getCurrentUser = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      initialCall(jsonObj);
    }
  };

  const initialCall = (data) => {
    const { branchId, orgId } = data;
    setUserData(data);
    let payload = {
      tenantId: branchId,
    };
    dispatch(getQueryList(payload));
  };

  const getStatusColor = (status) => {
    if (status == "BOOKED") {
      return Colors.GREEN_V2;
    } else if (status == "CANCELLED" || status == "CLOSED") {
      return Colors.CORAL;
    } else if (status == "RESCHEDULED") {
      return Colors.YELLOW;
    } else {
      return Colors.DARK_GRAY;
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(HomeStackIdentifiers.createQuery, {
            currentUserData: userData,
            isRefreshList: () => getListing(),
            fromType: "editQuery",
            vehicleRegNumber,
            customerDetail,
            existingQueryData: item,
          });
        }}
        activeOpacity={0.9}
        key={index}
        style={styles.itemContainer}
      >
        <View style={styles.topRow}>
          <Text style={styles.vehicleRegNumberText}>{item.id}</Text>
        </View>
        <View style={styles.topRow}>
          <Text numberOfLines={1} style={styles.detailHighLightText}>
            {item.customerQueryEnquiryPurpose}
          </Text>
        </View>

        <View style={styles.itemRow}>
          <Text style={styles.rowLabel}>Customer Mobile: </Text>
          <Text style={styles.rowValue}>9904890616</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.rowLabel}>Customer Query: </Text>
          <Text style={styles.rowValue}>{item.query}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.rowLabel}>Customer Created Date: </Text>
          <Text style={styles.rowValue}>
            {item.createdDate
              ? moment(item.createdDate).format("YYYY-MM-DD HH:MM a")
              : ""}
          </Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.rowLabel}>Customer Updated Date: </Text>
          <Text style={styles.rowValue}>
            {item.lastModifiedDate
              ? moment(item.lastModifiedDate).format("YYYY-MM-DD HH:MM a")
              : ""}
          </Text>
        </View>

        <Text
          numberOfLines={1}
          style={[
            styles.statusText,
            { color: getStatusColor(item.customerQueryEnquiryStatus) },
          ]}
        >
          {item.customerQueryEnquiryStatus}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {selector.queryList.length > 0 ? (
        <FlatList
          data={selector.queryList}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 10 }}
          refreshControl={
            <RefreshControl
              refreshing={selector.isLoading}
              onRefresh={() => getListing()}
              progressViewOffset={200}
              tintColor={Colors.PINK}
            />
          }
        />
      ) : (
        <EmptyListView
          title={"No Query Found"}
          isLoading={selector.isLoading}
        />
      )}

      <TouchableOpacity
        style={[GlobalStyle.shadow, styles.addView]}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate(HomeStackIdentifiers.createQuery, {
            currentUserData: userData,
            isRefreshList: () => getListing(),
            fromType: "createQuery",
            vehicleRegNumber,
            customerDetail,
          });
        }}
      >
        <CREATE_NEW width={60} height={60} fill={"rgba(255,21,107,6)"} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.WHITE,
  },
  addView: {
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 30,
    backgroundColor: Colors.WHITE,
  },
  itemContainer: {
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    ...GlobalStyle.shadow,
    backgroundColor: Colors.WHITE,
  },
  topRow: { flexDirection: "row", alignItems: "center" },
  vehicleRegNumberText: { fontSize: 14, fontWeight: "600" },
  detailHighLightText: {
    color: Colors.BLUE,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 5,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.GRAY,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  statusText: {
    color: Colors.GREEN_V2,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 5,
  },
});

export default QueryList;