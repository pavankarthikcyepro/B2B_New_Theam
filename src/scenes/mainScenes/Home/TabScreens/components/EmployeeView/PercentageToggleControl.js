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
            renderActiveText={false}
            renderInActiveText={false}
            circleActiveColor={Colors.RED}
            backgroundActive={Colors.RETAIL_BORDER_COLOR}
            backgroundInactive={Colors.LIGHT_GRAY2}
            circleInActiveColor={Colors.RED}
            innerCircleStyle={{
                color: Colors.YELLOW,
                alignItems: "center",
                justifyContent: "center"
            }}
            circleBorderActiveColor={Colors.RED}
            circleBorderInactiveColor={Colors.RED}
            barHeight={15}
            circleSize={25}
            renderInsideCircle={() => {
                return (
                    <Text
                        style={{color: Colors.WHITE, fontWeight: 'bold', fontSize: 14}}>%</Text>
                )
            }}
            onValueChange={x => {
                setToggleValue(x);
                toggleChange(x === true ? 1 : 0)
            }}
        />
    )
}

export default PercentageToggleControl;
