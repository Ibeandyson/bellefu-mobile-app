import React, { useState, useEffect } from "react";
import Moment from 'react-moment';
import StarRating from 'react-native-star-rating';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Linking,
} from "react-native";
import Carousel, { PaginationLight } from "react-native-x2-carousel";
import { Card, Avatar, Button, Portal, Modal, TextInput, Divider } from "react-native-paper";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import HTML from 'react-native-render-html';
import { WebView } from "react-native-webview";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import Preloader from "../guest/Preloader";
import NumberFormat from "react-number-format";
import ContactModal from "../reusableComponents/ContactModal";
import Axios from "axios";


export default function ProductDetail(props) {
  const [productsDataDetail, setproductsDataDetail] = useState({});
  const [visible, setVisible] = React.useState(false);
  const [visible1, setVisible1] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [profile, setProfile] = useState({});
  const [reportLoading, setReportLoading] = useState(false)
  const [isReportSuccess, setIsReportSuccess] = useState(false)
  const [isReviewSuccess, setIsReviewSuccess] = useState(false)
  const [data, setData] = useState([])
  const [stat, setStat] = useState({})
  const [reportBody, setReportBody] = useState({
		report_title: '',
		report_message: ''
  })
  const [review, setReview] = useState({
    rating: 0.5,
    review: ""
  })
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const showModal = () => setVisible(true);
  const showModal1 = () => setVisible1(true);
  const showModal2 = () => setVisible2(true);

  const onStarRatingPress = (rating) => {
    setReview({
      ...review,
      rating: rating
    })
  }

  const onReviewPress = (text) => {
    setReview({
      ...review,
      review: text
    })
  }


  const hideModal = () => setVisible(false);
  const hideModal1 = () => {
    setVisible1(false);
    setIsReportSuccess(false)
    setReportBody({
      report_title: "",
      report_message: ""
    })
  } 
  const hideModal2 = () => {
    setVisible2(false);
    setReview({
      rating: 0.5,
      review: ""
    })
  } 

  const handleReportTitle = (text) => {
    setReportBody({
      ...reportBody,
      report_title: text
    })
  }
  const handleReportMessage = (text) => {
    setReportBody({
      ...reportBody,
      report_message: text
    })
  }

  const handleReport = (e) => {
		setReportLoading(true)
		if(props.route.params.token === undefined || props.route.params.maxPrice === null) {
			props.navigation.navigate("Login")
		}
		Axios
			.post(`https://bellefu.com/api/user/product/report/${productsDataDetail.slug}`, reportBody, {
				headers: {
					Authorization: `Bearer ${props.route.params.token}`,
					"Content-Type": "application/json",
					Accept: "application/json"
				}
			})
			.then((res) => {
        setReportLoading(false)
        setTimeout(() => {
          setIsReportSuccess(false)
        }, 2500)
			})
			.catch((error) => {
				setReportLoading(false)
			});
	}

  const shareToWhatsAppWithContact = (text, phoneNumber) => {
    Linking.openURL(`whatsapp://send?text=${text}&phone=${phoneNumber}`);
  };

  const openPhone = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const DATA = [];

  const handleCall = (slug) => {
		Axios.get(`https://bellefu.com/api/product/review/list/for/${slug}`)
		.then((res) => {
      setData(res.data.reviews.data)
		})
		
  }
  
  const handleStat = (slug) => {
		Axios.get(`https://bellefu.com/api/product/rating/for/${slug}`)
		.then((res) => {
      setStat(res.data)
      // console.log(res.data)
		}).catch(e => {
      // console.log(e.response)
    })
		
	}

  let url = "https://bellefu.com/api/product/show";

  useEffect(() => {
    axios
      .get(`${url}/${props.route.params.item.slug}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        setProfile(res.data.product.user.profile);
        setproductsDataDetail(res.data.product);
        setLoading(false);
        console.log(res)
        handleCall(res.data.product.slug)
        handleStat(res.data.product.slug)
        for (var i = 0; i < res.data.product.images.length; i++) {
          DATA.push({
            destinationId: `00${i + 1}`,
            uri: `https://bellefu.com/images/products/${res.data.product.slug}/${res.data.product.images[i]}`,
          });
        }
        setImages(DATA);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);

  const renderItem = (data) => (
    <View key={data.destinationId} style={styles.item}>
      <Image style={{ height: 280, width: Dimensions.get('window').width }} source={{ uri: data.uri }} />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && (
        <View style={{ height: "" + 100 + "%" }}>
          <Preloader />
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={{ borderRadius: 0 }}>
          <View style={[styles.img, { marginTop: -10, paddingHorizontal: 50 }]}>
            {images.length > 0 && (
              <Carousel
                pagination={PaginationLight}
                renderItem={renderItem}
                data={images}
              />
            )}
          </View>
          <Text style={styles.title}>{props.route.params.item.title}</Text>
          <View
            style={{ justifyContent: "flex-end", flexDirection: "row-reverse" }}
          >
            <NumberFormat
              value={productsDataDetail.price}
              displayType={"text"}
              thousandSeparator={true}
              prefix={productsDataDetail.currency_symbol}
              renderText={(formattedValue) => (
                <Text style={styles.price}>
                  {formattedValue}
                </Text>
              )}
            />
           
          </View>
        </Card>

        <Card style={{ marginTop: 10, borderRadius: 0, marginHorizontal: 5,  }}>
          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              fontWeight: "bold",
              color: "#76ba1b",
              paddingLeft: 15,
            }}
          >
            PRODUCT DETAILS
          </Text>
          <View style={{ flexDirection: "row", marginTop: 20, width: 260 }}>
            <SimpleLineIcons
              style={{ paddingLeft: 15 }}
              name="location-pin"
              size={16}
              color="#ffa500"
            />
            <Text style={{ opacity: 0.7, fontSize: 13, paddingLeft: 10, color: "#1a1919", }}>Location:</Text>
            <Text style={{ fontSize: 13, paddingLeft: 10, color: "#1a1919" }}>
              {productsDataDetail.address}, {productsDataDetail.country && productsDataDetail.country.name}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <SimpleLineIcons
              style={{ paddingLeft: 15 }}
              name="phone"
              size={16}
              color="#ffa500"
            />
            <Text style={{ opacity: 0.7, fontSize: 13, paddingLeft: 10, color: "#1a1919" }}>Number:</Text>
            <Text style={{ fontSize: 13, paddingLeft: 10, color: "#1a1919" }}>
              {productsDataDetail.phone}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <SimpleLineIcons
              style={{ paddingLeft: 15 }}
              name="clock"
              size={16}
              color="#ffa500"
            />
            <Text style={{ opacity: 0.7, fontSize: 13, paddingLeft: 10, color: "#1a1919" }}>Posted:</Text>
     
              <Moment style={{ fontSize: 13, paddingLeft: 10, color: "#1a1919" }} element={Text} format="MMMM Do, YYYY">
              {productsDataDetail.created_at}
            </Moment>
          </View>
          <View
            style={{ flexDirection: "row", marginTop: 20, marginBottom: 20 }}
          >
            <SimpleLineIcons
              style={{ paddingLeft: 15 }}
              name="eye"
              size={16}
              color="#ffa500"
            />
            <Text style={{ opacity: 0.7, fontSize: 13, paddingLeft: 10, color: "#1a1919" }}>Views:</Text>
            <Text style={{ fontSize: 13, paddingLeft: 10, color: "#1a1919" }}>
              {productsDataDetail.inorganic_views}
            </Text>
          </View>
        </Card>

        <Card style={{ marginTop: 10, borderRadius: 0, marginHorizontal: 5 }}>
          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              fontWeight: "bold",
              color: "#76ba1b",
              paddingLeft: 15,
            }}
          >
            PRODUCT DESCRIPTION
          </Text>
          <View style={{
              fontSize: 13,
              paddingLeft: 15,
              paddingRight: 3,
              marginTop: 10,
              marginBottom: 10,
              fontSize: 15,
            }} >

          <HTML html={props.route.params.item.description} />
            </View>
        </Card>

        <Card style={{ marginTop: 10, borderRadius: 0, marginHorizontal: 5 }}>
          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              fontWeight: "bold",
              color: "#76ba1b",
              paddingLeft: 20,
            }}
          >
            POSTED BY
          </Text>
          <View
            style={{
              marginTop: 20,
              marginBottom: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar.Image
              size={200}
              source={productsDataDetail.user && productsDataDetail.user.avatar !== null ? {uri: `https://bellefu.com/images/users/${productsDataDetail.user.avatar}`} :require("../../images/avater_placeholder.jpg")}
            />

            <Text
              style={{ marginBottom: 10, marginTop: 10, fontWeight: "bold" }}
            >
              {`${profile.first_name}  ${profile.last_name}`}
            </Text>
            <View style={{marginTop: 5, marginBottom: 15, flexDirection: 'row'}}>
              <Text style={{ opacity: 0.7, fontSize: 13, color: "#1a1919" }}>Registered:</Text>
              <Moment style={{ fontSize: 13, color: "#1a1919", paddingLeft: 10}} element={Text} format="MM/D/YYYY">
              {productsDataDetail.user && productsDataDetail.user.created_at}
            </Moment>
            </View>
            <Button mode="outlined" style={{borderColor:"#76ba1b", borderWidth: 1.5 }} onPress={showModal}>
              <Text style={{ color: "#76ba1b", fontSize: 11 }}>Contact Me</Text>
            </Button>
            <Text style={{marginVertical: 5}}>or</Text>
            <View>
              <TextInput
                  style={{width: 300, fontSize: 13}}
                  multiline={true}
                  numberOfLines={3}
                  mode="outlined"
                  label="Type a message"
              />
              
            </View>
            <Button mode="contained" color="#76ba1b" style={{alignSelf: 'flex-start', marginLeft: 41, marginTop: 10 }}>
              <Text style={{ color: "white", fontSize: 11 }}>Begin Chat</Text>
            </Button>
          </View>
        </Card>
        <Card style={{paddingVertical: 20, marginTop: 10, borderRadius: 0, marginHorizontal: 5 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#76ba1b",
              paddingLeft: 15,
            }}
          >
            SAFETY TIPS
          </Text>
          <View style={{
              fontSize: 13,
              paddingLeft: 15,
              paddingRight: 3,
              marginTop: 15,
              marginBottom: 10,
              fontSize: 15,
            }} >
              <View style={{ flexDirection: "row",}}>
                <SimpleLineIcons
                  name="check"
                  size={16}
                  color="#ffa500"
                />
                <Text style={{fontSize: 13, paddingLeft: 10, color: "#1a1919", width: 320 }}>Ensure quality/quantity of Products/Services.</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10}}>
                <SimpleLineIcons
                  name="check"
                  size={16}
                  color="#ffa500"
                />
                <Text style={{fontSize: 13, paddingLeft: 10, color: "#1a1919", width: 320 }}>Ensure meeting in a secured place if the need arise.</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10}}>
                <SimpleLineIcons
                  name="check"
                  size={16}
                  color="#ffa500"
                />
                <Text style={{fontSize: 13, paddingLeft: 10, color: "#1a1919", width: 320 }}>Contact support@bellefu.com if you require verification of buyer or seller (Terms & Conditions apply)</Text>
              </View>
            </View>
            <View style={{ paddingHorizontal: 80, paddingTop: 20 }}>
              <Button onPress={showModal1} mode="outlined" style={{borderColor: 'gray', flexDirection: 'row', justifyContent: "center"}}>
                <SimpleLineIcons
                    name="flag"
                    size={12}
                    color="gray"
                  />
                <Text style={{ color: "gray", fontSize: 13 }}>Report This Ad</Text>
              </Button>
            </View>
        </Card>
        <Card style={{paddingVertical: 20, marginVertical: 10, borderRadius: 0, marginHorizontal: 5 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#76ba1b",
              paddingLeft: 15,
            }}
          >
            Customer Reviews
          </Text>
          <View style={{
              fontSize: 13,
              paddingLeft: 15,
              paddingRight: 3,
              marginTop: 15,
              marginBottom: 10,
              fontSize: 15,
            }} >
              <View style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
              <StarRating
                disabled={true}
                maxStars={5}
                rating={3.5}
                halfStarEnabled={true}
                fullStarColor="#FFB900"
                starSize={19}
              />
                <Text>  4.5 / 5</Text>
              </View>
                <Button onPress={showModal2} mode="contained" color="#76ba1b" style={{alignSelf: 'flex-start', marginTop: 10 }}>
                  <Text style={{ color: "white", fontSize: 11 }}>Review Ad</Text>
                  </Button>
              <Divider style={{marginTop: 15}} />
              <View style={{marginTop: 25}}>
                {data.map((data, index) => (
                  <View key={index} style={{marginTop: 10}}>
                  <View style={{width: 50}}>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={data.rating}
                    halfStarEnabled={true}
                    fullStarColor="#FFB900"
                    starSize={15}
                  />
                  </View>
                  <View style={{marginTop: 5, justifyContent: 'flex-start', flexDirection: 'row'}}>
                    <Text style={{fontSize: 12, opacity: 0.78, color: "#1a1919"}}>By {data.user.profile && `${data.user.profile.first_name} ${data.user.profile.last_name}`}</Text>
                    <Moment style={{ fontSize: 12, color: "#1a1919", opacity: 0.78 }} element={Text} format="MMMM Do, YYYY">
                        {data.created_at}
                      </Moment>
                  </View>
                  <View style={{marginTop: 5}}>
                    <Text style={{color: "#1a1919", fontSize: 13.5}}>{data.message}</Text>
                  </View>
                  <Divider style={{marginTop: 10}} />
                </View>
                ))}
              </View>
            </View>
        </Card>
      </ScrollView>
      <ContactModal
        visible={visible}
        hideModal={hideModal}
        phone={productsDataDetail.phone}
        shareToWhatsAppWithContact={shareToWhatsAppWithContact}
        openPhone={openPhone}
      />

      {/* report ad */}
      <Modal
        animationType="fade"
        visible={visible1}
        style={{ justifyContent: "center", alignItem: "center" }}
      >
        <Card
          style={{
            borderRadius: 0,
            height: 250,
            alignItem: "center",
            paddingVertical: 20,
            alignItems: "center"
          }}
        >
          {isReportSuccess ? (
            <View>
              <SimpleLineIcons
                style={{alignSelf: 'flex-end'}}
                onPress={hideModal1}
                name="close"
                size={25}
                color="gray"
              />
              <View style={{alignItems: 'center', justifyContent: "center", height: 220}}>
              <Text style={{color: "#76BA1A", fontSize: 16,}}>Your report has been received!</Text>
              <SimpleLineIcons
                onPress={hideModal1}
                name="check"
                size={45}
                color="#76BA1A"
              />
            </View>
            </View>
          ) : (
            <View>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <SimpleLineIcons
                onPress={hideModal1}
                name="close"
                size={25}
                color="gray"
              />
          </View>
          <View>
           <TextInput
                  style={{width: 300, fontSize: 13, height: 45}}
                  mode="outlined"
                  label="Title"
                  name="report_title"
                  onChangeText={handleReportTitle}
                  autoFocus={true}
              />
            <TextInput
                  style={{width: 300, fontSize: 13}}
                  multiline={true}
                  numberOfLines={3}
                  mode="outlined"
                  name="report_message"
                  label="Description"
                  onChangeText={handleReportMessage}
              />
              <Button loading={reportLoading} onPress={handleReport} mode="contained" color="gray" style={{marginTop: 10}}>
                <Text style={{ color: "black", fontSize: 13 }}>Submit Report</Text>
              </Button>
          </View>
            </View>
          )
        }
        </Card>
      </Modal>
      {/* review ad */}
      <Modal
        animationType="fade"
        visible={visible2}
        style={{ justifyContent: "center", alignItem: "center" }}
      >
        <Card
          style={{
            borderRadius: 0,
            height: 250,
            alignItem: "center",
            paddingVertical: 20,
            alignItems: "center"
          }}
        >
          {isReviewSuccess ? (
            <View>
              <SimpleLineIcons
                style={{alignSelf: 'flex-end'}}
                onPress={hideModal1}
                name="close"
                size={25}
                color="gray"
              />
              <View style={{alignItems: 'center', justifyContent: "center", height: 220}}>
              <Text style={{color: "#76BA1A", fontSize: 16,}}>Your report has been received!</Text>
              <SimpleLineIcons
                onPress={hideModal2}
                name="check"
                size={45}
                color="#76BA1A"
              />
            </View>
            </View>
          ) : (
            <View>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <SimpleLineIcons
                onPress={hideModal2}
                name="close"
                size={25}
                color="gray"
              />
          </View>
          <View>
            <View style={{width: 100}}>
            <StarRating
                disabled={false}
                maxStars={5}
                rating={review.rating}
                halfStarEnabled={true}
                fullStarColor="#FFB900"
                starSize={35}
                selectedStar={(rating) => onStarRatingPress(rating)}
              />
            </View>
            <TextInput
                  style={{width: 300, fontSize: 11}}
                  multiline={true}
                  numberOfLines={3}
                  mode="outlined"
                  name="review"
                  label="How was your experience with this seller"
                  onChangeText={onReviewPress}
              />
              <Button loading={reportLoading} onPress={handleReport} mode="contained" color="gray" style={{marginTop: 10}}>
                <Text style={{ color: "black", fontSize: 13 }}>Submit Review</Text>
              </Button>
          </View>
            </View>
          )
        }
        </Card>
      </Modal>
    </View>
  );
}

let whatsapp_url = "https://wa.me";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
  },
  title: {
    paddingLeft: 20,
    paddingRight: 3,
    paddingTop: 3,
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1919"
  },
  img: {
    alignItems: "center",
  },
  price: {
    marginLeft: 20,
    fontSize: 17,
    paddingTop: 10,
    color: "#76ba1b",
    paddingBottom: 10,
    fontWeight: "700",
  },
  item: {
    width: 500,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
