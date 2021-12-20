import React, { PureComponent } from "react";
import { } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";

const chartConfig = {
    backgroundColor: "#e8e7e6",
    backgroundGradientFrom: "#dcdedc",
    backgroundGradientTo: "#e1e6e1",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => "#040504",
    labelColor: (opacity = 1) => "#040504",
    style: {
        borderRadius: 16
    },
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
    },
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
}

const chartConfig2 = {
    backgroundGradientFrom: "#bababa",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#bababa",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 110, 26, ${opacity})`,
    labelColor: (opacity = 1) => "#040504",
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};

const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
        {
            data: [20, 45, 28, 80, 99, 43]
        },
        {
            data: [10, 50, 24, 82, 19, 30]
        }
    ]
};

export class LineGraphComp extends PureComponent {

    constructor() {
        super()
    }

    render() {
        if (this.props.type === "BAR") {
            return (
                <BarChart
                    data={data}
                    width={this.props.width} // from react-native
                    height={200}
                    // yAxisInterval={1} // optional, defaults to 1
                    chartConfig={chartConfig2}
                    verticalLabelRotation={0}
                    style={{}}
                />
            )
        }

        return (
            <LineChart
                data={{
                    labels: this.props.chartTitles,
                    datasets: this.props.chartData,
                    legend: [] // optional
                }}
                width={this.props.width} // from react-native
                height={200}
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 4,
                    borderRadius: 8,
                }}
            />
        )
    }

}

// export const LineGraphComp = ({ chartTitles, chartData, width, type = "LINE" }) => {
// }