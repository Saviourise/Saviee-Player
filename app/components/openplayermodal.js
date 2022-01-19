import React, {useState, useContext, useEffect} from 'react';
import { View, Text, StyleSheet, Dimensions, Modal, StatusBar, TouchableWithoutFeedback, Switch } from 'react-native';
import color from '../misc/color';
import Screen from '../components/screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from "@react-native-community/slider";
import PlayerButton from '../components/playerbutton';
import { useColorScheme } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {AudioContext} from '../context/audioget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/audiocontroller';
import { storeAudioForNextOpening } from '../misc/helper';
import { Searchbar, Button, Menu, Divider, Provider, Card, Surface, } from 'react-native-paper';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';



const {width} = Dimensions.get('window')

const OpenPlayerModal = ({onPress}) => {

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
        
    }

    const handleNext = async () => {
        await changeAudio(context, 'next')
        
    }

     const handlePrev = async () => {
         await changeAudio(context, 'previous')
        
    }


    //if(!context.currentAudio) return null;

    const calculateSeekBar = () => {
        if(playbackPosition !== null && playbackDuration !== null) {
            return playbackPosition / playbackDuration;
        }

        if(currentAudio?.lastPosition) {
            return currentAudio.lastPosition / (currentAudio.duration * 1000)
        }

        return 0
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
        if(themed === "dark") {
            setBackgroundColor(color.DARK_APP_BG)
            setFont(color.DARK_FONT)
            setSearch(color.DARK_SEARCH)
            setActiveFont(color.DARK_ACTIVE_FONT)
            setFontMedium(color.DARK_FONT_MEDIUM)
            setFontLight(color.DARK_FONT_LIGHT)
            setBarColor("light-content")
        } else {
            setBackgroundColor(color.APP_BG)
            setFont(color.FONT)
            setSearch(color.SEARCH)
            setActiveFont(color.ACTIVE_FONT)
            setFontMedium(color.FONT_MEDIUM)
            setFontLight(color.FONT_LIGHT)
            setBarColor("dark-content")
        }
    }, [])

    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return <>
        <StatusBar
            animated={true}
            backgroundColor={backgroundColor}
            showHideTransition='fade'
            hidden={false}
            barStyle={barColor}
        />
        <Surface style={styles.surface}>
        <GestureRecognizer
            onSwipeUp={onPress}
            onSwipeLeft={handleNext}
            onSwipeRight={handlePrev}
            config={config}
        >
        <TouchableWithoutFeedback onPress={onPress} > 
            <View style={styles.modalContainer}>
                <View style={{width, position: 'relative', paddingTop: 0, backgroundColor: search,}}>
                    <View style={{flexDirection: 'row',}}>
                    <Text style={{color: font, fontSize: 18, width: width - 120, fontWeight: 'bold', padding: 20, paddingBottom: 0, paddingTop: 10, marginTop: 5,}} numberOfLines={1}>{currentAudio?.filename}</Text>
                    <View style={styles.audioControllers}>
                        <PlayerButton iconType='PREV' size={20} onPress={handlePrev} style={{marginTop: 5}} iconColor={font} />
                        <PlayerButton iconColor={font} onPress={handlePlayPause} style={{marginHorizontal: 15}} iconType={context.isPlaying ? 'PLAY' : 'PAUSE'} size={30} />
                        <PlayerButton iconColor={font} style={{marginTop: 5}} iconType='NEXT' size={20} onPress={handleNext} />
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
        </GestureRecognizer>
        </Surface>
    </>
}

const styles = StyleSheet.create({
    sliderContainer: {
        flex: 1,
        width: width + 33,
        marginHorizontal: -16,
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
        paddingTop: 0,
    },
    title: {
        fontSize: 18,
        width: width - 120,
        fontWeight: 'bold',
        padding: 20,
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