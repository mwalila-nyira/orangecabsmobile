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
import { TextInput, } from 'react-native-paper';
import styles from '../../styles';
import { Actions } from 'react-native-router-flux';
import { getUrl} from "../../config";
import moment from 'moment';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class ResetPassword extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        userConfirmPassword: '',
        userPassword:'',
        mobile:'',
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
        this.setState({mobile:mobile});
        if(token !== null){
            Actions.home();
        }
    }

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
                  <Text style={[styles.buttonTextSignupw, {color: '#6D6E70'}]}>Reset Password step 2</Text>
              </View>

              <View style={styles.formContainer}>

                <TextInput
                    style={[styles.textInputStyle, {marginTop: 10}]}
                    label="Choose new Password"
                    mode="flat"
                    underlineColor="#11A0DC"
                    returnKeyType= "go"
                    autoCapitalize= "none"
                    secureTextEntry= {true}
                    editable="true"
                    autoCorrect={false}
                    onChangeText={(userPassword) => this.setState({userPassword})}
                    value={this.state.userPassword}
                    theme={{ colors: { placeholder: '#777', text: '#333', primary: '#11A0DC',underlineColor:'#11A0DC',background : '#fff'}}}
                    />

                <TextInput
                    style={[styles.textInputStyle, {marginTop: 10}]}
                    label="Confirm password"
                    mode="flat"
                    underlineColor="#11A0DC"
                    returnKeyType= "go"
                    autoCapitalize= "none"
                    secureTextEntry= {true}
                    editable="true"
                    autoCorrect={false}
                    onChangeText={(userConfirmPassword) => this.setState({userConfirmPassword})}
                    value={this.state.userConfirmPassword}
                    theme={{ colors: { placeholder: '#777', text: '#333', primary: '#11A0DC',underlineColor:'#11A0DC',background : '#fff'}}}
                />

                <TouchableOpacity style={styles.button}
                  underlayColor="transparent"
                  onPress={() => this._submit()}
                  opacity="0.6"
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                
                {this.state.isLoading == true && 
                  <ActivityIndicator size="large" color="#F89D29" />}

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


    _submit = async () =>{
        this.setState({isLoading:true});
        const {userPassword,userConfirmPassword,mobile} = this.state;

        if(userPassword == '') {
          this.setState({isLoading:false});
            Alert.alert('Failed', 'Password is required'),[
              {text: 'Okay'},
            ];
            return;
        }

        if(userConfirmPassword == '') {
          this.setState({isLoading:false});
            Alert.alert('Failed', 'Confirm your password'),[
            {text: 'Okay'},
            ];
            return;
        }

      await fetch(`${getUrl}resetpasswordapp.php`,{
          method: "POST",
          headers:{
               Accept: 'application/json',
              'Content-type': 'application/json'
          },
          body:JSON.stringify({
              password:userPassword,
              confirmPassword: userConfirmPassword,
              mobile:mobile
          })

      })
      .then((response) => response.json())
      .then((responseJson) => {
          if(responseJson === 'ok'){
            setTimeout(() => {
              this.setState({isLoading:false});
              Alert.alert('Success',"Your password has been changed!"),[{text: 'Okay'}];
              Actions.logrider();
            }, 2000);
              
          }
          else{
            this.setState({isLoading:false});
            Alert.alert('Failed',JSON.stringify(responseJson)),[{text: 'Okay'}];
          }
      })
      .catch((error)=>{
        this.setState({isLoading:false});
          console.log(error);
      })
  }
}

export default ResetPassword;


