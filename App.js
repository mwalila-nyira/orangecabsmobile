// import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import Root from './src/main';
import { View, StyleSheet,StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

export default class App extends React.Component{
  
  componentDidMount(){
    SplashScreen.hide();
  }

  render(){
    return(
      <View style={styles.container}>
        <StatusBar 
          backgroundColor="#11A0DC"
          // iosBarStyle="light-content"
          barStyle="light-content"
        />
        <Root {...this.props} />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#11A0DC"
  }

});