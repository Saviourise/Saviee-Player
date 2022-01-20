import { storeAudioForNextOpening } from './helper';
import Constants from 'expo-constants';

//Play Audio
export const play = async (playbackObj, uri, lastPosition, filename) => {

    const sendNotification = async () => {
        
    }

    try {
        
        if (uri.includes('%20')) {
            uri = encodeURI(uri)
        }
        if(!lastPosition) {
            
            return await playbackObj.loadAsync(
                { uri },
                { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
            );
        }

        //if there is last position
        await playbackObj.loadAsync(
            { uri },
            { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
        );
        sendNotification()
        return await playbackObj.playFromPositionAsync(lastPosition)

        //return status;
    } catch (error) {
        console.log(error.message)
    }
}

//Pause Audio
export const pause = async (playbackObj) => {
    try {
        const status = await playbackObj.setStatusAsync(
            {shouldPlay: false}
        );
        return status;
    } catch (error) {
        console.log(error.message)
    }
}


//Resume Audio
export const resume = async (playbackObj) => {
    try {
        const status = await playbackObj.playAsync();
        return status;
    } catch (error) {
        console.log(error.message)
    }
}
// export const resume = async (playbackObj, millis) => {
//     try {
//         playbackObj.setPositionAsync(millis)
//         const status = await playbackObj.playAsync();
//         return status;
//     } catch (error) {
//         console.log(error.message)
//     }
// }




//Select Another Audio
export const playNext = async ( playbackObj, uri, filename) => {
    try {
        if (uri.includes('%20')) {
            uri = encodeURI(uri)
        }
        await playbackObj.stopAsync();
        await playbackObj.unloadAsync();
        return await play(playbackObj, uri, filename)
    } catch (error) {
        console.log(error.message)
    }
}



export const selectAudio = async (audio, context, playListInfo = {}) => {
    const {
        playbackObj,
        soundObj,
        currentAudio,
        updateState,
        audioFiles,
        onPlaybackStatusUpdate,
        shuffle,
    } = context;
    try {
        //Play Audio
        // console.log(audio.uri)
        // console.log(encodeURI(audio.uri))
        if(soundObj === null) {
            const status = await play(playbackObj, audio.uri, audio.lastPosition, audio.filename);
            const index = audioFiles.findIndex(({id}) => id === audio.id)
            updateState(
                context, {
                    soundObj: status,
                    currentAudio: audio,
                    isPlaying: true,
                    currentAudioIndex: index,
                    isPlayListRunning: false,
                    activePlayList: [],
                    ...playListInfo,
            });
            playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
            return storeAudioForNextOpening(audio, index);
        }
        
        //Pause Audio
        if(soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
            const status = await pause(playbackObj);
            return updateState(
                context, {
                    soundObj: status,
                    isPlaying: false,
                    playbackPosition: status.positionMillis
                });
        }

        //Resume Audio
        if(soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id){
            const status = await resume(playbackObj);
                return updateState(
                    context, {
                        soundObj: status,
                        isPlaying: true,
                        playbackPosition: status.positionMillis
            });
        }

        //Select Another Audio
        if (soundObj.isLoaded && currentAudio.id !== audio.id) {
            const status = await playNext(playbackObj, audio.uri, audio.filename)
            const index = audioFiles.findIndex(({id}) => id === audio.id)
            updateState(
                context, {
                    soundObj: status,
                    currentAudio: audio,
                    isPlaying: true,
                    currentAudioIndex: index,
                    isPlayListRunning: false,
                    activePlayList: [],
                    ...playListInfo,
            });
            return storeAudioForNextOpening(audio, index);
        }
    } catch(err) {
        console.log(err.message)
    }
    
        
}



const selectAudioFromPlayList = async (context, select) => {

    const {
        activePlayList,
        currentAudio,
        audioFiles,
        playbackObj,
        updateState
    } = context;

    let audio;
    let defaultIndex;
    let nextIndex;

    const indexOnPlayList = activePlayList.audios.findIndex(({id}) => id === currentAudio.id);

    if(select === 'next') {
        nextIndex = indexOnPlayList + 1;
        defaultIndex = 0;
    }

    if(select === 'previous') {
        nextIndex = indexOnPlayList - 1;
        defaultIndex = activePlayList.audios.length - 1;
    }

    audio = activePlayList.audios[nextIndex];

    if(!audio) audio = activePlayList.audios[defaultIndex];

    const indexOnAllList = audioFiles.findIndex(({id}) => id === audio.id)

    const status = await playNext(playbackObj, audio.uri)
    return updateState(context, {
        soundObj: status,
        isPlaying: true,
        currentAudio: audio,
        currentAudioIndex: indexOnAllList
    });
}


export const changeAudio = async (context, select) => {
    const {
        playbackObj,
        currentAudioIndex,
        totalAudioCount,
        audioFiles,
        updateState,
        onPlaybackStatusUpdate,
        isPlayListRunning,
        shuffle,
        addedToQueue,
    } = context;

    if(isPlayListRunning) return selectAudioFromPlayList(context, select)

    try {
        const {isLoaded} = await playbackObj.getStatusAsync();
        const isLastAudio = currentAudioIndex + 1 === totalAudioCount;
        const isFirstAudio = currentAudioIndex <= 0;
        let audio;
        let index;
        let status;
        let filteredItems;

        // for next
            
        if(select === 'next') {
            if(Object.keys(addedToQueue).length != 0) {
                audio = addedToQueue[0];
                filteredItems = addedToQueue.filter(item => item !== addedToQueue[0])
                index = audioFiles.findIndex(({id}) => id === audio.id)
                
            } else {
                if(shuffle) {
                    const randomIndex = Math.floor(Math.random() * audioFiles.length) + 1 ;
                    audio = audioFiles[randomIndex];
                    index = randomIndex;
                } else {
                    audio = audioFiles[currentAudioIndex + 1];
                    index = currentAudioIndex + 1
                }
            }
            
            if(isLoaded && !isLastAudio) {
                status = await playNext(playbackObj, audio.uri)
                playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
            }

            if(isLastAudio) {
                index = 0;
                audio = audioFiles[index]
                if(isLoaded) {
                    status = await playNext(playbackObj, audio.uri)
                }else {
                    status = await play(playbackObj, audio.uri)
                }    
            }

            if(!isLoaded && !isLastAudio) {
                index = currentAudioIndex + 1
                status = await play(playbackObj, audio.uri)
                
            }

        }

        // for previous
        if (select === 'previous') {

            audio = audioFiles[currentAudioIndex - 1];
            if(isLoaded && !isFirstAudio) {
                index = currentAudioIndex - 1
                status = await playNext(playbackObj, audio.uri)
                playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
            }

            if(isFirstAudio) {
                index = totalAudioCount - 1;
                audio = audioFiles[index]
                if(isLoaded) {
                    status = await playNext(playbackObj, audio.uri)
                }else {
                    status = await play(playbackObj, audio.uri)
                }    
            }

            if(!isLoaded && !isFirstAudio) {
                index = currentAudioIndex + 1
                status = await play(playbackObj, audio.uri)
                
            }
        }

        updateState(context, {
            soundObj: status,
            currentAudio: audio,
            isPlaying: true,
            currentAudioIndex: index,
            playbackPosition: null,
            playbackDuration: null,
            addedToQueue: filteredItems,
        });

        storeAudioForNextOpening(audio, index);
    } catch (err) {console.log(err.message)}
    
}


export const moveAudio = async (context, value) => {
    const {
        soundObj,
        isPlaying,
        playbackObj,
        updateState
    } = context
    if(soundObj === null || !isPlaying) return;
    
    try {
        const status = await playbackObj.setPositionAsync(soundObj.durationMillis * value)
        updateState(context, {
            soundObj: status,
            playbackPosition: status.positionMillis
        })

        await resume(playbackObj)
    } catch (error) { console.log(error.message); }

}