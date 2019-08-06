import React, {Component} from 'react';
import {
  Modal, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableHighlight,
  Image,
  Keyboard,
  TextInput
} from 'react-native';

import {
    Label, 
    Item,
    Left,
    Body,
    Button,
    Header,
    InputGroup, 
    Input,
    ListItem
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { getUrl } from "../../config";
import { Actions } from 'react-native-router-flux';
import apiKey from "../../google_api_key";
import PolyLine from '@mapbox/polyline';

const uncheckedicon = require("../../../../assets/contacts/uncheckedcheckbox.png");

const checkedicon = require("../../../../assets/contacts/checkedcheckbox.png")

class UpdateTripModal extends Component {
    constructor(props){
        super(props);
        message = this.props.destination;
        this.state = {
            modalVisible: false,
            message:'',
            isLoadingDelete: false,
            predictions:[],
            destination:"",
            paymentMethod:['credit card','cash'],
            checked:0,
            nameofonerider:'',
            numberofrider:'',
            datepicklocation:'',
            location:'',
            isVisible: false,
            pointCoords:[],
            payment:null,
            tripId:null,
            userId:null,
            directionsData:{},
            focusedLocation:{}
          };
    }
    
    componentDidMount(){
        // let that = this;
        // that.setState({
        //     //Setting the value of the date time
        //     datepicklocation:this.props.date,
        //     tripId:this.props.tripId,
        //     userId:this.props.userId,
        //     location:this.props.departure,
        //     focusedLocation:this.props.focusedLocation,
        //     destination:this.props.destination,
        //     numberofrider:this.props.numberofrider,
        //     nameofonerider:this.props.nameofonerider,
        //     payment:this.props.payment,
            
        // });
    }
    
    async onChangeDestination(destination){
        //call the google places api
        this.setState({destination});
        const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${destination}&region=ZAR&location=${this.props.focusedLocation.latitude},${this.props.focusedLocation.longitude}&radius=2000`;
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
            this.props.focusedLocation.latitude
            },${
            this.props.focusedLocation.longitude
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
        this.setState({ nameofonerider: newText });
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

    handlePaymentOption =  (key) => {
        // alert(key);
        this.setState({checked:key});
    }
    
    //update data 
    _updateData = async () => {
        
    }

  render() {
      
    if(this.state.pointCoords.length > 1){

      detailsDirections =( <View style={styles.directionContainer}>
          <Text>From : {this.state.directionsData.pickUpLocation}</Text>
          <Text>To : {this.state.directionsData.dropoffLocation}</Text>
          <Text>Distance : {this.state.directionsData.distanceInKm} Km, {this.state.directionsData.duration}</Text>
          <Text>Fare: ZAR {this.state.directionsData.price}</Text>
          
          {/* send a request to the ride to the driver */}
          <TouchableOpacity 
               opacity="0.6"
              style={styles.findDriverRiderContainer}
              onPress={() => this.updateData()}
             
            >
              <View style={styles.findDriverRiderText}>
                  
                  {this.state.isRequestRide == true ?  
                  ( <ActivityIndicator 
                      animating={this.state.isRequestRide} 
                      size="small"
                      color="white"
                      />
                  ): 
                  <Text >Update</Text>
                  }
              </View>
            </TouchableOpacity>
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
      <View style={{marginTop:0}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.showModal}
          onRequestClose={this.props.hideModal}>
            <View style={{marginTop: 0}}>
              <Header style={{backgroundColor:"#11A0DC"}} iosBarStyle="light-content">
                      <Left>
                          <Button transparent onPress={this.props.hideModal}>
                          <Icon name="chevron-left" style={[styles.icon,{color: '#fff'}]}/>
                          </Button>
                      </Left>
                      <Body>
                          <Text style={styles.headerText}>Update your Trip</Text>
                         
                      </Body>
                  </Header> 
                  <View>
                  <ScrollView>
                    <KeyboardAvoidingView>
                        <View>
                        <ListItem>
                            <Text>Your Location  :  </Text>
                            <Body>
                            <Text>{this.props.location}</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <Body>
                            <Text>Update your payment method</Text>
                            </Body>
                        </ListItem>
                        
                        {/* <ListItem>
                            {this.state.paymentMethod.map((method,index)=>{
                               return(    
                                    <Body>
                                    {this.props.payment == method && this.state.checked == index? 
                                        <TouchableOpacity 
                                            key={method.index}
                                            style={styles.btn}   
                                        >
                                            <Image source={checkedicon} />
                                            <Text >{method}</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.btn}
                                            onPress={()=> this.handlePaymentOption(index)}   
                                        >
                                            <Image source={uncheckedicon} />
                                            <Text >{method}</Text>
                                        </TouchableOpacity>
                                    }
                                    </Body>
                               )
                            })}
                        </ListItem> */}
                        
                        </View>
                        <View style={styles.formContainerUpdate}>
                            <Item stackedLabel>
                                <Label>Destination</Label>
                                {/* <Input
                                    style={styles.destinationInput} 
                                    underlineColor="#11A0DC"
                                    returnKeyType= "go"
                                    autoCapitalize= "none"
                                    editable={true}
                                    value={this.props.destination} 
                                    onChangeText={(destination)=>this.onChangeDestination(destination)}
                                /> */}
                                <TextInput
                                    style={styles.destinationInput} 
                                    underlineColor="#11A0DC"
                                    returnKeyType= "go"
                                    autoCapitalize= "none"
                                    editable={true}
                                    value={this.props.destination} 
                                    onChangeText={(destination)=>this.onChangeDestination(destination)}

                                />
                            </Item>  
                            {predictions}

                            <Item stackedLabel>
                                <Label>Date Pick up</Label>
                                <Input
                                style={styles.textInputStyle}
                                autoCapitalize= "none"
                                autoCorrect= {false}
                                onChangeText={datepicklocation=> this.setState({datepicklocation:datepicklocation})}
                                value={this.props.date}
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
                        </Item>

                            <Item stackedLabel>
                            <Label>Number of riders</Label>
                                <Input
                                style={styles.textInputStyle}
                                keyboardType='numeric'
                                returnKeyType= {'next'}
                                autoCapitalize= "none"
                                maxLength={1} 
                                autoCorrect= {false}
                                onChangeText={(text) => this.onChanged(text)}
                                value={this.props.numberofriders}
                            />
                            </Item>

                            <Item stackedLabel>
                            <Label>Name of one rider</Label>
                                <Input
                                style={[styles.textInputStyle]}
                                returnKeyType= "next"
                                autoCapitalize= "none" 
                                onChangeText={(nameofonerider)=> this.setState({nameofonerider})}
                                value={this.props.nameofonerider}
                            />
                            </Item>
                        </View>
                       
                  </KeyboardAvoidingView>
                  </ScrollView>
                </View>

            </View>
        </Modal>

        {/* <View> */}
          {/* <Button vertical onPress={() => {this.setModalVisible(true);}}> */}
            {/* <Icon name="eye" color="#F89D29" size={25}  /> */}
            {/* <Image 
              source={trippaid} 
              style={{marginLeft:15}}
            />
          </Button> */}
        {/* </View> */}
      </View>
    );
  }
}

export default UpdateTripModal;