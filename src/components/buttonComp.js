import React from 'react';
import { } from 'react-native';
import { Button } from 'react-native-paper';
import { Colors } from '../styles';


const ButtonComp = ({ title, width, height = 50, onPress }) => {
    return (
        <Button
            mode="contained"
            style={{}}
            contentStyle={{ width: width ? width : null, height: height, backgroundColor: Colors.DARK_GRAY }}
            onPress={onPress}
        >
            {title}
        </Button>
    )
}

export { ButtonComp };