import React from "react";
import {Text, View} from "react-native";
import {IconButton, ProgressBar} from "react-native-paper";
import {Colors} from "../../../../../styles";
import moment from "moment/moment";

export const RenderSelfInsights = (args) => {
    const color = [
        '#9f31bf', '#00b1ff', '#fb03b9', '#ffa239', '#d12a78', '#0800ff', '#1f93ab', '#ec3466'
    ]

    const dateFormat = "YYYY-MM-DD";
    const currentDate = moment().format(dateFormat)
    const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
    const dateDiff = ((new Date(monthLastDate).getTime() - new Date(currentDate).getTime()) / (1000 * 60 * 60 * 24));
    const {data} = args;
    return (
        data.map((item, index) => {
            return (
                <View style={{flexDirection: "row", marginLeft: 8}} key={index}>
                    <View style={{width: "10%", justifyContent: "center", marginTop: 5}}>
                        <Text>{item.paramShortName}</Text>
                    </View>
                    <View style={{
                        width: item.paramName === 'Accessories' ? '12%' : "10%",
                        marginTop: 10,
                        position: "relative",
                        backgroundColor: color[index % color.length],
                        height: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        borderTopLeftRadius: 3,
                        borderBottomLeftRadius: 3
                    }}>
                        <Text style={{color: "#fff"}}>{item.achievment}</Text>
                    </View>
                    <View style={{
                        width: item.paramName === 'Accessories' ? '23%' : "25%",
                        marginTop: 10,
                        position: "relative"
                    }}>
                        <ProgressBar
                            progress={
                                item.achivementPerc.includes("%")
                                    ? parseInt(item.achivementPerc.substring(0, item.achivementPerc.indexOf("%"))) === 0
                                        ? 0
                                        : parseInt(item.achivementPerc.substring(0, item.achivementPerc.indexOf("%"))) / 100
                                    : parseFloat(item.achivementPerc) / 100
                            }
                            color={color[index % color.length]}
                            style={{
                                height: 20,
                                borderTopRightRadius: 3,
                                borderBottomRightRadius: 3,
                                backgroundColor: "#eeeeee"
                            }}
                        />
                        <View style={{position: "absolute", top: 1, right: 5}}>
                            <Text
                                style={{
                                    color:
                                        parseInt(
                                            item.achivementPerc.substring(
                                                0,
                                                item.achivementPerc.indexOf("%")
                                            )
                                        ) >= 90
                                            ? Colors.WHITE
                                            : Colors.BLACK,
                                }}
                            >
                                {item.target}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            width: "10%",
                            justifyContent: "center",
                            flexDirection: "row",
                            height: 25,
                            marginTop: 8,
                            alignItems: "center",
                            marginLeft: 8,
                        }}
                    >
                        <IconButton
                            icon={
                                parseInt(
                                    item.achivementPerc.substring(
                                        0,
                                        item.achivementPerc.indexOf("%")
                                    )
                                ) > 40
                                    ? "menu-up"
                                    : "menu-down"
                            }
                            color={
                                parseInt(
                                    item.achivementPerc.substring(
                                        0,
                                        item.achivementPerc.indexOf("%")
                                    )
                                ) > 40
                                    ? Colors.DARK_GREEN
                                    : Colors.RED
                            }
                            size={30}
                        />
                        <View
                            style={{
                                justifyContent: "center",
                                flexDirection: "row",
                                height: 25,
                                marginTop: 0,
                                alignItems: "center",
                                marginLeft: -20,
                            }}
                        >
                            <Text>{item.achivementPerc}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            width: "35%",
                            justifyContent: "center",
                            flexDirection: "row",
                            height: 25,
                            alignItems: "center",
                            marginTop: 8,
                            marginLeft: 20,
                        }}
                    >
                        <View
                            style={{
                                maxWidth: item.target && item.target.length >= 6 ? 70 : 45,
                                minWidth: 45,
                                height: 25,
                                borderColor: color[index % color.length],
                                borderWidth: 1,
                                borderRadius: 8,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{padding: 2}}>
                                {Number(item.achievment) > Number(item.target) ? 0 : item.shortfall}
                            </Text>
                        </View>
                        <View
                            style={{
                                maxWidth: item.target && item.target.length >= 6 ? 70 : 45,
                                minWidth: 45,
                                height: 25,
                                borderColor: color[index % color.length],
                                borderWidth: 1,
                                borderRadius: 8,
                                justifyContent: "center",
                                alignItems: "center",
                                marginLeft: item.target.length >= 6 ? 5 : 20
                            }}
                        >
                            <Text style={{padding: 2}}>
                                {parseInt(item.achievment) > parseInt(item.target) ? 0 : (dateDiff > 0 && parseInt(item.shortfall) !== 0
                                    ? Math.abs(Math.round(parseInt(item.shortfall) / dateDiff)) : 0)}
                            </Text>
                        </View>
                    </View>
                </View>
            )
        })
    )
}