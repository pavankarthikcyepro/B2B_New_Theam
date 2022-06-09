import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable
} from "react-native";
import { HelpDeskItem } from "../../../pureComponents/helpDeskItem";
import { Colors, GlobalStyle } from '../../../styles';
import CREATE_NEW from '../../../assets/images/create_new.svg';
import { AppNavigator } from '../../../navigations';
import { MyTaskNewItem } from '../MyTasks/components/MyTasksNewItem';



const screenWidth = Dimensions.get("window").width;

const datalist = [
  {
    name: "Help Desk",
    desc:'new jkjjsodflsdjf',
    stage:'preBooking',
    status:'open',
    category:'Booking'
  },
];

const HelpDeskScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
        <View style={[ { backgroundColor: Colors.LIGHT_GRAY, flex: 1, marginBottom: 10 }]}>
                        <FlatList
                            data={datalist}
                            extraData={datalist}
                            keyExtractor={(item, index) => index.toString()}
                            // refreshControl={(
                            //     <RefreshControl
                            //         refreshing={selector.isLoading}
                            //         onRefresh={() => getPreEnquiryListFromServer(employeeId, selectedFromDate, selectedToDate)}
                            //         progressViewOffset={200}
                            //     />
                            // )}
                            showsVerticalScrollIndicator={false}
                            onEndReachedThreshold={0}
                            // onEndReached={() => {
                            //     if (appSelector.searchKey === ''){
                            //         getMorePreEnquiryListFromServer()
                            //     }
                            // }}
                            // ListFooterComponent={renderFooter}
                            renderItem={({ item, index }) => {

                                let color = Colors.WHITE;
                                if (index % 2 != 0) {
                                    color = Colors.LIGHT_GRAY;
                                }

                                return (
                                    <>
                                        <View>
                                            <MyTaskNewItem
                                                // from='PRE_ENQUIRY'
                                                name={item.desc}
                                                status={""}
                                                // created={item.createdDate}
                                                 //dmsLead={item.createdBy}
                                                // phone={item.phone}
                                                source={item.stage}
                                                model={item.status}
                                                // onItemPress={() => {
                                                //     console.log("ENQ: ", JSON.stringify(item));
                                                //     navigation.navigate(AppNavigator.EmsStackIdentifiers.task360, { universalId: item.universalId })
                                                // }}
                                                // onDocPress={() => {
                                                //     console.log("ITEM:", JSON.stringify(item));
                                                //     navigation.navigate(AppNavigator.EmsStackIdentifiers.confirmedPreEnq, { itemData: item, fromCreatePreEnquiry: false })
                                                // }}
                                            />
                                        </View>
                                    </>
                                )
                            }}
                        />
                    </View>

         <View style={[styles.addView, GlobalStyle.shadow]}>
                    <Pressable 
                    onPress={() => navigation.navigate(AppNavigator.MyHelpDesk.raiseTicket, { fromEdit: false })}
                    >
                        <CREATE_NEW width={60} height={60} fill={"rgba(255,21,107,6)"} />
                    </Pressable>
                </View>
      
    </SafeAreaView>
  );
};

export default HelpDeskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
    paddingTop: 10,
  },
  view2: {
    flex: 1,
    padding: 10,
  },
  list: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
  },
  view1: {
    height: 10,
    backgroundColor: Colors.LIGHT_GRAY,
  },
     addView: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'white'
    },
});
