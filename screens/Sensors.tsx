import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as Location from 'expo-location';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';
import { Subscription } from 'expo-media-library';

enum Oreintation {
    Portrait = 'Portrait',
    LeftLandscape = 'Left Landscape',
    RightLandscape = 'Right Landscape',
    UpsideDown = 'Upside Down'
}
const Sensors = () => {
    const [location, setLocation] = useState<Location.LocationObject>();
    const [permission, requestPermission] = Location.useForegroundPermissions();
    const [motionData, setMotionData] = useState<DeviceMotionMeasurement>();
    const [subscription, setSubscription] = useState<Subscription | null>();
    const [oreintation, setOrientation] = useState<Oreintation>()

    DeviceMotion.setUpdateInterval(500);

    const _subscribe = () => {
        setSubscription(
            DeviceMotion.addListener(deviceMotion => {
                if (deviceMotion.rotation) {
                    setMotionData(deviceMotion);
                    setOrientation(getOrientation(motionData));
                }
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

    const getOrientation = (motionData): Oreintation => {
        let x = motionData.rotation.beta * 57.2958;
        let y = motionData.rotation.gamma * 57.2958;
        let z = motionData.rotation.alpha * 57.2958;

        if (x > 45 && x < 135) {
            return Oreintation.Portrait;
        }
        else if (y > 45 && y < 135)
            return Oreintation.LeftLandscape;
        else if (x > -135 && x < -45)
            return Oreintation.UpsideDown;
        else return Oreintation.RightLandscape;

    }

    useEffect(() => {
        if (!location)
            getLocation();

        const interval = setInterval(getLocation, 10000)

        setTimeout(_subscribe, 2000);
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
            <Text style={styles.text}>---Oreintation:---</Text>
            {motionData?.rotation ? (<><Text style={styles.text}>X: {(motionData?.rotation.beta * 57.2958).toPrecision(4)}°</Text>
                <Text style={styles.text}>Y: {(motionData?.rotation.gamma * 57.2958).toPrecision(4)}°</Text>
                <Text style={styles.text}>Z: {(motionData?.rotation.alpha * 57.2958).toPrecision(4)}°</Text>
                <Text style={styles.text}>{oreintation}</Text></>) : null}
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
        color: 'black'
    }
})

export default Sensors;
