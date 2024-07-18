import { Text, View, StyleSheet, Button, TouchableOpacity, Image, Dimensions } from "react-native";
import { CameraMode, CameraType, CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import React, { useState } from "react";
import * as MediaLibrary from 'expo-media-library';

var RNFS = require('react-native-fs');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const Camera = () => {
  const [cameraFace, setCameraFace] = useState<CameraType>('back');
  const [img, setImg] = useState<string>();
  const [cameraRef, setCameraRef] = useState<CameraView>();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermission, requestAudioPermission] = useMicrophonePermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [previewImg, setPreviewImg] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>('picture');
  const [video, setVideo] = useState<string>();
  const [recording, setRecording] = useState(false);
  
  if (!cameraPermission || !audioPermission) {
    return <View></View>
  }
  if (!cameraPermission.granted || !audioPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={()=>{requestCameraPermission();requestAudioPermission();}} title="Grant Permission" />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef) {
      const image = await cameraRef.takePictureAsync();
      setImg(image?.uri);
      setPreviewImg(true);
    }
  }

  const saveAsset = async (uri: string) => {
    // await requestMediaPermission();
    await RNFS.moveFile(uri,RNFS.DocumentDirectoryPath+'/Jov');
    console.log(uri,RNFS.DocumentDirectoryPath);
    // if (mediaPermission?.status == 'granted') {
    //   var album = await MediaLibrary.getAlbumAsync('Jovision');
    //   if (!album) {
    //     album = await MediaLibrary.createAlbumAsync('Jovision', image, false);
    //   }
    //   else {
    //     const added = await MediaLibrary.addAssetsToAlbumAsync(image, album, false);
    //   }
    // }
  }

  const recordVideo = async () => {
    setRecording(true);
    await cameraRef?.recordAsync().then(vid => {setVideo(vid?.uri);saveAsset(vid!.uri);console.log(vid)});
  }

  const stopRecording = async () => {
    setRecording(false);  
    cameraRef?.stopRecording();
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={cameraFace} ref={ref => setCameraRef(ref!)} mode={cameraMode}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => { cameraMode == 'picture' ? takePhoto() : recording? stopRecording() : recordVideo() }}>
            <Text style={styles.text}>{cameraMode == 'picture' ? 'Take Photo' : `${recording? 'Stop Recording' : 'Record Video'}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { cameraFace == 'back' ? setCameraFace('front') : setCameraFace('back') }}>
            <Text style={styles.text}>Switch to {cameraFace == 'back' ? 'front' : 'back'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { cameraMode == 'picture' ? setCameraMode('video') : setCameraMode('picture') }}>
            <Text style={styles.text}>Switch to {cameraMode == 'picture' ? 'video' : 'picture'}</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {previewImg ? (<View style={styles.imgPreview}>
        <Image source={{ 'uri': img }} style={styles.image}></Image>
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {
            saveAsset(img!);
            setPreviewImg(false);
          }}>
            <Text style={styles.text}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { setPreviewImg(false) }}>
            <Text style={styles.text}>Discard</Text>
          </TouchableOpacity>
        </View>
      </View>) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 40,
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap'
  },
  button: {
    backgroundColor: 'rgba(100, 100, 255, 0.5)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  imgPreview: {
    zIndex: 2,
    position: 'absolute',
    width: windowWidth,
    height: windowHeight,
    flex: 1,
    flexDirection: 'column',
  },
  btnContainer: {
    position: 'absolute',
    bottom: '10%',
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 40
  },
  image: {
    width: windowWidth,
    height: (windowHeight),
    resizeMode: 'cover',
  }
});

export default Camera;