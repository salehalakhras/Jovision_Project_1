import React, { useState } from 'react';
import { StyleSheet, FlatList, RefreshControl, Image, Text, Dimensions, View } from 'react-native';
import { ReadDirItem } from 'react-native-fs';
import { Video } from 'expo-av';
var RNFS = require('react-native-fs');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Gallery = () => {
    const [imgs, setImgs] = useState<ReadDirItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [emptyText, setEmptyText] = useState('Refresh to load images.');

    const getImages = async () => {
        const assets = await RNFS.readDir(RNFS.DocumentDirectoryPath+'/Jovision/');
        setImgs(assets);
    }

    const onRefresh = () => {
        setRefreshing(true);
        getImages();
        setEmptyText('There are no images taken by this app yet.');
        setTimeout(() => {
          setRefreshing(false);
        }, 1500);
      };

    return (
        <View style={styles.container}>
            <FlatList
            numColumns={2}
            data={imgs}
            renderItem={({item}) => item.name.endsWith('g')? (<Image source={{uri: 'file:///'+item.path}} style={styles.img} ></Image>) : (<Video style={styles.img} source={{uri: 'file:///'+item.path}}></Video>)}
            keyExtractor={item => item.path}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={<Text style={styles.text}>{emptyText}</Text>}>
            </FlatList>
        </View>

    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        alignSelf: 'center',
        color:'black'
    },
    scrollView: {
        flex: 1,
        padding: 5,
        gap:5,
    },
    container: {
        flex: 1,
        paddingHorizontal:5,
      },
    img:{
        width: windowWidth/2.2,
        height: windowHeight/3,
        borderRadius: 5,
        margin: 5,
    }
})

export default Gallery;
