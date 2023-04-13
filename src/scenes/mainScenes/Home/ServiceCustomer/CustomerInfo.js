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
          <>
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
              <>
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
              </>
            ) : (
              <>
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
              </>
            )}
          </>
        ) : (
          <>
            <View style={styles.customerDetailsContainer}>
              <TouchableOpacity
                style={styles.editVehicleIcon}
                onPress={() =>
                  navigation.navigate(HomeStackIdentifiers.editCustomerVehicle)
                }
              >
                <IconButton
                  icon={"pencil-circle"}
                  color={Colors.PINK}
                  size={35}
                />
              </TouchableOpacity>

              <View style={styles.vehicleInfoRow}>
                <View style={[styles.customerInfoSection, { width: "50%" }]}>
                  <Text style={styles.customerInfoTitleText}>
                    Vehicle Reg. No
                  </Text>
                  <Text style={styles.customerInfoInfoText}>APVD345</Text>
                </View>
                <View style={styles.customerInfoSection}>
                  <Text style={styles.customerInfoTitleText}>Model</Text>
                  <Text style={styles.customerInfoInfoText}>Creta</Text>
                </View>
              </View>
              <View style={styles.vehicleInfoRow}>
                <View style={[styles.customerInfoSection, { width: "50%" }]}>
                  <Text style={styles.customerInfoTitleText}>Variant</Text>
                  <Text style={styles.customerInfoInfoText}>Climber CRDI</Text>
                </View>
                <View style={styles.customerInfoSection}>
                  <Text style={styles.customerInfoTitleText}>Color</Text>
                  <Text style={styles.customerInfoInfoText}>White</Text>
                </View>
              </View>
              <View style={styles.vehicleInfoRow}>
                <View style={[styles.customerInfoSection, { width: "50%" }]}>
                  <Text style={styles.customerInfoTitleText}>Fuel Type</Text>
                  <Text style={styles.customerInfoInfoText}>Petrol</Text>
                </View>
                <View style={styles.customerInfoSection}>
                  <Text style={styles.customerInfoTitleText}>Vin Number</Text>
                  <Text style={styles.customerInfoInfoText}>76BHF6</Text>
                </View>
              </View>
              <View style={styles.vehicleInfoRow}>
                <View style={[styles.customerInfoSection, { width: "50%" }]}>
                  <Text style={styles.customerInfoTitleText}>
                    Engine Number
                  </Text>
                  <Text style={styles.customerInfoInfoText}>Ehgsd677HH</Text>
                </View>
                <View style={styles.customerInfoSection}>
                  <Text style={styles.customerInfoTitleText}>Making Month</Text>
                  <Text style={styles.customerInfoInfoText}>Jan</Text>
                </View>
              </View>
              <View style={styles.vehicleInfoRow}>
                <View style={[styles.customerInfoSection, { width: "50%" }]}>
                  <Text style={styles.customerInfoTitleText}>Making Year</Text>
                  <Text style={styles.customerInfoInfoText}>2017</Text>
                </View>
                <View style={styles.customerInfoSection}>
                  <Text style={styles.customerInfoTitleText}>Sale Date</Text>
                  <Text style={styles.customerInfoInfoText}>15-5-2020</Text>
                </View>
              </View>
              <View style={styles.vehicleInfoRow}>
                <View style={[styles.customerInfoSection, { width: "50%" }]}>
                  <Text style={styles.customerInfoTitleText}>
                    Selling Dealer
                  </Text>
                  <Text style={styles.customerInfoInfoText}>Ratan Motors</Text>
                </View>
                <View style={styles.customerInfoSection}>
                  <Text style={styles.customerInfoTitleText}>
                    Dealer Location
                  </Text>
                  <Text style={styles.customerInfoInfoText}>Guntur</Text>
                </View>
              </View>
            </View>
            {/* <View style={styles.customerDetailsContainer}>
              <View style={styles.customerInfoSection}>
                <Text style={styles.customerInfoTitleText}>
                  Vehicle Reg. No
                </Text>
                <Text style={styles.customerInfoInfoText}>APVD345</Text>
              </View>
              <View style={styles.customerInfoSection}>
                <Text style={styles.customerInfoTitleText}>Service Date</Text>
                <Text style={styles.customerInfoInfoText}>15-02-2019</Text>
              </View>
              <View style={styles.customerInfoSection}>
                <Text style={styles.customerInfoTitleText}>Service Type</Text>
                <Text style={styles.customerInfoInfoText}>Free Service</Text>
              </View>
              <View style={styles.customerInfoSection}>
                <Text style={styles.customerInfoTitleText}>
                  Sub Service Type
                </Text>
                <Text style={styles.customerInfoInfoText}>1st Free</Text>
              </View>
              <View style={styles.customerInfoSection}>
                <Text style={styles.customerInfoTitleText}>Service Amount</Text>
                <Text style={styles.customerInfoInfoText}>2000</Text>
              </View>
              <View style={styles.customerInfoSection}>
                <Text style={styles.customerInfoTitleText}>Service Center</Text>
                <Text style={styles.customerInfoInfoText}>S543T6</Text>
              </View>
              <View style={styles.customerInfoSection}>
                <Text style={styles.customerInfoTitleText}>
                  Reading At Service
                </Text>
                <Text style={styles.customerInfoInfoText}>3500</Text>
              </View>
              <View style={styles.customerInfoSection}>
                <Text style={styles.customerInfoTitleText}>Dealer Name</Text>
                <Text style={styles.customerInfoInfoText}>Navee</Text>
              </View>
              <View style={styles.customerInfoSection}>
                <Text style={styles.customerInfoTitleText}>RO Number</Text>
                <Text style={styles.customerInfoInfoText}>454535</Text>
              </View>
              <View style={styles.customerInfoSection}>
                <Text style={styles.customerInfoTitleText}>RO Date</Text>
                <Text style={styles.customerInfoInfoText}>15-02-2019</Text>
              </View>
            </View> */}
          </>
        )}
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
  editVehicleIcon: {
    position: "absolute",
    right: 0,
    top: -15
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
  vehicleInfoRow: {
    flexDirection: "row",
    marginTop: 15
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
    paddingVertical: 10,
  },
  editBtnText: {
    color: Colors.WHITE,
    fontSize: 13,
    fontWeight: "bold",
  },
});