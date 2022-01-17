import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAudioForNextOpening = async (audio, index, lastPosition) => {
    await AsyncStorage.setItem('previousAudio', JSON.stringify({audio: {...audio, lastPosition}, index}))
}

export const theme = async (theme) => {
    await AsyncStorage.setItem('theme', theme)
}