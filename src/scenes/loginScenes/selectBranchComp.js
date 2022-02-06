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
import { useDispatch } from "react-redux";
import { showToast } from "../../utils/toast";
import { AuthContext } from "../../utils/authContext";


const SelectBranchComp = ({ route, navigation }) => {

    const [checked, setChecked] = React.useState('first');
    const [branchList, setBranchList] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState("");
    const { signIn } = React.useContext(AuthContext);
    const dispatch = useDispatch();

    React.useEffect(() => {

        const branches = route.params.branches;
        setBranchList(branches);
    }, [])

    const branchSelected = (selectedItem) => {

        setSelectedBranchId(selectedItem.branchId)
    }

    const proceedBtnClicked = () => {

        if (selectedBranchId != "") {
            AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
                AsyncStore.storeData(AsyncStore.Keys.SELECTED_BRANCH_ID, selectedBranchId.toString());
                signIn(token);
                dispatch(clearState());
            })
        } else {
            showToast("Please select branch")
        }
    }

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
            <View style={{ width: "100%", height: 50, justifyContent: "center", alignItems: "center" }}>
                <ButtonComp
                    title={"Proceed"}
                    width={150}
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