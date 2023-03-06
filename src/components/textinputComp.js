import React from 'react';
import { View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { Colors } from '../styles';
import PropTypes from 'prop-types';

const TextinputComp = ({ value, mode = 'flat', label, disabled, placeholder, error, errorMsg = "", multiline, numberOfLines, editable, keyboardType = 'default', isSecure = false, showRightIcon = false, maxLength = null, rightIconObj = {}, onChangeText, onRightIconPressed, style = {}, onPressIn, showLeftAffixText = false, leftAffixText = "", autoCapitalize = "none", onEndEditing, onPressOut }) => {

    let rightIconComp = null;
    if (showRightIcon) {
        if (rightIconObj) {
            rightIconComp = <TextInput.Icon name={rightIconObj.name} color={rightIconObj.color} onPress={onRightIconPressed} disabled={disabled} />
        } else {
            rightIconComp = <TextInput.Icon name="eye-off-outline" color={Colors.GRAY} onPress={onRightIconPressed} />
        }
    }
    let leftText = null;
    if (showLeftAffixText) {
        leftText = <TextInput.Affix text={leftAffixText + " "} />
    }

    return (
        <View style={{width:'100%'}}>
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
                maxLength={maxLength}
                multiline={multiline}
                numberOfLines={numberOfLines}
                editable={editable}
                onChangeText={onChangeText}
                secureTextEntry={isSecure}
                left={leftText}
                right={rightIconComp}
                spellCheck={false}
                autoCapitalize={autoCapitalize}
                theme={{ colors: { primary: Colors.GRAY, underlineColor: 'transparent' } }}
                // onPressIn={onPressIn}
                onFocus={onPressIn}
                onEndEditing={onEndEditing}
                onPressOut={onPressOut}
            />
            {error ? <HelperText type="error" visible={true} padding={'none'} style={{ color: Colors.RED }}>
                {errorMsg}
            </HelperText> : null}
        </View>
    );
}

// autoCapitalize = ['none', 'sentences', 'words', 'characters']

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