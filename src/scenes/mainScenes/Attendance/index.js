import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { LoaderComponent } from "../../../components";
import { Colors } from "../../../styles";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import AttendanceForm from "../../../components/AttendanceForm";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);

const AttendanceScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isWeek, setIsWeek] = useState(false);
  const [marker,setMarker] = useState({});
  const [attendance, setAttendance] = useState(false);
  //   useLayoutEffect(() => {
  //     navigation.setOptions({
  //       headerRight: () => (
  //         <IconButton
  //           icon="filter"
  //           color={Colors.WHITE}
  //           size={30}
  //           onPress={() => setShowDatePicker(true)}
  //         />
  //       ),
  //     });
  //   }, [navigation]);
  useEffect(() => {
    getAttendance();
  }, []);

  const getAttendance = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      const response = await client.get(
        URL.GET_ATTENDANCE_EMPID(jsonObj.empId, jsonObj.orgId)
      );
      const json = await response.json();
      if (json) {
        let newArray = [];
        let dateArray = [];
        for (let i = 0; i < json.length; i++) {
          const element = json[i];
          let format = {
            // marked: true,
            // dotColor: element.isPresent === 1 ? Colors.GREEN : Colors.RED,
            customStyles: {
              container: {
                backgroundColor:
                  element.isPresent === 1 ? Colors.GREEN : "#ff5d68",
              },
              text: {
                color: Colors.WHITE,
                fontWeight: "bold",
              },
            },
          };
          let date = new Date(element.createdtimestamp);
          let formatedDate = moment(date).format(dateFormat);
          dateArray.push(formatedDate);
          newArray.push(format);
        }
        // console.log(dateArray);
        var obj = {};
        for (let i = 0; i < newArray.length; i++) {
          const element = newArray[i];
          obj[dateArray[i]] = element;
        }
        setMarker(obj);
        console.log(obj);
      }
    }
  };

  const isCurrentDate = (day) => {
    let selectedDate = day.dateString;
    console.log(currentDate, selectedDate, currentDate === selectedDate);
    if (currentDate === selectedDate) {
      setAttendance(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AttendanceForm
        visible={attendance}
        // showReason={reason}
        inVisible={() => {
          setAttendance(false);
        }}
      />
      <View
        style={{
          flexDirection: "row",
          marginBottom: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            borderColor: Colors.RED,
            borderWidth: 1,
            borderRadius: 5,
            height: 35,
            marginTop: 2,
            justifyContent: "center",
            width: "80%",
          }}
        >
          {/* <TouchableOpacity
            onPress={() => {
              setIsWeek(true);
            }}
            style={{
              width: "50%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: !isWeek ? Colors.WHITE : Colors.RED,
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: !isWeek ? Colors.BLACK : Colors.WHITE,
                fontWeight: "600",
              }}
            >
              Week
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              setIsWeek(false);
            }}
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: !isWeek ? Colors.RED : Colors.WHITE,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: !isWeek ? Colors.WHITE : Colors.BLACK,
                fontWeight: "600",
              }}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Calendar
          //   initialDate={"2012-03-01"}
          onDayPress={(day) => {
            console.log("selected day", day);
            isCurrentDate(day);
          }}
          onDayLongPress={(day) => {
            console.log("selected day", day);
          }}
          monthFormat={"MMM yyyy"}
          onMonthChange={(month) => {
            console.log("month changed", month);
          }}
          hideExtraDays={true}
          firstDay={1}
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          enableSwipeMonths={true}
          theme={{
            arrowColor: Colors.RED,
            dotColor: Colors.RED,
            textMonthFontWeight: "500",
            monthTextColor: Colors.RED,
            indicatorColor: Colors.RED,
            dayTextColor: Colors.BLACK,
            selectedDayBackgroundColor: Colors.LIGHT_SKY_BLUE,
            textDayFontWeight: "500",
          }}
          markingType={"custom"}
          markedDates={marker}
        />
      </View>

      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
  },
});
