import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, Modal, View, Dimensions, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import {Entypo} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import color from '../misc/color';

export default function PlaylistInputModal({ visible, onClose, onSubmit, }) {

    const [playlistName, setPlaylistName] = useState('')

    const handleOnSubmit = () => {
        if(!playlistName.trim()) {
            onClose()
        } else {
            onSubmit(playlistName)
            setPlaylistName('')
            onClose()
        }
    }

    const [backgroundColor, setBackgroundColor] = useState(color.APP_BG);
    const [font, setFont] = useState(color.FONT);
    const [search, setSearch] = useState(color.SEARCH);
    const [fontMedium, setFontMedium] = useState(color.FONT_MEDIUM);
    const [fontLight, setFontLight] = useState(color.FONT_LIGHT);
    const [modalBg, setModalBg] = useState(color.MODAL_BG);
    const [activeBg, setActiveBg] = useState(color.ACTIVE_BG);
    const [activeFont, setActiveFont] = useState(color.ACTIVE_FONT);

    useEffect( async () => {
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
        <Modal
            visible={visible}
            animationType='fade'
            transparent
            onRequestClose={onClose}
        >
            <View style={[styles.modalContainer]}>
                <View style={[styles.inputContainer, {backgroundColor: search,}]}>
                    <Text style={{color: font, textAlign: 'left',}}>Create New Playlist</Text>
                    <TextInput style={[styles.input, {borderBottomColor: font}]} value={playlistName} onChangeText={(text) => {setPlaylistName(text)}} />
                    <TouchableOpacity>
                        <Entypo name='check' size={24} color={activeBg} style={styles.submitIcon} onPress={handleOnSubmit} />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[StyleSheet.absoluteFillObject, styles.modalBg]}>
                </View>
            </TouchableWithoutFeedback>
        </Modal> 
    )
}


const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: width - 20,
        height: 200,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: width - 40,
        borderBottomWidth: 1,
        fontSize: 18,
        paddingVertical: 5,
    },
    submitIcon: {
        padding: 10,
        borderRadius: 50,
        marginTop: 15,
    },
    modalBg: {
        backgroundColor: color.MODAL_BG,
        zIndex: -1,
    },
})
