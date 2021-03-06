import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions, FlatList, StatusBar } from 'react-native'
import { Searchbar, Button, Menu, Divider, Provider, Card, Appbar } from 'react-native-paper';
import color from '../misc/color';
import AudioListItem from '../components/audiolistitem';
import Fab from '../components/fab';
import {AudioContext} from '../context/audioget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/audiocontroller';

const QueueScreen = (props) => {

    const context = useContext(AudioContext)

    const {updateState, addedToQueue, currentAudio} = context

    const playAudio = async (audio) => {
        await selectAudio(audio, context)
    }

    const goBack = () => {
        props.navigation.goBack()
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

    return ( <>
        <StatusBar
            animated={true}
            backgroundColor={color.ACTIVE_BG}
            showHideTransition='fade'
            hidden={false}
            barStyle="light-content"
        />
        <Appbar.Header style={{backgroundColor: color.ACTIVE_BG,}}>
            <Appbar.BackAction onPress={goBack} />
            <Appbar.Content title="Currently Playing" subtitle={currentAudio.filename} subtitleStyle={{fontSize:17, paddingVertical: 5,}} />
        </Appbar.Header>
        <View style={[styles.container, {backgroundColor: backgroundColor,}]}>

        <View style={ [styles.allSongsView, {backgroundColor: backgroundColor,}]}>
                <View style={{flexDirection: 'row', width: width-10, padding: 10, paddingLeft: 20, paddingVertical: 15, justifyContent: 'space-between',}}>
                    <Text style={{color: font,}}>Next Songs</Text>
                </View>
            </View>

            {addedToQueue.length ? (<FlatList
                    contentContainerStyle={styles.listContainer}
                    data={addedToQueue}
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
                                    return
                                    // setSelectedItem(item);
                                    // setModalVisible(true);
                                }}
                            />
                        </View>
                    )}
                />
            ) : (
                <Text style={{
                    color: color.ACTIVE_BG,
                    opacity: 0.3,
                    fontSize: 20,
                    paddingTop: 50,
                }}>
                    No Song In Queue
                </Text>
            )}

            <Fab />
        </View>
        </>
    )
}

export default QueueScreen

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingHorizontal: 0,
        alignItems: 'center',
    },
    allSongsView: {
        width,
    },
})
