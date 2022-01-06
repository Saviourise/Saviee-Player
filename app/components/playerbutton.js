import React from 'react'
import {Ionicons} from '@expo/vector-icons'
import { View, Text, StyleSheet, Dimensions, Modal, StatusBar, TouchableNativeFeedback, TouchableOpacity, TouchableHighlight } from 'react-native';
import color from '../misc/color';

const PlayerButton = (props) => {

    const {iconType, size = 55, iconColor = color.FONT, onPress, otherProps} = props;

    const getIconName = (type) => {
        switch(type) {
            case 'PLAY':
                return 'ios-pause-circle';
            case 'PAUSE':
                return 'ios-play-circle'
            case 'NEXT':
                return 'ios-play-skip-forward';
            case 'PREV':
                return 'ios-play-skip-back';
        }
    }

    return (
        <TouchableOpacity>
            <Ionicons {...props} onPress={onPress} name={getIconName(iconType)} size={size} color={iconColor} />
        </TouchableOpacity>
    )
}


export default PlayerButton
