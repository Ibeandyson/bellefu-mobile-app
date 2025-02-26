import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProductDetail from "./components/guest/ProductDetail";
import SearchResult from "./components/guest/SearchResult";
import DashboardNav from "./components/navigations/DashboardNav";
import FillterForm from "./components/guest/FitterForm";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import AdTable from "./components/user/AdTable";
import PendingAd from "./components/user/PendingAd";
import ExpiredAd from "./components/user/ExpiredAd";
import FavouriteAd from "./components/user/FavouriteAd";
import Verification from "./components/user/Verification";
import PostAd from "./components/user/PostAd";
import Landing from "./components/guest/Landing";
import Dashboard from "./components/user/Dashboard";
import UpdateProfile from "./components/user/UpadateProfile"
import SettingsNav from "./components/navigations/SettingsNav"
import PostAdPayment from "./components/user/PostAdPayment"
import EditAd from "./components/user/EditAd"
import Messenger from "./components/guest/Messenger"
import Chat from "./components/guest/Chat"

import { Provider } from "react-redux";
import store from "./store";
import withAuth from "./withAuth";
import SubcategoryListing from "./components/guest/SubcategoryListing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WelcomeScreen from "./components/guest/WelcomeScreen";
import Splash from "./components/user/Splash";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#76ba1b",
  },
};

var bar_bgcolor = "#76ba1b";

const Stack = createStackNavigator();

export default function App(props) {
  const [token, setToken] = useState("initial")

  const getToken = async () => {
    let token = await AsyncStorage.getItem("user")
    setToken(token)
  }

  useEffect(() => {
    getToken()
  }, [])

  return (
    <View style={styles.container}>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Landing"
              screenOptions={{
                elevation: 0,
                gestureEnabled: true,
                headerStyle: { backgroundColor: "#76ba1b" },

                headerTintColor: "white",
                headerTitleStyle: { fontWeight: "bold", fontSize: 14 },
              }}
            >
              
              <Stack.Screen
                name="Landing"
                options={{ headerShown: false }}
                component={token === 'initial' ? Splash : token === null || token === undefined ? WelcomeScreen : Landing}
              />
              <Stack.Screen
                name="Home"
                options={{ headerShown: false }}
                component={Landing}
              />
              <Stack.Screen
                name="Subcategory"
                options={{ headerShown: true }}
                component={SubcategoryListing}
              />

              <Stack.Screen
                name="Detail"
                options={{ headerShown: true }}
                component={ProductDetail}
              />
              <Stack.Screen
                name="Filter"
                options={{ headerShown: true }}
                component={FillterForm}
              />
              <Stack.Screen
                name="Login"
                options={{ headerShown: false }}
                component={Login}
              />
              <Stack.Screen
                name="Signup"
                options={{ headerShown: false }}
                component={Registration}
              />
              <Stack.Screen
                name="Search"
                options={{ headerShown: false }}
                component={SearchResult}
              />
              <Stack.Screen
                {...props}
                name="Favourite"
                options={{ headerShown: true }}
                component={withAuth(FavouriteAd)}
              />
              <Stack.Screen
                name="Post"
                options={{ headerShown: true }}
                component={withAuth(PostAd)}
              />
              <Stack.Screen
                name="Messenger"
                options={{ headerShown: true }}
                component={withAuth(Messenger)}
              />
               <Stack.Screen
                name="chat"
                options={{ headerShown: true }}
                component={Chat}
              />
              <Stack.Screen
                name="Account"
                options={{ headerShown: true }}
                component={DashboardNav}
              />
              <Stack.Screen
                name="Dashboard"
                options={{ headerShown: true }}
                component={withAuth(Dashboard)}
              />
              <Stack.Screen
                name="Ads"
                options={{ headerShown: true }}
                component={withAuth(AdTable)}
              />
              <Stack.Screen
                name="Pending"
                options={{ headerShown: true }}
                component={withAuth(PendingAd)}
              />
              <Stack.Screen
                name="Expired"
                options={{ headerShown: true }}
                component={withAuth(ExpiredAd)}
              />
              <Stack.Screen
                name="Verification"
                options={{ headerShown: true }}
                component={withAuth(Verification)}
              />
               <Stack.Screen
                name="Update"
                options={{ headerShown: true }}
                component={withAuth(UpdateProfile)}
              />
               <Stack.Screen
                name="Payment"
                options={{ headerShown: true }}
                component={withAuth(PostAdPayment)}
              />
              <Stack.Screen
                name="Edit"
                options={{ headerShown: true }}
                component={withAuth(EditAd)}
              />
               <Stack.Screen
                name="Settings"
                options={{ headerShown: true }}
                component={withAuth(SettingsNav)}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>

        <StatusBar style="light" backgroundColor={bar_bgcolor} />
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
  },
});
