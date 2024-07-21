import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Image } from 'react-native';
import * as Location from 'expo-location';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';
import { Subscription } from 'expo-media-library';
import { TabBarIcon } from '../components/navigation/TabBarIcon';

enum Oreintation {
    Portrait = 'https://i.postimg.cc/YCh7vxFM/portrait.png',
    LeftLandscape = 'https://i.postimg.cc/pX0xVSps/left-Landscape.png',
    RightLandscape = 'https://i.postimg.cc/XYmbdyKF/right-Landscape.png',
    UpsideDown = 'https://i.postimg.cc/7LzyVYXR/upside-Down.png',
    Undefined = ''
}
const Sensors = () => {
    const [location, setLocation] = useState<Location.LocationObject>();
    const [permission, requestPermission] = Location.useForegroundPermissions();
    const [motionData, setMotionData] = useState<DeviceMotionMeasurement['rotation']>();
    const [subscription, setSubscription] = useState<Subscription | null>();
    const [oreintation, setOrientation] = useState<string>()

    DeviceMotion.setUpdateInterval(500);

    const _subscribe = () => {
        setSubscription(
            DeviceMotion.addListener(deviceMotion => {
                setMotionData(deviceMotion.rotation);
                setOrientation(getOrientation(deviceMotion.rotation));
            })
        );
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    const getLocation = async () => {
        if (!permission)
            requestPermission();

        const loc = await Location.getCurrentPositionAsync();
        if (loc)
            setLocation(loc);
    }

    const getOrientation = (motionData: DeviceMotionMeasurement['rotation']): string => {
        if (motionData) {
            let x = motionData.beta * 57.2958;
            let y = motionData.gamma * 57.2958;
            let z = motionData.alpha * 57.2958;


            if (x > 45 && x < 135) {
                return Oreintation.Portrait;
            }
            else if (y > 45 && y < 135)
                return Oreintation.LeftLandscape;
            else if (x > -135 && x < -45)
                return Oreintation.UpsideDown;
            else return Oreintation.RightLandscape;
        }

        return Oreintation.Undefined;

    }

    const getSpeedIcon = (speed: number): string => {
        if (speed > 10)
            return 'model-s';
        else if (speed > 2)
            return 'walk';
        else
            return 'body'
    }

    useEffect(() => {
        _subscribe();
        getLocation();

        const interval = setInterval(getLocation, 10000)

        return () => {
            clearInterval(interval);
            _unsubscribe();
        };
    }, []);




    if (!permission?.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the location</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Text style={styles.text}>---Location:---</Text>
            <Text style={styles.text}>Longitude: {(location?.coords.longitude)?.toPrecision(4)}</Text>
            <Text style={styles.text}>Latitude: {(location?.coords.latitude)?.toPrecision(4)}</Text>
            <Text style={styles.text}>Altitude: {(location?.coords.altitude)?.toPrecision(4)}</Text>
            <Text style={styles.text}>Speed: {location?.coords.speed}</Text>
            <TabBarIcon name={getSpeedIcon(location?.coords.speed)} size={50} color={'blue'} style={{ alignSelf: 'center' }}></TabBarIcon>
            <Text style={styles.text}>---Oreintation:---</Text>
            <Text style={styles.text}>X: {((motionData?.beta) ? motionData?.beta * 57.2958 : 0).toPrecision(4)}°</Text>
            <Text style={styles.text}>Y: {((motionData?.gamma) ? motionData.gamma * 57.2958 : 0).toPrecision(4)}°</Text>
            <Text style={styles.text}>Z: {((motionData?.alpha) ? motionData.alpha * 57.2958 : 0).toPrecision(4)}°</Text>
            {oreintation? <Image src={oreintation} style={styles.img}></Image> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'baseline',
        padding: 30
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        alignSelf: 'center'
    },
    img:{
        width:150,
        height: 150,
        alignSelf:'center',
        resizeMode:'contain'
    }
})

export default Sensors;
