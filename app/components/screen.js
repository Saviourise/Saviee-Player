import React from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import color from '../misc/color'

const Screen = ({children}) => {
    return ( <>
        <StatusBar
        animated={true}
        backgroundColor="#00f"
        barStyle='slide'
        showHideTransition='fade'
        hidden={false}
      />
        <View style={styles.container}>
            {children}
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.APP_BG,
        
    },
})

export default Screen
