import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors } from '../styles';
import * as AsyncStore from "../asyncStore";
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationList } from '../redux/notificationReducer';
import { isReceptionist } from '../utils/helperFunctions';

const NotificationIcon = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.notificationReducer);

  const [notificationCount, setNotificationCount] = useState(0);
  const [isIconShow, setIsIconShow] = useState(false);

  useEffect(async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (isReceptionist(jsonObj.hrmsRole)) {
        setIsIconShow(false);
      } else {
        setIsIconShow(true);
      }
      dispatch(getNotificationList(jsonObj.empId));
    }
  }, []);

  useEffect(() => {
    if (selector.notificationList.length > 0) {
      getListingCount();
    }
  }, [selector.notificationList]);

  const getListingCount = async () => {
    let count = 0;
    await selector.notificationList.forEach((item) => {
      if (item.isRead == "N") {
        count = count + 1;
      }
    });
    setNotificationCount(count);
  };

  if (isIconShow) {
    return (
      <View style={styles.badgeMainContainer}>
        <IconButton
          icon="bell"
          style={{ padding: 0, margin: 0 }}
          color={Colors.WHITE}
          size={25}
          onPress={() => navigation.navigate("NOTIF_1")}
        />
        {notificationCount > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeCountText}>
              {notificationCount < 100 ? notificationCount : "99+"}
            </Text>
          </View>
        )}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  badgeMainContainer: {
    marginRight: 10
  },
  badgeContainer: {
    backgroundColor: Colors.RED,
    borderRadius: 50,
    position: "absolute",
    top: -3,
    right: -3
  },
  badgeCountText: {
    padding: 3,
    color: Colors.WHITE,
    fontSize: 11
  },
});

export default NotificationIcon;