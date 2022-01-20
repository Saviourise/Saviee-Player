import React, {useState, useContext, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import color from '../misc/color';
import {AudioContext} from '../context/audioget';
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/audiocontroller';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true
    }
  }
})

const Fab = () => {

    const context = useContext(AudioContext);

    const { playbackPosition, playbackDuration, currentAudio } = context;

    const handlePlayPause = async () => {
        await selectAudio(context.currentAudio, context)
    }

    if(!context.currentAudio) return null;

return (
  <FAB
    style={styles.fab}
    color={color.ACTIVE_FONT}
    icon={context.isPlaying ? 'pause' : 'play'}
    onPress={handlePlayPause}
  />
);


}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 50,
    backgroundColor: color.ACTIVE_BG,
    zIndex: 98765432345678,
  },
})

export default Fab;
