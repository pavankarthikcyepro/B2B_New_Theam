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
            backgroundActive={Colors.GREEN}
            backgroundInactive={Colors.RETAIL_BORDER_COLOR}
            circleInActiveColor={Colors.RED}
            innerCircleStyle={{
                color: Colors.YELLOW,
                alignItems: "center",
                justifyContent: "center"
            }}
            circleBorderActiveColor={Colors.RED}
            circleBorderInactiveColor={Colors.RED}
            barHeight={16}
            circleSize={18}
            renderInsideCircle={() => {
                return (
                    <Text
                        style={{color: Colors.WHITE, fontWeight: 'bold', fontSize: 12}}>%</Text>
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
