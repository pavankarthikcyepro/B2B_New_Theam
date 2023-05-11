import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  LoaderComponent,
} from "../../../components";
import { Colors, GlobalStyle } from "../../../styles";
import { client } from "../../../networking/client";
import URL, { baseUrl } from "../../../networking/endpoints";
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import _ from "lodash";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);

const TripListScreen = ({ route, navigation }) => {
  // const navigation = useNavigation();
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (route.params) {
      getLocation(route.params);
    }
  }, [route.params]);

  const getLocation = async (params) => {
    try {
      const response = await client.get(
        URL.GET_MAP_COORDINATES_BY_ID(params.empId, params.orgId, params.date)
      );
      const json = await response.json();

      if (json.length > 0) {
        setData(json);
        setLoading(false);
      } else {
        Alert.alert("No data are Available", "", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert("Something went wrong", "", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      setData([]);
      setLoading(false);
    }
  };

  const renderData = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          marginVertical: 10,
          backgroundColor: Colors.LIGHT_PINK,
          width: "95%",
          paddingVertical: 10,
          paddingHorizontal: 10,
          alignSelf: "center",
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "600", marginBottom: 10 }}>
          {"Trip No. " + (index + 1)}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: "500", marginBottom: 2 }}>
          {"Start Time: " +
            moment(item.createdtimestamp)
              .utcOffset("+05:30")
              .format("YYYY-MM-DD hh:mm:ssa")}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: "500", marginBottom: 2 }}>
          {"End Time: " +
            moment(item.updatedtimestamp)
              .utcOffset("+05:30")
              .format("YYYY-MM-DD hh:mm:ssa")}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderData}
      />
      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default TripListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.WHITE,
  },
  component: {
    width: Dimensions.get("window").width,
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "grey",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  arrowButton: {
    paddingHorizontal: 10,
  },
  title: {
    color: "grey",
    fontWeight: "bold",
  },
  week: {
    width: "100%",
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 5,
  },
  weekdayLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  weekdayLabel: {
    flex: 1,
    alignItems: "center",
  },
  weekdayLabelText: {
    color: "grey",
  },
  weekdayNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  weekDayNumber: {
    flex: 1,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  weekDayNumberCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
  },
  weekDayNumberTextToday: {
    color: "white",
  },
  schedule: {
    width: "100%",
  },
  pickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  picker: {
    backgroundColor: "white",
    paddingBottom: 20,
  },
  modal: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  blurredArea: {
    flex: 1,
    opacity: 0.7,
    backgroundColor: "black",
  },
  modalButton: {
    padding: 15,
  },
  modalButtonText: {
    fontSize: 20,
  },
  indicator: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    position: "absolute",
  },
  day: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderTopColor: "grey",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  dayLabel: {
    width: "20%",
    alignItems: "center",
    padding: 10,
    borderRightColor: "grey",
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  monthDateText: {
    fontSize: 20,
  },
  dayText: {},
  allEvents: {
    width: "80%",
  },
  event: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  eventDuration: {
    width: "30%",
    justifyContent: "center",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationDot: {
    width: 4,
    height: 4,
    backgroundColor: "grey",
    marginRight: 5,
    alignSelf: "center",
    borderRadius: 4 / 2,
  },
  durationDotConnector: {
    height: 20,
    borderLeftColor: "grey",
    borderLeftWidth: StyleSheet.hairlineWidth,
    position: "absolute",
    left: 2,
  },
  durationText: {
    color: "grey",
    fontSize: 12,
  },
  eventNote: {
    backgroundColor: "skyblue",
    flex: 1,
    justifyContent: "center",
    paddingLeft: 15,
  },
  lineSeparator: {
    width: "100%",
    borderBottomColor: "lightgrey",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 4,
    height: 4,
    marginTop: 1,
    alignSelf: "center",
    borderRadius: 4 / 2,
    position: "absolute",
    bottom: "10%",
  },
  eventText: {
    fontSize: 17,
    fontWeight: "500",
    color: Colors.WHITE,
  },
  parameterCountView: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "space-between",
  },
  parameterMarker: {
    height: 25,
    width: 25,
    backgroundColor: "red",
    borderRadius: 5,
    marginRight: 5,
    borderWidth: 0.5,
    borderColor: "#646464",
  },
  parameterView: {
    flexDirection: "row",
    width: "60%",
    alignItems: "center",
    marginTop: 10,
  },
  parameterListContain: {
    width: "100%",
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 25,
  },
  parameterText: {
    fontSize: 14,
    fontWeight: "700",
  },
  totalHours: {
    color: "#646464",
    fontSize: 16,
    fontWeight: "700",
  },
  totalHoursValue: {
    color: "#252525",
    fontSize: 17,
    fontWeight: "700",
  },
  hoursView: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profilePicView: {
    marginHorizontal: 25,
    marginVertical: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },

  newModalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    maxHeight: "50%",
    maxWidth: "100%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    marginTop: "30%",
    marginLeft: "30%",
    elevation: 20,
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    top: 5,

    position: "absolute",
  },
  floatingBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    position: "absolute",
    bottom: 25,
    right: 25,
    height: 60,
    backgroundColor: "rgba(255,21,107,6)",
    borderRadius: 100,
  },
  employeeName: {
    color: "#252525",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5,
  },
  DatePickerView: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "column",
  },
  profileView: {
    justifyContent: "center",
    alignItems: "center",
  },
});
