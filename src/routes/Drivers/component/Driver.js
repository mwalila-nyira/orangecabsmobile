import React from 'react';
import {View, 
    Text,
    Alert, 
    Dimensions, 
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import {Container,Button,Footer, FooterTab,} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import { getUrl } from "../../config";
import MapView,{PROVIDER_GOOGLE,Marker,Polyline} from 'react-native-maps';
import apiKey from "../../google_api_key";
import PolyLine from '@mapbox/polyline';

const {width,height} = Dimensions.get("window");

const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;

const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

class Driver extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      
      error:"",
      predictions:[],
      pointCoords:[],
      routeResponse:[],
      indicator: false,
      
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
  
  //request driver indicator
  // async requestDriverIndicator(){
  //   this.setState({isRequestDriverIndicator:true});
  // }
  
  //Get google routes directions
  async getRouteDirections(destinationPlaceId) {
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
      
      //calculate price per Km 8.50/perKm
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
  async requestDriver(){
    const socket = socketIo.connect(`${host}:3000`);
    
    socket.on("connect", () => {
      console.log("Client connected"); 
      //request a taxi
      socket.emit("taxiRequest",this.state.routeResponse);
    });
    
  }
    
  //Logoutapp
  logout = async () => {

      let mobile = await AsyncStorage.getItem("mobile_driver");
      let token = await AsyncStorage.getItem("token_driver");
  
      await fetch(`${getUrl}logoutapp.php`,{
              method: "POST",
              headers:{
                  "Accept": "application/json",
                  "Content-type": "application/json"
              },
              body:JSON.stringify({
                  mobile:mobile,
                  token:token
              })
          })
          .then((response) => response.json())
          .then((responseJson) => {
              if(responseJson === "ok"){
                  AsyncStorage.removeItem("mobile_driver");
                  AsyncStorage.removeItem("token_driver");
                  Actions.accueil();
              }else{
                Alert.alert("Failed",JSON.stringify(responseJson)),[{text: "Okay"}];
              }
          }).catch((error) => {
            alert("Try later or check your network!");
            console.error(error);
        });
  }
  
    render(){
        
        let marker = null;
        if(this.state.focusedLocation){
          marker = <MapView.Marker coordinate={this.state.focusedLocation} />
        }
        let driverButton = null;
        //chech if the pointCoords is not null > 1 display a marker polyline
        if(this.state.pointCoords.length > 1){
        
        // marker =( <Marker 
        //             coordinate={this.state.pointCoords[this.state.pointCoords.length -1]}
        //             /> );
        
        driverButton = 
        ( <TouchableOpacity 
                style={styles.findDriverRiderContainer}
                onPress={() => this.requestDriver()}
            >
                <View >
                    <Text style={styles.findDriverRiderText}>Find Driver</Text>
                    {/* {this.state.isRequestDriverIndicator == true ?  
                    ( <ActivityIndicator 
                        animating={this.state.isRequestDriver} 
                        size="small"
                        color="white"
                        />
                    ): null
                    } */}
                </View>
            </TouchableOpacity>);

    }

    return(
        <Container>
            <View style={styles.container}>
                <MapView
                    // ref={map => {this.map = map}}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={this.state.focusedLocation}
                    onPress={this.pickuplocationHandler}
                    region={this.state.focusedLocation}
                    showsCompass={false} 
                    showsUserLocation={true}
                    ref={ref => this.map = ref}
                >
                
                    <Polyline
                        coordinates={this.state.pointCoords}
                        strokeColor="red" // fallback for when 
                        strokeWidth={4}
                    />
                    {marker}
                    
                </MapView>

                {driverButton}        
          
            </View>
            
            <Footer style={{marginTop:'auto'}}>
              <FooterTab style={[styles.footerContainer]} >
                      
                    <Button vertical active onPress={() => Actions.driver()}>
                    <Icon name="home" size={20} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Home</Text>
                    </Button>

                    <Button vertical  onPress={() => Actions.requestRide()}>
                    <Icon name="eye" size={20} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Requests</Text>
                    </Button>

                    <Button vertical  onPress={() => Actions.profileDriver()}>
                        <Icon name="user" size={20} color={"#F89D29"} />
                        <Text style={{fontSize:12, color:"grey"}}>Profile</Text>
                    </Button>
                    <Button vertical  onPress={() => Actions.messageDriver()}>
                        <Icon active name="envelope-o" size={20} color={"#F89D29"} />
                        <Text style={{fontSize:12, color:"grey"}}>Message</Text>
                    </Button>
                    <Button vertical  onPress={() => this.logout()}>
                        <Icon name="power-off" size={20} color={"#F89D29"} />
                        <Text style={{fontSize:12, color:"grey"}}>Logout</Text>
                    </Button>

                    </FooterTab>
                </Footer>  
     
        </Container>
        
    );
    }

}

export default Driver;

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
    marginTop: 'auto',
    padding:15,
    margin:20,
    alignSelf:'center',
    paddingLeft:30,
    paddingRight:30
  },
  findDriverRiderText: {
    fontSize:20,
    color:'#fff',
  },
  footerContainer:{
    backgroundColor:"#fff",
    // marginTop:'auto'
  },

});