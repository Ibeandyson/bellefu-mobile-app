import React, { useEffect } from 'react';
import NavigationBar from 'react-native-navbar-color'
import {View, Platform, ImageBackground, Text} from 'react-native'
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';

const WelcomeScreen = (props) => {

    const setCountry = async () => {
        let country = await AsyncStorage.getItem("countrySlug")
        if(country === null || country === undefined){
            let res = await Axios.get('https://bellefu.com/api/location/info')
             await AsyncStorage.setItem('countrySlug', res.data.location_info.country_slug)
             await AsyncStorage.setItem('countryIso', res.data.location_info.country_iso2)          
            await AsyncStorage.setItem('countryName', res.data.location_info.country_name)
            }
    }

    useEffect(() => {
        if(Platform.OS === 'ios'){

            NavigationBar.setColor('#76ba1b')
        }
        setCountry()
    }, [])
    return (
        <View>
            <ImageBackground imageStyle={{
                resizeMode: "cover"
            }} 
            source={require("../../assets/Splash_background.png")}
            style={{
                backgroundColor: '#76ba1b',
                width: '100%',
                height: '100%' 
              }}
          
            >
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{
                        width: 340,
                        color: "white", 
                        fontSize: 47, 
                        fontWeight: "bold",
                        paddingHorizontal: 3.5, 
                        textShadowColor: '#76ba1b',
                        textShadowOffset: {width: -0.5, height: 1.5},
                        textShadowRadius: 0.5}}
                        >
                            Welcome to Bellefu
                        </Text>
                        <Text style={{
                        color: "white", 
                        fontSize: 22, 
                        fontWeight: "bold",
                        paddingHorizontal: 5,
                        width: 340,
                        textShadowColor: '#76ba1b',
                        textShadowOffset: {width: -0.5, height: 1},
                        textShadowRadius: 0.005}}>digital agro connect</Text>
                        <View style={{marginTop: 30, justifyContent: 'center', alignItems: 'center'}}>
                            <Button
                                mode="contained"
                                color="white"
                                style={{width: 340, height: 40,borderWidth: 1, opacity: 0.9 }}
                                onPress={() => props.navigation.navigate("Login")}
                                >
                                <Text style={{ color: "#76ba1b", fontSize: 16, fontWeight: "800" }}>LOGIN</Text>
                            </Button>
                            <Button
                                mode="contained"
                                color="white"
                                style={{width: 340, height: 40, borderWidth: 1, opacity: 0.9, marginTop: 15 }}
                                onPress={() => props.navigation.navigate("Home")}
                                >
                                <Text style={{ color: "#76ba1b", fontSize: 16, fontWeight: "800" }}>SKIP</Text>
                            </Button>
                        </View>
                </View>
            </ImageBackground>
        </View>
    )
}

export default WelcomeScreen