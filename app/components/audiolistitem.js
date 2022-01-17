import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Entypo, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import color from '../misc/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton, Colors } from 'react-native-paper';

const getThumbnailText = (filename) => filename[0]

const convertTime = (minutes) => {
    if (minutes) {
        var hrs = minutes/60;
        const minute = hrs.toString().split('.')[0];
        const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2));
        const sec = Math.ceil((60 * percent) / 100);

        if (parseInt(minute) < 10 && sec < 10) {
            return `0${minute}:0${sec}`;
        }

        if (sec == 60) {
            return `${minute + 1}:00`;
        }

        if (parseInt(minute) < 10) {
            return `0${minute}:${sec}`;
        }

        if (sec < 10) {
            return `${minute}:0${sec}`;
        }

        return `${minute}:${sec}`
    }
}


const renderPlayPauseIcon = isPlaying => {
    if(isPlaying) return <MaterialCommunityIcons name="waveform" color={color.ACTIVE_FONT} size={35} />
    return <Entypo name="controller-play" size={24} color={color.ACTIVE_FONT} />
}




const AudioListItem = ({title, duration, onOptionPress, onAudioPress, isPlaying, activeListItem}) => {
    
    const [backgroundColor, setBackgroundColor] = useState(color.APP_BG);
    const [font, setFont] = useState(color.FONT);
    const [search, setSearch] = useState(color.SEARCH);
    const [fontMedium, setFontMedium] = useState(color.FONT_MEDIUM);
    const [fontLight, setFontLight] = useState(color.FONT_LIGHT);
    const [modalBg, setModalBg] = useState(color.MODAL_BG);
    const [activeBg, setActiveBg] = useState(color.ACTIVE_BG);
    const [activeFont, setActiveFont] = useState(color.ACTIVE_FONT);

    useEffect(async () => {
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
    })
    
    return (
    <>
    <View style={{backgroundColor: backgroundColor, width,}}>
      <View style={[styles.container, {backgroundColor: activeListItem ? "rgba(51, 136, 255, 0.2)" : backgroundColor}]}>

      <TouchableOpacity onPress={onAudioPress}>
        <View style={styles.leftContainer}>
            <View style={[styles.thumbnail, {backgroundColor: activeListItem ? color.ACTIVE_BG : color.FONT}]}>
                <Text style={styles.thumbnailText}>
                {activeListItem ? renderPlayPauseIcon(isPlaying) : <MaterialIcons name="music-note" color={color.FONT_LIGHT} size={15} />}
                </Text>
            </View>
            
                
                
                
            <View style={styles.titleContainer}>
  <Text numberOfLines={1} style={[styles.title, {color: font}]}>
                    {title.split('.').slice(0, -1).join('.')}
                    </Text>
<Text style={styles.timeText}>
                {convertTime(duration)}
                </Text>
                    
            </View>
        </View>
        </TouchableOpacity>

        
        <View style={styles.rightContainer}>
        <TouchableOpacity>
            <IconButton
            icon="dots-vertical"
            size={20}
            color={color.FONT_MEDIUM}
            onPress={onOptionPress}
            />
            </TouchableOpacity>
        </View>
        
      </View>
      </View>
      {/* <View style={styles.seperator} /> */}
    </>
    );
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        width,
        zIndex: 10,
        padding: 10,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 10,
    },
    rightContainer: {
        flex: 1,
        flexBasis: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnail: {
        height: 40,
        backgroundColor: color.FONT,
        flexBasis: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    thumbnailText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: color.FONT_LIGHT,
    },
    titleContainer: {
        width: width - 110,
        paddingLeft: 10,
    },
    title: {
        fontSize: 16,
        color: color.FONT,
    },
    seperator: {
        width: width - 30,
        backgroundColor: '#333',
        opacity: 0.3,
        height: 0.5,
        alignSelf: 'center',
        marginTop: 10,
    },
    timeText: {
        fontSize: 14,
        color: color.FONT_LIGHT,
    }
})

export default AudioListItem;
