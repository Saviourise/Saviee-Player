import React, { Component, useState } from 'react'
import Appnavigator from './app/navigation/appnavigator';
import Audioget from './app/context/audioget';
import AudioListItem from './app/components/audiolistitem';
import { View, Text, StyleSheet } from 'react-native';


function Test() {

    return (
    <Audioget>
    <NavigationContainer>
      <Appnavigator />
    </NavigationContainer>
    </Audioget>
    
    )
}

export default Test
