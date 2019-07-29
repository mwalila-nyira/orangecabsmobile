import React from 'react';
import {
    Text, 
    View,
    ScrollView,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import {Container,Button,Footer, FooterTab,InputGroup, Input, CardItem,Content, Card, } from 'native-base';
import styles from '../../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { getUrl, getUrlExpressApi} from "../../config";
import moment from 'moment';
import { ActivityIndicator } from 'react-native-paper';


//Send mail with nodemailer
// const nodemailer = require("nodemailer"); 

class Booknow extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        amountofrider: '',
        nameofonerider:'',
        datetimepicklocation:'',
        isVisible: false,
        mobile:'',
        token:'',
        status:'unpaid',
        isLoading: false,
        isCancelled:false
      };
    }

    onChanged(text){
        let newText = '';
        let numbers = '0123456789';
    
        for (var i=0; i < text.length; i++) {
            
            if(numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
            else {
                alert("please enter number only");
            }
        }
        this.setState({ amountofrider: newText });
    };

    showDatePicker = () => {
        this.setState({isVisible:true});
   }

   handleDatePicker = (datetime) => {
    this.setState({
        isVisible:false,
        datetimepicklocation: moment(datetime).format('YYYY-MM-DD HH:mm')
        // MMMM, Do YYYY HH:mm
    });
    this.hideDatePicker();
   }

    hideDatePicker = () => {
        this.setState({
            isVisible:false,
            
        });    
    }

    render(){
        return(
            <Container>
                <View style={styles.containerModal}>
                <ScrollView>
                <KeyboardAvoidingView>
                    
                    <Content>
                        <Card>
                            <CardItem>
                                <Text>From: </Text><Text style={{paddingLeft:10,paddingRight:20}}>{this.props.requestRide.pickUpLocation}</Text>

                            </CardItem>
                            <CardItem>
                                <Text>To:</Text><Text style={{paddingLeft:30,paddingRight:20}}>{this.props.requestRide.dropoffLocation}</Text>
                    
                            </CardItem>
                            <CardItem>
                                <Text>Distance:</Text><Text style={{paddingLeft:10,paddingRight:20}}>{this.props.requestRide.distanceInKm} Km, {this.props.requestRide.duration}</Text>
                    
                            </CardItem>
                            <CardItem>
                                <Text>Price: </Text><Text style={{paddingLeft:10,fontWeight:'bold'}}>ZAR </Text><Text style={{fontWeight:'bold'}}>{this.props.requestRide.price}</Text>
                                
                            </CardItem>
                        </Card>
                    </Content>

                    <View style={styles.formContainer}>
                        <InputGroup>
                            <Input
                                style={styles.textInputStyle}
                                placeholder="Select date and time pick up"
                                // returnKeyType= {'next'}
                                autoCapitalize= "none"
                                autoCorrect= {false}
                                onChangeText={(datepicklocation) => this.setState({datepicklocation})}
                                value={this.state.datetimepicklocation}
                                onFocus={this.showDatePicker}
                            
                            />
                            <Icon name="calendar" size={25} color="#11A0DC"/>
                            <DateTimePicker
                            isVisible={this.state.isVisible}
                            onConfirm={this.handleDatePicker}
                            onCancel={this.hideDatePicker}
                            datePickerModeAndroid={'spinner'}
                            mode={'datetime'}
                            is24Hour={true}
                        />
                        </InputGroup>
                    
                        <View style={styles.textInputBottomLine} />

                        <InputGroup>
                            <Input
                                style={styles.textInputStyle}
                                placeholder="Amount of riders"
                                keyboardType='numeric'
                                returnKeyType= {'next'}
                                autoCapitalize= "none"
                                maxLength={1} 
                                autoCorrect= {false}
                                onChangeText={(text) => this.onChanged(text)}
                                value={this.state.amountofrider}
                            />
                        </InputGroup>

                        <View style={styles.textInputBottomLine} />

                        <InputGroup>
                            <Input
                                style={[styles.textInputStyle, {marginTop: 10}]}
                                placeholder="Name of one rider"
                                returnKeyType= "next"
                                autoCapitalize= "none" 
                                onChangeText={(nameofonerider)=> this.setState({nameofonerider})}
                                value={this.state.nameofonerider}
                            />
                        </InputGroup>

                        <View style={styles.textInputBottomLine} />

                            <TouchableOpacity style={styles.button}
                                underlayColor="transparent"
                                onPress={() => this._book()}
                                opacity="0.6"
                            >
                            <Text style={styles.buttonText}>Book and go</Text>
                            </TouchableOpacity>
                            {this.state.isLoading == true && 
                                <ActivityIndicator size="large" color="#F89D29" />}

                            <TouchableOpacity style={styles.buttonSignup}
                                underlayColor={'transparent'}
                                onPress={() => this._cancelBook()}
                                opacity="0.6"
                            >
                                <Text style={[styles.buttonTextSignup, {color: '#fed136'}]}>Cancel</Text>
                            </TouchableOpacity>
                            {this.state.isCancelled == true && 
                                <ActivityIndicator size="large" color="#F89D29" />}

                        </View>

                </KeyboardAvoidingView>
                </ScrollView>
            </View>
            
            <Footer style={{marginTop:10}}>
                    <FooterTab style={styles.footerContainer} >

                        <Button vertical onPress={() => Actions.help()}>
                            <Icon name="eye" size={20} color={"#F89D29"} />
                            <Text style={{fontSize:12, color:"grey"}}>Help</Text>
                        </Button>
                        <Button vertical onPress={() => Actions.message()}>
                            <Icon active name="envelope-o" size={20} color={"#F89D29"} />
                            <Text style={{fontSize:12, color:"grey"}}>Message</Text>
                        </Button>

                    </FooterTab>
		        </Footer>
            </Container>
        );
    }

    _cancelBook = async () =>{
        this.setState({isCancelled:true});
        setTimeout(() => {
            this.setState({isCancelled:false});
            Alert.alert("Cancel","Do you want to cancel your booking request for rider?"),[{text:"okay"}];
            Actions.home();
          },2000);
    }

    _book = async () =>{
        this.setState({isLoading:true});
        
        let mobile = await AsyncStorage.getItem('mobile');
        let token = await AsyncStorage.getItem('token');

        if(this.state.datetimepicklocation == '') {
            this.setState({isLoading:false});
            
            Alert.alert('Info', 'Select data and time of pickup location'),[
              {text: 'Okay'},
            ];
            return;
        }

        if(this.state.amountofrider == '') {
            this.setState({isLoading:false});
            
            Alert.alert('Info', 'Amount of rider is required'),[
            {text: 'Okay'},
            ];
            return;
        }

        if(this.state.nameofonerider == '') {
            this.setState({isLoading:false});
            
            Alert.alert('Info', 'Name is required'),[
            {text: 'Okay'},
            ];
            return;
        }
        try {
            
            await fetch(`${getUrl}addtrip.php`,{
                method: "POST",
                headers:{
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body:JSON.stringify({
                      pickup:this.props.requestRide.pickUpLocation,
                      dropoff: this.props.requestRide.dropoffLocation,
                      distance:this.props.requestRide.distanceInKm,
                      duration:this.props.requestRide.duration,
                      price:this.props.requestRide.price,
                      token:token,
                      mobile:mobile,
                      nameofrider: this.state.nameofonerider,
                      amountofrider:this.state.amountofrider,
                      datePicker: this.state.datetimepicklocation,
                      pickuplatitude:this.props.requestRide.pickUpLocationLat,
                      pickuplongitude:this.props.requestRide.pickUpLocationLng,
                      dropofflatitude:this.props.requestRide.dropoffLocationLat,
                      dropofflongitude:this.props.requestRide.dropoffLocationLng,
                      status:this.state.status
                })
      
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson === 'ok'){  
                //   setTimeout(() => {
                      this.setState({isLoading:false});
                      Alert.alert(
                          "Success",
                          "The notification has been sent! Contact you after you pay for your journey!" 
                      );
                      
                       Actions.viewtrip();
                       
                    // },2000);  
                }
                else{
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
            onsole.log(error);
        }
      Keyboard.dismiss();

  }
}

export default Booknow;


