import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions, Linking, Image
} from "react-native";
import { Colors } from "../../styles";
import { HelpDeskItem } from "../../pureComponents/helpDeskItem";
import {IconButton} from "react-native-paper";
import {AppNavigator} from "../../navigations";
const screenWidth = Dimensions.get("window").width;

const supportPhone = '7997193193';
const supportEmail = 'support@cyepro.com';

const datalist = [
  {
    name: "Phone",
    label: supportPhone,
    url: `tel:${supportPhone}`,
    icon: 'phone'
  },
  {
    name: "Email",
    label: supportEmail,
    url: `mailto:${supportEmail}`,
    icon: 'email'
  },
];

const HelpDeskScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view2}>
        <View style={{alignItems:'center'}}>
          <Image style={{width: 100, height: 100, alignItems: 'center', justifyContent: 'center'}} source={require('../../assets/images/Help_Desk-01.png')} />
        </View>

        <FlatList
          data={datalist}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => {
            return <View style={styles.view1}></View>;
          }}
          renderItem={({ item, index }) => {
            return(
                <View style={{backgroundColor: Colors.WHITE, top: 8}}>
                  <Text style={{textTransform: 'uppercase', fontWeight: '500', fontSize: 12, opacity: 0.6}}>{item.name}</Text>
                  <View style={styles.rowItem}>
                    <Text numberOfLines={1} style={{width: '85%', paddingStart: 4}}>{item.label}</Text>
                    <IconButton
                        color={Colors.RED}
                        icon={item.icon}
                        onPress={() => Linking.openURL(item.url)}
                    />
                  </View>
                </View>
            )
            // return <HelpDeskItem name={item.name} />;
          }}
        />
        <View style={styles.footerView}>
          <Text>Cyepro Solutions © {new Date().getFullYear()}</Text>
        </View>
      </View>

    </SafeAreaView>
  );
};

export default HelpDeskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.WHITE,
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
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_GRAY,
    height: 36
  },
  footerView: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
