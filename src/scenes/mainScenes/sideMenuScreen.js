import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import { IconButton, Divider, List, Button } from "react-native-paper";
import { Colors, GlobalStyle } from "../../styles";
import VectorImage from "react-native-vector-image";
import { useSelector, useDispatch } from "react-redux";
import { AppNavigator } from "../../navigations";
import { AuthContext } from "../../utils/authContext";
import realm from "../../database/realm";
import * as AsyncStore from '../../asyncStore';

const screenWidth = Dimensions.get("window").width;
const profileWidth = screenWidth / 4;
const profileBgWidth = profileWidth + 5;

const SideMenuScreen = ({ navigation }) => {

  const selector = useSelector((state) => state.sideMenuReducer);
  const { signOut } = React.useContext(AuthContext);

  const itemSelected = (item) => {
    switch (item.screen) {
      case 99:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.home);
        break;
      case 100:
        navigation.navigate(
          AppNavigator.DrawerStackIdentifiers.upcomingDeliveries
        );
        break;
      case 101:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.complaint);
        break;
      case 102:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.settings);
        break;
      case 103:
        navigation.navigate(
          AppNavigator.DrawerStackIdentifiers.eventManagement
        );
        break;
      case 104:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.preBooking);
        break;
    }
  };

  const signOutClicked = () => {

    AsyncStore.storeData(AsyncStore.Keys.USER_NAME, "");
    navigation.closeDrawer()
    //realm.close();
    signOut();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topView}>
        <IconButton
          icon={"chevron-left"}
          size={30}
          color={Colors.DARK_GRAY}
          onPress={() => {
            navigation.closeDrawer();
          }}
        />
        <Text style={styles.nameStyle}>{"Welcome Ravinder,"}</Text>
      </View>
      <View style={styles.profileContainerView}>
        <View style={[styles.profileBgVw, GlobalStyle.shadow]}>
          <Image
            style={{
              width: profileWidth,
              height: profileWidth,
              borderRadius: profileWidth / 2,
            }}
            source={require("../../assets/images/bently.png")}
          />
        </View>
        <View style={{ marginTop: 15 }}>
          <Text style={[styles.nameStyle, { textAlign: "center" }]}>
            {"Ravinder Katta"}
          </Text>
          <Text style={styles.text1}>{"Branch Manager, 40yrs"}</Text>
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.text2}>
            {"Email: "}
            <Text style={[styles.text2, { color: Colors.SKY_BLUE }]}>
              {"test@bharatgroupe.com"}
            </Text>
          </Text>
          <Text style={styles.text2}>
            {"Office Location: " + "Hyd-Jubli Hills"}
          </Text>
        </View>
      </View>
      <Divider />
      <FlatList
        data={selector.tableData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <Pressable onPress={() => itemSelected(item)}>
              <View style={{ paddingLeft: 10 }}>
                <List.Item
                  title={item.title}
                  titleStyle={{ fontSize: 16, fontWeight: "600" }}
                  left={(props) => <List.Icon {...props} icon="folder" style={{ margin: 0 }} />}
                />
                {/* // <VectorImage source={item.icon} width={20} height={20} /> */}
                <Divider />
              </View>
            </Pressable>
          );
        }}
      />
      <View style={styles.bottomVw}>
        <Button
          icon="logout"
          mode="contained"
          style={{ marginHorizontal: 40 }}
          contentStyle={{ backgroundColor: Colors.RED }}
          labelStyle={{
            fontSize: 14,
            fontWeight: "600",
            textTransform: "none",
          }}
          onPress={signOutClicked}
        >
          Sign Out
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default SideMenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  topView: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
  },
  nameStyle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.BLACK,
  },
  profileContainerView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  text1: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "200",
    color: Colors.DARK_GRAY,
  },
  text2: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "400",
    color: Colors.GRAY,
  },
  profileBgVw: {
    width: profileBgWidth,
    height: profileBgWidth,
    borderRadius: profileBgWidth / 2,
    backgroundColor: Colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomVw: {
    bottom: 0,
    paddingVertical: 20,
  },
});
