import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert} from 'react-native';
import {Button, TextInput, RadioButton} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import Preloader from '../guest/Preloader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Picker} from '@react-native-community/picker';

export default function PostAd(props) {
    const [checked, setChecked] = React.useState('');
    const [image, setImage] = useState(null);
    const [imageData, setImageData] = useState([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSucess] = useState([]);
    const [productDetail, setProductDetail] = useState({});
    const [productData, setProductData] = useState({
        title: '',
        price: '',
        phone: '',
        address: '',
        category: '',
        subcategory: '',
        plan: checked,
        description: '',
        tags: ''
    });

    const {subcategory, category, plan, title, price, phone, address, description, tags} = productData;

    const onChangeTitle = value => {
        setProductData({
            ...productData,
            title: value
        });
    };
    const onChangePrice = value => {
        setProductData({
            ...productData,
            price: value
        });
    };
    const onChangePhone = value => {
        setProductData({
            ...productData,
            phone: value
        });
    };
    const onChangeAddress = value => {
        setProductData({
            ...productData,
            address: value
        });
    };
    const onChangeCategory = value => {
        setProductData({
            ...productData,
            category: value
        });
    };
    const onChangeSubCategory = value => {
        setProductData({
            ...productData,
            subcategory: value
        });
    };
    const onChangePlan = value => {
        setProductData({
            ...productData,
            plan: value
        });
    };
    const onChangeTag = value => {
        setProductData({
            ...productData,
            tags: value
        });
    };
    const onChangeDiscription = value => {
        setProductData({
            ...productData,
            description: value
        });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            setImageData(result);
            console.log('PIC', imageData);
        }
    };

    // ==============CATEGORY LIST STATE =========

    const [categoryData, setCategoryData] = useState([]);
    const loadCategory = () => {
        axios
            .get('https://bellefu.com/api/category/list', {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(res => {
                setCategoryData(res.data.categories);
            })
            .catch(error => {
                console.log(error);
            });
    };

    // ==============SUBCATEGORY LIST STATE =========

    const [subcategoryData, setSubCategoryData] = useState([]);
    useEffect(
        () => {
            const loadSubCategory = async () => {
                await axios
                    .get(`https://bellefu.com/api/subcategory/listfor/${productData.category}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json'
                        }
                    })
                    .then(res => {
                        console.log(res);
                        setSubCategoryData(res.data.subcategories);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            };
            loadSubCategory();
        },
        [productData, setSubCategoryData]
    );




    

    const onSubmitHandle = () => {
        let localUri = imageData.uri;
        let filename = localUri.split('/').pop();
    
        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        setLoading(true);
        const payload = new FormData();
        console.log(productData);
        payload.append('title', productData.title);
        payload.append('price', productData.price);
        payload.append('phone', productData.phone);
        payload.append('address', productData.address);
        payload.append('category', productData.category);
        payload.append('subcategory', productData.subcategory);
        payload.append('address', productData.address);
        payload.append('plan', checked);
        payload.append('description', productData.description);
        payload.append('product_images[]', {uri: localUri, name: filename, type});
        console.log(payload);
        axios
            .post('https://bellefu.com/api/user/product/save', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json'
                }
            })
            .then(res => {
               
                setProductDetail(res.data.product_details);
                setSucess(res.data);
                Alert.alert(res.data.message);
                console.log('succes', res.data);
                console.log('data', res.data.product_details);
                setLoading(false);
              
            })
            .catch(e => {
                setLoading(false);
                // console.log('submit', e.response.data);
                // console.log('submit', e);
                if (e.response.data) {
                    Alert.alert('All field are required, check  for any empty field and fill up');
                }
            });
    };

    useEffect(() => {
        async function getToken() {
            let tokenn = await AsyncStorage.getItem('user');
            await setToken(tokenn);
            console.log('token', token);
        }
        getToken();
    }, []);
    console.log(checked);
    useEffect(() => {
        console.log(success);
        loadCategory();
        if (success.is_upgradable === true && productDetail.product_slug  && productData.product_plan > 0 ) {
            props.navigation.navigate('Payment', {productDetail});
        }
    }, [success, productDetail]);
    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {loading ? (
                    <Preloader />
                ) : (
                    <View style={styles.container}>
                        <TouchableOpacity
                            style={{
                                borderWidth: 1,
                                borderColor: 'gray',
                                borderRadius: 4,
                                height: 60,
                                opacity: 4,
                                marginBottom: 30
                            }}>
                            <Picker
                                selectedValue={category}
                                borderStyle="solid"
                                onValueChange={value => onChangeCategory(value)}>
                                <Picker.Item label=">>>Select Category<<<" />
                                {categoryData.map(data => (
                                    <Picker.Item key={data.slug} label={data.name} value={data.slug} />
                                ))}
                            </Picker>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                borderWidth: 1,
                                borderColor: 'gray',
                                borderRadius: 4,
                                height: 60,
                                opacity: 4,
                                marginBottom: 30
                            }}>
                            <Picker selectedValue={subcategory} onValueChange={value => onChangeSubCategory(value)}>
                                <Picker.Item label=">>>Select Subcategory<<<" />
                                {subcategoryData.map(data => (
                                    <Picker.Item key={data.slug} label={data.name} value={data.slug} />
                                ))}
                            </Picker>
                        </TouchableOpacity>
                        <TextInput
                            mode="outlined"
                            label="Title"
                            value={title}
                            onChangeText={value => onChangeTitle(value)}
                        />
                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            label="Location"
                            value={address}
                            onChangeText={value => onChangeAddress(value)}
                        />
                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            label="Phone Number"
                            value={phone}
                            onChangeText={value => onChangePhone(value)}
                        />
                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            label="Price"
                            value={price}
                            onChangeText={value => onChangePrice(value)}
                        />
                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            label="tag"
                            value={tags}
                            onChangeText={value => onChangeTag(value)}
                        />
                        <TextInput
                            style={styles.input}
                            multiline={true}
                            numberOfLines={5}
                            mode="outlined"
                            label="Discription"
                            value={description}
                            onChangeText={value => onChangeDiscription(value)}
                        />
                        <View style={{justifyContent: 'center', marginTop: 10, alignSelf: 'center'}}>
                            {image && <Image source={{uri: image}} style={{width: 200, height: 200}} />}
                        </View>

                        <View style={{padding: 20, marginTop: 20}}>
                            <Text style={{marginBottom: 10}}>*Upload the product images</Text>
                            <Button onPress={pickImage} mode="contained" style={{backgroundColor: '#ffa500'}}>
                                <AntDesign name="cloudupload" size={23} color="white" />
                                <Text style={{color: 'white'}}>upload image</Text>
                            </Button>
                        </View>

                        <View style={{flexDirection: 'row', padding: 10}}>
                            <RadioButton
                                value="free"
                                status={checked === 'free' ? 'checked' : 'unchecked'}
                                onPress={() => setChecked('free')}
                                color="#76ba1b"
                                onChangeText={value => onChangePlan(value)}
                            />
                            <Text style={{marginTop: 10}}>Free</Text>
                        </View>
                        <View style={{flexDirection: 'row', padding: 10}}>
                            <RadioButton
                                value="urgent"
                                status={checked === 'urgent' ? 'checked' : 'unchecked'}
                                onPress={() => setChecked('urgent')}
                                color="#76ba1b"
                                onChangeText={value => onChangePlan(value)}
                            />
                            <Text style={{marginTop: 10}}>Urgent</Text>
                        </View>
                        <View style={{flexDirection: 'row', padding: 10}}>
                            <RadioButton
                                value="featured"
                                status={checked === 'featured' ? 'checked' : 'unchecked'}
                                onPress={() => setChecked('featured')}
                                color="#76ba1b"
                                onChangeText={value => onChangePlan(value)}
                            />
                            <Text style={{marginTop: 10}}>Featuerd</Text>
                        </View>
                        <View style={{flexDirection: 'row', padding: 10}}>
                            <RadioButton
                                value="highlighted"
                                status={checked === 'highlighted' ? 'checked' : 'unchecked'}
                                onPress={() => setChecked('highlighted')}
                                color="#76ba1b"
                                onChangeText={value => onChangePlan(value)}
                            />
                            <Text style={{marginTop: 10}}>Heigthligted</Text>
                        </View>
                        <Button
                            style={styles.btn}
                            mode="contained"
                            onPress={onSubmitHandle}
                            icon={{source: 'filter-plus-outline', color: '#ffa500'}}>
                            <Text style={{color: 'white'}}> Post</Text>
                        </Button>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        padding: 10,
        marginBottom: 200
    },
    input: {
        marginTop: 20
    },
    inputselect: {
        marginTop: 20
    },
    btn: {
        marginTop: 40,
        color: 'white',
        backgroundColor: '#ffa500',
      
    }
});
