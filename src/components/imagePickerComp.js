import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Modal, View, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import { Colors } from '../styles';
import { Portal, Text, Button, Divider } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { showToast, showToastRedAlert } from '../utils/toast';

const NameItem = ({ title, titleStyle, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.view1}>
                <Text style={[styles.name, { ...titleStyle }]}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const ImagePickerComponent = ({ visible, keyId = "", onDismiss, selectedImage }) => {


    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };

    const cameraClicked = async () => {

        onDismiss();

        let options = {
            mediaType: 'photo',
            noData: true,
            maxWidth: 256,
            maxHeight: 256,
            quality: 1,
            cameraType: 'front',
            includeBase64: false,
            saveToPhotos: false,
            durationLimit: 20
        }
        let isCameraPermitted = await requestCameraPermission();
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
            launchCamera(options, (res) => {
                handleResponse(res);
            })
        }
    }

    const handleResponse = (res) => {
        if (res.assets) {
            let data = res.assets[0];
            let imageObject = {
                "fileName": data.fileName,
                "fileSize": data.fileSize,
                "height": data.height,
                "type": data.type,
                "uri": data.uri,
                "width": data.width
            }
            selectedImage(imageObject, keyId);
        }
        else if (res.didCancel) {
        }
        else if (res.errorCode) {
            switch (res.errorCode) {
                case "camera_unavailable":
                    showToastRedAlert("Camera unavailable");
                    break;
                case "permission":
                    showToastRedAlert("Permission denied");
                    break;
                case "others":
                    showToastRedAlert("Something wrong");
                    break;
            }
        }
        else if (res.errorMessage) {
            showToast(res.errorMessage);
        }
    }

    const galleryClicked = () => {

        onDismiss();

        let options = {
            title: 'You can choose one image',
            maxWidth: 256,
            maxHeight: 256,
            noData: true,
            quality: 1,
            mediaType: 'photo',
            includeBase64: false,
            storageOptions: {
                skipBackup: true,
            }
        };

        launchImageLibrary(options, (res) => {
            handleResponse(res);
        })
    }

    return (
        <Modal
            animationType={Platform.OS === "ios" ? 'slide' : 'fade'}
            transparent={true}
            visible={visible}
            onRequestClose={onDismiss}
        >
            <View style={styles.conatiner}>
                <View style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10, backgroundColor: Colors.WHITE }}>
                    <SafeAreaView style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, }}>
                        <View style={{ backgroundColor: Colors.WHITE }}>
                            <View style={styles.view1}>
                                <Text style={styles.title}>{'Choose option to select photo'}</Text>
                            </View>
                            <Divider />
                            <NameItem title={'From Gallery'} onPress={galleryClicked} />
                            <Divider />
                            <NameItem title={'Camera'} onPress={cameraClicked} />
                            <Divider />
                            <NameItem title={'Cancel'} titleStyle={{ color: Colors.RED }} onPress={onDismiss} />
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        </Modal>
    )
}

export { ImagePickerComponent };

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    view1: {
        height: 55,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
        color: Colors.BLACK
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    }
});