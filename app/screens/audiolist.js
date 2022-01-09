import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet, Dimensions, View } from 'react-native';
import {AudioContext} from '../context/audioget';
import {RecyclerListView, LayoutProvider} from 'recyclerlistview';
import Screen from '../components/screen';
import AudioListItem from '../components/audiolistitem';
import SearchComponent from '../components/searchComponent';
import UnderSearch from '../components/underSearch';
import Fab from '../components/fab';
import OptionModal from '../components/optionmodal';
import PlaylistModal from '../components/playlistmodal';
import PlayerModal from '../components/playermodal';
import OpenPlayerModal from '../components/openplayermodal';
import { Audio } from 'expo-av';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { play, pause, resume, playNext, selectAudio, didMount } from '../misc/audiocontroller';
import { storeAudioForNextOpening } from '../misc/helper';
import color from '../misc/color';

class Audiolist extends Component {
        
    static contextType = AudioContext;

    constructor(props){
        super(props);
        this.state = {
            optionModalVisible: false,
            playlistModalVisible: false,
            playerModalMount: false,
        }

        this.currentItem = {}
    }

    mountPlayer = (mountState) => {
        this.setState({...this.state, playerModalMount: mountState});
    }

    layoutProvider = new LayoutProvider((i) => 'audio', (type, dim) => {
        switch(type) {
            case 'audio':
                dim.width = Dimensions.get('window').width;
                dim.height = 70;
            break;
            default: 
                dim.width = 0;
                dim.height = 0;
        }
    })

    // onPlaybackStatusUpdate = async (playbackStatus) => {
    //     if(playbackStatus.isLoaded && playbackStatus.isPlaying) {
    //         this.context.updateState(this.context, {
    //             playbackPosition: playbackStatus.positionMillis,
    //             playbackDuration: playbackStatus.durationMillis,
    //         });
    //     }

    //     if(playbackStatus.didJustFinish) {
    //         const nextAudioIndex = this.context.currentAudioIndex + 1;
    //         if(nextAudioIndex >= this.context.totalAudioCount) {
    //             this.context.playbackObj.unloadAsync();
    //             this.context.updateState(this.context, {
    //                 soundObj: null,
    //                 currentAudio: this.context.audioFiles[0],
    //                 isPlaying: false,
    //                 currentAudioIndex: 0,
    //                 playbackPosition: null,
    //                 playbackDuration: null,
    //             });
    //             return await storeAudioForNextOpening(this.context.audioFiles[0], 0);
    //         }

    //         const audio = this.context.audioFiles[nextAudioIndex];
    //         const status = await playNext(this.context.playbackObj, audio.uri)
    //         this.context.updateState(this.context, {
    //             soundObj: status,
    //             currentAudio: audio,
    //             isPlaying: true,
    //             currentAudioIndex: nextAudioIndex,
    //         });
    //         await storeAudioForNextOpening(audio, nextAudioIndex);
    //     }
    // }

    handleAudioPress = async (audio, playListInfo = {}) => {

        await selectAudio(audio, this.context)

        // const {playbackObj, soundObj, currentAudio, updateState, audioFiles} = this.context;

        // await Audio.setAudioModeAsync({
        //     staysActiveInBackground: true,
        //     interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        //     shouldDuckAndroid: true,
        //     playThroughEarpieceAndroid: true,
        //     allowsRecordingIOS: true,
        //     interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        //     playsInSilentModeIOS: true,
        // });
        

        // //Play Audio
        // if(soundObj === null) {
        //     const status = await play(playbackObj, audio.uri, audio.lastPosition);
        //     const index = audioFiles.findIndex(({id}) => id === audio.id);
        //     this.setState({ ...this.state, playerModalMount: true });
        //     updateState(
        //         this.context, {
        //         soundObj: status,
        //         currentAudio: audio,
        //         isPlaying: true,
        //         currentAudioIndex: index,
        //         isPlayListRunning: false,
        //         activePlayList: [],
        //         ...playListInfo,
        //     });
        //     playbackObj.setOnPlaybackStatusUpdate(this.context.onPlaybackStatusUpdate)
        //     return storeAudioForNextOpening(audio, index);
        // }
        
        // //Pause Audio
        // if(soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
        //     const status = await pause(playbackObj);
        //     this.setState({ ...this.state, playerModalMount: false });
        //      return updateState(
        //         this.context, {
        //         soundObj: status,
        //         isPlaying: false,
        //         playbackPosition: status.positionMillis
        //     });
        // }

        // //Resume Audio
        // if(soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id){
        //     const status = await resume(playbackObj);
        //     this.setState({ ...this.state, playerModalMount: false });
        //      return updateState(
        //         this.context, {
        //         soundObj: status,
        //         isPlaying: true,
        //         playbackPosition: status.positionMillis
        //     });
        // }

        // //Select Another Audio
        // if (soundObj.isLoaded && currentAudio.id !== audio.id) {
        //     const status = await playNext(playbackObj, audio.uri)
        //     const index = audioFiles.findIndex(({id}) => id === audio.id)
        //     this.setState({ ...this.state, playerModalMount: true });
        //     updateState(
        //         this.context, {
        //         soundObj: status,
        //         currentAudio: audio,
        //         isPlaying: true,
        //         currentAudioIndex: index,
        //         isPlayListRunning: false,
        //         activePlayList: [],
        //         ...playListInfo,
        //     });
        //     return storeAudioForNextOpening(audio, index);
        // }
        
    }

    componentDidMount() {
        this.context.loadPreviousAudio();
    }

    rowRenderer = (type, item, index, extendedState) => {
        return (
            <>
        <AudioListItem
        title={item.filename}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        duration={item.duration}
        onAudioPress={() => {
            this.handleAudioPress(item)
            
        }}
        onOptionPress={() => {
            this.currentItem = item
            this.setState({ ...this.state, optionModalVisible: true });
        }}
        />
        </>
        )
    };


    navigateToPlaylist = () => {
        this.setState({ ...this.state, playlistModalVisible: true, optionModalVisible: false });
    }
    
  render() {
    return <AudioContext.Consumer>
        {({dataProvider, isPlaying}) => {
            
            return ( 
               <> 
               <SearchComponent />
               <Fab />
               <UnderSearch />
            <Screen>
            { dataProvider && dataProvider.getSize() > 0 && <RecyclerListView
            dataProvider={dataProvider}
            layoutProvider={this.layoutProvider}
            rowRenderer={this.rowRenderer}
            extendedState={{isPlaying}}
            /> }

            <OptionModal
            // onPlayPress={() => console.log("Playing Audio")}
            // onPlaylistPress={() => {
            //     this.setState({ ...this.state, playlistModalVisible: true, optionModalVisible: false });
            // }}
            options={[{title: 'Add to playlist', onPress: this.navigateToPlaylist, icon: "playlist-plus"}]}
            currentItem={this.currentItem}
            onClose={() =>
                this.setState({ ...this.state, optionModalVisible: false})}
            visible={this.state.optionModalVisible} />

            <PlaylistModal
            onPlaylistPress={() => {
                this.context.updateState(this.context, {
                    addToPlaylist: this.currentItem,
                })
                this.props.navigation.navigate('Playlist')
            }}
            currentItem={this.currentItem}
            onClose={() =>
            this.setState({ ...this.state, playlistModalVisible: false})}
            visible={this.state.playlistModalVisible} />

            {this.state.playerModalMount &&  <PlayerModal playerModalMount={this.mountPlayer} />}
            
            <OpenPlayerModal openPlayer={() => {
            this.setState({ ...this.state, playerModalMount: true });
            }}
            />
            </Screen>
            </>
            )
        }}
    </AudioContext.Consumer>
  }
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },

        text: {
            padding: 10,
            borderBottomColor: '#ddd',
            borderBottomWidth: 2,
        },
    });

export default Audiolist;
