
import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { RadioButton } from "react-native-paper";
import { Colors } from '../styles';

const RadioTextItem = ({ label, value, status = false, disabled = false, onPress }) => {
    return (
      <Pressable onPress={onPress} disabled={disabled}>
        <View style={styles.view}>
          <Text style={[styles.text, {color: disabled ? Colors.GRAY : Colors.BLACK } ]}>{label}</Text>
          <RadioButton.Android
            value={value}
            status={status ? "checked" : "unchecked"}
            disabled={disabled}
            uncheckedColor={Colors.GRAY}
            color={Colors.RED}
            onPress={onPress}
          />
        </View>
      </Pressable>
    );
}

export { RadioTextItem };

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        fontSize: 14,
        fontWeight: '400'
    }
})