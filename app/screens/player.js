import React, { useState, useContext, Component, useEffect } from 'react';
import OpenPlayerModal from '../components/openplayermodal';
import AudioListItem from '../components/audiolistitem';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import color from '../misc/color';
import { Entypo, MaterialIcons, MaterialCommunityIcons, Ionicons, } from '@expo/vector-icons';
import SearchComponent from '../components/searchComponent';
import Fab from '../components/fab';
import {AudioContext} from '../context/audioget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar, Button, Menu, Divider, Provider, Avatar, Card, Title, Paragraph, IconButton, } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/audiocontroller';

const Player = (props) => {

    const context = useContext(AudioContext)

    const {darkTheme, updateState, currentAudio, playList } = context 

    const [audios, setAudios] = useState([])

    const [listAudios, setListAudios] = useState([])

    const [playlist, setPlaylist] = useState({})

    const handlePlayPause = async () => {
        await selectAudio(context.currentAudio, context)
    }
    
    const searchPress = (text) => {
        props.navigation.navigate('SearchScreen', text)
    }

    const playAudio = async (audio) => {
        await selectAudio(audio, context, {
            activePlayList: playlist,
            isPlayListRunning: true
        });
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

        
        let list = JSON.parse(result);
        setListAudios(list)
        let counter = Object.keys(list).length;
        for (let index = 0; index < counter; index++) {
            if (list[index].title === "Favourites") {
                result2 = list[index]
            }
        }
        
        setAudios(result2.audios)
        setPlaylist(result2)
    

        let themed = await AsyncStorage.getItem('theme');
        if(themed === "light") {
            setBackgroundColor(color.APP_BG)
            setFont(color.FONT)
            setSearch(color.SEARCH)
            setActiveFont(color.ACTIVE_FONT)
            setFontMedium(color.FONT_MEDIUM)
            setFontLight(color.FONT_LIGHT)
        } else {
            setBackgroundColor(color.DARK_APP_BG)
            setFont(color.DARK_FONT)
            setSearch(color.DARK_SEARCH)
            setActiveFont(color.DARK_ACTIVE_FONT)
            setFontMedium(color.DARK_FONT_MEDIUM)
            setFontLight(color.DARK_FONT_LIGHT)
        }
    }, [])

    if(!context.currentAudio) return null;

    const LeftContent = props => <IconButton 
                                    style={{backgroundColor: color.ACTIVE_BG, }} 
                                    color="#fff" 
                                    {...props} 
                                    onPress={handlePlayPause} 
                                    size={25} 
                                    icon={context.isPlaying ? 'pause' : 'play'} 
                                />

    const handleBannerPress = (item) => {
        props.navigation.navigate('PlayListDetail', item)
    }
    
    return (
        <>
        <View style={{flex: 1, backgroundColor: backgroundColor, }}>
            
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

            <View style={styles.cardContainer}>
                
                <Title 
                    style={{fontWeight: 'bold', color: color.ACTIVE_BG, marginBottom: 10}}
                > 
                    <Ionicons 
                        name="game-controller" 
                        size={20} 
                        color={color.ACTIVE_BG}
                    />  Last Played 
                </Title>
                <Card style={{elevation: 6,}}>
                    <LinearGradient
                        // Background Linear Gradient
                        colors={[search, color.ACTIVE_BG]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        locations={[0, 1]}
                        style={styles.background}
                    >
                    <Card.Title 
                        subtitleStyle={{color: font}} 
                        subtitle="Continue from where you left off" 
                        left={LeftContent} 
                    />
                    <Card.Content>
                    <Paragraph style={{paddingBottom: 20, color: font,}}>{context.currentAudio.filename}</Paragraph>
      
                    </Card.Content>
                    </LinearGradient>
                </Card>

            </View>

            <View style={{padding: 20, height: '30%'}}>
                
                <Title 
                    style={{fontWeight: 'bold', color: "#f00", marginBottom: 10}}
                > 
                    <Ionicons 
                        name="heart" 
                        size={20} 
                        color="#f00"
                    />  Favourites 
                </Title>
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
                            />
                        </View>
                    )}
                />
            ) : (
                <Text style={{
                    color: color.ACTIVE_BG,
                    opacity: 0.3,
                    fontSize: 20,
                }}>
                    No Favourite Song
                </Text>
            )}


        </View>

            <View style={{padding:20, height: '30%'}}>

                <Title 
                    style={{fontWeight: 'bold', color: color.ACTIVE_BG, marginBottom: 10}}
                > 
                    <MaterialCommunityIcons 
                        name="playlist-music" 
                        size={20} 
                        color={color.ACTIVE_BG}
                    />  Playlists 
                </Title>

                <View style={{ flex:1, width: '100%'}}>

                {listAudios.length ? (<FlatList
                    contentContainerStyle={styles.listContainer}
                    data={listAudios}
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
                                borderWidth: 1, 
                                borderRadius: 10, 
                                borderColor: "#f00",
                            } : {
                                padding: 10, 
                                width: '45%', 
                                marginBottom: 10, 
                                marginHorizontal: 10, 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                borderWidth: 1, 
                                borderRadius: 10, 
                                borderColor: color.ACTIVE_BG,
                            }}
                            onPress={() => handleBannerPress(item)}
                        >
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
            ) : (
                <Text style={{
                    color: color.ACTIVE_BG,
                    opacity: 0.3,
                    fontSize: 20,
                }}>
                    No Playlist
                </Text>
            )}

            </View>

        </View>

            <Fab />

            
        </View>


        <OpenPlayerModal onPress={() => {props.navigation.navigate('PlayerModal')}}/>
        </>
    )
}

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardContainer: {
        padding: 20,
    }
})




export default Player;