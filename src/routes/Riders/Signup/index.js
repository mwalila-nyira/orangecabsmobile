import React from 'react';
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
import { TextInput} from 'react-native-paper';
import styles from '../../styles';
import AsyncStorage from '@react-native-community/async-storage';
import { sha256 } from 'react-native-sha256';
import { Actions } from 'react-native-router-flux';
import { getUrl } from "../../config";
import moment from 'moment';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class Signup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName:'',
            userMobile:'',
            userEmail:'',
            userPassword:'',
            userConfirmPassword:'',
            jwt:'',
            isLoading: false,
        };
    }

    componentDidMount(){
        this._loadInitialState().done();
        if(this.state.userMobile){
            sha256(this.state.userMobile).then( hash => {
                // console.log(hash);
                // alert(hash);
                this.setState({
                    jwt:hash
                });
            })
        }

    }

    _loadInitialState = async () => {
        // var value = await AsyncStorage.getItem('user');
        var token = await AsyncStorage.getItem('token');
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
                        <Text style={[styles.buttonTextSignupw, {color: '#6D6E70'}]}>Sign Up Rider to Orangecabs!</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <TextInput
                            style={[styles.textInputStyle,{marginTop: 10}]}
                            label="Full name"
                            mode="flat"
                            underlineColor="#11A0DC"
                            returnKeyType= {'next'}
                            autoCapitalize= "none"
                            editable= 'true'
                            autoCorrect= {false}
                            onChangeText={(userName) => this.setState({userName})}
                            value={this.state.userName}
                            theme={{ colors: { placeholder: '#777', text: '#333', primary: '#11A0DC',underlineColor:'#11A0DC',background : '#fff'}}}
                        />

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
                            label="e.g: abc@example.com"
                            mode="flat"
                            returnKeyType= {'next'}
                            autoCapitalize= "none"
                            autoCorrect= {false}
                            underlineColor="#11A0DC"
                            onChangeText={(userEmail) => this.setState({userEmail})}
                            editable="true"
                            value={this.state.userEmail}
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
                            onPress={() => this._signup()}
                        >
                        <Text style={styles.buttonText}>Sign Up</Text>
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
                       
                    </View>
                    
                </View>
                 
                <View style={styles.viewTextRights}>
                    <Text style={styles.textRights}>© {moment().format('YYYY')} All Rights Reserved | Orangecabs</Text>
                </View>
                
                </KeyboardAvoidingView>
            </ScrollView>
           
        </View>

        );
    }

    _signup = async () =>{
        
        this.setState({isLoading:true});
        const {userName, userMobile, userEmail, userPassword, userConfirmPassword} = this.state;

        if(userName == ''){
            this.setState({isLoading:false});
            Alert.alert("Failed","Username is required"),[
                {text: 'Okay'},];
                return;
        }
        if (userMobile == '') {
            this.setState({isLoading:false});
          Alert.alert('Failed', 'mobile number is required'),[
            {text: 'Okay'},
          ];
          return;
        }

        if(userEmail == ''){
            this.setState({isLoading:false});
            Alert.alert('Failed',"Email address is required"),[
                {text: 'Okay'},
                ];
                return;
        }

        if(userPassword == '') {
            this.setState({isLoading:false});
          Alert.alert('Failed', 'Password is required'),[
            {text: 'Okay'},
          ];
          return;
        }

        try {
            await fetch(`${getUrl}signupapp.php`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userName,
                mobile: userMobile,
                email: userEmail,
                password: userPassword,
                password2: userConfirmPassword,

            }),
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson === 'ok'){
                      
                   setTimeout(() => {
                    this.setState({isLoading:false});
                        // alert(JSON.stringify(responseJson));
                    Alert.alert('Success','Account created successfully!'),[{text: 'Okay'}];
                    AsyncStorage.setItem('mobile',userMobile);
                    AsyncStorage.setItem('username',userName);
                    Actions.activatepass();
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

export default Signup;


