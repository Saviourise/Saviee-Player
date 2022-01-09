import React, {useState, useContext, useEffect} from 'react';
import { View, Text, StyleSheet, Dimensions, Modal, StatusBar, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight } from 'react-native';
import color from '../misc/color';
import Screen from '../components/screen';
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Slider from "@react-native-community/slider";
import PlayerButton from '../components/playerbutton';
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/audiocontroller';
import GestureRecognizer from 'react-native-swipe-gestures';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import {AudioContext} from '../context/audioget';
import { storeAudioForNextOpening } from '../misc/helper';
import { Searchbar, Button, Menu, Divider, Provider, Card, IconButton, Colors } from 'react-native-paper';


const {width, height} = Dimensions.get('window')

const setModalVisible = (visible) => {
        this.setState({ visible: visible });
    }


const PlayerModal = ({playerModalMount, onClose}) => {

    const [currentPosition, setCurrentPosition] = useState(0)


const convertTimeMin = (minutes) => {
    if (minutes) {
        var hrs = minutes/60;
        const minute = hrs.toString().split('.')[0];
        const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2));
        const sec = Math.ceil((60 * percent) / 100);

        if (parseInt(minute) < 10 && sec < 10) {
            return `0${minute}:0${sec}`;
        }

        if (sec == 60) {
            return `${minute + 1}:00`;
        }

        if (parseInt(minute) < 10) {
            return `0${minute}:${sec}`;
        }

        if (sec < 10) {
            return `${minute}:0${sec}`;
        }

        return `${minute}:${sec}`
    }
}


const convertTime = (time) => {
  const minute = Math.floor(time / 60000);
  const sec = ((time % 60000) / 1000).toFixed(0);
  if (parseInt(minute) < 10 && sec < 10) {
            return `0${minute}:0${sec}`;
        }

        if (parseInt(minute) < 10) {
            return `0${minute}:${sec}`;
        }

        if (sec < 10) {
            return `${minute}:0${sec}`;
        }

        return `${minute}:${sec}`
}

    const context = useContext(AudioContext);

    const { playbackPosition, playbackDuration, updateState, currentAudio, shuffle } = context;

    const handleShuffle = async () => {
        if (shuffle) {
            updateState(context, {shuffle: false})
        }
        if (!shuffle) {
            updateState(context, {shuffle: true})
        }
        
    }

    const calculateSeekBar = () => {

        if(playbackPosition !== null && playbackDuration !== null) {
            return playbackPosition / playbackDuration;
        }

        if(currentAudio.lastPosition) {
            return currentAudio.lastPosition / (currentAudio.duration * 1000)
        }
        return 0;
    }

    const renderCurrentTime = () => {

        if(!context.soundObj && currentAudio.lastPosition) {
            return convertTimeMin(currentAudio.lastPosition / 1000);
        }

        return convertTimeMin(context.playbackPosition / 1000);
    }

    // const setPlaypos = async (val) => {
    //     if(context.soundObj) {
    //         const status = await resume(context.playbackObj, val*playbackDuration)
    //         return context.updateState(context, {
    //             playbackPosition: val*playbackDuration,
    //             soundObj: status,
    //             isPlaying: true,
    //         })
    //     }
    // }
    
    const [visible, setVisible] = useState(true);

    useEffect(async () => {
        await context.loadPreviousAudio();
    }, [])

    const handlePlayPause = async () => {

        await selectAudio(context.currentAudio, context)
        //Play
        // if(context.soundObj === null) {
        //     const audio = context.currentAudio;
        //     const status = await play(context.playbackObj, audio.uri)
        //     context.playbackObj.setOnPlaybackStatusUpdate(context.onPlaybackStatusUpdate)
        //     return context.updateState(context, {
        //         soundObj: status,
        //         currentAudio: audio,
        //         isPlaying: true,
        //         currentAudioIndex: context.currentAudioIndex,
        //     })
        // }
        // //Pause
        // if(context.soundObj && context.soundObj.isPlaying) {
        //     const status = await pause(context.playbackObj)
        //     return context.updateState(context, {
        //         soundObj: status,
        //         isPlaying: false,
        //     })
        // }

        // //Resume
        // if(context.soundObj && !context.soundObj.isPlaying) {
        //     const status = await resume(context.playbackObj)
        //     return context.updateState(context, {
        //         soundObj: status,
        //         isPlaying: true,
        //     })
        // }
    }

    const handleNext = async () => {
        await changeAudio(context, 'next')
        // const {isLoaded} = await context.playbackObj.getStatusAsync();
        // const isLastAudio = context.currentAudioIndex + 1 === context.totalAudioCount;
        // let audio = context.audioFiles[context.currentAudioIndex + 1];
        // let index;
        // let status;

        // if(isLoaded && !isLastAudio) {
        //     index = context.currentAudioIndex + 1
        //     status = await playNext(context.playbackObj, audio.uri)
            
        // }

        // if(isLastAudio) {
        //     index = 0;
        //     audio = context.audioFiles[index]
        //     if(isLoaded) {
        //         status = await playNext(context.playbackObj, audio.uri)
        //     }else {
        //         status = await play(context.playbackObj, audio.uri)
        //     }    
        // }

        // if(!isLoaded && !isLastAudio) {
        //     index = context.currentAudioIndex + 1
        //     status = await play(context.playbackObj, audio.uri)
            
        // }

        // context.updateState(context, {
        //     playbackObj: context.playbackObj,
        //     soundObj: status,
        //     currentAudio: audio,
        //     isPlaying: true,
        //     currentAudioIndex: index,
        //     playbackPosition: null,
        //     playbackDuration: null,
        // });

        // storeAudioForNextOpening(audio, index);
    }

     const handlePrev = async () => {
         await changeAudio(context, 'previous')
        // const {isLoaded} = await context.playbackObj.getStatusAsync();
        // const isFirstAudio = context.currentAudioIndex <= 0;
        // let audio = context.audioFiles[context.currentAudioIndex - 1];
        // let index;
        // let status;

        // if(isLoaded && !isFirstAudio) {
        //     index = context.currentAudioIndex - 1
        //     status = await playNext(context.playbackObj, audio.uri)
            
        // }

        // if(isFirstAudio) {
        //     index = context.totalAudioCount - 1;
        //     audio = context.audioFiles[index]
        //     if(isLoaded) {
        //         status = await playNext(context.playbackObj, audio.uri)
        //     }else {
        //         status = await play(context.playbackObj, audio.uri)
        //     }    
        // }

        // if(!isLoaded && !isFirstAudio) {
        //     index = context.currentAudioIndex + 1
        //     status = await play(context.playbackObj, audio.uri)
            
        // }

        // context.updateState(context, {
        //     playbackObj: context.playbackObj,
        //     soundObj: status,
        //     currentAudio: audio,
        //     isPlaying: true,
        //     currentAudioIndex: index,
        //     playbackPosition: null,
        //     playbackDuration: null,
        // });

        // storeAudioForNextOpening(audio, index);
    }


    if(!context.currentAudio) return null;

    const [backgroundColor, setBackgroundColor] = useState(color.APP_BG)

    const vis = () => {
        setVisible(!visible);  
        playerModalMount(false);
    }

    return <>
        <StatusBar
            animated={true}
            backgroundColor="#000"
            barStyle='slide'
            showHideTransition='fade'
            hidden={false}
        />
        <GestureRecognizer
            style={{flex: 1}}
            velocityThreshold='0.01'
            onSwipeDown={ () => {
               vis()
            } }
        >
            <Modal
                animationType='slide'
                visible={visible}
            >
                <View style={{flex: 1, backgroundColor: backgroundColor,}}>
                    <View style={{flexDirection: 'row',}}>
                        <TouchableOpacity
                            onPress={ () => {
                                vis()
                            } }>
                                <Text style={{color: color.ACTIVE_FONT, backgroundColor: color.ACTIVE_BG, borderRadius: 5, fontSize: 18, margin: 10, paddingHorizontal: 20, paddingVertical: 10,}}>
                                    Close
                                </Text>
                            </TouchableOpacity>

                        <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1} / ${context.totalAudioCount - 1}`}</Text>
                    </View>

             
                    <View style={[styles.midBannerContainer, styles.elevation]}>
                        <MaterialCommunityIcons style={styles.banner} name="music-box" size={400} color={color.ACTIVE_BG} />
                    </View>

                    <View style={styles.audioPlayerContainer}>
                    <View style={styles.sliderContainer}>
                            <Slider 
                                style={styles.slider, {width: width-30, height: 20,}}
                                minimumValue={0}
                                maximumValue={1}
                                step={0.001}
                                value={calculateSeekBar()}
                                minimumTrackTintColor={color.ACTIVE_BG}
                                maximumTrackTintColor={color.FONT}
                                thumbTintColor={color.ACTIVE_BG}
                                onValueChange={(value) => {
                                    setCurrentPosition(
                                        convertTimeMin(value * context.currentAudio.duration)
                                    );
                                }}
                                onSlidingStart={
                                    async () => {
                                        if(!context.isPlaying) return;

                                        try {
                                            await pause(context.playbackObj)
                                        } catch (error) { console.log(error.message); }
                                    }
                                }
                                onSlidingComplete={async value => {
                                    await moveAudio(context, value)
                                    setCurrentPosition(0)
                                }}
                            />
                        </View>
                        <View style={{flexDirection: 'row', width: width-30, paddingHorizontal: 15, justifyContent: 'space-between',}}>
                            <Text style={{color: color.ACTIVE_BG, fontSize: 13,}}>{currentPosition ? currentPosition : renderCurrentTime()}</Text>
                            <Text style={{color: color.FONT_MEDIUM, fontSize: 13,}}>{convertTimeMin(context.currentAudio.duration)}</Text>
                        </View>
                        <View style={styles.playlistContainer}>
                            <Text style={styles.audioTitle} numberOfLines={1}>{context.currentAudio.filename}</Text>
                            {context.isPlayListRunning && <Text style={styles.playname}>From Playlist: {context.activePlayList.title}</Text>}
                        </View>
                        
                        <View style={styles.audioControllers}>
                            <IconButton 
                                icon='shuffle' 
                                size={20}
                                color={shuffle ? color.ACTIVE_BG : Colors.black}
                                style={{marginHorizontal: 25}} 
                                onPress={handleShuffle} 
                            />
                            <PlayerButton iconType='PREV' size={25} onPress={handlePrev}/>
                            <PlayerButton onPress={handlePlayPause} style={{marginHorizontal: 25}} iconType={context.isPlaying ? 'PLAY' : 'PAUSE'} />
                            <PlayerButton iconType='NEXT' size={25} onPress={handleNext} />
                            <Ionicons name='ios-volume-mute' onPress={() => console.log("Mute")} size={25} style={{marginHorizontal: 25}} color={color.ACTIVE_BG} />
                        </View>

                        <View style={styles.bottomButtons}>
                            <Ionicons name='ios-heart-outline' onPress={() => console.log("Favourite")} size={20} style={{marginHorizontal: 15}} color={color.ACTIVE_BG} />
                            <Ionicons name='ios-moon-outline' onPress={() => console.log("Dark Theme")} size={20} style={{marginHorizontal: 15}} color={color.ACTIVE_BG} />
                            <MaterialCommunityIcons name='playlist-plus' onPress={() => console.log("Add To Playlist")} size={20} style={{marginHorizontal: 15}} color={color.ACTIVE_BG} />
                            <Ionicons name='ios-trash-bin-outline' onPress={() => console.log("Delete")} size={20} style={{marginHorizontal:15}} color={color.ACTIVE_BG} />
                            <MaterialIcons name='queue-music' onPress={() => console.log("Playing Queue")} size={20} style={{marginHorizontal: 15}} color={color.ACTIVE_BG} />
                        </View>
                    </View>

                </View>
            </Modal>
        </GestureRecognizer>
    </>
}

const styles = StyleSheet.create({
    sliderContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: 10,
        marginTop: -10,
        paddingBottom: 20,
    },
    audioControllers: {
        width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        marginTop: 15,
    },
    audioPlayerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomButtons: {
        width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 30,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    audioCount: {
        textAlign: 'right',
        padding: 15,
        color: color.FONT_LIGHT,
        fontSize: 14,
        width: width-100,
    },
    midBannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: -20,
        marginBottom: 30,
    },
    audioTitle: {
        fontSize: 16,
        color: color.FONT,
        padding: 15,
    },
    playlistContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    playname: {
        color: color.FONT_MEDIUM,
    },
})



export default PlayerModal;