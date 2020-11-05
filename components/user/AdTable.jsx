import React, {useState, useEffect} from 'react';
import {View, Text, Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Paragraph, Divider} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import axios from 'axios';
// import Moment from 'react-moment';
import Preloader from '../guest/Preloader';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdTable(props) {
    const [ad, setAd] = useState([]);
    const [products, setProducts] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState('');
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('')


    const nextData = () => {
        if (nextPageUrl === null) {
          return;
        } else {
          Axios.get(nextPageUrl, {
            headers: {
              Authorization: token !== undefined ? `Bearer ${token}` : "hfh",
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }).then((res) => {
            setProducts(res.data.products);
            setNextPageUrl(res.data.products.next_page_url);
            setProductsData(productsData.concat(...res.data.products.data));
          });
        }
      };

    let url = 'https://bellefu.com/api/user/product/list';

    const loadAd = async () => {
        let tokenn = await AsyncStorage.getItem('user')
        await setToken(tokenn)
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${tokenn}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(res => {
                console.log(res.data.products.data);
                setProducts(res.data.products);
                setAd(res.data.products.data);
                setNextPageUrl(res.data.products.next_page_url);
                setLoading(false);
                if (res.data.products.data.length < 1) {
                    setStatus(true);
                }
            })
            .catch(error => {
                setStatus('No Ad');
                setAd([]);
            });
    }

    useEffect(() => {
        loadAd()
    }, []);

    return (
        <View>
           
                <View style={{marginBottom: 200}}>
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
                                <Card key={item.slug} style={{marginTop: 5, borderRadius: 0}}>
                                    <View style={styles.img}>
                                        <TouchableOpacity onPress={() => props.navigation.navigate('Detail', {item})}>
                                            <Image
                                                style={{height: 120, width: 150}}
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
                                                <Text style={{color: '#76ba1b', fontWeight: '900'}}>
                                                    {item.currency_symbol}
                                                    {item.price}
                                                </Text>
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
                                                <View style={styles.convert}>
                                                    <AntDesign name="edit" size={25} color="green" />
                                                </View>
                                                <View style={styles.like}>
                                                    <AntDesign name="delete" size={20} color="red" />
                                                </View>
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
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    like: {
        paddingLeft: 100,
        paddingTop: 5,
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
