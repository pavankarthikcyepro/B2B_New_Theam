import React, {useEffect, useState} from 'react';
import { 
    Text, 
    View, 
    StyleSheet, 
    Pressable 
} from 'react-native'
import { Colors } from "../../styles";
import { TextinputComp } from "../../components/textinputComp";
import { client } from "../../networking/client";
import URL from "../../networking/endpoints";
import * as AsyncStore from '../../asyncStore';
import { AuthContext } from "../../utils/authContext";
import { showToast } from '../../utils/toast';

const ChangePasswordScreen = () => {
    const [newPasswordSecure, setNewPasswordSecure] = useState(true);
    const [confirmPasswordSecure, setConfirmPasswordSecure] = useState(true);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [oldPasswordErr, setOldPasswordErr] = useState({showError: false, msg: ""});
    const [newPasswordErr, setNewPasswordErr] = useState({showError: false, msg: ""});
    const [confirmPasswordErr, setConfirmPasswordErr] = useState({showError: false, msg: ""});
    const [userName, setUserName] = useState("");
    const { signOut } = React.useContext(AuthContext);


    const getLoginEmployeeData = async () => {
        let jsonString = await AsyncStore.getData(AsyncStore.Keys.USER_NAME);
        setUserName(jsonString)
    }


    useEffect(() => {
        getLoginEmployeeData();
    }, [])


    const buttonClicked = () => {
        // const employeeId = selector.employeeId;
        // const password = selector.password;

        if (oldPassword.length === 0) {
            let object = {
                key: "OLDPASSWORD",
                message: "Please enter old username",
            };
            setOldPasswordErr({
                showError: true, 
                msg: "Please enter old username"
            });
            // dispatch(showErrorMessage(object));
            return;
        } else {
            setOldPasswordErr({
                showError: false,
                msg: ""
            })
        }

        if (newPassword.length === 0) {
            let object = {
                key: "NEWPASSWORD",
                message: "Please enter new password",
            };
            setNewPasswordErr({
                showError: true,
                msg: "Please enter new password"
            });
            // dispatch(showErrorMessage(object));
            return;
        } else if (newPassword.length < 8) {
            setNewPasswordErr({
                showError: true,
                msg: "Password should be minimum 8 chars length"
            });
            return;
        } else {
            setNewPasswordErr({
                showError: false,
                msg: ""
            })
        }

        if (confirmPassword.length === 0) {
            let object = {
                key: "NEWPASSWORD",
                message: "Please enter confirm password",
            };
            setConfirmPasswordErr({
                showError: true,
                msg: "Please enter confirm password"
            });
            // dispatch(showErrorMessage(object));
            return;
        } else if (confirmPassword.length < 8) {
            setConfirmPasswordErr({
                showError: true,
                msg: "Password should be minimum 8 chars length"
            });
            return;
        } else {
            setConfirmPasswordErr({
                showError: false,
                msg: ""
            })
        }

        if (newPassword != confirmPassword) {
            let object = {
                key: "NEWCONFIRMPASSWORD",
                message: "new password and confirm password are not same",
            };
            setConfirmPasswordErr({
                showError: true,
                msg: "new password and confirm password are not same"
            });
            setNewPasswordErr({
                showError: true,
                msg: "new password and confirm password are not same"
            });
            // dispatch(showErrorMessage(object));
            return;
        } else {
            setNewPasswordErr({
                showError: false,
                msg: ""
            });
            setConfirmPasswordErr({
                showError: false,
                msg: ""
            });
        }

        let object = {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        }

        // dispatch(postUserData(object));
        changePasswordApi(object)
    };

    const changePasswordApi = async (request) => {
        const response = await client.post(URL.CHANGE_PASSWORD(userName), request);
        const changePassword = await response.json();

        // Logout the app if the user change password
        if (changePassword.status == "200") {
            AsyncStore.storeData(AsyncStore.Keys.USER_NAME, "");
            AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, "");
            AsyncStore.storeData(AsyncStore.Keys.EMP_ID, "");
            AsyncStore.storeData(AsyncStore.Keys.LOGIN_EMPLOYEE, "");
            AsyncStore.storeData(AsyncStore.Keys.SELECTED_BRANCH_ID, "");
            AsyncStore.storeData(AsyncStore.Keys.SELECTED_BRANCH_NAME, "");
            showToast("Password changed successfully please login");
            signOut();
        }
    }


    return (
        <View>
            <Text style={styles.header}>Change Password</Text>
            <View style={styles.form}>
                <TextinputComp
                    // value={"Old Password"}
                    error={oldPasswordErr.showError}
                    errorMsg={oldPasswordErr.msg}
                    label={"Old Password"}
                    mode={"outlined"}
                    showRightIcon={true}
                    onChangeText={(text) => setOldPassword(text)}
                    // rightIconObj={{ name: selector.securePassword ? "eye-off-outline" : "eye-outline", color: Colors.GRAY }}
                    // onRightIconPressed={() => dispatch(updateSecurePassword())}
                />
                <TextinputComp
                    // value={"Old Password"}
                    error={newPasswordErr.showError}
                    errorMsg={newPasswordErr.msg}
                    label={"New Password"}
                    mode={"outlined"}
                    showRightIcon={true}
                    isSecure={newPasswordSecure}
                    rightIconObj={{ name: newPasswordSecure ? "eye-off-outline" : "eye-outline", color: Colors.GRAY }}
                    onChangeText={(text) => setNewPassword(text)}
                    onRightIconPressed={() => setNewPasswordSecure(!newPasswordSecure)}
                    style={styles.input}
                />
                <TextinputComp
                    // value={"Old Password"}
                    error={confirmPasswordErr.showError}
                    errorMsg={confirmPasswordErr.msg}
                    label={"Confirm Password"}
                    mode={"outlined"}
                    showRightIcon={true}
                    rightIconObj={{ name: confirmPasswordSecure ? "eye-off-outline" : "eye-outline", color: Colors.GRAY }}
                    onChangeText={(text) => setConfirmPassword(text)}
                    isSecure={confirmPasswordSecure}
                    onRightIconPressed={() => setConfirmPasswordSecure(!confirmPasswordSecure)}
                    style={styles.input}
                />
                <Pressable
                    style={styles.button}
                    onPress={() => buttonClicked()}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontWeight: "600",
        fontSize: 20,
        marginTop: 20,
        marginLeft: 15,
        color: Colors.BLACK
    },
    form: {
        margin: 20
    },
    input: {
        marginTop: 16
    },
    button: {
        backgroundColor: "#f81567",
        height: 50,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        elevation: 3,
        marginTop: 30
    },
    buttonText: {
        fontWeight: "bold",
        color: Colors.WHITE
    },
})

export default ChangePasswordScreen;