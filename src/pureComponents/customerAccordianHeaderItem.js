import React from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors } from '../styles';

const CustomerAccordianHeaderItem = ({ leftIcon, title, selected = false, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <View style={[styles.container, { backgroundColor: selected ? Colors.RED : Colors.WHITE }]} >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <IconButton
                        icon={leftIcon}
                        color={selected ? Colors.WHITE : Colors.RED}
                        size={20}
                        style={{ paddingRight: 0 }}
                    />
                    <Text
                        style={[
                            styles.accordianTitleStyle,
                            { color: selected ? Colors.WHITE : Colors.DARK_GRAY },
                        ]}
                    >
                        {title}
                    </Text>
                </View>
                <IconButton
                    icon={"menu-down"}
                    color={selected ? Colors.WHITE : Colors.BLACK}
                    size={25}
                    style={{ marginLeft: 10 }}
                />
            </View>
        </Pressable>
    );
};

export { CustomerAccordianHeaderItem };

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 50
    },
    accordianTitleStyle: {
        fontSize: 18,
        fontWeight: "500",
        color: Colors.BLACK,
    },
})