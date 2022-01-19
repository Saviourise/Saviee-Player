import React, { useState, useContext, Component, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert, StatusBar } from 'react-native';
import PlaylistInputModal from "../components/playlistinputmodal";
import OpenPlayerModal from '../components/openplayermodal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AudioContext} from '../context/audioget';
import { LinearGradient } from 'expo-linear-gradient';
import color from '../misc/color';
import { Entypo, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Fab from '../components/fab';
import { Searchbar, Button, Menu, Divider, Provider, Avatar, Card, Title, Paragraph, IconButton, } from 'react-native-paper';


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
                title: 'Favourites',
                audios: [],
            }

            const newPlaylist = [...playList, defaultPlaylist]
            updateState(context, {playList: [...newPlaylist]});
            return await AsyncStorage.setItem('playlist', JSON.stringify([...newPlaylist]));
        }

        updateState(context, {playList: JSON.parse(result)});
    }

    const [modalVisible, setModalVisible] = useState(false);

    const searchPress = (text) => {
        navigation.navigate('SearchScreen', text)
    }

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
        //console.log(playList)
        navigation.navigate('PlayListDetail', playList)
        // setShowPlaylist(true);
    }

    const [backgroundColor, setBackgroundColor] = useState(color.APP_BG);
    const [font, setFont] = useState(color.FONT);
    const [search, setSearch] = useState(color.SEARCH);
    const [fontMedium, setFontMedium] = useState(color.FONT_MEDIUM);
    const [fontLight, setFontLight] = useState(color.FONT_LIGHT);
    const [modalBg, setModalBg] = useState(color.MODAL_BG);
    const [activeBg, setActiveBg] = useState(color.ACTIVE_BG);
    const [activeFont, setActiveFont] = useState(color.ACTIVE_FONT);

     let result2 = {}

    useEffect(async () => {
        if(!playList.length) {
            renderPlaylist()
        }

        let themed = await AsyncStorage.getItem('theme');
        if(themed === "dark") {
            setBackgroundColor(color.DARK_APP_BG)
            setFont(color.DARK_FONT)
            setSearch(color.DARK_SEARCH)
            setActiveFont(color.DARK_ACTIVE_FONT)
            setFontMedium(color.DARK_FONT_MEDIUM)
            setFontLight(color.DARK_FONT_LIGHT)
        } else {
            setBackgroundColor(color.APP_BG)
            setFont(color.FONT)
            setSearch(color.SEARCH)
            setActiveFont(color.ACTIVE_FONT)
            setFontMedium(color.FONT_MEDIUM)
            setFontLight(color.FONT_LIGHT)
        }
    }, [])
 
    return (
        <>
        <View style={[styles.container, {backgroundColor: backgroundColor,}]}>

            <View style={{flexDirection: 'row', width, padding: 10, justifyContent: 'center',}}>
                <Searchbar
                    placeholder='Search for music'
                    style={{width: width - 40, fontSize: 18, backgroundColor: search,}}
                    inputStyle={{color: font}}
                    iconColor={fontLight}
                    placeholderTextColor={fontLight}
                    onChangeText={(text) => {searchPress(text)}}
                    value={""}
                />
            </View>
            
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{margin: 10,}}>
                <Text style={styles.playlistButton}>+ Create New Playlist</Text>
            </TouchableOpacity>

            <View style={{ flex:1, width: '100%'}}>

                {playList.length ? (<FlatList
                    contentContainerStyle={styles.listContainer}
                    data={playList}
                    key={item => item.id.toString()}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={item.title === "Favourites" ? {
                                padding: 10, 
                                width: '45%', 
                                marginBottom: 10, 
                                marginHorizontal: 10, 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                            } : {
                                padding: 10, 
                                width: '45%', 
                                marginBottom: 10, 
                                marginHorizontal: 10, 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                            }}
                            onPress={() => handleBannerPress(item)}
                        >
                            
                            <View style={{
                                backgroundColor: "#000", 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                borderRadius: 5,
                                flexBasis: 40,
                                height: 100,
                                width: 100,
                            }}>
                                <MaterialIcons name="music-note" color={color.FONT_LIGHT} size={35} />
                            </View>
                            
                            <Text style={item.title === "Favourites"  ? {color: "#f00"} : {color: color.ACTIVE_BG}}>{item.title}</Text>
                            <Text style={{color: fontLight,}}>
                                {
                                item.audios.length > 1
                                ? `${item.audios.length} Songs`
                                : `${item.audios.length} Song`
                                }
                            </Text>
                            
                        </TouchableOpacity>
                    )}
                    numColumns={2}
                    
                />
            ) : null}

            </View>

            <PlaylistInputModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={createPlaylist}
            />

            
        </View>

        <Fab />
        
        <OpenPlayerModal onPress={() => {navigation.navigate('PlayerModal')}}/>
            </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        flex: 1,
    },
    playlistButton: {
        color: color.ACTIVE_BG,
        letterSpacing: 3,
        fontWeight: 'bold',
        fontSize: 14,
        padding: 5,
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