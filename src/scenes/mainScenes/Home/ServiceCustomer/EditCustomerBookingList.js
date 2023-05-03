import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import { Colors, GlobalStyle } from '../../../../styles';
import { HomeStackIdentifiers } from '../../../../navigations/appNavigator';
import CREATE_NEW from '../../../../assets/images/create_new.svg';
import { useDispatch, useSelector } from 'react-redux';
import * as AsyncStore from "../../../../asyncStore";
import moment from 'moment';
import {
  clearStateData,
  getBookingList,
} from "../../../../redux/serviceBookingCrudReducer";
import { EmptyListView } from '../../../../pureComponents';

const dateFormat = "YYYY-MM-DD";
const timeFormat = "HH:MM a";
const timeSecFormat = "HH:MM:AA";

const EditCustomerBookingList = ({ navigation, route }) => {
  const { vehicleRegNumber, currentUserData } = route.params;
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.serviceBookingCrudReducer);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    getListing();
    return () => {
      dispatch(clearStateData());
    };
  }, []);

  const getListing = () => {
    if (currentUserData?.branchId || userData?.branchId) {
      setUserData(currentUserData);
      let payload = {
        tenantId: currentUserData.branchId,
        // vehicleRegNumber: vehicleRegNumber,
        vehicleRegNumber: 9080989080,
      };
      dispatch(getBookingList(payload));
    } else {
      getCurrentUser();
    }
  }

  const getCurrentUser = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData(jsonObj);

      let payload = {
        tenantId: jsonObj.branchId,
        vehicleRegNumber: 9080989080,
      };
      dispatch(getBookingList(payload));
    }
  };

  const getStatusColor = (status) => {
    if (status == "BOOKED") {
      return Colors.GREEN_V2;
    } else if (status == "CANCELLED") {
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
          navigation.navigate(HomeStackIdentifiers.createCustomerBooking, {
            existingBookingData: item,
            currentUserData: userData,
            isRefreshList: () => getListing(),
            fromType: "editBooking",
          });
        }}
        activeOpacity={0.9}
        key={index}
        style={styles.itemContainer}
      >
        <View style={styles.topRow}>
          <Text style={styles.vehicleRegNumberText}>
            {item.vehicleRegNumber}
          </Text>
        </View>
        <View style={styles.topRow}>
          <Text numberOfLines={1} style={styles.detailHighLightText}>
            {item.categoryName}
          </Text>
        </View>

        <View style={styles.itemRow}>
          <Text style={styles.rowLabel}>SERVICE DATE: </Text>
          <Text style={styles.rowValue}>
            {item.serviceDate
              ? moment(item.serviceDate).format(dateFormat)
              : ""}
          </Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.rowLabel}>SLOT SELECTED: </Text>
          <Text style={styles.rowValue}>
            {`${item?.slot?.from ? item.slot.from : ""} ${
              item?.slot?.to ? "- " + item.slot.to : ""
            }`}
          </Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.rowLabel}>PICK UP TIME: </Text>
          <Text style={styles.rowValue}>
            {item.pickupTime ? moment(item.pickupTime).format(timeFormat) : ""}
          </Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.rowLabel}>DROP TIME: </Text>
          <Text style={styles.rowValue}>
            {item.dropTime ? moment(item.dropTime).format(timeFormat) : ""}
          </Text>
        </View>

        <Text
          numberOfLines={1}
          style={[
            styles.statusText,
            { color: getStatusColor(item.serviceAppointmentStatus) },
          ]}
        >
          {item.serviceAppointmentStatus}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {selector.bookingList.length > 0 ? (
        <FlatList
          data={selector.bookingList}
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
          title={"No Booking Found"}
          isLoading={selector.isLoading}
        />
      )}

      <TouchableOpacity
        style={[GlobalStyle.shadow, styles.addView]}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate(HomeStackIdentifiers.createCustomerBooking, {
            currentUserData: userData,
            isRefreshList: () => getListing(),
            fromType: "createBooking",
          });
        }}
      >
        <CREATE_NEW width={60} height={60} fill={"rgba(255,21,107,6)"} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditCustomerBookingList;

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
