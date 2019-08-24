import React from 'react';
import {
    Text, 
    View,
    ScrollView,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    StatusBar
} from 'react-native';
import {
    Container,
    Button,
    Footer, 
    FooterTab,
    InputGroup, 
    Input, 
    CardItem,
    Content, 
    Card,
    ListItem,
    Body,
    Right,
    Left
 } from 'native-base';
import styles from '../../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { getUrl, getUrlExpressApi} from "../../config";
import moment from 'moment';
import { ActivityIndicator } from 'react-native-paper';

//socket io
import socketIo from 'socket.io-client';
import { tsThisType } from '@babel/types';


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
        isCancelled:false,
        
        paymentMethod:['creditCard','cash'],
        checked:0,
        //response request to send to the driver
        dataResponse:[],
        
      };
      this.handlePaymentOption = this.handlePaymentOption.bind(this);
    }
    

    componentDidMount(){
        let that = this;
        that.setState({
            //Setting the value of the date time
            datetimepicklocation:moment().format('YYYY-MM-DD HH:mm')

        });
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
    
    handlePaymentOption =  (key) => {
        // alert(key);
        this.setState({checked:key});
    }

    render(){
        return(
            <Container>
                <StatusBar 
                    backgroundColor="#11A0DC"
                    barStyle="light-content"
                    />
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
                        
                        <ListItem>
                            <Body>
                            <Text>Choose your payment method</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            {this.state.paymentMethod.map((method,index)=>{
                               return(    
                                    <Body key={index}>
                                    {this.state.checked == index ? 
                                        <TouchableOpacity 
                                            key={index}
                                            style={styles.btn}   
                                        >
                                            <Icons name="radio-button-checked" style={[styles.icon,{color: '#11A0DC',fontSize:25}]} />
                                            <Text >{method}</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.btn}
                                            onPress={()=> this.handlePaymentOption(index)}   
                                        >
                                            <Icons name="radio-button-unchecked" style={[styles.icon,{color: '#F89D29',fontSize:25}]} />
                                            <Text >{method}</Text>
                                        </TouchableOpacity>
                                    }
                                    </Body>
                               )
                            })}
                        </ListItem>
                    </Content>

                    <View style={styles.formContainer}>
                        <InputGroup>
                            <Input
                                style={styles.textInputStyle}
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
                                placeholder="Number of riders"
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

                            <TouchableOpacity style={[styles.buttonSignup,{marginBottom:10}]}
                                underlayColor={'transparent'}
                                onPress={() => this._cancelBook()}
                                opacity="0.6"
                            >
                                <Text style={[styles.buttonTextSignup, {color: '#F89D29'}]}>Cancel</Text>
                            </TouchableOpacity>
                            {this.state.isCancelled == true && 
                                <ActivityIndicator size="large" color="#F89D29" />}

                        </View>
                </KeyboardAvoidingView>
                
                <Footer style={{marginTop:10}}>
                    <FooterTab style={styles.footerContainer} >

                        <Button vertical onPress={() => Actions.help()}>
                            <Icon name="eye" size={20} color={"#11A0DC"} />
                            <Text style={{fontSize:12, color:"grey"}}>Help</Text>
                        </Button>
                        <Button vertical onPress={() => Actions.profile()}>
                            <Icon active name="envelope-o" size={20} color={"#11A0DC"} />
                            <Text style={{fontSize:12, color:"grey"}}>Message</Text>
                        </Button>

                    </FooterTab>
		        </Footer>
                
            </ScrollView>
        </View>      
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
        // alert("Date: "+this.state.datetimepicklocation);
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
                      dropoffPlaceId:this.props.requestRide.destinationPlaceId,
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
                      pickupPlaceId:this.props.requestRide.pickupPlaceId,
                      dropofflatitude:this.props.requestRide.dropoffLocationLat,
                      dropofflongitude:this.props.requestRide.dropoffLocationLng,
                      status:this.state.status,
                      paymentmethod:this.state.checked
                })
      
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson === 'ok'){  
                      this.setState({ 
                          dataResponse:{
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
                            status:this.state.status,
                            paymentmethod:this.state.checked
                        },
                        isLoading:false,
                        });
                      Alert.alert(
                          "Success",
                          "The notification has been sent! Contact you after you pay for your journey!" 
                      );
                     //   alert(this.state.dataResponse); 
                     
                      //socketIo connect via socket io and send data for request taxi
                      const socket = socketIo.connect(`${getUrlExpressApi}:3000`);
                        socket.on("connect", () => {
                            console.log("Client connected"); 
                            //request a taxi
                            socket.emit("taxiRequest",this.state.dataResponse);
                        });
                        //redirect to view trip screen
                       Actions.viewtrip(); 
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


