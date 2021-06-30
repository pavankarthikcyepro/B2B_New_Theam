import React from 'react';
import { } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Colors } from '../styles';
import PropTypes from 'prop-types';

const TextinputComp = ({ value, mode = 'flat', label, disabled, placeholder, error, multiline, numberOfLines, editable, keyboardType = 'default', isSecure = false, onChangeText }) => {

    return (
        <TextInput
            style={{ height: 50, width: '100%', fontSize: 16, fontWeight: '400', backgroundColor: Colors.WHITE }}
            mode={mode}
            label={label}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            error={error}
            keyboardType={keyboardType}
            selectionColor={Colors.BLACK}
            underlineColorAndroid={Colors.TEXT_INPUT_BORDER_COLOR}
            underlineColor={Colors.TEXT_INPUT_BORDER_COLOR}
            outlineColor={Colors.GRAY}
            multiline={multiline}
            numberOfLines={numberOfLines}
            editable={editable}
            onChangeText={onChangeText}
            secureTextEntry={isSecure}
            theme={{ colors: { primary: Colors.GRAY, underlineColor: 'transparent', } }}
        />
    );
}

TextinputComp.prototype = {
    mode: PropTypes.oneOf(['flat', 'outlined']),
    value: PropTypes.string.isRequired,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    error: PropTypes.bool,
    multiline: PropTypes.bool,
    numberOfLines: PropTypes.number,
    editable: PropTypes.bool,
    keyboardType: PropTypes.oneOf(['default', 'number-pad', 'decimal-pad', 'numeric', 'email-address', 'phone-pad']),
    isSecure: PropTypes.bool
}

export { TextinputComp };