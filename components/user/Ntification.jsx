// import React from 'react';
// import {View, FlatList} from 'react-native';

// export default function Ntification() {
    
//   const nextData = () => {
//     if (nextPageUrl === null) {
//       return;
//     } else {
//       setLoading1(true)
//       Axios.get(nextPageUrl, {
//         headers: {
//           Authorization: token !== undefined ? `Bearer ${token}` : "hfh",
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//       }).then((res) => {
//         setLoading1(false)
//         setProducts(res.data.products);
//         setNextPageUrl(res.data.products.next_page_url);
//         setProductsData(productsData.concat(...res.data.products.data));
      
//       });
//     }
//   };

//   let url = "https://bellefu.com/api/user/product/list";
//   useEffect(() => {
//       axios
//           .get(url, {
//               headers: {
//                   Authorization: `Bearer ${user.token}`,
//                   "Content-Type": "application/json",
//                   Accept: "application/json"
//               }
//           })
//           .then((res) => {
//               setLoading(false);
//               setProducts(res.data.products)
//               console.log(res.data.products)
//               setAd(res.data.products.data);
//               setNextPageUrl(res.data.products.next_page_url)
//               if(res.data.products.data.length < 1){
//                   setStatus('No Ad')
//               }
//           })
//           .catch((error) => {
//               setStatus('No Ad')
//               setLoading(false);
//               setAd([]);
//           });

//           axios
//           .get("https://bellefu.com/api/user/product/upgrade/fee", {
//               headers: {
//                   Authorization: `Bearer ${user.token}`,
//                   "Content-Type": "application/json",
//                   Accept: "application/json"
//               }
//           })
//           .then((res) => {
//               setFee(res.data)
//               console.log(res)
//           })
//           .catch((error) => {
              
//           });
//   }, []);

//     return (
//         <View>
//             <FlatList
//                 refreshControl={
//                     <RefreshControl progressBackgroundColor="#76BA1A" refreshing={refreshing} onRefresh={onRefresh} />
//                 }
//                 data={productsData}
//                 onEndReached={nextData}
//                 initialNumToRender={15}
//                 keyExtractor={item => item.slug}
//                 onEndReachedThreshold={0.5}
//                 ListHeaderComponent={<LandingPageContet token={token} country={country} {...props} />}
//                 renderItem={({item, index}) => <ProductList token={token} {...props} item={item} key={item.slug} />}
//                 ListFooterComponent={_renderFooter}
//             />
//         </View>
//     );
// }
