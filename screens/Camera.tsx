import { Text, View, StyleSheet,Button, TouchableOpacity, Image,Dimensions } from "react-native";
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from "react";
import * as MediaLibrary from 'expo-media-library';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Camera = () => {

  const [cameraFace, setCameraFace] = useState<CameraType>('back');
  const [img, setImg] = useState<string>();
  const [cameraRef, setCameraRef] = useState<CameraView>();
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [previewImg, setPreviewImg] = useState(false);

  if (!permission) {
    return <View></View>
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
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

  const savePicture = async () => {
    await requestMediaPermission();
    const image = await MediaLibrary.createAssetAsync(img!);
    if (mediaPermission?.status == 'granted') {
      var album = await MediaLibrary.getAlbumAsync('Jovision');
      if (!album) {
        album = await MediaLibrary.createAlbumAsync('Jovision', image, false);
      }
      else {
        const added = await MediaLibrary.addAssetsToAlbumAsync(image, album, false);
      }
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={cameraFace} ref={ref => setCameraRef(ref!)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={()=>{cameraFace == 'back'? setCameraFace('front') : setCameraFace('back')}}>
            <Text style={styles.text}>Switch Face</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {previewImg ? (<View style={styles.imgPreview}>
        <Image source={{ 'uri': img }} style={styles.image}></Image>
        <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {
          savePicture();
          setPreviewImg(false);
        }}>
          <Text style={styles.text}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}  onPress={()=>{setPreviewImg(false)}}>
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
    bottom:40,
    flexDirection:'row',
    gap: 10
  },
  button: {
    backgroundColor: 'rgba(100, 100, 255, 0.5)',
    paddingHorizontal:15,
    paddingVertical:5,
    borderRadius:10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  imgPreview:{
    zIndex: 2,
    position: 'absolute',
    width: windowWidth,
    height: windowHeight,
    flex: 1,
    flexDirection: 'column',
  },
  btnContainer:{
    position: 'absolute',
    bottom:'10%',
    flexDirection:'row',
    alignSelf:'center',
    gap:40
  },
  image:{
    width: windowWidth,
    height:(windowHeight),
    resizeMode: 'cover',
  }
});

export default Camera;