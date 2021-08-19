import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Dimensions } from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp } from "../../../components";
import { Button } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { setHomeVisitDetails } from "../../../redux/homeVisitReducer";

const ScreenWidth = Dimensions.get("window").width;

const HomeVisitScreen = () => {
  const [text, setText] = React.useState("");
  const selector = useSelector((state) => state.homeVisitReducer);
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={{ padding: 15 }}>
        <View style={[GlobalStyle.shadow, { backgroundColor: Colors.WHITE }]}>
          <TextinputComp
            style={styles.textInputStyle}
            label={"Reason"}
            value={selector.reason}
            onChangeText={(text) => {
              dispatch(setHomeVisitDetails({ key: "REASON", text: text }));
            }}
          />
          <Text style={GlobalStyle.underline}></Text>
          <TextinputComp
            style={styles.textInputStyle}
            label={"Customer Remarks"}
            value={selector.customer_remarks}
            onChangeText={(text) =>
              dispatch(
                setHomeVisitDetails({ key: "CUSTOMER_REMARKS", text: text })
              )
            }
          />
          <Text style={GlobalStyle.underline}></Text>
          <TextinputComp
            style={styles.textInputStyle}
            label={"Employee Remarks"}
            value={selector.employee_remarks}
            onChangeText={(text) =>
              dispatch(
                setHomeVisitDetails({ key: "EMPLOYEE_REMARKS", text: text })
              )
            }
          />
          <Text style={GlobalStyle.underline}></Text>
        </View>
      </View>

      <View style={styles.view1}>
        <Button
          mode="contained"
          color={Colors.RED}
          labelStyle={{ textTransform: "none" }}
          onPress={() => console.log("Pressed")}
        >
          Update
        </Button>
        <Button
          mode="contained"
          color={Colors.RED}
          labelStyle={{ textTransform: "none" }}
          onPress={() => console.log("Pressed")}
        >
          Close
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default HomeVisitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputStyle: {
    height: 65,
    width: "100%",
  },
  view1: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
