import React from "react";
import { SafeAreaView, StyleSheet, View, FlatList } from "react-native";
import { PageControlItem } from "../../../pureComponents/pageControlItem";
import { IconButton } from "react-native-paper";
import { PreEnquiryItem } from "../../../pureComponents/preEnquiryItem";
import { useDispatch, useSelector } from "react-redux";
import { Colors, GlobalStyle } from "../../../styles";
import { AppNavigator } from '../../../navigations';

const EnquiryScreen = ({ navigation }) => {
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
        <View style={GlobalStyle.shadow}>
          <FlatList
            data={selector.enquiry_list}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              let color = Colors.WHITE;
              if (index % 2 != 0) {
                color = Colors.LIGHT_GRAY;
              }

              return (
                <PreEnquiryItem
                  bgColor={color}
                  name={item.firstName + " " + item.lastName}
                  subName={item.enquirySource}
                  date={item.createdDate}
                  modelName={item.model}
                  onPress={() => navigation.navigate(AppNavigator.EmsStackIdentifiers.detailsOverview)}
                />
              );
            }}
          />
        </View>
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
    paddingHorizontal: 10,
  },
  view2: {
    flexDirection: "row",
  },
});
