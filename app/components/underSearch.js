import React, { useState, useContext } from 'react'
import { StyleSheet, Text, Modal, View, Dimensions, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import {Entypo, AntDesign, Feather, MaterialCommunityIcons, Ionicons} from '@expo/vector-icons'
import color from '../misc/color';
import CardView from 'react-native-cardview'
import {AudioContext} from '../context/audioget';
import { storeAudioForNextOpening } from '../misc/helper';
import { Searchbar, Button, Menu, Divider, Provider, Card, IconButton, Colors } from 'react-native-paper';
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/audiocontroller';

export default function UnderSearch() {

    const context = useContext(AudioContext);

    const {
        shuffle,
        updateState, 
        audioFiles, 
        soundObj, 
        currentAudio, 
        isPlaying, 
        currentAudioIndex, 
        isPlayListRunning, 
        onPlaybackStatusUpdate, 
        playbackObj
    } = context;
    
    const handleOnSearch = () => {
        console.log(searchItem)
    }

    const handleShuffle = async () => {
        if (shuffle) {
            //console.log('off')
            updateState(context, {shuffle: false})
        }
        if (!shuffle) {
            //console.log(shuffle)
            const randomIndex = Math.floor(Math.random() * audioFiles.length) + 1 ;
            //console.log(randomIndex)
            const audio = audioFiles[randomIndex];
            //console.log(audio)
            //await selectAudio(audio, context)
            if (soundObj === null) {
                uri = audio.uri
                const status = await playbackObj.loadAsync(
                    { uri },
                    { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
                );
                updateState(context, {
                    soundObj: status,
                    currentAudio: audio,
                    isPlaying: true,
                    currentAudioIndex: randomIndex,
                    shuffle: true,
                    isPlayListRunning: false,
                });
                playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
                await storeAudioForNextOpening(audio, randomIndex);
            } else {
                 const status = await playNext(playbackObj, audio.uri)
                 updateState(context, {
                    soundObj: status,
                    currentAudio: audio,
                    isPlaying: true,
                    currentAudioIndex: randomIndex,
                    shuffle: true,
                    isPlayListRunning: false,
                });
                await storeAudioForNextOpening(audio, randomIndex);
            }
        }
        
    }

    const [menuVisible, setMenuVisible] = useState(true);

    const openMenu = () => setMenuVisible(true);

    const closeMenu = () => setMenuVisible(false);

    const renderConditionalText = () => {
        if (shuffle) {
            return <Text style={{textAlign: 'center', paddingTop: 10, color: color.FONT_MEDIUM}}>Shuffle: On</Text>;
        }
        return <Text style={{textAlign: 'center', paddingTop: 10, color: color.FONT_MEDIUM}}>Shuffle: Off</Text>; 
    }

    return (
        <>
            <View style={styles.container}>
                <View style={{flexDirection: 'row', width: width-100, padding: 10, justifyContent: 'space-between',}}>
                    <TouchableOpacity>
                        <View style={shuffle ? {backgroundColor: "rgba(23, 76, 255, 1)", padding: 12, borderRadius: 50,} : {backgroundColor: "rgba(23, 76, 255, 0.2)", padding: 12, borderRadius: 50,}}>
                            <IconButton 
                                icon='shuffle' 
                                size={20}
                                color={shuffle ? Colors.white : Colors.black}
                                style={styles.shuffleIcon1} 
                                onPress={handleShuffle} 
                            />
                        </View>
                        {renderConditionalText()}
                    </TouchableOpacity>
                            
                    <TouchableOpacity>
                        <View style={styles.shuffleView2}>
                            <IconButton 
                                icon='playlist-music'
                                size={20}
                                style={styles.shuffleIcon2} 
                                onPress={handleOnSearch} 
                            />
                        </View>
                        <Text style={{textAlign: 'center', paddingTop: 10, color: color.FONT_MEDIUM}}>Playlist</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <View style={styles.shuffleView3}>
                            <IconButton
                                icon='theme-light-dark'
                                size={20}
                                style={styles.shuffleIcon3} 
                                onPress={handleOnSearch} 
                            />
                        </View>
                        <Text style={{textAlign: 'center', paddingTop: 10, color: color.FONT_MEDIUM}}>Theme</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={ styles.allSongsView}>
                <View style={{flexDirection: 'row', width: width-10, padding: 10, paddingLeft: 20, paddingVertical: 15, justifyContent: 'space-between',}}>
                    <Text>All Songs <Text style={{color: color.FONT_LIGHT}}>{`(${context.totalAudioCount - 1})`}</Text></Text>
                    <MaterialCommunityIcons
                        name='format-list-checkbox' 
                        size={20} 
                        iconColor={color.ACTIVE_BG} 
                        style={styles.listIcon} 
                        onPress={handleOnSearch}
                    />
                </View>
            </View>
        </>
    )
}

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingHorizontal: 40,
        alignItems: 'center',
        backgroundColor: color.APP_BG,
    },
    allSongsView: {
        width,
        backgroundColor: color.APP_BG,
    },
    input: {
        width: width - 40,
        color: color.ACTIVE_BG,
        fontSize: 18,
    },
    listIcon: {
        color: color.ACTIVE_BG,
    },
    searchIcon: {
        color: color.ACTIVE_BG,
        padding: 5,
    },
    shuffleView2: {
        backgroundColor: "rgba(51, 136, 255, 0.2)",
        padding: 12,
        borderRadius: 50,
    },
    shuffleIcon1: {
        color: "rgba(23, 76, 255, 1)",
        padding: 5,
    },
    shuffleIcon2: {
        color: "rgba(51, 136, 255, 1)",
        padding: 5,
    },
    shuffleIcon3: {
        color: "rgba(121, 160, 90, 1)",
        padding: 5,
    },
    shuffleView3: {
        backgroundColor: "rgba(121, 160, 90, 0.2)",
        padding: 12,
        borderRadius: 50,
    },
})
