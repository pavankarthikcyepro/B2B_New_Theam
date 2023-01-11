import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Colors } from "../../styles";
import { RadioButton } from 'react-native-paper';
import { ButtonComp } from "../../components";
import * as AsyncStore from '../../asyncStore';
import {
    clearState,
} from "../../redux/loginReducer";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../utils/toast";
import { AuthContext } from "../../utils/authContext";
import { updateSelectedBranchId } from "../../redux/targetSettingsReducer";
import { setBranchId, setBranchName } from "../../utils/helperFunctions";


const SelectBranchComp = ({ route, navigation }) => {

    const selector = useSelector((state) => state.targetSettingsReducer);
    const [checked, setChecked] = React.useState('first');
    const [branchList, setBranchList] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState("");
    const [selectedBranchName, setSelectedBranchName] = useState("");
    const { signIn } = React.useContext(AuthContext);
    const dispatch = useDispatch();

    React.useEffect(async () => {
      let branchList = [];
      if (route.params.isFromLogin) {
        branchList = route.params.branches;
      } else {
        try {
          const branchData = await AsyncStore.getData("BRANCHES_DATA");
          branchList = JSON.parse(branchData);
        } catch (err) {
          branchList = [];
        }

        let branchId = "";
        let branchName = "";

        if (selector.selectedBranchId) {
          branchId = selector.selectedBranchId;
        } else {
          branchId = await AsyncStore.getData(
            AsyncStore.Keys.SELECTED_BRANCH_ID
          );
        }

        if (selector.selectedBranchName) {
          branchName = selector.selectedBranchName;
        } else {
          branchName = await AsyncStore.getData(
            AsyncStore.Keys.SELECTED_BRANCH_NAME
          );
        }

        setSelectedBranchId(branchId);
        setSelectedBranchName(branchName);
      }
      setBranchList(branchList);
    }, []);

    const branchSelected = (selectedItem) => {
      setSelectedBranchId(selectedItem.branchId);
      setSelectedBranchName(selectedItem.branchName);
    };

    const proceedBtnClicked = () => {
      if (route.params.isFromLogin) {
        if (selectedBranchId != "") {
          AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
            setBranchData();
            signIn(token);
            dispatch(clearState());
          });
        } else {
          showToast("Please select branch");
        }
      } else {
        setBranchData();
        navigation.goBack();
      }
    };

    const setBranchData = () => {
      setBranchId(selectedBranchId);
      setBranchName(selectedBranchName);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                <Text style={styles.headerText}>{"Please select a branch to proceed"}</Text>
                <FlatList
                    style={{ width: "100%" }}
                    data={branchList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ paddingHorizontal: 10, paddingVertical: 3, flex: 1 }}>
                                <TouchableOpacity onPress={() => branchSelected(item)}>
                                    <View style={styles.itemStyle}>
                                        <RadioButton.Android
                                            value="first"
                                            color={Colors.RED}
                                            uncheckedColor={Colors.GRAY}
                                            onPress={() => setSelectedBranchId(item.branchId)}
                                            status={item.branchId == selectedBranchId ? 'checked' : 'unchecked'}
                                        />
                                        <Text style={styles.titleNameStyle}>{item.branchName}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />

            </View>
            <View style={{ width: "100%", height: 40, justifyContent: "center", alignItems: "center", bottom: 10 }}>
                <ButtonComp
                    title={route.params.isFromLogin ? "Proceed" : "Update"}
                    width={150}
                    height={40}
                    onPress={proceedBtnClicked}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    itemStyle: {
        flex: 1,
        backgroundColor: Colors.LIGHT_GRAY,
        borderColor: Colors.LIGHT_GRAY,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        width: "100%"
    },
    titleNameStyle: {
        fontSize: 16,
        fontWeight: "400"
    },
    headerText: {
        paddingTop: 20,
        paddingLeft: 10,
        paddingBottom: 10,
        fontSize: 16,
        fontWeight: "600"
    }
})

export default SelectBranchComp;