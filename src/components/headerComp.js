import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../styles";
import * as AsyncStore from "../asyncStore";
import { setBranchId, setBranchName } from "../utils/helperFunctions";
import NotificationIcon from "./NotificationIcon";

const HeaderComp = ({
  title,
  branchName = false,
  height = 56,
  menuClicked,
  branchClicked,
  filterClicked,
  notification = false,
  navigation,
}) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.targetSettingsReducer);

  const [branch, setBranch] = useState("");

  useEffect(async () => {
    if (selector.selectedBranchName) {
      setBranch(selector.selectedBranchName);
    } else {
      await AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_NAME).then(
        (res) => {
          if (res) {
            setBranch(res);
            setBranchName(res);
          }
        }
      );
      await AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_ID).then(
        (res) => {
          if (res) {
            setBranchId(res);
          }
        }
      );
    }
  }, [selector.selectedBranchName]);

  return (
    <View style={[style.container, { height: height }]}>
      <View
        style={{ ...style.subContainer, width: notification ? "60%" : "73%" }}
      >
        <IconButton
          icon="menu"
          color={Colors.WHITE}
          size={30}
          onPress={menuClicked}
        />
        <View style={{ width: "48%" }}>
          <Text numberOfLines={2} style={style.title}>
            {title}
          </Text>
        </View>
      </View>
      <View>
        {branchName && branch ? (
          <TouchableOpacity onPress={branchClicked}>
            <View style={style.branchContainer}>
              <Text style={style.branchName} numberOfLines={1}>
                {branch}
              </Text>
              <IconButton
                icon="menu-down"
                style={{ padding: 0, margin: 0 }}
                color={Colors.WHITE}
                size={15}
              />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
      <View>
        <View style={style.filterContainer}>
          <IconButton
            icon="filter-outline"
            style={{ padding: 0, margin: 0 }}
            color={Colors.WHITE}
            size={30}
            onPress={filterClicked}
          />
          {notification && <NotificationIcon navigation={navigation} />}
        </View>
      </View>
    </View>
  );
};

export { HeaderComp };

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.DARK_GRAY,
    height: 56,
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "73%",
  },
  title: {
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: "100",
  },
  branchContainer: {
    marginLeft: -50,
    paddingLeft: 5,
    paddingRight: 2,
    paddingVertical: 2,
    borderColor: Colors.WHITE,
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  branchName: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.WHITE,
    width: 60,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeContainer: {
    bottom: 0,
    right:10,
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:Colors.RED,
    borderRadius:7.5,
    height:15,
    width:15
  },
  badgeText: { fontSize: 12, color: Colors.WHITE, fontWeight: "bold" },
});
