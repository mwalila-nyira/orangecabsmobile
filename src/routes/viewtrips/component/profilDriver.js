import React, {Component} from 'react';
import {
  StyleSheet, 
  View, 
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';

import {Container} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Actions } from 'react-native-router-flux';
import { getUrl,serverExp } from "../../config";
import MapView,{PROVIDER_GOOGLE,Marker,Polyline} from 'react-native-maps';
import apiKey from "../../google_api_key";
import PolyLine from '@mapbox/polyline';
import socketIo from 'socket.io-client';
import DriverProfile from './NavigationDriverMap';
import icons from '../../styles';

const {width,height} = Dimensions.get("window");

const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;

const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;


class ProfileDriver extends Component {
  
  constructor(props){
      super(props);
      this.state = {
        isFindingDriver:false,
        
        error:"",
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
        directionsDriverState:false,
        driverIsOnTheWay:false,
        isWaintingDriver:false,
        driverLocation:[],
        
        //profile driver
          isLoadingProfile:false,
          driverProfile:[],
          isFindingDistanceDriver:false,
          tripId:null,
          userId:null
      };
        //Automatically Refreshing Data 
      this.intervalID;
      
      this.socket;
  }
    
     // componentDidMount
  componentDidMount(){
    this.getCurrentLocationHandler(); 
    this._profileDriver();
    // this.getDistanceDriverRider();
    
    // this.intervalID = setInterval(this._profileDriver.bind(this), 5000);
    //socket io connection
    this.socket = socketIo.connect(`${serverExp}`);
  
  }
   
  //request driver
  async _profileDriver(){
    this.setState({isLoadingProfile:true});
    try {
        await fetch(`${getUrl}profileDriver.php?tripId=${this.props.tripId}&userId=${this.props.userId}`)
        .then((response) => response.json())
        .then((res) =>{
                this.setState({ 
                    driverProfile:[...res],
                    isLoadingProfile:false,   
                });
                // call _profileDriver() again in 5 seconds
                // this.intervalID = setTimeout(this._profileDriver.bind(this), 5000);

        }).catch((error)=>{
            this.setState({
              isLoadingProfile:false
            });
            console.log(error);
        }); 
    } catch (error) {
        this.setState({
          isLoadingProfile:false
        });
        console.log(error);
    }
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
  
  getDirectionRiderDriver = async (place_id,originLatitude,originLongitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${
          originLatitude
        },${
          originLongitude
        }&destination=place_id:${place_id}&units=metric&key=${apiKey}`
      );
      
      //store json data for directions
      const json = await response.json(); 
      // console.log(json);
    
      // routeResponse = JSON.stringify(json);
        //using mapbox/PolyLine to decode the overview_polyline   
      const points = PolyLine.decode(json.routes[0].overview_polyline.points);
      
      //polyline mapbox coordinates store
      const pointCoords = points.map(point => {
        return { latitude: point[0], longitude: point[1] };
      });
      
      // // console.log(directionsData);
      // //set data into differents variables for using later
      this.setState({pointCoords});
      
      this.map.fitToCoordinates(pointCoords,
        { edgePadding:{top:20,bottom:20,left:20,right:20}}
      );
    }catch (error) {
      console.log(error)
    }
  }

  //navigation into  the driver side 
  requestDriverLocation = async () => {
    
    this.setState({isFindingDistanceDriver:true});
    let driverId = null;
    let userId = null;
    let placeiddestination = null;
    let originLatitude = null;
    let originLongitude= null;
    let tripId = null;
    let carId = null;
    
    if (this.state.driverProfile !== null) {
      this.state.driverProfile.map((trip,i) =>{
        
          placeiddestination = trip.place_id_destination;
          originLatitude = trip.departureLatitude;
          originLongitude= trip.departureLongitude;
          driverId= trip.driver_id;
          userId= trip.user_id;
          tripId = trip.trip_id;
          carId = trip.car_id
        
      })
      
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${
            originLatitude
          },${
            originLongitude
          }&destination=place_id:${placeiddestination}&units=metric&key=${apiKey}`
        );
        
        //store json data for directions
        const json = await response.json(); 
        // console.log(json);
      
        // routeResponse = JSON.stringify(json);
        //send data to the server with socket io
        const routeResponse = [json,{driverId:driverId,
          userId:userId,tripId:tripId}];
          
                  //request a taxi
        this.socket.emit("taxiRequest",routeResponse);

        const points = PolyLine.decode(json.routes[0].overview_polyline.points);
        
        const pointCoords = points.map(point => {
        return { latitude: point[0], longitude: point[1] };
        });
        
        this.setState({
          pointCoords,
          routeResponse
        });
        

        //listenning socket io server looking for rider
        this.socket.on("driverLocation", dataResponse =>{
          // console.log(dataResponse);
          
          if(dataResponse[1].driverId == driverId && dataResponse[1].userId == userId && dataResponse[1].tripId == tripId){
            // alert(JSON.stringify(dataResponse))
            this.setState({
              isFindingDistanceDriver:false,
              driverIsOnTheWay:true,
              driverLocation:dataResponse[0]
            });
            
            const pointCoords = [...this.state.pointCoords,dataResponse[0]];
            
            this.map.fitToCoordinates(pointCoords, {
              edgePadding: { top: 140, bottom: 20, left: 20, right: 20 }
            });

          }
        });
          
        //listenning for directionsDriver event   
        // this.socket.on("directionsDriver",data =>{
          
        //   if(data[1].driverId == driverId && data[1].userId == userId && data[1].tripId == tripId){
            
        //     this.getDirectionRiderDriver(data[0].geocoded_waypoints[0].place_id,originLatitude,originLongitude);
            
        //     Alert.alert("Info", "Driver found. Waiting for confirmation  "),[{text: 'Okay'}]
            
        //     this.setState({directionsDriverState:true});
        //   }

        // }); 
        
        this.map.fitToCoordinates(pointCoords, {
          edgePadding: { top: 20, bottom: 20, left: 20, right: 20 }
        });

      } catch (error) {
        console.error(error);
      } 
    }
  }
  
  confirmRequest = async () => {
    this.socket.emit("taxiRequest",this.state.routeResponse);
    this.setState({isWaintingDriver:true});
  }
  
  render() {
    
    // let marker = null;
    let marker2 = null;
    let buttomButtonFunction = null;
    let driverMarker = null;
      
    // if(this.state.focusedLocation){
    //   marker = <MapView.Marker coordinate={this.state.focusedLocation} title="My location"/>
    // }
    
    if (this.state.pointCoords.length > 1) {
      marker2 = (< Marker coordinate = { this.state.pointCoords[this.state.pointCoords.length - 1]}> 
          <Icon name = "place"
          style = {[icons.icon, { color:'#F89D29',fontSize:30 }]}/> 
      </ Marker>)
    }
    
    if (this.state.driverIsOnTheWay) {
      driverMarker = (< Marker coordinate = {this.state.driverLocation}> 
          <Image
            style={{ width: 40, height: 40 }}
            source={require("../../../../assets/contacts/carIcon.png")}
          />
      </ Marker>)
    }

    return (
      <Container>
        <StatusBar 
        backgroundColor="#11A0DC"
        barStyle="light-content"
        />
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
                {/* {marker} */}
              {marker2}
              {driverMarker}
              
            </MapView>
            
            <View style={[styles.directionContainer,{flexDirection:"row",justifyContent: "space-around"}]}>
              <DriverProfile 
                isLoading={this.state.isLoadingProfile}
                data={this.state.driverProfile}
              />
              
              {this.state.directionsDriverState == true ?
                <TouchableOpacity opacity = "0.6"
                onPress = {() => this.confirmRequest()}
                style = {{ padding: 7, backgroundColor: "#F89D29", color: "#FFFFFF", flexDirection: "row" }} >   
                <Icon name = "place"
                style = {[icons.icon, { color: '#FFFFFF' }]}/> 
                    <Text style = {{ color: "#fff", fontSize: 15 }}>Confirm </Text>
                    
                </TouchableOpacity>
                :
                <TouchableOpacity
                opacity="0.6"
                onPress={() =>this.requestDriverLocation()}
                style={{padding:7,backgroundColor:"#F89D29",color:"#FFFFFF",flexDirection:"row"}}
              >
                <Icon name="place" style={[icons.icon,{color: '#FFFFFF'}]} />
                {this.state.isFindingDistanceDriver == true ?
                  <ActivityIndicator size="small" color="#FFFFFF" />:
                  <Text style={{color:"#fff", fontSize:15}}>Find Driver</Text>
                }
                
              </TouchableOpacity>
              }
            
              <TouchableOpacity
                opacity="0.6"
                onPress={() =>Actions.viewtrip()}
                style={{padding:7,backgroundColor:"#FFFFFF",color:"#11A0DC",borderWidth:0.5,borderColor:"#11A0DC",flexDirection:"row"}}
              >
                <Icon name="dashboard" style={[icons.icon,{color: '#11A0DC'}]} />
                <Text style={{color:"#11A0DC", fontSize:15}}>Trip</Text>
              </TouchableOpacity>
            </View>
        </View>
        
    </Container>
    );
  }
}

export default ProfileDriver;

const styles = StyleSheet.create({
  
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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