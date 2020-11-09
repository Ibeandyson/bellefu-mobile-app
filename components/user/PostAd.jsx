import React, {useState} from 'react';
import {Picker, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image} from 'react-native';
import {Appbar, Button, TextInput, RadioButton} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Permissions from 'expo-permissions';

export default function PostAd(props) {
    const [selectedValue, setSelectedValue] = useState('java');
    const [checked, setChecked] = React.useState('');

    

    return (
        <View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
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
                            selectedValue={selectedValue}
                            borderStyle="solid"
                            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
                            <Picker.Item label="Category" />
                            <Picker.Item label="JavaScript" value="js" />
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
                        <Picker
                            selectedValue={selectedValue}
                            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
                            <Picker.Item label="Subcategory" />
                            <Picker.Item label="JavaScript" value="js" />
                        </Picker>
                    </TouchableOpacity>
                    <TextInput mode="outlined" label="Titel" />
                    <TextInput style={styles.input} mode="outlined" label="Location" />
                    <TextInput style={styles.input} mode="outlined" label="Phone Number" />
                    <TextInput style={styles.input} mode="outlined" label="Price" />
                    <TextInput
                        style={styles.input}
                        multiline={true}
                        numberOfLines={5}
                        mode="outlined"
                        label="Discription"
                    />
                    {/* <Image source={{uri: 'https://i.imgur.com/TkIrScD.png'}} /> */}

                    <View style={{padding: 20, marginTop: 20}}>
                        <Text style={{marginBottom: 10}}>*Upload the product images</Text>
                        <Button mode="contained" style={{backgroundColor: '#ffa500'}}>
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
                        />
                        <Text style={{marginTop: 10}}>Free</Text>
                    </View>
                    <View style={{flexDirection: 'row', padding: 10}}>
                        <RadioButton
                            value="urgent"
                            status={checked === 'urgent' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('urgent')}
                            color="#76ba1b"
                        />
                        <Text style={{marginTop: 10}}>Urgent</Text>
                    </View>
                    <View style={{flexDirection: 'row', padding: 10}}>
                        <RadioButton
                            value="featuerd"
                            status={checked === 'featuerd' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('featuerd')}
                            color="#76ba1b"
                        />
                        <Text style={{marginTop: 10}}>Featuerd</Text>
                    </View>
                    <View style={{flexDirection: 'row', padding: 10}}>
                        <RadioButton
                            value="heigthligted"
                            status={checked === 'heigthligted' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('heigthligted')}
                            color="#76ba1b"
                        />
                        <Text style={{marginTop: 10}}>Heigthligted</Text>
                    </View>
                    <Button
                        style={styles.btn}
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
        height: 45
    }
});
