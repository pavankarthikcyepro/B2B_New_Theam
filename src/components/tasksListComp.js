import React, { PureComponent } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { Colors } from "../styles";

const NameComp = ({ label, labelStyle = {}, width = 0, showColon = false }) => {

    return (
        <View style={{ justifyContent: "center", alignItems: "center", height: 20, paddingRight: 2, flexDirection: 'row', width: width }}>
            <Text style={[styles.textStyle, labelStyle]} numberOfLines={1}>{label}</Text>
            {showColon ? <Text style={[styles.textStyle]}>{":"}</Text> : null}
        </View>
    )
}

export class TasksListComp extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            itemWidth: this.props.totalWidth / 8
        }
        // itemWidth = this.props.totalWidth / 8;
    }

    render() {
        const { itemWidth } = this.state;
        return (
            <View style={{}}>
                <View style={{ flexDirection: "row" }}>
                    <NameComp label={"S.No."} labelStyle={styles.titleStyle} width={itemWidth} showColon={false} />
                    <NameComp label={"Employee"} labelStyle={styles.titleStyle} width={itemWidth} showColon={false} />
                    <NameComp label={"Call"} labelStyle={styles.titleStyle} width={itemWidth} showColon={false} />
                    <NameComp label={"TD"} labelStyle={styles.titleStyle} width={itemWidth} showColon={false} />
                    <NameComp label={"V"} labelStyle={styles.titleStyle} width={itemWidth} showColon={false} />
                    <NameComp label={"PB"} labelStyle={styles.titleStyle} width={itemWidth} showColon={false} />
                    <NameComp label={"D"} labelStyle={styles.titleStyle} width={itemWidth} showColon={false} />
                    <NameComp label={"Pending"} labelStyle={styles.titleStyle} width={itemWidth} showColon={false} />
                </View>
                <View style={{}}>
                    <FlatList
                        data={this.props.data}
                        listKey={this.props.type}
                        keyExtractor={(item, index) => this.props.type + index.toString()}
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {

                            return (
                                <View style={{ flexDirection: "row", width: this.props.totalWidth, height: 25, justifyContent: "center" }}>
                                    <NameComp label={item.sno} labelStyle={styles.dataTextStyle} width={itemWidth} />
                                    <NameComp label={item.empName} labelStyle={styles.dataTextStyle} width={itemWidth} />
                                    <NameComp label={item.call} labelStyle={styles.dataTextStyle} width={itemWidth} />
                                    <NameComp label={item.td} labelStyle={styles.dataTextStyle} width={itemWidth} />
                                    <NameComp label={item.v} labelStyle={styles.dataTextStyle} width={itemWidth} />
                                    <NameComp label={item.pb} labelStyle={styles.dataTextStyle} width={itemWidth} />
                                    <NameComp label={item.d} labelStyle={styles.dataTextStyle} width={itemWidth} />
                                    <NameComp label={item.pending} labelStyle={styles.dataTextStyle} width={itemWidth} />
                                </View>
                            )
                        }}
                    />
                </View>
            </View>
        )
    }
}

// export const TasksListComp = ({ data, totalWidth, type }) => {

//     const itemWidth = totalWidth / 8;
//     console.log(itemWidth)

//     return (
//     )
// }

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        paddingVertical: 10
    },
    textStyle: {
        fontSize: 10,
        fontWeight: "400",
        paddingTop: 3,
    },
    titleStyle: {
        paddingLeft: 5,
        color: Colors.GRAY
    },
    dataTextStyle: {
    }
})