import React, { Component, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, Dimensions, View, SafeAreaView, } from 'react-native';
import {AudioContext} from '../context/audioget';
import {RecyclerListView, LayoutProvider} from 'recyclerlistview';
import Screen from '../components/screen';
import AudioListItem from '../components/audiolistitem';
import SearchComponent from '../components/searchComponent';
import UnderSearch from '../components/underSearch';
import Fab from '../components/fab';
import OptionModal from '../components/optionmodal';
import PlaylistModal from '../components/playlistmodal';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

width = Dimensions.get('window').width

class Audiolist extends Component {
        
    static contextType = AudioContext;

    constructor(props){
        super(props);
        this.state = {
            optionModalVisible: false,
            playlistModalVisible: false,
            playerModalMount: false,
            backgroundColor: color.APP_BG,
            font: color.FONT,
            search: color.SEARCH,
            fontMedium: color.FONT_MEDIUM,
            fontLight: color.FONT_LIGHT,
            modalBg: color.MODAL_BG,
            activeBg: color.ACTIVE_BG,
            activeFont: color.ACTIVE_FONT,
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

    componentDidMount = async () => {
        this.context.loadPreviousAudio();
        let themed = await AsyncStorage.getItem('theme');
        if(themed === "light") {
            this.setState({...this.state, backgroundColor: color.APP_BG,})
            this.setState({...this.state, font: color.FONT,})
            this.setState({...this.state, search: color.SEARCH,})
            this.setState({...this.state, activeFont: color.ACTIVE_FONT,})
            this.setState({...this.state, fontMedium: color.FONT_MEDIUM,})
            this.setState({...this.state, fontLight: color.FONT_LIGHT,})
        } else {
            this.setState({...this.state, backgroundColor: color.DARK_APP_BG,})
            this.setState({...this.state, font: color.DARK_FONT,})
            this.setState({...this.state, search: color.DARK_SEARCH,})
            this.setState({...this.state, activeFont: color.DARK_ACTIVE_FONT,})
            this.setState({...this.state, fontMedium: color.DARK_FONT_MEDIUM,})
            this.setState({...this.state, fontLight: color.DARK_FONT_LIGHT,})
        }
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
               <View style={{flexDirection: 'row', width, padding: 10, backgroundColor: this.state.backgroundColor, justifyContent: 'center',}}>
                    <Searchbar
                        placeholder='Search for music'
                        style={{width: width - 40, fontSize: 18, backgroundColor: this.state.search,}}
                        inputStyle={{color: this.state.font}}
                        iconColor={this.state.fontLight}
                        placeholderTextColor={this.state.fontLight}
                        onChangeText={(text) => {this.props.navigation.navigate('SearchScreen', text)}}
                        value={""}
                    />
                </View>
               <Fab />
                
               
            <Screen>
            <UnderSearch />
            { dataProvider && dataProvider.getSize() > 0 && <RecyclerListView
            dataProvider={dataProvider}
            layoutProvider={this.layoutProvider}
            rowRenderer={this.rowRenderer}
            extendedState={{isPlaying}}
            /> }
            </Screen>
            

            <OptionModal
            // onPlayPress={() => console.log("Playing Audio")}
            // onPlaylistPress={() => {
            //     this.setState({ ...this.state, playlistModalVisible: true, optionModalVisible: false });
            // }}
            options={[{title: 'Add to playlist', onPress: this.navigateToPlaylist, icon: "playlist-plus"}]}
            currentItem={this.currentItem}
            onClose={() =>
                this.setState({ ...this.state, optionModalVisible: false})}
            visible={this.state.optionModalVisible}
            navigation={this.props.navigation} />

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
            
            <OpenPlayerModal onPress={() => {
                this.props.navigation.navigate('PlayerModal')
            }} />
            
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
        },
    });

export default Audiolist;
