import "react-native-gesture-handler";
import React, { Component, useState } from "react";
import Appnavigator from "./app/navigation/appnavigator";
import Audioget from "./app/context/audioget";
import AudioListItem from "./app/components/audiolistitem";
import { View, Text, StyleSheet } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

function App() {
  return (
    <Audioget>
      <NavigationContainer>
        <Appnavigator />
      </NavigationContainer>
    </Audioget>
  );
}

export default App;
