import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  StatusBar,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Alert,
} from "react-native";
import { theme } from '../misc/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import color from "../misc/color";
import Screen from "../components/screen";
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as MediaLibrary from 'expo-media-library';
import PlayerButton from "../components/playerbutton";
import {
  play,
  pause,
  resume,
  playNext,
  selectAudio,
  changeAudio,
  moveAudio,
} from "../misc/audiocontroller";
import GestureRecognizer from "react-native-swipe-gestures";
import {
  NavigationContainer,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { AudioContext } from "../context/audioget";
import { storeAudioForNextOpening } from "../misc/helper";
import {
  Searchbar,
  Button,
  Menu,
  Divider,
  Provider,
  Card,
  IconButton,
  Colors,
  FAB,
  DefaultTheme,
  Surface,
  Snackbar,
} from "react-native-paper";

const { width, height } = Dimensions.get("window");

const PlayerModal = (props) => {
  const [currentPosition, setCurrentPosition] = useState(0);

  const [heart, setHeart] = useState("heart-outline")

  const convertTimeMin = (minutes) => {
    if (minutes) {
      var hrs = minutes / 60;
      const minute = hrs.toString().split(".")[0];
      const percent = parseInt(hrs.toString().split(".")[1].slice(0, 2));
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

      return `${minute}:${sec}`;
    }
  };

  const [visible, setVisible] = useState(false);

  const [snackbartext, setSnackbartext] = useState('')

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

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

    return `${minute}:${sec}`;
  };

  const context = useContext(AudioContext);

  const {
    playbackPosition,
    playbackDuration,
    updateState,
    currentAudio,
    shuffle,
    addToPlaylist, 
    playList
  } = context;

  const handleShuffle = async () => {
    if (shuffle) {
      updateState(context, { shuffle: false });
    }
    if (!shuffle) {
      updateState(context, { shuffle: true });
    }
  };

  const calculateSeekBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }

    if (currentAudio.lastPosition) {
      return currentAudio.lastPosition / (currentAudio.duration * 1000);
    }
    return 0;
  };

  const renderCurrentTime = () => {
    if (!context.soundObj && currentAudio.lastPosition) {
      return convertTimeMin(currentAudio.lastPosition / 1000);
    }

    return convertTimeMin(context.playbackPosition / 1000);
  };

  useEffect(async () => {
    await context.loadPreviousAudio();
  }, []);

  const handlePlayPause = async () => {
    await selectAudio(context.currentAudio, context);
    
  };

  const handleNext = async () => {
    await changeAudio(context, "next");
    
  };

  const changeTheme = async () => {
        let themed = await AsyncStorage.getItem('theme');
        if (themed === "dark") {
            await theme("light");
        } else {
            await theme("dark");
        }
        setSnackbartext('Restart App To Apply Effect')
        onToggleSnackBar()
    }

  const handlePrev = async () => {
    await changeAudio(context, "previous");
    
  };

  if (!context.currentAudio) return null;

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
        const newAudios = result3.audios.filter(audio => audio.id !== currentAudio.id)
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
                        if(audio.id === currentAudio.id) {
                            // alert audio already in playlist
                            removeAudio()
                            return;
                        }
                    }

                    // Otherwise Update Playlist if there is any selected audio
                    list.audios = [...list.audios, currentAudio]
                    setSnackbartext('Added Song To Favourites')
                    onToggleSnackBar()
                    setHeart('heart')
                }

                return list;
            })
        }

        updateState(
            context,
            {addToPlaylist: null,
            playList: [...updatedList]}
        )
        return AsyncStorage.setItem('playlist', JSON.stringify([...updatedList]));
        
    }

    // const deleteSong = async () => {
    //     let isPlaying = context.isPlaying;
    //     let isPlayListRunning = context.isPlayListRunning;
    //     let soundObj = context.soundObj;
    //     let playbackPosition = context.playbackPosition;
    //     let activePlayList = context.activePlayList;

    //     Alert.alert(
    //         "Confirm Delete?",
    //         "Note: This action cannot be undone",
    //         [
    //             {
    //                 text: "Yes, delete the song",
    //                 onPress: async () => {
    //                     try {
    //                         if(context.isLoaded) {
    //                             //stop this audio
    //                             await context.playbackObj.stopAsync();
    //                             await context.playbackObj.unloadAsync();

    //                             isPlaying = false;
    //                             isPlayListRunning = false;
    //                             soundObj = null;
    //                             playbackPosition = 0;
    //                             activePlayList = [];
    //                         }
    //                         await MediaLibrary.deleteAssetsAsync(currentAudio.id)
    //                         setSnackbartext('Song Deleted Successfully')
    //                         onToggleSnackBar()
    //                     } catch (err) {
    //                         setSnackbartext(err.message)
    //                         onToggleSnackBar()
    //                     }
    //                 },
    //                 style: "default",
    //             },
    //             {
    //                 text: "Cancel",
    //                 style: "cancel",
    //             },
    //         ],
    //         {
    //             cancelable: true,
    //         }
    //     )
        
    //     context.updateState(context, {
    //         isPlayListRunning,
    //         activePlayList,
    //         playbackPosition,
    //         isPlaying,
    //         soundObj,
    //     })
        
    // }

    const [backgroundColor, setBackgroundColor] = useState(color.APP_BG);
    const [font, setFont] = useState(color.FONT);
    const [search, setSearch] = useState(color.SEARCH);
    const [fontMedium, setFontMedium] = useState(color.FONT_MEDIUM);
    const [fontLight, setFontLight] = useState(color.FONT_LIGHT);
    const [modalBg, setModalBg] = useState(color.MODAL_BG);
    const [activeBg, setActiveBg] = useState(color.ACTIVE_BG);
    const [activeFont, setActiveFont] = useState(color.ACTIVE_FONT);
    const [barColor, setBarColor] = useState("dark-content")


    let result2 = {}

    useEffect(async () => {
        const result = await AsyncStorage.getItem('playlist');
        let Playlists = JSON.parse(result);
        //console.log(result)
        //console.log(Playlists)
        if (currentAudio !== null) {
            
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
                            if(audio.id === currentAudio.id) {
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
    <>
      <StatusBar
            animated={true}
            backgroundColor={backgroundColor}
            showHideTransition='fade'
            hidden={false}
            barStyle={barColor}
        />
          <View style={{ flex: 1, backgroundColor: backgroundColor, padding: 20, }}>

              <Text style={[styles.audioCount, {color: fontLight}]}>{`${
                context.currentAudioIndex + 1
              } / ${context.totalAudioCount - 1}`}</Text>

            <Surface style={styles.surface}>
                <Image 
                   source={require('C:/Users/me/Documents/MusicAppProject/assets/dance.gif')}
                    style={{width: '100%', height:'100%' }} 
                />
            </Surface>

            <View style={styles.audioPlayerContainer}>
              <View style={styles.sliderContainer}>
                <Slider
                  style={(styles.slider, { width: width - 30, height: 20 })}
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
                  onSlidingStart={async () => {
                    if (!context.isPlaying) return;

                    try {
                      await pause(context.playbackObj);
                    } catch (error) {
                      console.log(error.message);
                    }
                  }}
                  onSlidingComplete={async (value) => {
                    await moveAudio(context, value);
                    setCurrentPosition(0);
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: width - 30,
                  paddingHorizontal: 15,
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: color.ACTIVE_BG, fontSize: 13 }}>
                  {currentPosition ? currentPosition : renderCurrentTime()}
                </Text>
                <Text style={{ color: fontMedium, fontSize: 13 }}>
                  {convertTimeMin(context.currentAudio.duration)}
                </Text>
              </View>
              <View style={styles.playlistContainer}>
                <Text style={[styles.audioTitle, {color: font}]} numberOfLines={1}>
                  {context.currentAudio.filename}
                </Text>
                {context.isPlayListRunning && (
                  <Text style={{color: fontMedium}}>
                    From Playlist: {context.activePlayList.title}
                  </Text>
                )}
              </View>

              <View style={styles.audioControllers}>
                <IconButton
                  icon="shuffle"
                  size={20}
                  color={shuffle ? color.ACTIVE_BG : font}
                  style={{ marginHorizontal: 25 }}
                  onPress={handleShuffle}
                />
                <PlayerButton iconType="PREV" size={25} iconColor={font} onPress={handlePrev} />
                <FAB
                  onPress={handlePlayPause}
                  color={color.ACTIVE_FONT}
                  style={{ marginHorizontal: 25, backgroundColor: color.ACTIVE_BG, }}
                  icon={context.isPlaying ? "pause" : "play"}
                />
                <PlayerButton iconType="NEXT" size={25} iconColor={font} onPress={handleNext} />
                <Ionicons
                  name="ios-volume-mute"
                  onPress={() => console.log("Mute")}
                  size={25}
                  style={{ marginHorizontal: 25 }}
                  color={color.ACTIVE_BG}
                />
              </View>

              <View style={styles.bottomButtons}>
                <IconButton
                    icon={heart}
                    size={20}
                    color="#f00"
                    style={{ marginHorizontal: 15 }}
                    onPress={handleFavourite}
                />
                <IconButton
                  icon="moon-waning-crescent"
                  onPress={changeTheme}
                  size={20}
                  style={{ marginHorizontal: 15 }}
                  color={font}
                />
                {/* <IconButton
                  icon="delete"
                  onPress={deleteSong}
                  size={20}
                  style={{ marginHorizontal: 15 }}
                  color={color.ACTIVE_BG}
                /> */}
              </View>
            </View>
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
          </View>
    </>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: 10,
    paddingBottom: 20,
  },
  audioControllers: {
    width,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    marginTop: 15,
  },
  audioPlayerContainer: {
      marginTop: 60,
      alignItems: "center",
      height: '30%',
  },
  bottomButtons: {
    width,
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
    marginTop: 20,
  },
  audioCount: {
    textAlign: "right",
    padding: 15,
    fontSize: 14,
  },
  surface: {
    elevation: 5,
    width: width-100,
    height: '40%',
    alignSelf: 'center',
    marginTop: 20,
  },
  audioTitle: {
    fontSize: 16,
    padding: 15,
  },
  playlistContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PlayerModal;
