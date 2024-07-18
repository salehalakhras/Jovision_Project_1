import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBarIcon } from "./components/navigation/TabBarIcon";
import Camera from './screens/Camera';
import Gallery from './screens/Gallery';
import Sensors from './screens/Sensors';
import SlideShow from './screens/SlideShow';
import { NavigationContainer } from '@react-navigation/native';


const Tab = createBottomTabNavigator();

function App() {

  return (
    <NavigationContainer>
    <Tab.Navigator screenOptions={{
      headerShown: true,
      unmountOnBlur: true,
      headerTitleAlign:'center',
      headerTitleStyle:{fontWeight:'bold'},
    }}>
      <Tab.Screen name="Camera"
        component={Camera}
        options={{
          title: 'Camera',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'camera' : 'camera-outline'} color={color} />
          ),
          tabBarLabelStyle: {marginBottom:2,fontWeight: 'bold',}
        }} />
      <Tab.Screen name='Sensors'
      component={Sensors}
        options={{
          title: 'Sensors',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'location' : 'location-outline'} color={color} />
          ),
          tabBarLabelStyle: {marginBottom:2,fontWeight: 'bold',}
        }} />
      <Tab.Screen name='Gallery'
      component={Gallery}
        options={{
          title: 'Gallery',

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'image' : 'image-outline'} color={color} />
          ),
          tabBarLabelStyle: {marginBottom:2,fontWeight: 'bold',}
        }} />
      <Tab.Screen name='SlideShow'
      component={SlideShow}
        options={{
          title: 'Slideshow',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'images' : 'images-outline'} color={color} />
          ),
          tabBarLabelStyle: {marginBottom:2,fontWeight: 'bold',}
        }} />
    </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
