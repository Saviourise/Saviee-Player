import React, { useState } from 'react'
import { StyleSheet, Text, Modal, View, Dimensions, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import {Entypo} from '@expo/vector-icons'
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

    return (
        <Modal
            visible={visible}
            animationType='fade'
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.inputContainer}>
                    <Text style={{color: '#000', textAlign: 'left',}}>Create New Playlist</Text>
                    <TextInput style={styles.input} value={playlistName} onChangeText={(text) => {setPlaylistName(text)}} />
                    <TouchableOpacity>
                        <Entypo name='check' size={24} iconColor={color.ACTIVE_BG} style={styles.submitIcon} onPress={handleOnSubmit} />
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
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: width - 40,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        fontSize: 18,
        paddingVertical: 5,
    },
    submitIcon: {
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 50,
        marginTop: 15,
    },
    modalBg: {
        backgroundColor: color.MODAL_BG,
        zIndex: -1,
    },
})
