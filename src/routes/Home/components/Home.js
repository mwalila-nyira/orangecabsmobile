import React from 'react';
import {View, 
    Text, 
    Dimensions,
    TouchableHighlight, 
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    TextInput,
    Keyboard,
} from 'react-native';
import {Container,} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { getUrl, getUrlExpressApi } from "../../config";
import MapView,{PROVIDER_GOOGLE,Marker,Polyline} from 'react-native-maps';
import apiKey from "../../google_api_key";
import PolyLine from '@mapbox/polyline';


const {width,height} = Dimensions.get("window");

const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;

const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

class Home extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      error:"",
      destination:"",
      predictions:[],
      pointCoords:[],
      routeResponse:[],
      isRequestRide: false,
      
      focusedLocation:{
        latitude:-33.9305686,
        longitude:18.4731583,
        latitudeDelta:LATITUDE_DELTA,
        longitudeDelta:LONGITUDE_DELTA
      },
      locationChosen:false,
      directionsData:{},

    }
    //loadash with debounced  250,{ 'maxWait': 1000 }
    // this.onChangeDestinationDebounced = _.debounce(this.onChangeDestination,1000);
  }
  
  
  // componentDidMount
  componentDidMount(){
   this.getCurrentLocationHandler(); 
  }
  
  //pickup place manually
  pickuplocationHandler = event =>{
    const coords = event.nativeEvent.coordinate;
    this.map.animateToRegion({
      ...this.state.focusedLocation,
      latitude:coords.latitude,
      longitude:coords.longitude
    });
    this.setState(prevState => {
      return {
        focusedLocation:{
          ...prevState.focusedLocation,
          latitude:coords.latitude,
          longitude:coords.longitude
        },
        locationChosen:true
      }
    })
  }

  //get current location for the user
  getCurrentLocationHandler(){
    navigator.geolocation.getCurrentPosition(
      position => {
        const coordsEvent = {
          nativeEvent:{
            coordinate:{
              latitude:position.coords.latitude,
               longitude:position.coords.longitude,
            }
          }
        };
        this.pickuplocationHandler(coordsEvent);
        this.setState({error:null,});
        },
        error => this.setState({ error:error.message }),
        {enableHighAccuracy:true, timeout:20000, maximumAge:2000}
        );
        // this.getRouteDirections();
  }
  
  // Google places api
  async onChangeDestination(destination){
    //call the google places api
    this.setState({destination});
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${destination}&region=ZAR&location=${this.state.focusedLocation.latitude},${this.state.focusedLocation.longitude}&radius=2000`;
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
          this.state.focusedLocation.latitude
        },${
          this.state.focusedLocation.longitude
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
      
      this.map.fitToCoordinates(pointCoords,
        { edgePadding:{top:20,bottom:20,left:20,right:20}}
      );
      
    } catch (error) {
      console.error(error);
    }
  }
  
  //request driver
  async requestForRide(){
    this.setState({isRequestRide:true})
    //pass data between 2 screen with react-native-router-flux
    //send data to the next page for completing ride
    // AsyncStorage.setItem('request_ride',this.state.directionsData);
    Actions.modal({requestRide:this.state.directionsData});
    
    
  }
    
  render(){
      
      let marker = null;
      
      if(this.state.focusedLocation){
        marker = <MapView.Marker coordinate={this.state.focusedLocation} title="My location"/>
      }

      let marker2 = null;
      let detailsDirections = null;
      //chech if the pointCoords is not null > 1 display a marker polyline
      if(this.state.pointCoords.length > 1){
      
        marker2 =( <Marker 
                  coordinate={this.state.pointCoords[this.state.pointCoords.length -1]}
                  pinColor="#F89D29"
                  title="Your Destination"
                  /> );

      detailsDirections =( <View style={styles.directionContainer}>
          <Text>From : {this.state.directionsData.pickUpLocation}</Text>
          <Text>To : {this.state.directionsData.dropoffLocation}</Text>
          <Text>Distance : {this.state.directionsData.distanceInKm} Km, {this.state.directionsData.duration}</Text>
          <Text>Fare: ZAR {this.state.directionsData.price}</Text>
          
          {/* send a request to the ride to the driver */}
          <TouchableOpacity 
               opacity="0.6"
              style={styles.findDriverRiderContainer}
              onPress={() => this.requestForRide()}
             
            >
              <View style={styles.findDriverRiderText}>
                  
                  {this.state.isRequestRide == true ?  
                  ( <ActivityIndicator 
                      animating={this.state.isRequestRide} 
                      size="small"
                      color="white"
                      />
                  ): 
                  <Text >Let's Go</Text>
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
        
      </TouchableHighlight>      
    );

    return(
        <Container>
            <View style={styles.container}>
                <MapView
                    // ref={map => {this.map = map}}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={this.state.focusedLocation}
                    onPress={this.pickuplocationHandler}
                    // region={this.state.focusedLocation}
                    showsCompass={true} 
                    showsUserLocation={true}
                    ref={ref => this.map = ref}
                >
                
                    <Polyline
                        coordinates={this.state.pointCoords}
                        strokeColor="red"
                        strokeWidth={4}
                    />
                    {marker}
                    {marker2}                  
                </MapView>
        
                <View style={{marginTop: 50}}>
                <TextInput
                    style={styles.destinationInput}
                    placeholder="Enter your destination..." 
                    underlineColor="#11A0DC"
                    returnKeyType= "go"
                    autoCapitalize= "none"
                    editable={true}
                    value={this.state.destination} 
                    onChangeText={(destination)=>this.onChangeDestination(destination)}

                />
                </View>

                {predictions} 
                {detailsDirections}        

            </View>   
        </Container>
        
    );
    }

}

export default Home;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  destinationInput: {
    height:50,
    borderWidth:0.5,
    marginTop:50,
    marginLeft:5,
    marginRight:5,
    padding:15,
    backgroundColor:'#fff',
    opacity:0.9,
    borderRadius:7
  },
  suggestions: {
    backgroundColor:'white',
    fontSize:18,
    borderWidth:0.5,
    padding:5,
    marginLeft:5,
    marginRight:5
  },
  findDriverRiderContainer: {
    backgroundColor:'#11A0DC',
    // marginTop: 'auto',
    padding:10,
    // margin:20,
    alignSelf:'center',
    marginLeft:170
    // paddingLeft:30,
    // paddingRight:30
  },
  directionContainer: {
    backgroundColor:'#fff',
    marginTop: 'auto',
    padding:15,
    // marginTop:Platform.OS === "android" ? 330 : 400,
    // alignSelf:'center',
    paddingLeft:30,
    paddingRight:30
  },
  findDriverRiderText: {
    fontSize:20,
    color:'#fff',
  }

});