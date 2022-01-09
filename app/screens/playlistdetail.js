import React, { useState, useContext, Component, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, FlatList, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import AudioListItem from '../components/audiolistitem';
import color from '../misc/color';
import {AudioContext} from '../context/audioget';
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/audiocontroller';
import OptionModal from '../components/optionmodal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlayListDetail = (props) => {

    const context = useContext(AudioContext);

    const playList = props.route.params


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

    return (
        <>
            <View style={styles.container}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                    width: '100%',
                }}>
                    <Text style={styles.title}>{playList.title}</Text>
                    <TouchableOpacity onPress={removePlaylist}>
                        <Text style={styles.title, {color: color.FONT}}>Delete</Text>
                    </TouchableOpacity>
                </View>
                
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

            <OptionModal
                visible={modalVisible}
                onClose={closeModal} 
                options={[
                    {title: 'Remove from playlist', onPress: removeAudio, icon: "playlist-remove"}
                ]} 
                currentItem={selectedItem}
            />    
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: color.APP_BG,
    },
    title: { 
        textAlign: 'center',
        fontSize: 20,
        paddingVertical: 5,
        fontWeight: 'bold',
        color: color.ACTIVE_BG,
    },
})


export default PlayListDetail
