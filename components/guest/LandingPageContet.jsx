import React, {useState,useEffect} from 'react'
import {View,Text} from "react-native"
import CategoryListing from "./CategoryListing";
import { Card } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Search from "../reusableComponents/Search";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios"



export default function LandingPageContet(props) {
    const [loading, setLoading] = useState(true);
    const [productsData, setProductsData] = useState([]);
    const [products, setProducts] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState("");
    const [token, setToken] = useState("");
    const [country, setCountry] = useState('')
  
    const callApi = async (country, token) => {
      Axios.get(
        `https://bellefu.com/api/product/list?country=${country.country_slug}`,
        {
          headers: {
            Authorization: token !== undefined ? `Bearer ${token}` : "hfh",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
        .then((res) => {
          setLoading(false);
          setProducts(res.data.products);
          setProductsData(res.data.products.data);
          setNextPageUrl(res.data.products.next_page_url);
        })
        .catch((error) => {console.log(error.response)});
    }
  
    const loadData = async () => {
      let tokenn = await AsyncStorage.getItem("user");
      await setToken(tokenn);
      let country = await AsyncStorage.getItem("country");
      if(country !== undefined) {
          setCountry(country)
          callApi(country, tokenn)
        } else {
          let res = await fetch('https://bellefu.com/api/location/info')
          await AsyncStorage.setItem("country", res.location_info);    
          setCountry(res.location_info)
          callApi(res.location_info, tokenn)  
        }
      }
  
    
  
useEffect(() => {
    loadData();
}, [])

    return (
        <View style={{ marginBottom: 10 }}>
        <View style={{ backgroundColor: "#76ba1b", height: 250 }}>
          <View style={{ padding: 10, marginTop: 50 }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                Bellefu - digital agro connect...
              </Text>
            </View>
            <Search {...props} country={country} token={token}/>
            <View
              style={{
                marginTop: 30,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <FontAwesome name="users" color="white" size={20} />
              <Text style={{ paddingLeft: 10, color: "white" }}>
                Farmer's Club
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <CategoryListing />
  </View>
  </View>
    )
}
