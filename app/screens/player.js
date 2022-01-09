import React, { useState, useContext, Component, useEffect } from 'react';
import OpenPlayerModal from '../components/openplayermodal';
import PlayerModal from '../components/playermodal';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions, } from 'react-native';
import color from '../misc/color';
import SearchComponent from '../components/searchComponent';
import Fab from '../components/fab';
import { Searchbar, Button, Menu, Divider, Provider, Card, } from 'react-native-paper';

const Player = ({navigation}) => {

    const [playerModalMount, setPlayerModalMount] = useState(false);

    const mountPlayer = (mountState) => {
        setPlayerModalMount(mountState)
    }
    
    const searchPress = (text) => {
        navigation.navigate('SearchScreen', text)
    }
    
    return (
        <>
        <View style={styles.container}>
            
            <View style={{flexDirection: 'row', width, padding: 10, justifyContent: 'center',}}>
                <Searchbar
                    placeholder='Search for music'
                    style={styles.input}
                    onChangeText={(text) => {searchPress(text)}}
                    value={""}
                />
            </View>

            <Fab />

            <View>

                

            </View>

            
        </View>




        {playerModalMount &&  <PlayerModal playerModalMount={mountPlayer} />}
        <OpenPlayerModal openPlayer={() => {
            setPlayerModalMount(true)
            }} />
        </>
    )
}

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.APP_BG,
    },
    input: {
        width: width - 40,
        color: color.ACTIVE_BG,
        fontSize: 18,
    },
})




export default Player;