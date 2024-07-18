import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, Image, Dimensions, View, TouchableOpacity } from 'react-native';
import { ReadDirItem } from 'react-native-fs';
var RNFS = require('react-native-fs');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const SlideShow = () => {
    const [imgs, setImgs] = useState<ReadDirItem[]>([]);
    const [slideScroll, setSlideScroll] = useState(true);
    const listRef = useRef<FlatList<ReadDirItem>>(null);
    const [scrollIndex, setScrollIndex] = useState<number>(0);

    const getImages = async () => {
        const assets = await RNFS.readDir(RNFS.DocumentDirectoryPath+'/Jovision/');
        setImgs(assets);
    }


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
                renderItem={({ item }) => <Image source={{ uri: 'file:///'+item.path }} style={styles.img} ></Image>}
                keyExtractor={item => item.path}
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
