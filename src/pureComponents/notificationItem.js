import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, GlobalStyle } from '../styles';


export const NotificationItem = ({ title, date, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.item]}>
      <Text style={styles.title}>{title}</Text>
      {/* <Text style={[styles.title, styles.text2]}>{date}</Text> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: Colors.WHITE,
        padding: 10,
        marginVertical: 10,
        borderRadius: 6,
    },
    title: {
        fontSize: 14,
        fontWeight: '400',
    },
    text2: {
        fontSize: 12,
        marginTop: 5,
        textAlign: 'right',
        color: Colors.GRAY
    }
})