import React, {useState, useEffect} from 'react';
import MapView ,{Marker} from 'react-native-maps';
import { StyleSheet, Text, View, ImageBackground, Image, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default function App() {
   const [state, setState]= useState({
    location:null,
    geocode:null,
    errorMessage:""
  });

  useEffect(() => {
    getLocationAsync();
  }, [])

  const getGeocodeAsync = async(location) => {
    let geocode = await Location.reverseGeocodeAsync(location);
    setState(prevState => {
      // Object.assign would also work
      return {...prevState, geocode};
    });
  }

  const getLocationAsync = async() => {
     let {status} = await Permissions.askAsync(Permissions.LOCATION);
     if(status !== 'granted'){
      setState({...state, errorMessage: 'Permission to access location was denied'})
     }

     let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
     const {latitude, longitude} = location.coords;
     setState({...state, location:{latitude, longitude}});
   //  getGeocodeAsync({latitude, longitude});
  };


  return (
    <View style={styles.container}>
    {state.location && <MapView
    initialRegion={{
      latitude: parseFloat(state.location.latitude),
      longitude: parseFloat(state.location.longitude),
      latitudeDelta: 0.0122,
      longitudeDelta: 0.0121}}
     style={styles.mapStyle}>
       <Marker
      coordinate={{latitude: parseFloat(state.location.latitude), longitude: parseFloat(state.location.longitude)}}
    /></MapView>}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
