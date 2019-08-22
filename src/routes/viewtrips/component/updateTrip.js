import React, {Component} from 'react';
import { 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableHighlight,
  StatusBar,
  Keyboard,
} from 'react-native';

import {
    Label, 
    Item,
    Left,
    Body,
    Button,
    Header,
    Content, 
    Input,
    ListItem,
    Container,
    Right
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';
import styles from '../../styles';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { getUrl } from "../../config";
import { Actions } from 'react-native-router-flux';
import apiKey from "../../google_api_key";
import PolyLine from '@mapbox/polyline';

class UpdateTripModal extends Component {
    constructor(props){
        super(props);
        message = this.props.destination;
        this.state = {
            predictions:[],
            destination:"",
            paymentMethod:['credit card','cash'],
            numberofrider:null,
            nameofonerider:null,
            datepicklocation:'',
            location:'',
            isVisible: false,
            pointCoords:[],
            payment:null,
            tripId:null,
            userId:null,
            directionsData:{},
            routeResponse:[],
            isRequestRide: false,
            focusedLocation:{}
          };
    }
    
    componentDidMount(){
        // alert(this.props.data.numberofrider);
        let that = this;
        that.setState({
            //Setting the value of the date time
            datepicklocation:moment(this.props.data.date).format('YYYY-MM-DD HH:mm'),
            tripId:this.props.data.tripId,
            userId:this.props.data.userId,
            location:this.props.data.departure,
            focusedLocation:this.props.data.focusedLocation,
            destination:this.props.data.destination,
            numberofrider:this.props.data.numberofrider,
            nameofonerider:this.props.data.nameofonerider,
            payment:this.props.data.payment,
            
        });
    }
    
    async onChangeDestination(destination){
        //call the google places api
        this.setState({destination});
        const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${destination}&region=ZAR&location=${this.props.data.focusedLocation.latitude},${this.props.data.focusedLocation.longitude}&radius=2000`;
        try {
          const result = await fetch(apiUrl);
          const json = await result.json();
          console.log(json);
          this.setState({predictions:json.predictions});
          
        } catch (error) {
          console.error(error);
        }
    }
    
     //Get google routes directions
    async getRouteDirections(destinationPlaceId,destinationName) {
        try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${
            this.props.data.focusedLocation.latitude
            },${
            this.props.data.focusedLocation.longitude
            }&destination=place_id:${destinationPlaceId}&units=metric&key=${apiKey}`
        );
        
        //store json data for directions
        const json = await response.json(); 
        console.log(json);
        //using mapbox/PolyLine to decode the overview_polyline   
        const points = PolyLine.decode(json.routes[0].overview_polyline.points);
        
        //pickup location 
        const pickUpLocation = json.routes[0].legs[0].start_address ;
        const pickUpLocationLat = json.routes[0].legs[0].start_location.lat;
        const pickUpLocationLng = json.routes[0].legs[0].start_location.lng;
        // console.log([pickUpLocation,pickUpLocationLat,pickUpLocationLng);
        
        //drop off location
        const dropoffLocation = json.routes[0].legs[0].end_address;
        const dropoffLocationLat = json.routes[0].legs[0].end_location.lat;
        const dropoffLocationLng = json.routes[0].legs[0].end_location.lng;
        //console.log([dropoffLocation,dropoffLocationLat,dropoffLocationLng]);
        
        //distance between two points
        const distanceInMiles = json.routes[0].legs[0].distance.text;
        const distanceMilesVirgules = distanceInMiles.replace(',','');
        const distanceInKm = parseFloat(distanceMilesVirgules.replace(' km','')).toFixed(2);
        // console.log(distanceInKm);
        
        //calculate price per Km 8.50/perKm Price=R50+(route km-3km)*R8.50
        const priceBrute = 50 + (distanceInKm - 3) * 8.50;
        const price = priceBrute.toFixed(2);
        //console.log(price);
        
        const duration = json.routes[0].legs[0].duration.text;
        //console.log(duration);
        
        //polyline mapbox coordinates store
        const pointCoords = points.map(point => {
            return { latitude: point[0], longitude: point[1] };
        });
        
        const directionsData = {
            pickUpLocation: pickUpLocation,
            pickUpLocationLat:pickUpLocationLat,
            pickUpLocationLng:pickUpLocationLng,
            dropoffLocationLat:dropoffLocationLat,
            dropoffLocation:dropoffLocation,
            dropoffLocationLng:dropoffLocationLng,
            distanceInKm:distanceInKm,
            price:price,
            duration:duration 
        };
        // console.log(directionsData);
        //set data into differents variables for using later
        this.setState({
            pointCoords,
            predictions: [],
            directionsData,
            destination: destinationName,
            //route response for requesting a book
            routeResponse: json,
            
        });
        
        // AsyncStorage.setItem('request_ride',directionsData);
        
        Keyboard.dismiss();
        
        } catch (error) {
        console.error(error);
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
                alert("please enter number only");
            }
        }
        this.setState({ numberofrider: newText });
    };

    showDatePicker = () => {
        this.setState({isVisible:true});
    }

    handleDatePicker = (datetime) => {
    this.setState({
        isVisible:false,
        datepicklocation: moment(datetime).format('YYYY-MM-DD HH:mm')
        // MMMM, Do YYYY HH:mm
    });
    this.hideDatePicker();
    }

    hideDatePicker = () => {
        this.setState({
            isVisible:false,
            
        });    
    }

    handlePaymentOption =  (method) => {
        // alert(key);
        this.setState({payment:method});
    }
    
    //update data 
    _updateData = async () => {
       this.setState({isRequestRide:true});
       try {
           await fetch(`${getUrl}updateTrip.php`,{
               method:"POST",
               headers:{
                   'Accept':'application/json',
                   'Content-type': 'application/json'
               },
               body:JSON.stringify({
                    pickup:this.state.directionsData.pickUpLocation,
                    dropoff: this.state.directionsData.dropoffLocation,
                    distance:this.state.directionsData.distanceInKm,
                    duration:this.state.directionsData.duration,
                    price:this.state.directionsData.price,
                    nameofrider: this.state.nameofonerider,
                    numberofrider:this.state.numberofrider,
                    datePicker: this.state.datepicklocation,
                    pickuplatitude:this.state.directionsData.pickUpLocationLat,
                    pickuplongitude:this.state.directionsData.pickUpLocationLng,
                    dropofflatitude:this.state.directionsData.dropoffLocationLat,
                    dropofflongitude:this.state.directionsData.dropoffLocationLng,
                    paymentmethod:this.state.payment,
                   tripId:this.state.tripId, 
                   userId: this.state.userId,
                   
               })
           }).then(response => response.json())
                .then((responseData)=>{
                    if(responseData === 'ok'){
                        this.setState({isRequestRide:false})
                        Actions.viewtrip();
                    }
                }).catch((error)=>{
                    this.setState({isRequestRide:false})
                    alert(JSON.stringify(responseData))
                    console.log(error)
                })
           
       } catch (error) {
           this.setState({isRequestRide:false})
          console.log(error) 
       } 
    }

  render() {
    let detailsDirections = null; 
    if(this.state.pointCoords.length > 1){

      detailsDirections =( <View style={styles.directionContainer}>
          <Text>From : {this.state.directionsData.pickUpLocation}</Text>
          <Text>To : {this.state.directionsData.dropoffLocation}</Text>
          <Text>Distance : {this.state.directionsData.distanceInKm} Km, {this.state.directionsData.duration}</Text>
          <Text>Fare: ZAR {this.state.directionsData.price}</Text>
      </View>);
  }
      //predictions autocomplete google places api
    const predictions = this.state.predictions.map(prediction => 
        <TouchableHighlight 
          onPress={() => this.getRouteDirections(
                          prediction.place_id, 
                          prediction.description,
                          //getting the formatting destination
                          // prediction.structured_formatting.main_text
                        )
                  } 
          key={prediction.id}
        >
          <View>
            <Text style={styles.suggestions} >
              {prediction.description}
            </Text>
          </View>
          
    </TouchableHighlight> )
    return (
        <Container>
            <StatusBar 
                backgroundColor="#11A0DC"
                barStyle="light-content"
                />
            <Header style={{backgroundColor:"#11A0DC"}} iosBarStyle="light-content">
                      <Left>
                          <Button transparent onPress={()=>Actions.viewtrip()}>
                          <Icon name="chevron-left" style={[styles.icon,{color: '#fff'}]}/>
                          </Button>
                      </Left>
                      <Body>
                          <Text style={styles.headerText}>Update your Trip</Text>
                         
                      </Body>
                      <Right>
                      <TouchableOpacity style={[styles.buttonSignup,{marginBottom:10}]}
                                underlayColor={'transparent'}
                                onPress={() => Actions.viewtrip()}
                                opacity="0.6"
                            >
                                <Text style={[styles.buttonTextSignup, {color: '#FFFFFF'}]}>Cancel</Text>
                            </TouchableOpacity>
                            {this.state.isCancelled == true && 
                                <ActivityIndicator size="large" color="#F89D29" />}
                      </Right>
                  </Header> 
                <View style={styles.containerModal}>
                <ScrollView>
                <KeyboardAvoidingView>
                    
                    <Content>
                        
                        <ListItem>
                            <Text>Your Location  :  </Text>
                            <Body>
                            <Text>{this.state.location}</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <Body>
                            <Text>Update your payment method</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            {this.state.paymentMethod.map((method,index)=>{
                               return(    
                                    <Body>
                                    {this.state.payment == method ? 
                                        <TouchableOpacity 
                                            key={method}
                                            style={styles.btn}   
                                        >
                                            <Icons name="radio-button-checked" style={[styles.icon,{color: '#11A0DC',fontSize:25}]} />
                                            <Text key={method}>{method}</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            key={method}
                                            style={styles.btn}
                                            onPress={()=> this.handlePaymentOption(method)}   
                                        >
                                            <Icons name="radio-button-unchecked" style={[styles.icon,{color: '#F89D29',fontSize:25}]} />
                                            <Text key={method}>{method}</Text>
                                        </TouchableOpacity>
                                    }
                                    </Body>
                               )
                            })}
                        </ListItem>
                    </Content>

                    <View style={styles.formContainerUpdate}>
                        <Item stackedLabel>
                            <Label>Destination</Label>
                            <Input
                                style={[styles.destinationInput,{paddingLeft:0,paddingRight:0}]} 
                                underlineColor="#11A0DC"
                                returnKeyType= "go"
                                autoCapitalize= "none"
                                editable={true}
                                value={this.state.destination} 
                                onChangeText={(destination)=>this.onChangeDestination(destination)}
                            />
                        </Item> 
                        <View style={styles.textInputBottomLine} /> 
                        {predictions}
                            
                        <Item stackedLabel>
                            <Label>Date Pick up</Label>
                            <Input
                                style={styles.textInputStyle}
                                autoCapitalize= "none"
                                autoCorrect= {false}
                                onChangeText={(datepicklocation) => this.setState({datepicklocation})}
                                value={this.state.datepicklocation}
                                onFocus={this.showDatePicker}
                            
                            />
                            <Icon name="calendar" size={25} color="#11A0DC" style={{marginTop:-50,marginLeft:250}}/>
                            <DateTimePicker
                            isVisible={this.state.isVisible}
                            onConfirm={this.handleDatePicker}
                            onCancel={this.hideDatePicker}
                            datePickerModeAndroid={'spinner'}
                            mode={'datetime'}
                            is24Hour={true}
                        />
                        </Item>
                    
                        <View style={styles.textInputBottomLine} />

                        <Item stackedLabel>
                            <Label>Number of riders</Label>
                            <Input
                                style={styles.textInputStyle}
                                keyboardType='numeric'
                                returnKeyType= {'next'}
                                autoCapitalize= "none"
                                onChangeText={(text) => this.onChanged(text)}
                                value={this.state.numberofrider}
                            />
                        </Item>

                        <View style={styles.textInputBottomLine} />

                        <Item stackedLabel>
                            <Label>Name of one rider</Label>
                            <Input
                                style={[styles.textInputStyle, {marginTop: 10}]}
                                returnKeyType= "next"
                                autoCapitalize= "none" 
                                onChangeText={(nameofonerider)=> this.setState({nameofonerider})}
                                value={this.state.nameofonerider}
                            />
                        </Item>
                        <View style={styles.textInputBottomLine} />
                        
                          {detailsDirections} 
                          {/* send a request to the ride to the driver */}
                        <TouchableOpacity 
                            opacity="0.6"
                            style={styles.findDriverRiderContainer}
                            onPress={() => this._updateData()}
                            
                            >
                            <View style={styles.findDriverRiderText}>
                                
                                {this.state.isRequestRide == true ?  
                                ( <ActivityIndicator 
                                    animating={this.state.isRequestRide} 
                                    size="large"
                                    color="white"
                                    />
                                ): 
                                <Text >Update Trip</Text>
                                }
                            </View>
                        </TouchableOpacity> 

                        </View>
                </KeyboardAvoidingView>
                
                
            </ScrollView>
        </View>      
    </Container>

    );
  }
}

export default UpdateTripModal;