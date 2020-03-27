import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native';
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
     getGeocodeAsync({latitude, longitude});
  };


  return (
   <ImageBackground source={require('./assets/bg.jpg')} blurRadius={5} style={styles.container}>
     <View style={styles.overlay}>
         <Image source={require('./assets/marker.png')} style={{width:100, height:100}}></Image>
  <Text style={styles.heading1}>{state.geocode ?`${state.geocode[0].city}, ${state.geocode[0].isoCountryCode}`: ""}
  </Text>
  <Text style={styles.heading2}>{state.geocode ? state.geocode[0].street : ""}
  </Text>
  <Text style={styles.heading3}>{state.location ?`${state.location.latitude}, ${state.location.longitude}`: ""}
  <Text style={styles.heading2}>{state.errorMessage}</Text>
  </Text>
     </View>
   </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  overlay:{
    backgroundColor:"#00000070",
    height:"100%",
    width:"100%",
    justifyContent:"center",
    alignItems:"center"
  },
  heading1:{
    color:"#fff",
    fontWeight:"bold",
    fontSize:30,
    margin:20
  },
  heading2:{
    color:"#fff",
    margin:5,
    fontWeight:"bold",
    fontSize:15
  },
  heading3:{
    color:"#fff",
    margin:5
  }
});
