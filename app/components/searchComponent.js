import React, { useState, useContext } from 'react'
import { StyleSheet, Text, Modal, View, Dimensions, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import {Entypo, AntDesign, Feather, MaterialCommunityIcons, Ionicons} from '@expo/vector-icons'
import color from '../misc/color';
import CardView from 'react-native-cardview'
import {AudioContext} from '../context/audioget';
import { Searchbar, Button, Menu, Divider, Provider, Card, } from 'react-native-paper';

export default function SearchComponent() {

    const context = useContext(AudioContext);

    const [searchItem, setSearchItem] = useState('')

    const handleOnSearch = () => {
        console.log(searchItem)
    }

    const [menuVisible, setMenuVisible] = useState(true);

    const openMenu = () => setMenuVisible(true);

    const closeMenu = () => setMenuVisible(false);

    return (
        <>
            <View style={styles.container}>
                <View style={{flexDirection: 'row', width, padding: 10, justifyContent: 'center',}}>
                    <Searchbar
                        placeholder='Search for music'
                        style={styles.input}
                        value={searchItem}
                        onChangeText={(text) => {setSearchItem(text)}} 
                    />
                </View>
            </View>
        </>
    )
}

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingHorizontal: 40,
        alignItems: 'center',
        backgroundColor: color.APP_BG,
    },
    input: {
        width: width - 40,
        color: color.ACTIVE_BG,
        fontSize: 18,
    },
})
