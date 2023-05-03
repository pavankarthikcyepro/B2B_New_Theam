import React, { useEffect } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, GlobalStyle } from '../../../../styles';
import { HomeStackIdentifiers } from '../../../../navigations/appNavigator';
import * as AsyncStore from "../../../../asyncStore";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CREATE_NEW from "../../../../assets/images/create_new.svg";
import { clearStateData, getRsaList } from '../../../../redux/rsaListReducer';
import { EmptyListView } from '../../../../pureComponents';

const RsaList = ({ navigation, route }) => {
  const { currentUserData, vehicleRegNumber, customerDetail } = route.params;
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.rsaListReducer);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    getListing();
    getCurrentUser();
    return () => {
      dispatch(clearStateData());
    };
  }, []);

  const getListing = () => {
    dispatch(getRsaList(customerDetail.id));
  };

  const getCurrentUser = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData(jsonObj);
    }
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
           navigation.navigate(HomeStackIdentifiers.createRsa, {
             currentUserData: userData,
             isRefreshList: () => getListing(),
             fromType: "editRsa",
             vehicleRegNumber,
             customerDetail,
             existingRsaData: item,
           });
         }}
         activeOpacity={0.9}
         key={index}
         style={styles.itemContainer}
       >
         <View style={styles.topRow}>
           <Text style={styles.rsaNo}>{item.id}</Text>
         </View>
         <View style={styles.itemRow}>
           <Text style={styles.rowLabel}>Reason: </Text>
           <Text style={styles.rowValue}>{item.reason}</Text>
         </View>
         <View style={styles.itemRow}>
           <Text style={styles.rowLabel}>Remarks: </Text>
           <Text style={styles.rowValue}>{item.remarks}</Text>
         </View>
         <View style={styles.itemRow}>
           <Text style={styles.rowLabel}>Amount: </Text>
           <Text style={styles.rowValue}>{item.amount}</Text>
         </View>
         <Text
           numberOfLines={1}
           style={[styles.statusText, { color: getStatusColor(item.status) }]}
         >
           {item.status}
         </Text>
       </TouchableOpacity>
     );
   };

  return (
    <SafeAreaView style={styles.container}>
      {selector.rsaList.length > 0 ? (
        <FlatList
          data={selector.rsaList}
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
        <EmptyListView title={"No RSA Found"} isLoading={selector.isLoading} />
      )}

      <TouchableOpacity
        style={[GlobalStyle.shadow, styles.addView]}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate(HomeStackIdentifiers.createRsa, {
            currentUserData: userData,
            isRefreshList: () => getListing(),
            fromType: "createRsa",
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
  rsaNo: { fontSize: 14, fontWeight: "600" },
  itemRow: {
    flexDirection: "row",
    marginTop: 7,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.GRAY,
    width: "25%"
  },
  rowValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  statusText: {
    color: Colors.DARK_GRAY,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 5,
  },
});

export default RsaList;