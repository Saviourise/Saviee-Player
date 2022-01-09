import React, {useState, useContext, useEffect} from 'react';
import { View, Text, StyleSheet, Dimensions, Modal, StatusBar, TouchableWithoutFeedback, Switch } from 'react-native';
import color from '../misc/color';
import Screen from '../components/screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from "@react-native-community/slider";
import PlayerButton from '../components/playerbutton';
import GestureRecognizer from 'react-native-swipe-gestures';
import { useColorScheme } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {AudioContext} from '../context/audioget';
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/audiocontroller';
import { storeAudioForNextOpening } from '../misc/helper';
import { Searchbar, Button, Menu, Divider, Provider, Card, Surface, } from 'react-native-paper';



const {width} = Dimensions.get('window')

const OpenPlayerModal = ({ openPlayer}) => {

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

    const { playbackPosition, playbackDuration, currentAudio } = context;

    useEffect(() => {
        context.loadPreviousAudio();
    }, [])

    const setPlaypos = async (val) => {
        if(context.soundObj) {
            const status = await resume(context.playbackObj, val*playbackDuration)
            return context.updateState(context, {
                playbackPosition: val*playbackDuration,
                soundObj: status,
                isPlaying: true,
            })
        }
    }

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

    const calculateSeekBar = () => {
        if(playbackPosition !== null && playbackDuration !== null) {
            return playbackPosition / playbackDuration;
        }

        if(currentAudio.lastPosition) {
            return currentAudio.lastPosition / (currentAudio.duration * 1000)
        }

        return 0
    }

    return <>
        <StatusBar
            animated={true}
            backgroundColor={color.APP_BG}
            showHideTransition='fade'
            hidden={false}
            barStyle="dark-content"
        />
        <Surface style={styles.surface}>
        <TouchableWithoutFeedback onPress={openPlayer} > 
            <View style={styles.modalContainer}>
                <View style={styles.modal}>
                    <View style={{flexDirection: 'row',}}>
                    <Text style={styles.title} numberOfLines={1}>{context.currentAudio.filename}</Text>
                    <View style={styles.audioControllers}>
                        <PlayerButton iconType='PREV' size={20} onPress={handlePrev} style={{marginTop: 5}} iconColor={color.FONT} />
                        <PlayerButton iconColor={color.FONT} onPress={handlePlayPause} style={{marginHorizontal: 15}} iconType={context.isPlaying ? 'PLAY' : 'PAUSE'} size={30} />
                        <PlayerButton iconColor={color.FONT} style={{marginTop: 5}} iconType='NEXT' size={20} onPress={handleNext} />
                    </View>
                    </View>
                    <View style={styles.sliderContainer}>
                            <Slider 
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={1}
                                step={0.001}
                                value={calculateSeekBar()}
                                minimumTrackTintColor={color.ACTIVE_BG}
                                maximumTrackTintColor={color.FONT}
                                thumbTintColor={'rgba(255, 255, 255, 0)'}
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
                                onSlidingComplete={async value => await moveAudio(context, value)}
                            />
                        </View>
                    
                </View>
            </View>
            
        </TouchableWithoutFeedback>
        </Surface>
    </>
}

const styles = StyleSheet.create({
    sliderContainer: {
        flex: 1,
        width: width + 33,
        marginHorizontal: -16,
        height: 20,
        paddingBottom: 10,
    },
    surface: {
        elevation: 30,
    },
    modalContainer: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    modal: {
        width,
        position: 'relative',
        backgroundColor: '#e1e1e1',
        paddingTop: 0,
    },
    title: {
        fontSize: 18,
        width: width - 120,
        fontWeight: 'bold',
        padding: 20,
        color: color.FONT,
        paddingBottom: 0,
        paddingTop: 10,
        marginTop: 5,
    },
    audioControllers: {
        width,
        flexDirection: 'row',
        paddingBottom: 0,
        paddingTop: 10,
    },

})



export default OpenPlayerModal;