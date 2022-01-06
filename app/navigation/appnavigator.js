import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createStackNavigator } from "@react-navigation/stack";
import Audiolist from '../screens/audiolist';
import Player from '../screens/player';
import Playlist from '../screens/playlist';
import {MaterialIcons, FontAwesome5} from '@expo/vector-icons';
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

const Appnavigator = () => {
    return <Tab.Navigator screenOptions={() => ({
          
          tabBarActiveTintColor: color.ACTIVE_BG,
          tabBarInactiveTintColor: color.FONT_LIGHT,
        })}>
        <Tab.Screen name='All Songs'
        component={Audiolist}
        options={{
            tabBarLabel: 'Songs',
            tabBarIcon: ({color, size}) => {
                return <MaterialIcons name="music-note" size={size} color={color} />
            }
        }} />
        <Tab.Screen name='Albums'
        component={Player}
        options={{
            tabBarIcon: ({color, size}) => {
                return <FontAwesome5 name="compact-disc" size={size} color={color} />
            }
        }} />
        <Tab.Screen name='Playlist'
        component={PlayListScreen}
        options={{
            tabBarIcon: ({color, size}) => {
                return <MaterialIcons name="library-music" size={size} color={color} />
            }
        }} />
    </Tab.Navigator>
}

export default Appnavigator;
