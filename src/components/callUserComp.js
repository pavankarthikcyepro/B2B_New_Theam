import React from 'react';
import { Modal, StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../styles';
import { IconButton, Checkbox } from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;

const CallItem = ({ title, mobile, onPress }) => {

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.view2}>
                <IconButton
                    icon="sim"
                    color={Colors.RED}
                    size={20}
                    onPress={() => console.log('Pressed')}
                />
                <View >
                    <Text style={styles.text1}>{title}</Text>
                    <Text style={styles.text2}>{mobile}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const CallUserComponent = ({ visible = false, onRequestClose, onPress }) => {

    const [checked, setChecked] = React.useState(false);

    return (
        <Modal
            animationType={'slide'}
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}
        >
            <View style={styles.container}>
                <View style={styles.view1}>
                    <View style={styles.view3}>
                        <Text style={styles.text1}>{'Choose your preffered connection'}</Text>
                        <IconButton
                            icon="close-circle-outline"
                            color={Colors.GRAY}
                            size={25}
                            onPress={onRequestClose}
                        />
                    </View>
                    <CallItem title={'SIM 1'} mobile={'9886525252'} onPress={onPress} />
                    <CallItem title={'SIM 2'} mobile={'6765436353'} onPress={onPress} />
                    <View style={styles.view4}>
                        <Checkbox.Android
                            status={checked ? 'checked' : 'unchecked'}
                            uncheckedColor={Colors.DARK_GRAY}
                            color={Colors.RED}
                            onPress={() => setChecked(!checked)}
                        />
                        <Text style={styles.text3}>{'Make this my default selection'}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export { CallUserComponent };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 20
    },
    view1: {
        width: screenWidth - 40,
        backgroundColor: Colors.WHITE,
        paddingLeft: 15,
        paddingTop: 5,
        paddingBottom: 10
    },
    view2: {
        flexDirection: 'row',
        marginVertical: 10
    },
    view3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text1: {
        fontSize: 16,
        fontWeight: '600'
    },
    text2: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '600',
        color: Colors.GRAY
    },
    view4: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text3: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.RED
    }
})