import React, { useState } from 'react';
import { StyleSheet, FlatList, RefreshControl, Image, Text, Dimensions, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Gallery = () => {
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
    const [imgs, setImgs] = useState<MediaLibrary.Asset[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [emptyText, setEmptyText] = useState('Refresh to load images.');

    const getImages = async () => {
        if (mediaPermission?.status != 'granted')
            await requestMediaPermission();

        if (mediaPermission?.status == 'granted') {
            const album = await MediaLibrary.getAlbumAsync('Jovision');
            if (album) {
                const albumAssets = await MediaLibrary.getAssetsAsync({ album });
                setImgs(albumAssets.assets);
            }
            console.log(imgs);
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        getImages();
        setEmptyText('There are no images taken by this app yet.');
        setTimeout(() => {
          setRefreshing(false);
        }, 1500); // Refresh indicator will be visible for at least 1 second
      };

    return (
        <View style={styles.container}>
            <FlatList
            numColumns={2}
            data={imgs}
            renderItem={({item}) => <Image source={{uri: item.uri}} style={styles.img} ></Image>}
            keyExtractor={item => item.uri}
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
