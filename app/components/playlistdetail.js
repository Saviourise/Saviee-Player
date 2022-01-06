import React from 'react'
import { StyleSheet, Text, View, Modal, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native'
import AudioListItem from './audiolistitem';
import color from '../misc/color';
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/audiocontroller';

export default function PlayListDetail({visible, playList, onClose,}) {

    const playAudio = (audio) => {
        selectAudio(audio, )
    }
    return (
        <Modal
            visible={visible}
            animationType='slide'
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <Text style={styles.title}>{playList.title}</Text>
                <FlatList
                    contentContainerStyle={styles.listContainer}
                    data={playList.audios}
                    key={item => item.id.toString()}
                    renderItem={({item}) => (
                        <View style={{marginBottom: 10,}}>
                            <AudioListItem title={item.filename} duration={item.duration} onAudioPress={() => playAudio(item)} />
                        </View>
                    )} />
            </View>

            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[StyleSheet.absoluteFillObject, styles.modalBg]}>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        height: height - 150,
        width,
        backgroundColor: '#fff',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 20,
    },
    modalBg: {
        backgroundColor: color.MODAL_BG,
        zIndex: -1,
    },
    listContainer: {
        padding: 20,
    },
    title: { 
        textAlign: 'center',
        fontSize: 20,
        paddingVertical: 5,
        fontWeight: 'bold',
        color: color.ACTIVE_BG,
    },
})
