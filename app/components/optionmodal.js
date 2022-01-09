import React, {useState, useContext} from 'react'
import {AudioContext} from '../context/audioget';
import { View, Text, Modal, StatusBar, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Dimensions } from 'react-native'
import color from '../misc/color';
import {Entypo, AntDesign, Feather, MaterialCommunityIcons, Ionicons, MaterialIcons} from '@expo/vector-icons'
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/audiocontroller';
import { Searchbar, Button, Menu, Divider, Provider, Card, IconButton, Colors } from 'react-native-paper';

const OptionModal = ({
    visible,
    currentItem,
    onClose,
    onPlayPress,
    onPlaylistPress,
    options}) => {

    const {filename} = currentItem
    const context = useContext(AudioContext)
    const {addedToQueue, updateState} = context
    //const [queue, setQueue] = useState([])

    const addToQueue = () => {
        const queue = addedToQueue
        //console.log(addedToQueue)
        queue.unshift(currentItem)
        //setQueue(queue)
        console.log(queue)
        console.log(addedToQueue)
        updateState(context, {
            addedToQueue: queue
        })
    }

    const addToQueuePush = () => {
        const queue = addedToQueue
        queue.push(currentItem)
        //setQueue(queue)
        //console.log(queue)
        //console.log(addedToQueue)
        updateState(context, {
            addedToQueue: queue
        })
    }

    return (
        <>
            <StatusBar hidden={true} />
            <Modal
                animationType='slide'
                transparent
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.modal}>
                    <View style={{flexDirection: 'row', padding: 20, paddingBottom: 0, justifyContent: 'space-between',}}>
                        <Text style={styles.title} numberOfLines={1}>{filename}</Text>
                        <Entypo
                            name="heart-outlined"
                            size={20}
                            color={color.FONT_MEDIUM}
                        />
                    </View>
                    <View style={styles.optionContainer}>
                        {options.map(optn => {
                            return (<TouchableWithoutFeedback key={optn.title} onPress={optn.onPress}>
                                        <View style={{flexDirection: 'row', paddingVertical: 10,}}>
                                            <MaterialCommunityIcons 
                                                name={optn.icon}
                                                size={20}
                                                style={styles.textIcon}
                                            />
                                            <Text style={styles.option}>{optn.title}  
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>)
                        })}
                        <TouchableWithoutFeedback onPress={addToQueue}>
                            <View style={{flexDirection: 'row', paddingVertical: 10,}}>
                                <MaterialCommunityIcons 
                                    name="play-box-multiple"
                                    size={20}
                                    style={styles.textIcon}
                                />
                                <Text style={styles.option}>Play Next
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={addToQueuePush}>
                            <View style={{flexDirection: 'row', paddingVertical: 10,}}>
                                <MaterialIcons 
                                    name="queue"
                                    size={20}
                                    style={styles.textIcon}
                                />
                                <Text style={styles.option}>Add to playing queue
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <Divider />
                        <TouchableWithoutFeedback>
                            <View style={{flexDirection: 'row', paddingVertical: 10,}}>
                                <MaterialCommunityIcons 
                                    name="information"
                                    size={20}
                                    style={styles.textIcon}
                                />
                                <Text style={styles.option}>Song Details  
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalBg}></View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: color.APP_BG,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        zIndex: 1000,
    },
    optionContainer: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        width: width - 90,
        fontWeight: 'bold',
        paddingBottom: 0,
        color: color.FONT_MEDIUM
    },
    option: {
        fontSize: 16,
        color: color.FONT,
        letterSpacing: 1,
        paddingHorizontal: 15,
    },
    modalBg: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: color.MODAL_BG,
    }
})

export default OptionModal
