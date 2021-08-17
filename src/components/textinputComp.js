import React from 'react';
import { View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Colors } from '../styles';
import PropTypes from 'prop-types';

const TextinputComp = ({ value, mode = 'flat', label, disabled, placeholder, error, errorMsg = "", multiline, numberOfLines, editable, keyboardType = 'default', isSecure = false, showRightIcon = false, rightIconObj = {}, onChangeText, onRightIconPressed, style = {}, onPressIn }) => {

    let rightIconComp = null;
    if (showRightIcon) {
        if (rightIconObj) {
            rightIconComp = <TextInput.Icon name={rightIconObj.name} color={rightIconObj.color} onPress={onRightIconPressed} />
        } else {
            rightIconComp = <TextInput.Icon name="eye-off-outline" color={Colors.GRAY} onPress={onRightIconPressed} />
        }
    }

    return (
        <View>
            <TextInput
                style={[{ height: 50, width: '100%', fontSize: 16, fontWeight: '400', backgroundColor: Colors.WHITE }, style]}
                mode={mode}
                label={label}
                value={value}
                disabled={disabled}
                placeholder={placeholder}
                error={error}
                keyboardType={keyboardType}
                selectionColor={Colors.BLACK}
                underlineColorAndroid={Colors.TEXT_INPUT_BORDER_COLOR}
                underlineColor={Colors.LIGHT_GRAY}
                outlineColor={Colors.BLACK}
                multiline={multiline}
                numberOfLines={numberOfLines}
                editable={editable}
                onChangeText={onChangeText}
                secureTextEntry={isSecure}
                right={rightIconComp}
                spellCheck={false}
                theme={{ colors: { primary: Colors.GRAY, underlineColor: 'transparent' } }}
                // onPressIn={onPressIn}
                onFocus={onPressIn}
            />
            {error ? <HelperText type="error" visible={true} padding={'none'} style={{ color: Colors.RED }}>
                {errorMsg}
            </HelperText> : null}
        </View>
    );
}

// TextinputComp.prototype = {
//     mode: PropTypes.oneOf(['flat', 'outlined']),
//     value: PropTypes.string.isRequired,
//     label: PropTypes.string,
//     disabled: PropTypes.bool,
//     placeholder: PropTypes.string,
//     error: PropTypes.bool,
//     multiline: PropTypes.bool,
//     numberOfLines: PropTypes.number,
//     editable: PropTypes.bool,
//     keyboardType: PropTypes.oneOf(['default', 'number-pad', 'decimal-pad', 'numeric', 'email-address', 'phone-pad']),
//     isSecure: PropTypes.bool,
//     showRightIcon: PropTypes.bool
// }

export { TextinputComp };