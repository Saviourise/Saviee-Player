import React, { Component, createContext } from 'react';
import { Text, View, Alert, DeviceEventEmitter } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import {DataProvider} from 'recyclerlistview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Audio} from 'expo-av';
import { storeAudioForNextOpening } from '../misc/helper';
import { play, pause, resume, playNext } from '../misc/audiocontroller';
import MusicFiles from 'react-native-get-music-files';


export const AudioContext = createContext()
export default class Audioget extends Component {

    

    constructor(props) {
        super(props)
        this.state = {
            audioFiles: [],
            playList: [],
            addToPlaylist: null,
            permissionError: false,
            dataProvider: new DataProvider((r1, r2) => r1 !== r2),
            playbackObj: null,
            soundObj: null,
            currentAudio: {},
            isPlaying: false,
            isPlayListRunning: false,
            activePlayList: [],
            currentAudioIndex: null,
            playbackPosition: null,
            playbackDuration: null,
        }

        this.totalAudioCount = 0;
    }

    permissionAllert = () => {
        Alert.alert("Permission Required", "Saviee Player Require your permission to read audio files!", [{
            text: 'I am ready',
            onPress: () => this.getPermission()
        },{
            text: 'cancle',
            onPress: () => this.permissionAllert()
        }])
    }

    getAudioFiles = async () => {
        const {dataProvider, audioFiles} = this.state
        let media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
        });
        media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
            first: media.totalCount,
        });
        this.totalAudioCount = media.totalCount
        media = [...media.assets].sort((a, b) => a['filename'] > b['filename']);
        //console.log(media)
        //console.log(media.assets.length)
        this.setState({...this.state, dataProvider: dataProvider.cloneWithRows([...audioFiles, ...media]), audioFiles: [...audioFiles, ...media]})
    }

    loadPreviousAudio = async () => {
        //Load Audio From async Storage
        let previousAudio = await AsyncStorage.getItem('previousAudio');
        let currentAudio;
        let currentAudioIndex;

        if(previousAudio === null) {
            currentAudio = this.state.audioFiles[0];
            currentAudioIndex = 0
        } else {
            previousAudio = JSON.parse(previousAudio);
            currentAudio = previousAudio.audio
            currentAudioIndex = previousAudio.index
        }

        this.setState({...this.state, currentAudio, currentAudioIndex})
    }

    getPermission = async () => {
        // {
        //     "canAskAgain": true,
        //     "expires": "never",
        //     "granted": false,
        //     "status": "undetermined",
        // }
        const permission = await MediaLibrary.getPermissionsAsync()
        if (permission.granted) {
            // get all audio files
            this.getAudioFiles();
        }

        if(!permission.canAskAgain && !permission.granted) {
            // display an error to the user
                this.setState({...this.State, permissionError: true});
        }

        if (!permission.granted && permission.canAskAgain) {
            const {status, canAskAgain} = await MediaLibrary.requestPermissionsAsync();
            if (status === 'denied' && canAskAgain) {
                // display an alert that user must allow permission
                this.permissionAllert();
            }

            if (status === 'granted') {
                // get all audio files
                this.getAudioFiles();
            }

            if (status === 'denied' && !canAskAgain) {
                // display an error to the user
                this.setState({...this.State, permissionError: true})
            }
        }
    }

    onPlaybackStatusUpdate = async (playbackStatus) => {
        if(playbackStatus.isLoaded && playbackStatus.isPlaying) {
            this.updateState(this, {
                playbackPosition: playbackStatus.positionMillis,
                playbackDuration: playbackStatus.durationMillis,
            });
        }

        if(playbackStatus.isLoaded && !playbackStatus.isPlaying) {
            storeAudioForNextOpening(
                this.state.currentAudio,
                this.state.currentAudioIndex,
                playbackStatus.positionMillis
            )
            console.log(playbackStatus.positionMillis)
        }

        if(playbackStatus.didJustFinish) {
            if(this.state.isPlayListRunning) {
                let audio;
                const indexOnPlayList = this.state.activePlayList.audios.findIndex(({id}) => id === this.state.currentAudio.id);
                const nextIndex = indexOnPlayList + 1;
                audio = this.state.activePlayList.audios[nextIndex];

                if(!audio) audio = this.state.activePlayList.audios[0];

                const indexOnAllList = this.state.audioFiles.findIndex(({id}) => id === audio.id)

                const status = await playNext(this.state.playbackObj, audio.uri)
                return this.updateState(this, {
                    soundObj: status,
                    isPlaying: true,
                    currentAudio: audio,
                    currentAudioIndex: indexOnAllList
                });
            }
            const nextAudioIndex = this.state.currentAudioIndex + 1;
            if(nextAudioIndex >= this.totalAudioCount) {
                this.state.playbackObj.unloadAsync();
                this.updateState(this, {
                    soundObj: null,
                    currentAudio: this.state.audioFiles[0],
                    isPlaying: false,
                    currentAudioIndex: 0,
                    playbackPosition: null,
                    playbackDuration: null,
                });
                return await storeAudioForNextOpening(this.state.audioFiles[0], 0);
            } 

            const audio = this.state.audioFiles[nextAudioIndex];
            const status = await playNext(this.state.playbackObj, audio.uri)
            this.updateState(this, {
                soundObj: status,
                currentAudio: audio,
                isPlaying: true,
                currentAudioIndex: nextAudioIndex,
            });
            await storeAudioForNextOpening(audio, nextAudioIndex);
        }
    }

    componentDidMount(){
        this.getPermission()
        if(this.state.playbackObj === null) {
            this.setState({...this.state, playbackObj: new Audio.Sound()});
        }
    }

    updateState = (prevState, newState = {}) => {
        this.setState({...prevState, ...newState})
    }

    render() {
        const {
            audioFiles,
            playList,
            addToPlaylist,
            dataProvider,
            permissionError,
            playbackObj,
            soundObj,
            currentAudio,
            isPlaying,
            currentAudioIndex,
            playbackPosition,
            playbackDuration,
            isPlayListRunning,
            activePlayList,
        } = this.state
        if(permissionError) {
            return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
        <Text style={{fontSize: 25, textAlign: 'center', color: '#000'}}>Saviee Music Player Cannot Access Your Audio!</Text>
        </View>
        }

        return <AudioContext.Provider
        value={{
            audioFiles,
            playList,
            addToPlaylist,
            dataProvider,
            playbackObj,
            soundObj,
            currentAudio,
            isPlaying,
            currentAudioIndex,
            totalAudioCount: this.totalAudioCount,
            playbackDuration,
            playbackPosition,
            isPlayListRunning,
            activePlayList,
            updateState: this.updateState,
            loadPreviousAudio: this.loadPreviousAudio,
            onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
        }}>
            {this.props.children}
        </AudioContext.Provider>
    }
}