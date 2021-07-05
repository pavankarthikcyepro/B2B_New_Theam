
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../scenes/mainScenes/Home';
import EMSScreen from '../scenes/mainScenes/EMS';
import MyTasksScreen from '../scenes/mainScenes/MyTasks';

import { EMS_LINE, HOME_LINE, HOME_FILL, SCHEDULE_FILL, SCHEDULE_LINE } from '../assets/svg'
import VectorImage from 'react-native-vector-image';

const HomeStack = createStackNavigator();

const HomeStackNavigator = () => {
    return (
        <HomeStack.Navigator initialRouteName={'Home'}>
            <HomeStack.Screen name="Home" component={HomeScreen} />
        </HomeStack.Navigator>
    );
}

const EmsStack = createStackNavigator();

const EmsStackNavigator = () => {
    return (
        <EmsStack.Navigator initialRouteName={'EMS'}>
            <EmsStack.Screen name="EMS" component={EMSScreen} />
        </EmsStack.Navigator>
    );
}


const MyTaskStack = createStackNavigator();

const MyTaskStackNavigator = () => {
    return (
        <MyTaskStack.Navigator initialRouteName={'MY_TASKS'}>
            <MyTaskStack.Screen name="MY_TASKS" component={MyTasksScreen} />
        </MyTaskStack.Navigator>
    );
}

// home home-outline

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'HOME') {
                        iconName = focused ? HOME_FILL : HOME_LINE;
                    } else if (route.name === 'EMS') {
                        iconName = focused ? HOME_FILL : EMS_LINE;
                    } else if (route.name === 'MY_TASKS') {
                        iconName = focused ? SCHEDULE_FILL : SCHEDULE_LINE;
                    }

                    return <VectorImage width={size} height={size} source={iconName} style={{ tintColor: color }} />
                },
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="HOME" component={HomeStackNavigator} />
            <Tab.Screen name="EMS" component={EmsStackNavigator} />
            <Tab.Screen name="MY_TASKS" component={MyTaskStackNavigator} />
        </Tab.Navigator>
    )
}

export { TabNavigator };