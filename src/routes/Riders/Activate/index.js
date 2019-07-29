import React,{Component} from 'react';
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
import { TextInput, } from 'react-native-paper';
import styles from '../../styles';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import { getUrl } from "../../config";
import moment from 'moment';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class Activate extends Component {
  constructor(props) {
    super(props);
    this.state = {
        verifyOpt: Math.floor(Math.random() * 1000) * 90,
        userMobile: '',
        userName:'',
        opt:'',
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
      this.setState({userName:username});
      this.setState({userMobile:mobile});
      // if(mobile !== null){
      //     Actions.activatepass();
      // }
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
        this.setState({ verifyOpt: newText });
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
                source={require("../../../../assets/logo.png")}
                style={styles.image}
                />
            </View>

            <View>
                <Text style={[styles.buttonTextSignupw, {color: '#6D6E70'}]}>Hi {this.Capitalize(this.state.userName)}! Active your Account!</Text>
                <Text style={[styles.buttonTextSignupw, {color: '#d62515'}]}>Your OPT is {this.state.verifyOpt} digits!</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    style={[styles.textInputStyle, {marginTop: 10}]}
                    label="Enter your OPT"
                    underlineColor="#11A0DC"
                    mode="flat"
                    returnKeyType= "go"
                    autoCapitalize= "none"
                    keyboardType='numeric'
                    maxLength={10} 
                    onChangeText={(opt)=> this.setState({opt})}
                    editable="true"
                    value={this.state.opt}
                    theme={{ colors: { placeholder: '#777', text: '#333', primary: '#11A0DC',underlineColor:'#11A0DC',background : '#fff'}}}
                />
                
                <TouchableOpacity style={styles.button}
                    underlayColor="transparent"
                    onPress={() => this._verifyOpt()}
                    opacity="0.6"
                >
                    <Text style={styles.buttonText}>Activate Account</Text>
                </TouchableOpacity>
                {this.state.isLoading == true &&
                  <ActivityIndicator size="large" color="#F89D29" />}

                <TouchableOpacity style={styles.buttonSignup}
                    underlayColor={'transparent'}
                    opacity="0.6"
                >
                  <Text style={[styles.buttonTextSignup, {color: '#6D6E70'}]}></Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonSignup}
                    underlayColor={'transparent'}
                    onPress={() => Actions.logrider()}
                    opacity="0.6"
                >
                  <Text style={[styles.buttonTextSignup, {color: '#6D6E70'}]}>Have an account? Click here</Text>
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
            </KeyboardAvoidingView>
        </ScrollView>
        </View>

    );
  };

  _verifyOpt = async () =>{
    this.setState({isLoading:true});
    
    const {opt,userMobile,userName,verifyOpt} = this.state;

    try {
      await fetch(`${getUrl}verifyoptapp.php`,{
        method:"POST",
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          username: userName,
          mobile: userMobile,
          opt: opt,
          verifyOpt: verifyOpt

        })

      })
        .then((response) => response.json())
          .then((responseJson) =>{
            if(responseJson === 'ok'){
              setTimeout(() => {
                this.setState({isLoading:false});
                Alert.alert('Success',"Your account has been activated!"),[{text: 'Okay'}];
                Actions.logrider();
                }, 2000);
                
            }else{
              this.setState({isLoading:false});
              Alert.alert('Failed',JSON.stringify(responseJson)),[{text: 'Okay'}];
            }

          })
            .catch((error)=>{
              this.setState({isLoading:false});
              console.log(error);
            })

    } catch (error) {
      this.setState({isLoading:false});
      console.log(error);
    }
  }

  }

  export default Activate;

