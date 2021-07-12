import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
} from "react-native";
import { Colors } from "../../styles";

const DATA = [
  {
    title: "Today",
    data: [
      "You have been assigned a target for Aug 20         2 hours ago",
      "General visitor request created for Aziz Khan @ 1PM                                                                                                                                                                    6 hours ago",
      " You have a new missed activity under general tasks due for 3 days                                                                          5 hours ago    ",

      "You have been assigned a target for Aug 20         2 hours ago",
      "General visitor request created for Aziz Khan @ 1PM                                                                                                                                                                    6 hours ago",
      " You have a new missed activity under general tasks due for 3 days                                                                          5 hours ago    ",
    ],
  },
  {
    title: "Yesterday",
    data: [
      "You have been assigned a target for Aug 20         2 hours ago",
      "General visitor request created for Aziz Khan @ 1PM                                                                                                                                                                    6 hours ago",
      " You have a new missed activity under general tasks due for 3 days                                                                          5 hours ago    ",
    ],
  },
  {
    title: "july 7, 1:40 AM",
    data: [
      "You have been assigned a target for Aug 20         2 hours ago",
      "General visitor request created for Aziz Khan @ 1PM                                                                                                                                                                    6 hours ago",
      " You have a new missed activity under general tasks due for 3 days                                                                          5 hours ago    ",
    ],
    hrs: ["5 hours ago"],
  },
  {
    title: "july 6, 12 AM",
    data: [
      "You have been assigned a target for Aug 20         2 hours ago",
      "General visitor request created for Aziz Khan @ 1PM                                                                                                                                                                    6 hours ago",
      " You have a new missed activity under general tasks due for 3 days                                                                          5 hours ago    ",
    ],
    hrs: ["4 hours ago"],
  },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const NotificationScreen = () => (
  <SafeAreaView style={styles.container}>
    <View>
      <Text
        style={{
          fontWeight: "bold",
          color: Colors.RED,
          marginLeft: 249,
          marginBottom: -28,
          fontSize: 14,
        }}
      >
        Mark all Read
      </Text>
    </View>
    <SectionList
      sections={DATA}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item }) => <Item title={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}</Text>
      )}
    />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 10,
  },
  item: {
    backgroundColor: Colors.WHITE,
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },
  header: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
    backgroundColor: Colors.gray,
  },
  title: {
    fontSize: 12,
    fontWeight: "300",
  },
});

export default NotificationScreen;
