import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Appbar, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/AntDesign";

export default function Header(props) {
  return (
    <View>
      <Appbar.Header style={styles.bg}>
        <View style={{ marginLeft: 20 }}>
          <Button color="#ffa500" mode="outlined">
            <Text style={styles.text}>country</Text>
          </Button>
        </View>
        <View style={{ flex: 1, marginLeft: 20, flexDirection: "row-reverse" }}>
          {!props.home && (
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Filter", {find: props.find, country: props.country, token: props.token})}
            >
              <Icon name="filter" size={35} color="white" />
            </TouchableOpacity>
          )}
          <View style={{ marginRight: 20 }}>
            <Button color="#ffa500" mode="outlined" style={styles.btn}>
              <Text style={styles.text}>EN</Text>
            </Button>
          </View>
        </View>
      </Appbar.Header>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: "#76ba1b",
  },
  btn: {
    backgroundColor: "#ffa500",
  },
  text: {
    fontSize: 10,
    color: "white",
    fontWeight: "700",
  },
});
