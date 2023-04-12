import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { HomeStackIdentifiers } from '../../../../navigations/appNavigator';
import { RadioTextItem2 } from '../../../../pureComponents';
import { Colors } from '../../../../styles';

const CustomerInfo = ({ navigation, route }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeRadioIndex, setActiveRadioIndex] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Tab View */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tabContainer,
            {
              backgroundColor:
                activeTabIndex == 0 ? Colors.PINK : Colors.LIGHT_GRAY,
            },
          ]}
          onPress={() => setActiveTabIndex(0)}
        >
          <IconButton
            icon={"account"}
            color={activeTabIndex == 0 ? Colors.WHITE : Colors.GRAY}
            size={20}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTabIndex == 0 ? Colors.WHITE : Colors.GRAY },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabContainer,
            {
              backgroundColor:
                activeTabIndex == 1 ? Colors.PINK : Colors.LIGHT_GRAY,
            },
          ]}
          onPress={() => setActiveTabIndex(1)}
        >
          <IconButton
            icon={"car"}
            color={activeTabIndex == 1 ? Colors.WHITE : Colors.GRAY}
            size={20}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTabIndex == 1 ? Colors.WHITE : Colors.GRAY },
            ]}
          >
            Vehicle
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {activeTabIndex == 0 ? (
          <View>
            {/* Customer Radio row */}
            <View style={styles.topRadioRow}>
              <View style={styles.radioContainer}>
                <RadioTextItem2
                  label={"Customer Info"}
                  value={"Customer Info"}
                  status={activeRadioIndex === 0 ? true : false}
                  onPress={() => setActiveRadioIndex(0)}
                />
                <RadioTextItem2
                  label={"Customer Address"}
                  value={"Customer Address"}
                  status={activeRadioIndex === 1 ? true : false}
                  onPress={() => setActiveRadioIndex(1)}
                />
              </View>
            </View>

            {activeRadioIndex == 0 ? (
              <View>
                {/* Customer Details */}
                <View style={styles.customerDetailsContainer}>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>Name</Text>
                    <Text style={styles.customerInfoInfoText}>Navee Reddy</Text>
                  </View>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>
                      Mobile Number
                    </Text>
                    <Text style={styles.customerInfoInfoText}>
                      +91 9904890616
                    </Text>
                  </View>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>
                      Alternative Mobile Number
                    </Text>
                    <Text style={styles.customerInfoInfoText}>N/A</Text>
                  </View>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>Email ID</Text>
                    <Text style={styles.customerInfoInfoText}>N/A</Text>
                  </View>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>DOB</Text>
                    <Text style={styles.customerInfoInfoText}>18-Nov-1989</Text>
                  </View>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>
                      Anniversary Date
                    </Text>
                    <Text style={styles.customerInfoInfoText}>N/A</Text>
                  </View>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>
                      Customer Type
                    </Text>
                    <Text style={styles.customerInfoInfoText}>
                      Self employed
                    </Text>
                  </View>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>
                      Customer Occupation
                    </Text>
                    <Text style={styles.customerInfoInfoText}>
                      Self employed
                    </Text>
                  </View>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>
                      Source Type
                    </Text>
                    <Text style={styles.customerInfoInfoText}>
                      Service Marketing
                    </Text>
                  </View>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>
                      Sub Source Type
                    </Text>
                    <Text style={styles.customerInfoInfoText}>
                      Workshop Camp
                    </Text>
                  </View>
                </View>

                {/* Edit Button */}
                <TouchableOpacity
                  style={styles.editBtnContainer}
                  onPress={() =>
                    navigation.navigate(
                      HomeStackIdentifiers.editCustomerInfoAddress,
                      { editType: "profile" }
                    )
                  }
                >
                  <Text style={styles.editBtnText}>EDIT PROFILE</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {/* Customer Address Details */}
                <View style={styles.customerDetailsContainer}>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>Pincode</Text>
                    <Text style={styles.customerInfoInfoText}>395006</Text>
                  </View>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>
                      Address Type
                    </Text>
                    <Text style={styles.customerInfoInfoText}>Urban</Text>
                  </View>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>H.No</Text>
                    <Text style={styles.customerInfoInfoText}>H-202</Text>
                  </View>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>
                      Street Name
                    </Text>
                    <Text style={styles.customerInfoInfoText}>
                      VT Nagar Road
                    </Text>
                  </View>
                  <View style={styles.customerInfoSection}>
                    <Text style={styles.customerInfoTitleText}>
                      Village/Town
                    </Text>
                    <Text style={styles.customerInfoInfoText}>Jakatnaka</Text>
                  </View>

                  <View style={styles.customerInfoRow}>
                    <View
                      style={[styles.customerInfoSection, { width: "50%" }]}
                    >
                      <Text style={styles.customerInfoTitleText}>
                        Mandal/Tahsil
                      </Text>
                      <Text style={styles.customerInfoInfoText}>Kamrej</Text>
                    </View>
                    <View style={styles.customerInfoSection}>
                      <Text style={styles.customerInfoTitleText}>City</Text>
                      <Text style={styles.customerInfoInfoText}>Surat</Text>
                    </View>
                  </View>
                  <View style={styles.customerInfoRow}>
                    <View
                      style={[styles.customerInfoSection, { width: "50%" }]}
                    >
                      <Text style={styles.customerInfoTitleText}>District</Text>
                      <Text style={styles.customerInfoInfoText}>Gujarat</Text>
                    </View>
                    <View style={styles.customerInfoSection}>
                      <Text style={styles.customerInfoTitleText}>State</Text>
                      <Text style={styles.customerInfoInfoText}>Gujarat</Text>
                    </View>
                  </View>
                </View>

                {/* Edit Address Button */}
                <TouchableOpacity
                  style={styles.editBtnContainer}
                  onPress={() =>
                    navigation.navigate(
                      HomeStackIdentifiers.editCustomerInfoAddress,
                      { editType: "address" }
                    )
                  }
                >
                  <Text style={styles.editBtnText}>EDIT CUSTOMER ADDRESS</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.WHITE,
  },
  tabRow: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.LIGHT_GRAY,
    padding: 2,
    marginTop: 15,
    borderRadius: 5,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "35%",
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 5,
  },
  tabText: {
    fontSize: 12,
    color: Colors.GRAY,
  },
  topRadioRow: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  radioContainer: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  customerDetailsContainer: {
    paddingHorizontal: "10%",
    marginTop: 5,
  },
  customerInfoSection: {
    marginTop: 13,
  },
  customerInfoRow: {
    flexDirection: "row",
  },
  customerInfoTitleText: {
    color: Colors.GRAY,
    fontSize: 14,
  },
  customerInfoInfoText: {
    color: Colors.BLACK,
    fontWeight: "bold",
    fontSize: 14,
  },
  editBtnContainer: {
    width: "80%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: Colors.PINK,
    marginTop: 20,
    paddingVertical: 10
  },
  editBtnText: {
    color: Colors.WHITE,
    fontSize: 13,
    fontWeight: "bold"
  }
});