import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image, Text, Dimensions, View, Pressable } from 'react-native';
import { ReadDirItem } from 'react-native-fs';
import { Video } from 'expo-av';
import prompt from 'react-native-prompt-android';
var RNFS = require('react-native-fs');


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Gallery = ({ navigation }) => {
    const [imgs, setImgs] = useState<ReadDirItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [emptyText, setEmptyText] = useState('Refresh to load images.');
    const [selectAsset, setSelectAsset] = useState('');

    const getImages = async () => {
        const assets = await RNFS.readDir(RNFS.DocumentDirectoryPath + '/Jovision/');
        setImgs(assets);
    }

    const rename = (assetPath: string) => {
        setSelectAsset('');
        prompt('Rename file', `Rename\n ${assetPath} to: `, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Rename', onPress: (name) => {
                    RNFS.moveFile(assetPath, (RNFS.DocumentDirectoryPath + '/Jovision/' + name) + (assetPath.endsWith('g') ? '.jpg' : '.mp4')).catch(err => { console.log(err) })
                }
            }
        ], {
            type: 'default',
            cancelable: true,
            placeholder: 'Enter the new name: '
        })
        getImages();

    }

    const deleteFile = (fileName: string): boolean => {
        const deleted = RNFS.unlink(fileName).then(() => { return true }).catch(() => { return false });
        setSelectAsset('');
        getImages();
        return deleted;
    }

    const toFullScreen = (assetPath: string, index) => {
        setSelectAsset('');
        navigation.navigate('Full Screen', {
            assetPath: assetPath,
            assets:imgs,
            assetIndex: index,
        })
    }
    const onRefresh = () => {
        setRefreshing(true);
        getImages();
        setEmptyText('There are no images taken by this app yet.');
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    useEffect(() => {
        getImages();
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                numColumns={2}
                data={imgs}
                renderItem=
                {({ item,index }) => item.name.endsWith('g') ? (
                    <Pressable onPress={() => { setSelectAsset(item.name) }}>
                        {item.name == selectAsset ? (
                            <View style={styles.btnContainer}>
                                <TouchableOpacity style={styles.button} onPress={() => { toFullScreen('file:///' + item.path, index) }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 24, }}>Full Screen</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={() => { rename('file:///' + item.path) }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 24, }}>Rename</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={() => { deleteFile('file:///' + item.path) }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 24, }}>Delete</Text>
                                </TouchableOpacity>
                            </View>)
                            : (<><Image source={{ uri: 'file:///' + item.path }} style={styles.img} ></Image>
                                <Text style={{ alignSelf: 'center',color:'black' }}>{item.name.length > 20 ? '...' + item.name.substring(item.name.length - 20) : item.name}</Text></>
                            )}
                    </Pressable>)
                    : (<Pressable onPress={() => { setSelectAsset(item.name) }}>
                        {item.name == selectAsset ? (
                            <View style={styles.btnContainer}>
                                <TouchableOpacity style={styles.button} onPress={() => { toFullScreen('file:///' + item.path, index) }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 24, }}>Full Screen</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={() => { rename('file:///' + item.path) }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 24, }}>Rename</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={() => { deleteFile('file:///' + item.path) }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 24, }}>Delete</Text>
                                </TouchableOpacity>
                            </View>)
                            : <><Video style={styles.img} source={{ uri: 'file:///' + item.path }}></Video>
                            <Text style={{ alignSelf: 'center',color:'black' }}>{item.name.length > 20 ? '...' + item.name.substring(item.name.length - 20) : item.name}</Text></>}
                    </Pressable>)}
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
        color: 'black'
    },
    scrollView: {
        flex: 1,
        padding: 5,
        gap: 5,
    },
    container: {
        flex: 1,
        paddingHorizontal: 5,
    },
    img: {
        width: windowWidth / 2.2,
        height: windowHeight / 3,
        borderRadius: 5,
        margin: 5,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        backgroundColor: 'rgba(100, 100, 255, 0.4)',

    },
    btnContainer: {
        flex: 1,
        backgroundColor: 'rgba(100, 100, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        width: windowWidth / 2.2,
        height: windowHeight / 3,
        borderRadius: 5,
        margin: 5,
        gap: 10,
        padding: 5
    }

})

export default Gallery;
