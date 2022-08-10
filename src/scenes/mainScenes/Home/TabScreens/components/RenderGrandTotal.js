import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Colors} from "../../../../../styles";

export const RenderGrandTotal = (parameter) => {
    const {parameterType, totalParams} = parameter;
    const selectedParameter = totalParams.filter((item) => item.paramName === parameterType)[0];
    return (
        <View style={[styles.itemBox, {width: parameterType === 'Accessories' ? 60 : 50}]}>
            <Text style={[styles.totalText, {marginBottom: 0}]}>{Number(selectedParameter.achievment)}</Text>
            <View style={{height: 1, backgroundColor: Colors.WHITE, alignSelf: 'stretch'}} />
            <Text style={[styles.totalText, {width: parameterType === 'Accessories' ? 80 : 50}]}>{Number(selectedParameter.target)}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    itemBox: { width: 60, height: 40, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 2},
    totalText: { color: '#fff', fontWeight: 'bold', fontSize: 14, textAlign: 'center'},
})
