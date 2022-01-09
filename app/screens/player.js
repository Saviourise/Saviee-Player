import React, { useState, useContext, Component, useEffect } from 'react';
import OpenPlayerModal from '../components/openplayermodal';
import PlayerModal from '../components/playermodal';
import { View, Text, StyleSheet } from 'react-native';
import color from '../misc/color';
import SearchComponent from '../components/searchComponent';
import Fab from '../components/fab';

const Player = () => {
    const [playerModalMount, setPlayerModalMount] = useState(false);
    const mountPlayer = (mountState) => {
        setPlayerModalMount(mountState)
    }
    return (
        <>
        <View style={styles.container}>
            
            <SearchComponent />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.APP_BG,
    }
})




export default Player;