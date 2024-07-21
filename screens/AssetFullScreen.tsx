import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import React, { useRef, useState } from 'react';
import { StyleSheet, View, Image, Dimensions, Pressable, Text } from 'react-native';
import { TabBarIcon } from '../components/navigation/TabBarIcon';
import { ReadDirItem, stat } from 'react-native-fs';
import { Playback } from 'expo-av/build/AV';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AssetFullScreen = ({ route, navigation }) => {
    const [assetPath, setAssetPath] = useState(route.params.assetPath);
    const assets: ReadDirItem[] = route.params.assets;
    const [assetIndex, setAssetIndex] = useState(route.params.assetIndex);
    const [playing, setPlaying] = useState(false);
    const videoRef = useRef<Video>(null);

    const navigateBack = () => {
        navigation.navigate('Gallery');
    }

    const previousAsset = () => {
        setAssetPath('file:///' + assets[(assetIndex - 1) == -1 ? (assets.length - 1) : (assetIndex - 1)].path);
        setAssetIndex((assetIndex - 1) == -1 ? (assets.length - 1) : (assetIndex - 1));
    }

    const nextAsset = () => {
        setAssetPath('file:///' + assets[(assetIndex + 1) % assets.length].path);
        setAssetIndex((assetIndex + 1) % assets.length);
    }

    const videoPlay = async () => {
        playing ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync();
    }

    const fastForward = async () => {
        videoRef.current?.getStatusAsync().then((status) => {
            const newPosition = Math.min(
              status.positionMillis + 10000,
              status.durationMillis
            );
            videoRef.current?.setPositionAsync(newPosition);
        });
    }

    const fastBackward = async () => {
        videoRef.current?.getStatusAsync().then((status) => {
            const newPosition = Math.max(
              status.positionMillis - 10000,
              0
            );
            videoRef.current?.setPositionAsync(newPosition);
        });
}



    return (
        <View style={styles.container}>
            {assetPath.endsWith('g') ?
                (<><Image source={{ uri: assetPath }} style={styles.img}></Image>
                    <View style={styles.imgBtnContainer}>
                        <TabBarIcon onPress={previousAsset} style={styles.btn} name='arrow-back' color={'white'} size={40}></TabBarIcon>
                        <TabBarIcon onPress={nextAsset} style={styles.btn} name='arrow-forward' color={'white'} size={40}></TabBarIcon>
                    </View></>
                ) :
                (<><View style={styles.img}>
                    <Video isLooping
                        ref={videoRef}
                        source={{ uri: assetPath }}
                        style={styles.img}
                        resizeMode={ResizeMode.COVER}
                        onPlaybackStatusUpdate={(status) => { setPlaying(() => status.isPlaying) }}></Video>
                </View>
                    <View style={styles.imgBtnContainer}>
                        <TabBarIcon onPress={previousAsset} style={styles.btn} name='arrow-back' color={'white'} size={40}></TabBarIcon>
                        <TabBarIcon onPress={nextAsset} style={styles.btn} name='arrow-forward' color={'white'} size={40}></TabBarIcon>
                    </View>
                    <View style={styles.videoBtnContainer}>
                        <TabBarIcon onPress={fastBackward} style={styles.btn} name='arrow-undo' color={'white'} size={40}></TabBarIcon>
                        <TabBarIcon onPress={videoPlay} style={styles.btn} name={playing ? 'pause' : 'play'} color={'white'} size={40}></TabBarIcon>
                        <TabBarIcon onPress={fastForward} style={styles.btn} name='arrow-redo' color={'white'} size={40}></TabBarIcon>
                    </View></>)}


            <Pressable style={styles.back} onPress={navigateBack}>
                <TabBarIcon name='arrow-back' color={'white'} size={40}></TabBarIcon>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    img: {
        width: windowWidth,
        height: windowHeight
    },
    back: {
        position: 'absolute',
        margin: 20,
        padding: 5,
        backgroundColor: 'rgba(0,0,150,0.6)',
        borderRadius: 30,
    },
    imgBtnContainer: {
        position: 'absolute',
        flex: 1,
        flexDirection: 'row',
        bottom: 100,
        left: '25%',
        justifyContent: 'center',
        gap: 100
    },
    btn: {
        padding: 5,
        backgroundColor: 'rgba(0,0,150,0.6)',
        borderRadius: 30,
    },
    videoBtnContainer: {
        position: 'absolute',
        flex: 1,
        flexDirection: 'row',
        bottom: '50%',
        left: '25%',
        justifyContent: 'center',
        gap: 30
    },
})

export default AssetFullScreen;
