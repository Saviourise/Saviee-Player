import React, { useState, useContext, Component, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import PlaylistInputModal from "../components/playlistinputmodal";
import OpenPlayerModal from '../components/openplayermodal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AudioContext} from '../context/audioget';
import PlayerModal from '../components/playermodal';
import PlayListDetail from '../components/playlistdetail'
import color from '../misc/color';
import { Searchbar, Button, Menu, Divider, Provider, Card, } from 'react-native-paper';

const SearchResult = () => {
    return (
        <View>
            <Text>HEY THERE</Text>
        </View>
    )
}

export default SearchResult

const styles = StyleSheet.create({})


