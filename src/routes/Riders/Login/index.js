import React from 'react';
import {Container} from 'native-base';
import {
    Text, 
    View,
    ScrollView,
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    TouchableOpacity,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import styles from '../../styles';
import { sha256 } from 'react-native-sha256';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import { getUrl } from "../../config";
import moment from 'moment';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class LoginRider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userMobile: '',
            userPassword: '',
            username:'',
            token:'',
            rider:'Rider',
            isLoading:false,
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
        
        let mobile = await AsyncStorage.getItem('mobile');
        
        let token = await AsyncStorage.getItem('token');
        let username = await AsyncStorage.getItem('username');
        
        this.setState({username:username});
        
        if(token !== null && mobile!== null){
            // this.props.navigation.navigate("Bookings");
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

    // first letter in word in uppercase
    Capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
  
    render(){
        return(
            <View style={[styles.container,{margin:"auto"}]}>
            <ScrollView>
                <KeyboardAvoidingView>
                <View 
                    // style={}
                >
    
                <View style={styles.imageContainer}>
                    <Image
                    resizeMode="contain"
                    source={require('../../../../assets/logo.png')}
                    style={styles.image}
                    />
                </View>

                <View style={{alignItems:'center',justifyContent:'center'}}>
                    <Text style={[styles.buttonTextSignupw, {color: '#6D6E70'}]}>Welcome back {this.state.username ? this.Capitalize(this.state.username):this.state.rider}!</Text>
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
                        onChangeText={(text)=> this.onChanged(text)}
                        editable="true"
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
    
                    <TouchableOpacity 
                        style={styles.button}
                        opacity="0.6"
                        underlayColor="transparent"
                        onPress={() => this._login()}
                    >
                        <Text style={styles.buttonText}>Log In</Text>
                        
                    </TouchableOpacity>
                        { this.state.isLoading == true &&
                        
                            <ActivityIndicator 
                                animating={this.state.isLoading} 
                                size="large"
                                color="#F89D29"
                            />
                            
                        // ):null
                        }
    
                    <TouchableOpacity 
                        style={styles.buttonSignup}
                        opacity="0.6"
                        underlayColor={'transparent'}
                        onPress={() => Actions.forgotpassword()}
                    >
                        <Text style={[styles.buttonTextSignup, {color: '#6D6E70'}]}>Forgot Password?</Text>
                    </TouchableOpacity>
    
                    <TouchableOpacity 
                        style={styles.buttonSignup}
                        opacity="0.6"
                        underlayColor={'transparent'}
                        onPress={() => Actions.signup()}
                    >
                        <Text style={[styles.buttonTextSignup, {color: '#6D6E70'}]}>Don't have account? Click here</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.buttonSignup}
                        opacity="0.6"
                        underlayColor={'transparent'}
                        onPress={() => Actions.accueil()}
                    >
                        <Text style={[styles.buttonTextSignup, {color: '#6D6E70'}]}>Go Back</Text>
                    </TouchableOpacity>
                 
                </View>
                
              </View>
                <View style={styles.viewTextRights}>
                    <Text style={styles.textRights}>© {moment().format('YYYY')} All Rights Reserved | Orangecabs</Text>
                </View>
                </KeyboardAvoidingView>
                
            </ScrollView>
                
            </View>

        );
    };

    _login = async () => {
        
       this.setState({isLoading:true});
       
        const {userMobile,userPassword,token} = this.state;
        // alert(token);
        if (userMobile == '') {
            
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
            await fetch(`${getUrl}loginapp.php`, {
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
                        AsyncStorage.setItem('token',token);
                        AsyncStorage.setItem('mobile',userMobile);
                        Actions.home();
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

export default LoginRider;



