import React, { useState, useEffect, useContext } from 'react'
import { View,
Text, Modal, StatusBar, StyleSheet, TouchableWithoutFeedback, Dimensions, TouchableOpacity } from 'react-native'
import color from '../misc/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlaylistInputModal from "../components/playlistinputmodal";
import {AudioContext} from '../context/audioget';

const {width} = Dimensions.get('window')

const PlaylistModal = ({visible, currentItem, onClose, onPlayPress, onPlaylistPress}) => {

    const {filename} = currentItem
    const [modalVisible, setModalVisible] = useState(false);

     const context = useContext(AudioContext)

    const {playList, addToPlaylist, updateState} = context 

    const createPlaylist = async (playlistName) => {
        const result = await AsyncStorage.getItem('playlist');
        if(result !== null) {
            const audios = [];
            if(addToPlaylist) {
                audios.push(addToPlaylist)
            }
            const newList = {
                id: Date.now(),
                title: playlistName,
                audios: audios,
            }

            const updatedList = [...playList, newList];
            updateState(context, {addToPlaylist: null, playList: updatedList})
            await AsyncStorage.setItem('playlist', JSON.stringify(updatedList))
        }
        setModalVisible(false)
    }


    return (
        <>
            
            <Modal
                animationType='fade'
                style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}
                transparent
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.inputContainer}>
                    <Text style={styles.title} numberOfLines={2}>{filename}</Text>
                    <View style={styles.optionContainer}>
                        <TouchableWithoutFeedback onPress={onPlaylistPress}>
                            <Text style={styles.option}>See All Playlists</Text>
                        </TouchableWithoutFeedback>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(true)
                            onClose
                        }} style={{ marginTop: 10, textAlign:'right',}}>
                            <Text style={styles.playlistButton}>+ Create New Playlist</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>


                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalBg}></View>
                </TouchableWithoutFeedback>
            </Modal>
            <PlaylistInputModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={createPlaylist}
            />
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: width - 20,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    optionContainer: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 20,
        paddingBottom: 0,
        color: color.FONT_MEDIUM
    },
    option: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.FONT,
        paddingVertical: 10,
        letterSpacing: 1,
    },
    modalBg: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: color.MODAL_BG,
        zIndex: -1,
    }
})

export default PlaylistModal
