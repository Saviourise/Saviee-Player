import React, { useState, useContext, Component, useEffect } from 'react';
import { StyleSheet, Text, Modal, View, RefreshControl, SafeAreaView, ScrollView, Dimensions, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import {Entypo, AntDesign, Feather, MaterialCommunityIcons, Ionicons} from '@expo/vector-icons'
import color from '../misc/color';
import CardView from 'react-native-cardview'
import {AudioContext} from '../context/audioget';
import { storeAudioForNextOpening } from '../misc/helper';
import { theme } from '../misc/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar, Button, Menu, Divider, Provider, Card, IconButton, Colors, Snackbar } from 'react-native-paper';
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/audiocontroller';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function UnderSearch() {

    const context = useContext(AudioContext);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

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
        playbackObj,
        darkTheme,
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

    const [visible, setVisible] = useState(false);

  const [snackbartext, setSnackbartext] = useState('')

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

    const changeTheme = async () => {
        let themed = await AsyncStorage.getItem('theme');
        if (themed === "dark") {
            await theme("light");
        } else {
            await theme("dark");
        }
        setSnackbartext('Restart App To Apply Effect')
        onToggleSnackBar()
        onRefresh()
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

    const [backgroundColor, setBackgroundColor] = useState(color.APP_BG);
    const [font, setFont] = useState(color.FONT);
    const [search, setSearch] = useState(color.SEARCH);
    const [fontMedium, setFontMedium] = useState(color.FONT_MEDIUM);
    const [fontLight, setFontLight] = useState(color.FONT_LIGHT);
    const [modalBg, setModalBg] = useState(color.MODAL_BG);
    const [activeBg, setActiveBg] = useState(color.ACTIVE_BG);
    const [activeFont, setActiveFont] = useState(color.ACTIVE_FONT);
    const [themeBack, setThemeBack] = useState("rgba(121, 160, 90, 0.2)")
    const [themeColor, setThemeColor] = useState()

    useEffect(async () => {
        let themed = await AsyncStorage.getItem('theme');
        if(themed === "dark") {
            setBackgroundColor(color.DARK_APP_BG)
            setFont(color.DARK_FONT)
            setSearch(color.DARK_SEARCH)
            setActiveFont(color.DARK_ACTIVE_FONT)
            setFontMedium(color.DARK_FONT_MEDIUM)
            setFontLight(color.DARK_FONT_LIGHT)
            setThemeBack("rgba(0,0,0, 1)")
            setThemeColor("#fff")
        } else {
            setBackgroundColor(color.APP_BG)
            setFont(color.FONT)
            setSearch(color.SEARCH)
            setActiveFont(color.ACTIVE_FONT)
            setFontMedium(color.FONT_MEDIUM)
            setFontLight(color.FONT_LIGHT)
            setThemeBack("rgba(121, 160, 90, 0.2)")
            setThemeColor("#000")
        }
    }, [])

    return (
        <>
        <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Provider>
            <View style={{padding: 10, paddingHorizontal: 40, alignItems: 'center', backgroundColor: backgroundColor,}}>
                <View style={{flexDirection: 'row', width: width-100, padding: 10, justifyContent: 'space-between',}}>
                    <TouchableOpacity>
                        <View style={shuffle ? {backgroundColor: "rgba(23, 76, 255, 1)", padding: 12, borderRadius: 50,} : {backgroundColor: "rgba(23, 76, 255, 0.2)", padding: 12, borderRadius: 50,}}>
                            <IconButton 
                                icon='shuffle' 
                                size={20}
                                color={font}
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
                                color={font}
                                style={styles.shuffleIcon2} 
                                onPress={handleOnSearch} 
                            />
                        </View>
                        <Text style={{textAlign: 'center', paddingTop: 10, color: color.FONT_MEDIUM}}>Playlist</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <View style={{backgroundColor: themeBack, padding: 12, borderRadius: 50,}}>
                            <IconButton
                                icon='theme-light-dark'
                                size={20}
                                color={themeColor}
                                style={styles.shuffleIcon3} 
                                onPress={changeTheme} 
                            />
                        </View>
                        <Text style={{textAlign: 'center', paddingTop: 10, color: color.FONT_MEDIUM}}>Theme</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{width, backgroundColor: backgroundColor, marginBottom: -5,}}>
                <View style={{flexDirection: 'row', width: width-10, padding: 10, paddingLeft: 20, paddingVertical: 15, justifyContent: 'space-between',}}>
                    <Text style={{color: font, paddingTop: 10}}>All Songs <Text style={{color: color.FONT_LIGHT}}>{`(${context.totalAudioCount - 1})`}</Text></Text>
                    
                    <Menu
                            visible={menuVisible}
                            onDismiss={closeMenu}
                            anchor={<IconButton
                                        icon='format-list-checkbox' 
                                        size={20} 
                                        color={color.ACTIVE_BG} 
                                        style={styles.listIcon}
                                        onPress={openMenu}
                                    />}>
                            <Menu.Item onPress={() => {}} title="Delete Playlist" />
                        </Menu>
                </View>
            </View>
            </Provider>
            </ScrollView>
    </SafeAreaView>
    <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={2000}
                action={{
                label: 'Close',
                onPress: () => {
                    // Do something
                },
                }}>
                {snackbartext}
            </Snackbar>
        </>
    )
}

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
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
        padding: 5,
    },
    shuffleIcon2: {
        padding: 5,
    },
    shuffleIcon3: {
        padding: 5,
    },
})
