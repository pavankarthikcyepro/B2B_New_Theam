import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { EventManagementItem } from "../../../pureComponents/eventmanagementItem";
import { useDispatch, useSelector } from "react-redux";

const screenWidth = Dimensions.get("window").width;

const EventListScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.eventmanagementReducer);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <FlatList
          data={selector.tableAry}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator}></View>;
          }}
          renderItem={({ item, index }) => {
            return (
              <View style={[styles.listBgVw, GlobalStyle.shadow]}>
                <EventManagementItem
                  eventid={item.eventID}
                  eventName={item.eventName}
                  startDate={item.startDate}
                  endDate={item.endDate}
                  location={item.location}
                  eventType={item.eventType}
                  participiants={item.participiants}
                />
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default EventListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  view1: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  listBgVw: {
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 10,
  },
  separator: {
    height: 10,
  },
});
