import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, Image, Dimensions, View, TouchableOpacity } from 'react-native';
import * as MediaLibrary from 'expo-media-library';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const SlideShow = () => {
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const [imgs, setImgs] = useState<MediaLibrary.Asset[]>([]);
    const [slideScroll, setSlideScroll] = useState(true);
    const listRef = useRef<FlatList<MediaLibrary.Asset>>(null);
    const [scrollIndex, setScrollIndex] = useState<number>(0);

    const getImages = async () => {
        const permi = await requestMediaPermission();
        if (permi.granted) {
            const album = await MediaLibrary.getAlbumAsync('Jovision');
            if (album) {
                const albumAssets = await MediaLibrary.getAssetsAsync({ album });
                setImgs(albumAssets.assets);
            }
        }

    };


    useEffect(() => {
        if (imgs.length == 0) {
            getImages();
        }
        let scrollInterval;
        if (slideScroll && imgs.length != 0) {
            scrollInterval = setInterval(() => {
                listRef.current?.scrollToIndex({ animated: true, index: scrollIndex });
                setScrollIndex((scrollIndex + 1) % imgs.length);
            }, 1000);
        }
        return () => clearInterval(scrollInterval!);
    }, [scrollIndex, slideScroll, imgs])

    return (
        <View>
            <FlatList
                data={imgs}
                renderItem={({ item }) => <Image source={{ uri: item.uri }} style={styles.img} ></Image>}
                keyExtractor={item => item.uri}
                ListEmptyComponent={<Text style={styles.text}>No images to show</Text>}
                horizontal={true}
                scrollEnabled={false}
                ref={listRef}>
            </FlatList>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => { setSlideScroll(!slideScroll) }}>
                    <Text style={styles.text}>{slideScroll ? 'Pause' : 'Resume'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    img: {
        width: windowWidth / 1.1,
        height: windowHeight / 1.2,
        borderRadius: 5,
        margin: 5,
    },
    buttonContainer: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: 'rgba(100, 100, 255, 0.5)',
        bottom: 40,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
    },
    button: {
        flex: 1,
        alignItems: 'center',
    },
})

export default SlideShow;
