import React, {PureComponent} from "react";
import { VictoryPie } from 'victory-native';

export class DonutChartComp extends PureComponent {

    constructor() {
        super();
    }

    render() {
        return(
            <VictoryPie
            data={this.props.data}
            width={this.props.width}
            height={this.props.height}
            startAngle={0}
            endAngle={360}
            animate={{
                duration: 2000
            }}
            innerRadius={this.props.width * 0.25}
            colorScale={this.props.colorScale}
            style={{
                labels: {
                    fill: 'black', fontSize: 15, padding: 7,
                },
            }}
        />
        )
    }
}

// export const DonutChartComp = ({ data, width, height, colorScale }) => {

//     return (
        
//     )
// }