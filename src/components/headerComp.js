import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { Colors } from '../styles';


const HeaderComp = ({ title, branchName = "", height = 56, menuClicked, branchClicked }) => {
    return (
        <View style={[style.container, { height: height }]}>
            <View style={style.subContainer}>
                <IconButton
                    icon="menu"
                    color={Colors.WHITE}
                    size={30}
                    onPress={menuClicked}
                />
                <Text style={style.title}>{title}</Text>
            </View>
            <View>
                {branchName.length > 0 ? (
                    <TouchableOpacity onPress={branchClicked}>
                        <View style={style.branchContainer}>
                            <Text style={style.branchName} numberOfLines={1} >{branchName}</Text>
                            <IconButton
                                icon="menu-down"
                                style={{ padding: 0, margin: 0 }}
                                color={Colors.WHITE}
                                size={15}
                            />
                        </View>
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    )
}

export { HeaderComp };

const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.DARK_GRAY,
        height: 56,
        paddingRight: 5
    },
    subContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        color: Colors.WHITE,
        fontSize: 20,
        fontWeight: "600",
    },
    branchContainer: {
        paddingLeft: 5,
        paddingRight: 2,
        paddingVertical: 2,
        borderColor: Colors.WHITE,
        borderWidth: 1,
        borderRadius: 4,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    branchName: {
        fontSize: 10,
        fontWeight: "600",
        color: Colors.WHITE,
        width: 65
    }
})