import React, { useState, useEffect } from "react";
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
import { Card, Avatar, Button, Portal, Modal } from "react-native-paper";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
// import {Moment} from "react-moment";
import { WebView } from "react-native-webview";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import Preloader from "../guest/Preloader";

export default function ProductDetail(props) {
  const [productsDataDetail, setproductsDataDetail] = useState({});
  const [visible, setVisible] = React.useState(false);
  const [profile, setProfile] = useState({});
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const DATA = [];

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

        for (var i = 0; i < res.data.product.images.length; i++) {
          DATA.push({
            destinationId: `00${i + 1}`,
            uri: `https://bellefu.com/images/products/${res.data.product.slug}/${res.data.product.images[i]}`,
          });
        }
        setImages(DATA);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log(productsDataDetail);
  }, [images]);

  const renderItem = (data) => (
    <View key={data.destinationId} style={styles.item}>
      <Image style={{ height: 280, width: 350 }} source={{ uri: data.uri }} />
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
            <Text style={styles.price}>
              {productsDataDetail.currency_symbol}
              {productsDataDetail.price}
            </Text>
          </View>
        </Card>

        <Card style={{ marginTop: 10, borderRadius: 0 }}>
          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              fontWeight: "bold",
              color: "#76ba1b",
              paddingLeft: 20,
            }}
          >
            PRODUCT DETAILS
          </Text>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <SimpleLineIcons
              style={{ paddingLeft: 20 }}
              name="location-pin"
              size={20}
              color="#ffa500"
            />
            <Text style={{ fontSize: 15, paddingLeft: 10 }}>Location:</Text>
            <Text style={{ fontSize: 13, paddingLeft: 10 }}>
              {productsDataDetail.address}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <SimpleLineIcons
              style={{ paddingLeft: 20 }}
              name="phone"
              size={20}
              color="#ffa500"
            />
            <Text style={{ fontSize: 15, paddingLeft: 10 }}>Number:</Text>
            <Text style={{ fontSize: 13, paddingLeft: 10 }}>
              {productsDataDetail.phone}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <SimpleLineIcons
              style={{ paddingLeft: 20 }}
              name="clock"
              size={20}
              color="#ffa500"
            />
            <Text style={{ fontSize: 15, paddingLeft: 10 }}>Posted:</Text>
            <Text
              
              style={{ fontSize: 13, paddingLeft: 10 }}
            >
              {productsDataDetail.created_at}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", marginTop: 20, marginBottom: 20 }}
          >
            <SimpleLineIcons
              style={{ paddingLeft: 20 }}
              name="eye"
              size={20}
              color="#ffa500"
            />
            <Text style={{ fontSize: 15, paddingLeft: 10 }}>Views:</Text>
            <Text style={{ fontSize: 13, paddingLeft: 10 }}>
              {productsDataDetail.inorganic_views}
            </Text>
          </View>
        </Card>

        <Card style={{ marginTop: 10, borderRadius: 0 }}>
          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              fontWeight: "bold",
              color: "#76ba1b",
              paddingLeft: 20,
            }}
          >
            PRODUCT DESCRIPTION
          </Text>
          <Text
            style={{
              fontSize: 13,
              paddingLeft: 20,
              marginTop: 20,
              marginBottom: 20,
              fontSize: 15,
            }}
          >
            {props.route.params.item.description}
          </Text>
          <WebView
            style={{
              fontSize: 13,
              paddingLeft: 20,
              marginTop: 20,
              marginBottom: 20,
              fontSize: 15,
            }}
            originWhitelist={["*"]}
            source={{ html: "<p>hi</p>" }}
          />
        </Card>

        <Card style={{ marginTop: 10, borderRadius: 0 }}>
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
              source={require("../../images/avater_placeholder.jpg")}
            />

            <Text
              style={{ marginBottom: 10, marginTop: 10, fontWeight: "bold" }}
            >
              {`${profile.first_name}  ${profile.last_name}`}
            </Text>
            <Button mode="contained" color="#ffa500" onPress={showModal}>
              <Text style={{ color: "white" }}>Contact Me</Text>
            </Button>
          </View>
        </Card>
        <View style={{ padding: 50 }}>
          <Button mode="contained" color="#ffa500">
            <Text style={{ color: "white" }}>Report This Ad</Text>
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          style={{ justifyContent: "center", alignItem: "center" }}
        >
          <Card
            style={{
              marginTop: 5,
              borderRadius: 0,
              height: 130,
              alignItem: "center",
            }}
          >
            <View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={{ marginLeft: 20, fontWeight: "bold" }}>Call</Text>
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  style={{ paddingLeft: 2 }}
                  color="#76ba1b"
                />
                <Text style={{ paddingLeft: 60 }}>
                  {productsDataDetail.phone}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 30 }}>
                <Text style={{ marginLeft: 20, fontWeight: "bold" }}>
                  Whatsapp
                </Text>
                <MaterialCommunityIcons
                  name="whatsapp"
                  size={20}
                  style={{ paddingLeft: 2 }}
                  color="#76ba1b"
                />
                <Text
                  style={{ paddingLeft: 20 }}
                  onPress={() => {
                    Linking.openURL(
                      `${whatsapp_url}/${productsDataDetail.phone}?text=Hi%2c+I+got+your+contact+from+bellefu`
                    );
                  }}
                >
                  {productsDataDetail.phone}
                </Text>
              </View>
            </View>
          </Card>
        </Modal>
      </Portal>
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
    paddingTop: 3,
    fontSize: 15,
    fontWeight: "bold",
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
    fontWeight: "bold",
  },
  item: {
    width: 500,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
