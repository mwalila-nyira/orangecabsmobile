import React from 'react';
import {Container} from 'native-base';
import {
    Text, 
    View,
    ScrollView,
    Alert,
    Dimensions,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Keyboard,
    ActivityIndicator
} from 'react-native';

import styles from '../../styles';
import { sha256 } from 'react-native-sha256';
import { TextInput } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import { getUrl } from "../../config";

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class LoginDriver extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userMobile: '',
            userPassword: '',
            username:'',
            token:'',
            driver:'Driver',
            isLoading: false,
        };
    }

    componentDidMount(){
        this.loadInitialState()
        .done();
        // generate token for current user connected the app
        
        if(this.state.userMobile !== null){
            sha256(this.state.userMobile).then( hash => {
                this.setState({token:hash});
                });
        }
    }

    loadInitialState = async () => {
        let mobile = await AsyncStorage.getItem('mobile_driver');
        let token = await AsyncStorage.getItem('token_driver');
        if(token !== null && mobile !== null){
            Actions.driver();
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

    // first letter in word in uppercase
    Capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
  
    render(){
        return(
            <View style={styles.container}>
            <ScrollView>
                <KeyboardAvoidingView>
                <View style={{height: deviceHeight, width: deviceWidth, alignItems: 'center', justifyContent: 'center'}}>
    
                <View style={styles.imageContainer}>
                    <Image
                    resizeMode="contain"
                    source={require('../../../../assets/logo.png')}
                    style={styles.image}
                    />
                </View>
    
                <View>
                    <Text style={[styles.buttonTextSignupw, {color: '#6D6E70'}]}>Welcome back {this.state.username ? this.Capitalize(this.state.username):this.state.driver}!</Text>
                    <Text style={[styles.buttonTextSignupw, {color: '#6D6E70'}]}>Sign In to Orangecabs</Text>
                </View>
    
                <View style={styles.formContainer}>
                    <TextInput
                        style={[styles.textInputStyle, {marginTop: 10}]}
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
                    
                    <TextInput
                        style={[styles.textInputStyle, {marginTop: 10}]}
                        label="Password"
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
    
                    <TouchableOpacity style={styles.button}
                        underlayColor="transparent"
                        onPress={() => this._login()}
                        opacity="0.6"
                    >
                        <Text style={styles.buttonText}>Log In</Text>
                    </TouchableOpacity>
                    {this.state.isLoading == true && <ActivityIndicator size="large" color="#F89D29" />}
                    
                    <TouchableOpacity style={styles.buttonSignup}
                    underlayColor={'transparent'}
                    onPress={() => Actions.accueil()}
                    opacity="0.6"
                    >
                    <Text style={[styles.buttonTextSignup, {color: '#6D6E70'}]}>Go Back</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.viewTextRights}>
                    <Text style={styles.textRights}>© 2018 All Rights Reserved | Orangecabs</Text>
                    </View>
                </View>
                </View>
                </KeyboardAvoidingView>

            </ScrollView>
            </View>

        );
    };

    //login precess
    _login = async () => {
         this.setState({isLoading:true})   
        const {userMobile,userPassword,token} = this.state;
        if (this.state.userMobile == '') { 
            this.setState({isLoading:false});
          Alert.alert('Failed', 'mobile number is required'),[
            {text: 'Okay'},
          ];
          return;
        }
    
        if(userMobile.length !== 10){
            this.setState({isLoading:false});
            alert("Mobile number must contain 10 numbers"),[
                {text: 'Okay'},
                ];
                return;
        }
        
        if (userPassword == '') {
            this.setState({isLoading:false});
          Alert.alert('Failed', 'Password is required'),[
            {text: 'Okay'},
          ];
          return;
        }

        try {
            await fetch(`${getUrl}logindriver.php`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: userMobile,
                    password: userPassword,
                    token: token,
                }),
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson === 'ok'){
                    
                    setTimeout(() => {
                        
                        this.setState({isLoading:false});
                        AsyncStorage.setItem('mobile_driver',userMobile);
                        AsyncStorage.setItem('token_driver',token);
                        Actions.driver();
                    }, 2000);

                }else{
                    this.setState({isLoading:false});
                    Alert.alert('Failed',JSON.stringify(responseJson)),[{text: 'Okay'}];
                }  
            })
            .catch((error) => {
                this.setState({isLoading:false});
                alert("Try later or check your network!");
                console.error(error);
            });
        } catch (error) {
            this.setState({isLoading:false});
            console.log(error);
        }
    }
  
}
export default LoginDriver;



