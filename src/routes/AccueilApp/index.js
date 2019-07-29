import React, { Component } from "react";
import { View, Image} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Button, H3, Text } from "native-base";
import { Actions } from "react-native-router-flux";
import styles from "../styles";

const launchscreenLogo = require("../../../assets/logo.png");

class Accueil extends Component {

  componentDidMount(){
    this.loadInitialState()
    .done();
  }

loadInitialState = async () => {
    let mobile = await AsyncStorage.getItem('mobile');
    let userDetails = await AsyncStorage.getItem('userDetails');
    let token = await AsyncStorage.getItem('token');
    let driver = await AsyncStorage.getItem('token_driver');
    let mobile_driver = await AsyncStorage.getItem('mobile_driver');
    
    if(token !== null){
        Actions.home();
        
    }
    if(driver !== null && mobile_driver !== null){
      Actions.driver();
    }

}
render(){
  return(
    <Container>
      
      <View style={styles.logoContainer}>
        <Image source={launchscreenLogo} style={styles.logo}/>
      </View>
        {/* <ImageBackground source={launchscreenBg} style={styles.imageContainer}> */} 
      <View style={{alignItems:"center",}}>
        <H3 style={styles.textAccueil}>Welcome to orangecabs</H3>
      </View>
      
      <View
        style={{
          alignItems: "center",
          marginBottom: 50,
          backgroundColor: "transparent"
        }}
      >

      <View style={{ marginTop: 0 }} />
        <H3 style={styles.textAccueil}>Taking pride in our rides...</H3>
      <View style={{ marginTop: 8 }} />

      </View>

      <View style={{ marginBottom: 40 ,}}>
        <Button
          style={[styles.buttonRiderDriver,{backgroundColor: "#11A0DC"}]}
          onPress={() => Actions.logrider()}
        >
          <Text style={[styles.textAccueil,{color:"#fff"}]}>Sign In Rider</Text>
        </Button>
      </View>
      <View style={{ marginBottom: 80 }}>
        <Button
          style={[styles.buttonRiderDriver,{ backgroundColor: "#F89D29"}]}
          onPress={() => Actions.logdriver()}
        >
          <Text style={[styles.textAccueil,{color:"#fff"}]}>Sign In Driver</Text>
        </Button>
      </View>

       </Container>
  );
}
}

export default Accueil;
