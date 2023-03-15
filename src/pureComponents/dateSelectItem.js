import React from 'react';
import { TextInput } from 'react-native';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors, GlobalStyle } from '../styles';

export const DateSelectItem = ({ label, value, disabled = false, onPress }) => {
    return (
        <Pressable onPress={onPress} disabled={disabled}>
            <View style={styles.container}>
                <Text style={styles.label}>{value ? label : ""}</Text>
                <View style={[styles.view3]}>
                    <Text style={[styles.text3, { color: value ? (disabled ? Colors.GRAY : Colors.BLACK) : Colors.GRAY }]}>{value ? value : label}</Text>
                    <IconButton
                        icon="calendar-range"
                        color={disabled ? Colors.GRAY : Colors.BLACK}
                        size={25}
                    />
                </View>
                <Text style={GlobalStyle.underline}></Text>
            </View>
        </Pressable>
    )
}

export const NumberInput = ({ label, value, disabled = false, onPress, onChange }) => {
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.view3]}>
          {/* <Text
            style={[
              styles.text3,
              {
                color: value
                  ? disabled
                    ? Colors.GRAY
                    : Colors.BLACK
                  : Colors.GRAY,
              },
            ]}
          >
            {value ? value : label}
          </Text> */}
          <TextInput
            style={[
              styles.text3,
              {
                color: value
                  ? disabled
                    ? Colors.GRAY
                    : Colors.BLACK
                  : Colors.GRAY,
              },
            ]}
            keyboardType="numeric"
            onChangeText={(text) => onChange(text)}
            value={value}
          />
          <IconButton
            icon="calendar-range"
            color={disabled ? Colors.GRAY : Colors.BLACK}
            size={25}
          />
        </View>
        <Text style={GlobalStyle.underline}></Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: Colors.WHITE,
        justifyContent: 'flex-end'
    },
    label: {
        fontSize: 12,
        marginLeft: 12,
        fontWeight: '400',
        color: Colors.GRAY
    },
    view3: {
        maxWidth: '100%',
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.WHITE
    },
    text3: {
        paddingLeft: 12,
        fontSize: 16,
        fontWeight: '400',
        color: Colors.GRAY,
        maxWidth: "85%"
    },
})
