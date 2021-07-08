
import * as React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { IconButton } from 'react-native-paper';
import VectorImage from 'react-native-vector-image';
import { Colors } from '../styles';
import { EMS_LINE, HOME_LINE, HOME_FILL, SCHEDULE_FILL, SCHEDULE_LINE } from '../assets/svg'


import HomeScreen from '../scenes/mainScenes/Home';
import EMSScreen from '../scenes/mainScenes/EMS';
import MyTasksScreen from '../scenes/mainScenes/MyTasks';

import SettingsScreen from '../scenes/mainScenes/settingsScreen';
import UpcomingDeliveriesScreen from '../scenes/mainScenes/upcomingDeliveriesScreen';
import ComplaintsScreen from '../scenes/mainScenes/complaintsScreen';
import SideMenuScreen from '../scenes/mainScenes/sideMenuScreen';
import NotificationScreen from '../scenes/mainScenes/notificationsScreen';


const drawerWidth = 300;
const screeOptionStyle = {
    headerTitleStyle: {
        fontSize: 22,
        fontWeight: '600'
    },
    headerStyle: {
        backgroundColor: Colors.DARK_GRAY
    },
    headerTintColor: Colors.WHITE,
    headerBackTitleVisible: false
}

const MenuIcon = ({ navigation }) => {
    return (
        <IconButton
            icon="menu"
            color={Colors.WHITE}
            size={30}
            onPress={() => navigation.openDrawer()}
        />
    )
}

const SearchIcon = () => {
    return (
        <IconButton
            icon="magnify"
            color={Colors.WHITE}
            size={25}
            onPress={() => console.log('Pressed')}
        />
    )
}

const NotficationIcon = ({ navigation }) => {
    return (
        <IconButton
            icon="bell"
            color={Colors.WHITE}
            size={25}
            onPress={() => {
                navigation.navigate(CommonStackIdentifiers.notification)
            }}
        />
    )
}

export const CommonStackIdentifiers = {
    upcomingDeliveries: 'UPCOMING_DELIVERIES',
    complaint: 'COMPLAINTS',
    settings: 'SETTINGS',
    notification: 'NOTIFICATION'
}

const HomeStack = createStackNavigator();

const HomeStackNavigator = ({ navigation }) => {
    return (
        <HomeStack.Navigator
            initialRouteName={'Home'}
            screenOptions={screeOptionStyle}
        >
            <HomeStack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Dashboard',
                    headerLeft: () => <MenuIcon navigation={navigation} />,
                    headerRight: () => {
                        return (
                            <View style={{ flexDirection: 'row' }}>
                                <SearchIcon />
                                <NotficationIcon navigation={navigation} />
                            </View>
                        )
                    }
                }}
            />

            <HomeStack.Screen name={CommonStackIdentifiers.upcomingDeliveries} component={UpcomingDeliveriesScreen} />
            <HomeStack.Screen name={CommonStackIdentifiers.complaint} component={ComplaintsScreen} />
            <HomeStack.Screen name={CommonStackIdentifiers.settings} component={SettingsScreen} />
            <HomeStack.Screen name={CommonStackIdentifiers.notification} component={NotificationScreen} />

        </HomeStack.Navigator>
    );
}

const HomeDrawer = createDrawerNavigator();

const HomeStackDrawerNavigator = () => {
    return (
        <HomeDrawer.Navigator
            drawerStyle={{
                width: drawerWidth,
            }}
            drawerContent={(props) => <SideMenuScreen {...props} />}
        >
            <HomeDrawer.Screen name="HOME_DRAWER" component={HomeStackNavigator} />
        </HomeDrawer.Navigator>
    )
}


const EmsStack = createStackNavigator();

const EmsStackNavigator = ({ navigation }) => {
    return (
        <EmsStack.Navigator
            initialRouteName={'EMS'}
            screenOptions={screeOptionStyle}
        >
            <EmsStack.Screen
                name="EMS"
                component={EMSScreen}
                options={{
                    title: 'EMS',
                    headerLeft: () => <MenuIcon navigation={navigation} />,
                    headerRight: () => {
                        return (
                            <View style={{ flexDirection: 'row' }}>
                                <SearchIcon />
                                <NotficationIcon navigation={navigation} />
                            </View>
                        )
                    }
                }}
            />

            <EmsStack.Screen name={CommonStackIdentifiers.upcomingDeliveries} component={UpcomingDeliveriesScreen} />
            <EmsStack.Screen name={CommonStackIdentifiers.complaint} component={ComplaintsScreen} />
            <EmsStack.Screen name={CommonStackIdentifiers.settings} component={SettingsScreen} />
            <EmsStack.Screen name={CommonStackIdentifiers.notification} component={NotificationScreen} />
        </EmsStack.Navigator>
    );
}

const EMSDrawer = createDrawerNavigator();

const EMSStackDrawerNavigator = () => {
    return (
        <EMSDrawer.Navigator
            drawerStyle={{
                width: drawerWidth,
            }}
            drawerContent={(props) => <SideMenuScreen {...props} />}
        >
            <EMSDrawer.Screen name="EMS_DRAWER" component={EmsStackNavigator} />
        </EMSDrawer.Navigator>
    )
}


const MyTaskStack = createStackNavigator();

const MyTaskStackNavigator = ({ navigation }) => {
    return (
        <MyTaskStack.Navigator
            initialRouteName={'MY_TASKS'}
            screenOptions={screeOptionStyle}
        >
            <MyTaskStack.Screen
                name="MY_TASKS"
                component={MyTasksScreen}
                options={{
                    title: 'My Tasks',
                    headerLeft: () => <MenuIcon navigation={navigation} />,
                    headerRight: () => {
                        return (
                            <View style={{ flexDirection: 'row' }}>
                                <SearchIcon />
                                <NotficationIcon navigation={navigation} />
                            </View>
                        )
                    }
                }}
            />

            <MyTaskStack.Screen name={CommonStackIdentifiers.upcomingDeliveries} component={UpcomingDeliveriesScreen} />
            <MyTaskStack.Screen name={CommonStackIdentifiers.complaint} component={ComplaintsScreen} />
            <MyTaskStack.Screen name={CommonStackIdentifiers.settings} component={SettingsScreen} />
            <MyTaskStack.Screen name={CommonStackIdentifiers.notification} component={NotificationScreen} />
        </MyTaskStack.Navigator>
    );
}

const MyTaskDrawer = createDrawerNavigator();

const MyTaskStackDrawerNavigator = () => {
    return (
        <MyTaskDrawer.Navigator
            drawerStyle={{
                width: drawerWidth,
            }}
            drawerContent={(props) => <SideMenuScreen {...props} />}
        >
            <MyTaskDrawer.Screen name="MY_TASK_DRAWER" component={MyTaskStackNavigator} />
        </MyTaskDrawer.Navigator>
    )
}
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
                activeTintColor: Colors.RED,
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="HOME" component={HomeStackDrawerNavigator} options={{ title: 'Home' }} />
            <Tab.Screen name="EMS" component={EMSStackDrawerNavigator} options={{ title: 'EMS' }} />
            <Tab.Screen name="MY_TASKS" component={MyTaskStackDrawerNavigator} options={{ title: 'My Tasks' }} />
        </Tab.Navigator>
    )
}

export { TabNavigator };