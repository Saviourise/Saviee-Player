import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions, FlatList } from 'react-native'
import { Searchbar, Button, Menu, Divider, Provider, Card, } from 'react-native-paper';
import color from '../misc/color';
import Screen from '../components/screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fab from '../components/fab';
import AudioListItem from '../components/audiolistitem';
import {AudioContext} from '../context/audioget';
import OptionModal from '../components/optionmodal';
import PlaylistModal from '../components/playlistmodal';
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/audiocontroller';


const SearchScreen = (props) => {

    const text = props.route.params

    const [searchItem, setSearchItem] = useState(text)

    const [searchResult, setSearchResult] = useState([])

    const [modalVisible, setModalVisible] = useState(false)

    const [selectedItem, setSelectedItem] = useState({})

    const [playlistModalVisible, setPlaylistModalVisible] = useState(false)

    const context = useContext(AudioContext)

    const {updateState, audioFiles} = context

    const navigateToPlaylist = () => {
        setPlaylistModalVisible(true)
        setModalVisible(false)
    }

    const closeModal = () => {
        setSelectedItem({});
        setModalVisible(false);
    }

    const playAudio = async (audio) => {
        await selectAudio(audio, context)
    }

    let result = []

    const search = (text) => {

        if (text!=="") {
            
            let count = Object.keys(audioFiles).length;

            for (let index = 0; index < count; index++) {
                if (audioFiles[index].filename.toLowerCase().includes(text.toLowerCase())) {
                    result.push(audioFiles[index])
                }
            }
            
            setSearchResult(result)
            
        } 
        
       
    }

    const [backgroundColor, setBackgroundColor] = useState(color.APP_BG);
    const [font, setFont] = useState(color.FONT);
    const [searchC, setSearchC] = useState(color.SEARCH);
    const [fontMedium, setFontMedium] = useState(color.FONT_MEDIUM);
    const [fontLight, setFontLight] = useState(color.FONT_LIGHT);
    const [modalBg, setModalBg] = useState(color.MODAL_BG);
    const [activeBg, setActiveBg] = useState(color.ACTIVE_BG);
    const [activeFont, setActiveFont] = useState(color.ACTIVE_FONT);

    useEffect(async () => {
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
            <View style={{flex: 1, padding: 10, paddingHorizontal: 0, alignItems: 'center', backgroundColor: backgroundColor,}}>
                <View style={{flexDirection: 'row', width, padding: 10, justifyContent: 'center',}}>
                    <Searchbar
                        placeholder='Search for music'
                        style={{width: width - 40, fontSize: 18, backgroundColor: searchC,}}
                        inputStyle={{color: font}}
                        iconColor={fontLight}
                        placeholderTextColor={fontLight}
                        value={searchItem}
                        onChangeText={(text) => {
                            setSearchItem(text)
                            search(text)
                        }}
                    />
                </View>
                <Screen>
                {searchResult.length ? (<FlatList
                    contentContainerStyle={styles.listContainer}
                    data={searchResult}
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
                    color: color.ACTIVE_BG,
                    opacity: 0.3,
                    fontSize: 20,
                    paddingTop: 50,
                }}>
                    Continue Your Search
                </Text>
            )}
            </Screen>
            </View>

            <Fab />


            <OptionModal
                visible={modalVisible}
                onClose={closeModal} 
                options={[
                    {title: 'Add to playlist', onPress: navigateToPlaylist, icon: "playlist-plus"}
                ]} 
                currentItem={selectedItem}
                navigation={props.navigation}
            />

            <PlaylistModal
                onPlaylistPress={() => {
                    updateState(context, {
                        addToPlaylist: selectedItem,
                    })
                    props.navigation.navigate('Playlist')
                }}
                currentItem={selectedItem}
                onClose={() => {
                    setPlaylistModalVisible(false)
                }}
                visible={playlistModalVisible}
            />
        </>
    )
}

export default SearchScreen

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({})