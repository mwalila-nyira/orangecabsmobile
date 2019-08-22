// import {createStackNavigator, createAppContainer} from 'react-navigation';
import React from 'react';
import Root from './src/main';
import { View, StyleSheet,StatusBar ,Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

// if (Platform.OS === 'android') {
//   if (typeof Symbol === 'undefined') {
//     if (Array.prototype['@@iterator'] === undefined) {
//       Array.prototype['@@iterator'] = function() {
//         let i = 0;
//         return {
//           next: () => ({
//             done: i >= this.length,
//             value: this[i++],
//           }),
//         };
//       };
//     }
//   }
// }
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