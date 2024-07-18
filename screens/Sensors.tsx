import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as Location from 'expo-location';
import { DeviceMotion, DeviceMotionMeasurement, DeviceMotionOrientation } from 'expo-sensors';
import { Subscription } from 'expo-media-library';

const Sensors = () => {
    const [location, setLocation] = useState<Location.LocationObject>();
    const [permission, requestPermission] = Location.useForegroundPermissions();
    const [motionData, setMotionData] = useState<DeviceMotionMeasurement>();
    const [subscription, setSubscription] = useState<Subscription | null>();

    DeviceMotion.setUpdateInterval(500);
    const _subscribe = () => {
        setSubscription(
            DeviceMotion.addListener(deviceMotion => {
                setMotionData(deviceMotion);
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
        setLocation(loc);
    }

    useEffect(() => {
        if(!location)
            getLocation();

        const interval = setInterval(getLocation, 10000)

        _subscribe();
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
            <Text style={styles.text}>Longitude: {location?.coords.longitude}</Text>
            <Text style={styles.text}>Latitude: {location?.coords.latitude}</Text>
            <Text style={styles.text}>Altitude: {location?.coords.altitude}</Text>
            <Text style={styles.text}>Speed: {location?.coords.speed}</Text>
            <Text style={styles.text}>---Oreintation:---</Text>
            <Text style={styles.text}>X: {motionData?.rotation.beta}</Text>
            <Text style={styles.text}>Y: {motionData?.rotation.gamma}</Text>
            <Text style={styles.text}>Z: {motionData?.rotation.alpha}</Text>
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
        color:'black'
    }
})

export default Sensors;
