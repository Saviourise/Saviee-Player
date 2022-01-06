import React, { useState, useContext, Component, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import PlaylistInputModal from "../components/playlistinputmodal";
import OpenPlayerModal from '../components/openplayermodal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AudioContext} from '../context/audioget';
import PlayerModal from '../components/playermodal';
import PlayListDetail from '../components/playlistdetail'
import color from '../misc/color';

let selectedPlaylist = {};

const Playlist = ({navigation}) => {

    const [showPlaylist, setShowPlaylist] = useState(false);

    const [playerModalMount, setPlayerModalMount] = useState(false);

    const context = useContext(AudioContext)

    const {playList, addToPlaylist, updateState} = context 

    const createPlaylist = async (playlistName) => {
        const result = await AsyncStorage.getItem('playlist');
        if(result !== null) {
            const audios = [];
            if(addToPlaylist) {
                audios.push(addToPlaylist)
            }
            const newList = {
                id: Date.now(),
                title: playlistName,
                audios: audios,
            }

            const updatedList = [...playList, newList];
            updateState(context, {addToPlaylist: null, playList: updatedList})
            await AsyncStorage.setItem('playlist', JSON.stringify(updatedList))
        }
        setModalVisible(false)
    }

    const mountPlayer = (mountState) => {
        setPlayerModalMount(mountState)
    }

    const renderPlaylist = async () => {
        const result = await AsyncStorage.getItem('playlist');
        if(result === null) {
            const defaultPlaylist = {
                id: Date.now(),
                title: 'My Favourite',
                audios: [],
            }

            const newPlaylist = [...playList, defaultPlaylist]
            updateState(context, {playList: [...newPlaylist]});
            return await AsyncStorage.setItem('playlist', JSON.stringify([...newPlaylist]));
        }

        updateState(context, {playList: JSON.parse(result)});
    }

    useEffect(() => {
        if(!playList.length) {
            renderPlaylist()
        }
    }, [])

    const [modalVisible, setModalVisible] = useState(false);

    const handleBannerPress = async (playList) => {
        // Update Playlist if there is any selected audio
        if(addToPlaylist) {
            const result = await AsyncStorage.getItem('playlist');

            let oldList = [];
            let updatedList = [];
            let sameAudio = false;

            if(result !== null) {
                oldList = JSON.parse(result);

                updatedList = oldList.filter(list => {
                    if(list.id === playList.id) {
                        // if audio already in playlist
                        for (let audio of list.audios) {
                            if(audio.id === addToPlaylist.id) {
                                // alert audio already in playlist
                                sameAudio = true;
                                return;
                            }
                        }

                        // Otherwise Update Playlist if there is any selected audio
                        list.audios = [...list.audios, addToPlaylist]
                        Alert.alert('Song Added!', `${addToPlaylist.filename} has been added to the playlist`);
                    }

                    return list;
                })
            }

            if(sameAudio) {
                Alert.alert('Found same audio!', `${addToPlaylist.filename} is already inside the playlist`);
                sameAudio = false;
                return updateState(
                    context, 
                    {addToPlaylist: null}
                );
            }

            updateState(
                context,
                {addToPlaylist: null,
                playList: [...updatedList]}
            )
            return AsyncStorage.setItem('playlist', JSON.stringify([...updatedList]));
        }

        // Open playlist if no audio selected

        selectedPlaylist = playList;
        navigation.navigate('PlayListDetail', playList)
        // setShowPlaylist(true);
    }
 
    return (
        <>
        <ScrollView contentContainerStyle={styles.container}>
            
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{margin: 10,}}>
                <Text style={styles.playlistButton}>+ Create New Playlist</Text>
            </TouchableOpacity>

            {playList.length ? playList.map(item => 
                <TouchableOpacity
                    key={item.id.toString()}
                    style={styles.playlistBanner}
                    onPress={() => handleBannerPress(item)}
                >
                    <Text style={styles.favourite}>{item.title}</Text>
                    <Text style={styles.audioCount}>
                        {
                        item.audios.length > 1
                        ? `${item.audios.length} Songs`
                        : `${item.audios.length} Song`
                        }
                    </Text>
                </TouchableOpacity>
            ) : null}

            

            <PlaylistInputModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={createPlaylist}
            />

            
        </ScrollView>
        <PlayListDetail visible={showPlaylist} playList={selectedPlaylist} onClose={() => setShowPlaylist(false)} />
        
        {playerModalMount &&  <PlayerModal playerModalMount={mountPlayer} />}
        
        <OpenPlayerModal openPlayer={() => {
            setPlayerModalMount(true)
            }} />
            </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 0,
    },
    playlistButton: {
        color: color.ACTIVE_BG,
        letterSpacing: 3,
        fontWeight: 'bold',
        fontSize: 14,
        padding: 5,
    },
    playlistBanner: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'rgba(204, 204, 204, 0.3)',
        borderRadius: 5,
    },
    favourite: {
        fontSize: 18,
        color: '#000',
    },
    audioCount: {
        marginTop: 8,
        opacity: 0.5,
        fontSize: 14,
        color: '#000',
        opacity: 0.5,
    }
})




export default Playlist;