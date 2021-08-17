
import React from 'react';
import { StyleSheet } from 'react-native';
import * as Colors from './colors'

export const GlobalStyle = StyleSheet.create({
    shadow: {
        shadowColor: Colors.DARK_GRAY,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.5,
        elevation: 3,
        backgroundColor: "#0000"
    },
    underline: {
        backgroundColor: 'rgba(208, 212, 214, 0.7)',
        height: 0.5
    }
})

