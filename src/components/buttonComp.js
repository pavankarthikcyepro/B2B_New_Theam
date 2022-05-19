import React from 'react';
import { } from 'react-native';
import { Button } from 'react-native-paper';
import { Colors } from '../styles';


const ButtonComp = ({ title, width, height = 50, disabled = false, onPress }) => {
    return (
        <Button
            disabled={disabled}
            mode="contained"
            style={{}}
            contentStyle={{ width: width ? width : null, height: height, backgroundColor: disabled ? Colors.GRAY : Colors.PINK }}
            onPress={onPress}
        >
            {title}
        </Button>
    )
}

export { ButtonComp };