import React, { useState, useContext, Component, useEffect } from 'react';
import {Animated,} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators, } from "@react-navigation/stack";
import Audiolist from '../screens/audiolist';
import Player from '../screens/player';
import Playlist from '../screens/playlist';
import SearchScreen from '../screens/searchscreen';
import {MaterialIcons, FontAwesome5, AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';
import color from '../misc/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlayListDetail from '../screens/playlistdetail';
import QueueScreen from '../screens/queuescreen';
import PlayerModal from '../screens/playerscreen';

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const PlayListScreen = () => {
    return <Stack.Navigator screenOptions={{
            headerShown: false,
            keyboardHandlingEnabled: false,
            animationEnabled: true,
            gestureEnabled: true,
            gestureDirection: 'vertical',
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            gestureResponseDistance: 750,
        }} 
    >
        <Stack.Screen name='PlayList' component={Playlist} />
        <Stack.Screen name='PlayListDetail' component={PlayListDetail} options={{gestureEnabled: false,}} />
        <Stack.Screen name='SearchScreen' component={SearchScreen} />
        <Stack.Screen name='QueueScreen' component={QueueScreen} />
        <Stack.Screen name='PlayerModal' component={PlayerModal} />
    </Stack.Navigator>
}

const HomeScreen = () => {
    return <Stack.Navigator screenOptions={{
            headerShown: false,
            keyboardHandlingEnabled: false,
            animationEnabled: true,
            gestureEnabled: true,
            gestureDirection: 'vertical',
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            gestureResponseDistance: 750,
        }} 
    >
        <Stack.Screen name='HomeScreen' component={Player} />
        <Stack.Screen name='PlayListDetail' component={PlayListDetail} options={{gestureEnabled: false,}} />
        <Stack.Screen name='SearchScreen' component={SearchScreen} />
        <Stack.Screen name='QueueScreen' component={QueueScreen} />
        <Stack.Screen name='PlayerModal' component={PlayerModal} />
    </Stack.Navigator>
}

const PlayerScreen = () => {
    return <Stack.Navigator screenOptions={{
            headerShown: false,
            keyboardHandlingEnabled: false,
            animationEnabled: true,
            gestureEnabled: true,
            gestureDirection: 'vertical',
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            gestureResponseDistance: 750,
        }} 
    >
        <Stack.Screen name='PlayerScreen' component={Audiolist} />
        <Stack.Screen name='SearchScreen' component={SearchScreen} />
        <Stack.Screen name='QueueScreen' component={QueueScreen} />
        <Stack.Screen name='PlayerModal' component={PlayerModal} />
    </Stack.Navigator>
}

const Appnavigator = () => {

    const [backgroundColor, setBackgroundColor] = useState(color.APP_BG);
    const [font, setFont] = useState(color.FONT);
    const [search, setSearch] = useState(color.SEARCH);
    const [fontMedium, setFontMedium] = useState(color.FONT_MEDIUM);
    const [fontLight, setFontLight] = useState(color.FONT_LIGHT);
    const [modalBg, setModalBg] = useState(color.MODAL_BG);
    const [activeBg, setActiveBg] = useState(color.ACTIVE_BG);
    const [activeFont, setActiveFont] = useState(color.ACTIVE_FONT);

    useEffect(async () => {
        let themed = await AsyncStorage.getItem('theme');
        if(themed === "light") {
            setBackgroundColor(color.APP_BG)
            setFont(color.FONT)
            setSearch(color.SEARCH)
            setActiveFont(color.ACTIVE_FONT)
            setFontMedium(color.FONT_MEDIUM)
            setFontLight(color.FONT_LIGHT)
        } else {
            setBackgroundColor(color.DARK_APP_BG)
            setFont(color.DARK_FONT)
            setSearch(color.DARK_SEARCH)
            setActiveFont(color.DARK_ACTIVE_FONT)
            setFontMedium(color.DARK_FONT_MEDIUM)
            setFontLight(color.DARK_FONT_LIGHT)
        }
    }, [])

    return <Tab.Navigator screenOptions={() => ({
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: color.ACTIVE_BG,
            tabBarInactiveTintColor: fontLight,
            tabBarActiveBackgroundColor: search,
            tabBarInactiveBackgroundColor: search,
        })}>
        
        <Tab.Screen name='Songs'
        component={PlayerScreen}
        options={{
            tabBarAccessibilityLabel: 'Songs',
            tabBarIcon: ({color, size}) => {
                return <MaterialCommunityIcons name="radio" size={size} color={color} />
            }
        }} />
        <Tab.Screen name='Playlist'
        component={PlayListScreen}
        options={{
            tabBarAccessibilityLabel: 'Playlist',
            tabBarIcon: ({color, size}) => {
                return <MaterialCommunityIcons name="playlist-music-outline" size={size} color={color} />
            }
        }} />
        <Tab.Screen name='Home'
        component={HomeScreen}
        options={{
            tabBarAccessibilityLabel: 'Home',
            tabBarIcon: ({color, size}) => {
                return <AntDesign name="home" size={size} color={color} />
            }
        }} />
    </Tab.Navigator>
}

export default Appnavigator;
