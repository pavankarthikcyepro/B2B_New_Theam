import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TextInput, HelperText } from 'react-native-paper';
import { Colors } from '../styles';
const ProformaTextinputOffers = ({ value, mode = 'flat', label, disabled, placeholder, error, errorMsg = "", multiline, numberOfLines, editable, keyboardType = 'default', isSecure = false, showRightIcon = false, maxLength = null, rightIconObj = {}, onChangeText, onRightIconPressed, style = {}, onPressIn, showLeftAffixText = false, leftAffixText = "", autoCapitalize = "none", onEndEditing, onPressOut, containerStyle, TitleText }) => {
  
    let rightIconComp = null;
    if (showRightIcon) {
        if (rightIconObj) {
            rightIconComp = <TextInput.Icon name={rightIconObj.name} color={rightIconObj.color} onPress={onRightIconPressed} />
        } else {
            rightIconComp = <TextInput.Icon name="eye-off-outline" color={Colors.GRAY} onPress={onRightIconPressed} />
        }
    }
    let leftText = null;
    if (showLeftAffixText) {
        leftText = <TextInput.Affix text={leftAffixText + " "} />
    }

    return (
    <View style={[{marginVertical:0},containerStyle]}>
            <Text style={{fontSize:16,color:Colors.GRAY}}>{TitleText}</Text>
          <TextInput
              style={[{height: 20, width: '100%', fontSize: 16, fontWeight: '400', backgroundColor: Colors.WHITE, paddingVertical: 0, paddingHorizontal: 0, borderBottomWidth: 1,borderBottomColor: "#d1d1d1", }, style]}
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
  )
}

export  {ProformaTextinputOffers}

const styles = StyleSheet.create({})