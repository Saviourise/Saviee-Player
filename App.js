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
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://7041e73ebf7f4ab49cf81fc4bd9a8bec@o1118144.ingest.sentry.io/6151917',
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

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
