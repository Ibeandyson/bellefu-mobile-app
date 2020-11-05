import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView
} from "react-native";
import Header from "../navigations/Header";
import Bottom from "../navigations/BottomNav";
import ProductList from "../reusableComponents/ProductList";
import LandingPageContet from "../guest/LandingPageContet"
import { FlatList, } from "react-native-gesture-handler";
import Axios from "axios";
import Preloader from "./Preloader";
import AsyncStorage from "@react-native-async-storage/async-storage";
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default function Landing(props) {
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

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => {
      setRefreshing(false);
      loadData();
    });
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View>
    <Header home={true} {...props} />
    {loading && (
        <View style={{height: '' + 100 + '%'}}>
            <Preloader />
        </View>
    )}
    
        <FlatList
         refreshControl={
          <RefreshControl
            progressBackgroundColor="#76BA1A"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
            data={productsData}
            onEndReached={nextData}
            keyExtractor={item => item.slug}
            onEndReachedThreshold={100}
            ListHeaderComponent={<LandingPageContet {...props}/>}
            renderItem={({item, index}) => (
                <ProductList data={productsData} token={token} item={item} key={item.slug} {...props} />
            )}
        />
    <ScrollView>
    </ScrollView>
    <Bottom home={true} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
  },
});




