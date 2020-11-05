import React, {useState, useEffect} from 'react';
import {View, Text, Image, ScrollView, StyleSheet ,TouchableOpacity} from 'react-native';
import {Card, Paragraph, Divider} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
// import Moment from 'react-moment';
import axios from 'axios';
import Preloader from '../guest/Preloader';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavouriteAd(props) {
    const [ad, setAd] = useState([]);
    const [products, setProducts] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState('');
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('')



    const nextData = () => {
        setLoading(false);
        if (nextPageUrl === null) {
            return;
        }else{
		axios
			.get(nextPageUrl, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
					Accept: "application/json"
				}
			})
			.then((res) => {
				setProducts(res.data.favourites)
				setNextPageUrl(res.data.favourites.next_page_url)
				console.log('called next page: ', nextPageUrl)
				setAd(ad.concat(...res.data.favourites.data))
            })
        }
	}


    let url = "https://bellefu.com/api/user/product/favourite/list";
    const loadAd = async () => {
        let tokenn = await AsyncStorage.getItem('user')
        await setToken(tokenn)
			axios
				.get(`${url}`, {
					headers: {
						Authorization: `Bearer ${tokenn}`,
						"Content-Type": "application/json",
						Accept: "application/json"
					}
				})
				.then((res) => {
					setProducts(res.data.favourites)
					console.log(res.data.favourites.data)
                    setAd(res.data.favourites.data);
                    setLoading(false);
					setNextPageUrl(res.data.favourites.next_page_url)
					if(res.data.favourites.data.length < 1){
                        setStatus('No Favourite Ad')
                        setStatus(true);
					}
				})
				.catch((error) => {
					setStatus('No Favourite Ad')
					setLoading(false);
					setAd([]);
				});
    }
	useEffect(() => {
        
		loadAd()
	}, []);



    return (
        <View>
          
                <View style={{marginBottom: 20}}>
                    {loading ? (
                        <Preloader />
                    ) : status ? (
                        <View style={{marginTop: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 20}}>No Item</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={ad}
                            keyExtractor={item => item.slug}
                            onEndReached={nextData}
                            onEndReachedThreshold={1}
                            renderItem={({item, index}) => (
                                <Card style={{marginTop: 5, borderRadius: 0}}>
                                    <View style={styles.img}>
                                    <TouchableOpacity onPress={() => props.navigation.navigate('Detail', {item})}>
                                            <Image
                                                style={{height: 150, width: 150}}
                                                source={{
                                                    uri: `https://bellefu.com/images/products/${item.slug}/${item
                                                        .images[0]}`
                                                }}
                                            />
                                        </TouchableOpacity>
                                        <View style={styles.writUp}>
                                            <Paragraph style={styles.title} ellipsizeMode="tail" numberOfLines={2}>
                                            {item.title}
                                            </Paragraph>
                                            <Divider />
                                            <Paragraph style={styles.price}>
                                                <Text style={{color: '#76ba1b', fontWeight: '900'}}> {item.currency_symbol}
                                                {item.price}</Text>
                                        
                                            </Paragraph>
                                            <Divider />
                                            <View style={{flexDirection: 'row'}}>
                                                <Paragraph style={{fontWeight: 'bold', marginLeft: 20}}>
                                                    Posted:
                                                </Paragraph>
                                
                                                <Text style={{marginLeft: 5}}>
                                                    {item.created_at}
                                                </Text>
                                                
                                            </View>
                                            <Divider />
                                            <View style={styles.icons}>
                                                <View style={{flexDirection: 'row'}}>
                                                    <SimpleLineIcons
                                                        style={{marginLeft: 20, marginTop: 4}}
                                                        name="location-pin"
                                                        size={15}
                                                        color="#ffa500"
                                                    />
                                                    <Paragraph style={{paddingLeft: 5, fontSize: 13}}>
                                                  <Text style={{color: 'black'}}>{item.address}</Text>
                                                    </Paragraph>
                                                </View>
                                               
                                            </View>
                                            <View style={styles.like}>
                                                    <FontAwesome5 name="heart-broken" size={25} color="red" />
                                                </View>
                                        </View>
                                    </View>
                                </Card>
                            )}
                        />
                    )}
                </View>
         
        </View>
    );
}

const styles = StyleSheet.create({
    my_card: {
        marginTop: 29
    },
    img: {
        padding: 10,
        flexDirection: 'row'
    },
    title: {
        fontSize: 12,
        paddingLeft: 20,
        fontWeight: '700',
        marginTop: -10,
        width: 170
    },
    price: {
        fontSize: 15,
        paddingLeft: 20
    },
    
    like: {
        paddingLeft: 20,
        paddingTop: 7,
        color: '#ffa500'
    },
    convert: {
        paddingLeft: 15,
        paddingTop: 5
    },
    divider: {
        paddingLeft: 25,
        paddingTop: 15
    },
    writUp: {
        flexDirection: 'column',
        paddingVertical: 10
    }
});
