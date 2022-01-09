import React from 'react'
import { View,
Text, Modal, StatusBar, StyleSheet, TouchableWithoutFeedback, Dimensions, TouchableOpacity } from 'react-native'
import color from '../misc/color';

const {width} = Dimensions.get('window')

const PlaylistModal = ({visible, currentItem, onClose, onPlayPress, onPlaylistPress}) => {

    const {filename} = currentItem
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
                        <TouchableOpacity onPress={() => console.log("Add New Playlist")} style={{ marginTop: 10, textAlign:'right',}}>
                            <Text style={styles.playlistButton}>+ Create New Playlist</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>


                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalBg}></View>
                </TouchableWithoutFeedback>
            </Modal>
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
