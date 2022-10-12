import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors} from "../../../../../../styles";
import moment from "moment/moment";
import {RenderSourceModelParameters} from "../RenderSourceModelParameters";
import PercentageToggleControl from "./PercentageToggleControl";
import URL from "../../../../../../networking/endpoints";
import {useDispatch, useSelector} from "react-redux";
import {getSourceModelDataForSelf} from "../../../../../../redux/homeReducer";

const SourceModel = ({route, navigation}) => {
    const dispatch = useDispatch();
    const selector = useSelector((state) => state.homeReducer);
    const {empId, loggedInEmpId, headerTitle, orgId, type} = route.params;
    const [leadSource, setLeadSource] = useState([]);
    const [vehicleModel, setVehicleModel] = useState([]);
    const [leadSourceKeys, setLeadSourceKeys] = useState([]);
    const [vehicleModelKeys, setVehicleModelKeys] = useState([]);
    const [isSourceIndex, setIsSourceIndex] = useState(0);
    const [displayType, setDisplayType] = useState(0);
    const [sourceModelTotals, setSourceModelTotals] = useState({});


    useEffect(async () => {
        navigation.setOptions({title: headerTitle ? headerTitle : 'Source/Model'});
        if (isSourceIndex !== 0) {
            setIsSourceIndex(0);
        }
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().format(dateFormat)
        const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);

        let payload = {
            "endDate": monthLastDate,
            "loggedInEmpId": loggedInEmpId,
            "empId": empId,
            "startDate": monthFirstDate,
            "levelSelected": null
        }

        const urlSelf = URL.MODEL_SOURCE_SELF();
        const urlInsights = URL.MODEL_SOURCE_INSIGHTS();
        const urlTeam = URL.MODEL_SOURCE_TEAM();
        let url = '';
        switch (type) {
            case 'SELF':
                url = urlSelf;
                break;
            case 'INSIGHTS':
                url = urlInsights;
                break;
            case 'TEAM':
                url = urlTeam;
                const data = {
                    orgId: orgId, selectedEmpId: loggedInEmpId
                }
                payload = {
                    ...payload, ...data
                }
                break;
        }
        dispatch(getSourceModelDataForSelf({type, payload}))
    }, [empId]);

    useEffect(() => {
        if (selector.sourceModelData) {
            const json = selector.sourceModelData;
            const sourceData = [];
            const modelData = [];
            const data = type === 'TEAM' ? json.overallTargetAchivements : json;
            data && data.length > 0 && data.filter(x => {
                if (x.model) {
                    modelData.push(x);
                }
                if (x.source) {
                    sourceData.push(x);
                }
            });
            const sourceUnique = new Set(sourceData.map(x => x.source));
            const modelUnique = new Set(modelData.map(x => x.model));
            setLeadSourceKeys([...sourceUnique]);
            setVehicleModelKeys([...modelUnique]);
            const groupedSources = getData([...sourceData], 0);
            setLeadSource(groupedSources);
            const groupedModels = getData([...modelData], 1);
            setVehicleModel(groupedModels);
            // getTotal(0);
        }
    }, [selector.sourceModelData])

    useEffect(() => {
        if (leadSource) {
            getTotal(0);
        }
    }, [leadSource]);

    const getTotal = (type) => {
        const keys = type === 0 ? leadSourceKeys : vehicleModelKeys;
        const data = type === 0 ? leadSource : vehicleModel;
        const totals = {
            'Enquiry': 0,
            'Test Drive': 0,
            'Home Visit': 0,
            'Booking': 0,
            'INVOICE': 0,
            'Exchange': 0,
            'Finance': 0,
            'Insurance': 0,
            'EXTENDEDWARRANTY': 0,
            'Accessories': 0
        };
        // {e: 0, t: 0, v: 0, b: 0, r: 0, f: 0, i: 0, exg: 0, exw: 0, acc: 0};
        keys.map(x => {
            data[x].forEach(d => {
                totals[d.paramName] = +totals[d.paramName] + +d.achievment;
            })
        })
        setSourceModelTotals({...totals});
    }
    const paramsMetadata = [{
        color: '#FA03B9',
        paramName: 'Enquiry',
        shortName: 'Enq',
        initial: 'E',
        toggleIndex: 0
    },
        {
            color: '#FA03B9', paramName: 'Test Drive', shortName: 'TD', initial: 'T', toggleIndex: 0
        },
        {
            color: '#9E31BE',
            paramName: 'Home Visit',
            shortName: 'Visit',
            initial: 'V',
            toggleIndex: 0
        }, {color: '#1C95A6', paramName: 'Booking', shortName: 'Bkg', initial: 'B', toggleIndex: 0}, {
            color: '#C62159',
            paramName: 'INVOICE',
            shortName: 'Retail',
            initial: 'R',
            toggleIndex: 0
        }, {color: '#9E31BE', paramName: 'Exchange', shortName: 'Exg', initial: 'Ex', toggleIndex: 1}
        , {color: '#EC3466', paramName: 'Finance', shortName: 'Fin', initial: 'F', toggleIndex: 1}, {
            color: '#1C95A6',
            paramName: 'Insurance',
            shortName: 'Ins',
            initial: 'I',
            toggleIndex: 1
        }, {
            color: '#1C95A6',
            paramName: 'EXTENDEDWARRANTY',
            shortName: 'ExW',
            initial: 'ExW',
            toggleIndex: 1
        }, {color: '#C62159', paramName: 'Accessories', shortName: 'Acc', initial: 'A', toggleIndex: 1},]

    const getData = (data, type) => {
        return data && data.reduce((r, a) => {
            const key = a[type === 0 ? 'source' : 'model'];
            r[key] = r[key] || [];
            r[key].push(a);
            return r;
        }, Object.create(null));
    }

    const renderDataView = () => {
        const keys = isSourceIndex === 0 ? leadSourceKeys : vehicleModelKeys;
        const data = isSourceIndex === 0 ? leadSource : vehicleModel;
        return (<>
            {keys && keys.length > 0 && keys.map((x, index) => {
                return (<View key={`${index}`}>
                    <View style={styles.flexRow}>
                        {data[x] && <RenderSourceModelParameters item={{targetAchievements: data[x]}}
                                                                 displayType={displayType}/>}
                    </View>
                </View>)
            })}
        </>)
    }

    function renderTitleColumn() {
        const keys = isSourceIndex === 0 ? leadSourceKeys : vehicleModelKeys;
        return (<>
            {keys && keys.length > 0 && keys.map((x, index) => {
                return (<View key={`${index}`} style={styles.titleColumnView}>
                    <Text style={styles.titleColumnText} numberOfLines={2}>{x}</Text>
                </View>)
            })}
        </>)
    }

    return (<>
        <View>
            <View style={[styles.flexRow, styles.justifyAlignCenter, {marginBottom: 8}]}>
                <View style={[styles.flexRow, styles.toggleButtonView]}>
                    <TouchableOpacity onPress={() => {
                        if (isSourceIndex !== 0) {
                            setIsSourceIndex(0);
                            getTotal(0);
                        }
                    }}
                        style={[styles.toggleViewButtons, styles.justifyAlignCenter, {backgroundColor: isSourceIndex === 1 ? Colors.WHITE : Colors.RED}]}>
                        <Text
                            style={[styles.toggleButtonText, {color: isSourceIndex === 1 ? Colors.BLACK : Colors.WHITE}]}>Lead
                            Source</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        if (isSourceIndex === 0) {
                            setIsSourceIndex(1);
                            getTotal(1);
                        }
                    }}
                                      style={[styles.toggleViewButtons, styles.justifyAlignCenter, {backgroundColor: isSourceIndex === 1 ? Colors.RED : Colors.WHITE}]}>
                        <Text
                            style={[styles.toggleButtonText, {color: isSourceIndex === 1 ? Colors.WHITE : Colors.BLACK}]}>Vehicle
                            Model</Text>
                    </TouchableOpacity>

                </View>
            </View>
            <View style={styles.sourceModelContainer}>
                <View style={styles.percentageToggleView}>
                    <PercentageToggleControl toggleChange={(x) => setDisplayType(x)}/>
                </View>
                <View style={{height: '85%'}}>
                    <ScrollView>
                        <View style={[styles.flexRow, {paddingHorizontal: 6}]}>
                            <View>
                                <View style={{height: 20}}></View>
                                {renderTitleColumn()}
                                <View style={[styles.flexRow, styles.totalTextView]}>
                                    <Text style={styles.totalTitleText}>Total</Text>
                                </View>

                            </View>
                            <ScrollView horizontal>
                                <View>
                                    {/* TOP Header view */}
                                    <View key={'headers'} style={[styles.flexRow]}>
                                        <View style={[styles.flexRow, {height: 20}]}>
                                            {paramsMetadata.map((param, i) => {
                                                return (<View key={`${param.paramName}__${i}`}
                                                              style={[styles.flexRow, styles.justifyAlignCenter, {
                                                                  width: param.paramName === "Accessories" ? 80 : 60
                                                              }]}>
                                                    <Text style={{color: param.color}}>{param.shortName}</Text>
                                                </View>)
                                            })}
                                        </View>
                                    </View>
                                    <View>
                                        {renderDataView()}
                                    </View>
                                    {/* Total section */}
                                    <View>
                                        <View style={styles.paramsTotalContainerView}>
                                            <View style={styles.paramsTotalContainerSubView}>
                                                <View style={styles.paramsTotalContainer}>
                                                    {Object.keys(sourceModelTotals).map((x, index) => {
                                                        return (
                                                            <View key={`${index}`}
                                                                  style={[styles.justifyAlignCenter, {width: 60}]}>
                                                                <Text
                                                                    style={{color: Colors.WHITE}}>{sourceModelTotals[x]}</Text>
                                                            </View>
                                                        )
                                                    })}
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                </View>
                            </ScrollView>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    </>)
}

export default SourceModel;

const styles = StyleSheet.create({
    flexRow: {flexDirection: 'row', display: 'flex'},
    titleColumnView: {
        height: 25,
        marginVertical: 6,
        justifyContent: 'center',
        backgroundColor: 'rgba(223,228,231,0.67)',
        paddingLeft: 8
    },
    titleColumnText: {maxWidth: 100, color: Colors.BLACK, fontWeight: '500', fontSize: 10},
    justifyAlignCenter: {
        justifyContent: 'center', alignItems: 'center'
    },
    toggleButtonView: {
        borderColor: Colors.RED,
        borderWidth: 1,
        borderRadius: 5,
        padding: 0.75,
        height: 35,
        marginTop: 10,
        justifyContent: 'center',
        width: '70%'
    },
    toggleViewButtons: {
        width: '50%', borderTopLeftRadius: 5, borderBottomLeftRadius: 5
    },
    toggleButtonText: {
        fontSize: 16, fontWeight: '600'
    },
    percentageToggleView: {
        justifyContent: 'center', alignItems: 'flex-end', marginVertical: 8, paddingHorizontal: 12
    },
    sourceModelContainer: {backgroundColor: Colors.WHITE, marginHorizontal: 12},
    totalTextView: {
        justifyContent: 'flex-start',
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.RED,
    },
    totalTitleText: {
        flexDirection: 'row',
        color: Colors.WHITE,
        textAlign: "center",
        marginLeft: 8,
        fontWeight: 'bold'
    },
    paramsTotalContainerView: {
        flexDirection: 'row', height: 40, backgroundColor: Colors.RED
    },
    paramsTotalContainerSubView: {
        width: '92%',
        minHeight: 25,
        flexDirection: 'column',
        marginRight: 5,
        paddingHorizontal: 5,
    },
    paramsTotalContainer: {width: '92%', minHeight: 40, flexDirection: 'row'}
});
