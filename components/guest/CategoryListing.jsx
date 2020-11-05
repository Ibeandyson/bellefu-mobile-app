import React, {useState, useEffect}  from 'react';
import {View, Text, Image} from 'react-native';
import {Card} from 'react-native-paper';
import axios from 'axios';

export default function CategoryListing() {
    const [categoryData, setCategoryData] = useState([]);
   
	const loadCategory = () => {
		axios
			.get("https://bellefu.com/api/category/list", {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				}
			})
			.then((res) => {
				setCategoryData(res.data.categories);
				//    setError("");
			})
			.catch((error) => {
				//    setError("Something went worng");
				console.log(error);
			});
	};
	useEffect(() => {
		loadCategory();
	}, []);
	
    return (
        <View>
            <View
                style={{
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    maxWidth: 500,
                    justifyContent: 'center'
                }}>
                  {categoryData && categoryData.map((data) => (  
                    <Card key={data.slug} style={{width: 114, margin: 3, height: 100}}>
                        <View style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
                            <Image style={{height: 30, width: 30, padding: 20}} source={{uri: `https://bellefu.com/images/categories/${data.image}`}} />
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 9,paddingTop:10 , alignSelf: "center", textAlign: 'center'}}>{data.name}</Text>
                    </View>
                    
                        </View>
                    </Card>
                	))}
            </View>
        </View>
    );
}
