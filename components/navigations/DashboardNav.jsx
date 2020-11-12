import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {List, Divider, Card, Appbar} from 'react-native-paper';
import BottomNav from '../navigations/BottomNav';

export default function DashboardNav(props) {
    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{marginBottom: 200}}>
                    {/* USER */}
                    <TouchableOpacity onPress={() => props.navigation.navigate('Dashboard')}>
                        <Card style={{borderRadius: 0}}>
                            <List.Item
                                title="DashBoard"
                                left={props => <List.Icon {...props} icon="view-dashboard-outline" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>

                    <Divider />
                    {/* ADS */}
                    <TouchableOpacity onPress={() => props.navigation.navigate('Ads')}>
                        <Card style={{borderRadius: 0, marginTop: 20}}>
                            <List.Item
                                title="Ads"
                                left={props => <List.Icon {...props} icon="gift-outline" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>

                    <Divider />
                    <TouchableOpacity onPress={() => props.navigation.navigate('Favourite')}>
                        <Card style={{borderRadius: 0}}>
                            <List.Item
                                title="Favourite Ads"
                                left={props => <List.Icon {...props} icon="heart-outline" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>

                    <Divider />
                    <TouchableOpacity onPress={() => props.navigation.navigate('Pending')}>
                        <Card style={{borderRadius: 0}}>
                            <List.Item
                                title="Pending Ads"
                                left={props => <List.Icon {...props} icon="clock-outline" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity onPress={() => props.navigation.navigate('Expired')}>
                        <Card style={{borderRadius: 0}}>
                            <List.Item
                                title="Expired Ads"
                                left={props => <List.Icon {...props} icon="calendar-remove-outline" color="#ffa500" />}
                            />
                        </Card>
                    </TouchableOpacity>
                    <Divider />
                    {/* ACCOUNT */}

                    <Card style={{borderRadius: 0, marginTop: 20}}>
                        <List.Item
                            title="Messages"
                            left={props => <List.Icon {...props} icon="message-outline" color="#ffa500" />}
                        />
                    </Card>

                    <Divider />
                    <TouchableOpacity onPress={() =>  props.navigation.navigate('Verification')}>
                    <Card style={{borderRadius: 0}}>
                        <List.Item
                            title="Verification"
                            left={props => <List.Icon {...props} icon="check-circle-outline" color="#ffa500" />}
                        />
                    </Card>
                    </TouchableOpacity>

                    <Divider />
                    <TouchableOpacity onPress={() =>  props.navigation.navigate('Settings')}>
                    <Card style={{borderRadius: 0}}>
                        <List.Item
                            title="Settings"
                            left={props => <List.Icon {...props} icon="power-settings" color="#ffa500" />}
                        />
                    </Card>
                    </TouchableOpacity>

                    <Divider />
                    <TouchableOpacity onPress={() => logout}>
                    <Card style={{borderRadius: 0}}>
                        <List.Item
                            title="Logout"
                            left={props => <List.Icon {...props} icon="logout-variant" color="#ffa500" />}
                        />
                    </Card>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <BottomNav {...props} />
        </View>
    );
}



const logout = () => {
    AsyncStorage.removeItem('user');
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'whitesmoke'
    }
});
