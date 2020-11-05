import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Card, Paragraph, Button, Portal, Modal } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Icon from "react-native-vector-icons/AntDesign";
import NumberFormat from "react-number-format";
import { Linking } from "react-native";
import Axios from "axios";
import ContactModal from "../reusableComponents/ContactModal";

export default function ProductList(props) {
  //FOR CONTACT MODAL
  const [visible, setVisible] = React.useState(false);
  const [convert, setConvert] = React.useState(false);
  const [lastItem, setLastItem] = React.useState(props.data.slice(-1));
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [isRed, setIsRed] = React.useState(
    props.token ? (props.item.is_user_favourite ? true : false) : false
  );

  const toggleFav = (e, product_slug, isFav, color) => {
    if (props.token === undefined) {
      props.navigation.navigate("Login");
    } else {
      setIsRed(!isRed);
      Axios.get(
        `https://bellefu.com/api/user/product/favourite/${
          isFav ? "remove" : "add"
        }/${product_slug}`,
        {
          headers: {
            Authorization:
              props.token !== undefined ? `Bearer ${props.token}` : "hfh",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const shareToWhatsAppWithContact = (text, phoneNumber) => {
    Linking.openURL(`whatsapp://send?text=${text}&phone=${phoneNumber}`);
  };

  const openPhone = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View
      style={{ marginBottom: lastItem[0].slug === props.item.slug ? 160 : 0 }}
    >
      {/* CARD FOR PRODUCT LISTING START HERE */}
      <Card style={{ marginBottom: 5, borderRadius: 0, marginHorizontal: 8 }}>
        <View style={styles.img}>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("Detail", { item: props.item })
            }
          >
            <Image
              resizeMode="cover"
              style={{ height: 110, width: 150, minHeight: 100 }}
              source={{
                uri: `https://bellefu.com/images/products/${props.item.slug}/${props.item.images[0]}`,
              }}
            />
          </TouchableOpacity>
          <View style={styles.writUp}>
            <Paragraph
              style={styles.title}
              ellipsizeMode="tail"
              numberOfLines={2}
            >
              {props.item.title}
            </Paragraph>
            <View
              style={{
                flexDirection: "row",
                marginTop: 4,
                alignItems: "center",
              }}
            >
              <View style={{ marginLeft: 20 }}>
                <SimpleLineIcons
                  name="location-pin"
                  size={12}
                  color="#666968"
                />
              </View>
              <Paragraph style={{ paddingLeft: 5, fontSize: 11 }}>
                <Text style={{ color: "#666968" }}>{props.item.address}</Text>
              </Paragraph>
            </View>
            <View
              style={[styles.icons, { alignItems: "center", marginTop: 7 }]}
            >
              <Paragraph style={styles.price}>
                {!convert ? (
                  <NumberFormat
                    value={props.item.price}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={props.item.currency_symbol.toString()}
                    renderText={(formattedValue) => (
                      <Text style={{ color: "#76ba1b", fontWeight: "900" }}>
                        {formattedValue}
                      </Text>
                    )} // <--- Don't forget this!
                  />
                ) : (
                  <NumberFormat
                    value={props.item.alt_price_info.alt_price}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={props.item.alt_price_info.alt_symbol.toString()}
                    renderText={(formattedValue) => (
                      <Text style={{ color: "#76ba1b", fontWeight: "900" }}>
                        {formattedValue}
                      </Text>
                    )} // <--- Don't forget this!
                  />
                )}
              </Paragraph>
              {props.item.alt_price_info && (
                <TouchableOpacity onPress={() => setConvert(!convert)}>
                  <View style={{ marginLeft: 10 }}>
                    <AntDesign name="swap" size={30} color="#ffa500" />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={styles.contact}>
          <View style={{ paddingLeft: 10 }}>
            <Button mode="contained" color="#76BA1A" style={{ width: 140 }}>
              <Fontisto name="hipchat" size={13} color="white" />
              <Text style={{ color: "white", fontSize: 12, paddingLeft: 60 }}>
                Chat
              </Text>
            </Button>
          </View>
          <View style={{ paddingLeft: 10 }}>
            <Button
              mode="contained"
              color="#ffa500"
              style={{ width: 140 }}
              onPress={showModal}
            >
              <Fontisto name="phone" size={13} color="white" />
              <Text style={{ color: "white", fontSize: 12 }}>contact</Text>
            </Button>
          </View>
          <View style={{ marginLeft: 10, alignSelf: "center" }}>
            <TouchableOpacity
              onPress={(e) =>
                toggleFav(e, props.item.slug, props.item.is_user_favourite)
              }
            >
              <MaterialCommunityIcons
                name="heart"
                size={25}
                color={isRed ? "#eb4034" : "#ffa500"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
      {/* MODAL TO SHOW CONACT DETAILS */}
      <ContactModal
        visible={visible}
        hideModal={hideModal}
        phone={props.item.phone}
        shareToWhatsAppWithContact={shareToWhatsAppWithContact}
        openPhone={openPhone}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  my_card: {
    marginTop: 29,
  },
  img: {
    flexDirection: "row",
    padding: 10,
  },
  title: {
    fontSize: 12,
    paddingLeft: 20,
    fontWeight: "600",
    marginTop: -10,
    width: 150,
  },
  price: {
    fontSize: 16,
    paddingLeft: 15,
  },
  icons: {
    flexDirection: "row",
    marginTop: -8,
  },
  like: {
    paddingLeft: 100,
    paddingTop: 5,
    color: "#ffa500",
  },
  contact: {
    paddingBottom: 10,
    flexDirection: "row",
    marginTop: 5,
  },
  writUp: {
    flexDirection: "column",
    paddingVertical: 10,
  },
});
