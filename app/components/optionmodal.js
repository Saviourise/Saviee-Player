import React, {useState, useContext, useEffect} from 'react'
import {AudioContext} from '../context/audioget';
import { View, Text, Modal, StatusBar, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Dimensions, Alert } from 'react-native'
import color from '../misc/color';
import {Entypo, AntDesign, Feather, MaterialCommunityIcons, Ionicons, MaterialIcons} from '@expo/vector-icons'
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/audiocontroller';
import { Searchbar, Button, Menu, Divider, Provider, Card, IconButton, Colors, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const OptionModal = ({
    visible,
    currentItem,
    onClose,
    onPlayPress,
    onPlaylistPress,
    options,
    navigation
}) => {

    const {filename} = currentItem
    
    const context = useContext(AudioContext)
    const {addedToQueue, updateState, addToPlaylist, playList} = context
    const [visibled, setVisibled] = useState(false)
    const [heart, setHeart] = useState("heart-outline")

    const [visibleSnack, setVisibleSnack] = useState(false);

    const [snackbartext, setSnackbartext] = useState('')

    const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);

    const onDismissSnackBar = () => setVisibleSnack(false);

    const [backgroundColor, setBackgroundColor] = useState(color.APP_BG);
    const [font, setFont] = useState(color.FONT);
    const [search, setSearch] = useState(color.SEARCH);
    const [fontMedium, setFontMedium] = useState(color.FONT_MEDIUM);
    const [fontLight, setFontLight] = useState(color.FONT_LIGHT);
    const [modalBg, setModalBg] = useState(color.MODAL_BG);
    const [activeBg, setActiveBg] = useState(color.ACTIVE_BG);
    const [activeFont, setActiveFont] = useState(color.ACTIVE_FONT);

    const deleteSong = async () => {
        Alert.alert(
            "Confirm Delete?",
            "Note: This action cannot be undone",
            [
                {
                    text: "Yes, delete the song",
                    onPress: async () => {
                        try {
                            await MediaLibrary.deleteAssetsAsync(currentItem.id)
                            setSnackbartext('Song Deleted Successfully, Reload App To Apply Effect')
                            onToggleSnackBar()
                        } catch (err) {
                            setSnackbartext(err.message)
                            onToggleSnackBar()
                        }
                    },
                    style: "default",
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
            {
                cancelable: true,
            }
        )
        
        
        
    }
    

    const addToQueue = () => {
        const queue = addedToQueue
        //console.log(addedToQueue)
        queue.unshift(currentItem)
        //setQueue(queue)
        // console.log(queue)
        // console.log(addedToQueue)
        updateState(context, {
            addedToQueue: queue
        })
        setVisibled(false)
    }

    const addToQueuePush = () => {
        const queue = addedToQueue
        queue.push(currentItem)
        //setQueue(queue)
        //console.log(queue)
        //console.log(addedToQueue)
        updateState(context, {
            addedToQueue: queue
        })
        setVisibled(false)
    }

    const viewQueue = () => {
        const queue = addedToQueue
        navigation.navigate('QueueScreen')
    } 


    const removeAudio = async () => {
        let isPlaying = context.isPlaying;
        let isPlayListRunning = context.isPlayListRunning;
        let soundObj = context.soundObj;
        let playbackPosition = context.playbackPosition;
        let activePlayList = context.activePlayList;

        if(context.isLoaded) {
            //stop this audio
            await context.playbackObj.stopAsync();
            await context.playbackObj.unloadAsync();

            isPlaying = false;
            isPlayListRunning = false;
            soundObj = null;
            playbackPosition = 0;
            activePlayList = [];
        }

        let result3 = {}
        const result = await AsyncStorage.getItem('playlist')
        const Playlists = JSON.parse(result);
        let count = Object.keys(Playlists).length;
        for (let index = 0; index < count; index++) {
            if (Playlists[index].title === "Favourites") {
                result3 = Playlists[index]
            }
        }
        //console.log(result3.audios)
        const newAudios = result3.audios.filter(audio => audio.id !== currentItem.id)
        //console.log(newAudios)
        

        if(result != null) {
            const oldPlayLists = JSON.parse(result)
            const updatedPlayLists = oldPlayLists.filter((item) => {
                if(item.id === result3.id) {
                    item.audios = newAudios
                }
                let sameAudio = false;
                setHeart('heart-outline')
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
            setSnackbartext('Removed Song From Favourites')
            onToggleSnackBar()
        }
    }

    let result1 = {}

    const handleFavourite = async () => {

        const result = await AsyncStorage.getItem('playlist');
        let Playlists = JSON.parse(result);
        let count = Object.keys(Playlists).length;
        for (let index = 0; index < count; index++) {
            if (Playlists[index].title === "Favourites") {
                result1 = Playlists[index]
            }
        }
        

        let oldList = [];
        let updatedList = [];
        let sameAudio = false;

        if(result !== null) {
            oldList = JSON.parse(result);

            updatedList = oldList.filter(list => {
                if(list.id === result1.id) {
                    // if audio already in playlist
                    for (let audio of list.audios) {
                        if(audio.id === currentItem.id) {
                            // alert audio already in playlist
                            removeAudio()
                            return;
                        }
                    }

                    // Otherwise Update Playlist if there is any selected audio
                    list.audios = [...list.audios, currentItem]
                    setSnackbartext('Added Song To Favourites')
                    onToggleSnackBar()
                    setHeart("heart")
                }

                return list;
            })
        }

        if(sameAudio) {
            Alert.alert('Found same audio!', `${currentItem.filename} is already inside the playlist`);
            setHeart("heart")
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

    let result2 = {}

    useEffect( async () => {
        const result = await AsyncStorage.getItem('playlist');
        let Playlists = JSON.parse(result);
        //console.log(Playlists)
        if (currentItem !== null) {
            
            let counter = Object.keys(Playlists).length;
            for (let index = 0; index < counter; index++) {
                if (Playlists[index].title === "Favourites") {
                    result2 = Playlists[index]
                    
                }
            }
            
            let oldList = [];
            let updatedList = [];
            let sameAudio = false;

            if(result !== null) {
                
                oldList = JSON.parse(result);

                updatedList = oldList.filter(list => {
                    if(list.id === result2.id) {
                        // if audio already in playlist
                        
                        for (let audio of list.audios) {
                            if(audio.id === currentItem.id) {
                                // alert audio already in playlist
                                setHeart("heart")
                                return sameAudio = true;
                            }
                        }
                    }
                })
            }

            if(sameAudio) {
                setHeart("heart")
                sameAudio = false;
            } else {
                setHeart("heart-outline")
            }
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
            <StatusBar hidden={true} />
            <Modal
                animationType='slide'
                transparent
                visible={visibled ? visibled : visible}
                onRequestClose={onClose}
            >
                <View style={[styles.modal, {backgroundColor: backgroundColor,}]}>
                    <View style={{flexDirection: 'row', padding: 20, paddingBottom: 0, justifyContent: 'space-between',}}>
                        <Text style={[styles.title, {color: fontMedium}]} numberOfLines={1}>{filename}</Text>
                        <IconButton
                            icon={heart}
                            size={20}
                            color="#f00"
                            onPress={handleFavourite}
                        />
                    </View>
                    <View style={styles.optionContainer}>
            
                        <TouchableWithoutFeedback onPress={addToQueue}>
                            <View style={{flexDirection: 'row', paddingVertical: 10,}}>
                                <MaterialCommunityIcons 
                                    name="play-box-multiple"
                                    size={20}
                                    style={styles.textIcon}
                                    color={font}
                                />
                                <Text style={[styles.option, {color: font}]}>Play Next
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={addToQueuePush}>
                            <View style={{flexDirection: 'row', paddingVertical: 10,}}>
                                <MaterialIcons 
                                    name="queue"
                                    size={20}
                                    style={styles.textIcon}
                                    color={font}
                                />
                                <Text style={[styles.option, {color: font}]}>Add to playing queue
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                        {options.map(optn => {
                            return (<TouchableWithoutFeedback key={optn.title} onPress={optn.onPress}>
                                        <View style={{flexDirection: 'row', paddingVertical: 10,}}>
                                            <MaterialCommunityIcons 
                                                name={optn.icon}
                                                size={20}
                                                style={styles.textIcon}
                                                color={font}
                                            />
                                            <Text style={[styles.option, {color: font}]}>{optn.title}  
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>)
                        })}

                        <TouchableWithoutFeedback onPress={viewQueue}>
                            <View style={{flexDirection: 'row', paddingVertical: 10,}}>
                                <MaterialIcons 
                                    name="playlist-play"
                                    size={20}
                                    style={styles.textIcon}
                                    color={font}
                                />
                                <Text style={[styles.option, {color: font}]}>View playing queue
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <Divider style={{backgroundColor: fontMedium}}/>

                        <TouchableWithoutFeedback>
                            <View style={{flexDirection: 'row', paddingVertical: 10,}}>
                                <MaterialCommunityIcons 
                                    name="information"
                                    size={20}
                                    style={styles.textIcon}
                                    color={font}
                                />
                                <Text style={[styles.option, {color: font}]}>Song Details  
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={deleteSong}>
                            <View style={{flexDirection: 'row', paddingVertical: 10, marginBottom: 20,}}>
                                <MaterialCommunityIcons 
                                    name="delete"
                                    size={20}
                                    style={styles.textIcon}
                                    color={font}
                                />
                                <Text style={[styles.option, {color: font}]}>Delete Song  
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalBg}></View>
                </TouchableWithoutFeedback>
                <Snackbar
                visible={visibleSnack}
                onDismiss={onDismissSnackBar}
                duration={1000}
                action={{
                label: 'Close',
                }}>
                {snackbartext}
            </Snackbar>
            </Modal>
            
        </>
    );
};

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        zIndex: 1000,
    },
    optionContainer: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        width: width - 90,
        fontWeight: 'bold',
        paddingBottom: 0,
    },
    option: {
        fontSize: 16,
        letterSpacing: 1,
        paddingHorizontal: 15,
    },
    modalBg: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: color.MODAL_BG,
    }
})

export default OptionModal
