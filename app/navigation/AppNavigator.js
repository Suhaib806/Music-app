// app/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Player from '../screens/Player';
import PlayList from '../screens/Playlist';
import AudioList from '../screens/AudioList';
import AudioDetails from '../screens/AudioDetails';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import PlaybackBar from '../components/playbackbar';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AudioListStack = () => {
  return (
    <Stack.Navigator>
      
      <Stack.Screen name="AudioList" component={AudioList} />
     
      <Stack.Screen 
        name="AudioDetails" 
        component={AudioDetails}
        options={{
          title: 'Audio Details',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="AudioListTab" 
        component={AudioListStack} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="headphones" color={color} size={size} />
          ),
          headerShown: false,
          tabBarLabel: 'AudioList',
        }}
      />
      <Tab.Screen 
        name="Playlist" 
        component={PlayList} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="playlist-music-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Player" 
        component={Player} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="compact-disc" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;