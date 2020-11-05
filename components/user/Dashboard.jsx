import React, {useState, useEffect} from 'react';
import {View, ScrollView, Text,} from 'react-native';
import {Card, Avatar, List} from 'react-native-paper';
import axios from 'axios';
import {useSelector} from 'react-redux';
import Preloader from "../guest/Preloader"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard(props) {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('')

    

    let url = 'https://bellefu.com/api/user/profile/details';

    const loadProfile = async () => {
        let tokenn = await AsyncStorage.getItem('user')
        await setToken(tokenn)
        console.log(token)
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${tokenn}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(res => {
                setProfile(res.data.user);
                setLoading(false)
            })
            .catch(e => {
                console.log('profile error', e.response);
            });
    };

    useEffect(
        () => {
            console.log(profile);
        },
        [profile]
    );

    useEffect(() => {
        loadProfile();
    }, []);

    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false}>
               { loading ? <Preloader/>:
                   <View style={{marginBottom: 50}}>

                   <View
                        style={{
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            maxWidth: 500
                        }}>
                        <Card style={{width: 114, margin: 3, height: 70}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
                                <Text style={{fontSize: 12}}>Ads</Text>
                    <Text style={{fontSize: 15, opacity: 0.5}}>{profile.products_count}</Text>
                            </View>
                        </Card>
                        <Card style={{width: 114, margin: 3, height: 70}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
                                <Text style={{fontSize: 12}}>Favourite</Text>
                    <Text style={{fontSize: 15, opacity: 0.5}}>{profile.favourite_products_count}</Text>
                            </View>
                        </Card>
                        <Card style={{width: 114, margin: 3, height: 70}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
                                <Text style={{fontSize: 12}}>Pending </Text>
                    <Text style={{fontSize: 15, opacity: 0.5}}>{profile.pending_products_count}</Text>
                            </View>
                        </Card>
                        <Card style={{width: 114, margin: 3, height: 70}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
                                <Text style={{fontSize: 12}}>Expired </Text>
                                <Text style={{fontSize: 15, opacity: 0.5}}>{profile.expired_products_count}</Text>
                            </View>
                        </Card>
                        <Card style={{width: 114, margin: 3, height: 70}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
                                <Text style={{fontSize: 12}}>Hiden</Text>
                    <Text style={{fontSize: 15, opacity: 0.5}}>{profile.hidden_products_count}</Text>
                            </View>
                        </Card>
                        <Card style={{width: 114, margin: 3, height: 70}}>
                            <View style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
                                <Text style={{fontSize: 12}}>Wallet</Text>
                    <Text style={{fontSize: 15, opacity: 0.5}}>{profile.profile && profile.profile.wallet_balance}</Text>
                            </View>
                        </Card>
                    </View>


                    {/* AVATER AND FULL NAME */}
                    <Card style={{marginBottom: 3}}>
                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                            <Avatar.Image size={100} source={require('../../images/pic.jpg')} />
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 15, marginBottom: 15}}>
                            <Text style={{fontSize: 15, fontWeight: 'bold', opacity: 0.8}}>{profile.profile && (profile.profile.first_name + " " + profile.profile.last_name ) } </Text>
                        </View>
                    </Card>
                    {/* PROFILE */}
                    <Card>
                        <View style={{marginTop: 15}}>
                            <List.Section>
                                <List.Subheader style={{fontSize: 14, fontWeight: 'bold'}}>UserName</List.Subheader>
                                <View style={{marginTop: -15}}>
                                    <List.Item titleStyle={{fontSize: 13}} title={profile.username} />
                                </View>

                                <List.Subheader style={{fontSize: 14, fontWeight: 'bold', marginTop: -10}}>
                                    Email
                                </List.Subheader>
                                <View style={{marginTop: -15}}>
                                    <List.Item titleStyle={{fontSize: 13}} title={profile.email} />
                                </View>

                                <List.Subheader style={{fontSize: 14, fontWeight: 'bold', marginTop: -10}}>
                                    Gender
                                </List.Subheader>
                                <View style={{marginTop: -15}}>
                                    <List.Item titleStyle={{fontSize: 13}} title={profile.profile && profile.profile.gender === 'M' ? 'Male' : 'Female' } />
                                </View>

                                <List.Subheader style={{fontSize: 14, fontWeight: 'bold', marginTop: -10}}>
                                    Phone
                                </List.Subheader>
                                <View style={{marginTop: -15}}>
                                    <List.Item titleStyle={{fontSize: 13}} title={profile.phone} />
                                </View>

                                <List.Subheader style={{fontSize: 14, fontWeight: 'bold', marginTop: -10}}>
                                    Country
                                </List.Subheader>
                                <View style={{marginTop: -15}}>
                                    <List.Item titleStyle={{fontSize: 13}} title={profile.country && profile.country.name} />
                                </View>

                                <List.Subheader style={{fontSize: 14, fontWeight: 'bold', marginTop: -10}}>
                                    Bio
                                </List.Subheader>
                                <View style={{marginTop: -15, padding: 20}}>
                                    <Text  titleStyle={{fontSize: 13}}> {profile.bio} </Text>
                                       
                                    
                                </View>
                            </List.Section>
                        </View>
                    </Card>

                </View>}
                
            </ScrollView>
        </View>
    );
}
