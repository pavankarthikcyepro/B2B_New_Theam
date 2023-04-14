import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonComp } from '../../../../components';
import { HomeStackIdentifiers } from '../../../../navigations/appNavigator';
import { clearSearchResult } from '../../../../redux/searchCustomerReducer';
import { Colors, GlobalStyle } from '../../../../styles';
import { callNumber, sendWhatsApp } from '../../../../utils/helperFunctions';

const IconComp = ({ iconName, onPress, opacity = 1 }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.iconContainer}>
        <IconButton icon={iconName} color={Colors.GREEN} size={17} />
      </View>
    </TouchableOpacity>
  );
};

const SearchCustomerResult = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.searchCustomerReducer);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(selector.searchResult);
  }, [selector.searchResult]);
  
  useEffect(() => {
    return () => {
      // dispatch(clearSearchResult());
    };
  }, []);

  const noData = () => {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No Customer Found !</Text>

        <View style={{ marginHorizontal: 15 }}>
          <ButtonComp
            title={"Add Customer"}
            onPress={() =>
              navigation.navigate(HomeStackIdentifiers.addCustomerInfo, {
                fromScreen: "addCustomer",
              })
            }
          />
        </View>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={{ width: "50%" }}>
          <Text numberOfLines={1} style={styles.detailText}>
            {item.firstName}
            {item.lastName}
          </Text>
          <Text style={styles.detailText}>{item.vin}</Text>
          <Text style={styles.detailText}>{item.model}</Text>
          <Text style={styles.detailText}>{item.contactNumber}</Text>
          {item.subServiceType && (
            <Text style={styles.detailHighLightText}>{item.serviceType}</Text>
          )}
        </View>
        <View style={styles.optionContainer}>
          <View style={styles.idContainer}>
            <Text style={styles.idText}>{item.vehicleRegNumber}</Text>
          </View>
          <View style={styles.iconOptionRow}>
            <IconComp
              iconName={"format-list-bulleted-square"}
              onPress={() =>
                navigation.navigate(HomeStackIdentifiers.addCustomerInfo, {
                  fromScreen: "search"
                })
              }
            />
            <View style={{ padding: 5 }} />
            <IconComp
              iconName={"phone-outline"}
              onPress={() => callNumber(item.contactNumber)}
            />
            <View style={{ padding: 5 }} />
            <IconComp
              iconName={"whatsapp"}
              onPress={() => sendWhatsApp(item.contactNumber)}
            />
          </View>
          {item.serviceCenterName && (
            <Text numberOfLines={2} style={styles.detailText}>
              {item.serviceCenterName}
            </Text>
          )}
          {item.dueDate && (
            <Text style={styles.detailHighLightText}>
              Due date: {item.dueDate}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {results.length > 0 ? (
        <View style={styles.resultCountContainer}>
          <Text style={styles.resultCountText}>{`${results.length} ${
            results.length > 1 ? "Results" : "Result"
          } found`}</Text>
        </View>
      ) : null}

      <FlatList data={results} ListEmptyComponent={noData} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noDataContainer: {},
  noDataText: {
    marginVertical: 25,
    fontSize: 18,
    color: Colors.BLACK,
    alignSelf: "center",
    fontWeight: "bold",
  },
  resultCountContainer: {
    margin: 15,
  },
  resultCountText: {
    color: Colors.BLACK,
    fontSize: 20,
    fontWeight: "600",
  },

  itemContainer: {
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    ...GlobalStyle.shadow,
    flexDirection: "row",
    backgroundColor: Colors.WHITE,
    justifyContent: "space-between",
  },
  detailText: {
    color: Colors.GRAY,
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detailHighLightText: {
    color: Colors.BLUE,
    fontSize: 13,
    fontWeight: "500",
  },

  optionContainer: { alignItems: "center", width: "50%" },
  iconOptionRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 7
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#002C5F",
    borderRadius: 5,
  },

  idContainer: {
    backgroundColor: Colors.RED,
    padding: 3,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    width: "80%"
  },
  idText: {
    color: Colors.WHITE,
    fontSize: 13,
    fontWeight: "600"
  },
});

export default SearchCustomerResult;