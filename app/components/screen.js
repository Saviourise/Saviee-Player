import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, StatusBar, ScrollView, } from 'react-native'
import color from '../misc/color'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar, Button, Menu, Divider, Provider, Card, IconButton, Colors } from 'react-native-paper';

const Screen = ({children}) => {

    const [backgroundColor, setBackgroundColor] = useState(color.APP_BG);

    useEffect(async () => {
        let themed = await AsyncStorage.getItem('theme');
        if(themed === "dark") {
            setBackgroundColor(color.DARK_APP_BG)
        } else {
            setBackgroundColor(color.APP_BG)
        }
    }, [])
    return ( <>
        <StatusBar
        animated={true}
        backgroundColor="#00f"
        barStyle='slide'
        showHideTransition='fade'
        hidden={false}
      />
      <Provider>
        <View style={{flex: 1, backgroundColor: backgroundColor, minHeight: 1, minWidth: 1}}>
            
            {children}
            
        </View>
        </Provider>
        </>
    )
}

const styles = StyleSheet.create({})

export default Screen
