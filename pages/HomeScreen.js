import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  BackHandler,
  ToastAndroid,
  Button,
  Dimensions,
} from "react-native";
import Constants from "expo-constants";
import firebase, { firestore } from "firebase";
import Keyword from "./Keyword";

/**
 * Component for displaying the home screen
 * @component
 * @param {Object} navigation prop passed from navigator
 */
const screenHeight = Dimensions.get("window").height;

const HomeScreen = ({ navigation }) => {
  const [dataSource, setDataSource] = useState([]);
  const [backClickCount, setBackClickCount] = useState(0);
  const [loading, setLoading] = useState(true); // for data
  const ref = firestore().collection("test");
  const makeRemoteRequest = () => {
    return ref.onSnapshot((querySnapshot) => {
      const restaurants = [];
      querySnapshot.forEach((doc) => {
        const { name, rating, type, thumbnail, address } = doc.data().d;
        restaurants.push({
          id: doc.id,
          name,
          rating,
          type,
          thumbnail,
          address,
        });
      });
      setDataSource(restaurants);
      if (loading) {
        setLoading(false);
      }
    });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("Restaurant", {
            id: item.id,
            ref: ref,
          });
        }}
      >
        <View style={[styles.imageCard, styles.shadow]}>
          <Image style={styles.thumbnail} source={{ uri: item.thumbnail }} />
          <View style={{ position: "absolute", marginTop: 10, right: 5 }}>
            <Keyword keywords={item.type} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <View>
              <Text style={styles.restaurantTitleText}>{item.name}</Text>
              <Text>{item.address.address_depth2}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: 25,
                  height: 25,
                  marginTop: 19,
                  marginRight: 10,
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={require("../assets/icons/heart.png")}
                />
              </View>
              <View style={[styles.restaurantRating, styles.shadow]}>
                <Text style={styles.restaurantRatingText}>{item.rating}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  useEffect(() => {
    makeRemoteRequest();
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [backClickCount]);

  backButtonEffect = () => {
    if (navigation.isFocused()) {
      ToastAndroid.show("Press Back again to Exit", ToastAndroid.SHORT);
      setBackClickCount(1);
      console.log(backClickCount);
      setTimeout(function () {
        setBackClickCount(0);
      }, 1000);
    } else {
      console.log("go Back");
      navigation.pop();
    }
  };

  const handleBackButton = () => {
    console.log(`backclick: ${backClickCount}`);
    backClickCount == 1 ? BackHandler.exitApp() : backButtonEffect();
    return true;
  };

  onSignOut = () => {
    firebase.auth().signOut();
    navigation.navigate("Loading");
  };

  firebase.auth().onAuthStateChanged((user) => {
    if (user === null) {
      navigation.navigate("Loading");
    }
  });

  const listHeader = () => {
    return (
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>
            <Text style={{ color: "#FF4D12" }}>V</Text>'s Pick
          </Text>
        </View>
        <View style={[styles.vsPick, styles.shadow]}>
          <Image
            source={require("../assets/images/vspick_sample.png")}
            resizemode="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View style={styles.titleContainer2}>
          <Text style={styles.pageTitle}>
            <Text style={{ color: "#FF4D12" }}>A</Text>round You
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={dataSource}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        // initialNumToRender={2}
        // maxToRenderPerBatch={2}
        scrollEnabled={true}
        ListHeaderComponent={listHeader()}
        showsVerticalScrollIndicator={false}
        //onRefresh={this.handleRefresh}
        //refreshing={this.state.refreshing}
        //onEndReachedThreshold={10000000}
      />
    </View>
  );
};
export default HomeScreen;

const elevationShadowStyle = (elevation) => {
  return {
    elevation,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0.5 * elevation },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
};

const styles = StyleSheet.create({
  shadow: elevationShadowStyle(6),
  vsPick: {
    height: 330,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "white",
    justifyContent: "center",
    borderRadius: 8,
  },
  titleContainer: {
    height: 50,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingLeft: 20,
    marginTop: 10,
  },
  titleContainer2: {
    flex: 0,
    flexDirection: "row",
    width: "100%",
    paddingTop: 20,
    justifyContent: "space-between",
    paddingLeft: 20,
  },
  pageTitle: {
    fontFamily: "Roboto-Light",
    fontSize: 35,
    alignSelf: "flex-end",
    marginBottom: 5,
  },
  thumbnail: {
    //flex: 1,
    width: null,
    height: 170,
    resizeMode: "cover",
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  imageCard: {
    flex: 1,
    height: 235,
    marginHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "visible",
  },
  screenContainer: {
    backgroundColor: "white",
    borderTopColor: "#FF4D12",
    borderTopWidth: Constants.statusBarHeight,
    paddingTop: 10,
  },
  restaurantRatingText: {
    fontSize: 20,
    fontFamily: "Roboto-Medium",
    color: "#FFF",
  },
  restaurantTitleText: {
    fontSize: 20,
    fontFamily: "Roboto-Medium",
    paddingTop: 5,
    paddingBottom: 2,
  },
  restaurantRating: {
    backgroundColor: "#FF4D12",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    marginVertical: 15,
    height: 30,
    justifyContent: "center",
  },
});
