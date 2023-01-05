import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, HelperText, Provider } from "react-native-paper";
import { Colors } from "../styles";
import PropTypes from "prop-types";
import { Dropdown } from "react-native-element-dropdown";

const colorList = [
  {
    label: "White",
    value: "white",
  },
  {
    label: "Red",
    value: "red",
  },
  {
    label: "Blue",
    value: "blue",
  },
  {
    label: "Green",
    value: "green",
  },
  {
    label: "Orange",
    value: "orange",
  },
];

const NewDropDownComponent = ({
  value,
  mode = "flat",
  label,
  disabled,
  placeholder,
  error,
  errorMsg = "",
  multiline,
  numberOfLines,
  editable,
  keyboardType = "default",
  isSecure = false,
  showRightIcon = false,
  maxLength = null,
  rightIconObj = {},
  onChangeText,
  onRightIconPressed,
  style = {},
  onPressIn,
  showLeftAffixText = false,
  leftAffixText = "",
  autoCapitalize = "none",
  onEndEditing,
  onPressOut,
  visible = false,
  showDropDown,
  onDismiss,
}) => {
  const [colors, setColors] = useState("");

  let rightIconComp = null;
  if (showRightIcon) {
    if (rightIconObj) {
      rightIconComp = (
        <TextInput.Icon
          name={rightIconObj.name}
          color={rightIconObj.color}
          onPress={onRightIconPressed}
        />
      );
    } else {
      rightIconComp = (
        <TextInput.Icon
          name="eye-off-outline"
          color={Colors.GRAY}
          onPress={onRightIconPressed}
        />
      );
    }
  }
  let leftText = null;
  if (showLeftAffixText) {
    leftText = <TextInput.Affix text={leftAffixText + " "} />;
  }

  return (
      <View style={{ width: "100%" ,}}>
        {/* <TextInput
          style={[
            {
              height: 50,
              width: "100%",
              fontSize: 16,
              fontWeight: "400",
              backgroundColor: Colors.WHITE,
            },
            style,
          ]}
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
          theme={{
            colors: { primary: Colors.GRAY, underlineColor: "transparent" },
          }}
          // onPressIn={onPressIn}
          onFocus={onPressIn}
          onEndEditing={onEndEditing}
          onPressOut={onPressOut}
        /> */}
        <Dropdown
          label={label}
          mode={mode}
          visible={visible}
          //   showDropDown={showDropDown}
          //   onDismiss={onDismiss}
          value={colors}
          setValue={setColors}
          data={colorList}
          labelField="label"
          valueField="value"
          placeholder={label}
          style={[
            {
              height: 50,
              width: "100%",
              fontSize: 16,
              fontWeight: "400",
              backgroundColor: Colors.WHITE,
              borderColor: Colors.BLACK,
              borderWidth: 1,
              marginTop: 10,
              borderRadius:6,
              padding:15,
            //   zIndex:1000
            //   height:55
            },
            style,
          ]}
          placeholderStyle={{
            color:Colors.GRAY
          }}
          //   dropDownItemStyle={{
          //     backgroundColor: "white",
          //     zIndex: 1000,
          //     elevation: 1000,
          //   }}
          //   style={[
          //     {
          //       height: 50,
          //       width: "100%",
          //       fontSize: 16,
          //       fontWeight: "400",
          //       backgroundColor: Colors.WHITE,
          //     },
          //     style,
          //   ]}
        />
        {error ? (
          <HelperText
            type="error"
            visible={true}
            padding={"none"}
            style={{ color: Colors.RED }}
          >
            {errorMsg}
          </HelperText>
        ) : null}
      </View>
  );
};

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

export { NewDropDownComponent };
