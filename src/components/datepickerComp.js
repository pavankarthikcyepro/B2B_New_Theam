import React from 'react';
import { SafeAreaView, StyleSheet, Modal, View, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../styles';
import { Button } from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;

const DatePickerComponent = ({ visible = false, onRequestClose, value, mode = "datetime", onChange }) => {

    return (
        <Modal
            animationType={'slide'}
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.view1}>
                    <View style={styles.view2}>
                        <Button
                            mode="text"
                            labelStyle={{ textTransform: 'none', color: Colors.DARK_GRAY }}
                            onPress={onRequestClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="text"
                            labelStyle={{ textTransform: 'none', color: Colors.RED }}
                            onPress={() => console.log('Pressed')}
                        >
                            Done
                        </Button>
                    </View>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={value}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                        style={styles.datePicker}
                    />
                </View>
            </SafeAreaView>
        </Modal>

    )
}

export { DatePickerComponent };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 20
    },
    view1: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: Colors.WHITE,
    },
    view2: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.LIGHT_GRAY
    },
    datePicker: {
        width: screenWidth,
        height: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
})

// mode :- 

// "date" (default for iOS and Android and Windows)
// "time"
// "datetime" (iOS only)
// "countdown" (iOS only)

// display :- 

// "default" - Show a default date picker (spinner/calendar/clock) based on mode and Android version.
// "spinner"
// "calendar" (only for date mode)
// "clock" (only for time mode)
