import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createStackNavigator } from "@react-navigation/stack";
import Audiolist from '../screens/audiolist';
import Player from '../screens/player';
import Playlist from '../screens/playlist';
import SearchScreen from '../screens/searchscreen';
import {MaterialIcons, FontAwesome5, AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';
import color from '../misc/color';
import PlayListDetail from '../screens/playlistdetail';

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const PlayListScreen = () => {
    return <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='PlayList' component={Playlist} />
        <Stack.Screen name='PlayListDetail' component={PlayListDetail} />
    </Stack.Navigator>
}

const HomeScreen = () => {
    return <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='HomeScreen' component={Player} />
        <Stack.Screen name='SearchScreen' component={SearchScreen} />
    </Stack.Navigator>
}

const PlayerScreen = () => {
    return <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='PlayerScreen' component={Audiolist} />
        <Stack.Screen name='SearchScreen' component={SearchScreen} />
    </Stack.Navigator>
}

const Appnavigator = () => {
    return <Tab.Navigator screenOptions={() => ({
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: color.ACTIVE_BG,
            tabBarInactiveTintColor: color.FONT_LIGHT,
        })}>
        <Tab.Screen name='Home'
        component={HomeScreen}
        options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => {
                return <AntDesign name="home" size={size} color={color} />
            }
        }} />
        <Tab.Screen name='Songs'
        component={PlayerScreen}
        options={{
            tabBarIcon: ({color, size}) => {
                return <MaterialCommunityIcons name="radio" size={size} color={color} />
            }
        }} />
        <Tab.Screen name='Playlist'
        component={PlayListScreen}
        options={{
            tabBarIcon: ({color, size}) => {
                return <MaterialCommunityIcons name="playlist-music-outline" size={size} color={color} />
            }
        }} />
    </Tab.Navigator>
}

export default Appnavigator;
