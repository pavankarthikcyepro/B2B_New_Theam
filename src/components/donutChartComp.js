import React from "react";
import { VictoryPie } from 'victory-native';

export const DonutChartComp = ({ data, width, height, colorScale }) => {

    return (
        <VictoryPie
            data={data}
            width={width}
            height={height}
            startAngle={0}
            endAngle={360}
            animate={{
                duration: 2000
            }}
            innerRadius={width * 0.2}
            colorScale={colorScale}
            style={{
                labels: {
                    fill: 'black', fontSize: 15, padding: 7,
                },
            }}
        />
    )
}