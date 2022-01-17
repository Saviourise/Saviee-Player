import React, { useState, useContext, Component, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, FlatList, Dimensions, StatusBar, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import AudioListItem from '../components/audiolistitem';
import color from '../misc/color';
import {AudioContext} from '../context/audioget';
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/audiocontroller';
import OptionModal from '../components/optionmodal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fab from '../components/fab';
import { Searchbar, Button, Menu, Divider, Provider, Avatar, Card, Title, Paragraph, IconButton, } from 'react-native-paper';

const PlayListDetail = (props) => {

    const context = useContext(AudioContext);

    const playList = props.route.params

    const {width} = Dimensions.get('window')

    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const [modalVisible, setModalVisible] = useState(false)
    const [selectedItem, setSelectedItem] = useState({})
    const [audios, setAudios] = useState(playList.audios)
    

    const playAudio = async (audio) => {
        await selectAudio(audio, context, {
            activePlayList: playList,
            isPlayListRunning: true
        });
    }

    const closeModal = () => {
        setSelectedItem({});
        setModalVisible(false);
    }

    const removeAudio = async () => {

        let isPlaying = context.isPlaying;
        let isPlayListRunning = context.isPlayListRunning;
        let soundObj = context.soundObj;
        let playbackPosition = context.playbackPosition;
        let activePlayList = context.activePlayList;

        if(context.isPlayListRunning && context.currentAudio.id === selectedItem.id) {
            //stop this audio
            await context.playbackObj.stopAsync();
            await context.playbackObj.unloadAsync();

            isPlaying = false;
            isPlayListRunning = false;
            soundObj = null;
            playbackPosition = 0;
            activePlayList = [];
        }

        const newAudios = audios.filter(audio => audio.id !== selectedItem.id)
        const result = await AsyncStorage.getItem('playlist')

        if(result != null) {
            const oldPlayLists = JSON.parse(result)
            const updatedPlayLists = oldPlayLists.filter((item) => {
                if(item.id === playList.id) {
                    item.audios = newAudios
                }
                return item
            })

            AsyncStorage.setItem('playlist', JSON.stringify(updatedPlayLists))
            context.updateState(context, {
                playList: updatedPlayLists,
                isPlayListRunning,
                activePlayList,
                playbackPosition,
                isPlaying,
                soundObj,
            })
        }

        setAudios(newAudios)
        closeModal()
    }



    const removePlaylist = async () => {
        let isPlaying = context.isPlaying;
        let isPlayListRunning = context.isPlayListRunning;
        let soundObj = context.soundObj;
        let playbackPosition = context.playbackPosition;
        let activePlayList = context.activePlayList;

        if(context.isPlayListRunning && activePlayList.id === playList.id) {
            //stop this audio
            await context.playbackObj.stopAsync();
            await context.playbackObj.unloadAsync();

            isPlaying = false;
            isPlayListRunning = false;
            soundObj = null;
            playbackPosition = 0;
            activePlayList = [];
        }

        const result = await AsyncStorage.getItem('playlist')

        if(result != null) {
            const oldPlayLists = JSON.parse(result)
            const updatedPlayLists = oldPlayLists.filter((item) => item.id !== playList.id)

            AsyncStorage.setItem('playlist', JSON.stringify(updatedPlayLists))
            context.updateState(context, {
                playList: updatedPlayLists,
                isPlayListRunning,
                activePlayList,
                playbackPosition,
                isPlaying,
                soundObj,
            })
        }

        props.navigation.goBack()
    }

    const [backgroundColor, setBackgroundColor] = useState(color.APP_BG);
    const [font, setFont] = useState(color.FONT);
    const [search, setSearch] = useState(color.SEARCH);
    const [fontMedium, setFontMedium] = useState(color.FONT_MEDIUM);
    const [fontLight, setFontLight] = useState(color.FONT_LIGHT);
    const [modalBg, setModalBg] = useState(color.MODAL_BG);
    const [activeBg, setActiveBg] = useState(color.ACTIVE_BG);
    const [activeFont, setActiveFont] = useState(color.ACTIVE_FONT);
    const [barColor, setBarColor] = useState("dark-content")

    useEffect(async () => {
        let themed = await AsyncStorage.getItem('theme');
        if(themed === "light") {
            setBackgroundColor(color.APP_BG)
            setFont(color.FONT)
            setSearch(color.SEARCH)
            setActiveFont(color.ACTIVE_FONT)
            setFontMedium(color.FONT_MEDIUM)
            setFontLight(color.FONT_LIGHT)
            setBarColor("dark-content")
        } else {
            setBackgroundColor(color.DARK_APP_BG)
            setFont(color.DARK_FONT)
            setSearch(color.DARK_SEARCH)
            setActiveFont(color.DARK_ACTIVE_FONT)
            setFontMedium(color.DARK_FONT_MEDIUM)
            setFontLight(color.DARK_FONT_LIGHT)
            setBarColor("light-content")
        }
    }, [])

    return (
        <Provider>
            <StatusBar
                animated={true}
                backgroundColor={backgroundColor}
                showHideTransition='fade'
                hidden={false}
                barStyle={barColor}
            />
            <View style={[styles.container, {backgroundColor: backgroundColor,}]}>
                <View style={{
                    height: '30%',
                    paddingHorizontal: 15,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: activeFont,
                }}>
                    <Text style={[styles.title, playList.title === 'Favourites' ? {color: '#f00'} : {color: color.ACTIVE_BG} ]}>{playList.title}</Text>
                    {/* <TouchableOpacity onPress={removePlaylist}>
                        <Text style={styles.title, {color: color.FONT}}>Delete</Text>
                    </TouchableOpacity> */}
                </View>

                <View style={{width, backgroundColor: backgroundColor, marginBottom: -5,}}>
                    <View style={{flexDirection: 'row', width, paddingVertical: 10, paddingLeft: 20,  justifyContent: 'space-between',}}>
                        <Text style={{color: font, paddingTop: 10,}}>Playlist</Text>
                        <Menu
                            visible={visible}
                            onDismiss={closeMenu}
                            contentStyle={{backgroundColor: activeFont, color: font}}
                            anchor={<IconButton
                                        icon='dots-vertical' 
                                        size={20} 
                                        color={color.ACTIVE_BG} 
                                        style={styles.listIcon}
                                        onPress={openMenu}
                                    />}>
                            <Menu.Item onPress={removePlaylist} titleStyle={{color: font}} title="Delete Playlist" />
                        </Menu>
                    </View>
                </View>
                
                <View style={{height: '62%'}}>
                    {audios.length ? (<FlatList
                        contentContainerStyle={styles.listContainer}
                        data={audios}
                        key={item => item.id.toString()}
                        renderItem={({item}) => (
                            <View>
                                <AudioListItem
                                    title={item.filename}
                                    duration={item.duration}
                                    isPlaying={context.isPlaying}
                                    activeListItem={item.id === context.currentAudio.id}
                                    onAudioPress={() => playAudio(item)}
                                    onOptionPress={() => {
                                        setSelectedItem(item);
                                        setModalVisible(true);
                                    }}
                                />
                            </View>
                        )}
                    />
                    ) : (
                        <Text style={{
                            fontWeight: 'bold',
                            color: color.FONT_LIGHT,
                            fontSize: 30,
                            paddingTop: 50,
                        }}>
                            There is no song in this playlist
                        </Text>
                    )}
                </View>
            </View>

            <OptionModal
                visible={modalVisible}
                onClose={closeModal} 
                options={[
                    {title: 'Remove from playlist', onPress: removeAudio, icon: "playlist-remove"}
                ]} 
                currentItem={selectedItem}
                navigation={props.navigation}
            /> 
            <Fab />   
        </Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    title: { 
        textAlign: 'center',
        fontSize: 30,
        paddingVertical: 5,
        fontWeight: 'bold',
    },
    listIcon: {
        color: color.ACTIVE_BG,
    },
})


export default PlayListDetail
