import React from 'react';
import {
    Text, 
    View,
    ScrollView,
    Alert,
    Dimensions,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { TextInput} from 'react-native-paper';
import styles from '../../styles';
import { Actions } from 'react-native-router-flux';
import { getUrl} from "../../config";
import moment from 'moment';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class ForgotPassword extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        userMobile: '',
        isLoading: false,
      };
  }

  componentDidMount(){
    this.loadInitialState()
    .done();
}

loadInitialState = async () => {
    let mobile = await AsyncStorage.getItem('mobile');
    let username = await AsyncStorage.getItem('username');
    let token = await AsyncStorage.getItem('token');
    this.setState({username:username});
    if(token !== null){
        Actions.home();
    }
}

  onChanged(text){
      let newText = '';
      let numbers = '0123456789';

      for (var i=0; i < text.length; i++) {
          
          if(numbers.indexOf(text[i]) > -1 ) {
              newText = newText + text[i];
          }
          else {
              alert("please enter numbers only");
          }
      }
      this.setState({ userMobile: newText });
  };

    render(){
        return(

                <View style={styles.container}>
                  <StatusBar 
          backgroundColor="#11A0DC"
          barStyle="light-content"
          />
                <ScrollView>

            <View style={{height: deviceHeight, width: deviceWidth, alignItems: 'center', justifyContent: 'center'}}>

              <View style={styles.imageContainer}>
                <Image
                  resizeMode="contain"
                  source={require('../../../../assets/logo.png')}
                  style={styles.image}
                />
              </View>

              <View>
                  <Text style={[styles.buttonTextSignupw, {color: '#6D6E70'}]}>Reset Password step 1</Text>
              </View>

              <View style={styles.formContainer}>
                <TextInput
                    style={[styles.textInputStyle]}
                    label="mobile number"
                    underlineColor="#11A0DC"
                    mode="flat"
                    returnKeyType= "go"
                    autoCapitalize= "none"
                    keyboardType='numeric'
                    maxLength={10} 
                    editable="true" 
                    onChangeText={(text)=> this.onChanged(text)}
                    value={this.state.userMobile}
                    theme={{ colors: { placeholder: '#777', text: '#333', primary: '#11A0DC',underlineColor:'#11A0DC',background : '#fff'}}}
                />

                <TouchableOpacity style={styles.button}
                  underlayColor="transparent"
                  onPress={() => this._submit()}
                  opacity="0.6"
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                  { this.state.isLoading == true &&
                          
                          <ActivityIndicator 
                              animating={this.state.isLoading} 
                              size="large"
                              color="#F89D29"
                          />

                      }

                <TouchableOpacity style={styles.buttonSignup}
                    underlayColor={'transparent'}
                    onPress={() => Actions.logrider()}
                    opacity="0.6"
                >
                  <Text style={[styles.buttonTextSignup, {color: '#6D6E70'}]}>Have account already? Click here</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonSignup}
                    underlayColor={'transparent'}
                    onPress={() => Actions.accueil()}
                    opacity="0.6"
                >
                  <Text style={[styles.buttonTextSignup, {color: '#6D6E70'}]}>Go Back</Text>
                </TouchableOpacity>
                
                <View style={styles.viewTextRights}>
                  <Text style={styles.textRights}>© {moment().format('YYYY')} All Rights Reserved | Orangecabs</Text>
                </View>
                
              </View>
              
            </View>
          </ScrollView>
      </View>

        );
    }


    _submit = async () => {
      this.setState({isLoading:true});
        const {userMobile} = this.state;

      if (userMobile == '') {
        this.setState({isLoading:false});
        Alert.alert('Failed', 'mobile number is required'),[
          {text: 'Okay'},
        ];
        return;
      }

      if(userMobile.length !== 10){
        this.setState({isLoading:false});
          Alert.alert('Failed',"Mobile number must contain 10 numbers"),[
              {text: 'Okay'},
              ];
          return;
      }

      try {
        await fetch(`${getUrl}verifynumberapp.php`,{
            method: "POST",
            headers:{
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body:JSON.stringify({
                mobile: userMobile,
            })
  
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson === 'ok'){
              setTimeout(() => {
                this.setState({isLoading:false});
                Alert.alert('Succes',"Your number is verified"),[{text: 'Okay'}];
                AsyncStorage.setItem('mobile',userMobile);
                Actions.resetpass();
              }, 2000);
            }
            else{
              Alert.alert('Failed',JSON.stringify(responseJson)),[{text: 'Okay'}];
            }
        })
        .catch((error)=>{
            console.log(error);
        });
      } catch (error) {
          console.log(error);
      }
  }
}

export default ForgotPassword;


