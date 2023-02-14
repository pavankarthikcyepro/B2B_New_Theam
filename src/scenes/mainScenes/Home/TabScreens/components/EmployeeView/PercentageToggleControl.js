import React, {useState} from "react";
import {Colors} from "../../../../../../styles";
import {Text} from "react-native";
import {Switch} from "react-native-switch";

const PercentageToggleControl = (props) => {
    const {togglePercentage, toggleChange} = props;
    const [toggleValue, setToggleValue] = useState(false);

    return (
        <Switch
            value={toggleValue}
            renderActiveText={true}
            renderInActiveText={true}
            backgroundActive={Colors.RED}
            circleBorderActiveColor={Colors.WHITE}
            circleBorderInactiveColor={Colors.WHITE}
            barHeight={20}
            activeText={'%'}
            inActiveText={'%'}
            activeTextStyle={{fontWeight: 'bold'}}
            inActiveTextStyle={{fontWeight: 'lighter'}}
            switchLeftPx={12}
            switchRightPx={12}
            outerCircleStyle={{borderRadius: 4}}
            switchWidthMultiplier={1.5}
            innerCircleStyle={{borderRadius: 2, height: 16, width: 16}}
            switchBorderRadius={4}
            changeValueImmediately={true}
            onValueChange={x => {
                setToggleValue(x);
                toggleChange(x === true ? 1 : 0)
            }}
        />
    )
}

export default PercentageToggleControl;
