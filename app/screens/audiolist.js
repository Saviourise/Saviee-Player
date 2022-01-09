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
import { Searchbar, Button, Menu, Divider, Provider, Card, } from 'react-native-paper';

width = Dimensions.get('window').width

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

    handleAudioPress = async (audio, playListInfo = {}) => {

        await selectAudio(audio, this.context)

        
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
               <View style={{flexDirection: 'row', width, padding: 10, justifyContent: 'center',}}>
                    <Searchbar
                        placeholder='Search for music'
                        style={styles.input}
                        onChangeText={(text) => {this.props.navigation.navigate('SearchScreen', text)}}
                        value={""}
                    />
                </View>
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
        input: {
            width: width - 40,
            color: color.ACTIVE_BG,
            fontSize: 18,
    },
    });

export default Audiolist;
