import Axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  SafeAreaView 
} from "react-native";
import Bottom from "../navigations/BottomNav";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Header from "../navigations/Header";
import ProductList from "../reusableComponents/ProductList";
import Search from "../reusableComponents/Search";
import Preloader from "./Preloader";

const SearchResult = (props) => {
  const [loading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState([]);
  const [products, setProducts] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState("");
  const [token, setToken] = useState("");

  let country = props.route.params.country ? `country=${props.route.params.country.country_iso2}` : ''
	let lga = props.route.params.lga ? `&lga=${props.route.params.lga}` : '';
	let state = props.route.params.state ? `&state=${props.route.params.state}` : '';
	let subcategory = props.route.params.subcategory ? `&subcategory=${props.route.params.subcategory}` : '';
	let category = props.route.params.category ? `&category=${props.route.params.category}` : '';
	let maxPrice = props.route.params.maxPrice ? `&max_price=${props.route.params.maxPrice}` : '';
  let minPrice = props.route.params.minPrice ? `&min_price=${props.route.params.minPrice}` : '';
  let find = props.route.params.find ? `&find=${props.route.params.find}` : '';

  let apiUrl = `https://bellefu.com/api/product/list?${country}${lga}${state}${subcategory}${category}${maxPrice}${minPrice}${find}`;

  const load = async () => {
    setLoading(true);
		Axios
			.get(apiUrl, {
				headers: {
					Authorization: props.route.params.token !== undefined ? `Bearer ${props.route.params.token}` : 'hfh',
					"Content-Type": "application/json",
					Accept: "application/json"
				}
			})
			.then((res) => {
				setLoading(false);
				setProducts(res.data.products)
        setProductsData(res.data.products.data);
        setNextPageUrl(res.data.products.next_page_url)
        console.log("check:", res.data)
				setError("");
			})
			.catch((error) => {
				setLoading(false);
				
			});
  }

  const nextData = () => {
    if (nextPageUrl === null) {
      return;
    } else {
      Axios.get(nextPageUrl, {
        headers: {
          Authorization: props.route.params.token !== undefined ? `Bearer ${props.route.params.token}` : 'hfh',
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

  useEffect(() => {
    load()
  }, [props.route.params.find])
  return (
    <View>
      <Header token={props.route.params.token} country={props.route.params.country} find={props.route.params.find} {...props} />
      <View>
      {loading && (
        <View style={{ height: Dimensions.get('window').height}}>
          <Preloader />
        </View>
      )}
      </View>
      
      <View>
      {!loading && productsData.length < 1 && (
        <View style={{height: Dimensions.get('window').height, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No Ad</Text>
        </View>
      )}
        <View >
          <View>
            <Text style={{color: 'gray', fontSize: 14, paddingHorizontal: 10}}>
              {props.route.params.find}
            </Text>
          </View>
          <FlatList
              data={productsData}
              onEndReached={nextData}
              keyExtractor={(item) => item.slug}
              onEndReachedThreshold={100}
              renderItem={({ item, index }) => (
                  <ProductList
                  data={productsData}
                  token={props.route.params.token}
                  item={item}
                  key={item.slug}
                  {...props}
                  />
              )}
            />
        </View>
      </View>
      <ScrollView>
    </ScrollView>
      <Bottom home={true} {...props} />
    </View>
  );
};

export default SearchResult;
