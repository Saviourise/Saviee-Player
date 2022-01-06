import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';

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
    if(isPlaying) return <Entypo name="controller-paus" size={24} color={color.ACTIVE_FONT} />
    return <Entypo name="controller-play" size={24} color={color.ACTIVE_FONT} />
}


const AudioListItem = ({title, duration, onOptionPress, onAudioPress, isPlaying, activeListItem}) => {
    return (
    <>
    <View style={styles.container1}>
      <View style={[styles.container, {backgroundColor: activeListItem ? "rgba(51, 136, 255, 0.2)" : color.APP_BG}]}>

      <TouchableOpacity onPress={onAudioPress}>
        <View style={styles.leftContainer}>
            <View style={[styles.thumbnail, {backgroundColor: activeListItem ? color.ACTIVE_BG : color.FONT_LIGHT}]}>
                <Text style={styles.thumbnailText}>
                {activeListItem ? renderPlayPauseIcon(isPlaying) : getThumbnailText(title)}
                </Text>
            </View>
            
                
                
                
            <View style={styles.titleContainer}>
  <Text numberOfLines={1} style={styles.title}>
                    {title}
                    </Text>
<Text style={styles.timeText}>
                {convertTime(duration)}
                </Text>
                    
            </View>
        </View>
        </TouchableOpacity>

        
        <View style={styles.rightContainer}>
        <TouchableOpacity>
        <Entypo
            name="heart-outlined"
            size={20}
            color={color.FONT_MEDIUM}
            style={{padding: 5, }}
            />
        </TouchableOpacity>
        <TouchableOpacity>
            <Entypo
            name="dots-three-vertical"
            size={20}
            color={color.FONT_MEDIUM}
            onPress={onOptionPress}
            style={{padding: 5,}}
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
        width: width-20,
        zIndex: 10,
        padding: 10,
        borderRadius: 15,
    },
    container1: {
        backgroundColor: color.APP_BG,
        width,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        flexBasis: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnail: {
        height: 50,
        backgroundColor: color.FONT_LIGHT,
        flexBasis: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    thumbnailText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: color.FONT,
    },
    titleContainer: {
        width: width - 160,
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
