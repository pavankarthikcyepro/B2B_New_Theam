import React from "react";
import { SafeAreaView, Text, StyleSheet, View, FlatList } from "react-native";
import { PageControlItem } from "../../../pureComponents/pageControlItem";
import { IconButton } from "react-native-paper";
import { EnquiryItem } from "../../../pureComponents/enquiryItem";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../../styles";

const EnquiryScreen = () => {
  const selector = useSelector((state) => state.enquiryReducer);
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <View style={styles.view2}>
          <PageControlItem pageNumber={1} totalPages={7} />
          <IconButton
            icon={"refresh"}
            size={25}
            style={{ padding: 0, marginLeft: 150 }}
          />
        </View>
        <FlatList
          data={selector.enquiry_list}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            let color = Colors.WHITE;
            if (index % 2 != 0) {
              color = Colors.LIGHT_GRAY;
            }

            return (
              <EnquiryItem
                bgColor={color}
                firstName={item.firstName + " " + item.lastName}
                enquirySource={item.enquirySource}
                date={item.createdDate}
                type={item.type}
                model={item.model}
              />
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default EnquiryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view1: {
    marginBottom: 5,
  },
  view2: {
    flexDirection: "row",
  },
});
