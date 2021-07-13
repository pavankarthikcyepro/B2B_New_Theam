
import React from 'react';
import { View, } from 'react-native';
import { TextinputComp } from './textinputComp';
import { Colors } from '../styles';

const DateRangeComp = ({ fromDate, toDate }) => {

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>

            <View style={{ width: '48%' }}>
                <TextinputComp
                    style={{ height: 40 }}
                    label={'From Date'}
                    value={fromDate}
                    mode={'outlined'}
                    disabled={false}
                    placeholder={'From Date'}
                    editable={false}
                    showRightIcon={true}
                    rightIconObj={{ name: "calendar-month", color: Colors.RED }}
                    onPressIn={() => { }}
                />
            </View>

            <View style={{ width: '48%' }}>
                <TextinputComp
                    style={{ height: 40 }}
                    label={'To Date'}
                    value={toDate}
                    mode={'outlined'}
                    disabled={false}
                    placeholder={'To Date'}
                    editable={false}
                    showRightIcon={true}
                    rightIconObj={{ name: "calendar-month", color: Colors.RED }}
                    onPressIn={() => { }}
                />
            </View>

        </View>
    )
}

export { DateRangeComp };