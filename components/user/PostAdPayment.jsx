import React, {useState, useEffect} from 'react';
import {Text, View, Alert, StyleSheet, ScrollView} from 'react-native';
import {Button, TextInput, RadioButton, Divider} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function PostAdPayment(props) {
    const [checked, setChecked] = React.useState('');
    const [token, setToken] = useState('');
    const [walletData, setWalletData] = useState([]);
    const [paymentData, setPaymentData] = useState({
        product_slug: props.route.params.productDetail.product_slug,
        upgrade_plan:  props.route.params.productDetail.product_plan,
        payment_channel: '',
        voucher_code: '',
        gateway_provider: ''
    });

    ////// CALLED API TO GET WALLET BALANCE
    let url = 'https://bellefu.com/api/user/profile/details';

    const loadProfile = async () => {
        let tokenn = await AsyncStorage.getItem('user');
        await setToken(tokenn);
        console.log(token);
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${tokenn}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .then(res => {
                setWalletData(res.data.user.profile.wallet_balance);
                setLoading(false);
                console.log('wallet', walletData);
            })
            .catch(e => {
                console.log('profile error', e.response);
            });
    };

    useEffect(() => {
        loadProfile();
    }, [props.route.params.productDetail]);

    const onSubmitHandle = () => {
      
        
        let url = "https://bellefu.com/api/user/product/upgrade";
            axios
                .post(url, paymentData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    }
                })
                .then(response => {
                    setSuccess(response.data)
                    Alert.alert(res.data.message);
                    console.log(response.data)
                    setLoading(false);
                
                })
                .catch((error) => {
                    console.log(error);
                    console.log("submit", error.response.data)
                    setLoading(false);
                });
            console.log(paymentData);
        };
    
        const  onChangeChenel = value => {
            setPaymentData({
                ...paymentData,
                payment_channel: value
            });
        };
        const  onChangeVoucher = value => {
            setPaymentData({
                ...paymentData,
                voucher_code: value
            });
        };
    
        console.log(checked);

    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.contianer}>
                    <View style={{justifyContent: 'center', alignSelf: 'center'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 20}}>Choose Payment Method</Text>
                    </View>
                    <Text style={{padding: 30, paddingBottom: -25, fontWeight: 'bold'}}>Pay with Wallet</Text>
                    <View style={{flexDirection: 'row', padding: 10}}>
                        <RadioButton
                            value="wallet"
                            status={checked === 'wallet' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('wallet')}
                            color="#76ba1b"
                            onChangeText={value => onChangeChenel(value)}
                        />
                        <Text style={{marginTop: 10}}>Wallet (balance: $ {walletData})</Text>
                    </View>
                    <Divider />
                    <Text style={{padding: 30, paddingBottom: -25, fontWeight: 'bold'}}>Pay with Voucher</Text>
                    <View style={{padding: 10}}>
                    <View style={{flexDirection: 'row', padding: 10}}>
                        <RadioButton
                            value="voucher"
                            status={checked === 'voucher' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('voucher')}
                            color="#76ba1b"
                            onChangeText={value => onChangeChenel(value)}
                        />
                        <Text style={{marginTop: 10}}>Voucher</Text>
                    </View>
                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            label="Input Voucher Code"
                            // value={phone}
                            onChangeText={value => onChangeVoucher(value)}
                        />
                    </View>
                    <Button
                            style={styles.btn}
                            onPress={() => onSubmitHandle(paymentData)}
                            mode="contained"
                            icon={{source: 'filter-plus-outline', color: '#ffa500'}}>
                            <Text style={{color: 'white'}}> Post</Text>
                        </Button>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    contianer: {
        padding: 20
    }
});
