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

const AttendanceScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isWeek, setIsWeek] = useState(false);
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

  return (
    <SafeAreaView style={styles.container}>
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
            height: 28,
            marginTop: 2,
            justifyContent: "center",
            width: "80%",
          }}
        >
          <TouchableOpacity
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
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsWeek(false);
            }}
            style={{
              width: "50%",
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
          }}
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
