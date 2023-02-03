import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  ScrollView,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  DatePickerComponent,
  DateRangeComp,
  DropDownComponant,
} from "../../../components";
import { Colors, GlobalStyle } from "../../../styles";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import { DropDownSelectionItem } from "../../../pureComponents";
import { AttendanceTopTabNavigatorIdentifiers } from "../../../navigations/attendanceTopTabNavigator";
import PieChart from "react-native-pie-chart";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { DateRangeCompOne } from "../../../components/dateRangeComp";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const lastMonthFirstDate = moment(currentDate, dateFormat)
  .subtract(0, "months")
  .startOf("month")
  .format(dateFormat);

const screenWidth = Dimensions.get("window").width;
const profileWidth = screenWidth / 8;
const profileBgWidth = profileWidth + 5;

const item1Width = screenWidth - 10;
const item2Width = item1Width - 10;
const baseItemWidth = item2Width / 3.4;
const itemWidth = baseItemWidth - 10;

const series = [60, 40];
const sliceColor = ["#5BBD66", Colors.RED];
const chartHeight = itemWidth - 20;
const overlayViewHeight = chartHeight - 10;

const OverviewScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.homeReducer);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [todaysLeave, setTodaysLeave] = useState([]);
  const [todaysPresent, setTodaysPresent] = useState([]);
  const [todaysWFH, setTodaysWFH] = useState([]);
  const [todaysNoLogged, setTodaysNoLogged] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState(currentDate);
  const [selectedToDate, setSelectedToDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerId, setDatePickerId] = useState("");

  const fromDateRef = useRef(selectedFromDate);
  const toDateRef = useRef(selectedToDate);
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Present" },
    { key: "second", title: "Leave" },
    { key: "third", title: "WFH" },
    { key: "fourth", title: "No Logged" },
  ]);

  const renderData = () => {
    return (
      <View style={styles.boxView}>
        <View>
          <Text style={styles.locationTxt}>{"Hyderabad"}</Text>
        </View>
        <View style={styles.valueBox}>
          <Text style={styles.valueTxt}>{"15"}</Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.mainView}>
          <View style={styles.titleView}>
            <Text style={styles.titleText}>{"Location"}</Text>
            <Text style={styles.titleText}>{"Car Stock"}</Text>
          </View>
          <View style={styles.boxView}>
            <View>
              <Text style={styles.locationTxt}>{"Hyderabad"}</Text>
            </View>
            <View style={styles.valueBox}>
              <Text style={styles.valueTxt}>{"15"}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OverviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  mainView: {
    flex: 1,
    width: "95%",
    alignSelf: "center",
    marginTop: 15,
  },
  titleText: {
    fontSize: 20,
    color: Colors.RED,
    fontWeight: "600",
  },
  valueTxt: {
    fontSize: 17,
    color: Colors.RED,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  valueBox: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  locationTxt: {
    fontSize: 17,
    color: Colors.BLACK,
    fontWeight: "600",
  },
  boxView: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});
